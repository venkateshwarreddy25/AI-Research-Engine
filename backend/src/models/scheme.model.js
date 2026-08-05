'use strict';

/**
 * Creates a verified Government Scheme Document Object
 * @param {Object} params
 * @returns {Object} Scheme document
 */
function createSchemeDocument(params = {}) {
  const now = new Date().toISOString();

  return {
    schemeId:            params.schemeId || `SCH-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    title:               params.title || '',
    slug:                params.slug || (params.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    ministry:            params.ministry || 'Ministry of Finance',
    category:            params.category || 'Financial Assistance',
    launchDate:          params.launchDate || '2023-01-01',
    lastUpdatedDate:     params.lastUpdatedDate || now,
    status:              params.status || 'active', // 'active' | 'upcoming' | 'closed'
    scope:               params.scope || 'central', // 'central' | 'state'
    applicableStates:    Array.isArray(params.applicableStates) ? params.applicableStates : [], // Empty array = All India
    targetBeneficiaries: Array.isArray(params.targetBeneficiaries) ? params.targetBeneficiaries : ['All Citizens'],
    benefits:            params.benefits || '',
    shortDescription:    params.shortDescription || '',
    eligibilityCriteria: Array.isArray(params.eligibilityCriteria) ? params.eligibilityCriteria : [params.eligibilityCriteria || ''],
    requiredDocuments:   Array.isArray(params.requiredDocuments) ? params.requiredDocuments : [],
    applicationProcess:  Array.isArray(params.applicationProcess) ? params.applicationProcess : [],
    officialWebsite:     params.officialWebsite || 'https://india.gov.in',
    officialApplyLink:   params.officialApplyLink || params.officialWebsite || 'https://myscheme.gov.in',
    helplineNumber:      params.helplineNumber || '1800-11-0001',
    budget:              params.budget || 'N/A',
    faqs:                Array.isArray(params.faqs) ? params.faqs : [],
    tags:                Array.isArray(params.tags) ? params.tags : [],
    
    // Official Status Verification Badges
    isVerified:          params.isVerified !== undefined ? params.isVerified : true,
    isNewlyLaunched:     params.isNewlyLaunched || false,
    isRecentlyUpdated:   params.isRecentlyUpdated || false,
    isExpiring:          params.isExpiring || false,
    
    // Analytics & Metrics
    viewCount:           params.viewCount || 0,
    saveCount:           params.saveCount || 0,
    applicationCount:    params.applicationCount || 0,

    lastSyncedAt:        params.lastSyncedAt || now,
    createdAt:           params.createdAt || now,
    updatedAt:           now,
  };
}

module.exports = { createSchemeDocument };
