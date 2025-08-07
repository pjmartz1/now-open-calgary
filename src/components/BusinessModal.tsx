import React from 'react';
import { X, MapPin, Calendar, Star, ExternalLink, Phone, Globe, Share2 } from 'lucide-react';
import { Business } from '../types/Business';
import { GoogleMap } from './GoogleMap';
import { generateBusinessSchema } from '../utils/seoUtils';
import { BusinessImage } from './BusinessImage';

interface BusinessModalProps {
  business: Business;
  isFeatured: boolean;
  onClose: () => void;
  onFeature: () => void;
  onClaim: () => void;
}

export const BusinessModal: React.FC<BusinessModalProps> = ({
  business,
  isFeatured,
  onClose,
  onFeature,
  onClaim
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = `${window.location.origin}/?business=${business.id}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${business.business_name} - Now Open Calgary`,
        text: `Check out this new business in Calgary: ${business.business_name}`,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      // You could add a toast notification here
    }
  };

  // Generate dynamic meta tags for business
  React.useEffect(() => {
    // Update page title for better SEO when modal is open
    const originalTitle = document.title;
    document.title = `${business.business_name} – Now Open Calgary`;
    
    // Add business schema
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.textContent = JSON.stringify(generateBusinessSchema(business));
    schemaScript.id = 'business-schema';
    document.head.appendChild(schemaScript);
    
    return () => {
      document.title = originalTitle;
      const existingSchema = document.getElementById('business-schema');
      if (existingSchema) {
        document.head.removeChild(existingSchema);
      }
    };
  }, [business]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between ${
          isFeatured ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200' : ''
        }`}>
          <div className="flex items-center space-x-3">
            {isFeatured && (
              <div className="flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                <Star className="w-3 h-3 fill-current" />
                <span>Featured</span>
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-900">Business Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Business Image */}
          <div className="mb-6">
            <BusinessImage
              businessType={business.business_type}
              businessName={business.business_name}
              className="rounded-lg w-full"
              priority={true}
            />
          </div>

          {/* Business Info */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {business.business_name}
            </h1>
            
            {business.trade_name && business.trade_name !== business.business_name && (
              <p className="text-lg text-gray-600 mb-3 italic">
                Also known as "{business.trade_name}"
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {business.business_type}
              </span>
              {business.days_old <= 7 && (
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                  NEW THIS WEEK
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              <span>Location</span>
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900 font-medium mb-1">{business.address}</p>
              <p className="text-gray-600">{business.community}, Calgary</p>
            </div>
            
            {/* Interactive Google Map */}
            <div className="mt-4">
              <GoogleMap
                address={business.address}
                businessName={business.business_name}
                className="h-64 w-full rounded-lg border border-gray-200"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-3">
              {business.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <a 
                    href={`tel:${business.phone}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {business.phone}
                  </a>
                </div>
              )}
              
              {business.website && (
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <a 
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
              
              {!business.phone && !business.website && (
                <p className="text-gray-500 text-sm">
                  Contact information not available. Business owners can 
                  <button className="text-blue-600 hover:text-blue-800 ml-1 font-medium">
                    claim this listing
                  </button> 
                  to add details.
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            
            {!isFeatured && (
              <button 
                onClick={onFeature}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <Star className="w-4 h-4" />
                <span>Feature Business</span>
              </button>
            )}
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              <span>Report Issue</span>
            </button>
            
            <button 
              onClick={onClaim}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <span>Claim Business</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};