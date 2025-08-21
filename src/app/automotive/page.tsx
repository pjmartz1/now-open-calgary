import { Metadata } from 'next'
import { Car, MapPin, Calendar, Wrench, Fuel, Shield } from 'lucide-react'
import CalgaryBusinessGrid from '@/components/CalgaryBusinessGrid'
import { BusinessService } from '@/services/businessService'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'New Automotive Businesses Calgary 2024 | Car Services & Dealerships | Now Open Calgary',
  description: 'Discover new automotive businesses in Calgary! Car dealerships, auto repair shops, detailing services, and vehicle services opening in YYC. Updated daily.',
  keywords: ['new automotive calgary', 'car dealerships calgary', 'auto repair calgary', 'car detailing calgary', 'vehicle services calgary', 'automotive services calgary', 'YYC automotive'],
  openGraph: {
    title: 'New Automotive Businesses Calgary 2024 | Car Services & Dealerships',
    description: 'Discover new automotive businesses in Calgary! Car dealerships, auto repair shops, and vehicle services opening in YYC.',
    type: 'website',
    url: 'https://www.nowopencalgary.ca/automotive',
    siteName: 'Now Open Calgary'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Automotive Businesses Calgary 2024 | Car Services & Dealerships',
    description: 'Discover new automotive businesses in Calgary! Car dealerships, auto repair shops, and vehicle services opening in YYC.'
  },
  alternates: {
    canonical: 'https://www.nowopencalgary.ca/automotive'
  }
}

export default async function AutomotivePage() {
  const automotiveBusinesses = await BusinessService.getCalgaryBusinessesByCategory('automotive', 50)

  // Get some stats
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const recentCount = automotiveBusinesses.filter(r => new Date(r.first_issued_date) >= oneWeekAgo).length
  const communities = [...new Set(automotiveBusinesses.map(r => r.community).filter(Boolean))].length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-700 via-gray-700 to-zinc-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full">
                <Car className="w-12 h-12" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              New Automotive Businesses in Calgary
            </h1>
            <p className="text-xl text-slate-100 max-w-3xl mx-auto mb-8">
              Discover the newest automotive dealerships, repair shops, detailing services, and vehicle service centers opening their doors in Calgary. Keep your vehicle running smoothly with YYC&apos;s latest automotive services.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-slate-100">
              <div className="flex items-center">
                <Car className="w-5 h-5 mr-2" />
                <span className="font-semibold">{automotiveBusinesses.length}</span>
                <span className="ml-1">automotive businesses</span>
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
                  <span className="ml-1">communities served</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Automotive Categories */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Automotive Services</h2>
            <p className="text-gray-600">Find the right automotive service for your vehicle</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg">
              <Wrench className="w-8 h-8 text-slate-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Repair & Maintenance</h3>
                <p className="text-sm text-gray-600">Auto repair, oil changes, tire services</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <Fuel className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Dealerships & Sales</h3>
                <p className="text-sm text-gray-600">New & used car lots, financing</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
              <Shield className="w-8 h-8 text-emerald-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Detailing & Care</h3>
                <p className="text-sm text-gray-600">Car washes, detailing, paint protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/businesses?category=automotive"
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              All Automotive
            </Link>
            <Link
              href="/restaurants"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Restaurants
            </Link>
            <Link
              href="/retail"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Retail
            </Link>
            <Link
              href="/services"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Services
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

      {/* Automotive Business Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {automotiveBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No automotive businesses found</h3>
            <p className="text-gray-600 mb-6">
              We haven&apos;t found any automotive businesses in our database yet. Check back soon!
            </p>
            <Link
              href="/businesses"
              className="inline-flex items-center px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse All Businesses
            </Link>
          </div>
        ) : (
          <>
            <CalgaryBusinessGrid 
              businesses={automotiveBusinesses}
              title="New Automotive Services"
              subtitle="The latest automotive dealerships and service centers opening in Calgary"
            />

            {/* Call to Action */}
            <div className="text-center mt-16 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Need automotive services?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Use our advanced search to find automotive services by type, location, or specialty.
              </p>
              <Link
                href="/businesses?category=automotive"
                className="inline-flex items-center px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
              >
                Search All Automotive Services
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
            "name": "New Automotive Businesses in Calgary",
            "description": "Discover the newest automotive dealerships, repair shops, and vehicle services opening in Calgary.",
            "url": "https://www.nowopencalgary.ca/automotive",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": automotiveBusinesses.length,
              "itemListElement": automotiveBusinesses.slice(0, 10).map((business, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "AutomotiveBusiness",
                  "name": business.tradename,
                  "@id": `https://www.nowopencalgary.ca/business/${business.slug}`,
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": business.address,
                    "addressLocality": "Calgary",
                    "addressRegion": "AB",
                    "addressCountry": "CA"
                  },
                  "url": `https://www.nowopencalgary.ca/business/${business.slug}`
                }
              }))
            }
          })
        }}
      />
    </div>
  )
}