import { Metadata } from 'next'
import { Heart, MapPin, Calendar, Stethoscope, Pill, Activity } from 'lucide-react'
import CalgaryBusinessGrid from '@/components/CalgaryBusinessGrid'
import { BusinessService } from '@/services/businessService'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'New Healthcare Businesses Calgary 2025 | Medical Clinics & Health Services | Now Open Calgary',
  description: 'Discover new healthcare businesses in Calgary 2025! Medical clinics, dental offices, pharmacies, physiotherapy, wellness centers opening in YYC. Updated daily.',
  keywords: ['new healthcare calgary', 'medical clinics calgary', 'dental offices calgary', 'pharmacies calgary', 'physiotherapy calgary', 'wellness centers calgary', 'health services calgary', 'YYC healthcare'],
  openGraph: {
    title: 'New Healthcare Businesses Calgary 2025 | Medical & Health Services',
    description: 'Discover new healthcare businesses in Calgary 2025! Medical clinics, dental offices, pharmacies, wellness centers opening in YYC.',
    type: 'website',
    url: 'https://www.nowopencalgary.ca/healthcare',
    siteName: 'Now Open Calgary'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Healthcare Businesses Calgary 2025 | Medical & Health Services',
    description: 'Discover new healthcare businesses in Calgary! Medical clinics, dental offices, pharmacies, and wellness centers opening in YYC.'
  },
  alternates: {
    canonical: 'https://www.nowopencalgary.ca/healthcare'
  }
}

export default async function HealthcarePage() {
  const healthcareBusinesses = await BusinessService.getCalgaryBusinessesByCategory('healthcare', 50)

  // Get some stats
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const recentCount = healthcareBusinesses.filter(r => new Date(r.first_issued_date) >= oneWeekAgo).length
  const communities = [...new Set(healthcareBusinesses.map(r => r.community).filter(Boolean))].length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full">
                <Heart className="w-12 h-12" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              New Healthcare Businesses in Calgary
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Discover the newest healthcare providers, medical clinics, dental offices, pharmacies, and wellness centers opening their doors in Calgary. Your health and wellness community is growing.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-blue-100">
              <div className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                <span className="font-semibold">{healthcareBusinesses.length}</span>
                <span className="ml-1">healthcare providers</span>
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

      {/* Healthcare Categories */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Healthcare Categories</h2>
            <p className="text-gray-600">Find the right healthcare service for your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <Stethoscope className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Medical Clinics</h3>
                <p className="text-sm text-gray-600">Family doctors, specialists, walk-in clinics</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <Pill className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Pharmacies</h3>
                <p className="text-sm text-gray-600">Prescription services, health consultations</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <Activity className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Wellness Centers</h3>
                <p className="text-sm text-gray-600">Physiotherapy, massage, mental health</p>
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
              href="/businesses?category=healthcare"
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              All Healthcare
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

      {/* Healthcare Business Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {healthcareBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No healthcare businesses found</h3>
            <p className="text-gray-600 mb-6">
              We haven&apos;t found any healthcare businesses in our database yet. Check back soon!
            </p>
            <Link
              href="/businesses"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse All Businesses
            </Link>
          </div>
        ) : (
          <>
            <CalgaryBusinessGrid 
              businesses={healthcareBusinesses}
              title="New Healthcare Providers"
              subtitle="The latest healthcare businesses and medical services opening in Calgary"
            />

            {/* Call to Action */}
            <div className="text-center mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Need a specific healthcare service?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Use our advanced search to find healthcare providers by specialty, location, or services offered.
              </p>
              <Link
                href="/businesses?category=healthcare"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Search All Healthcare Providers
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
            "name": "New Healthcare Businesses in Calgary",
            "description": "Discover the newest healthcare providers, medical clinics, and wellness centers opening in Calgary.",
            "url": "https://www.nowopencalgary.ca/healthcare",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": healthcareBusinesses.length,
              "itemListElement": healthcareBusinesses.slice(0, 10).map((business, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "LocalBusiness",
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