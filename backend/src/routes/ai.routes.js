'use strict';

const express = require('express');
const { body } = require('express-validator');
const AIController = require('../controllers/ai.controller');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

// POST /api/v1/ai/chat
router.post('/chat',
  [body('message').notEmpty().withMessage('Message is required')],
  validate,
  AIController.chat
);

// GET /api/v1/ai/history
router.get('/history', AIController.getHistory);

module.exports = router;
