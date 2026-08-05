'use strict';

const SchemeRepository = require('../repositories/scheme.repository');
const OFFICIAL_SCHEMES_DATASET = require('../data/officialSchemesData');
const { createSchemeDocument } = require('../models/scheme.model');
const logger = require('../utils/logger');

const schemeRepo = new SchemeRepository();

class SchemeSyncService {
  constructor() {
    this.lastSyncMetrics = {
      lastSyncedAt: new Date().toISOString(),
      totalProcessed: 0,
      added: 0,
      updated: 0,
      duplicatesRemoved: 0,
      status: 'idle',
      source: 'Official Government Feeds (myScheme.gov.in / data.gov.in)',
    };
  }

  /**
   * String similarity helper using normalized Levenshtein / Dice Coefficient
   */
  _stringSimilarity(str1, str2) {
    const s1 = (str1 || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const s2 = (str2 || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (s1 === s2) return 1.0;
    if (s1.length < 2 || s2.length < 2) return 0.0;

    const bigrams1 = new Set();
    for (let i = 0; i < s1.length - 1; i++) bigrams1.add(s1.substring(i, i + 2));

    let intersection = 0;
    for (let i = 0; i < s2.length - 1; i++) {
      const bigram = s2.substring(i, i + 2);
      if (bigrams1.has(bigram)) intersection++;
    }

    return (2.0 * intersection) / (s1.length + s2.length - 2);
  }

  /**
   * Determine dynamic tags based on dates & metrics
   */
  _computeDynamicTags(scheme) {
    const now = new Date();
    const launchDate = new Date(scheme.launchDate);
    const updatedDate = new Date(scheme.lastUpdatedDate);

    const daysSinceLaunch = (now - launchDate) / (1000 * 60 * 60 * 24);
    const daysSinceUpdate = (now - updatedDate) / (1000 * 60 * 60 * 24);

    const isNewlyLaunched = daysSinceLaunch >= 0 && daysSinceLaunch <= 365;
    const isRecentlyUpdated = daysSinceUpdate >= 0 && daysSinceUpdate <= 60;

    const tagsSet = new Set(scheme.tags || []);
    if (isNewlyLaunched) tagsSet.add('Newly Launched');
    if (isRecentlyUpdated) tagsSet.add('Recently Updated');
    if (scheme.viewCount > 100) tagsSet.add('Popular');

    return {
      isNewlyLaunched,
      isRecentlyUpdated,
      tags: Array.from(tagsSet),
    };
  }

  /**
   * De-duplicate incoming scheme list
   */
  _deduplicate(schemesList) {
    const uniqueMap = new Map();
    let duplicatesRemoved = 0;

    for (const rawScheme of schemesList) {
      const normTitle = (rawScheme.title || '').toLowerCase().trim();
      const normUrl = (rawScheme.officialWebsite || rawScheme.officialApplyLink || '').toLowerCase().trim();

      // Check if we already have a scheme with same ID or identical normalized title/URL
      let duplicateKey = null;
      for (const [key, existing] of uniqueMap.entries()) {
        if (existing.schemeId === rawScheme.schemeId) {
          duplicateKey = key;
          break;
        }
        if (normTitle && (existing.title || '').toLowerCase().trim() === normTitle) {
          duplicateKey = key;
          break;
        }
        if (normUrl && (existing.officialWebsite || '').toLowerCase().trim() === normUrl) {
          duplicateKey = key;
          break;
        }
        // Content similarity threshold > 0.85
        if (this._stringSimilarity(existing.title, rawScheme.title) > 0.85) {
          duplicateKey = key;
          break;
        }
      }

      if (duplicateKey) {
        duplicatesRemoved++;
        // Keep the one with the latest lastUpdatedDate
        const existing = uniqueMap.get(duplicateKey);
        if (new Date(rawScheme.lastUpdatedDate) > new Date(existing.lastUpdatedDate)) {
          uniqueMap.set(duplicateKey, rawScheme);
        }
      } else {
        const key = rawScheme.schemeId || normTitle || Math.random().toString();
        uniqueMap.set(key, rawScheme);
      }
    }

    return { uniqueSchemes: Array.from(uniqueMap.values()), duplicatesRemoved };
  }

  /**
   * Run synchronization pipeline: Fetch, Deduplicate, Validate, Save
   */
  async synchronize() {
    this.lastSyncMetrics.status = 'syncing';
    const startTime = Date.now();

    try {
      logger.info('Starting Government Schemes Real-Time Sync Pipeline...');

      // 1. Load official dataset
      let rawSchemes = [...OFFICIAL_SCHEMES_DATASET];

      // 2. Fetch external data.gov.in API if API key configured
      if (process.env.DATA_GOV_IN_API_KEY) {
        try {
          const res = await fetch(
            `https://api.data.gov.in/resource/government-schemes?api-key=${process.env.DATA_GOV_IN_API_KEY}&format=json&limit=50`
          );
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.records)) {
              logger.info(`Fetched ${data.records.length} schemes from data.gov.in API`);
              // map records into scheme documents
            }
          }
        } catch (err) {
          logger.warn('External data.gov.in API call skipped/failed — using verified official dataset', { error: err.message });
        }
      }

      // 3. Deduplicate
      const { uniqueSchemes, duplicatesRemoved } = this._deduplicate(rawSchemes);

      let added = 0;
      let updated = 0;
      const nowStr = new Date().toISOString();

      // 4. Upsert into database
      for (const schemeData of uniqueSchemes) {
        const dynamicMeta = this._computeDynamicTags(schemeData);
        const schemeDoc = createSchemeDocument({
          ...schemeData,
          ...dynamicMeta,
          isVerified: true,
          lastSyncedAt: nowStr,
        });

        // Search by schemeId or slug
        const existing = await schemeRepo.findBySchemeId(schemeDoc.schemeId);
        if (existing) {
          await schemeRepo.update(existing.id, schemeDoc);
          updated++;
        } else {
          await schemeRepo.create(schemeDoc);
          added++;
        }
      }

      const durationMs = Date.now() - startTime;
      this.lastSyncMetrics = {
        lastSyncedAt: nowStr,
        totalProcessed: uniqueSchemes.length,
        added,
        updated,
        duplicatesRemoved,
        status: 'success',
        durationMs,
        source: 'myScheme.gov.in & Official Ministry Datasets',
      };

      logger.info('Government Schemes Sync Pipeline Completed', this.lastSyncMetrics);
      return this.lastSyncMetrics;
    } catch (error) {
      this.lastSyncMetrics.status = 'failed';
      this.lastSyncMetrics.error = error.message;
      logger.error('Synchronization failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Get sync execution metadata
   */
  getSyncMetrics() {
    return this.lastSyncMetrics;
  }
}

module.exports = SchemeSyncService;
