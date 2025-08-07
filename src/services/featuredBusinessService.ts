// services/featuredBusinessService.ts
import { Business } from '../types/Business';

const FEATURED_BUSINESSES_KEY = 'featured_businesses_calgary';

export interface FeaturedBusiness {
  businessId: string;
  businessName: string;
  featureType: 'basic' | 'premium' | 'premium_plus';
  featuredDate: string;
  expiryDate: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  additionalInfo?: {
    description?: string;
    hours?: string;
    specialOffers?: string;
  };
}

// Load featured businesses from localStorage
export const loadFeaturedBusinesses = (): FeaturedBusiness[] => {
  try {
    const stored = localStorage.getItem(FEATURED_BUSINESSES_KEY);
    if (stored) {
      const featured = JSON.parse(stored);
      console.log('📊 Loaded', featured.length, 'featured businesses from storage');
      return featured;
    }
  } catch (error) {
    console.error('❌ Error loading featured businesses:', error);
  }
  return [];
};

// Save featured businesses to localStorage
export const saveFeaturedBusinesses = (featuredBusinesses: FeaturedBusiness[]) => {
  try {
    localStorage.setItem(FEATURED_BUSINESSES_KEY, JSON.stringify(featuredBusinesses));
    console.log('💾 Saved', featuredBusinesses.length, 'featured businesses to storage');
  } catch (error) {
    console.error('❌ Error saving featured businesses:', error);
  }
};

// Add a new featured business
export const addFeaturedBusiness = (business: Business, featureType: 'basic' | 'premium' | 'premium_plus', contactInfo?: any) => {
  const featuredBusinesses = loadFeaturedBusinesses();
  
  // Calculate expiry date based on feature type
  const now = new Date();
  let expiryDate = new Date();
  
  switch (featureType) {
    case 'basic':
      expiryDate.setDate(now.getDate() + 30); // 30 days
      break;
    case 'premium':
      expiryDate.setDate(now.getDate() + 90); // 90 days
      break;
    case 'premium_plus':
      expiryDate.setDate(now.getDate() + 180); // 180 days
      break;
  }
  
  const newFeatured: FeaturedBusiness = {
    businessId: business.id,
    businessName: business.business_name,
    featureType,
    featuredDate: now.toISOString(),
    expiryDate: expiryDate.toISOString(),
    contactInfo: contactInfo || {},
    additionalInfo: {}
  };
  
  // Remove existing entry if it exists
  const filtered = featuredBusinesses.filter(fb => fb.businessId !== business.id);
  filtered.push(newFeatured);
  
  saveFeaturedBusinesses(filtered);
  console.log('✅ Added featured business:', business.business_name, 'with', featureType, 'package');
  
  return newFeatured;
};

// Remove a featured business
export const removeFeaturedBusiness = (businessId: string) => {
  const featuredBusinesses = loadFeaturedBusinesses();
  const filtered = featuredBusinesses.filter(fb => fb.businessId !== businessId);
  saveFeaturedBusinesses(filtered);
  console.log('🗑️ Removed featured business:', businessId);
};

// Check if a business is featured
export const isBusinessFeatured = (businessId: string): boolean => {
  const featuredBusinesses = loadFeaturedBusinesses();
  const now = new Date();
  
  return featuredBusinesses.some(fb => {
    if (fb.businessId !== businessId) return false;
    
    // Check if feature has expired
    const expiryDate = new Date(fb.expiryDate);
    if (expiryDate < now) {
      console.log('⚠️ Featured business expired:', fb.businessName);
      return false;
    }
    
    return true;
  });
};

// Get featured business details
export const getFeaturedBusinessDetails = (businessId: string): FeaturedBusiness | null => {
  const featuredBusinesses = loadFeaturedBusinesses();
  const now = new Date();
  
  const featured = featuredBusinesses.find(fb => {
    if (fb.businessId !== businessId) return false;
    
    // Check if feature has expired
    const expiryDate = new Date(fb.expiryDate);
    if (expiryDate < now) return false;
    
    return true;
  });
  
  return featured || null;
};

// Update featured business information
export const updateFeaturedBusiness = (businessId: string, updates: Partial<FeaturedBusiness>) => {
  const featuredBusinesses = loadFeaturedBusinesses();
  const index = featuredBusinesses.findIndex(fb => fb.businessId === businessId);
  
  if (index !== -1) {
    featuredBusinesses[index] = { ...featuredBusinesses[index], ...updates };
    saveFeaturedBusinesses(featuredBusinesses);
    console.log('✅ Updated featured business:', businessId);
    return true;
  }
  
  return false;
};

// Clean up expired featured businesses
export const cleanupExpiredFeatures = () => {
  const featuredBusinesses = loadFeaturedBusinesses();
  const now = new Date();
  
  const active = featuredBusinesses.filter(fb => {
    const expiryDate = new Date(fb.expiryDate);
    return expiryDate >= now;
  });
  
  if (active.length !== featuredBusinesses.length) {
    saveFeaturedBusinesses(active);
    console.log('🧹 Cleaned up', featuredBusinesses.length - active.length, 'expired featured businesses');
  }
  
  return active;
};

// Get all active featured business IDs
export const getActiveFeaturedBusinessIds = (): string[] => {
  const featuredBusinesses = loadFeaturedBusinesses();
  const now = new Date();
  
  return featuredBusinesses
    .filter(fb => new Date(fb.expiryDate) >= now)
    .map(fb => fb.businessId);
};

// Get featured business statistics
export const getFeaturedBusinessStats = () => {
  const featuredBusinesses = loadFeaturedBusinesses();
  const now = new Date();
  
  const active = featuredBusinesses.filter(fb => new Date(fb.expiryDate) >= now);
  const expired = featuredBusinesses.filter(fb => new Date(fb.expiryDate) < now);
  
  const stats = {
    total: featuredBusinesses.length,
    active: active.length,
    expired: expired.length,
    byType: {
      basic: active.filter(fb => fb.featureType === 'basic').length,
      premium: active.filter(fb => fb.featureType === 'premium').length,
      premium_plus: active.filter(fb => fb.featureType === 'premium_plus').length
    }
  };
  
  console.log('📊 Featured business stats:', stats);
  return stats;
};
