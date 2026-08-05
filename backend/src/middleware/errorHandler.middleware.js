'use strict';

const logger = require('../utils/logger');
const { ApiError } = require('../utils/ApiError');

/**
 * Global centralized error handling middleware.
 * Formats errors and returns standardized error response envelope.
 */
function errorHandler(err, req, res, next) {
  // If headers already sent, delegate to standard express handler
  if (res.headersSent) {
    return next(err);
  }

  const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

  let statusCode = 500;
  let message    = 'Internal server error';
  let errorCode  = 'INTERNAL_SERVER_ERROR';
  let errors     = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message    = err.message;
    errorCode  = err.errorCode;
    errors     = err.errors;
  } else if (err.name === 'ValidationError') {
    // Other third party validations if any
    statusCode = 422;
    message    = 'Validation failed';
    errorCode  = 'VALIDATION_ERROR';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message    = err.message || 'Authentication required';
    errorCode  = 'UNAUTHORIZED';
  }

  const responseBody = {
    success: false,
    message,
    errorCode,
  };

  if (errors.length > 0) {
    responseBody.errors = errors;
  }

  if (isDev) {
    responseBody.stack = err.stack;
  }

  // Log error using structured logging
  if (statusCode >= 500) {
    logger.error('Unhandled System Error', {
      message: err.message,
      stack:   err.stack,
      path:    req.originalUrl,
      method:  req.method,
      traceId: req.id,
    });
  } else {
    logger.warn('API Operational Error', {
      statusCode,
      message,
      errorCode,
      path:    req.originalUrl,
      traceId: req.id,
    });
  }

  res.status(statusCode).json(responseBody);
}

module.exports = errorHandler;
