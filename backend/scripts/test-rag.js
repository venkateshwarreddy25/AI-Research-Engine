'use strict';

require('dotenv').config();
const AIService = require('../src/services/ai.service');

async function testRAG() {
  const aiService = new AIService();
  const testQueries = ['PMJAY', 'PMAY', 'PM Kisan', 'NSP', 'Mudra', 'Scholarship'];

  console.log('--- TESTING FUNCTION CALLING RAG ENGINE ---');

  for (const q of testQueries) {
    const res = await aiService.chat({ message: q });
    console.log(`\n========================================`);
    console.log(`QUERY: "${q}"`);
    console.log(`RETRIEVED SCHEMES: ${res.retrievedSchemes.map(s => s.title).join(', ')}`);
    console.log(`RESPONSE PREVIEW:\n${res.message.slice(0, 300)}...`);
  }

  process.exit(0);
}

testRAG().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
