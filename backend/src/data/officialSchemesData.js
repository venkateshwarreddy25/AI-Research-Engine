'use strict';

/**
 * Official Government of India Verified Schemes Dataset
 * Sourced from myScheme.gov.in, data.gov.in, and Official Ministry Portals.
 */
const OFFICIAL_SCHEMES_DATASET = [
  {
    schemeId: 'GOI-AGRI-001',
    title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Agriculture',
    launchDate: '2019-02-24',
    lastUpdatedDate: '2026-07-01',
    status: 'active',
    scope: 'central',
    applicableStates: [], // All India
    targetBeneficiaries: ['Farmers', 'Landholder Farmers'],
    benefits: '₹6,000 per year transferred directly into bank accounts in three equal installments of ₹2,000 every 4 months.',
    shortDescription: 'Direct income support of ₹6,000 per year for landholding farmer families across India.',
    eligibilityCriteria: [
      'All landholding farmers families having cultivable landholding in their names.',
      'Must have an active bank account linked with Aadhaar.',
      'e-KYC verification must be completed on PM-KISAN portal.',
      'Excludes institutional landholders, high-income taxpayers, and serving/retired government employees.'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Proof of Citizenship',
      'Land Holding Documents (Khatauni/Khasra)',
      'Bank Account Passbook (Aadhaar linked)',
      'Mobile Number linked with Aadhaar'
    ],
    applicationProcess: [
      'Visit the official PM-KISAN portal at pmkisan.gov.in.',
      'Click on "Farmers Corner" -> "New Farmer Registration".',
      'Enter Aadhaar Number, select State, and verify OTP.',
      'Fill in land details and bank account numbers.',
      'Submit the form and record your Registration ID for status tracking.'
    ],
    officialWebsite: 'https://pmkisan.gov.in',
    officialApplyLink: 'https://pmkisan.gov.in/RegistrationFormnew.aspx',
    helplineNumber: '155261 / 1800115526',
    budget: '₹60,000 Crore (Annual Budget Allocation)',
    faqs: [
      {
        question: 'Who is eligible for PM-KISAN benefits?',
        answer: 'All small and marginal landholding farmer families with cultivable land in their names are eligible.'
      },
      {
        question: 'Is e-KYC mandatory for receiving installments?',
        answer: 'Yes, e-KYC is mandatory for all PM-KISAN registered farmers. It can be completed via OTP on the portal or biometric at nearest CSC.'
      }
    ],
    tags: ['Farmers', 'Agriculture', 'Financial Assistance', 'Direct Benefit Transfer'],
    isVerified: true,
    isNewlyLaunched: false,
    isRecentlyUpdated: true,
    isExpiring: false,
  },
  {
    schemeId: 'GOI-HEALTH-002',
    title: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    ministry: 'Ministry of Health & Family Welfare',
    category: 'Health',
    launchDate: '2018-09-23',
    lastUpdatedDate: '2026-06-15',
    status: 'active',
    scope: 'central',
    applicableStates: [],
    targetBeneficiaries: ['Senior Citizens', 'Low-Income Families', 'BPL Families', 'Rural & Urban Poor'],
    benefits: 'Health insurance cover of ₹5 Lakh per family per year for secondary and tertiary care hospitalization across impaneled public & private hospitals.',
    shortDescription: 'World’s largest health assurance scheme providing ₹5 Lakh free health cover per family annually.',
    eligibilityCriteria: [
      'Families identified under SECC 2011 (Socio-Economic Caste Census) database.',
      'Occupational categories of urban workers and rural households without adult male earning members.',
      'All Senior Citizens aged 70 years and above (Ayushman Vaya Vandana Card) regardless of income.'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Ration Card / PM-JAY Family ID',
      'Active Mobile Number'
    ],
    applicationProcess: [
      'Visit beneficiary.nha.gov.in or download the Ayushman App.',
      'Login using your Mobile Number and verify with OTP.',
      'Search for your family by Ration Card, Aadhaar, or PM-JAY ID.',
      'Perform e-KYC using Aadhaar OTP or face authentication.',
      'Download your Ayushman Card instantly upon approval.'
    ],
    officialWebsite: 'https://pmjay.gov.in',
    officialApplyLink: 'https://beneficiary.nha.gov.in',
    helplineNumber: '14555 / 1800111565',
    budget: '₹7,200 Crore',
    faqs: [
      {
        question: 'What expenses are covered under Ayushman Bharat?',
        answer: 'It covers medical examination, treatment, consultation, pre and post-hospitalization, medicines, ICU charges, and diagnostics for 1,900+ procedures.'
      }
    ],
    tags: ['Health', 'Senior Citizens', 'Free Medical Cover', 'Financial Assistance'],
    isVerified: true,
    isNewlyLaunched: false,
    isRecentlyUpdated: true,
    isExpiring: false,
  },
  {
    schemeId: 'GOI-HOUSING-003',
    title: 'Pradhan Mantri Awas Yojana - Urban (PMAY-U 2.0)',
    ministry: 'Ministry of Housing & Urban Affairs',
    category: 'Housing',
    launchDate: '2024-09-01',
    lastUpdatedDate: '2026-07-10',
    status: 'active',
    scope: 'central',
    applicableStates: [],
    targetBeneficiaries: ['Urban Poor', 'EWS', 'LIG', 'Middle Income Group (MIG)', 'Women'],
    benefits: 'Financial subsidy up to ₹2.5 Lakh for constructing or purchasing a pucca house in urban areas.',
    shortDescription: 'Housing for All scheme providing financial assistance and interest subvention for urban pucca houses.',
    eligibilityCriteria: [
      'Family should not own a pucca house anywhere in India in their or any family member name.',
      'Economically Weaker Section (EWS) annual income up to ₹3 Lakh.',
      'Low Income Group (LIG) annual income between ₹3 Lakh to ₹6 Lakh.',
      'House ownership must be in the name of female head or joint ownership.'
    ],
    requiredDocuments: [
      'Aadhaar Card of all family members',
      'Income Certificate / ITR',
      'Affidavit of no pucca house ownership',
      'Bank Account Details',
      'Property / Land Ownership papers (for construction)'
    ],
    applicationProcess: [
      'Visit pmaymis.gov.in portal.',
      'Select "Citizen Assessment" -> "Apply Online".',
      'Enter Aadhaar number and verify via OTP.',
      'Fill personal details, income details, and current address.',
      'Submit the application and download the registration slip.'
    ],
    officialWebsite: 'https://pmaymis.gov.in',
    officialApplyLink: 'https://pmaymis.gov.in/Open/CheckAadhar.aspx',
    helplineNumber: '011-23063285 / 011-23060484',
    budget: '₹10,000 Crore',
    faqs: [
      {
        question: 'Can unmarried individuals apply for PMAY-U?',
        answer: 'Single earning adults can apply provided they do not own a house and meet income criteria.'
      }
    ],
    tags: ['Housing', 'Urban Development', 'Newly Launched', 'Financial Assistance'],
    isVerified: true,
    isNewlyLaunched: true,
    isRecentlyUpdated: true,
    isExpiring: false,
  },
  {
    schemeId: 'GOI-EDU-004',
    title: 'National Scholarship Portal - PM Vidyalaxmi Scheme',
    ministry: 'Ministry of Education',
    category: 'Education',
    launchDate: '2024-11-06',
    lastUpdatedDate: '2026-06-20',
    status: 'active',
    scope: 'central',
    applicableStates: [],
    targetBeneficiaries: ['Students', 'Higher Education Students', 'Meritorious Youth'],
    benefits: 'Collateral-free, guarantor-free education loans up to ₹10 Lakh with 7.5% interest subvention for students pursuing higher education in top 860 quality institutions.',
    shortDescription: 'Financial support for meritorious students to pursue higher education without financial barriers.',
    eligibilityCriteria: [
      'Student admitted to top 860 Higher Educational Institutions (HEIs) NIRF ranked in India.',
      'Family annual income up to ₹8 Lakh (for interest subvention benefit).',
      'Must not be availing full scholarship from any other government scheme.'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      '10th & 12th Marksheets',
      'Admission Letter from Recognized HEI',
      'Family Income Certificate',
      'Fee Structure Document from Institution'
    ],
    applicationProcess: [
      'Visit the PM Vidyalaxmi portal at pmvidyalaxmi.gov.in or scholarships.gov.in.',
      'Register with Student Aadhaar and mobile number.',
      'Fill academic details and select institution & course.',
      'Upload fee structure and income certificate.',
      'Submit loan/subvention application directly to participating banks.'
    ],
    officialWebsite: 'https://scholarships.gov.in',
    officialApplyLink: 'https://pmvidyalaxmi.gov.in',
    helplineNumber: '0120-6619540',
    budget: '₹3,600 Crore',
    faqs: [
      {
        question: 'Is collateral needed for PM Vidyalaxmi education loan?',
        answer: 'No collateral or third-party guarantee is required for loans up to ₹7.5 Lakh.'
      }
    ],
    tags: ['Education', 'Students', 'Newly Launched', 'Scholarship', 'Loan Subvention'],
    isVerified: true,
    isNewlyLaunched: true,
    isRecentlyUpdated: false,
    isExpiring: false,
  },
  {
    schemeId: 'GOI-MSME-005',
    title: 'PM Vishwakarma Scheme',
    ministry: 'Ministry of Micro, Small and Medium Enterprises',
    category: 'Business',
    launchDate: '2023-09-17',
    lastUpdatedDate: '2026-07-05',
    status: 'active',
    scope: 'central',
    applicableStates: [],
    targetBeneficiaries: ['MSMEs', 'Artisans', 'Craftspeople', 'Traditional Workers'],
    benefits: 'PM Vishwakarma ID Card, basic skill training with stipend of ₹500/day, toolkit incentive of ₹15,000, and collateral-free credit support up to ₹3 Lakh at concessional interest rate of 5%.',
    shortDescription: 'End-to-end support for traditional artisans and craftspeople across 18 traditional trades.',
    eligibilityCriteria: [
      'Artisan or craftsperson working with hands and tools in one of 18 family-based traditional trades (Carpenter, Blacksmith, Goldsmith, Potter, Sculptor, Weaver, etc.).',
      'Minimum age of 18 years on date of registration.',
      'Should not have availed loan under similar credit-based schemes (PMEGP, PM SVANidhi, MUDRA) in last 5 years.'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Active Mobile Number linked with Aadhaar',
      'Bank Account Passbook',
      'Ration Card / Trade Proof'
    ],
    applicationProcess: [
      'Visit nearest Common Services Centre (CSC) or pmvishwakarma.gov.in portal.',
      'Complete Mobile & Aadhaar authentication.',
      'Fill Artisan Registration Form and select your specific trade.',
      'Gram Panchayat / Urban Local Body verification.',
      'Receive PM Vishwakarma ID card and download toolkit voucher.'
    ],
    officialWebsite: 'https://pmvishwakarma.gov.in',
    officialApplyLink: 'https://pmvishwakarma.gov.in/Home/ApplicantRegistration',
    helplineNumber: '18002677777 / 011-23061574',
    budget: '₹13,000 Crore',
    faqs: [
      {
        question: 'Which trades are covered under PM Vishwakarma?',
        answer: '18 traditional trades including Carpenter, Boat Maker, Armourer, Blacksmith, Hammer and Tool Kit Maker, Locksmith, Goldsmith, Potter, Sculptor, Cobbler, Mason, Basket Maker, Doll & Toy Maker, Barber, Garland Maker, Washerman, Tailor, and Fishing Net Maker.'
      }
    ],
    tags: ['Business', 'MSMEs', 'Artisans', 'Skill Development', 'Financial Assistance'],
    isVerified: true,
    isNewlyLaunched: false,
    isRecentlyUpdated: true,
    isExpiring: false,
  },
  {
    schemeId: 'GOI-WOMEN-006',
    title: 'Lakhpati Didi Scheme',
    ministry: 'Ministry of Rural Development',
    category: 'Financial Assistance',
    launchDate: '2023-08-15',
    lastUpdatedDate: '2026-06-28',
    status: 'active',
    scope: 'central',
    applicableStates: [],
    targetBeneficiaries: ['Women', 'Self Help Group (SHG) Members', 'Rural Women'],
    benefits: 'Skill training in financial literacy, micro-enterprise management, LED bulb making, drone operation (Namo Drone Didi), agriculture, and business loans up to ₹5 Lakh at 0% to 5% interest.',
    shortDescription: 'Empowering 3 Crore rural women in Self Help Groups to earn an annual income of ₹1 Lakh or more.',
    eligibilityCriteria: [
      'Must be an active member of a registered Self Help Group (SHG) under DAY-NRLM.',
      'Must reside in rural or semi-urban areas.',
      'Willingness to participate in micro-enterprise skill training programs.'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'SHG Membership ID / Passbook',
      'Bank Account Passbook',
      'Passport size Photographs'
    ],
    applicationProcess: [
      'Contact your local SHG Group Leader or Village Level Organization (VLO).',
      'Register for Lakhpati Didi skill module via DAY-NRLM portal at nrlm.gov.in.',
      'Complete specialized micro-enterprise training.',
      'Prepare business plan and submit loan request through SHG federation.'
    ],
    officialWebsite: 'https://nrlm.gov.in',
    officialApplyLink: 'https://nrlm.gov.in/lakhpatididi',
    helplineNumber: '011-23383628',
    budget: '₹15,000 Crore',
    faqs: [
      {
        question: 'What is a Lakhpati Didi?',
        answer: 'A Lakhpati Didi is a Self Help Group (SHG) woman member whose annual household income reaches ₹1,00,000 or more through sustainable livelihood activities.'
      }
    ],
    tags: ['Women', 'Financial Assistance', 'Skill Development', 'Rural Development', 'Popular'],
    isVerified: true,
    isNewlyLaunched: false,
    isRecentlyUpdated: true,
    isExpiring: false,
  },
  {
    schemeId: 'GOI-EMPLOYMENT-007',
    title: 'Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)',
    ministry: 'Ministry of Rural Development',
    category: 'Employment',
    launchDate: '2006-02-02',
    lastUpdatedDate: '2026-07-02',
    status: 'active',
    scope: 'central',
    applicableStates: [],
    targetBeneficiaries: ['Rural Households', 'Unskilled Workers', 'Farmers'],
    benefits: 'Guaranteed 100 days of wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work.',
    shortDescription: 'Statutory wage employment guarantee scheme providing 100 days guaranteed manual work in rural India.',
    eligibilityCriteria: [
      'Must be a citizen of India residing in a rural area.',
      'Adult members (18+ years) willing to undertake unskilled manual labor.',
      'Must hold a valid MGNREGA Job Card issued by Gram Panchayat.'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Gram Panchayat Job Card',
      'Bank / Post Office Savings Account Passbook'
    ],
    applicationProcess: [
      'Apply verbally or in writing to the Gram Panchayat for a Job Card.',
      'Gram Panchayat issues Job Card within 15 days of application.',
      'Submit application for work specifying dates desired for employment.',
      'Work allocated within 5 km radius of village within 15 days.'
    ],
    officialWebsite: 'https://nrega.nic.in',
    officialApplyLink: 'https://nrega.nic.in/netnrega/home.aspx',
    helplineNumber: '1800111555',
    budget: '₹86,000 Crore',
    faqs: [
      {
        question: 'What if work is not provided within 15 days of application?',
        answer: 'If work is not provided within 15 days, the applicant is entitled to a daily Unemployment Allowance paid by the State Government.'
      }
    ],
    tags: ['Employment', 'Rural Development', 'Wage Guarantee', 'Farmers'],
    isVerified: true,
    isNewlyLaunched: false,
    isRecentlyUpdated: true,
    isExpiring: false,
  },
  {
    schemeId: 'GOI-FINANCE-008',
    title: 'Pradhan Mantri Mudra Yojana (PMMY 2.0)',
    ministry: 'Ministry of Finance',
    category: 'Financial Assistance',
    launchDate: '2015-04-08',
    lastUpdatedDate: '2026-06-10',
    status: 'active',
    scope: 'central',
    applicableStates: [],
    targetBeneficiaries: ['MSMEs', 'Entrepreneurs', 'Small Business Owners', 'Women'],
    benefits: 'Collateral-free business loans up to ₹20 Lakh (Tarun Plus category) for micro and small non-corporate, non-farm enterprises.',
    shortDescription: 'Collateral-free business loans up to ₹20 Lakh under Shishu, Kishore, Tarun, and Tarun Plus categories.',
    eligibilityCriteria: [
      'Non-farm micro or small business enterprise in manufacturing, trading, or service sector.',
      'Proprietorship, Partnership, Pvt Ltd companies, or Self-Help Groups.',
      'No past default history with any bank or financial institution.'
    ],
    requiredDocuments: [
      'Aadhaar & PAN Card',
      'Business Registration / Udyam Certificate',
      'Last 6 months Bank Statement',
      'Quotation for Machinery / Equipment to be purchased'
    ],
    applicationProcess: [
      'Visit Udyami Mitra portal at udyamimitra.in or any bank branch.',
      'Select loan category: Shishu (up to 50k), Kishore (50k-5L), Tarun (5L-10L), or Tarun Plus (10L-20L).',
      'Upload business profile and financial statements.',
      'Sanction and disbursement directly to bank account.'
    ],
    officialWebsite: 'https://www.mudra.org.in',
    officialApplyLink: 'https://www.udyamimitra.in',
    helplineNumber: '18001801111 / 1800110001',
    budget: '₹4.5 Lakh Crore Disbursed Target',
    faqs: [
      {
        question: 'Is collateral or security required for MUDRA loans?',
        answer: 'No collateral security is required for MUDRA loans up to ₹20 Lakh under CGFMU coverage.'
      }
    ],
    tags: ['Financial Assistance', 'Business', 'MSMEs', 'Loans', 'Popular'],
    isVerified: true,
    isNewlyLaunched: false,
    isRecentlyUpdated: true,
    isExpiring: false,
  }
];

module.exports = OFFICIAL_SCHEMES_DATASET;
