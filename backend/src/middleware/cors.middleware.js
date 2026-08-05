'use strict';

const cors   = require('cors');
const logger = require('../utils/logger');

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

// Expanded trusted patterns (regex for subdomains)
const TRUSTED_PATTERNS = [
  /^https:\/\/govassist\.ai$/,
  /^https:\/\/[\w-]+\.govassist\.ai$/,
  /^http:\/\/localhost:(3000|5173|8080|5000)$/, // Added 5000 for local proxy check
];

function isOriginAllowed(origin) {
  if (!origin) return true;                                           // Same-origin / server-to-server
  if (ALLOWED_ORIGINS.includes(origin)) return true;                 // Exact match
  return TRUSTED_PATTERNS.some(pattern => pattern.test(origin));     // Pattern match
}

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS blocked', { origin });
      callback(new Error(`CORS policy violation: origin '${origin}' is not allowed`));
    }
  },
  credentials:    true,
  methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-Lang', 'X-CSRF-Token'],
  exposedHeaders: ['X-Request-ID', 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'Retry-After'],
  maxAge:         86_400,   // Preflight cache: 24 hours
  optionsSuccessStatus: 204,
};

module.exports = cors(corsOptions);
