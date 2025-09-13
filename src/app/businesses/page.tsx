import { Suspense } from 'react'
import { Search, MapPin, Tag } from 'lucide-react'
import CalgaryBusinessGrid from '@/components/CalgaryBusinessGrid'
import { BusinessGridSkeleton } from '@/components/BusinessCardSkeleton'
import { BusinessLoadingErrorBoundary, SearchErrorBoundary } from '@/components/ErrorBoundary'
import { BusinessService } from '@/services/businessService'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calgary Business Directory - All New Businesses | Now Open Calgary',
  description: 'Browse all new businesses opening in Calgary. Find restaurants, shops, services, and more with our comprehensive Calgary business directory.',
  alternates: {
    canonical: 'https://www.nowopencalgary.ca/businesses'
  }
}

interface Props {
  searchParams: Promise<{
    page?: string
    search?: string
    category?: string
    community?: string
  }>
}

async function BusinessListings({ 
  page = 1, 
  search, 
  category, 
  community 
}: { 
  page?: number
  search?: string
  category?: string
  community?: string
}) {
  const itemsPerPage = 20
  const offset = (page - 1) * itemsPerPage

  const { businesses, total } = await BusinessService.getAllCalgaryBusinesses({
    search: search || undefined,
    category: category || undefined,
    community: community || undefined,
    limit: itemsPerPage,
    offset
  })

  const totalPages = Math.ceil(total / itemsPerPage)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  return (
    <>
      <div className="mb-6">
        <div className="text-center text-indigo-200">
          <span className="font-semibold">{total}</span> businesses found
          {search || category || community ? (
            <div className="mt-2 text-sm">
              {search && <span className="bg-indigo-500/20 px-2 py-1 rounded mr-2">Search: {search}</span>}
              {category && <span className="bg-indigo-500/20 px-2 py-1 rounded mr-2">Category: {category}</span>}
              {community && <span className="bg-indigo-500/20 px-2 py-1 rounded mr-2">Community: {community}</span>}
            </div>
          ) : null}
        </div>
      </div>

      <CalgaryBusinessGrid 
        businesses={businesses} 
        searchContext={{
          search: search || undefined,
          category: category || undefined,
          community: community || undefined
        }}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          {hasPrevPage && (
            <a
              href={`/businesses?${new URLSearchParams({ 
                ...(search && { search }),
                ...(category && { category }),
                ...(community && { community }),
                page: (page - 1).toString()
              }).toString()}`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Previous
            </a>
          )}
          
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          
          {hasNextPage && (
            <a
              href={`/businesses?${new URLSearchParams({ 
                ...(search && { search }),
                ...(category && { category }),
                ...(community && { community }),
                page: (page + 1).toString()
              }).toString()}`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Next
            </a>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center mt-8 text-gray-500 text-sm">
        Showing {offset + 1} to {Math.min(offset + itemsPerPage, total)} of {total} businesses
      </div>
    </>
  )
}

export default async function BusinessesPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const { search, category, community } = params

  // Get filter options
  const [categories, communities] = await Promise.all([
    BusinessService.getCalgaryCategories(),
    BusinessService.getCalgaryCommunities()
  ])

  const activeFiltersCount = [search, category, community].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Calgary Business Directory
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Discover the newest businesses opening their doors in Calgary. Find restaurants, shops, services, and more.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters Form - MOVED TO TOP */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form method="GET" action="/businesses" className="space-y-4" role="search" aria-label="Search and filter businesses">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
              <input
                type="search"
                name="search"
                id="business-search"
                placeholder="Search businesses, locations, or categories..."
                defaultValue={search}
                className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg shadow-sm"
                aria-label="Search businesses by name, location, or category"
                aria-describedby="search-help"
              />
              <div id="search-help" className="sr-only">
                Enter keywords to search for businesses by name, address, community, or category
              </div>
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="inline w-4 h-4 mr-1" aria-hidden="true" />
                  Category
                </label>
                <select
                  id="category-filter"
                  name="category"
                  defaultValue={category}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  aria-label="Filter businesses by category"
                  aria-describedby="category-help"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                <div id="category-help" className="sr-only">
                  Filter results to show only businesses in a specific category
                </div>
              </div>

              {/* Community Filter */}
              <div>
                <label htmlFor="community-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" aria-hidden="true" />
                  Community
                </label>
                <select
                  id="community-filter"
                  name="community"
                  defaultValue={community}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  aria-label="Filter businesses by community"
                  aria-describedby="community-help"
                >
                  <option value="">All Communities</option>
                  {communities.map((comm) => (
                    <option key={comm} value={comm}>
                      {comm}
                    </option>
                  ))}
                </select>
                <div id="community-help" className="sr-only">
                  Filter results to show only businesses in a specific Calgary community
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
                aria-label="Apply search and filter criteria to business listings"
              >
                Apply Filters
              </button>

              {activeFiltersCount > 0 && (
                <a
                  href="/businesses"
                  className="text-sm text-gray-500 hover:text-gray-700 underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-sm"
                  aria-label={`Clear all ${activeFiltersCount} active filters and show all businesses`}
                >
                  Clear all filters ({activeFiltersCount} active)
                </a>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Business Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BusinessLoadingErrorBoundary>
          <Suspense fallback={
            <div className="py-8">
              <div className="text-center mb-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading businesses...</p>
              </div>
              <BusinessGridSkeleton count={20} />
            </div>
          }>
            <BusinessListings 
              page={page} 
              search={search} 
              category={category} 
              community={community} 
            />
          </Suspense>
        </BusinessLoadingErrorBoundary>
      </div>
    </div>
  )
}