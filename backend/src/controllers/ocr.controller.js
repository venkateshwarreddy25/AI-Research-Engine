'use strict';

const OCRService = require('../services/ocr.service');
const ApiResponse = require('../utils/ApiResponse');

const ocrService = new OCRService();

/**
 * POST /api/v1/ocr/verify
 * Accepts: { documentType, targetScheme, submittedDocTypes }
 */
exports.verifyDocument = async (req, res, next) => {
  try {
    const { documentType = 'aadhaar', targetScheme = '', submittedDocTypes = [] } = req.body;

    const extraction = await ocrService.extractDocumentText(null, 'image/jpeg', documentType);
    const validation = ocrService.validateDocument(extraction.extracted, documentType);
    const checklist = ocrService.generateMissingDocumentChecklist(submittedDocTypes, targetScheme);

    return ApiResponse.ok(res, 'Document verification completed', {
      documentType,
      extracted: extraction.extracted,
      confidence: extraction.confidence,
      processingTimeMs: extraction.processingTimeMs,
      isValid: validation.isValid,
      warnings: validation.warnings,
      checklist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/ocr/checklist
 * Generate missing document checklist for a scheme
 */
exports.generateChecklist = async (req, res, next) => {
  try {
    const { targetScheme = '', submittedDocTypes = [] } = req.body;
    const checklist = ocrService.generateMissingDocumentChecklist(submittedDocTypes, targetScheme);
    return ApiResponse.ok(res, 'Checklist generated', checklist);
  } catch (error) {
    next(error);
  }
};
