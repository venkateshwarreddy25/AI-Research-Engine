'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const SchemeService = require('../services/scheme.service');

const schemeService = new SchemeService();

const SchemeController = {
  /**
   * GET /api/v1/schemes
   * List schemes with search, category, ministry, state, and tag filters
   */
  listSchemes: asyncHandler(async (req, res) => {
    const { category, ministry, scope, state, tag, search, page, limit } = req.query;
    const result = await schemeService.listSchemes({
      category,
      ministry,
      scope,
      state,
      tag,
      search,
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });

    ApiResponse.ok(res, 'Government schemes retrieved successfully', result);
  }),

  /**
   * GET /api/v1/schemes/stats
   * Fetch sync execution metrics & status
   */
  getStats: asyncHandler(async (req, res) => {
    const { syncMetrics } = await schemeService.listSchemes({ limit: 1 });
    ApiResponse.ok(res, 'Scheme sync metrics retrieved', syncMetrics);
  }),

  /**
   * POST /api/v1/schemes/sync
   * Trigger real-time synchronization from official government sources
   */
  syncSchemes: asyncHandler(async (req, res) => {
    const metrics = await schemeService.triggerSync();
    ApiResponse.ok(res, 'Government schemes synchronized successfully from official sources', metrics);
  }),

  /**
   * GET /api/v1/schemes/categories
   * Get active categories list
   */
  getCategories: asyncHandler(async (req, res) => {
    const categories = [
      'All', 'Agriculture', 'Health', 'Education', 'Housing', 'Employment',
      'Business', 'Women', 'Financial Assistance', 'Senior Citizens', 'Students', 'MSMEs'
    ];
    ApiResponse.ok(res, 'Categories list fetched', categories);
  }),

  /**
   * GET /api/v1/schemes/recommended
   * Get personalized scheme recommendations
   */
  getRecommended: asyncHandler(async (req, res) => {
    const userProfile = req.user || {};
    const recommendations = await schemeService.getRecommendations(userProfile);
    ApiResponse.ok(res, 'Personalized scheme recommendations generated', recommendations);
  }),

  /**
   * POST /api/v1/schemes/compare
   * Side-by-side comparison of multiple schemes
   */
  compareSchemes: asyncHandler(async (req, res) => {
    const { schemeIds } = req.body;
    const comparison = await schemeService.compareSchemes(schemeIds);
    ApiResponse.ok(res, 'Scheme comparison generated', comparison);
  }),

  /**
   * POST /api/v1/schemes/check-eligibility
   * AI-powered eligibility checker for a scheme
   */
  checkEligibility: asyncHandler(async (req, res) => {
    const { schemeId, userProfile } = req.body;
    const profile = userProfile || req.user || {};
    const evaluation = await schemeService.checkEligibility(profile, schemeId);
    ApiResponse.ok(res, 'Eligibility evaluation complete', evaluation);
  }),

  /**
   * POST /api/v1/schemes/:schemeId/save
   * Save / bookmark scheme
   */
  toggleSaveScheme: asyncHandler(async (req, res) => {
    const { schemeId } = req.params;
    const userId = req.user?.uid || 'guest-user';
    const result = await schemeService.toggleSaveScheme(userId, schemeId);
    ApiResponse.ok(res, result.isSaved ? 'Scheme saved to bookmarks' : 'Scheme removed from bookmarks', result);
  }),

  /**
   * GET /api/v1/schemes/user/saved
   * Get saved schemes for logged in user
   */
  getSavedSchemes: asyncHandler(async (req, res) => {
    const userId = req.user?.uid || 'guest-user';
    const schemes = await schemeService.getSavedSchemes(userId);
    ApiResponse.ok(res, 'Saved schemes fetched', schemes);
  }),

  /**
   * GET /api/v1/schemes/:id
   * Get single scheme by ID
   */
  getSchemeById: asyncHandler(async (req, res) => {
    const scheme = await schemeService.getSchemeById(req.params.id);
    ApiResponse.ok(res, 'Scheme details retrieved', scheme);
  }),
};

module.exports = SchemeController;
