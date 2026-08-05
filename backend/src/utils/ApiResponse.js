'use strict';

/**
 * Standardised API response wrapper.
 * All controllers use this for consistent response shape.
 *
 * Success shape:
 * { success: true, message, data, meta }
 *
 * Error shape (handled by errorHandler middleware):
 * { success: false, message, errorCode, errors }
 */
class ApiResponse {
  /**
   * Send a success response
   * @param {import('express').Response} res
   * @param {number} statusCode
   * @param {string} message
   * @param {*}      data
   * @param {Object} [meta] - Pagination or extra metadata
   */
  static success(res, statusCode = 200, message = 'Success', data = null, meta = null) {
    const body = { success: true, message, data };
    if (meta) body.meta = meta;
    return res.status(statusCode).json(body);
  }

  static ok(res, message, data, meta)      { return ApiResponse.success(res, 200, message, data, meta); }
  static created(res, message, data)        { return ApiResponse.success(res, 201, message, data); }
  static noContent(res)                     { return res.status(204).send(); }
}

module.exports = ApiResponse;
