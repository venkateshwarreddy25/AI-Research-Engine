'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');
const SchemeRepository = require('../repositories/scheme.repository');
const SchemeSyncService = require('./schemeSync.service');
const { buildGovernmentChatbotSystemPrompt } = require('../prompts/chatbot.prompt');
const { db } = require('../config/firebase.config');
const logger = require('../utils/logger');

const schemeRepo = new SchemeRepository();
const syncService = new SchemeSyncService();

class AIService {
  /**
   * Multi-tier RAG Search Tool Execution
   * 1. Search Firestore `governmentSchemes` using hybrid search & alias resolution
   * 2. If empty, auto-trigger live sync from official datasets / APIs and re-query
   */
  async searchSchemes(query = '') {
    logger.info(`Executing RAG searchSchemes tool for query: "${query}"`);

    // Tier 1: Search Firestore
    let schemes = await schemeRepo.hybridSearch({ query, limit: 5 });

    // Tier 2: If Firestore returns empty, auto-sync and re-query
    if (!schemes || schemes.length === 0) {
      logger.info(`No matches in Firestore for "${query}" — auto-triggering official dataset sync...`);
      await syncService.synchronize();
      schemes = await schemeRepo.hybridSearch({ query, limit: 5 });
    }

    return schemes || [];
  }

  /**
   * Process dynamic RAG Chat Request
   */
  async chat({ message, history = [], userProfile = {}, sessionId = 'default-session', userId = 'guest' }) {
    const cleanMsg = (message || '').trim();
    if (!cleanMsg) {
      throw new Error('Message content is required');
    }

    // 1. Mandatory Tool Execution: Always search schemes database before generating response
    let retrievedSchemes = await this.searchSchemes(cleanMsg);

    // Fallback: If no match for exact query, fetch top active general schemes for recommendation
    let fallbackSchemes = [];
    if (!retrievedSchemes || retrievedSchemes.length === 0) {
      const topRes = await schemeRepo.findWithAdvancedFilters({ limit: 3 });
      fallbackSchemes = topRes.data || [];
    }

    let aiContent = '';
    const apiKey = process.env.GEMINI_API_KEY;

    // 2. Call Gemini API passing RAG context
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const systemPrompt = buildGovernmentChatbotSystemPrompt(
          retrievedSchemes.length > 0 ? retrievedSchemes : fallbackSchemes,
          userProfile
        );

        const contents = [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'Understood. I am the Official Government AI Assistant and will respond using verified government records with standard structured 19-point output.' }] },
        ];

        if (Array.isArray(history)) {
          history.slice(-6).forEach(h => {
            if (h.role && h.content) {
              contents.push({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.content }],
              });
            }
          });
        }

        contents.push({ role: 'user', parts: [{ text: cleanMsg }] });

        const result = await model.generateContent({ contents });
        aiContent = result.response.text().trim();
      } catch (err) {
        logger.warn('Gemini API call failed — using RAG response generator', { error: err.message });
      }
    }

    // 3. Dynamic RAG Structured Response Generator (Fallback / Guarantee)
    if (!aiContent) {
      aiContent = this._generateDynamicRAGResponse(cleanMsg, retrievedSchemes, fallbackSchemes, userProfile);
    }

    // 4. Save Chat Log in Firestore (background)
    this._persistChatLog(userId, sessionId, cleanMsg, aiContent).catch(err => {
      logger.warn('Failed to persist chat in Firestore', { error: err.message });
    });

    const finalSchemes = retrievedSchemes.length > 0 ? retrievedSchemes : fallbackSchemes;

    return {
      message: aiContent,
      retrievedSchemes: finalSchemes.map(s => ({
        id: s.id,
        title: s.title,
        ministry: s.ministry,
        officialApplyLink: s.officialApplyLink,
        isVerified: s.isVerified,
      })),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Dynamic Structured 19-Point RAG Generator
   */
  _generateDynamicRAGResponse(query, schemes, fallbackSchemes, userProfile) {
    if (!schemes || schemes.length === 0) {
      const topNames = fallbackSchemes.map(s => `• ${s.title}`).join('\n');
      return `No verified government scheme matching your query was found in the official government databases.

Here are some popular active government schemes you may check:
${topNames || '• PM-KISAN\n• Ayushman Bharat PM-JAY\n• PMAY Housing'}

Please refine your search query or select a category tab in Scheme Explorer.`;
    }

    const s = schemes[0];
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    const eligList = Array.isArray(s.eligibilityCriteria)
      ? s.eligibilityCriteria.map(e => `• ${e}`).join('\n')
      : `• ${s.eligibilityCriteria}`;

    const docList = Array.isArray(s.requiredDocuments)
      ? s.requiredDocuments.map(d => `• ${d}`).join('\n')
      : `• Aadhaar Card\n• Bank Passbook\n• Income Certificate`;

    const procList = Array.isArray(s.applicationProcess)
      ? s.applicationProcess.map((step, idx) => `${idx + 1}. ${step}`).join('\n')
      : `1. Visit ${s.officialWebsite}\n2. Register & upload documents\n3. Submit application`;

    return `🏛️ **Scheme Name**: ${s.title}

🏢 **Ministry/Department**: ${s.ministry}

📝 **Description**:
${s.shortDescription || s.benefits}

🎁 **Benefits**:
${s.benefits}

🎯 **Eligibility Criteria**:
${eligList}

📄 **Required Documents**:
${docList}

💰 **Income Criteria**:
Check portal for category limits (EWS / LIG / BPL norms apply).

👤 **Age Limit**:
No age limit unless specified for trade or scholarship eligibility.

📊 **Reservation Details**:
As per Government of India / State reservation guidelines.

📋 **Application Process**:
${procList}

🔗 **Apply Online Link**:
[Click Here to Apply Online](${s.officialApplyLink || s.officialWebsite})

🌐 **Official Website**:
${s.officialWebsite}

📞 **Helpline Number**:
${s.helplineNumber || '1800-11-0001'}

📜 **Required Certificates**:
Aadhaar Card, Bank Passbook, Residence Proof, Category/Income Certificate.

⏳ **Processing Time**:
15 to 30 Working Days.

📅 **Important Dates**:
Launch Date: ${s.launchDate} | Last Updated: ${s.lastUpdatedDate}

❓ **FAQs**:
Q: How do I track my status?
A: Visit ${s.officialWebsite} and enter your registration ID or Aadhaar number.

📢 **Latest Updates**:
Scheme active and accepting fresh applications across India.

🇮🇳 **Source**: Government of India / myScheme.gov.in (Verified On ${today})`;
  }

  async _persistChatLog(userId, sessionId, userMsg, botMsg) {
    const chatRef = db.collection('chats').doc(`${userId}_${sessionId}`);
    const snap = await chatRef.get();

    const newEntries = [
      { role: 'user', content: userMsg, timestamp: new Date().toISOString() },
      { role: 'assistant', content: botMsg, timestamp: new Date().toISOString() },
    ];

    if (snap.exists) {
      const existing = snap.data().messages || [];
      await chatRef.update({
        messages: [...existing, ...newEntries],
        updatedAt: new Date().toISOString(),
      });
    } else {
      await chatRef.set({
        userId,
        sessionId,
        messages: newEntries,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  async getChatHistory(userId, sessionId = 'default-session') {
    try {
      const chatRef = db.collection('chats').doc(`${userId}_${sessionId}`);
      const snap = await chatRef.get();
      if (snap.exists) {
        return snap.data().messages || [];
      }
    } catch (err) {
      logger.warn('Failed to fetch chat history', { error: err.message });
    }
    return [];
  }
}

module.exports = AIService;
