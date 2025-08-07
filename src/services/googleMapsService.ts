import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places', 'geometry']
});

export interface MapLocation {
  lat: number;
  lng: number;
  address: string;
  name: string;
}

let googleMapsLoaded = false;
let google: any = null;
let geocodeCache = new Map<string, MapLocation | null>();
let apiCallCount = 0;
const MAX_API_CALLS_PER_SESSION = 50; // Reduced for cost control
const RATE_LIMIT_DELAY = 50; // Reduced delay for faster loading

export const loadGoogleMaps = async (): Promise<any> => {
  // Check if API key is available
  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key not found in environment variables');
    throw new Error('Google Maps API key not configured');
  }

  if (googleMapsLoaded && google) {
    return google;
  }

  try {
    console.log('🗺️ Loading Google Maps API with key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.substring(0, 10) + '...');
    google = await loader.load();
    googleMapsLoaded = true;
    console.log('✅ Google Maps API loaded successfully');
    return google;
  } catch (error) {
    console.error('❌ Error loading Google Maps API:', error);
    throw error;
  }
};

export const geocodeAddress = async (address: string): Promise<MapLocation | null> => {
  // Check API call limit
  if (apiCallCount >= MAX_API_CALLS_PER_SESSION) {
    console.warn('Google Maps API call limit reached for this session');
    return null;
  }

  // Check cache first
  const cacheKey = `${address}, Calgary, AB, Canada`.toLowerCase();
  if (geocodeCache.has(cacheKey)) {
    console.log('Using cached geocoding result for:', address);
    return geocodeCache.get(cacheKey) || null;
  }

  try {
    const google = await loadGoogleMaps();
    const geocoder = new google.maps.Geocoder();

    // Minimal rate limiting for faster loading
    if (apiCallCount > 0) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
    }
    apiCallCount++;

    console.log(`🔍 Geocoding: ${address} (API call #${apiCallCount})`);

    return new Promise((resolve, reject) => {
      geocoder.geocode({ address: `${address}, Calgary, AB, Canada` }, (results: any[], status: string) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const result = {
            lat: location.lat(),
            lng: location.lng(),
            address: results[0].formatted_address,
            name: address
          };
          
          // Cache the result
          geocodeCache.set(cacheKey, result);
          console.log('✅ Geocoded and cached:', address);
          resolve(result);
        } else {
          console.warn('⚠️ Geocoding failed:', status, address);
          // Cache null result to avoid repeated failed calls
          geocodeCache.set(cacheKey, null);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('❌ Geocoding error:', error);
    return null;
  }
};

export const createMap = async (
  container: HTMLElement,
  location: MapLocation,
  options?: google.maps.MapOptions
): Promise<google.maps.Map | null> => {
  // Check API key
  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not configured');
    return null;
  }

  try {
    const google = await loadGoogleMaps();

    const defaultOptions: google.maps.MapOptions = {
      center: { lat: location.lat, lng: location.lng },
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi.business',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ],
      ...options
    };

    const map = new google.maps.Map(container, defaultOptions);

    // Add marker for the business
    const marker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: map,
      title: location.name,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#DC2626" stroke="white" stroke-width="2"/>
            <circle cx="16" cy="16" r="4" fill="white"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16)
      }
    });

    // Add info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 8px; max-width: 200px;">
          <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: #1f2937;">
            ${location.name}
          </h3>
          <p style="margin: 0; font-size: 12px; color: #6b7280;">
            ${location.address}
          </p>
          <div style="margin-top: 8px;">
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}" 
              target="_blank" 
              style="color: #dc2626; text-decoration: none; font-size: 12px; font-weight: 500;"
            >
              Get Directions →
            </a>
          </div>
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    return map;
  } catch (error) {
    console.error('Error creating map:', error);
    return null;
  }
};

export const getDirectionsUrl = (address: string): string => {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address + ', Calgary, AB, Canada')}`;
};

export const getStreetViewUrl = (address: string): string => {
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${encodeURIComponent(address + ', Calgary, AB, Canada')}`;
};