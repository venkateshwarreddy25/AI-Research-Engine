'use strict';

const { v4: uuidv4 }     = require('uuid');
const { runWithContext } = require('../utils/context');

const TRACE_HEADER = 'x-request-id';

/**
 * Request Tracing Middleware
 * Generates or propagates W3C Trace Context and mounts context using AsyncLocalStorage.
 */
function traceMiddleware(req, res, next) {
  // Read request ID from header or generate a new UUID
  const traceId = req.headers[TRACE_HEADER] || req.headers['x-correlation-id'] || uuidv4();

  // Attach request ID to response header for client-side correlation
  res.setHeader(TRACE_HEADER, traceId);

  // Mount request-scoped context variables
  const context = {
    traceId,
    userId:    null, // To be populated by authentication middleware later
    ipAddress: req.ip || req.connection?.remoteAddress,
    path:      req.path,
    method:    req.method,
  };

  req.id = traceId; // Backwards compatibility for routing logs

  // Execute remaining routing steps inside the storage context
  runWithContext(context, () => {
    next();
  });
}

module.exports = traceMiddleware;
