import { supabase, Business, Category, Neighborhood, typedSupabase } from '@/lib/supabase'
import { sampleBusinesses } from '@/data/sample-businesses'
import type { CalgaryBusiness } from '@/types/business'

export interface BusinessCardData {
  id: string
  calgary_id: string
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
  created_at: string
  isNew?: boolean
}

export interface BusinessWithRelations extends Business {
  category_name?: string
  category_slug?: string
  neighborhood_name?: string
  neighborhood_slug?: string
}

export class BusinessService {
  // Get Calgary businesses for homepage
  static async getCalgaryFeaturedBusinesses(limit: number = 12): Promise<BusinessCardData[]> {
    if (!typedSupabase) {
      console.warn('Supabase client not available')
      return []
    }
    
    const { data, error } = await typedSupabase!
      .from('calgary_businesses')
      .select('*')
      .eq('is_consumer_facing', true)
      .eq('active', true)
      .order('first_issued_date', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching featured Calgary businesses:', error)
      return []
    }

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    return (data || []).map(business => ({
      ...business,
      isNew: new Date(business.first_issued_date) >= oneWeekAgo
    }))
  }

  // Get all Calgary businesses with filtering and search
  static async getAllCalgaryBusinesses(params?: {
    search?: string
    category?: string
    community?: string
    limit?: number
    offset?: number
  }): Promise<{
    businesses: BusinessCardData[]
    total: number
  }> {
    if (!typedSupabase) {
      console.warn('Supabase client not available')
      return { businesses: [], total: 0 }
    }
    
    let query = typedSupabase!
      .from('calgary_businesses')
      .select('*', { count: 'exact' })
      .eq('is_consumer_facing', true)
      .eq('active', true)

    // Apply filters
    if (params?.search) {
      query = query.or(
        `tradename.ilike.%${params.search}%,address.ilike.%${params.search}%,community.ilike.%${params.search}%`
      )
    }

    if (params?.category) {
      query = query.eq('category', params.category)
    }

    if (params?.community) {
      query = query.eq('community', params.community)
    }

    // Apply pagination and sorting
    query = query
      .order('first_issued_date', { ascending: false })
      .range(params?.offset || 0, (params?.offset || 0) + (params?.limit || 20) - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching Calgary businesses:', error)
      return { businesses: [], total: 0 }
    }

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const businesses = (data || []).map(business => ({
      ...business,
      isNew: new Date(business.first_issued_date) >= oneWeekAgo
    }))

    return {
      businesses,
      total: count || 0
    }
  }

  // Get Calgary businesses by category
  static async getCalgaryBusinessesByCategory(
    category: string, 
    limit: number = 20
  ): Promise<BusinessCardData[]> {
    if (!typedSupabase) {
      console.warn('Supabase client not available')
      return []
    }
    
    const { data, error } = await typedSupabase!
      .from('calgary_businesses')
      .select('*')
      .eq('category', category)
      .eq('is_consumer_facing', true)
      .eq('active', true)
      .order('first_issued_date', { ascending: false })
      .limit(limit)

    if (error) {
      console.error(`Error fetching ${category} businesses:`, error)
      return []
    }

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    return (data || []).map(business => ({
      ...business,
      isNew: new Date(business.first_issued_date) >= oneWeekAgo
    }))
  }

  // Get single Calgary business by slug
  static async getCalgaryBusinessBySlug(slug: string): Promise<CalgaryBusiness | null> {
    if (!typedSupabase) {
      console.warn('Supabase client not available')
      return null
    }
    
    const { data, error } = await typedSupabase!
      .from('calgary_businesses')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single()

    if (error) {
      console.error('Error fetching Calgary business:', error)
      return null
    }

    // Increment view count
    if (data && typedSupabase) {
      await typedSupabase
        .from('calgary_businesses')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id)
    }

    return data
  }

  // Get unique Calgary categories for filtering
  static async getCalgaryCategories(): Promise<string[]> {
    if (!typedSupabase) {
      console.warn('Supabase client not available')
      return []
    }
    
    const { data, error } = await typedSupabase!
      .from('calgary_businesses')
      .select('category')
      .eq('is_consumer_facing', true)
      .eq('active', true)
      .not('category', 'is', null)

    if (error) {
      console.error('Error fetching Calgary categories:', error)
      return []
    }

    const categories = [...new Set(data.map(item => item.category).filter(Boolean))]
    return categories.sort()
  }

  // Get unique Calgary communities for filtering
  static async getCalgaryCommunities(): Promise<string[]> {
    if (!typedSupabase) {
      console.warn('Supabase client not available')
      return []
    }
    
    const { data, error } = await typedSupabase!
      .from('calgary_businesses')
      .select('community')
      .eq('is_consumer_facing', true)
      .eq('active', true)
      .not('community', 'is', null)

    if (error) {
      console.error('Error fetching Calgary communities:', error)
      return []
    }

    const communities = [...new Set(data.map(item => item.community).filter(Boolean))]
    return communities.sort()
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

      if (!supabase) {
        console.warn('Supabase client not available')
        return []
      }
      
      const { data, error } = await supabase!
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

      if (!supabase) {
        console.warn('Supabase client not available')
        return []
      }
      
      const { data, error } = await supabase!
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

      if (!supabase) {
        console.warn('Supabase client not available')
        return null
      }
      
      const { data, error } = await supabase!
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

      if (!supabase) {
        console.warn('Supabase client not available')
        return []
      }
      
      const { data, error } = await supabase!
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

      if (!supabase) {
        console.warn('Supabase client not available')
        return []
      }
      
      const { data, error } = await supabase!
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

  // Search businesses
  static async searchBusinesses(query: string, limit = 20): Promise<BusinessWithRelations[]> {
    try {
      // For now, use sample data until Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const searchTerm = query.toLowerCase()
        return sampleBusinesses
          .filter(business => 
            business.name.toLowerCase().includes(searchTerm) ||
            business.description.toLowerCase().includes(searchTerm) ||
            business.category.toLowerCase().includes(searchTerm) ||
            business.neighborhood.toLowerCase().includes(searchTerm)
          )
          .slice(0, limit)
          .map(business => ({
            ...business,
            category_name: business.category,
            category_slug: business.category.toLowerCase().replace(/\s+/g, '-'),
            neighborhood_name: business.neighborhood,
            neighborhood_slug: business.neighborhood.toLowerCase().replace(/\s+/g, '-'),
          }))
      }

      if (!supabase) {
        console.warn('Supabase client not available')
        return []
      }
      
      const { data, error } = await supabase!
        .from('businesses')
        .select(`
          *,
          categories(name, slug),
          neighborhoods(name, slug)
        `)
        .eq('active', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
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
      console.error('Error searching businesses:', error)
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

      if (!supabase) {
        console.warn('Supabase client not available')
        return []
      }
      
      const { data, error } = await supabase!
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

      if (!supabase) {
        console.warn('Supabase client not available')
        return []
      }
      
      const { data, error } = await supabase!
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
