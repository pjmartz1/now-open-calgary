'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, X, MapPin, Calendar, ArrowUpDown } from 'lucide-react'
import { BusinessService, BusinessCardData } from '@/services/businessService'
import CalgaryBusinessGrid from './CalgaryBusinessGrid'
import { cn } from '@/lib/utils'

interface AdvancedSearchProps {
  initialCategory?: string
  className?: string
}

interface SearchFilters {
  query: string
  category: string
  community: string
  sortBy: 'newest' | 'oldest' | 'name'
  dateRange: 'all' | 'week' | 'month' | 'quarter'
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'restaurants', label: 'Restaurants' },
  { value: 'retail', label: 'Retail' },
  { value: 'services', label: 'Services' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'automotive', label: 'Automotive' },
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name', label: 'Alphabetical' },
]

const dateRanges = [
  { value: 'all', label: 'All Time' },
  { value: 'week', label: 'Past Week' },
  { value: 'month', label: 'Past Month' },
  { value: 'quarter', label: 'Past 3 Months' },
]

export default function AdvancedSearch({ initialCategory = '', className }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: initialCategory,
    community: '',
    sortBy: 'newest',
    dateRange: 'all'
  })
  
  const [results, setResults] = useState<BusinessCardData[]>([])
  const [communities, setCommunities] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)

  // Load communities on mount
  useEffect(() => {
    BusinessService.getCalgaryCommunities().then(setCommunities)
  }, [])

  const performSearch = useCallback(async () => {
    setIsLoading(true)
    try {
      const searchParams: {
        limit: number;
        offset: number;
        search?: string;
        category?: string;
        community?: string;
      } = {
        limit: 50,
        offset: 0
      }

      if (filters.query.trim()) {
        searchParams.search = filters.query.trim()
      }
      if (filters.category) {
        searchParams.category = filters.category
      }
      if (filters.community) {
        searchParams.community = filters.community
      }

      const { businesses } = await BusinessService.getAllCalgaryBusinesses(searchParams)
      
      // Apply date filtering
      let filteredBusinesses = businesses
      if (filters.dateRange !== 'all') {
        const now = new Date()
        const cutoffDate = new Date()
        
        switch (filters.dateRange) {
          case 'week':
            cutoffDate.setDate(now.getDate() - 7)
            break
          case 'month':
            cutoffDate.setMonth(now.getMonth() - 1)
            break
          case 'quarter':
            cutoffDate.setMonth(now.getMonth() - 3)
            break
        }
        
        filteredBusinesses = businesses.filter(b => 
          new Date(b.first_issued_date) >= cutoffDate
        )
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'oldest':
          filteredBusinesses.sort((a, b) => 
            new Date(a.first_issued_date).getTime() - new Date(b.first_issued_date).getTime()
          )
          break
        case 'name':
          filteredBusinesses.sort((a, b) => a.tradename.localeCompare(b.tradename))
          break
        case 'newest':
        default:
          filteredBusinesses.sort((a, b) => 
            new Date(b.first_issued_date).getTime() - new Date(a.first_issued_date).getTime()
          )
          break
      }

      setResults(filteredBusinesses)
      setTotalResults(filteredBusinesses.length)
      setHasSearched(true)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
      setTotalResults(0)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  // Perform search when filters change
  useEffect(() => {
    performSearch()
  }, [performSearch])

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      category: initialCategory,
      community: '',
      sortBy: 'newest',
      dateRange: 'all'
    })
  }

  const activeFiltersCount = [
    filters.query,
    filters.category && filters.category !== initialCategory,
    filters.community,
    filters.dateRange !== 'all'
  ].filter(Boolean).length

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Main Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search businesses, addresses, or keywords..."
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
              className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
            />
            {filters.query && (
              <button
                onClick={() => updateFilter('query', '')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter Toggle and Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                isFiltersOpen 
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              )}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Quick Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {isFiltersOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Community
                </label>
                <select
                  value={filters.community}
                  onChange={(e) => updateFilter('community', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Communities</option>
                  {communities.map(community => (
                    <option key={community} value={community}>{community}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Opening Date
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => updateFilter('dateRange', e.target.value as SearchFilters['dateRange'])}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {dateRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ArrowUpDown className="w-4 h-4 inline mr-1" />
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value as SearchFilters['sortBy'])}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {hasSearched && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                  Searching...
                </span>
              ) : (
                <>
                  Found <span className="font-semibold text-gray-900">{totalResults}</span> businesses
                  {filters.query && (
                    <> matching &quot;<span className="font-medium">{filters.query}</span>&quot;</>
                  )}
                  {filters.category && (
                    <> in <span className="font-medium">{categories.find(c => c.value === filters.category)?.label}</span></>
                  )}
                  {filters.community && (
                    <> in <span className="font-medium">{filters.community}</span></>
                  )}
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Searching businesses...</p>
            </div>
          ) : results.length > 0 ? (
            <CalgaryBusinessGrid 
              businesses={results}
              title="Search Results"
              subtitle={`${totalResults} businesses found`}
            />
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find more results.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
              >
                Clear Filters & Browse All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}