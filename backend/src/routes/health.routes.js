'use strict';

const express = require('express');
const router  = express.Router();

/**
 * GET /api/v1/health
 * Public health check endpoint — used by Cloud Run, Docker HEALTHCHECK, and load balancers.
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status:    'ok',
    message:   'AI Government Assistant API is running',
    timestamp: new Date().toISOString(),
    version:   process.env.npm_package_version || '1.0.0',
    env:       process.env.NODE_ENV || 'development',
    uptime:    Math.floor(process.uptime()),
  });
});

/**
 * GET /api/v1/health/detailed
 * Detailed health check with external service status.
 */
router.get('/detailed', async (req, res) => {
  const checks = {};

  // Firestore check
  try {
    const { db } = require('../config/firebase.config');
    await db.collection('health').limit(1).get();
    checks.firestore = 'connected';
  } catch {
    checks.firestore = 'unavailable';
  }

  // Pinecone check (lazy)
  checks.pinecone = process.env.PINECONE_API_KEY ? 'configured' : 'unconfigured';

  // Gemini check (lazy)
  checks.gemini = process.env.GEMINI_API_KEY ? 'configured' : 'unconfigured';

  const allHealthy = !Object.values(checks).includes('unavailable');

  res.status(allHealthy ? 200 : 503).json({
    status:    allHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    checks,
    memory:    process.memoryUsage(),
    uptime:    Math.floor(process.uptime()),
  });
});

module.exports = router;
