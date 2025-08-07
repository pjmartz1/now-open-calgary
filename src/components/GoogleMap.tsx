import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Eye, ExternalLink } from 'lucide-react';
import { createMap, geocodeAddress, getDirectionsUrl, getStreetViewUrl, MapLocation } from '../services/googleMapsService';

interface GoogleMapProps {
  address: string;
  businessName: string;
  className?: string;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({ 
  address, 
  businessName, 
  className = "h-64 w-full rounded-lg" 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<MapLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    // Initialize immediately when component mounts
    if (mapRef.current) {
      initializeMap();
    }
  }, [address, businessName]);

  const initializeMap = async () => {
    if (!mapRef.current) {
      console.warn('⚠️ Map container not ready');
      return;
    }

    // Check if API key is configured
    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      setError('Google Maps API key not configured');
      setLoading(false);
      return;
    }

    console.log(`🗺️ Initializing map for: ${businessName}`);
    setLoading(true);
    setError(null);

    try {
      // Geocode the address
      const geocodedLocation = await geocodeAddress(address);
      
      if (!geocodedLocation) {
        setError('Unable to find location on map');
        setLoading(false);
        return;
      }

      setLocation(geocodedLocation);

      // Create the map
      const mapInstance = await createMap(mapRef.current, {
        ...geocodedLocation,
        name: businessName
      });

      if (mapInstance) {
        setMap(mapInstance);
        console.log('✅ Map created successfully for:', businessName);
      } else {
        setError('Failed to load map');
      }
    } catch (err) {
      console.error('❌ Map initialization error:', err);
      if (err.message?.includes('API key')) {
        setError('Google Maps API key issue');
      } else {
        setError('Failed to load map');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300`}>
        <div className="text-center text-gray-500">
          <MapPin className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm font-medium mb-1">Map unavailable</p>
          <p className="text-xs">{error}</p>
          {location && (
            <div className="mt-3 space-y-1">
              <a
                href={getDirectionsUrl(address)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
              >
                <Navigation className="w-3 h-3" />
                <span>Get Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapRef} className={className} />
      
      {/* Map Controls */}
      {location && (
        <div className="absolute bottom-3 left-3 flex space-x-2">
          <a
            href={getDirectionsUrl(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white shadow-lg rounded-lg px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-1"
          >
            <Navigation className="w-3 h-3" />
            <span>Directions</span>
          </a>
          
          <a
            href={getStreetViewUrl(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white shadow-lg rounded-lg px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-1"
          >
            <Eye className="w-3 h-3" />
            <span>Street View</span>
          </a>
        </div>
      )}
    </div>
  );
};