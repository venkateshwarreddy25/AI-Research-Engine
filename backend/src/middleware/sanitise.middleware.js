'use strict';

const xss          = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp          = require('hpp');

/**
 * Input Sanitisation Pipeline
 *
 * 1. xss-clean    — strips/encodes HTML tags and JS from user input
 * 2. mongoSanitize — removes MongoDB operators ($, .) from request body/query
 * 3. hpp          — prevents HTTP parameter pollution (duplicate params attack)
 */
const sanitiseMiddleware = [
  // XSS protection — encodes dangerous HTML characters in req.body, req.query, req.params
  xss(),

  // NoSQL injection prevention — strips Firestore/MongoDB query operators
  mongoSanitize({
    replaceWith: '_',          // Replace $ with _ instead of deleting
    onSanitize: ({ req, key }) => {
      const logger = require('../utils/logger');
      logger.warn('NoSQL injection attempt sanitised', {
        key,
        path:   req.path,
        ip:     req.ip,
        userId: req.user?.uid,
      });
    },
  }),

  // HTTP Parameter Pollution — prevents arrays where scalars are expected
  hpp({
    whitelist: [
      'schemeIds', 'documentIds', 'tags', 'targetStates',  // Legitimate array params
    ],
  }),
];

/**
 * Deep sanitise object — remove any keys starting with $ or containing .
 * Used for Firestore writes to prevent operator injection
 * @param {Object} obj
 * @returns {Object}
 */
function deepSanitiseForFirestore(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  const sanitised = {};
  for (const [key, value] of Object.entries(obj)) {
    // Reject keys that could be Firestore operators
    if (key.startsWith('$') || key.includes('.') || key.includes('/')) {
      continue;
    }
    sanitised[key] = Array.isArray(value)
      ? value.map(item => deepSanitiseForFirestore(item))
      : typeof value === 'object'
        ? deepSanitiseForFirestore(value)
        : value;
  }
  return sanitised;
}

module.exports = { sanitiseMiddleware, deepSanitiseForFirestore };
