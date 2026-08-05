'use strict';

const logger = require('../utils/logger');

/**
 * OCR Document Verification Service
 * Simulates text extraction and validates documents for government schemes
 */
const REQUIRED_DOCS_BY_SCHEME = {
  'PM-KISAN':          ['Aadhaar Card', 'Land Record / Khata', 'Bank Passbook', 'Mobile Number Linked to Aadhaar'],
  'PMAY':              ['Aadhaar Card', 'Income Certificate', 'Bank Passbook', 'Property Documents'],
  'PM-JAY':            ['Aadhaar Card', 'Ration Card / BPL Card', 'Caste Certificate (if SC/ST)'],
  'NSP':               ['Aadhaar Card', 'Marksheet (Previous Class)', 'Bank Passbook', 'Income Certificate', 'Caste Certificate (if applicable)'],
  'PM Vishwakarma':    ['Aadhaar Card', 'Caste Certificate', 'Business Proof', 'Bank Passbook'],
  'Mudra Loan':        ['Aadhaar Card', 'Business Plan', 'Bank Statement', 'Income Certificate'],
  'Lakhpati Didi':     ['Aadhaar Card', 'SHG Membership Proof', 'Bank Passbook', 'Income Certificate'],
};

class OCRService {

  /**
   * Simulate document text extraction (OCR)
   * In production this would use Tesseract.js, Google Vision API, or Azure OCR
   */
  async extractDocumentText(fileBuffer, mimeType, documentType) {
    // Simulated extraction result based on document type
    const extractionMap = {
      'aadhaar':           { name: 'RAMESH KUMAR', dob: '15/08/1985', uid: '9876 5432 1098', address: 'Village Kothapeta, Dist. Krishna, AP', valid: true },
      'income-certificate':{ applicantName: 'RAMESH KUMAR', income: '₹1,80,000 per annum', issuedBy: 'Revenue Divisional Officer', issuedDate: '12/03/2025', valid: true },
      'caste-certificate': { applicantName: 'RAMESH KUMAR', casteName: 'OBC', stateOfIssuance: 'Andhra Pradesh', issuedDate: '10/01/2025', valid: true },
      'marksheet':         { studentName: 'RAMESH KUMAR', class: 'XII', percentage: '82.4%', board: 'AP Board of Intermediate Education', year: '2023', valid: true },
      'bank-passbook':     { accountHolderName: 'RAMESH KUMAR', bankName: 'State Bank of India', accountNumber: 'XXXXXX4231', ifscCode: 'SBIN0001234', valid: true },
    };

    const docKey = (documentType || '').toLowerCase().replace(/\s+/g, '-');
    const extracted = extractionMap[docKey] || extractionMap['aadhaar'];

    return {
      documentType,
      extracted,
      confidence: 96.4,
      processingTimeMs: 420,
    };
  }

  /**
   * Validate extracted document data and check expiration
   */
  validateDocument(extracted, documentType) {
    const warnings = [];
    const isValid = extracted.valid === true;

    if (documentType === 'income-certificate' && extracted.issuedDate) {
      const issued = new Date(extracted.issuedDate.split('/').reverse().join('-'));
      const expiryDate = new Date(issued.getTime());
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      const now = new Date();
      if (now > expiryDate) {
        warnings.push('⚠️ Income Certificate appears to be expired. Most schemes require a certificate issued within the past 12 months.');
      }
    }

    return { isValid, warnings };
  }

  /**
   * Generate missing document checklist based on submitted documents and target scheme
   */
  generateMissingDocumentChecklist(submittedDocTypes = [], targetScheme = '') {
    const required = REQUIRED_DOCS_BY_SCHEME[targetScheme] || [
      'Aadhaar Card', 'Bank Passbook', 'Income Certificate', 'Passport-size Photograph',
    ];

    const normalised = submittedDocTypes.map(d => d.toLowerCase().trim());
    const missing = required.filter(req => {
      const reqNorm = req.toLowerCase();
      return !normalised.some(s => s.includes(reqNorm.split(' ')[0]) || reqNorm.includes(s.split(' ')[0]));
    });

    return {
      requiredDocuments: required,
      submittedDocuments: submittedDocTypes,
      missingDocuments: missing,
      completionPercentage: Math.round(((required.length - missing.length) / required.length) * 100),
    };
  }
}

module.exports = OCRService;
