
import { supabase } from '@/lib/supabase'
import { CalgaryBusiness } from '@/types/business'

// Simple in-memory cache with TTL
interface CacheEntry<T> {
  data: T
  expiry: number
}

class QueryCache {
  private cache = new Map<string, CacheEntry<unknown>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.defaultTTL) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry || Date.now() > entry.expiry) {
      this.cache.delete(key)
      return null
    }
    return entry.data as T
  }

  clear() {
    this.cache.clear()
  }
}

const cache = new QueryCache()

// Utility function to sanitize search queries
function sanitizeSearchQuery(query: string | undefined | null): string {
  // Handle undefined, null, or non-string values
  if (!query || typeof query !== 'string') {
    return ''
  }
  
  // Remove any SQL injection attempts and special characters
  return query
    .replace(/[%_'"\\]/g, '') // Remove SQL wildcards and quotes
    .replace(/[<>]/g, '') // Remove potential HTML/script tags
    .trim()
    .slice(0, 100) // Limit length to prevent abuse
}

// Interface for Calgary business data used in cards
export interface BusinessCardData {
  id: string
  tradename: string
  address: string
  community: string | null
  license_type: string
  first_issued_date: string
  slug: string
  category: string | null
  is_consumer_facing: boolean
  latitude: number | null
  longitude: number | null
  view_count: number
  active: boolean
  created_at: string
  updated_at: string
}

export class BusinessService {
  // Get Calgary businesses for homepage (cached)
  static async getCalgaryFeaturedBusinesses(limit: number = 12): Promise<BusinessCardData[]> {
    try {
      const cacheKey = `featured_businesses_${limit}`
      const cached = cache.get<BusinessCardData[]>(cacheKey)
      if (cached) return cached

      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabase) {
        return []
      }

      const { data, error } = await supabase
        .from('calgary_businesses')
        .select('*')
        .eq('active', true)
        .eq('is_consumer_facing', true)
        .order('first_issued_date', { ascending: false })
        .limit(limit)

      if (error) throw error

      const result = data || []
      // Cache for 10 minutes (featured businesses can be cached longer)
      cache.set(cacheKey, result, 10 * 60 * 1000)
      return result
    } catch (error) {
      console.error('Error fetching Calgary featured businesses:', error)
      return []
    }
  }

  // Get Calgary businesses from the last 7 days (cached)
  static async getCalgaryNewThisWeekBusinesses(limit: number = 6): Promise<BusinessCardData[]> {
    try {
      const cacheKey = `new_this_week_${limit}`
      const cached = cache.get<BusinessCardData[]>(cacheKey)
      if (cached) return cached

      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabase) {
        return []
      }

      // Calculate date 7 days ago
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const dateFilter = sevenDaysAgo.toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('calgary_businesses')
        .select('*')
        .eq('active', true)
        .eq('is_consumer_facing', true)
        .gte('first_issued_date', dateFilter)
        .order('first_issued_date', { ascending: false })
        .limit(limit)

      if (error) throw error

      const result = data || []
      // Cache for 5 minutes (new businesses need frequent updates)
      cache.set(cacheKey, result, 5 * 60 * 1000)
      return result
    } catch (error) {
      console.error('Error fetching new this week businesses:', error)
      return []
    }
  }

  // Get Calgary businesses by category
  static async getCalgaryBusinessesByCategory(
    category: string,
    limit: number = 20
  ): Promise<BusinessCardData[]> {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabase) {
        return []
      }

      const { data, error } = await supabase
        .from('calgary_businesses')
        .select('*')
        .eq('active', true)
        .eq('is_consumer_facing', true)
        .eq('category', category)
        .order('first_issued_date', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Error fetching Calgary businesses by category:', error)
      return []
    }
  }

  // Get Calgary business by slug
  static async getCalgaryBusinessBySlug(slug: string): Promise<CalgaryBusiness | null> {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabase) {
        return null
      }

      const { data, error } = await supabase
        .from('calgary_businesses')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error fetching Calgary business by slug:', error)
      return null
    }
  }

  // Get Calgary categories (optimized with caching)
  static async getCalgaryCategories(): Promise<string[]> {
    try {
      const cacheKey = 'calgary_categories'
      const cached = cache.get<string[]>(cacheKey)
      if (cached) return cached

      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabase) {
        return []
      }

      // Use distinct query to reduce data transfer
      const { data, error } = await supabase
        .rpc('get_distinct_categories')
        .single()

      if (error) {
        // Fallback to original query if RPC doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('calgary_businesses')
          .select('category')
          .eq('active', true)
          .eq('is_consumer_facing', true)
          .not('category', 'is', null)

        if (fallbackError) throw fallbackError

        const categories = [...new Set(fallbackData?.map(item => item.category).filter(Boolean))]
        const sortedCategories = categories.sort()
        
        // Cache for 15 minutes (categories don't change often)
        cache.set(cacheKey, sortedCategories, 15 * 60 * 1000)
        return sortedCategories
      }

      const categories = (data as { categories?: string[] })?.categories || []
      // Cache for 15 minutes
      cache.set(cacheKey, categories, 15 * 60 * 1000)
      return categories
    } catch (error) {
      console.error('Error fetching Calgary categories:', error)
      return []
    }
  }

  // Get Calgary communities (optimized with caching)
  static async getCalgaryCommunities(): Promise<string[]> {
    try {
      const cacheKey = 'calgary_communities'
      const cached = cache.get<string[]>(cacheKey)
      if (cached) return cached

      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabase) {
        return []
      }

      // Use distinct query to reduce data transfer
      const { data, error } = await supabase
        .rpc('get_distinct_communities')
        .single()

      if (error) {
        // Fallback to original query if RPC doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('calgary_businesses')
          .select('community')
          .eq('active', true)
          .eq('is_consumer_facing', true)
          .not('community', 'is', null)

        if (fallbackError) throw fallbackError

        const communities = [...new Set(fallbackData?.map(item => item.community).filter(Boolean))]
        const sortedCommunities = communities.sort()
        
        // Cache for 15 minutes (communities don't change often)
        cache.set(cacheKey, sortedCommunities, 15 * 60 * 1000)
        return sortedCommunities
      }

      const communities = (data as { communities?: string[] })?.communities || []
      // Cache for 15 minutes
      cache.set(cacheKey, communities, 15 * 60 * 1000)
      return communities
    } catch (error) {
      console.error('Error fetching Calgary communities:', error)
      return []
    }
  }

  // Search Calgary businesses (optimized)
  static async searchBusinesses(query: string, limit = 20): Promise<BusinessCardData[]> {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabase) {
        return []
      }

      // Sanitize the search query
      const sanitizedQuery = sanitizeSearchQuery(query)
      
      // Return empty results if query is empty after sanitization
      if (!sanitizedQuery) {
        return []
      }

      // Cache search results for 2 minutes
      const cacheKey = `search_${sanitizedQuery}_${limit}`
      const cached = cache.get<BusinessCardData[]>(cacheKey)
      if (cached) return cached

      // Use text search with ranking for better performance
      const { data, error } = await supabase
        .rpc('search_businesses', {
          search_term: sanitizedQuery,
          result_limit: limit
        })

      if (error) {
        // Fallback to original ILIKE search
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('calgary_businesses')
          .select('*')
          .eq('active', true)
          .eq('is_consumer_facing', true)
          .or(`tradename.ilike.%${sanitizedQuery}%,address.ilike.%${sanitizedQuery}%,community.ilike.%${sanitizedQuery}%,category.ilike.%${sanitizedQuery}%`)
          .order('first_issued_date', { ascending: false })
          .limit(limit)

        if (fallbackError) throw fallbackError

        const result = fallbackData || []
        // Cache for 2 minutes
        cache.set(cacheKey, result, 2 * 60 * 1000)
        return result
      }

      const result = data || []
      // Cache for 2 minutes
      cache.set(cacheKey, result, 2 * 60 * 1000)
      return result
    } catch (error) {
      console.error('Error searching Calgary businesses:', error)
      return []
    }
  }

  // Get all Calgary businesses with pagination and filters
  static async getAllCalgaryBusinesses(params: {
    search?: string
    category?: string
    community?: string
    limit?: number
    offset?: number
  }): Promise<{ businesses: BusinessCardData[], total: number }> {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabase) {
        return { businesses: [], total: 0 }
      }

      const { search, category, community, limit = 20, offset = 0 } = params

      let query = supabase
        .from('calgary_businesses')
        .select('*', { count: 'exact' })
        .eq('active', true)
        .eq('is_consumer_facing', true)

      // Apply filters
      if (search) {
        const sanitizedSearch = sanitizeSearchQuery(search)
        if (sanitizedSearch) {
          query = query.or(`tradename.ilike.%${sanitizedSearch}%,address.ilike.%${sanitizedSearch}%,community.ilike.%${sanitizedSearch}%,category.ilike.%${sanitizedSearch}%`)
        }
      }
      if (category) {
        query = query.eq('category', category)
      }
      if (community) {
        query = query.eq('community', community)
      }

      // Apply pagination
      query = query
        .order('first_issued_date', { ascending: false })
        .range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      return {
        businesses: data || [],
        total: count || 0
      }
    } catch (error) {
      console.error('Error fetching all Calgary businesses:', error)
      return { businesses: [], total: 0 }
    }
  }
}
