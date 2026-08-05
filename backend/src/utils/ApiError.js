'use strict';

/**
 * Base API error class with HTTP status code and error code.
 * Extend for specific domain errors.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message    - Human-readable error message
   * @param {string} [errorCode] - Machine-readable error code
   * @param {*[]}    [errors]   - Validation error details
   */
  constructor(statusCode, message, errorCode = 'API_ERROR', errors = []) {
    super(message);
    this.name       = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode  = errorCode;
    this.errors     = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ApiError {
  constructor(message = 'Bad request', errors = []) {
    super(400, message, 'BAD_REQUEST', errors);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'Authentication required') {
    super(401, message, 'UNAUTHORIZED');
  }
}

class ForbiddenError extends ApiError {
  constructor(message = 'Insufficient permissions') {
    super(403, message, 'FORBIDDEN');
  }
}

class NotFoundError extends ApiError {
  constructor(resource = 'Resource') {
    super(404, `${resource} not found`, 'NOT_FOUND');
  }
}

class ConflictError extends ApiError {
  constructor(message = 'Resource already exists') {
    super(409, message, 'CONFLICT');
  }
}

class ValidationError extends ApiError {
  constructor(errors = []) {
    super(422, 'Validation failed', 'VALIDATION_ERROR', errors);
  }
}

class RateLimitError extends ApiError {
  constructor() {
    super(429, 'Too many requests. Please try again later.', 'RATE_LIMITED');
  }
}

class InternalServerError extends ApiError {
  constructor(message = 'Internal server error') {
    super(500, message, 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  RateLimitError,
  InternalServerError,
};
