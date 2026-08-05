'use strict';

const BaseRepository = require('./base.repository');
const { ApiError } = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * UserRepository — handles database access for users collection
 */
class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  /**
   * Find a user by their email address
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    try {
      const normalizedEmail = String(email).toLowerCase().trim();
      const snapshot = await this.collection
        .where('email', '==', normalizedEmail)
        .limit(1)
        .get();

      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error('[UserRepository] findByEmail error', { email, error: error.message });
      throw new ApiError(500, 'Database read error');
    }
  }

  /**
   * Find users by role
   * @param {string} role
   * @returns {Promise<Object[]>}
   */
  async findByRole(role) {
    try {
      const snapshot = await this.collection
        .where('role', '==', role)
        .get();

      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      logger.error('[UserRepository] findByRole error', { role, error: error.message });
      throw new ApiError(500, 'Database query error');
    }
  }

  /**
   * Update a user's FCM push notification token
   * @param {string} uid
   * @param {string} token
   * @returns {Promise<Object>}
   */
  async updateFCMToken(uid, token) {
    return this.update(uid, { fcmToken: token });
  }

  /**
   * Get active users count and details
   * @returns {Promise<Object[]>}
   */
  async getActiveUsers() {
    try {
      const snapshot = await this.collection
        .where('isActive', '==', true)
        .get();

      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      logger.error('[UserRepository] getActiveUsers error', { error: error.message });
      throw new ApiError(500, 'Database query error');
    }
  }
}

module.exports = UserRepository;
