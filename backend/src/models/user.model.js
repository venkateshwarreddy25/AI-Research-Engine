'use strict';

/**
 * Creates a standard user document structure for Firestore database
 * @param {string} uid - Firebase Auth user UID
 * @param {Object} data - Input user data parameters
 * @returns {Object} Firestore user document model
 */
const createUserDocument = (uid, data) => ({
  uid,
  email: data.email || '',
  displayName: data.displayName || '',
  photoURL: data.photoURL || '',
  phone: data.phone || null,
  role: data.role || 'citizen',
  gender: data.gender || null,
  age: data.age || null,
  dateOfBirth: data.dateOfBirth || null,
  state: data.state || null,
  district: data.district || null,
  pincode: data.pincode || null,
  occupation: data.occupation || null,
  annualIncome: data.annualIncome || null,
  casteCategory: data.casteCategory || null,
  isDisabled: data.isDisabled || false,
  preferredLanguage: data.preferredLanguage || 'en',
  isActive: true,
  isEmailVerified: data.isEmailVerified || false,
  isMFAEnabled: false,
  fcmToken: null,
  notificationPrefs: {
    email: true,
    push: true,
    inApp: true,
  },
  stats: {
    applicationsCount: 0,
    savedSchemesCount: 0,
    complaintsCount: 0,
  },
  provider: data.provider || 'email',
  lastLoginAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

module.exports = { createUserDocument };
