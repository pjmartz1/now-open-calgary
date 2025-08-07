import { Business } from '../types/Business';

export const generateBusinessSchema = (business: Business) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.business_name,
    "alternateName": business.trade_name || undefined,
    "description": business.description || `${business.business_name} is a new ${business.business_type} in ${business.community}, Calgary.`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address,
      "addressLocality": "Calgary",
      "addressRegion": "AB",
      "addressCountry": "CA"
    },
    "url": business.website || undefined,
    "telephone": business.phone || undefined,
    "openingDate": business.first_iss_dt,
    "areaServed": {
      "@type": "City",
      "name": "Calgary",
      "addressRegion": "AB",
      "addressCountry": "CA"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": business.business_type,
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": business.business_type,
            "provider": {
              "@type": "LocalBusiness",
              "name": business.business_name
            }
          }
        }
      ]
    }
  };

  // Remove undefined values
  return JSON.parse(JSON.stringify(schema));
};

export const generatePageTitle = (business?: Business, page?: string) => {
  if (business) {
    return `${business.business_name} – Now Open Calgary`;
  }
  
  switch (page) {
    case 'about':
      return 'About Us – Now Open Calgary';
    case 'for-owners':
      return 'For Business Owners – Now Open Calgary';
    case 'testing':
      return 'Testing – Now Open Calgary';
    default:
      return 'Now Open Calgary – Discover New Businesses in Calgary';
  }
};

export const generatePageDescription = (business?: Business, page?: string) => {
  if (business) {
    const formattedDate = new Date(business.first_iss_dt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return `${business.business_name} is a new ${business.business_type} in ${business.community}, Calgary. Licensed on ${formattedDate}.`;
  }
  
  switch (page) {
    case 'about':
      return 'Learn about Now Open Calgary - your trusted source for discovering new businesses in Calgary, updated daily from official City data.';
    case 'for-owners':
      return 'Promote your Calgary business with featured listings on Now Open Calgary. Reach new customers and grow your local presence.';
    default:
      return "Explore Calgary's newest restaurants, shops, and local services with Now Open Calgary. Updated daily from City of Calgary data – see what's new in your neighbourhood today.";
  }
};

export const updatePageMeta = (title: string, description: string) => {
  document.title = title;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  }
  
  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', title);
  }
  
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute('content', description);
  }
  
  // Update Twitter tags
  const twitterTitle = document.querySelector('meta[property="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute('content', title);
  }
  
  const twitterDescription = document.querySelector('meta[property="twitter:description"]');
  if (twitterDescription) {
    twitterDescription.setAttribute('content', description);
  }
};