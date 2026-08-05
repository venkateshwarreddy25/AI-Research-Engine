'use strict';

const { Pinecone } = require('@pinecone-database/pinecone');
const logger = require('../utils/logger');

let pineconeClient = null;
let pineconeIndex  = null;

/**
 * Returns initialised Pinecone client (singleton)
 * @returns {Pinecone}
 */
function getPineconeClient() {
  if (!pineconeClient) {
    const apiKey = process.env.PINECONE_API_KEY || 'dummy-pinecone-key';
    pineconeClient = new Pinecone({ apiKey });
    logger.info('Pinecone client initialised');
  }
  return pineconeClient;
}

/**
 * Returns the target Pinecone index (singleton)
 * @returns {Index}
 */
function getPineconeIndex() {
  if (!pineconeIndex) {
    const client = getPineconeClient();
    const indexName = process.env.PINECONE_INDEX_NAME || 'dummy-index';
    pineconeIndex = client.index(indexName);
    logger.info(`Pinecone index ready: ${indexName}`);
  }
  return pineconeIndex;
}

module.exports = { getPineconeClient, getPineconeIndex };
