'use strict';

const BaseRepository = require('./base.repository');
const { expandQueryAliases } = require('../utils/aliasDictionary');
const { ApiError } = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * SchemeRepository — handles database access for governmentSchemes collection
 */
class SchemeRepository extends BaseRepository {
  constructor() {
    super('governmentSchemes');
  }

  /**
   * Find scheme by official schemeId string
   */
  async findBySchemeId(schemeId) {
    try {
      const snapshot = await this.collection.where('schemeId', '==', schemeId).get();
      if (snapshot.empty || !snapshot.docs.length) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error('[SchemeRepository] findBySchemeId error', { schemeId, error: error.message });
      return null;
    }
  }

  /**
   * Hybrid RAG Search with Alias Expansion & Fuzzy Relevance Ranking
   */
  async hybridSearch({ query = '', category = 'All', limit = 5 } = {}) {
    try {
      const snapshot = await this.collection.get();
      let schemes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (category && category !== 'All') {
        schemes = schemes.filter(s => (s.category || '').toLowerCase() === category.toLowerCase());
      }

      const { expandedQuery, tokens } = expandQueryAliases(query);
      if (!expandedQuery) {
        return schemes.slice(0, limit);
      }

      // Calculate relevance score for each scheme document
      const scored = schemes.map(scheme => {
        let score = 0;
        const titleNorm = (scheme.title || '').toLowerCase();
        const categoryNorm = (scheme.category || '').toLowerCase();
        const ministryNorm = (scheme.ministry || '').toLowerCase();
        const descNorm = (scheme.shortDescription || scheme.benefits || '').toLowerCase();

        const targets = Array.isArray(scheme.targetBeneficiaries) ? scheme.targetBeneficiaries.map(t => t.toLowerCase()) : [];
        const tags = Array.isArray(scheme.tags) ? scheme.tags.map(t => t.toLowerCase()) : [];

        // Exact match on schemeId or title
        if (titleNorm.includes(query.toLowerCase())) score += 100;
        if (scheme.schemeId && scheme.schemeId.toLowerCase() === query.toLowerCase()) score += 120;

        // Token matching against aliases and expanded query terms
        for (const token of tokens) {
          if (token.length < 2) continue;
          if (titleNorm.includes(token)) score += 30;
          if (categoryNorm.includes(token)) score += 20;
          if (ministryNorm.includes(token)) score += 20;
          if (targets.some(t => t.includes(token))) score += 25;
          if (tags.some(t => t.includes(token))) score += 25;
          if (descNorm.includes(token)) score += 10;
        }

        return { scheme, score };
      });

      // Filter schemes with score > 0 and sort by score descending
      const matched = scored
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.scheme);

      return matched.slice(0, limit);
    } catch (error) {
      logger.error('[SchemeRepository] hybridSearch error', { query, error: error.message });
      return [];
    }
  }

  /**
   * Advanced multi-faceted filtering & search for verified government schemes
   */
  async findWithAdvancedFilters({
    category = 'All',
    ministry = 'All',
    scope = 'All',
    state = 'All',
    tag = 'All',
    search = '',
    status = 'active',
    page = 1,
    limit = 20,
  } = {}) {
    try {
      const snapshot = await this.collection.get();
      let schemes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (search && search.trim()) {
        const hybridResults = await this.hybridSearch({ query: search, category, limit: 100 });
        schemes = hybridResults;
      }

      // Status Filter
      if (status && status !== 'All') {
        schemes = schemes.filter(s => s.status === status);
      }

      // Category Filter
      if (category && category !== 'All') {
        schemes = schemes.filter(s => (s.category || '').toLowerCase() === category.toLowerCase());
      }

      // Ministry Filter
      if (ministry && ministry !== 'All') {
        schemes = schemes.filter(s => (s.ministry || '').toLowerCase().includes(ministry.toLowerCase()));
      }

      // Scope Filter (central / state)
      if (scope && scope !== 'All') {
        schemes = schemes.filter(s => (s.scope || '').toLowerCase() === scope.toLowerCase());
      }

      // Applicable State Filter
      if (state && state !== 'All') {
        schemes = schemes.filter(s => {
          if (!Array.isArray(s.applicableStates) || s.applicableStates.length === 0) return true;
          return s.applicableStates.some(st => st.toLowerCase() === state.toLowerCase());
        });
      }

      // Tag Filter
      if (tag && tag !== 'All') {
        schemes = schemes.filter(s => {
          const normTag = tag.toLowerCase();
          if (normTag === 'newly launched') return s.isNewlyLaunched;
          if (normTag === 'recently updated') return s.isRecentlyUpdated;
          if (normTag === 'expiring soon') return s.isExpiring;
          if (normTag === 'popular') return s.viewCount > 50 || (s.tags && s.tags.includes('Popular'));
          return Array.isArray(s.tags) && s.tags.some(t => t.toLowerCase() === normTag);
        });
      }

      // Pagination
      const total = schemes.length;
      const safeLimit = Math.min(limit, 100);
      const safePage = Math.max(page, 1);
      const offset = (safePage - 1) * safeLimit;
      const paginatedData = schemes.slice(offset, offset + safeLimit);

      return {
        data: paginatedData,
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit) || 1,
      };
    } catch (error) {
      logger.error('[SchemeRepository] findWithAdvancedFilters error', { error: error.message });
      throw new ApiError(500, 'Database query error');
    }
  }

  async findByCategory(category) {
    const res = await this.findWithAdvancedFilters({ category });
    return res.data;
  }

  async search(keyword) {
    return this.hybridSearch({ query: keyword });
  }

  async incrementViewCount(schemeId) {
    return this.increment(schemeId, 'viewCount', 1);
  }

  async incrementApplicationCount(schemeId) {
    return this.increment(schemeId, 'applicationCount', 1);
  }

  async incrementSavedCount(schemeId) {
    return this.increment(schemeId, 'savedCount', 1);
  }
}

module.exports = SchemeRepository;
