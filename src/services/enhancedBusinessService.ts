import { supabase } from '@/lib/supabase'
import { CalgaryBusiness } from '@/types/business'
import { MonitoringService } from '@/lib/monitoring'
import { PerformanceMonitor, measurePerformance } from '@/lib/performance'

// Enhanced cache with performance tracking
interface CacheEntry<T> {
  data: T
  expiry: number
  created: number
}

class EnhancedQueryCache {
  private cache = new Map<string, CacheEntry<any>>()
  private hitCount = 0
  private missCount = 0

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
      created: Date.now()
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry || Date.now() > entry.expiry) {
      this.cache.delete(key)
      this.missCount++
      return null
    }
    
    this.hitCount++
    return entry.data
  }

  getStats() {
    const total = this.hitCount + this.missCount
    const hitRate = total > 0 ? (this.hitCount / total) * 100 : 0
    
    return {
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: hitRate.toFixed(2),
      cacheSize: this.cache.size
    }
  }

  clear() {
    this.cache.clear()
    this.hitCount = 0
    this.missCount = 0
  }
}

const cache = new EnhancedQueryCache()
const performanceMonitor = PerformanceMonitor.getInstance()

export class EnhancedBusinessService {
  /**
   * Get featured businesses with performance monitoring
   */
  static async getFeaturedBusinesses(limit: number = 12): Promise<CalgaryBusiness[]> {
    const cacheKey = `featured_businesses_${limit}`
    const cached = cache.get<CalgaryBusiness[]>(cacheKey)
    
    if (cached) {
      MonitoringService.addBreadcrumb(
        'Used cached featured businesses',
        'cache.hit',
        { key: cacheKey, count: cached.length }
      )
      return cached
    }

    return measurePerformance(async () => {
      const startTime = Date.now()
      
      try {
        // Try optimized RPC function first
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_businesses_optimized', {
          result_limit: limit,
          result_offset: 0
        })
        
        if (!rpcError && rpcData?.[0]?.businesses) {
          const businesses = rpcData[0].businesses
          const duration = Date.now() - startTime
          
          performanceMonitor.trackDatabaseQuery({
            query: 'get_businesses_optimized_featured',
            duration,
            resultCount: businesses.length,
            cached: false
          })
          
          cache.set(cacheKey, businesses, 10 * 60 * 1000) // 10 minutes
          return businesses
        }
      } catch (rpcError) {
        MonitoringService.logWarning('RPC function failed, falling back to direct query', {
          error: String(rpcError),
          function: 'get_businesses_optimized'
        })
      }

      // Fallback to direct query
      const { data, error } = await supabase
        .from('calgary_businesses')
        .select('*')
        .eq('active', true)
        .eq('is_consumer_facing', true)
        .order('first_issued_date', { ascending: false })
        .limit(limit)

      if (error) {
        MonitoringService.logError(new Error(`Featured businesses query failed: ${error.message}`), {
          query: 'featured_businesses',
          limit: limit.toString()
        })
        throw error
      }

      const duration = Date.now() - startTime
      performanceMonitor.trackDatabaseQuery({
        query: 'featured_businesses_fallback',
        duration,
        resultCount: data?.length || 0,
        cached: false
      })

      cache.set(cacheKey, data || [], 10 * 60 * 1000) // 10 minutes
      return data || []
      
    }, 'get_featured_businesses', { limit })
  }

  /**
   * Search businesses with enhanced performance tracking
   */
  static async searchBusinesses(
    searchTerm: string,
    category?: string,
    community?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ businesses: CalgaryBusiness[], total: number }> {
    const cacheKey = `search_${searchTerm}_${category}_${community}_${limit}_${offset}`
    const cached = cache.get<{ businesses: CalgaryBusiness[], total: number }>(cacheKey)
    
    if (cached) {
      MonitoringService.trackUserAction('search_cache_hit', {
        searchTerm,
        category,
        community,
        resultCount: cached.businesses.length.toString()
      })
      return cached
    }

    return measurePerformance(async () => {
      const startTime = Date.now()
      
      try {
        // Try optimized search RPC function first
        const { data: rpcData, error: rpcError } = await supabase.rpc('search_businesses', {
          search_term: searchTerm,
          result_limit: limit
        })
        
        if (!rpcError && rpcData) {
          const duration = Date.now() - startTime
          
          performanceMonitor.trackDatabaseQuery({
            query: 'search_businesses_rpc',
            duration,
            resultCount: rpcData.length,
            cached: false
          })
          
          const result = { businesses: rpcData, total: rpcData.length }
          cache.set(cacheKey, result, 2 * 60 * 1000) // 2 minutes for search
          
          MonitoringService.trackUserAction('search_completed', {
            searchTerm,
            category,
            community,
            resultCount: rpcData.length.toString(),
            duration: duration.toString()
          })
          
          return result
        }
      } catch (rpcError) {
        MonitoringService.logWarning('Search RPC function failed, falling back', {
          error: String(rpcError),
          searchTerm,
          category,
          community
        })
      }

      // Fallback to direct query with filters
      let query = supabase
        .from('calgary_businesses')
        .select('*', { count: 'exact' })
        .eq('active', true)
        .eq('is_consumer_facing', true)

      if (searchTerm) {
        const sanitizedTerm = searchTerm.replace(/[%_'"\\]/g, '').trim()
        query = query.or(
          `tradename.ilike.%${sanitizedTerm}%,address.ilike.%${sanitizedTerm}%,community.ilike.%${sanitizedTerm}%`
        )
      }

      if (category) {
        query = query.eq('category', category)
      }

      if (community) {
        query = query.eq('community', community)
      }

      const { data, error, count } = await query
        .order('first_issued_date', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        MonitoringService.logError(new Error(`Search query failed: ${error.message}`), {
          searchTerm,
          category,
          community,
          limit: limit.toString(),
          offset: offset.toString()
        })
        throw error
      }

      const duration = Date.now() - startTime
      performanceMonitor.trackDatabaseQuery({
        query: 'search_businesses_fallback',
        duration,
        resultCount: data?.length || 0,
        cached: false
      })

      const result = { businesses: data || [], total: count || 0 }
      cache.set(cacheKey, result, 2 * 60 * 1000) // 2 minutes
      
      MonitoringService.trackUserAction('search_completed', {
        searchTerm,
        category,
        community,
        resultCount: (data?.length || 0).toString(),
        duration: duration.toString()
      })

      return result
      
    }, 'search_businesses', { searchTerm, category, community, limit, offset })
  }

  /**
   * Get business by slug with performance monitoring
   */
  static async getBusinessBySlug(slug: string): Promise<CalgaryBusiness | null> {
    const cacheKey = `business_${slug}`
    const cached = cache.get<CalgaryBusiness>(cacheKey)
    
    if (cached) {
      return cached
    }

    return measurePerformance(async () => {
      const startTime = Date.now()
      
      const { data, error } = await supabase
        .from('calgary_businesses')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return null
        }
        
        MonitoringService.logError(new Error(`Business lookup failed: ${error.message}`), {
          slug,
          operation: 'getBusinessBySlug'
        })
        throw error
      }

      const duration = Date.now() - startTime
      performanceMonitor.trackDatabaseQuery({
        query: 'get_business_by_slug',
        duration,
        resultCount: data ? 1 : 0,
        cached: false
      })

      if (data) {
        cache.set(cacheKey, data, 15 * 60 * 1000) // 15 minutes
        
        // Track business view
        MonitoringService.trackUserAction('business_viewed', {
          businessId: data.id,
          slug,
          category: data.category,
          community: data.community
        })
      }

      return data
      
    }, 'get_business_by_slug', { slug })
  }

  /**
   * Get businesses by category with performance monitoring
   */
  static async getBusinessesByCategory(
    category: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ businesses: CalgaryBusiness[], total: number }> {
    const cacheKey = `category_${category}_${limit}_${offset}`
    const cached = cache.get<{ businesses: CalgaryBusiness[], total: number }>(cacheKey)
    
    if (cached) {
      return cached
    }

    return measurePerformance(async () => {
      const startTime = Date.now()
      
      const { data, error, count } = await supabase
        .from('calgary_businesses')
        .select('*', { count: 'exact' })
        .eq('active', true)
        .eq('is_consumer_facing', true)
        .eq('category', category)
        .order('first_issued_date', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        MonitoringService.logError(new Error(`Category query failed: ${error.message}`), {
          category,
          limit: limit.toString(),
          offset: offset.toString()
        })
        throw error
      }

      const duration = Date.now() - startTime
      performanceMonitor.trackDatabaseQuery({
        query: 'get_businesses_by_category',
        duration,
        resultCount: data?.length || 0,
        cached: false
      })

      const result = { businesses: data || [], total: count || 0 }
      cache.set(cacheKey, result, 3 * 60 * 1000) // 3 minutes
      return result
      
    }, 'get_businesses_by_category', { category, limit, offset })
  }

  /**
   * Get distinct categories with caching
   */
  static async getCategories(): Promise<string[]> {
    const cacheKey = 'distinct_categories'
    const cached = cache.get<string[]>(cacheKey)
    
    if (cached) {
      return cached
    }

    return measurePerformance(async () => {
      const startTime = Date.now()
      
      try {
        // Try optimized RPC function first
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_distinct_categories')
        
        if (!rpcError && rpcData?.[0]?.categories) {
          const duration = Date.now() - startTime
          
          performanceMonitor.trackDatabaseQuery({
            query: 'get_distinct_categories_rpc',
            duration,
            resultCount: rpcData[0].categories.length,
            cached: false
          })
          
          cache.set(cacheKey, rpcData[0].categories, 15 * 60 * 1000) // 15 minutes
          return rpcData[0].categories
        }
      } catch (rpcError) {
        MonitoringService.logWarning('Categories RPC function failed, falling back', {
          error: String(rpcError)
        })
      }

      // Fallback to direct query
      const { data, error } = await supabase
        .from('calgary_businesses')
        .select('category')
        .eq('active', true)
        .eq('is_consumer_facing', true)
        .not('category', 'is', null)

      if (error) {
        MonitoringService.logError(new Error(`Categories query failed: ${error.message}`))
        throw error
      }

      const categories = [...new Set(data?.map(item => item.category).filter(Boolean))] as string[]
      categories.sort()

      const duration = Date.now() - startTime
      performanceMonitor.trackDatabaseQuery({
        query: 'get_categories_fallback',
        duration,
        resultCount: categories.length,
        cached: false
      })

      cache.set(cacheKey, categories, 15 * 60 * 1000) // 15 minutes
      return categories
      
    }, 'get_categories')
  }

  /**
   * Get performance statistics
   */
  static getPerformanceStats() {
    const cacheStats = cache.getStats()
    const dbStats = performanceMonitor.getAllStats()
    
    return {
      cache: cacheStats,
      database: dbStats,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Clear all caches (for testing or maintenance)
   */
  static clearCache() {
    cache.clear()
    MonitoringService.logInfo('Business service cache cleared')
  }
}