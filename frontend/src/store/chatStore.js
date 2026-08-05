import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export const useChatStore = create((set, get) => ({
  sessions:        {},    // { [sessionId]: { messages: [], title: '' } }
  activeSessionId: null,
  isStreaming:     false,
  streamingText:   '',

  /** Start a new chat session */
  startNewSession: () => {
    const sessionId = uuidv4();
    set((s) => ({
      sessions: {
        ...s.sessions,
        [sessionId]: {
          messages:  [],
          title:     'New Chat',
          createdAt: new Date().toISOString(),
        },
      },
      activeSessionId: sessionId,
      streamingText:   '',
      isStreaming:     false,
    }));
    return sessionId;
  },

  /** Switch to an existing session */
  setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),

  /** Add a complete message to a session */
  addMessage: (sessionId, message) => set((s) => ({
    sessions: {
      ...s.sessions,
      [sessionId]: {
        ...s.sessions[sessionId],
        messages: [...(s.sessions[sessionId]?.messages || []), message],
      },
    },
  })),

  /** Append SSE streaming chunk to the live text buffer */
  appendStreamChunk: (chunk) => set((s) => ({
    streamingText: s.streamingText + chunk,
    isStreaming:   true,
  })),

  /** Finalise the streamed response — save as assistant message */
  finaliseStreamedMessage: (sessionId, sources, quickReplies) => {
    const { streamingText } = get();
    const message = {
      id:          uuidv4(),
      role:        'assistant',
      content:     streamingText,
      sources:     sources || [],
      quickReplies:quickReplies || [],
      createdAt:   new Date().toISOString(),
    };
    set((s) => ({
      sessions: {
        ...s.sessions,
        [sessionId]: {
          ...s.sessions[sessionId],
          messages: [...(s.sessions[sessionId]?.messages || []), message],
        },
      },
      isStreaming:   false,
      streamingText: '',
    }));
  },

  /** Get messages for the active session */
  getActiveMessages: () => {
    const { sessions, activeSessionId } = get();
    return sessions[activeSessionId]?.messages || [];
  },

  /** Clear all sessions */
  clearAll: () => set({ sessions: {}, activeSessionId: null }),
}));
