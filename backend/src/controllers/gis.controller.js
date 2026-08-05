'use strict';

const GISService = require('../services/gis.service');
const ApiResponse = require('../utils/ApiResponse');

const gisService = new GISService();

exports.getNearbyCenters = async (req, res, next) => {
  try {
    const { lat, lng, type, search } = req.query;
    const latitude = Number(lat) || 17.3850;
    const longitude = Number(lng) || 78.4867;

    const centers = await gisService.searchNearbyCenters({
      latitude,
      longitude,
      type: type || 'All',
      search: search || '',
    });

    return ApiResponse.ok(res, 'Nearby government centers retrieved successfully', centers);
  } catch (error) {
    next(error);
  }
};
