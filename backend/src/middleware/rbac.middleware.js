'use strict';

const { ForbiddenError } = require('../utils/ApiError');

/**
 * Role-Based Access Control middleware factory.
 * Usage: authorize('admin', 'super_admin')
 *
 * @param {...string} allowedRoles - Roles permitted to access this route
 * @returns {Function} Express middleware
 */
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    throw new ForbiddenError('Authentication required before authorization');
  }

  if (!allowedRoles.includes(req.user.role)) {
    throw new ForbiddenError(
      `Role '${req.user.role}' is not authorized. Required: [${allowedRoles.join(', ')}]`
    );
  }

  next();
};

module.exports = authorize;
