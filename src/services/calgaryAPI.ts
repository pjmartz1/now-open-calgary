import { Business } from '../types/Business';

const CALGARY_API_BASE = 'https://data.calgary.ca/resource/vdjc-pybd.json';

// Mock data matching Calgary API structure
const mockBusinesses: Business[] = [
  {
    id: 'LIC-2024-001',
    business_name: 'Kensington Coffee Roasters',
    trade_name: 'KCR Coffee',
    business_type: 'Food Service',
    address: '1234 Kensington Road NW',
    community: 'Kensington-Chinatown',
    ward: '7',
    first_iss_dt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Issued',
    days_old: 2,
    phone: '(403) 555-0123',
    website: 'https://kensingtoncoffee.ca'
  },
  {
    id: 'LIC-2024-002',
    business_name: 'Marda Loop Fitness Studio',
    business_type: 'Health & Wellness',
    address: '5678 33 Avenue SW',
    community: 'Marda Loop',
    ward: '8',
    first_iss_dt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Issued',
    days_old: 5,
    phone: '(403) 555-0456'
  },
  {
    id: 'LIC-2024-003',
    business_name: 'Inglewood Artisan Bakery',
    trade_name: 'Fresh Start Bakery',
    business_type: 'Food Service',
    address: '9101 9 Avenue SE',
    community: 'Inglewood',
    ward: '9',
    first_iss_dt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Issued',
    days_old: 1,
    website: 'https://freshstartbakery.com'
  },
  {
    id: 'LIC-2024-004',
    business_name: 'Mission Tech Solutions',
    business_type: 'Professional Services',
    address: '2468 4 Street SW',
    community: 'Mission',
    ward: '8',
    first_iss_dt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Issued',
    days_old: 10,
    phone: '(403) 555-0789',
    website: 'https://missiontech.ca'
  },
  {
    id: 'LIC-2024-005',
    business_name: 'Bridgeland Pet Grooming',
    business_type: 'Personal Services',
    address: '1357 1 Avenue NE',
    community: 'Bridgeland-Riverside',
    ward: '9',
    first_iss_dt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Issued',
    days_old: 7,
    phone: '(403) 555-0321'
  },
  {
    id: 'LIC-2024-006',
    business_name: 'Hillhurst Vintage Boutique',
    business_type: 'Retail',
    address: '2460 Kensington Road NW',
    community: 'Hillhurst-Sunnyside',
    ward: '7',
    first_iss_dt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Issued',
    days_old: 15,
    website: 'https://hillhurstvintage.com'
  },
  {
    id: 'LIC-2024-007',
    business_name: 'Eau Claire Consulting Group',
    business_type: 'Professional Services',
    address: '135 2 Avenue SW',
    community: 'Eau Claire',
    ward: '8',
    first_iss_dt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Issued',
    days_old: 20,
    phone: '(403) 555-0654',
    website: 'https://eauclaireconsulting.ca'
  },
  {
    id: 'LIC-2024-008',
    business_name: 'Ramsay Auto Repair',
    business_type: 'Automotive',
    address: '2468 11 Street SE',
    community: 'Ramsay',
    ward: '9',
    first_iss_dt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Issued',
    days_old: 3,
    phone: '(403) 555-0987'
  }
];

export const fetchNewBusinesses = async (daysBack: number = 90): Promise<Business[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('🔍 Attempting to connect to Calgary API...');
  
  try {
    // Try real API first, fallback to mock data on error
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysBack);
      const dateFilter = cutoffDate.toISOString().split('.')[0];
      
      console.log(`📅 Fetching businesses licensed after: ${dateFilter}`);
      
      const params = new URLSearchParams({
        '$where': `status='Issued' AND first_iss_dt>'${dateFilter}'`,
        '$limit': '1000',
        '$order': 'first_iss_dt DESC'
      });
      
      const apiUrl = `${CALGARY_API_BASE}?${params}`;
      console.log(`🌐 API URL: ${apiUrl}`);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        console.log(`❌ API Response Error: ${response.status} ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`📊 API Response: ${Array.isArray(data) ? data.length : 'Invalid'} records received`);
      
      // If we get valid data from the API, process it
      if (Array.isArray(data) && data.length > 0) {
        console.log(`✅ SUCCESS: Using ${data.length} businesses from LIVE Calgary API`);
        
        return data.map((business: any) => ({
          id: business.licence_number || `LIC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          business_name: business.business_name || 'Unknown Business',
          trade_name: business.trade_name,
          business_type: business.business_type || 'General Business',
          address: business.address || 'Address not available',
          community: business.community || 'Calgary',
          ward: business.ward || 'Unknown',
          first_iss_dt: business.first_iss_dt || new Date().toISOString(),
          status: business.status || 'Issued',
          days_old: business.first_iss_dt 
            ? Math.floor((Date.now() - new Date(business.first_iss_dt).getTime()) / (1000 * 60 * 60 * 24))
            : 0,
          phone: business.phone,
          website: business.website
        }));
      } else {
        console.log('⚠️ API returned empty or invalid data');
        throw new Error('No data received from Calgary API');
      }
    } catch (apiError) {
      console.warn('❌ Calgary API Error:', apiError);
      console.log('🔄 Falling back to mock data...');
      
      // Fallback to mock data with a notice
      console.log('📝 SUCCESS: Using mock data (8 businesses) for development/demo');
      return mockBusinesses.filter(business => business.days_old <= daysBack);
    }
  } catch (error) {
    console.error('Critical API Error:', error);
    console.log('📝 FALLBACK: Using mock data as final fallback');
    return mockBusinesses.filter(business => business.days_old <= daysBack);
  }
};

export const getBusinessById = async (id: string): Promise<Business | null> => {
  const businesses = await fetchNewBusinesses();
  return businesses.find(business => business.id === id) || null;
};

export const getBusinessesByType = async (businessType: string): Promise<Business[]> => {
  const businesses = await fetchNewBusinesses();
  return businesses.filter(business => 
    business.business_type.toLowerCase().includes(businessType.toLowerCase())
  );
};

export const getBusinessesByCommunity = async (community: string): Promise<Business[]> => {
  const businesses = await fetchNewBusinesses();
  return businesses.filter(business => 
    business.community.toLowerCase().includes(community.toLowerCase())
  );
};

export const searchBusinesses = async (query: string): Promise<Business[]> => {
  const allBusinesses = await fetchNewBusinesses();
  
  if (!query) return allBusinesses;
  
  const lowercaseQuery = query.toLowerCase();
  return allBusinesses.filter(business =>
    business.business_name.toLowerCase().includes(lowercaseQuery) ||
    business.trade_name?.toLowerCase().includes(lowercaseQuery) ||
    business.business_type.toLowerCase().includes(lowercaseQuery) ||
    business.community.toLowerCase().includes(lowercaseQuery) ||
    business.address.toLowerCase().includes(lowercaseQuery)
  );
};