'use strict';

/**
 * Government Schemes Alias & Acronym Expansion Dictionary
 * Maps user abbreviations, colloquial names, and acronyms to official search terms.
 */
const SCHEME_ALIAS_DICTIONARY = {
  // Abbreviations & Acronyms
  'pmjay': 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana PM-JAY Health',
  'pm-jay': 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana PM-JAY Health',
  'ayushman': 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana PM-JAY Health',
  'ayushman bharat': 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana PM-JAY Health',
  'ayushman card': 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana PM-JAY Health',

  'pmay': 'Pradhan Mantri Awas Yojana Urban Gramin Housing',
  'pmay-u': 'Pradhan Mantri Awas Yojana Urban Housing 2.0',
  'pmay-g': 'Pradhan Mantri Awas Yojana Gramin Housing',
  'awas yojana': 'Pradhan Mantri Awas Yojana Urban Gramin Housing',
  'housing scheme': 'Pradhan Mantri Awas Yojana Urban Gramin Housing',

  'pm kisan': 'Pradhan Mantri Kisan Samman Nidhi PM-KISAN Agriculture Farmers',
  'pm-kisan': 'Pradhan Mantri Kisan Samman Nidhi PM-KISAN Agriculture Farmers',
  'kisan samman': 'Pradhan Mantri Kisan Samman Nidhi PM-KISAN Agriculture Farmers',
  'farmer scheme': 'Pradhan Mantri Kisan Samman Nidhi PM-KISAN Agriculture Farmers',
  'farmer 6000': 'Pradhan Mantri Kisan Samman Nidhi PM-KISAN Agriculture Farmers',

  'nsp': 'National Scholarship Portal PM Vidyalaxmi Scheme Student Education',
  'scholarship': 'National Scholarship Portal PM Vidyalaxmi Scheme Student Education',
  'student scholarship': 'National Scholarship Portal PM Vidyalaxmi Scheme Student Education',
  'education loan': 'National Scholarship Portal PM Vidyalaxmi Scheme Student Education',
  'vidyalaxmi': 'National Scholarship Portal PM Vidyalaxmi Scheme Student Education',

  'mudra': 'Pradhan Mantri Mudra Yojana PMMY Business Loan MSME',
  'mudra loan': 'Pradhan Mantri Mudra Yojana PMMY Business Loan MSME',
  'pmmy': 'Pradhan Mantri Mudra Yojana PMMY Business Loan MSME',
  'business loan': 'Pradhan Mantri Mudra Yojana PMMY Business Loan MSME',

  'vishwakarma': 'PM Vishwakarma Scheme Artisan MSME Skill',
  'pm vishwakarma': 'PM Vishwakarma Scheme Artisan MSME Skill',
  'artisan scheme': 'PM Vishwakarma Scheme Artisan MSME Skill',

  'lakhpati': 'Lakhpati Didi Scheme Women Self Help Group SHG Rural',
  'lakhpati didi': 'Lakhpati Didi Scheme Women Self Help Group SHG Rural',
  'women scheme': 'Lakhpati Didi Scheme Women Self Help Group SHG Rural',
  'shg women': 'Lakhpati Didi Scheme Women Self Help Group SHG Rural',

  'mgnrega': 'Mahatma Gandhi National Rural Employment Guarantee Act MGNREGS Employment',
  'nrega': 'Mahatma Gandhi National Rural Employment Guarantee Act MGNREGS Employment',
  'mgnregs': 'Mahatma Gandhi National Rural Employment Guarantee Act MGNREGS Employment',
  'employment scheme': 'Mahatma Gandhi National Rural Employment Guarantee Act MGNREGS Employment',

  'sukanya': 'Sukanya Samriddhi Yojana Girl Child Financial',
  'pmegp': 'Prime Minister Employment Generation Programme PMEGP MSME Business',
  'fasal bima': 'PM Fasal Bima Yojana Crop Insurance Farmers Agriculture',
  'crop insurance': 'PM Fasal Bima Yojana Crop Insurance Farmers Agriculture',
};

/**
 * Expand search query using alias dictionary and keyword normalization
 * @param {string} userQuery
 * @returns {{ expandedQuery: string, tokens: string[] }}
 */
function expandQueryAliases(userQuery = '') {
  const clean = (userQuery || '').toLowerCase().trim();
  if (!clean) return { expandedQuery: '', tokens: [] };

  const tokens = clean.split(/\s+/);
  const expandedTerms = new Set(tokens);

  // Check full query match
  if (SCHEME_ALIAS_DICTIONARY[clean]) {
    SCHEME_ALIAS_DICTIONARY[clean].split(/\s+/).forEach(t => expandedTerms.add(t.toLowerCase()));
  }

  // Check sub-token matches
  for (const token of tokens) {
    if (SCHEME_ALIAS_DICTIONARY[token]) {
      SCHEME_ALIAS_DICTIONARY[token].split(/\s+/).forEach(t => expandedTerms.add(t.toLowerCase()));
    }
  }

  const tokenList = Array.from(expandedTerms);
  return {
    expandedQuery: tokenList.join(' '),
    tokens: tokenList,
  };
}

module.exports = { SCHEME_ALIAS_DICTIONARY, expandQueryAliases };
