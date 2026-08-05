'use strict';

const crypto = require('crypto');

const ALGORITHM    = 'aes-256-gcm';
const KEY_HEX      = process.env.ENCRYPTION_KEY || '64616d656c6f63616c656e6372797074696f6e6b65796c6f63616c6465766b65'; // 64 hex chars = 32 bytes
const IV_LENGTH    = 16;
const TAG_LENGTH   = 16;

if (!KEY_HEX || KEY_HEX.length !== 64) {
  throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
}

const ENCRYPTION_KEY = Buffer.from(KEY_HEX, 'hex');

/**
 * Encrypt sensitive PII field value using AES-256-GCM.
 * Used for: Aadhaar numbers, PAN numbers, bank account numbers.
 *
 * @param {string} plaintext - Sensitive value to encrypt
 * @returns {string} Encrypted string: `enc:iv:authTag:ciphertext` (all hex)
 */
function encrypt(plaintext) {
  if (!plaintext) return plaintext;

  const iv         = crypto.randomBytes(IV_LENGTH);
  const cipher     = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  const encrypted  = Buffer.concat([
    cipher.update(String(plaintext), 'utf8'),
    cipher.final(),
  ]);
  const authTag    = cipher.getAuthTag();

  return `enc:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypt an encrypted PII field value.
 * @param {string} encryptedValue - Value from Firestore (must start with 'enc:')
 * @returns {string} Original plaintext
 */
function decrypt(encryptedValue) {
  if (!encryptedValue || !encryptedValue.startsWith('enc:')) {
    return encryptedValue; // Not encrypted — return as-is
  }

  const parts = encryptedValue.split(':');
  if (parts.length !== 4) {
    throw new Error('Invalid encrypted value format');
  }

  const [, ivHex, authTagHex, cipherHex] = parts;
  const iv         = Buffer.from(ivHex, 'hex');
  const authTag    = Buffer.from(authTagHex, 'hex');
  const ciphertext = Buffer.from(cipherHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

/**
 * Mask a sensitive value for display — show only last 4 characters.
 * @param {string} value - e.g. Aadhaar number '1234 5678 9012'
 * @returns {string} e.g. 'XXXX XXXX 9012'
 */
function mask(value, visibleChars = 4) {
  if (!value) return value;
  const str    = String(value).replace(/\s/g, '');
  const masked = str.slice(0, -visibleChars).replace(/\d/g, 'X');
  const visible = str.slice(-visibleChars);
  return `${masked}${visible}`;
}

/**
 * Encrypt fields in a Firestore document before writing.
 * Only encrypts fields that are in the ENCRYPT_FIELDS list.
 */
const ENCRYPT_FIELDS = new Set(['aadhaarNumber', 'panNumber', 'bankAccountNumber', 'ifscCode']);

function encryptDocumentFields(docData) {
  const result = { ...docData };
  for (const field of ENCRYPT_FIELDS) {
    if (result[field]) {
      result[field] = encrypt(result[field]);
    }
  }
  return result;
}

function decryptDocumentFields(docData) {
  const result = { ...docData };
  for (const field of ENCRYPT_FIELDS) {
    if (result[field]?.startsWith('enc:')) {
      result[field] = decrypt(result[field]);
    }
  }
  return result;
}

module.exports = { encrypt, decrypt, mask, encryptDocumentFields, decryptDocumentFields };
