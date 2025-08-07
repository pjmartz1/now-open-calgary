
import { X, Phone, Globe, Star, Building } from 'lucide-react';
import { Business } from '../types/Business';
import { BusinessLocation } from './BusinessLocation';

interface BusinessModalProps {
  business: Business;
  onClose: () => void;
  onFeature: (business: Business) => void;
  onClaim: (business: Business) => void;
  onReport: (business: Business) => void;
}

export const BusinessModal: React.FC<BusinessModalProps> = ({
  business,
  onClose,
  onFeature,
  onClaim,
  onReport
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{business.business_name}</h2>
              {business.trade_name && (
                <p className="text-sm text-gray-600">Also known as '{business.trade_name}'</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {business.business_type}
            </span>
            {business.featured && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>Featured</span>
              </span>
            )}
            {business.days_old <= 7 && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                NEW THIS WEEK
              </span>
            )}
          </div>

          {/* Location */}
          <div>
            <BusinessLocation
              address={business.address}
              community={business.community}
              className="w-full"
            />
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-3">
              {business.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{business.phone}</span>
                </div>
              )}
              {business.website && (
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onFeature(business)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Star className="w-4 h-4" />
              <span>Feature Business</span>
            </button>
            <button
              onClick={() => onClaim(business)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Claim Business
            </button>
            <button
              onClick={() => onReport(business)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Report Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};