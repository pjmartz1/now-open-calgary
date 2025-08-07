import { Business } from '../types/Business';

interface CalgaryAPIBusiness {
  licence_number?: string;
  getbusid?: string;
  business_name?: string;
  tradename?: string;
  trade_name?: string;
  business_type?: string;
  licencetypes?: string;
  business_category?: string;
  address?: string;
  community?: string;
  comdistnm?: string;
  ward?: string;
  first_iss_dt?: string;
  status?: string;
  phone_number?: string;
}

// services/calgaryAPI.ts - IMPROVED VERSION
const CALGARY_API_BASE = 'https://data.calgary.ca/resource/vdjc-pybd.json';

// Test function - try this first
export const testCalgaryAPI = async () => {
  const testUrl = `${CALGARY_API_BASE}?$limit=5`;
  
  console.log('🧪 Testing Calgary API with:', testUrl);
  
  try {
    const response = await fetch(testUrl);
    console.log('✅ Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Calgary API works! Sample data:', data);
      return data;
    } else {
      console.error('❌ API Error:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('❌ Network Error:', error);
    return null;
  }
};

// Main function with improved error handling and data processing
export const fetchNewBusinesses = async (daysBack = 365) => { // Increased from 90 to 365 days
  console.log('🔄 Starting Calgary API fetch...');
  
  try {
    // First test if API is accessible
    const testResult = await testCalgaryAPI();
    if (!testResult) {
      console.log('🔄 API test failed, using mock data for development');
      return getMockBusinesses();
    }

    // Calculate date filter (go back X days)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    
    // Calgary API expects this exact format: YYYY-MM-DDTHH:mm:ss
    const dateString = cutoffDate.toISOString().slice(0, 19); // Remove milliseconds
    
    // Build URL with proper encoding - increased limit to 2000 for more data
    const apiUrl = `${CALGARY_API_BASE}?$where=first_iss_dt>'${dateString}'&status=Issued&$limit=2000&$order=first_iss_dt DESC`;
    
    console.log('🌐 Calgary API URL:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Calgary API Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Calgary API Success:', data.length, 'businesses found');
    
    // Transform the data with better error handling
    const transformedData: Business[] = [];
    
    data.forEach((business: CalgaryAPIBusiness, index: number) => {
      try {
        const firstIssuedDate = business.first_iss_dt ? new Date(business.first_iss_dt) : new Date();
        const daysOld = Math.floor((Date.now() - firstIssuedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Skip businesses older than 2 years to keep content fresh
        if (daysOld > 730) {
          return;
        }
        
        transformedData.push({
          id: business.licence_number || business.getbusid || `calgary-${Date.now()}-${index}`,
          business_name: business.business_name || business.tradename || 'Unknown Business',
          trade_name: business.trade_name || business.tradename || undefined,
          business_type: business.business_type || business.licencetypes || 'General Business',
          business_category: business.business_category || business.licencetypes || undefined,
          address: business.address || 'Calgary, AB',
          community: business.community || business.comdistnm || 'Calgary',
          ward: business.ward || '',
          first_iss_dt: business.first_iss_dt || new Date().toISOString(),
          status: business.status || 'Issued',
          phone: business.phone_number || undefined,
          website: undefined, // Not usually in the API
          featured: false, // Will be set based on featured business IDs
          days_old: daysOld
        });
      } catch (error) {
        console.warn('⚠️ Error processing business:', business, error);
      }
    });
    
    console.log('✅ Successfully processed', transformedData.length, 'businesses');
    
    // If we don't have enough real data, supplement with mock data
    if (transformedData.length < 10) {
      console.log('🔄 Supplementing with mock data for better user experience');
      const mockData = getMockBusinesses();
      return [...transformedData, ...mockData];
    }
    
    return transformedData;
    
  } catch (error) {
    console.error('❌ Calgary API Error:', error);
    console.log('🔄 Falling back to mock data...');
    return getMockBusinesses();
  }
};

// Enhanced mock data with more realistic Calgary businesses
const getMockBusinesses = () => [
  {
    id: 'BL-2025-001',
    business_name: 'Rustic Roots Cafe',
    trade_name: 'Rustic Roots',
    business_type: 'Restaurant',
    business_category: 'Food Service',
    address: '1234 17 Ave SW',
    community: 'Hillhurst',
    ward: '7',
    first_iss_dt: '2025-01-15T00:00:00',
    status: 'Issued',
    phone: '(403) 555-0123',
    website: null,
    featured: true,
    days_old: 22
  },
  {
    id: 'BL-2025-002',
    business_name: 'TechHub Coworking',
    trade_name: 'TechHub',
    business_type: 'Office Space',
    business_category: 'Business Services',
    address: '567 8 Ave SW',
    community: 'Beltline',
    ward: '8',
    first_iss_dt: '2025-01-20T00:00:00',
    status: 'Issued',
    phone: null,
    website: 'https://techhub.com',
    featured: false,
    days_old: 17
  },
  {
    id: 'BL-2025-003',
    business_name: 'Bloom & Blossom Florist',
    trade_name: 'Bloom & Blossom',
    business_type: 'Retail',
    business_category: 'Retail Trade',
    address: '890 Kensington Rd NW',
    community: 'Kensington',
    ward: '7',
    first_iss_dt: '2025-01-25T00:00:00',
    status: 'Issued',
    phone: '(403) 555-0456',
    website: null,
    featured: false,
    days_old: 12
  },
  {
    id: 'BL-2025-004',
    business_name: 'Urban Fitness Studio',
    trade_name: 'Urban Fitness',
    business_type: 'Health & Wellness',
    business_category: 'Health Care',
    address: '321 Mission Rd SW',
    community: 'Mission',
    ward: '8',
    first_iss_dt: '2025-02-01T00:00:00',
    status: 'Issued',
    phone: '(403) 555-0789',
    website: 'https://urbanfitness.com',
    featured: true,
    days_old: 5
  },
  {
    id: 'BL-2025-005',
    business_name: 'Marda Loop Auto Repair',
    trade_name: 'Marda Loop Auto',
    business_type: 'Automotive',
    business_category: 'Automotive Services',
    address: '5678 33 Avenue SW',
    community: 'Marda Loop',
    ward: '8',
    first_iss_dt: '2025-02-05T00:00:00',
    status: 'Issued',
    phone: '(403) 555-0321',
    website: null,
    featured: false,
    days_old: 1
  },
  {
    id: 'BL-2025-006',
    business_name: 'Inglewood Artisan Bakery',
    trade_name: 'Fresh Start Bakery',
    business_type: 'Food Service',
    business_category: 'Food Service',
    address: '9101 9 Avenue SE',
    community: 'Inglewood',
    ward: '9',
    first_iss_dt: '2025-02-03T00:00:00',
    status: 'Issued',
    phone: '(403) 555-0654',
    website: 'https://freshstartbakery.com',
    featured: false,
    days_old: 3
  },
  {
    id: 'BL-2024-001',
    business_name: 'Bridgeland Brewery',
    trade_name: 'Bridgeland Brew',
    business_type: 'Brewery',
    business_category: 'Food Service',
    address: '1234 1 Ave NE',
    community: 'Bridgeland',
    ward: '7',
    first_iss_dt: '2024-12-15T00:00:00',
    status: 'Issued',
    phone: '(403) 555-0987',
    website: 'https://bridgelandbrew.com',
    featured: false,
    days_old: 23
  },
  {
    id: 'BL-2024-002',
    business_name: 'Chinatown Noodle House',
    trade_name: 'Chinatown Noodles',
    business_type: 'Restaurant',
    business_category: 'Food Service',
    address: '567 Centre St NE',
    community: 'Chinatown',
    ward: '7',
    first_iss_dt: '2024-12-20T00:00:00',
    status: 'Issued',
    phone: '(403) 555-0432',
    website: null,
    featured: false,
    days_old: 18
  },
  {
    id: 'BL-2024-003',
    business_name: 'East Village Coffee Co.',
    trade_name: 'EV Coffee',
    business_type: 'Coffee Shop',
    business_category: 'Food Service',
    address: '890 Riverfront Ave SE',
    community: 'East Village',
    ward: '7',
    first_iss_dt: '2024-12-25T00:00:00',
    status: 'Issued',
    phone: '(403) 555-0765',
    website: 'https://evcoffee.com',
    featured: false,
    days_old: 13
  },
  {
    id: 'BL-2024-004',
    business_name: 'Mount Royal Yoga Studio',
    trade_name: 'MR Yoga',
    business_type: 'Health & Wellness',
    business_category: 'Health Care',
    address: '432 17 Ave SW',
    community: 'Mount Royal',
    ward: '8',
    first_iss_dt: '2024-12-30T00:00:00',
    status: 'Issued',
    phone: '(403) 555-0210',
    website: 'https://mryoga.com',
    featured: false,
    days_old: 8
  },
  {
    id: 'BL-2024-005',
    business_name: 'Sunalta Design Studio',
    trade_name: 'Sunalta Design',
    business_type: 'Design Services',
    business_category: 'Professional Services',
    address: '765 10 Ave SW',
    community: 'Sunalta',
    ward: '8',
    first_iss_dt: '2025-01-05T00:00:00',
    status: 'Issued',
    phone: '(403) 555-0543',
    website: 'https://sunalta.com',
    featured: false,
    days_old: 2
  }
];

// Simple function to use in your React component
export const loadBusinesses = async () => {
  console.log('🔄 Loading Calgary businesses...');
  const businesses = await fetchNewBusinesses();
  console.log('📊 Loaded', businesses.length, 'businesses');
  return businesses;
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