'use strict';

const express = require('express');
const { query, body } = require('express-validator');
const SchemeController = require('../controllers/scheme.controller');
const validate = require('../middleware/validate.middleware');
const authenticate = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/v1/schemes
router.get('/', SchemeController.listSchemes);

// GET /api/v1/schemes/stats
router.get('/stats', SchemeController.getStats);

// POST /api/v1/schemes/sync
router.post('/sync', SchemeController.syncSchemes);

// GET /api/v1/schemes/categories
router.get('/categories', SchemeController.getCategories);

// GET /api/v1/schemes/recommended
router.get('/recommended', SchemeController.getRecommended);

// POST /api/v1/schemes/compare
router.post('/compare',
  [body('schemeIds').isArray().withMessage('schemeIds must be an array')],
  validate,
  SchemeController.compareSchemes
);

// POST /api/v1/schemes/check-eligibility
router.post('/check-eligibility',
  [body('schemeId').notEmpty().withMessage('schemeId is required')],
  validate,
  SchemeController.checkEligibility
);

// GET /api/v1/schemes/user/saved
router.get('/user/saved', SchemeController.getSavedSchemes);

// POST /api/v1/schemes/:schemeId/save
router.post('/:schemeId/save', SchemeController.toggleSaveScheme);

// GET /api/v1/schemes/:id
router.get('/:id', SchemeController.getSchemeById);

module.exports = router;
