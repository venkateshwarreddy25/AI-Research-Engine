'use strict';

const express = require('express');
const { body } = require('express-validator');

const AuthController = require('../controllers/auth.controller');
const authenticate   = require('../middleware/auth.middleware');
const validate       = require('../middleware/validate.middleware');
const { authRateLimiter } = require('../middleware/rateLimiter.middleware');

const router = express.Router();

// POST /api/v1/auth/google
router.post('/google',
  authRateLimiter,
  [body('idToken').notEmpty().withMessage('Firebase ID token required')],
  validate,
  AuthController.googleLogin
);

// POST /api/v1/auth/register
router.post('/register',
  authRateLimiter,
  [
    body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('fullName').optional().trim().isLength({ min: 2, max: 60 }).withMessage('Full name must be 2 to 60 characters'),
    body('displayName').optional().trim().isLength({ min: 2, max: 60 }).withMessage('Display name must be 2 to 60 characters'),
  ],
  validate,
  AuthController.register
);

// POST /api/v1/auth/login
router.post('/login',
  authRateLimiter,
  [
    body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  AuthController.login
);

// POST /api/v1/auth/refresh
router.post('/refresh', AuthController.refreshToken);

// POST /api/v1/auth/logout
router.post('/logout', authenticate, AuthController.logout);

// GET /api/v1/auth/me
router.get('/me', authenticate, AuthController.getMe);

// POST /api/v1/auth/forgot-password
router.post('/forgot-password',
  authRateLimiter,
  [body('email').isEmail().withMessage('Invalid email format').normalizeEmail()],
  validate,
  AuthController.forgotPassword
);

module.exports = router;
