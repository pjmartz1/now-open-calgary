
import { MapPin, Star, ExternalLink } from 'lucide-react';
import { Business } from '../types/Business';
import { getDirectionsUrl } from '../services/googleMapsService';
import { BusinessImage } from './BusinessImage';

interface BusinessCardProps {
  business: Business;
  isFeatured: boolean;
  onClick: () => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ 
  business, 
  isFeatured, 
  onClick 
}) => {
  const isNew = business.days_old <= 7;
  const isVeryNew = business.days_old <= 3;

  const formatDaysOld = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days <= 7) return `${days} days ago`;
    if (days <= 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div 
      onClick={onClick}
      className={`
        bg-white rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group h-full flex flex-col
        ${isFeatured ? 'ring-2 ring-red-500 border-red-200 relative overflow-hidden' : 'hover:border-gray-300'}
      `}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <>
          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-bl-lg text-xs font-semibold flex items-center space-x-1">
            <Star className="w-3 h-3 fill-current" />
            <span>Featured</span>
          </div>
        </>
      )}

      <div className="p-4 flex flex-col h-full">
        {/* Business Image */}
        <div className="mb-4">
          <BusinessImage
            businessType={business.business_type}
            businessName={business.business_name}
            className="rounded-lg"
            priority={isFeatured}
          />
        </div>

        {/* Header */}
        <div className={`${isFeatured ? 'pt-0' : ''} flex-1`}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 flex-1 mr-2">
              {business.business_name}
            </h3>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors flex-shrink-0 mt-0.5" />
          </div>

          {/* Trade Name */}
          {business.trade_name && business.trade_name !== business.business_name && (
            <p className="text-sm text-gray-600 mb-2 italic">
              "{business.trade_name}"
            </p>
          )}

          {/* Business Type */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {business.business_type}
            </span>
            {isVeryNew && (
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full animate-pulse">
                NEW
              </span>
            )}
          </div>

          {/* Address */}
          <div className="flex items-start space-x-2 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
            <div>
              <a 
                href={getDirectionsUrl(business.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {business.address}
              </a>
              <p className="text-gray-500">{business.community}</p>
            </div>
          </div>

          {/* Contact Info */}
          {(business.phone || business.website) && (
            <div className="space-y-1 mb-3">
              {business.phone && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">📞</span> {business.phone}
                </p>
              )}
              {business.website && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">🌐</span> 
                  <a 
                    href={business.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-1 text-blue-600 hover:text-blue-800 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit
                  </a>
                </p>
              )}
            </div>
          )}

          {/* Business Description */}
          {business.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {business.description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <div className={`text-xs px-2 py-1 rounded-full font-medium ${
            isNew 
              ? 'bg-green-100 text-green-800' 
              : business.days_old <= 30
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {formatDaysOld(business.days_old)}
          </div>

          <span className="text-blue-600 group-hover:text-blue-800 text-xs font-medium flex items-center space-x-1">
            <span>View Details</span>
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};