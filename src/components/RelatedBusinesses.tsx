import Link from 'next/link'
import { ArrowRight, MapPin, Calendar, Sparkles } from 'lucide-react'
import { BusinessService, BusinessCardData } from '@/services/businessService'
import { cn } from '@/lib/utils'

interface RelatedBusinessesProps {
  currentBusinessId: string
  category?: string
  community?: string
  className?: string
}

function getCategoryColor(category: string | null): string {
  const categoryColors: Record<string, string> = {
    restaurants: 'bg-red-100 text-red-700',
    retail: 'bg-blue-100 text-blue-700',
    services: 'bg-green-100 text-green-700',
    healthcare: 'bg-purple-100 text-purple-700',
    entertainment: 'bg-yellow-100 text-yellow-700',
    beauty: 'bg-pink-100 text-pink-700',
    fitness: 'bg-orange-100 text-orange-700',
    automotive: 'bg-slate-100 text-slate-700',
  }

  return categoryColors[category || 'other'] || 'bg-gray-100 text-gray-700'
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Server-side data fetching function
async function getRelatedBusinessesData(
  currentBusinessId: string,
  category?: string,
  community?: string
): Promise<BusinessCardData[]> {
  try {
    let businesses: BusinessCardData[] = []

    // First try to get businesses from the same category
    if (category) {
      businesses = await BusinessService.getCalgaryBusinessesByCategory(category, 8)
    }

    // If not enough businesses from category, get more from the same community
    if (businesses.length < 6 && community) {
      const communityBusinesses = await BusinessService.getAllCalgaryBusinesses({
        community,
        limit: 8
      })
      // Merge and deduplicate
      const existingIds = new Set(businesses.map(b => b.id))
      const additionalBusinesses = communityBusinesses.businesses.filter(
        b => !existingIds.has(b.id)
      )
      businesses = [...businesses, ...additionalBusinesses]
    }

    // If still not enough, get general recent businesses
    if (businesses.length < 6) {
      const recentBusinesses = await BusinessService.getCalgaryFeaturedBusinesses(8)
      const existingIds = new Set(businesses.map(b => b.id))
      const additionalBusinesses = recentBusinesses.filter(
        b => !existingIds.has(b.id)
      )
      businesses = [...businesses, ...additionalBusinesses]
    }

    // Remove the current business and limit to 6 results
    return businesses
      .filter(b => b.id !== currentBusinessId)
      .slice(0, 6)
  } catch (error) {
    console.error('Error loading related businesses:', error)
    return []
  }
}

export default async function RelatedBusinesses({
  currentBusinessId,
  category,
  community,
  className
}: RelatedBusinessesProps) {
  // Fetch data server-side
  const relatedBusinesses = await getRelatedBusinessesData(currentBusinessId, category, community)

  if (relatedBusinesses.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          {category ? `More ${category} businesses` : 'Related Businesses'}
        </h3>
        <Link
          href={category ? `/${category}` : '/businesses'}
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedBusinesses.map((business) => (
          <Link
            key={business.id}
            href={`/business/${business.slug}`}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
                    {business.tradename}
                  </h4>
                  {business.category && (
                    <span className={cn(
                      "inline-block px-2 py-1 rounded-full text-xs font-medium mt-1",
                      getCategoryColor(business.category)
                    )}>
                      {business.category.charAt(0).toUpperCase() + business.category.slice(1)}
                    </span>
                  )}
                </div>
                
                {(() => {
                  const oneWeekAgo = new Date()
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
                  const isNew = new Date(business.first_issued_date) >= oneWeekAgo
                  return isNew ? (
                    <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ml-2">
                      <Sparkles className="w-3 h-3" />
                      New!
                    </div>
                  ) : null
                })()}
              </div>

              {/* Location */}
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0 text-gray-400" />
                <span className="truncate">
                  {business.community || business.address}
                </span>
              </div>

              {/* Opening date */}
              <div className="flex items-center text-gray-500 text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                <span>Opened {formatDate(business.first_issued_date)}</span>
              </div>
            </div>

            {/* Hover effect bar */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </Link>
        ))}
      </div>

      {/* View all link */}
      <div className="text-center">
        <Link
          href={category ? `/${category}` : '/businesses'}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          Explore more {category || 'businesses'}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}