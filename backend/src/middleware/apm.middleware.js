'use strict';

const logger = require('../utils/logger');

/**
 * Performance Profiling and APM middleware.
 * Captures route duration, status code patterns, and alerts on slow database/network interactions.
 */
function apmMiddleware(req, res, next) {
  const startHrTime = process.hrtime();
  const startMemory = process.memoryUsage().heapUsed;

  // Log incoming request details in debug environment
  logger.debug(`Incoming ${req.method} ${req.originalUrl}`);

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const durationMs    = (elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6).toFixed(2);
    const endMemory     = process.memoryUsage().heapUsed;
    const memoryDiffKb  = ((endMemory - startMemory) / 1024).toFixed(2);

    const logPayload = {
      method:       req.method,
      url:          req.originalUrl,
      statusCode:   res.statusCode,
      durationMs:   parseFloat(durationMs),
      memoryDeltaKb: parseFloat(memoryDiffKb),
    };

    // Logging behavior by duration and status code thresholds
    if (res.statusCode >= 500) {
      logger.error(`API Transaction Failed: ${req.method} ${req.originalUrl}`, logPayload);
    } else if (durationMs > 2000) {
      // SLOW TRANSACTION WARNING (Duration > 2 seconds)
      logger.warn(`API Transaction Slow: ${req.method} ${req.originalUrl} (${durationMs}ms)`, logPayload);
    } else {
      logger.info(`API Transaction: ${req.method} ${req.originalUrl} (${durationMs}ms)`, logPayload);
    }
  });

  next();
}

module.exports = apmMiddleware;
