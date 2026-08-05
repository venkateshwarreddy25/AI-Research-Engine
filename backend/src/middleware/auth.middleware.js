'use strict';

const { verifyAccessToken } = require('../utils/jwt.utils');
const { UnauthorizedError } = require('../utils/ApiError');
const { db }                = require('../config/firebase.config');
const asyncHandler          = require('../utils/asyncHandler');

/**
 * authenticate — verifies JWT from Authorization header or httpOnly cookie.
 * Attaches decoded user to req.user.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  let token = null;

  // 1. Try Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Fallback to httpOnly cookie
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new UnauthorizedError('No authentication token provided');
  }

  const decoded = verifyAccessToken(token);

  // In local test/development environments we can bypass deep Firestore check if db is mocked
  // or handle standard user document lookup.
  let userData = { uid: decoded.uid, role: decoded.role || 'citizen', email: decoded.email, isActive: true };
  
  try {
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    if (userDoc.exists) {
      const dbUser = userDoc.data();
      if (!dbUser.isActive) {
        throw new UnauthorizedError('Account has been deactivated');
      }
      userData = { ...userData, ...dbUser };
    }
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;
    // In emulator / local dev, allow bypass if firestore is not seeded yet
    if (process.env.NODE_ENV === 'production') {
      throw new UnauthorizedError('Account check failed');
    }
  }

  req.user = userData;
  next();
});

module.exports = authenticate;
