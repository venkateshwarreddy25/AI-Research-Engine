'use strict';

const { db } = require('../config/firebase.config');
const { ApiError } = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Base Repository — provides generic Firestore CRUD + pagination.
 * All collection-specific repositories extend this class.
 */
class BaseRepository {
  /**
   * @param {string} collectionName - Firestore collection name
   */
  constructor(collectionName) {
    this.collection = db.collection(collectionName);
    this.collectionName = collectionName;
  }

  /**
   * Find a single document by its ID
   * @param {string} id - Document ID
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error(`[${this.collectionName}] findById error`, { id, error: error.message });
      throw new ApiError(500, 'Database read error');
    }
  }

  /**
   * Find a single document by ID or throw 404
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async findByIdOrFail(id) {
    const doc = await this.findById(id);
    if (!doc) {
      throw new ApiError(404, `${this.collectionName} not found`);
    }
    return doc;
  }

  /**
   * Create a new document (auto-generate ID)
   * @param {Object} data - Document data
   * @returns {Promise<Object>} Created document with ID
   */
  async create(data) {
    try {
      const now = new Date().toISOString();
      const docData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      const ref = await this.collection.add(docData);
      logger.info(`[${this.collectionName}] Document created`, { id: ref.id });
      return { id: ref.id, ...docData };
    } catch (error) {
      logger.error(`[${this.collectionName}] create error`, { error: error.message });
      throw new ApiError(500, 'Database write error');
    }
  }

  /**
   * Create a document with a specific ID
   * @param {string} id - Document ID
   * @param {Object} data - Document data
   * @returns {Promise<Object>}
   */
  async createWithId(id, data) {
    try {
      const now = new Date().toISOString();
      const docData = { ...data, createdAt: now, updatedAt: now };
      await this.collection.doc(id).set(docData);
      logger.info(`[${this.collectionName}] Document created with ID`, { id });
      return { id, ...docData };
    } catch (error) {
      logger.error(`[${this.collectionName}] createWithId error`, { id, error: error.message });
      throw new ApiError(500, 'Database write error');
    }
  }

  /**
   * Update a document by ID (merge — only specified fields)
   * @param {string} id - Document ID
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    try {
      const updateData = { ...data, updatedAt: new Date().toISOString() };
      await this.collection.doc(id).update(updateData);
      logger.info(`[${this.collectionName}] Document updated`, { id });
      return this.findById(id);
    } catch (error) {
      if (error.code === 5) { // NOT_FOUND
        throw new ApiError(404, `${this.collectionName} not found`);
      }
      logger.error(`[${this.collectionName}] update error`, { id, error: error.message });
      throw new ApiError(500, 'Database update error');
    }
  }

  /**
   * Delete a document by ID (hard delete)
   * @param {string} id - Document ID
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      await this.collection.doc(id).delete();
      logger.info(`[${this.collectionName}] Document deleted`, { id });
      return true;
    } catch (error) {
      logger.error(`[${this.collectionName}] delete error`, { id, error: error.message });
      throw new ApiError(500, 'Database delete error');
    }
  }

  /**
   * Soft delete — sets isDeleted = true
   * @param {string} id
   */
  async softDelete(id) {
    return this.update(id, { isDeleted: true, deletedAt: new Date().toISOString() });
  }

  /**
   * Paginated query with optional filters and ordering
   * @param {Object} options
   * @param {Object[]} options.filters       - [{ field, operator, value }]
   * @param {string}   options.orderBy       - Field to order by
   * @param {string}   options.orderDir      - 'asc' | 'desc'
   * @param {number}   options.page          - Page number (1-based)
   * @param {number}   options.limit         - Items per page (max 100)
   * @param {string}   options.startAfter    - Last document ID for cursor pagination
   * @returns {Promise<{data: Object[], total: number, page: number, totalPages: number}>}
   */
  async findAll({
    filters = [],
    orderBy = 'createdAt',
    orderDir = 'desc',
    page = 1,
    limit = 20,
    startAfter = null,
  } = {}) {
    try {
      const safeLimit = Math.min(limit, 100);
      let query = this.collection;

      // Apply filters
      filters.forEach(({ field, operator, value }) => {
        query = query.where(field, operator, value);
      });

      // Apply ordering
      query = query.orderBy(orderBy, orderDir);

      // Get total count
      const countSnapshot = await query.count().get();
      const total = countSnapshot.data().count;

      // Apply cursor pagination if provided
      if (startAfter) {
        const startDoc = await this.collection.doc(startAfter).get();
        if (startDoc.exists) {
          query = query.startAfter(startDoc);
        }
      } else {
        // Offset-based pagination
        const offset = (page - 1) * safeLimit;
        query = query.offset(offset);
      }

      query = query.limit(safeLimit);
      const snapshot = await query.get();

      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return {
        data,
        total,
        page,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
        hasNextPage: page * safeLimit < total,
        hasPrevPage: page > 1,
      };
    } catch (error) {
      logger.error(`[${this.collectionName}] findAll error`, { error: error.message });
      throw new ApiError(500, 'Database query error');
    }
  }

  /**
   * Execute a transaction
   * @param {Function} transactionFn - Receives Firestore transaction object
   */
  async runTransaction(transactionFn) {
    return db.runTransaction(transactionFn);
  }

  /**
   * Increment a numeric field atomically
   * @param {string} id
   * @param {string} field
   * @param {number} amount
   */
  async increment(id, field, amount = 1) {
    const { FieldValue } = require('firebase-admin/firestore');
    await this.collection.doc(id).update({
      [field]: FieldValue.increment(amount),
      updatedAt: new Date().toISOString(),
    });
  }
}

module.exports = BaseRepository;
