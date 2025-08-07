import { MapPin, Calendar, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { BusinessCardData } from '@/services/businessService'
import { cn } from '@/lib/utils'

interface CalgaryBusinessGridProps {
  businesses: BusinessCardData[]
  title?: string
  subtitle?: string
  className?: string
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function getCategoryColor(category: string | null): string {
  const categoryColors: Record<string, string> = {
    restaurants: 'bg-red-100 text-red-700',
    retail: 'bg-blue-100 text-blue-700',
    services: 'bg-green-100 text-green-700',
    healthcare: 'bg-purple-100 text-purple-700',
    entertainment: 'bg-yellow-100 text-yellow-700',
  }
  
  return categoryColors[category || 'other'] || 'bg-gray-100 text-gray-700'
}

export default function CalgaryBusinessGrid({ 
  businesses, 
  title, 
  subtitle, 
  className 
}: CalgaryBusinessGridProps) {
  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
        <p className="text-gray-600">Check back soon for new business openings in Calgary!</p>
      </div>
    )
  }

  return (
    <section className={className}>
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <Link
            key={business.id}
            href={`/business/${business.slug}`}
            className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200"
          >
            {/* Header with badges */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
                    {business.tradename}
                  </h3>
                  {business.category && (
                    <span className={cn(
                      "inline-block px-2 py-1 rounded-full text-xs font-medium mt-2",
                      getCategoryColor(business.category)
                    )}>
                      {business.category.charAt(0).toUpperCase() + business.category.slice(1)}
                    </span>
                  )}
                </div>
                
                {business.isNew && (
                  <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ml-2">
                    <Sparkles className="w-3 h-3" />
                    New!
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center text-gray-600 text-sm mb-3">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                <span className="truncate">
                  {business.address}
                  {business.community && (
                    <span className="text-gray-500">, {business.community}</span>
                  )}
                </span>
              </div>

              {/* License info */}
              <div className="text-sm text-gray-500 mb-4 line-clamp-2">
                {business.license_type}
              </div>

              {/* Bottom info */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center text-gray-500 text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>Opened {formatDate(business.first_issued_date)}</span>
                </div>
                
                {business.view_count > 0 && (
                  <div className="flex items-center text-gray-400 text-xs">
                    <span>{business.view_count} views</span>
                  </div>
                )}
              </div>
            </div>

            {/* Hover effect bar */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </Link>
        ))}
      </div>
    </section>
  )
}