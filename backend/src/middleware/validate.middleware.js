'use strict';

const { validationResult } = require('express-validator');
const { ValidationError }  = require('../utils/ApiError');

/**
 * Reads express-validator results from req and throws ValidationError if any.
 * Must be used after validation rule chains in route definitions.
 */
const validate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array().map(err => ({
      field:   err.path || err.param,
      message: err.msg,
      value:   err.value,
    }));
    throw new ValidationError(errors);
  }
  next();
};

module.exports = validate;
