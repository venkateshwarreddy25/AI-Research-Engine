'use strict';

const rateLimit = require('express-rate-limit');
const { RateLimitError } = require('../utils/ApiError');

const handler = (req, res, next) => next(new RateLimitError());

/**
 * Global rate limiter: 200 requests per 15 minutes per IP
 */
const globalRateLimiter = rateLimit({
  windowMs:  15 * 60 * 1000,
  max:       200,
  standardHeaders: true,
  legacyHeaders:   false,
  handler,
});

/**
 * Auth rate limiter: 10 requests per 15 minutes per IP (brute force protection)
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  handler,
  skipSuccessfulRequests: true, // Only count failed attempts
});

/**
 * AI chatbot rate limiter: 30 requests per minute per user
 */
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max:      30,
  keyGenerator: (req) => req.user?.uid || req.ip,
  handler,
});

/**
 * File upload rate limiter: 20 uploads per hour per user
 */
const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      20,
  keyGenerator: (req) => req.user?.uid || req.ip,
  handler,
});

module.exports = { globalRateLimiter, authRateLimiter, aiRateLimiter, uploadRateLimiter };
