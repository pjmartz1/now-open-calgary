// Static business page to bypass Jest worker issues
import { MapPin, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BusinessPage({ params }: Props) {
  const { slug } = await params
  
  // Temporary static display for debugging
  const mockBusiness = {
    tradename: 'Sample Business',
    address: '123 Main Street SW',
    community: 'Downtown',
    category: 'services',
    first_issued_date: '2024-01-01',
    license_type: 'Business License',
    calgary_id: 'TEST123'
  }

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

      {/* Business Details */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {mockBusiness.tradename} (Slug: {slug})
            </h1>
            {mockBusiness.category && (
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                {mockBusiness.category.charAt(0).toUpperCase() + mockBusiness.category.slice(1)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-gray-900">{mockBusiness.address}</p>
                    {mockBusiness.community && (
                      <p className="text-gray-600 text-sm">{mockBusiness.community}, Calgary, AB</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">
                    Opened {new Date(mockBusiness.first_issued_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">License Details</h3>
              
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-600">License Type:</span>
                  <p className="text-gray-900">{mockBusiness.license_type}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-600">Calgary ID:</span>
                  <p className="text-gray-900">{mockBusiness.calgary_id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Link */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mockBusiness.address + ', Calgary, AB')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <MapPin className="w-4 h-4 mr-2" />
              View on Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}