'use strict';

const { AsyncLocalStorage } = require('async_hooks');

// Global storage container for correlation IDs and request context
const contextStore = new AsyncLocalStorage();

/**
 * Run function within tracing context store
 * @param {Object} context - Context object e.g. { traceId: '...' }
 * @param {Function} fn
 */
function runWithContext(context, fn) {
  return contextStore.run(context, fn);
}

/**
 * Retrieve trace identifier for the active request path
 * @returns {string|null} Trace ID
 */
function getTraceId() {
  const store = contextStore.getStore();
  return store ? store.traceId : null;
}

/**
 * Retrieve current user ID from request context
 * @returns {string|null} User ID
 */
function getUserId() {
  const store = contextStore.getStore();
  return store ? store.userId : null;
}

module.exports = { runWithContext, getTraceId, getUserId, contextStore };
