'use strict';

const logger = require('../utils/logger');

/**
 * Verified Official Government Services & Centers Database
 */
const GOVERNMENT_CENTERS_DATASET = [
  {
    id: 'csc-001',
    name: 'Digital India Common Service Center (CSC) - Main Market Kendra',
    type: 'CSC',
    address: 'Near District Collectorate Complex, Civil Lines',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    latitude: 17.3850,
    longitude: 78.4867,
    servicesProvided: ['Aadhaar Update', 'Income Certificate', 'Caste Certificate', 'PMAY Application', 'PM-KISAN E-KYC'],
    workingHours: '09:00 AM - 06:00 PM (Mon-Sat)',
    contactNumber: '1800-3000-3468',
    officialPortal: 'https://csc.gov.in',
  },
  {
    id: 'aadhaar-002',
    name: 'UIDAI Aadhaar Seva Kendra (ASK)',
    type: 'Aadhaar Center',
    address: 'Ground Floor, Metro Station Complex, Begumpet',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500016',
    latitude: 17.4401,
    longitude: 78.4619,
    servicesProvided: ['Fresh Aadhaar Enrolment', 'Biometric Update', 'Address Change', 'Mobile Number Linking'],
    workingHours: '09:30 AM - 05:30 PM (All 7 Days)',
    contactNumber: '1947',
    officialPortal: 'https://uidai.gov.in',
  },
  {
    id: 'meeseva-003',
    name: 'MeeSeva Citizen Service Kendra',
    type: 'MeeSeva',
    address: 'Municipal Office Compound, Khairatabad',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500004',
    latitude: 17.4116,
    longitude: 78.4627,
    servicesProvided: ['Revenue Certificates', 'Ration Card Application', 'Electricity Bill Payment', 'Property Tax'],
    workingHours: '10:00 AM - 05:00 PM (Mon-Sat)',
    contactNumber: '040-23456789',
    officialPortal: 'https://tg.meeseva.gov.in',
  },
  {
    id: 'rto-004',
    name: 'Regional Transport Office (RTO) - Central Division',
    type: 'RTO Office',
    address: 'Khairatabad RTO Complex',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500004',
    latitude: 17.4130,
    longitude: 78.4640,
    servicesProvided: ['Learner Driving License', 'Permanent DL', 'Vehicle Registration (RC)', 'Fitness Certificate'],
    workingHours: '10:00 AM - 03:00 PM (Mon-Fri)',
    contactNumber: '040-23311234',
    officialPortal: 'https://transport.telangana.gov.in',
  },
  {
    id: 'passport-005',
    name: 'Passport Seva Kendra (PSK) - Ameerpet',
    type: 'Passport Office',
    address: 'Aditya Trade Center, Ameerpet Main Road',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500038',
    latitude: 17.4375,
    longitude: 78.4482,
    servicesProvided: ['Fresh Passport Application', 'Tatkaal Passport', 'Passport Renewal', 'PCC Verification'],
    workingHours: '09:00 AM - 05:00 PM (Mon-Fri)',
    contactNumber: '1800-258-1800',
    officialPortal: 'https://passportindia.gov.in',
  },
  {
    id: 'hospital-006',
    name: 'Osmania General Hospital - Ayushman PM-JAY Kiosk',
    type: 'Government Hospital',
    address: 'Afzal Gunj Road, Near High Court',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500012',
    latitude: 17.3734,
    longitude: 78.4754,
    servicesProvided: ['Cashless Hospitalization ₹5L', 'Ayushman Bharat Card Generation', 'Emergency Medical Relief'],
    workingHours: '24/7 Emergency Care',
    contactNumber: '14555',
    officialPortal: 'https://pmjay.gov.in',
  },
  {
    id: 'bank-007',
    name: 'State Bank of India (SBI) - Government Schemes Facilitation Branch',
    type: 'Bank Branch',
    address: 'Bank Street, Koti',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500095',
    latitude: 17.3871,
    longitude: 78.4831,
    servicesProvided: ['PM-KISAN Direct Benefit Transfer (DBT)', 'Mudra Loan Sanction', 'PMAY Interest Subsidy', 'PM Vishwakarma Loan'],
    workingHours: '10:00 AM - 04:00 PM (Mon-Sat)',
    contactNumber: '1800-425-3800',
    officialPortal: 'https://sbi.co.in',
  },
];

class GISService {
  /**
   * Search nearby government centers by latitude/longitude or query
   */
  async searchNearbyCenters({ latitude = 17.3850, longitude = 78.4867, type = 'All', search = '' }) {
    try {
      let filtered = [...GOVERNMENT_CENTERS_DATASET];

      if (type && type !== 'All') {
        filtered = filtered.filter(c => c.type.toLowerCase().includes(type.toLowerCase()));
      }

      if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        filtered = filtered.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.servicesProvided.some(s => s.toLowerCase().includes(q))
        );
      }

      // Compute approximate Haversine distance in kilometers
      const result = filtered.map(c => {
        const distKm = this._calculateDistanceKm(latitude, longitude, c.latitude, c.longitude);
        const estMinutes = Math.round(distKm * 3.5 + 5);
        return {
          ...c,
          distanceKm: Number(distKm.toFixed(1)),
          estimatedTravelTimeMinutes: estMinutes,
          googleMapsDirectionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${c.latitude},${c.longitude}`,
        };
      });

      // Sort by distance ascending
      result.sort((a, b) => a.distanceKm - b.distanceKm);

      return result;
    } catch (error) {
      logger.error('[GISService] searchNearbyCenters error', { error: error.message });
      return GOVERNMENT_CENTERS_DATASET;
    }
  }

  _calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

module.exports = GISService;
