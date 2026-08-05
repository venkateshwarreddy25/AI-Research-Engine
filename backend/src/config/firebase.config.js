'use strict';

const admin = require('firebase-admin');
const logger = require('../utils/logger');

let db, auth, storage, FieldValue, Timestamp;

// ── In-Memory transparent mock database fallback for local dev offline testing ──
class MockFirestore {
  constructor() {
    this.store = {};
  }
  collection(name) {
    if (!this.store[name]) this.store[name] = {};
    return new MockCollection(this.store[name], name);
  }
  settings() {}
  runTransaction(fn) {
    return fn(this);
  }
}

class MockQuery {
  constructor(store, conditions = []) {
    this.store = store;
    this.conditions = conditions;
  }
  where(field, op, value) {
    return new MockQuery(this.store, [...this.conditions, { field, op, value }]);
  }
  orderBy() { return this; }
  limit() { return this; }
  offset() { return this; }
  startAfter() { return this; }
  count() {
    return {
      get: async () => {
        const snap = await this.get();
        return { data: () => ({ count: snap.docs.length }) };
      }
    };
  }
  async get() {
    let docs = Object.keys(this.store).map(id => new MockDocSnapshot(id, this.store[id]));
    for (const cond of this.conditions) {
      docs = docs.filter(docSnap => {
        const val = docSnap.data()?.[cond.field];
        if (cond.op === '==') return val === cond.value;
        if (cond.op === 'array-contains') return Array.isArray(val) && val.includes(cond.value);
        return true;
      });
    }
    return new MockQuerySnapshot(docs);
  }
}

class MockCollection {
  constructor(store, name) {
    this.store = store;
    this.name = name;
  }
  doc(id) {
    const docId = id || Math.random().toString(36).substring(7);
    return new MockDoc(this.store, docId);
  }
  where(field, op, value) {
    return new MockQuery(this.store, [{ field, op, value }]);
  }
  orderBy() { return new MockQuery(this.store); }
  limit() { return new MockQuery(this.store); }
  offset() { return new MockQuery(this.store); }
  startAfter() { return new MockQuery(this.store); }
  count() {
    return {
      get: async () => {
        const docs = Object.keys(this.store);
        return { data: () => ({ count: docs.length }) };
      }
    };
  }
  async get() {
    const docs = Object.keys(this.store).map(id => new MockDocSnapshot(id, this.store[id]));
    return new MockQuerySnapshot(docs);
  }
  async add(data) {
    const id = Math.random().toString(36).substring(7);
    this.store[id] = { ...data, id };
    return new MockDoc(this.store, id);
  }
}

class MockDoc {
  constructor(store, id) {
    this.store = store;
    this.id = id;
  }
  async get() {
    const data = this.store[this.id];
    return new MockDocSnapshot(this.id, data);
  }
  async set(data) {
    this.store[this.id] = { ...data, id: this.id };
  }
  async update(data) {
    this.store[this.id] = { ...(this.store[this.id] || {}), ...data, id: this.id };
  }
  async delete() {
    delete this.store[this.id];
  }
}

class MockDocSnapshot {
  constructor(id, data) {
    this.id = id;
    this._data = data ? { id, ...data } : undefined;
    this.exists = data !== undefined;
  }
  data() { return this._data; }
}

class MockQuerySnapshot {
  constructor(docs) {
    this.docs = docs;
    this.empty = docs.length === 0;
  }
}

class MockAuth {
  async verifyIdToken(token) {
    return { uid: 'mock-uid-123', email: 'Ramesh.Kumar@govassist.ai', name: 'Ramesh Kumar' };
  }
  async createUser(data) {
    return { uid: 'mock-uid-' + Math.random().toString(36).substring(7), ...data };
  }
  async generateEmailVerificationLink(email) {
    return 'http://localhost:5000/verify-email?email=' + email;
  }
  async generatePasswordResetLink(email) {
    return 'http://localhost:5000/reset-password?email=' + email;
  }
  async setCustomUserClaims() {}
}

class MockStorage {
  bucket() {
    return {
      file: (path) => ({
        save: async () => {},
        getSignedUrl: async () => ['http://localhost:5000/mock-file.pdf']
      })
    };
  }
}

const mockFieldValue = {
  increment: (n) => n,
  serverTimestamp: () => new Date().toISOString(),
};

const mockTimestamp = {
  now: () => ({ toMillis: () => Date.now(), toDate: () => new Date() }),
  fromDate: (date) => ({ toMillis: () => date.getTime(), toDate: () => date }),
};

// ── Firebase Init ───────────────────────────────────────────────────────────
const useMock = process.env.USE_MOCK_FIREBASE === 'true';

if (useMock) {
  logger.info('Firebase mock activated: Running with in-memory database');
  db = new MockFirestore();
  auth = new MockAuth();
  storage = new MockStorage();
  FieldValue = mockFieldValue;
  Timestamp = mockTimestamp;
} else if (!admin.apps.length) {
  try {
    if (process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST) {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'test-project',
      });
      logger.info('Firebase Admin SDK initialised in EMULATOR mode');
    } else {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId:   process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey:  (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
      logger.info('Firebase Admin SDK initialised in PRODUCTION mode');
    }
    db = admin.firestore();
    auth = admin.auth();
    storage = admin.storage();
    FieldValue = admin.firestore.FieldValue;
    Timestamp = admin.firestore.Timestamp;
    db.settings({ ignoreUndefinedProperties: true });
  } catch (err) {
    logger.error('Firebase Admin SDK initialisation failed — falling back to mock mode', { error: err.message });
    db = new MockFirestore();
    auth = new MockAuth();
    storage = new MockStorage();
    FieldValue = mockFieldValue;
    Timestamp = mockTimestamp;
  }
} else {
  db = admin.firestore();
  auth = admin.auth();
  storage = admin.storage();
  FieldValue = admin.firestore.FieldValue;
  Timestamp = admin.firestore.Timestamp;
}

module.exports = { db, auth, storage, FieldValue, Timestamp, admin };
