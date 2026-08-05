'use strict';

const traceMiddleware = require('./trace.middleware');

// Proxy/wrapper for requestId.middleware.js
module.exports = traceMiddleware;
