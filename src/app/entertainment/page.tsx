import { Metadata } from 'next'
import { Music, MapPin, Calendar, Theater, GamepadIcon, Camera } from 'lucide-react'
import CalgaryBusinessGrid from '@/components/CalgaryBusinessGrid'
import { BusinessService } from '@/services/businessService'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'New Entertainment Businesses Calgary 2024 | Venues & Activities | Now Open Calgary',
  description: 'Discover new entertainment venues in Calgary! Theaters, music venues, gaming centers, escape rooms, and fun activities opening in YYC. Updated daily.',
  keywords: ['new entertainment calgary', 'music venues calgary', 'theaters calgary', 'gaming centers calgary', 'escape rooms calgary', 'entertainment venues calgary', 'fun activities calgary', 'YYC entertainment'],
  openGraph: {
    title: 'New Entertainment Businesses Calgary 2024 | Venues & Activities',
    description: 'Discover new entertainment venues in Calgary! Theaters, music venues, gaming centers, and fun activities opening in YYC.',
    type: 'website',
    url: 'https://www.nowopencalgary.ca/entertainment',
    siteName: 'Now Open Calgary'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Entertainment Businesses Calgary 2024 | Venues & Activities',
    description: 'Discover new entertainment venues in Calgary! Theaters, music venues, gaming centers, and fun activities opening in YYC.'
  },
  alternates: {
    canonical: 'https://www.nowopencalgary.ca/entertainment'
  }
}

export default async function EntertainmentPage() {
  const entertainmentBusinesses = await BusinessService.getCalgaryBusinessesByCategory('entertainment', 50)

  // Get some stats
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const recentCount = entertainmentBusinesses.filter(r => new Date(r.first_issued_date) >= oneWeekAgo).length
  const communities = [...new Set(entertainmentBusinesses.map(r => r.community).filter(Boolean))].length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full">
                <Music className="w-12 h-12" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              New Entertainment Venues in Calgary
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Discover the newest entertainment venues, theaters, music spaces, gaming centers, and fun activities opening their doors in Calgary. Your next adventure awaits in YYC!
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-purple-100">
              <div className="flex items-center">
                <Music className="w-5 h-5 mr-2" />
                <span className="font-semibold">{entertainmentBusinesses.length}</span>
                <span className="ml-1">entertainment venues</span>
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

      {/* Entertainment Categories */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Entertainment Categories</h2>
            <p className="text-gray-600">Find your next fun experience in Calgary</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <Theater className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Theaters & Venues</h3>
                <p className="text-sm text-gray-600">Live performances, concerts, comedy shows</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg">
              <GamepadIcon className="w-8 h-8 text-pink-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Gaming & Activities</h3>
                <p className="text-sm text-gray-600">Escape rooms, arcade, bowling, mini golf</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
              <Camera className="w-8 h-8 text-red-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Experiences</h3>
                <p className="text-sm text-gray-600">Photo studios, art galleries, workshops</p>
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
              href="/businesses?category=entertainment"
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              All Entertainment
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

      {/* Entertainment Business Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {entertainmentBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No entertainment venues found</h3>
            <p className="text-gray-600 mb-6">
              We haven&apos;t found any entertainment businesses in our database yet. Check back soon!
            </p>
            <Link
              href="/businesses"
              className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse All Businesses
            </Link>
          </div>
        ) : (
          <>
            <CalgaryBusinessGrid 
              businesses={entertainmentBusinesses}
              title="New Entertainment Venues"
              subtitle="The latest entertainment venues and fun activities opening in Calgary"
            />

            {/* Call to Action */}
            <div className="text-center mt-16 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Looking for something fun to do?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Use our advanced search to find entertainment venues by type, location, or opening date.
              </p>
              <Link
                href="/businesses?category=entertainment"
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              >
                Search All Entertainment Venues
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
            "name": "New Entertainment Venues in Calgary",
            "description": "Discover the newest entertainment venues, theaters, and fun activities opening in Calgary.",
            "url": "https://www.nowopencalgary.ca/entertainment",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": entertainmentBusinesses.length,
              "itemListElement": entertainmentBusinesses.slice(0, 10).map((business, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "EntertainmentBusiness",
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