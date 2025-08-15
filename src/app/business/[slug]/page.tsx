import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { MapPin, Calendar, ExternalLink, Eye, ArrowLeft, Navigation } from 'lucide-react'
import Link from 'next/link'
import { BusinessService } from '@/services/businessService'
import { CalgaryBusiness } from '@/types/business'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const business = await BusinessService.getCalgaryBusinessBySlug(slug)
  
  if (!business) {
    return {
      title: 'Business Not Found - Now Open Calgary',
      description: 'The requested business could not be found.'
    }
  }

  const categoryMap: Record<string, string> = {
    'restaurants': 'Restaurant',
    'retail': 'Shop',
    'services': 'Service Business',
    'healthcare': 'Healthcare Provider',
    'entertainment': 'Entertainment Venue'
  }
  
  const businessType = categoryMap[business.category || ''] || 'Business'
  const neighborhood = business.community ? ` in ${business.community}` : ''
  
  const title = `${business.tradename} - New ${businessType}${neighborhood} | Now Open Calgary`
  const description = `${business.tradename} is a new ${business.license_type.toLowerCase()} located at ${business.address} in Calgary${business.community ? `, ${business.community}` : ''}. Opened ${new Date(business.first_issued_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}. Find hours, location & more.`

  const keywords = [
    business.tradename,
    `${business.tradename} Calgary`,
    `new ${businessType.toLowerCase()} calgary`,
    business.community ? `${business.community} ${businessType.toLowerCase()}` : '',
    business.category ? `new ${business.category} calgary` : '',
    'calgary business directory',
    'now open calgary'
  ].filter(Boolean)

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_CA',
      siteName: 'Now Open Calgary',
      images: [
        {
          url: '/og-business.jpg',
          width: 1200,
          height: 630,
          alt: `${business.tradename} in Calgary`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://www.nowopencalgary.ca/business/${business.slug}`
    }
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getCategoryColor(category: string | null): string {
  const categoryColors: Record<string, string> = {
    restaurants: 'bg-red-100 text-red-700 border-red-200',
    retail: 'bg-blue-100 text-blue-700 border-blue-200',
    services: 'bg-green-100 text-green-700 border-green-200',
    healthcare: 'bg-purple-100 text-purple-700 border-purple-200',
    entertainment: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  }
  
  return categoryColors[category || 'other'] || 'bg-gray-100 text-gray-700 border-gray-200'
}

function generateGoogleMapsUrl(business: CalgaryBusiness): string {
  const address = encodeURIComponent(`${business.address}, Calgary, AB`)
  return `https://www.google.com/maps/search/?api=1&query=${address}`
}

function generateDirectionsUrl(business: CalgaryBusiness): string {
  if (business.latitude && business.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`
  }
  const address = encodeURIComponent(`${business.address}, Calgary, AB`)
  return `https://www.google.com/maps/dir/?api=1&destination=${address}`
}

function BusinessSchema({ business }: { business: CalgaryBusiness }) {
  const businessTypeMap: Record<string, string> = {
    'restaurants': 'Restaurant',
    'retail': 'Store',
    'services': 'LocalBusiness',
    'healthcare': 'MedicalOrganization',
    'entertainment': 'EntertainmentBusiness'
  }
  
  const schemaType = businessTypeMap[business.category || ''] || 'LocalBusiness'
  
  const schema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": business.tradename,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address,
      "addressLocality": "Calgary",
      "addressRegion": "AB",
      "addressCountry": "CA"
    },
    "geo": business.latitude && business.longitude ? {
      "@type": "GeoCoordinates",
      "latitude": parseFloat(business.latitude.toString()),
      "longitude": parseFloat(business.longitude.toString())
    } : undefined,
    "url": `https://www.nowopencalgary.ca/business/${business.slug}`,
    "description": `New ${business.license_type.toLowerCase()} in Calgary${business.community ? `, ${business.community}` : ''}. Opened ${new Date(business.first_issued_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}.`,
    "openingDate": business.first_issued_date,
    "priceRange": "$$",
    "areaServed": {
      "@type": "City",
      "name": "Calgary",
      "addressRegion": "AB",
      "addressCountry": "CA"
    },
    "foundingDate": business.first_issued_date,
    "sameAs": [
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address + ', Calgary, AB')}`
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default async function BusinessPage({ params }: Props) {
  const { slug } = await params
  const business = await BusinessService.getCalgaryBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const isNew = new Date(business.first_issued_date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  return (
    <>
      <BusinessSchema business={business} />
      
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/businesses"
              className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all businesses
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-4xl font-bold">{business.tradename}</h1>
                  {isNew && (
                    <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      New!
                    </span>
                  )}
                </div>
                
                {business.category && (
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(business.category)} bg-white/90`}>
                      {business.category.charAt(0).toUpperCase() + business.category.slice(1)}
                    </span>
                  </div>
                )}

                <div className="flex items-center text-indigo-100 mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-lg">
                    {business.address}
                    {business.community && (
                      <span className="text-indigo-200">, {business.community}</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center text-indigo-100">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Opened {formatDate(business.first_issued_date)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Information</h2>
                
                <div className="space-y-6">
                  {/* License Type */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">License Type</h3>
                    <p className="text-gray-700">{business.license_type}</p>
                  </div>

                  {/* Location Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                    <p className="text-gray-700 mb-3">
                      {business.address}<br />
                      {business.community && `${business.community}, `}Calgary, Alberta
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={generateGoogleMapsUrl(business)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on Google Maps
                      </a>
                      
                      <a
                        href={generateDirectionsUrl(business)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </a>
                    </div>
                  </div>

                  {/* Opening Date */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Opening Date</h3>
                    <p className="text-gray-700">{formatDate(business.first_issued_date)}</p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Details</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Calgary Business ID</h4>
                    <p className="text-gray-600">{business.calgary_id}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Consumer Facing</h4>
                    <p className="text-gray-600">
                      {business.is_consumer_facing ? 'Yes' : 'No'}
                    </p>
                  </div>
                  
                  {business.latitude && business.longitude && (
                    <>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Latitude</h4>
                        <p className="text-gray-600">{business.latitude}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Longitude</h4>
                        <p className="text-gray-600">{business.longitude}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Views</span>
                    <div className="flex items-center text-gray-900">
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="font-semibold">{business.view_count}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-semibold text-gray-900">
                      {business.category ? 
                        business.category.charAt(0).toUpperCase() + business.category.slice(1) : 
                        'General'
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Community</span>
                    <span className="font-semibold text-gray-900">
                      {business.community || 'Calgary'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    Data sourced from the City of Calgary
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}