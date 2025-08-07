// Calgary Business Types
// Types for the Calgary business license data

export interface CalgaryBusiness {
  id: string
  calgary_id: string // Original Calgary business license ID
  tradename: string
  address: string
  community: string | null
  license_type: string
  first_issued_date: string // ISO date string
  slug: string // SEO-friendly URL slug
  category: string | null // restaurants, retail, services, etc.
  is_consumer_facing: boolean
  latitude: number | null
  longitude: number | null
  view_count: number
  active: boolean
  created_at: string // ISO timestamp
  updated_at: string // ISO timestamp
}

// Simplified type for displaying in lists
export interface CalgaryBusinessSummary {
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
  view_count: number
}

// Type for business creation/updates
export interface CalgaryBusinessInput {
  calgary_id: string
  tradename: string
  address: string
  community?: string | null
  license_type: string
  first_issued_date: string
  slug: string
  category?: string | null
  is_consumer_facing?: boolean
  latitude?: number | null
  longitude?: number | null
}

// Community statistics type
export interface CommunityStats {
  community: string
  business_count: number
  recent_count: number // businesses added in last 30 days
}

// Category statistics type
export interface CategoryStats {
  category: string
  business_count: number
  recent_count: number // businesses added in last 30 days
}

// Search/filter parameters
export interface BusinessSearchParams {
  query?: string
  community?: string
  category?: string
  license_type?: string
  consumer_facing_only?: boolean
  limit?: number
  offset?: number
  sort_by?: 'first_issued_date' | 'tradename' | 'view_count'
  sort_order?: 'asc' | 'desc'
}

// API response types
export interface BusinessSearchResponse {
  businesses: CalgaryBusinessSummary[]
  total_count: number
  page: number
  per_page: number
  has_more: boolean
}

// Common business categories (can be extended)
export const BUSINESS_CATEGORIES = [
  'restaurants',
  'retail',
  'services',
  'healthcare',
  'automotive',
  'professional-services',
  'entertainment',
  'beauty-wellness',
  'education',
  'technology',
  'construction',
  'other'
] as const

export type BusinessCategory = typeof BUSINESS_CATEGORIES[number]

// Common license types (based on Calgary data)
export const LICENSE_TYPES = [
  'Business License',
  'Development Permit',
  'Mobile Vendor',
  'Specialty License',
  'Temporary License'
] as const

export type LicenseType = typeof LICENSE_TYPES[number]