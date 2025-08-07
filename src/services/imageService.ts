// Stock photo service for business cards
// Using Unsplash API for high-quality, free stock photos

export interface BusinessImage {
  url: string;
  alt: string;
  placeholder?: string;
}

// Business type to image mapping
const BUSINESS_IMAGES: Record<string, BusinessImage> = {
  // Food & Beverage
  'Restaurant': {
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&crop=center',
    alt: 'Restaurant interior with warm lighting'
  },
  'Food Service': {
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop&crop=center',
    alt: 'Professional kitchen with chef preparing food'
  },
  'Food Services': {
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop&crop=center',
    alt: 'Professional kitchen with chef preparing food'
  },
  'Catering': {
    url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center',
    alt: 'Elegant catering setup with food display'
  },

  // Retail
  'Retail': {
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center',
    alt: 'Modern retail store interior'
  },
  'Clothing': {
    url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop&crop=center',
    alt: 'Fashion clothing store display'
  },
  'Jewelry': {
    url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&crop=center',
    alt: 'Elegant jewelry display'
  },

  // Automotive
  'Automotive': {
    url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&crop=center',
    alt: 'Modern automotive service center'
  },
  'Auto Repair': {
    url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&crop=center',
    alt: 'Professional auto repair shop'
  },

  // Health & Beauty
  'Personal Services': {
    url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center',
    alt: 'Professional personal services'
  },
  'Health & Wellness': {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
    alt: 'Modern fitness and wellness center'
  },
  'Beauty Salon': {
    url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center',
    alt: 'Modern beauty salon interior'
  },
  'Spa': {
    url: 'https://images.unsplash.com/photo-1544161512-84f9c86aed91?w=400&h=300&fit=crop&crop=center',
    alt: 'Relaxing spa environment'
  },

  // Professional Services
  'Professional Services': {
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center',
    alt: 'Professional office workspace'
  },
  'Consulting': {
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center',
    alt: 'Business consulting meeting'
  },
  'Legal Services': {
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop&crop=center',
    alt: 'Professional legal office'
  },

  // Real Estate
  'Real Estate': {
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center',
    alt: 'Modern real estate office'
  },
  'Property Management': {
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center',
    alt: 'Property management services'
  },

  // Technology
  'Technology': {
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center',
    alt: 'Modern technology workspace'
  },
  'Software Development': {
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center',
    alt: 'Software development office'
  },

  // Fitness & Recreation
  'Fitness': {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
    alt: 'Modern fitness center'
  },
  'Recreation': {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
    alt: 'Recreation and fitness facilities'
  },

  // Education
  'Education': {
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=400&h=300&fit=crop&crop=center',
    alt: 'Modern educational facility'
  },
  'Training': {
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=400&h=300&fit=crop&crop=center',
    alt: 'Professional training environment'
  },

  // Manufacturing
  'Manufacturing': {
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&crop=center',
    alt: 'Modern manufacturing facility'
  },
  'Industrial': {
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&crop=center',
    alt: 'Industrial workspace'
  },

  // Default fallback
  'default': {
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center',
    alt: 'Professional business environment'
  }
};

// Get optimized image for business type
export const getBusinessImage = (businessType: string): BusinessImage => {
  // Clean and normalize business type
  const normalizedType = businessType.trim();
  
  // Try exact match first
  if (BUSINESS_IMAGES[normalizedType]) {
    return BUSINESS_IMAGES[normalizedType];
  }
  
  // Try partial matches
  for (const [key, image] of Object.entries(BUSINESS_IMAGES)) {
    if (key !== 'default' && normalizedType.toLowerCase().includes(key.toLowerCase())) {
      return image;
    }
  }
  
  // Return default image
  return BUSINESS_IMAGES['default'];
};

// Generate placeholder color based on business type
export const getPlaceholderColor = (businessType: string): string => {
  const colors = [
    'bg-red-100',
    'bg-blue-100', 
    'bg-green-100',
    'bg-yellow-100',
    'bg-purple-100',
    'bg-pink-100',
    'bg-indigo-100',
    'bg-gray-100'
  ];
  
  // Simple hash function to get consistent color for same business type
  let hash = 0;
  for (let i = 0; i < businessType.length; i++) {
    hash = businessType.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Get responsive image URLs
export const getResponsiveImageUrls = (baseUrl: string) => {
  return {
    small: `${baseUrl}&w=300&h=200`,
    medium: `${baseUrl}&w=400&h=300`,
    large: `${baseUrl}&w=600&h=450`
  };
}; 