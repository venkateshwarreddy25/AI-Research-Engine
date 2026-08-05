'use strict';

const jwt   = require('jsonwebtoken');
const { UnauthorizedError } = require('./ApiError');

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET || 'local-development-secret-key-32-chars-long!';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'local-development-refresh-secret-key-32-chars-long!';
const ACCESS_EXPIRES  = process.env.JWT_ACCESS_EXPIRES_IN  || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Generate a JWT access token
 * @param {{ uid: string, role: string, email: string }} payload
 * @returns {string}
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES,
    issuer: 'ai-gov-assistant',
    audience: 'ai-gov-assistant-client',
  });
}

/**
 * Generate a JWT refresh token
 * @param {{ uid: string }} payload
 * @returns {string}
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES,
    issuer: 'ai-gov-assistant',
  });
}

/**
 * Verify a JWT access token
 * @param {string} token
 * @returns {Object} Decoded payload
 */
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_SECRET, {
      issuer: 'ai-gov-assistant',
      audience: 'ai-gov-assistant-client',
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Access token expired');
    }
    throw new UnauthorizedError('Invalid access token');
  }
}

/**
 * Verify a JWT refresh token
 * @param {string} token
 * @returns {Object} Decoded payload
 */
function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_SECRET, {
      issuer: 'ai-gov-assistant',
    });
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
