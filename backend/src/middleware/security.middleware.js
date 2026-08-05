'use strict';

const helmet = require('helmet');
const crypto = require('crypto');

/**
 * Generate a cryptographically secure nonce for CSP
 * A unique nonce per request prevents injected inline scripts from executing
 */
const generateNonce = () => crypto.randomBytes(16).toString('base64');

/**
 * Advanced Helmet security middleware with strict CSP.
 * Attach this BEFORE routes in app.js.
 */
const securityMiddleware = [

  // ── Nonce generator — must be first ─────────────────────────────────────
  (req, res, next) => {
    res.locals.cspNonce = generateNonce();
    next();
  },

  // ── Helmet suite ─────────────────────────────────────────────────────────
  helmet({
    // Strict Transport Security (HSTS) — 2 years
    strictTransportSecurity: {
      maxAge:            63_072_000,
      includeSubDomains: true,
      preload:           true,
    },

    // Content Security Policy
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc:     ["'none'"],
        scriptSrc:      ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
        styleSrc:       ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc:        ["'self'", 'https://fonts.gstatic.com'],
        imgSrc:         ["'self'", 'data:', 'https://storage.googleapis.com', 'https://lh3.googleusercontent.com'],
        connectSrc:     [
          "'self'",
          'https://*.googleapis.com',
          'https://*.firebaseio.com',
          'https://identitytoolkit.googleapis.com',
          'https://securetoken.googleapis.com',
          ...(process.env.NODE_ENV === 'development' ? ['ws://localhost:*'] : []),
        ],
        mediaSrc:       ["'self'", 'blob:'],
        objectSrc:      ["'none'"],
        frameSrc:       ["'none'"],
        formAction:     ["'self'"],
        baseUri:        ["'self'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
        reportUri:      '/api/v1/security/csp-report',
      },
    },

    // Cross-Origin Resource Policy
    crossOriginResourcePolicy:  { policy: 'same-site' },
    crossOriginOpenerPolicy:    { policy: 'same-origin' },
    crossOriginEmbedderPolicy:  false, // Allow Firebase resources

    // Frame options — prevent clickjacking
    frameguard: { action: 'deny' },

    // Referrer policy
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },

    // Prevent MIME type sniffing
    noSniff: true,

    // Disable X-Powered-By
    hidePoweredBy: true,

    // DNS prefetch control
    dnsPrefetchControl: { allow: false },

    // Permissions Policy
    permissionsPolicy: {
      features: {
        camera:         [],
        microphone:     ['self'],  // Allow for voice features
        geolocation:    ['self'],  // Allow for nearby offices
        fullscreen:     ['self'],
        payment:        [],
        usb:            [],
        bluetooth:      [],
        gyroscope:      [],
        magnetometer:   [],
      },
    },
  }),

  // ── CSP Violation Report endpoint ──────────────────────────────────────
  (req, res, next) => {
    if (req.path === '/api/v1/security/csp-report' && req.method === 'POST') {
      const logger = require('../utils/logger');
      logger.warn('CSP Violation', { report: req.body['csp-report'], ip: req.ip });
      return res.status(204).send();
    }
    next();
  },
];

module.exports = securityMiddleware;
