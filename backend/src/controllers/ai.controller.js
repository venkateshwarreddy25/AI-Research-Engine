'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const AIService = require('../services/ai.service');

const aiService = new AIService();

const AIController = {
  /**
   * POST /api/v1/ai/chat
   * Dynamic RAG Chat completion
   */
  chat: asyncHandler(async (req, res) => {
    const { message, history, userProfile, sessionId } = req.body;
    const userId = req.user?.uid || 'guest';
    
    const result = await aiService.chat({
      message,
      history,
      userProfile,
      sessionId: sessionId || 'default-session',
      userId,
    });

    ApiResponse.ok(res, 'AI response generated successfully', result);
  }),

  /**
   * GET /api/v1/ai/history
   * Fetch chat logs from Firestore
   */
  getHistory: asyncHandler(async (req, res) => {
    const userId = req.user?.uid || 'guest';
    const sessionId = req.query.sessionId || 'default-session';
    const history = await aiService.getChatHistory(userId, sessionId);
    ApiResponse.ok(res, 'Chat history fetched', history);
  }),
};

module.exports = AIController;
