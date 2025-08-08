'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Tag, ChevronDown } from 'lucide-react'
import CalgaryBusinessGrid from '@/components/CalgaryBusinessGrid'
import { BusinessService, BusinessCardData } from '@/services/businessService'
import { cn } from '@/lib/utils'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse All Businesses',
  description: 'Explore all new businesses in Calgary. Search and filter by category, location, and more.',
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<BusinessCardData[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCommunity, setSelectedCommunity] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [communities, setCommunities] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const itemsPerPage = 20

  // Load filter options
  useEffect(() => {
    async function loadFilters() {
      const [categoriesData, communitiesData] = await Promise.all([
        BusinessService.getCalgaryCategories(),
        BusinessService.getCalgaryCommunities()
      ])
      setCategories(categoriesData)
      setCommunities(communitiesData)
    }
    loadFilters()
  }, [])

  // Load businesses based on filters
  useEffect(() => {
    async function loadBusinesses() {
      setLoading(true)
      try {
        const offset = (currentPage - 1) * itemsPerPage
        const { businesses: data, total: totalCount } = await BusinessService.getAllCalgaryBusinesses({
          search: searchQuery || undefined,
          category: selectedCategory || undefined,
          community: selectedCommunity || undefined,
          limit: itemsPerPage,
          offset
        })

        if (currentPage === 1) {
          setBusinesses(data)
        } else {
          setBusinesses(prev => [...prev, ...data])
        }

        setTotal(totalCount)
        setHasMore(data.length === itemsPerPage && offset + itemsPerPage < totalCount)
      } catch (error) {
        console.error('Error loading businesses:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBusinesses()
  }, [searchQuery, selectedCategory, selectedCommunity, currentPage])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, selectedCommunity])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is handled by the useEffect above
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedCommunity('')
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const activeFiltersCount = [searchQuery, selectedCategory, selectedCommunity].filter(Boolean).length

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
            <div className="mt-6 text-indigo-200">
              <span className="font-semibold">{total}</span> businesses found
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search businesses, locations, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              />
            </div>
          </form>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                showFilters 
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              )}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="inline w-4 h-4 mr-1" />
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
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
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Communities</option>
                  {communities.map((community) => (
                    <option key={community} value={community}>
                      {community}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Business Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && businesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading businesses...</p>
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters to find more businesses.
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-indigo-600 hover:text-indigo-500 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <CalgaryBusinessGrid businesses={businesses} />

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  {loading ? 'Loading...' : 'Load More Businesses'}
                </button>
              </div>
            )}

            {/* Results Summary */}
            <div className="text-center mt-8 text-gray-500 text-sm">
              Showing {businesses.length} of {total} businesses
            </div>
          </>
        )}
      </div>
    </div>
  )
}