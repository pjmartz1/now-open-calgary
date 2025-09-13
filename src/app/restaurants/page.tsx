import { Metadata } from 'next'
import { Utensils, MapPin, Calendar } from 'lucide-react'
import CalgaryBusinessGrid from '@/components/CalgaryBusinessGrid'
import Breadcrumbs from '@/components/Breadcrumbs'
import { BusinessService } from '@/services/businessService'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'New Restaurants Calgary 2025 | Latest Calgary Dining | Now Open Calgary',
  description: 'Discover 150+ new restaurants in Calgary 2025! Fresh cafes, trendy dining spots & hot new eateries opening in YYC. Updated daily with newest Calgary restaurants.',
  keywords: ['new restaurants calgary', 'newest restaurants calgary 2025', 'calgary dining', 'new cafes calgary', 'latest restaurants calgary', 'calgary restaurant openings', 'YYC new restaurants', 'fresh dining calgary'],
  openGraph: {
    title: 'New Restaurants Calgary 2025 | Latest Calgary Dining | Now Open Calgary',
    description: 'Discover 150+ new restaurants in Calgary 2025! Fresh cafes, trendy dining spots & hot new eateries opening in YYC.',
    type: 'website',
    url: 'https://www.nowopencalgary.ca/restaurants',
    siteName: 'Now Open Calgary'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Restaurants Calgary 2025 | Latest Calgary Dining',
    description: 'Discover 150+ new restaurants in Calgary! Fresh cafes, trendy dining spots & hot new eateries opening in YYC.'
  },
  alternates: {
    canonical: 'https://www.nowopencalgary.ca/restaurants'
  }
}

export default async function RestaurantsPage() {
  const restaurants = await BusinessService.getCalgaryBusinessesByCategory('restaurants', 50)

  // Get some stats
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const recentCount = restaurants.filter(r => new Date(r.first_issued_date) >= oneWeekAgo).length
  const communities = [...new Set(restaurants.map(r => r.community).filter(Boolean))].length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs items={[
            { label: 'Categories', href: '/businesses' },
            { label: 'Restaurants', current: true }
          ]} />
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 via-pink-600 to-rose-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full">
                <Utensils className="w-12 h-12" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              New Restaurants in Calgary
            </h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto mb-8">
              Discover the newest restaurants, cafes, and dining establishments opening their doors in Calgary. From fine dining to casual eats, explore what&apos;s fresh in YYC&apos;s culinary scene.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-red-100">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                <Utensils className="w-5 h-5 mr-2" />
                <span className="font-semibold">{restaurants.length}</span>
                <span className="ml-1">restaurants found</span>
              </div>
              {recentCount > 0 && (
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{recentCount}</span>
                  <span className="ml-1">opened this week</span>
                </div>
              )}
              {communities > 0 && (
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{communities}</span>
                  <span className="ml-1">communities</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inline Search Section */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Restaurant</h2>
            <p className="text-gray-600">Search through Calgary's newest dining establishments</p>
          </div>
          
          <form method="GET" action="/businesses" className="max-w-4xl mx-auto">
            <input type="hidden" name="category" value="restaurants" />
            <div className="relative">
              <Utensils className="absolute left-6 top-1/2 transform -translate-y-1/2 text-red-500 w-6 h-6" />
              <input
                type="search"
                name="search"
                placeholder="Search restaurants by name, cuisine, or location..."
                className="w-full pl-16 pr-32 py-4 text-lg border-2 border-red-200 rounded-2xl focus:ring-4 focus:ring-red-300 focus:border-red-500 shadow-lg bg-white/90 backdrop-blur-sm transition-all duration-300"
                aria-label="Search restaurants in Calgary"
              />
              <button 
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Search
              </button>
            </div>
            
            {/* Quick search suggestions */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <span className="text-sm text-gray-600 font-medium">Popular searches:</span>
              {['pizza', 'sushi', 'indian', 'italian', 'coffee', 'breakfast', 'steakhouse', 'patio'].map((term) => (
                <button
                  key={term}
                  type="submit"
                  name="search"
                  value={term}
                  className="px-4 py-2 bg-white/60 hover:bg-white/80 text-gray-700 text-sm rounded-full border border-red-200 hover:border-red-300 transition-colors shadow-sm hover:shadow-md"
                >
                  {term}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/businesses?category=restaurants"
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              All Restaurants
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
              href="/healthcare"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Healthcare
            </Link>
            <Link
              href="/beauty"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Beauty
            </Link>
            <Link
              href="/fitness"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Fitness
            </Link>
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {restaurants.length === 0 ? (
          <div className="text-center py-12">
            <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-600 mb-6">
              We haven&apos;t found any restaurants in our database yet. Check back soon!
            </p>
            <Link
              href="/businesses"
              className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse All Businesses
            </Link>
          </div>
        ) : (
          <>
            <CalgaryBusinessGrid 
              businesses={restaurants}
              title="Featured Restaurants"
              subtitle="The latest restaurants and dining experiences opening in Calgary"
            />

            {/* Call to Action */}
            <div className="text-center mt-16 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Looking for something specific?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Use our advanced search to find restaurants by location, cuisine type, or opening date.
              </p>
              <Link
                href="/businesses?category=restaurants"
                className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Search All Restaurants
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
            "name": "New Restaurants in Calgary",
            "description": "Discover the newest restaurants, cafes, and dining establishments opening in Calgary.",
            "url": "https://www.nowopencalgary.ca/restaurants",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": restaurants.length,
              "itemListElement": restaurants.slice(0, 10).map((restaurant, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Restaurant",
                  "name": restaurant.tradename,
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": restaurant.address,
                    "addressLocality": "Calgary",
                    "addressRegion": "AB",
                    "addressCountry": "CA"
                  },
                  "url": `https://www.nowopencalgary.ca/business/${restaurant.slug}`
                }
              }))
            }
          })
        }}
      />
    </div>
  )
}