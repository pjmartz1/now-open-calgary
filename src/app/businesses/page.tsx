import { Suspense } from 'react'
import { Search, MapPin, Tag } from 'lucide-react'
import CalgaryBusinessGrid from '@/components/CalgaryBusinessGrid'
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

      <CalgaryBusinessGrid businesses={businesses} />

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
            
            <Suspense fallback={
              <div className="mt-6 text-indigo-200">Loading businesses...</div>
            }>
              <BusinessListings 
                page={page} 
                search={search} 
                category={category} 
                community={community} 
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Search and Filters Form */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form method="GET" action="/businesses" className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="search"
                placeholder="Search businesses, locations, or categories..."
                defaultValue={search}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              />
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="inline w-4 h-4 mr-1" />
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={category}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Community Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Community
                </label>
                <select
                  name="community"
                  defaultValue={community}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Communities</option>
                  {communities.map((comm) => (
                    <option key={comm} value={comm}>
                      {comm}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Apply Filters
              </button>

              {activeFiltersCount > 0 && (
                <a
                  href="/businesses"
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all filters
                </a>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Business Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading businesses...</p>
          </div>
        }>
          <BusinessListings 
            page={page} 
            search={search} 
            category={category} 
            community={community} 
          />
        </Suspense>
      </div>
    </div>
  )
}