import { Metadata } from 'next'
import { Briefcase, MapPin, Calendar } from 'lucide-react'
import CalgaryBusinessGrid from '@/components/CalgaryBusinessGrid'
import { BusinessService } from '@/services/businessService'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'New Services in Calgary - Now Open Calgary',
  description: 'Discover the newest service providers opening in Calgary. Find professional services, personal care, and specialized services in YYC.',
  keywords: ['Calgary services', 'new services Calgary', 'Calgary professionals', 'YYC services', 'Calgary business services', 'Alberta services'],
  openGraph: {
    title: 'New Services in Calgary - Now Open Calgary',
    description: 'Discover the newest service providers opening in Calgary.',
    type: 'website',
    url: 'https://nowopencalgary.ca/services',
    siteName: 'Now Open Calgary'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Services in Calgary - Now Open Calgary',
    description: 'Discover the newest service providers opening in Calgary.'
  },
  alternates: {
    canonical: 'https://nowopencalgary.ca/services'
  }
}

export default async function ServicesPage() {
  const services = await BusinessService.getCalgaryBusinessesByCategory('services', 50)

  // Get some stats
  const recentCount = services.filter(s => s.isNew).length
  const communities = [...new Set(services.map(s => s.community).filter(Boolean))].length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full">
                <Briefcase className="w-12 h-12" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              New Services in Calgary
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Discover the newest service providers opening their doors in Calgary. From professional services to personal care, explore what&apos;s new in YYC&apos;s service industry.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-green-100">
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                <span className="font-semibold">{services.length}</span>
                <span className="ml-1">services found</span>
              </div>
              {recentCount > 0 && (
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{recentCount}</span>
                  <span className="ml-1">opened this week</span>
                </div>
              )}
              {communities > 0 && (
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{communities}</span>
                  <span className="ml-1">communities</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/businesses?category=services"
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              All Services
            </Link>
            <Link
              href="/restaurants"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              New Restaurants
            </Link>
            <Link
              href="/retail"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              New Shops
            </Link>
            <Link
              href="/businesses"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              All Categories
            </Link>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {services.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No service providers found</h3>
            <p className="text-gray-600 mb-6">
              We haven&apos;t found any service providers in our database yet. Check back soon!
            </p>
            <Link
              href="/businesses"
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse All Businesses
            </Link>
          </div>
        ) : (
          <>
            <CalgaryBusinessGrid 
              businesses={services}
              title="Featured Service Providers"
              subtitle="The latest service providers and professionals opening in Calgary"
            />

            {/* Call to Action */}
            <div className="text-center mt-16 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Looking for something specific?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Use our advanced search to find service providers by location, specialty, or opening date.
              </p>
              <Link
                href="/businesses?category=services"
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                Search All Services
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "New Services in Calgary",
            "description": "Discover the newest service providers opening in Calgary.",
            "url": "https://nowopencalgary.ca/services",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": services.length,
              "itemListElement": services.slice(0, 10).map((service, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "LocalBusiness",
                  "name": service.tradename,
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": service.address,
                    "addressLocality": "Calgary",
                    "addressRegion": "AB",
                    "addressCountry": "CA"
                  },
                  "url": `https://nowopencalgary.ca/business/${service.slug}`
                }
              }))
            }
          })
        }}
      />
    </div>
  )
}