
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface BusinessLocationProps {
  address: string;
  community: string;
  className?: string;
}

export const BusinessLocation: React.FC<BusinessLocationProps> = ({ 
  address, 
  community, 
  className = "h-64 w-full rounded-lg" 
}) => {
  const getDirectionsUrl = (address: string) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address + ', Calgary, AB, Canada')}`;
  };

  const getStreetViewUrl = (address: string) => {
    return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${encodeURIComponent(address + ', Calgary, AB, Canada')}`;
  };

  return (
    <div className={`${className} bg-gray-50 border border-gray-200 rounded-lg p-6`}>
      <div className="flex items-start space-x-4">
        {/* Location Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6 text-red-600" />
          </div>
        </div>

        {/* Location Details */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
          
          <div className="space-y-2">
            <p className="text-gray-900 font-medium">{address}</p>
            <p className="text-gray-600">{community}, Calgary</p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={getDirectionsUrl(address)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            
            <a
              href={getStreetViewUrl(address)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              <span>Street View</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4 text-center">
        <div className="text-gray-500">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm font-medium mb-1">Interactive Map</p>
          <p className="text-xs text-gray-400">
            Map integration coming soon. Use the buttons above for directions and street view.
          </p>
        </div>
      </div>
    </div>
  );
};
