import { Metadata } from 'next'
import { Dumbbell, MapPin, Calendar, Activity, Target, Zap } from 'lucide-react'
import CalgaryBusinessGrid from '@/components/CalgaryBusinessGrid'
import { BusinessService } from '@/services/businessService'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'New Fitness Businesses Calgary 2025 | Gyms & Studios | Now Open Calgary',
  description: 'Discover new fitness businesses in Calgary 2025! Gyms, yoga studios, personal trainers, martial arts, fitness centers opening in YYC. Updated daily.',
  keywords: ['new fitness calgary', 'gyms calgary', 'yoga studios calgary', 'personal trainers calgary', 'martial arts calgary', 'fitness centers calgary', 'pilates calgary', 'YYC fitness'],
  openGraph: {
    title: 'New Fitness Businesses Calgary 2025 | Gyms & Studios',
    description: 'Discover new fitness businesses in Calgary 2025! Gyms, yoga studios, personal trainers, fitness centers opening in YYC.',
    type: 'website',
    url: 'https://www.nowopencalgary.ca/fitness',
    siteName: 'Now Open Calgary'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Fitness Businesses Calgary 2025 | Gyms & Studios',
    description: 'Discover new fitness businesses in Calgary! Gyms, yoga studios, personal trainers, and fitness centers opening in YYC.'
  },
  alternates: {
    canonical: 'https://www.nowopencalgary.ca/fitness'
  }
}

export default async function FitnessPage() {
  const fitnessBusinesses = await BusinessService.getCalgaryBusinessesByCategory('fitness', 50)

  // Get some stats
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const recentCount = fitnessBusinesses.filter(r => new Date(r.first_issued_date) >= oneWeekAgo).length
  const communities = [...new Set(fitnessBusinesses.map(r => r.community).filter(Boolean))].length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full">
                <Dumbbell className="w-12 h-12" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              New Fitness Businesses in Calgary
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-8">
              Discover the newest gyms, fitness studios, yoga centers, personal trainers, and wellness facilities opening their doors in Calgary. Start your fitness journey with YYC&apos;s latest fitness offerings.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-orange-100">
              <div className="flex items-center">
                <Dumbbell className="w-5 h-5 mr-2" />
                <span className="font-semibold">{fitnessBusinesses.length}</span>
                <span className="ml-1">fitness businesses</span>
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

      {/* Fitness Categories */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Fitness Categories</h2>
            <p className="text-gray-600">Find the perfect fitness solution for your goals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
              <Activity className="w-8 h-8 text-orange-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Gyms & Training</h3>
                <p className="text-sm text-gray-600">Full gyms, CrossFit, strength training</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
              <Target className="w-8 h-8 text-red-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Studios & Classes</h3>
                <p className="text-sm text-gray-600">Yoga, pilates, dance, martial arts</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
              <Zap className="w-8 h-8 text-pink-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Personal Training</h3>
                <p className="text-sm text-gray-600">1-on-1 coaching, specialized programs</p>
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
              href="/businesses?category=fitness"
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
            >
              All Fitness
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

      {/* Fitness Business Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {fitnessBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No fitness businesses found</h3>
            <p className="text-gray-600 mb-6">
              We haven&apos;t found any fitness businesses in our database yet. Check back soon!
            </p>
            <Link
              href="/businesses"
              className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse All Businesses
            </Link>
          </div>
        ) : (
          <>
            <CalgaryBusinessGrid 
              businesses={fitnessBusinesses}
              title="New Fitness Centers"
              subtitle="The latest gyms, studios, and fitness facilities opening in Calgary"
            />

            {/* Call to Action */}
            <div className="text-center mt-16 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to reach your fitness goals?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Use our advanced search to find fitness centers by type, location, or specialty programs.
              </p>
              <Link
                href="/businesses?category=fitness"
                className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
              >
                Search All Fitness Centers
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
            "name": "New Fitness Businesses in Calgary",
            "description": "Discover the newest gyms, fitness studios, and wellness facilities opening in Calgary.",
            "url": "https://www.nowopencalgary.ca/fitness",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": fitnessBusinesses.length,
              "itemListElement": fitnessBusinesses.slice(0, 10).map((business, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "SportsActivityLocation",
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