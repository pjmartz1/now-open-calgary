import { Metadata } from 'next'
import { Sparkles, MapPin, Calendar, Scissors, Flower, Star } from 'lucide-react'
import CalgaryBusinessGrid from '@/components/CalgaryBusinessGrid'
import { BusinessService } from '@/services/businessService'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'New Beauty Businesses Calgary 2025 | Salons & Spas | Now Open Calgary',
  description: 'Discover new beauty businesses in Calgary 2025! Hair salons, nail studios, spas, barbershops, beauty services opening in YYC. Updated daily.',
  keywords: ['new beauty calgary', 'hair salons calgary', 'nail studios calgary', 'spas calgary', 'barbershops calgary', 'beauty services calgary', 'makeup artists calgary', 'YYC beauty'],
  openGraph: {
    title: 'New Beauty Businesses Calgary 2025 | Salons & Spas',
    description: 'Discover new beauty businesses in Calgary 2025! Hair salons, nail studios, spas, beauty services opening in YYC.',
    type: 'website',
    url: 'https://www.nowopencalgary.ca/beauty',
    siteName: 'Now Open Calgary'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Beauty Businesses Calgary 2025 | Salons & Spas',
    description: 'Discover new beauty businesses in Calgary! Hair salons, nail studios, spas, and beauty services opening in YYC.'
  },
  alternates: {
    canonical: 'https://www.nowopencalgary.ca/beauty'
  }
}

export default async function BeautyPage() {
  const beautyBusinesses = await BusinessService.getCalgaryBusinessesByCategory('beauty', 50)

  // Get some stats
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const recentCount = beautyBusinesses.filter(r => new Date(r.first_issued_date) >= oneWeekAgo).length
  const communities = [...new Set(beautyBusinesses.map(r => r.community).filter(Boolean))].length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-pink-600 via-rose-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full">
                <Sparkles className="w-12 h-12" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              New Beauty Businesses in Calgary
            </h1>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto mb-8">
              Discover the newest beauty salons, spas, nail studios, barbershops, and wellness centers opening their doors in Calgary. Pamper yourself with YYC&apos;s latest beauty and wellness services.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-pink-100">
              <div className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                <span className="font-semibold">{beautyBusinesses.length}</span>
                <span className="ml-1">beauty businesses</span>
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

      {/* Beauty Categories */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Beauty Services</h2>
            <p className="text-gray-600">Find the perfect beauty service for your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
              <Scissors className="w-8 h-8 text-pink-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Hair & Styling</h3>
                <p className="text-sm text-gray-600">Salons, barbershops, color specialists</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <Flower className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Spa & Wellness</h3>
                <p className="text-sm text-gray-600">Massage, facials, wellness treatments</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg">
              <Star className="w-8 h-8 text-rose-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Nails & Beauty</h3>
                <p className="text-sm text-gray-600">Nail studios, makeup, lash extensions</p>
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
              href="/businesses?category=beauty"
              className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors"
            >
              All Beauty
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

      {/* Beauty Business Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {beautyBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No beauty businesses found</h3>
            <p className="text-gray-600 mb-6">
              We haven&apos;t found any beauty businesses in our database yet. Check back soon!
            </p>
            <Link
              href="/businesses"
              className="inline-flex items-center px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse All Businesses
            </Link>
          </div>
        ) : (
          <>
            <CalgaryBusinessGrid 
              businesses={beautyBusinesses}
              title="New Beauty Services"
              subtitle="The latest beauty salons, spas, and wellness centers opening in Calgary"
            />

            {/* Call to Action */}
            <div className="text-center mt-16 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to look and feel amazing?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Use our advanced search to find beauty services by type, location, or specialty treatments.
              </p>
              <Link
                href="/businesses?category=beauty"
                className="inline-flex items-center px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors"
              >
                Search All Beauty Services
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
            "name": "New Beauty Businesses in Calgary",
            "description": "Discover the newest beauty salons, spas, and wellness centers opening in Calgary.",
            "url": "https://www.nowopencalgary.ca/beauty",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": beautyBusinesses.length,
              "itemListElement": beautyBusinesses.slice(0, 10).map((business, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "BeautySalon",
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