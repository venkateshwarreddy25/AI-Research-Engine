'use strict';

// Load environment variables at the absolute entrypoint
require('dotenv').config();

const http = require('http');
const app = require('./app');
const logger = require('./utils/logger');
const { validateEnv } = require('./config/env.config');

// Validate all required environment variables at startup
validateEnv();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);

// ── Start server ────────────────────────────────────────────────────────────
server.listen(PORT, HOST, () => {
  logger.info(`🚀 AI Government Assistant API running`, {
    port: PORT,
    env: process.env.NODE_ENV,
    pid: process.pid,
  });
});

// ── Graceful shutdown ────────────────────────────────────────────────────────
const shutdown = (signal) => {
  logger.info(`${signal} received — starting graceful shutdown`);
  server.close((err) => {
    if (err) {
      logger.error('Error during server close', { error: err.message });
      process.exit(1);
    }
    logger.info('HTTP server closed. Exiting.');
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

// ── Unhandled rejection / exception guards ───────────────────────────────────
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection', { reason: String(reason) });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception — shutting down', { error: err.message, stack: err.stack });
  process.exit(1);
});

module.exports = server;
