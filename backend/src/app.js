'use strict';

const express      = require('express');
const compression  = require('compression');
const cookieParser = require('cookie-parser');
const morgan       = require('morgan');

const logger                   = require('./utils/logger');
const traceMiddleware          = require('./middleware/trace.middleware');
const apmMiddleware            = require('./middleware/apm.middleware');
const errorHandler             = require('./middleware/errorHandler.middleware');
const notFound                 = require('./middleware/notFound.middleware');
const corsMiddleware           = require('./middleware/cors.middleware');
const securityMiddleware       = require('./middleware/security.middleware');
const { sanitiseMiddleware }   = require('./middleware/sanitise.middleware');
const { globalRateLimiter }    = require('./middleware/rateLimiter.middleware');
const routes                   = require('./routes/index');

const app = express();

// ── Trust proxy (Nginx / Cloud Run / Render) ─────────────────────────────────
app.set('trust proxy', 1);

// ── 1. Distributed Tracing — must be first ───────────────────────────────────
app.use(traceMiddleware);

// ── 2. APM / Performance Logging ─────────────────────────────────────────────
app.use(apmMiddleware);

// ── 3. Security Headers (Helmet + CSP nonce) ─────────────────────────────────
app.use(securityMiddleware);

// ── 4. CORS ──────────────────────────────────────────────────────────────────
app.use(corsMiddleware);

// ── 5. HTTP request logging (Morgan → Winston) ────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: logger.morganStream || { write: (m) => logger.http(m.trim()) } }));
}

// ── 6. Body parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// ── 7. Compression ────────────────────────────────────────────────────────────
app.use(compression());

// ── 8. Input Sanitisation (XSS / NoSQL injection / HPP) ─────────────────────
app.use(sanitiseMiddleware);

// ── 9. Global rate limiter ────────────────────────────────────────────────────
app.use(globalRateLimiter);

// ── 10. API Routes ────────────────────────────────────────────────────────────
app.use('/api/v1', routes);

// ── 11. 404 handler ───────────────────────────────────────────────────────────
app.use(notFound);

// ── 12. Global error handler (must be last) ───────────────────────────────────
app.use(errorHandler);

module.exports = app;
