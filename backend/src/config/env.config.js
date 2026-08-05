'use strict';

const REQUIRED_VARS = [
  'NODE_ENV',
  'PORT',
  'FIREBASE_PROJECT_ID',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'GEMINI_API_KEY',
  'PINECONE_API_KEY',
  'PINECONE_INDEX_NAME',
  'ENCRYPTION_KEY',
];

/**
 * Validates all required environment variables on startup.
 * Throws immediately if any are missing — fail fast principle.
 */
function validateEnv() {
  const missing = REQUIRED_VARS.filter(key => !process.env[key]);
  if (missing.length > 0) {
    // In local development we can mock some missing ones if needed, but in production we fail fast.
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        `Missing required environment variables:\n  ${missing.join('\n  ')}\n` +
        'Check your .env file or deployment environment.'
      );
    } else {
      console.warn(`⚠️ Missing environment variables in development: ${missing.join(', ')}`);
    }
  } else {
    console.info('✅ All environment variables validated');
  }
}

module.exports = { validateEnv };
