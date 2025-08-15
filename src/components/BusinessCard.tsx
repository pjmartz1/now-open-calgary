import { MapPin, Phone, Globe, Clock, Star } from 'lucide-react'
import Image from 'next/image'
import { Business } from '@/lib/supabase'
import { formatDate, formatPhone, cn } from '@/lib/utils'

interface BusinessCardProps {
  business: Business
  className?: string
}

export default function BusinessCard({ business, className }: BusinessCardProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "description": business.description,
    "url": business.website,
    "telephone": business.phone,
    "email": business.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address,
      "addressLocality": business.city,
      "addressRegion": business.province,
      "postalCode": business.postal_code,
      "addressCountry": "CA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": business.latitude,
      "longitude": business.longitude
    },
    "openingHours": business.hours,
    "image": business.images[0] || null,
    "priceRange": "$$",
    "category": business.category,
    "dateCreated": business.created_at,
    "dateModified": business.updated_at
  }

  return (
    <article 
      className={cn(
        "bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100",
        className
      )}
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      {/* Business Image */}
      {business.images && business.images.length > 0 && (
        <div className="relative h-56 lg:h-64 overflow-hidden">
          <Image
            src={business.images[0]}
            alt={`${business.name} in Calgary`}
            fill
            className="object-cover"
            itemProp="image"
          />
          {business.featured && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Star className="w-4 h-4" />
              Featured
            </div>
          )}
        </div>
      )}
      
      {/* Business Content */}
      <div className="p-8 lg:p-10">
        {/* Header */}
        <div className="mb-4">
          <h3 
            className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 hover:text-indigo-600 transition-colors"
            itemProp="name"
          >
            {business.name}
          </h3>
          <p 
            className="text-gray-600 text-base lg:text-lg mb-4"
            itemProp="description"
          >
            {business.description}
          </p>
          
          {/* Category Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-4">
            {business.category}
          </div>
        </div>
        
        {/* Details */}
        <div className="space-y-3 mb-6">
          {/* Address */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
            <address 
              className="not-italic"
              itemProp="address"
              itemScope
              itemType="https://schema.org/PostalAddress"
            >
              <span itemProp="streetAddress">{business.address}</span>,{' '}
              <span itemProp="addressLocality">{business.city}</span>,{' '}
              <span itemProp="addressRegion">{business.province}</span>{' '}
              <span itemProp="postalCode">{business.postal_code}</span>
            </address>
          </div>
          
          {/* Phone */}
          {business.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-indigo-500" />
              <a 
                href={`tel:${business.phone}`}
                className="hover:text-indigo-600 transition-colors"
                itemProp="telephone"
              >
                {formatPhone(business.phone)}
              </a>
            </div>
          )}
          
          {/* Website */}
          {business.website && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="w-4 h-4 text-indigo-500" />
              <a 
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 transition-colors truncate"
                itemProp="url"
              >
                Visit Website
              </a>
            </div>
          )}
          
          {/* Opening Date */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>Opened {formatDate(business.opening_date)}</span>
          </div>
        </div>
        
        {/* Features */}
        {business.features && business.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {business.features.slice(0, 3).map((feature, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-md"
                >
                  {feature}
                </span>
              ))}
              {business.features.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                  +{business.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <a
            href={`https://maps.google.com/maps?q=${encodeURIComponent(business.address + ', Calgary, AB')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-center py-2 px-4 rounded-lg font-medium hover:from-indigo-600 hover:to-pink-600 transition-all duration-300"
          >
            Get Directions
          </a>
          <a
            href={`/business/${business.slug}`}
            className="flex-1 border border-indigo-500 text-indigo-600 text-center py-2 px-4 rounded-lg font-medium hover:bg-indigo-50 transition-all duration-300"
          >
            View Details
          </a>
        </div>
      </div>
    </article>
  )
}
