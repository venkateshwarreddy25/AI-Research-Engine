'use strict';

const express = require('express');
const router = express.Router();
const ocrController = require('../controllers/ocr.controller');

router.post('/verify',    ocrController.verifyDocument);
router.post('/checklist', ocrController.generateChecklist);

module.exports = router;
