
import { supabase } from '@/lib/supabase'
import { CalgaryBusiness } from '@/types/business'

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
  // Get Calgary businesses for homepage
  static async getCalgaryFeaturedBusinesses(limit: number = 12): Promise<BusinessCardData[]> {
    try {
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

      return data || []
    } catch (error) {
      console.error('Error fetching Calgary featured businesses:', error)
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

  // Get Calgary categories
  static async getCalgaryCategories(): Promise<string[]> {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabase) {
        return []
      }

      const { data, error } = await supabase
        .from('calgary_businesses')
        .select('category')
        .eq('active', true)
        .eq('is_consumer_facing', true)
        .not('category', 'is', null)

      if (error) throw error

      const categories = [...new Set(data?.map(item => item.category).filter(Boolean))]
      return categories.sort()
    } catch (error) {
      console.error('Error fetching Calgary categories:', error)
      return []
    }
  }

  // Get Calgary communities
  static async getCalgaryCommunities(): Promise<string[]> {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabase) {
        return []
      }

      const { data, error } = await supabase
        .from('calgary_businesses')
        .select('community')
        .eq('active', true)
        .eq('is_consumer_facing', true)
        .not('community', 'is', null)

      if (error) throw error

      const communities = [...new Set(data?.map(item => item.community).filter(Boolean))]
      return communities.sort()
    } catch (error) {
      console.error('Error fetching Calgary communities:', error)
      return []
    }
  }

  // Search Calgary businesses
  static async searchBusinesses(query: string, limit = 20): Promise<BusinessCardData[]> {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabase) {
        return []
      }

      const { data, error } = await supabase
        .from('calgary_businesses')
        .select('*')
        .eq('active', true)
        .eq('is_consumer_facing', true)
        .or(`tradename.ilike.%${query}%,address.ilike.%${query}%,community.ilike.%${query}%,category.ilike.%${query}%`)
        .order('first_issued_date', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data || []
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
        query = query.or(`tradename.ilike.%${search}%,address.ilike.%${search}%,community.ilike.%${search}%,category.ilike.%${search}%`)
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
