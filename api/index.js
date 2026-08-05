// Vercel Serverless Function Entry Point
// This file bootstraps the Express app and exports it as a Vercel handler
'use strict';

// Load env vars
require('dotenv').config();

const app = require('../backend/src/app');

module.exports = app;
