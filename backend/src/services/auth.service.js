'use strict';

const { auth } = require('../config/firebase.config');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt.utils');
const { createUserDocument } = require('../models/user.model');
const { UnauthorizedError, ConflictError, NotFoundError } = require('../utils/ApiError');
const UserRepository = require('../repositories/user.repository');
const logger = require('../utils/logger');

const userRepo = new UserRepository();

class AuthService {

  /**
   * Authenticate via Google OAuth Firebase ID token.
   * Creates a Firestore user document on first login.
   * @param {string} idToken - Firebase ID token from client
   * @returns {Promise<{ user: Object, accessToken: string, refreshToken: string }>}
   */
  async googleLogin(idToken) {
    // 1. Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (err) {
      logger.warn('Invalid Firebase ID token received', { error: err.message });
      throw new UnauthorizedError('Invalid Firebase ID token');
    }

    const { uid, email, name: displayName, picture: photoURL } = decodedToken;

    // 2. Upsert user in Firestore via UserRepository
    let userData = await userRepo.findById(uid);

    if (!userData) {
      // New user — create document
      userData = createUserDocument(uid, {
        email, displayName, photoURL,
        provider: 'google',
        isEmailVerified: true,
      });
      await userRepo.createWithId(uid, userData);
      logger.info('New Google user created', { uid, email });
    } else {
      // Existing user — update last login & info
      userData = await userRepo.update(uid, {
        lastLoginAt: new Date().toISOString(),
        photoURL: photoURL || userData.photoURL,
        updatedAt: new Date().toISOString(),
      });
    }

    // 3. Set custom claims on Firebase token (role sync)
    await auth.setCustomUserClaims(uid, { role: userData.role });

    // 4. Issue JWT tokens
    const accessToken  = generateAccessToken({ uid, role: userData.role, email });
    const refreshToken = generateRefreshToken({ uid });

    // 5. Store refresh token hash in Firestore (for revocation)
    await userRepo.update(uid, { fcmRefreshTokenHash: this._hashToken(refreshToken) });

    const sanitisedUser = this._sanitiseUser(userData);
    return { user: sanitisedUser, accessToken, refreshToken };
  }

  /**
   * Register new user with email + password via Firebase Auth
   */
  async register({ email, password, displayName }) {
    // 1. Check if email already exists in Firestore
    const existing = await userRepo.findByEmail(email);
    if (existing) {
      throw new ConflictError('An account with this email already exists');
    }

    // 2. Create Firebase Auth user
    let firebaseUser;
    try {
      firebaseUser = await auth.createUser({ email, password, displayName });
    } catch (err) {
      if (err.code === 'auth/email-already-exists') {
        throw new ConflictError('Email already registered');
      }
      throw err;
    }

    const uid = firebaseUser.uid;

    // 3. Create Firestore user document
    const userData = createUserDocument(uid, {
      email, displayName,
      provider: 'email',
      isEmailVerified: false,
    });
    await userRepo.createWithId(uid, userData);

    // 4. Send email verification (generate link)
    try {
      const verificationLink = await auth.generateEmailVerificationLink(email);
      logger.info('New user registered, verification link generated', { uid, email, verificationLink });
    } catch (err) {
      logger.error('Failed to generate email verification link', { error: err.message });
    }

    // 5. Issue tokens
    const accessToken  = generateAccessToken({ uid, role: userData.role, email });
    const refreshToken = generateRefreshToken({ uid });

    // Store refresh token hash in Firestore (for revocation)
    await userRepo.update(uid, { fcmRefreshTokenHash: this._hashToken(refreshToken) });

    return { user: this._sanitiseUser(userData), accessToken, refreshToken };
  }

  /**
   * Login with email + password via Firebase REST API or Mock Fallback
   */
  async login({ email, password }) {
    const useMock = process.env.USE_MOCK_FIREBASE === 'true' || process.env.FIREBASE_WEB_API_KEY === 'mock-key';

    let uid;
    let userData;

    if (useMock) {
      // Offline/Mock mode: Lookup user by email in memory database
      userData = await userRepo.findByEmail(email);
      if (!userData) {
        uid = 'mock-uid-' + Math.random().toString(36).substring(7);
        userData = createUserDocument(uid, {
          email,
          displayName: email.split('@')[0],
          provider: 'email',
          isEmailVerified: true,
        });
        await userRepo.createWithId(uid, userData);
      }
      uid = userData.id || userData.uid;
    } else {
      const apiKey = process.env.FIREBASE_WEB_API_KEY;
      if (!apiKey) {
        throw new Error('FIREBASE_WEB_API_KEY is not defined in backend environment.');
      }

      try {
        const res = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, returnSecureToken: true }),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          const code = data?.error?.message;
          if (code === 'INVALID_PASSWORD' || code === 'EMAIL_NOT_FOUND' || code === 'INVALID_LOGIN_CREDENTIALS') {
            throw new UnauthorizedError('Invalid email or password');
          }
          if (code === 'USER_DISABLED') {
            throw new UnauthorizedError('Your account has been disabled');
          }
          throw new UnauthorizedError(data?.error?.message || 'Authentication failed');
        }
        uid = data.localId;
        userData = await userRepo.findById(uid);
      } catch (err) {
        if (err instanceof UnauthorizedError) throw err;
        throw err;
      }
    }

    if (!userData) {
      throw new NotFoundError('User');
    }

    if (!userData.isActive) {
      throw new UnauthorizedError('Account has been deactivated');
    }

    // Update last login
    const updatedUser = await userRepo.update(uid, {
      lastLoginAt: new Date().toISOString(),
      updatedAt:   new Date().toISOString(),
    });

    const accessToken  = generateAccessToken({ uid, role: updatedUser.role || 'citizen', email });
    const refreshToken = generateRefreshToken({ uid });

    // Store refresh token hash in Firestore (for revocation)
    await userRepo.update(uid, { fcmRefreshTokenHash: this._hashToken(refreshToken) });

    return { user: this._sanitiseUser(updatedUser), accessToken, refreshToken };
  }

  /**
   * Issue new access token from valid refresh token
   */
  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token required');
    }

    const decoded = verifyRefreshToken(refreshToken);
    const userData = await userRepo.findById(decoded.uid);

    if (!userData || !userData.isActive) {
      throw new UnauthorizedError('User not found or deactivated');
    }

    // Verify refresh token hash matches what is stored in DB
    const expectedHash = this._hashToken(refreshToken);
    if (userData.fcmRefreshTokenHash !== expectedHash) {
      throw new UnauthorizedError('Refresh token has been revoked');
    }

    const { role, email } = userData;
    const accessToken = generateAccessToken({ uid: decoded.uid, role, email });

    return { accessToken };
  }

  /**
   * Logout — clear refresh token reference
   */
  async logout(uid) {
    await userRepo.update(uid, {
      fcmRefreshTokenHash: null,
      updatedAt: new Date().toISOString(),
    });
    logger.info('User logged out', { uid });
  }

  /**
   * Get full user profile
   */
  async getUserProfile(uid) {
    const userData = await userRepo.findByIdOrFail(uid);
    return this._sanitiseUser(userData);
  }

  /**
   * Trigger Firebase password reset email
   */
  async sendPasswordResetEmail(email) {
    try {
      const resetLink = await auth.generatePasswordResetLink(email);
      logger.info('Password reset link generated', { email, resetLink });
    } catch (err) {
      // Silently ignore — don't reveal if email exists (security)
      logger.warn('Password reset requested for non-existent email', { email });
    }
  }

  /** Remove sensitive fields from user object */
  _sanitiseUser(userData) {
    const { fcmRefreshTokenHash, ...safe } = userData;
    return safe;
  }

  /** Simple token hash for storage comparison */
  _hashToken(token) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}

module.exports = AuthService;
