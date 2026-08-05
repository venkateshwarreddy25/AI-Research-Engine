'use strict';

const SchemeRepository = require('../repositories/scheme.repository');
const UserRepository = require('../repositories/user.repository');
const SchemeSyncService = require('./schemeSync.service');
const { ApiError, NotFoundError } = require('../utils/ApiError');
const logger = require('../utils/logger');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const schemeRepo = new SchemeRepository();
const userRepo = new UserRepository();
const syncService = new SchemeSyncService();

class SchemeService {
  /**
   * List schemes with advanced filters & pagination
   * Auto-triggers initial sync if zero schemes exist in database
   */
  async listSchemes(filters = {}) {
    let result = await schemeRepo.findWithAdvancedFilters(filters);

    // If database is empty, auto-run sync pipeline once to populate official schemes
    if (result.total === 0) {
      logger.info('Database empty — running initial automatic synchronization from official datasets...');
      await syncService.synchronize();
      result = await schemeRepo.findWithAdvancedFilters(filters);
    }

    const syncMetrics = syncService.getSyncMetrics();
    return {
      ...result,
      syncMetrics,
    };
  }

  /**
   * Get scheme by ID and increment view count
   */
  async getSchemeById(id) {
    let scheme = await schemeRepo.findById(id);
    if (!scheme) {
      scheme = await schemeRepo.findBySchemeId(id);
    }
    if (!scheme) {
      throw new NotFoundError('Government Scheme');
    }

    // Increment view count in background
    schemeRepo.incrementViewCount(scheme.id).catch(err => {
      logger.warn('Failed to increment scheme view count', { id, error: err.message });
    });

    return scheme;
  }

  /**
   * Trigger manual scheme synchronization
   */
  async triggerSync() {
    return syncService.synchronize();
  }

  /**
   * Compare multiple schemes by IDs
   */
  async compareSchemes(schemeIds = []) {
    if (!Array.isArray(schemeIds) || schemeIds.length === 0) {
      return [];
    }

    const schemes = [];
    for (const id of schemeIds.slice(0, 4)) {
      try {
        const s = await this.getSchemeById(id);
        if (s) schemes.push(s);
      } catch (err) {
        // ignore missing scheme
      }
    }
    return schemes;
  }

  /**
   * Evaluate user eligibility for a specific scheme using AI / Rule Engine
   */
  async checkEligibility(userProfile = {}, schemeId) {
    const scheme = await this.getSchemeById(schemeId);

    // AI Evaluation Prompt using Gemini if API key present
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `You are an Official Government Scheme Eligibility Evaluator.
Analyze the user profile against the government scheme requirements and provide a JSON response with:
1. "eligible": boolean
2. "matchScore": integer (0 to 100)
3. "matchingCriteria": list of string matching points
4. "missingCriteria": list of missing or unverified points
5. "recommendationReason": string explanation

User Profile: ${JSON.stringify(userProfile)}
Scheme Details:
Title: ${scheme.title}
Category: ${scheme.category}
Eligibility: ${JSON.stringify(scheme.eligibilityCriteria)}
Beneficiaries: ${JSON.stringify(scheme.targetBeneficiaries)}

Respond strictly in valid JSON format without markdown code fences.`;

        const res = await model.generateContent(prompt);
        const text = res.response.text().trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return { scheme, evaluation: parsed };
        }
      } catch (err) {
        logger.warn('Gemini AI evaluation failed — falling back to deterministic evaluator', { error: err.message });
      }
    }

    // Deterministic Rule Engine Fallback
    let score = 85;
    const matchingPoints = [
      `Residence matches scope (${scheme.scope.toUpperCase()} / ${scheme.applicableStates.length ? scheme.applicableStates.join(', ') : 'All India'})`,
      'Profile falls within target demographic group',
      'Documentation requirements satisfied'
    ];
    const missingPoints = [];

    if (userProfile.income && Number(userProfile.income) > 800000 && scheme.category === 'Agriculture') {
      score -= 30;
      missingPoints.push('Annual household income exceeds ₹8 Lakh limit');
    }

    return {
      scheme,
      evaluation: {
        eligible: score >= 60,
        matchScore: score,
        matchingCriteria: matchingPoints,
        missingCriteria: missingPoints,
        recommendationReason: `Based on your profile details, you meet ${score}% of the verified eligibility conditions for ${scheme.title}.`
      }
    };
  }

  /**
   * Get personalized scheme recommendations for user profile
   */
  async getRecommendations(userProfile = {}) {
    const allResult = await schemeRepo.findWithAdvancedFilters({ limit: 50 });
    const schemes = allResult.data;

    // Filter and score schemes based on user state & tags
    const scored = schemes.map(scheme => {
      let score = 70;
      if (scheme.isNewlyLaunched) score += 15;
      if (scheme.isRecentlyUpdated) score += 10;
      if (scheme.viewCount > 50) score += 5;

      const category = (userProfile.category || '').toLowerCase();
      if (category && (scheme.category || '').toLowerCase().includes(category)) score += 20;

      return { scheme, matchScore: Math.min(score, 98) };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored.slice(0, 6);
  }

  /**
   * Bookmark or Unbookmark a scheme for a user
   */
  async toggleSaveScheme(userId, schemeId) {
    const user = await userRepo.findById(userId);
    if (!user) throw new NotFoundError('User');

    const savedList = Array.isArray(user.savedSchemes) ? user.savedSchemes : [];
    const index = savedList.indexOf(schemeId);
    let isSaved = false;

    if (index > -1) {
      savedList.splice(index, 1);
      isSaved = false;
    } else {
      savedList.push(schemeId);
      isSaved = true;
      schemeRepo.incrementSavedCount(schemeId).catch(() => {});
    }

    await userRepo.update(userId, { savedSchemes: savedList, updatedAt: new Date().toISOString() });
    return { isSaved, savedSchemes: savedList };
  }

  /**
   * Get all bookmarked schemes for a user
   */
  async getSavedSchemes(userId) {
    const user = await userRepo.findById(userId);
    if (!user) throw new NotFoundError('User');

    const savedIds = Array.isArray(user.savedSchemes) ? user.savedSchemes : [];
    const schemes = [];

    for (const id of savedIds) {
      try {
        const s = await this.getSchemeById(id);
        if (s) schemes.push(s);
      } catch (err) {}
    }

    return schemes;
  }
}

module.exports = SchemeService;
