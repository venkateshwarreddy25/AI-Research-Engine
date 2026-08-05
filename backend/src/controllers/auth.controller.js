'use strict';

const asyncHandler  = require('../utils/asyncHandler');
const ApiResponse   = require('../utils/ApiResponse');
const AuthService   = require('../services/auth.service');

const authService = new AuthService();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
};

const AuthController = {
  /**
   * POST /api/v1/auth/google
   * Authenticates via Firebase Google OAuth ID token
   */
  googleLogin: asyncHandler(async (req, res) => {
    const { idToken } = req.body;
    const { user, accessToken, refreshToken } = await authService.googleLogin(idToken);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    ApiResponse.ok(res, 'Login successful', { user, accessToken });
  }),

  /**
   * POST /api/v1/auth/register
   * Email + password registration via Firebase Auth
   */
  register: asyncHandler(async (req, res) => {
    const { email, password, fullName, displayName, state } = req.body;
    const name = fullName || displayName || 'Citizen';
    const { user, accessToken, refreshToken } = await authService.register({
      email, password, displayName: name, state,
    });

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    ApiResponse.created(res, 'Account created successfully', { user, accessToken });
  }),

  /**
   * POST /api/v1/auth/login
   * Email + password login via Firebase Auth
   */
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login({ email, password });

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    ApiResponse.ok(res, 'Login successful', { user, accessToken });
  }),

  /**
   * POST /api/v1/auth/refresh
   * Issues a new access token using refresh token from httpOnly cookie or body
   */
  refreshToken: asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    const { accessToken } = await authService.refreshAccessToken(token);
    ApiResponse.ok(res, 'Token refreshed', { accessToken });
  }),

  /**
   * POST /api/v1/auth/logout
   * Clears refresh token cookie and revokes refresh token
   */
  logout: asyncHandler(async (req, res) => {
    await authService.logout(req.user.uid);
    res.clearCookie('refreshToken');
    ApiResponse.ok(res, 'Logged out successfully');
  }),

  /**
   * GET /api/v1/auth/me
   * Returns the authenticated user's profile
   */
  getMe: asyncHandler(async (req, res) => {
    const user = await authService.getUserProfile(req.user.uid);
    ApiResponse.ok(res, 'User profile fetched', user);
  }),

  /**
   * POST /api/v1/auth/forgot-password
   * Sends password reset email via Firebase Auth
   */
  forgotPassword: asyncHandler(async (req, res) => {
    const { email } = req.body;
    await authService.sendPasswordResetEmail(email);
    ApiResponse.ok(res, 'Password reset email sent if account exists');
  }),
};

module.exports = AuthController;
