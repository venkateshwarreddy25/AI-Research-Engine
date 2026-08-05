// Route path constants
export const ROUTES = {
  // Public
  HOME:     '/',
  ABOUT:    '/about',

  // Auth
  LOGIN:    '/login',
  REGISTER: '/register',
  FORGOT:   '/forgot-password',

  // Citizen
  DASHBOARD:         '/dashboard',
  CHATBOT:           '/chat',
  SCHEMES:           '/schemes',
  SCHEME_DETAIL:     (id = ':schemeId') => `/schemes/${id}`,
  SCHEME_COMPARE:    '/schemes/compare',
  SAVED_SCHEMES:     '/schemes/saved',
  ELIGIBILITY:       '/eligibility',
  APPLICATIONS:      '/applications',
  APPLICATION_DETAIL:(id = ':applicationId') => `/applications/${id}`,
  DOCUMENTS:         '/documents',
  OCR_RESULT:        (id = ':documentId') => `/documents/${id}/result`,
  NOTIFICATIONS:     '/notifications',
  COMPLAINTS:        '/complaints',
  NEARBY_OFFICES:    '/offices',
  PDF_SUMMARIZER:    '/pdf-summarizer',
  PROFILE:           '/profile',

  // Admin
  ADMIN:                  '/admin',
  ADMIN_DASHBOARD:        '/admin/dashboard',
  ADMIN_SCHEMES:          '/admin/schemes',
  ADMIN_SCHEME_EDITOR:    '/admin/schemes/editor',
  ADMIN_USERS:            '/admin/users',
  ADMIN_COMPLAINTS:       '/admin/complaints',
  ADMIN_ANALYTICS:        '/admin/analytics',
  ADMIN_OFFICES:          '/admin/offices',
  ADMIN_NOTIFICATIONS:    '/admin/notifications',
  ADMIN_AUDIT_LOGS:       '/admin/audit-logs',
};
