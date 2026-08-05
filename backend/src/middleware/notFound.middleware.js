'use strict';

const { NotFoundError } = require('../utils/ApiError');

/**
 * Express middleware for handling unmapped routes (404).
 */
function notFound(req, res, next) {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl}`));
}

module.exports = notFound;
