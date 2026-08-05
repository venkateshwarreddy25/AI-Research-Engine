// API endpoint constants
export const API = {
  AUTH: {
    GOOGLE:   '/auth/google',
    REGISTER: '/auth/register',
    LOGIN:    '/auth/login',
    LOGOUT:   '/auth/logout',
    REFRESH:  '/auth/refresh',
    ME:       '/auth/me',
  },
  SCHEMES: {
    LIST:         '/schemes',
    DETAIL:       (id) => `/schemes/${id}`,
    SAVE:         (id) => `/schemes/${id}/save`,
    UNSAVE:       (id) => `/schemes/${id}/save`,
    SAVED:        '/schemes/saved',
    ELIGIBILITY:  (id) => `/schemes/${id}/eligibility`,
  },
  AI: {
    CHAT:         '/ai/chat',
    RECOMMEND:    '/ai/recommend',
    ELIGIBILITY:  '/ai/eligibility',
    SUMMARIZE:    '/ai/summarize',
    VOICE_STT:    '/voice/stt',
    VOICE_TTS:    '/voice/tts',
  },
  APPLICATIONS: {
    LIST:         '/applications',
    CREATE:       '/applications',
    DETAIL:       (id) => `/applications/${id}`,
    UPDATE:       (id) => `/applications/${id}`,
  },
  DOCUMENTS: {
    LIST:         '/documents',
    UPLOAD:       '/documents/upload',
    DETAIL:       (id) => `/documents/${id}`,
    OCR:          (id) => `/documents/${id}/ocr`,
  },
  NOTIFICATIONS: {
    LIST:         '/notifications',
    READ:         (id) => `/notifications/${id}/read`,
    READ_ALL:     '/notifications/read-all',
  },
  COMPLAINTS: {
    LIST:         '/complaints',
    CREATE:       '/complaints',
    DETAIL:       (id) => `/complaints/${id}`,
  },
  OFFICES: {
    LIST:         '/offices',
    NEARBY:       '/offices/nearby',
  },
  ADMIN: {
    USERS:        '/admin/users',
    USER_ROLE:    (id) => `/admin/users/${id}/role`,
    SCHEMES:      '/admin/schemes',
    ANALYTICS:    '/admin/analytics',
    AUDIT_LOGS:   '/admin/audit-logs',
    COMPLAINTS:   '/admin/complaints',
  },
  USER: {
    STATS:        (uid) => `/users/${uid}/stats`,
    PROFILE:      (uid) => `/users/${uid}`,
  },
  HEALTH:         '/health',
};
