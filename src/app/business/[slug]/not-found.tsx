import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Search, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Business Not Found - Now Open Calgary',
  description: 'The requested business could not be found. Discover other new businesses opening in Calgary.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
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

      {/* 404 Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertCircle className="w-16 h-16 text-red-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Business Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The business you're looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/businesses"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse All Businesses
            </Link>
            <Link
              href="/"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back to Homepage
            </Link>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-left max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Explore New Businesses in Calgary
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/restaurants"
                className="text-center p-4 rounded-lg bg-red-50 hover:bg-red-100 transition-colors group"
              >
                <div className="text-red-600 group-hover:text-red-700">
                  <h3 className="font-semibold mb-2">New Restaurants</h3>
                  <p className="text-sm text-red-600">Discover fresh dining spots</p>
                </div>
              </Link>

              <Link
                href="/retail"
                className="text-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group"
              >
                <div className="text-blue-600 group-hover:text-blue-700">
                  <h3 className="font-semibold mb-2">New Shops</h3>
                  <p className="text-sm text-blue-600">Find unique retail stores</p>
                </div>
              </Link>

              <Link
                href="/services"
                className="text-center p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors group"
              >
                <div className="text-green-600 group-hover:text-green-700">
                  <h3 className="font-semibold mb-2">New Services</h3>
                  <p className="text-sm text-green-600">Professional services</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Schema.org structured data for 404 page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Business Not Found - Now Open Calgary",
            "description": "The requested business could not be found. Discover other new businesses opening in Calgary.",
            "url": "https://nowopencalgary.ca/business/not-found",
            "mainEntity": {
              "@type": "WebSite",
              "name": "Now Open Calgary",
              "url": "https://nowopencalgary.ca",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://nowopencalgary.ca/businesses?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          })
        }}
      />
    </div>
  )
}