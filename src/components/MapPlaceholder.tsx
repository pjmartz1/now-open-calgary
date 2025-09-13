import { MapPin, Navigation, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MapPlaceholderProps {
  address: string
  businessName: string
  latitude?: number | null
  longitude?: number | null
  className?: string
}

export default function MapPlaceholder({ 
  address, 
  businessName, 
  latitude, 
  longitude, 
  className 
}: MapPlaceholderProps) {
  const generateGoogleMapsUrl = () => {
    if (latitude && longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    }
    const encodedAddress = encodeURIComponent(`${address}, Calgary, AB`)
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
  }

  const generateDirectionsUrl = () => {
    if (latitude && longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    }
    const encodedAddress = encodeURIComponent(`${address}, Calgary, AB`)
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`
  }

  return (
    <div className={cn("bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", className)}>
      {/* Map Placeholder */}
      <div className="relative h-64 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg 
            className="w-full h-full" 
            viewBox="0 0 400 200" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Grid Pattern */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Mock Streets */}
            <path d="M0 80 L400 80" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
            <path d="M0 120 L400 120" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
            <path d="M120 0 L120 200" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
            <path d="M280 0 L280 200" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
          </svg>
        </div>

        {/* Location Pin */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-red-500 text-white p-3 rounded-full shadow-lg animate-bounce">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        {/* Coming Soon Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
            Interactive Map Coming Soon
          </span>
        </div>
      </div>

      {/* Map Info */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
        
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">{businessName}</p>
            <p className="text-gray-600">{address}</p>
            <p className="text-gray-500">Calgary, Alberta</p>
          </div>
        </div>

        {/* Coordinates */}
        {latitude && longitude && (
          <div className="text-sm text-gray-500 mb-4">
            <span className="font-medium">Coordinates:</span> {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={generateGoogleMapsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            View on Google Maps
          </a>
          
          <a
            href={generateDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Navigation className="w-4 h-4" />
            Get Directions
          </a>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            We&apos;re working on adding interactive maps with nearby businesses, parking info, and transit options.
          </p>
        </div>
      </div>
    </div>
  )
}