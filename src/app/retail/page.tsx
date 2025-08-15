import { Metadata } from 'next'
import { ShoppingBag, MapPin, Calendar } from 'lucide-react'
import CalgaryBusinessGrid from '@/components/CalgaryBusinessGrid'
import { BusinessService } from '@/services/businessService'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'New Shops Calgary 2024 | Latest Retail Stores & Boutiques | Now Open Calgary',
  description: 'Discover 100+ new shops in Calgary! Fresh boutiques, trendy stores & hot new retail openings in YYC. Updated daily with the newest Calgary shopping destinations.',
  keywords: ['new shops calgary', 'newest stores calgary 2024', 'calgary retail', 'new boutiques calgary', 'latest shops calgary', 'calgary store openings', 'YYC new retail', 'fresh shopping calgary'],
  openGraph: {
    title: 'New Shops Calgary 2024 | Latest Retail Stores & Boutiques',
    description: 'Discover 100+ new shops in Calgary! Fresh boutiques, trendy stores & hot new retail openings in YYC.',
    type: 'website',
    url: 'https://www.nowopencalgary.ca/retail',
    siteName: 'Now Open Calgary'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Shops Calgary 2024 | Latest Retail Stores & Boutiques',
    description: 'Discover 100+ new shops in Calgary! Fresh boutiques, trendy stores & hot new retail openings in YYC.'
  },
  alternates: {
    canonical: 'https://www.nowopencalgary.ca/retail'
  }
}

export default async function RetailPage() {
  const retailers = await BusinessService.getCalgaryBusinessesByCategory('retail', 50)

  // Get some stats
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const recentCount = retailers.filter(r => new Date(r.first_issued_date) >= oneWeekAgo).length
  const communities = [...new Set(retailers.map(r => r.community).filter(Boolean))].length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full">
                <ShoppingBag className="w-12 h-12" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              New Shops in Calgary
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Discover the newest retail stores, boutiques, and shopping destinations opening their doors in Calgary. From fashion to electronics, explore what&apos;s new in YYC&apos;s retail scene.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-blue-100">
              <div className="flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                <span className="font-semibold">{retailers.length}</span>
                <span className="ml-1">shops found</span>
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
              href="/businesses?category=retail"
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              All Retail
            </Link>
            <Link
              href="/restaurants"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              New Restaurants
            </Link>
            <Link
              href="/services"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              New Services
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

      {/* Retail Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {retailers.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No retail stores found</h3>
            <p className="text-gray-600 mb-6">
              We haven&apos;t found any retail stores in our database yet. Check back soon!
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
              businesses={retailers}
              title="Featured Retail Stores"
              subtitle="The latest shops and retail destinations opening in Calgary"
            />

            {/* Call to Action */}
            <div className="text-center mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Looking for something specific?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Use our advanced search to find retail stores by location, type, or opening date.
              </p>
              <Link
                href="/businesses?category=retail"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Search All Retail Stores
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
            "name": "New Shops & Retail in Calgary",
            "description": "Discover the newest retail stores, boutiques, and shopping destinations opening in Calgary.",
            "url": "https://www.nowopencalgary.ca/retail",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": retailers.length,
              "itemListElement": retailers.slice(0, 10).map((retailer, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Store",
                  "name": retailer.tradename,
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": retailer.address,
                    "addressLocality": "Calgary",
                    "addressRegion": "AB",
                    "addressCountry": "CA"
                  },
                  "url": `https://www.nowopencalgary.ca/business/${retailer.slug}`
                }
              }))
            }
          })
        }}
      />
    </div>
  )
}