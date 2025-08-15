
import { supabase, Business, Category, Neighborhood } from '@/lib/supabase'
import { sampleBusinesses } from '@/data/sample-businesses'
import { CalgaryBusiness } from '@/types/business'

export interface BusinessWithRelations extends Business {
  category_name?: string
  category_slug?: string
  neighborhood_name?: string
  neighborhood_slug?: string
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
  // Get Calgary businesses for homepage
  static async getCalgaryFeaturedBusinesses(limit: number = 12): Promise<BusinessCardData[]> {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabase) {
        // Return sample data if Supabase is not configured
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
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
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

  // Get all active businesses
  static async getBusinesses(limit = 50): Promise<BusinessWithRelations[]> {
    try {
      // For now, use sample data until Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return sampleBusinesses.slice(0, limit).map(business => ({
          ...business,
          category_name: business.category,
          category_slug: business.category.toLowerCase().replace(/\s+/g, '-'),
          neighborhood_name: business.neighborhood,
          neighborhood_slug: business.neighborhood.toLowerCase().replace(/\s+/g, '-'),
        }))
      }

      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          categories(name, slug),
          neighborhoods(name, slug)
        `)
        .eq('active', true)
        .order('opening_date', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data?.map(business => ({
        ...business,
        category_name: business.categories?.name,
        category_slug: business.categories?.slug,
        neighborhood_name: business.neighborhoods?.name,
        neighborhood_slug: business.neighborhoods?.slug,
      })) || []
    } catch (error) {
      console.error('Error fetching businesses:', error)
      return []
    }
  }

  // Get featured businesses
  static async getFeaturedBusinesses(limit = 6): Promise<BusinessWithRelations[]> {
    try {
      // For now, use sample data until Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return sampleBusinesses
          .filter(business => business.featured)
          .slice(0, limit)
          .map(business => ({
            ...business,
            category_name: business.category,
            category_slug: business.category.toLowerCase().replace(/\s+/g, '-'),
            neighborhood_name: business.neighborhood,
            neighborhood_slug: business.neighborhood.toLowerCase().replace(/\s+/g, '-'),
          }))
      }

      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          categories(name, slug),
          neighborhoods(name, slug)
        `)
        .eq('active', true)
        .eq('featured', true)
        .order('opening_date', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data?.map(business => ({
        ...business,
        category_name: business.categories?.name,
        category_slug: business.categories?.slug,
        neighborhood_name: business.neighborhoods?.name,
        neighborhood_slug: business.neighborhoods?.slug,
      })) || []
    } catch (error) {
      console.error('Error fetching featured businesses:', error)
      return []
    }
  }

  // Get business by slug
  static async getBusinessBySlug(slug: string): Promise<BusinessWithRelations | null> {
    try {
      // For now, use sample data until Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const business = sampleBusinesses.find(b => b.slug === slug)
        if (!business) return null
        
        return {
          ...business,
          category_name: business.category,
          category_slug: business.category.toLowerCase().replace(/\s+/g, '-'),
          neighborhood_name: business.neighborhood,
          neighborhood_slug: business.neighborhood.toLowerCase().replace(/\s+/g, '-'),
        }
      }

      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          categories(name, slug),
          neighborhoods(name, slug)
        `)
        .eq('slug', slug)
        .eq('active', true)
        .single()

      if (error) throw error

      if (!data) return null

      return {
        ...data,
        category_name: data.categories?.name,
        category_slug: data.categories?.slug,
        neighborhood_name: data.neighborhoods?.name,
        neighborhood_slug: data.neighborhoods?.slug,
      }
    } catch (error) {
      console.error('Error fetching business by slug:', error)
      return null
    }
  }

  // Get businesses by category
  static async getBusinessesByCategory(categorySlug: string, limit = 20): Promise<BusinessWithRelations[]> {
    try {
      // For now, use sample data until Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return sampleBusinesses
          .filter(business => business.category.toLowerCase().replace(/\s+/g, '-') === categorySlug)
          .slice(0, limit)
          .map(business => ({
            ...business,
            category_name: business.category,
            category_slug: business.category.toLowerCase().replace(/\s+/g, '-'),
            neighborhood_name: business.neighborhood,
            neighborhood_slug: business.neighborhood.toLowerCase().replace(/\s+/g, '-'),
          }))
      }

      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          categories!inner(name, slug),
          neighborhoods(name, slug)
        `)
        .eq('active', true)
        .eq('categories.slug', categorySlug)
        .order('opening_date', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data?.map(business => ({
        ...business,
        category_name: business.categories?.name,
        category_slug: business.categories?.slug,
        neighborhood_name: business.neighborhoods?.name,
        neighborhood_slug: business.neighborhoods?.slug,
      })) || []
    } catch (error) {
      console.error('Error fetching businesses by category:', error)
      return []
    }
  }

  // Get businesses by neighborhood
  static async getBusinessesByNeighborhood(neighborhoodSlug: string, limit = 20): Promise<BusinessWithRelations[]> {
    try {
      // For now, use sample data until Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return sampleBusinesses
          .filter(business => business.neighborhood.toLowerCase().replace(/\s+/g, '-') === neighborhoodSlug)
          .slice(0, limit)
          .map(business => ({
            ...business,
            category_name: business.category,
            category_slug: business.category.toLowerCase().replace(/\s+/g, '-'),
            neighborhood_name: business.neighborhood,
            neighborhood_slug: business.neighborhood.toLowerCase().replace(/\s+/g, '-'),
          }))
      }

      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          categories(name, slug),
          neighborhoods!inner(name, slug)
        `)
        .eq('active', true)
        .eq('neighborhoods.slug', neighborhoodSlug)
        .order('opening_date', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data?.map(business => ({
        ...business,
        category_name: business.categories?.name,
        category_slug: business.categories?.slug,
        neighborhood_name: business.neighborhoods?.name,
        neighborhood_slug: business.neighborhoods?.slug,
      })) || []
    } catch (error) {
      console.error('Error fetching businesses by neighborhood:', error)
      return []
    }
  }

  // Get all categories
  static async getCategories(): Promise<Category[]> {
    try {
      // For now, return sample categories until Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const categories = [...new Set(sampleBusinesses.map(b => b.category))]
        return categories.map((name, index) => ({
          id: `cat-${index}`,
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          description: `${name} in Calgary`,
          icon: 'default',
          color: '#6366f1',
          created_at: new Date().toISOString()
        }))
      }

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }

  // Get all neighborhoods
  static async getNeighborhoods(): Promise<Neighborhood[]> {
    try {
      // For now, return sample neighborhoods until Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const neighborhoods = [...new Set(sampleBusinesses.map(b => b.neighborhood))]
        return neighborhoods.map((name, index) => ({
          id: `neigh-${index}`,
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          description: `${name} neighborhood in Calgary`,
          created_at: new Date().toISOString()
        }))
      }

      const { data, error } = await supabase
        .from('neighborhoods')
        .select('*')
        .order('name')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching neighborhoods:', error)
      return []
    }
  }
}
