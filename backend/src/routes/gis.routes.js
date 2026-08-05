'use strict';

const express = require('express');
const router = express.Router();
const gisController = require('../controllers/gis.controller');

router.get('/nearby', gisController.getNearbyCenters);

module.exports = router;
