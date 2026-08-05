'use strict';

const express = require('express');
const healthRoutes = require('./health.routes');
const authRoutes   = require('./auth.routes');
const schemeRoutes = require('./scheme.routes');
const aiRoutes     = require('./ai.routes');
const gisRoutes    = require('./gis.routes');
const ocrRoutes    = require('./ocr.routes');

const router = express.Router();

// Mount routes
router.use('/health',  healthRoutes);
router.use('/auth',    authRoutes);
router.use('/schemes', schemeRoutes);
router.use('/ai',      aiRoutes);
router.use('/gis',     gisRoutes);
router.use('/ocr',     ocrRoutes);

router.get('/users/:uid/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      applicationsCount: 2,
      savedSchemesCount: 5,
      unreadNotifs: 3,
      profileScore: 85,
    }
  });
});

router.post('/ai/recommend', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        schemeId: 'pm-kisan-2024',
        title: 'PM Kisan Samman Nidhi',
        category: 'agriculture',
        ministry: 'Ministry of Agriculture',
        matchScore: 95,
        benefitsOffered: [{ description: '₹6,000 annually via Direct Benefit Transfer' }]
      },
      {
        schemeId: 'ayushman-bharat-pmjay',
        title: 'Ayushman Bharat PM-JAY',
        category: 'health',
        ministry: 'Ministry of Health and Family Welfare',
        matchScore: 82,
        benefitsOffered: [{ description: '₹5 Lakh free hospitalization cover per year' }]
      }
    ]
  });
});

module.exports = router;
