// Calgary Open Data API Client
// Fetches business license data from Calgary's open data portal

import slugify from 'slugify'
import type { CalgaryBusinessInput } from '@/types/business'

// Raw data structure from Calgary's API
interface CalgaryAPIBusiness {
  getbusid: string
  tradename: string
  address: string
  comdistnm: string | null
  licencetypes: string
  first_iss_dt: string
  point?: {
    coordinates: [number, number] // [longitude, latitude]
  }
}

// API configuration
const CALGARY_API_BASE = 'https://data.calgary.ca/resource/vdjc-pybd.json'
const MAX_RECORDS_PER_REQUEST = 50000

// Categories mapping based on license types and business names
const CATEGORY_MAPPINGS = {
  restaurants: [
    'restaurant', 'cafe', 'coffee', 'pizza', 'bar', 'pub', 'grill', 'bistro',
    'deli', 'bakery', 'food truck', 'catering', 'dining', 'eatery', 'kitchen',
    'brewery', 'winery', 'lounge', 'tavern'
  ],
  retail: [
    'retail', 'store', 'shop', 'boutique', 'market', 'pharmacy', 'grocery',
    'clothing', 'fashion', 'electronics', 'furniture', 'automotive', 'gas station',
    'convenience', 'jewelry', 'books', 'sports', 'toys', 'hardware'
  ],
  services: [
    'salon', 'spa', 'fitness', 'gym', 'clinic', 'dental', 'medical', 'law',
    'accounting', 'consulting', 'repair', 'cleaning', 'laundry', 'insurance',
    'real estate', 'photography', 'veterinary', 'childcare', 'education'
  ],
  healthcare: [
    'medical', 'dental', 'clinic', 'hospital', 'pharmacy', 'optometry',
    'physiotherapy', 'chiropractic', 'massage', 'counseling', 'therapy'
  ],
  entertainment: [
    'entertainment', 'theater', 'cinema', 'arcade', 'bowling', 'casino',
    'nightclub', 'comedy', 'music', 'events', 'recreation'
  ]
}

// Consumer-facing business indicators
const CONSUMER_FACING_KEYWORDS = [
  'retail', 'restaurant', 'cafe', 'store', 'shop', 'salon', 'spa', 'gym',
  'clinic', 'bar', 'pub', 'entertainment', 'service', 'repair', 'market'
]

// Non-consumer facing indicators (typically B2B or industrial)
const NON_CONSUMER_FACING_KEYWORDS = [
  'wholesale', 'manufacturing', 'warehouse', 'distribution', 'industrial',
  'contractor', 'construction', 'trucking', 'logistics', 'import', 'export'
]

/**
 * Fetch business license data from Calgary's open data API
 */
export async function fetchCalgaryBusinesses(
  limit: number = 1000,
  offset: number = 0,
  dateFilter?: string
): Promise<CalgaryAPIBusiness[]> {
  try {
    const params = new URLSearchParams({
      '$limit': limit.toString(),
      '$offset': offset.toString(),
      '$order': 'first_iss_dt DESC'
    })

    // Add date filter if provided (e.g., "2024-01-01T00:00:00.000")
    if (dateFilter) {
      params.append('$where', `first_iss_dt >= '${dateFilter}'`)
    }

    const url = `${CALGARY_API_BASE}?${params}`
    
    console.log(`Fetching Calgary businesses from: ${url}`)
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NowOpenCalgary/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Calgary API responded with ${response.status}: ${response.statusText}`)
    }

    const data: CalgaryAPIBusiness[] = await response.json()
    
    console.log(`Fetched ${data.length} businesses from Calgary API`)
    
    return data
  } catch (error) {
    console.error('Error fetching Calgary businesses:', error)
    throw error
  }
}

/**
 * Generate SEO-friendly slug from business name
 */
export function generateSlug(tradename: string, calgaryId: string): string {
  // Clean up the tradename
  const cleanName = tradename
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .trim()
    .toLowerCase()

  // Generate base slug
  const baseSlug = slugify(cleanName, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  })

  // Ensure uniqueness by appending part of the Calgary ID
  const shortId = calgaryId.slice(-6)
  return `${baseSlug}-${shortId}`
}

/**
 * Categorize business based on name and license type
 */
export function categorizeBusiness(tradename: string, licenseType: string): string {
  const searchText = `${tradename} ${licenseType}`.toLowerCase()

  // Check each category
  for (const [category, keywords] of Object.entries(CATEGORY_MAPPINGS)) {
    if (keywords.some(keyword => searchText.includes(keyword))) {
      return category
    }
  }

  // Default category
  return 'services'
}

/**
 * Determine if business is consumer-facing
 */
export function isConsumerFacing(tradename: string, licenseType: string): boolean {
  const searchText = `${tradename} ${licenseType}`.toLowerCase()

  // Check for non-consumer facing keywords first
  const isNotConsumerFacing = NON_CONSUMER_FACING_KEYWORDS.some(
    keyword => searchText.includes(keyword)
  )
  
  if (isNotConsumerFacing) {
    return false
  }

  // Check for consumer-facing keywords
  const isConsumerFacing = CONSUMER_FACING_KEYWORDS.some(
    keyword => searchText.includes(keyword)
  )

  // Default to consumer-facing for most retail licenses
  if (licenseType.toLowerCase().includes('business license')) {
    return true
  }

  return isConsumerFacing
}

/**
 * Extract coordinates from Calgary's POINT data
 */
export function extractCoordinates(point?: { coordinates: [number, number] }): {
  latitude: number | null
  longitude: number | null
} {
  if (!point?.coordinates || !Array.isArray(point.coordinates)) {
    return { latitude: null, longitude: null }
  }

  const [longitude, latitude] = point.coordinates

  // Validate coordinates are within reasonable bounds for Calgary
  if (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= 50.8 && latitude <= 51.3 && // Calgary latitude range
    longitude >= -114.4 && longitude <= -113.8 // Calgary longitude range
  ) {
    return { latitude, longitude }
  }

  return { latitude: null, longitude: null }
}

/**
 * Process raw Calgary API data into our business format
 */
export function processBusinessData(apiData: CalgaryAPIBusiness[]): CalgaryBusinessInput[] {
  return apiData
    .filter(business => {
      // Filter out businesses with missing essential data
      return (
        business.getbusid &&
        business.tradename &&
        business.address &&
        business.licencetypes
      )
    })
    .map(business => {
      const slug = generateSlug(business.tradename, business.getbusid)
      const category = categorizeBusiness(business.tradename, business.licencetypes)
      const consumer_facing = isConsumerFacing(business.tradename, business.licencetypes)
      const coordinates = extractCoordinates(business.point)

      return {
        calgary_id: business.getbusid,
        tradename: business.tradename.trim(),
        address: business.address.trim(),
        community: business.comdistnm?.trim() || null,
        license_type: business.licencetypes.trim(),
        first_issued_date: business.first_iss_dt ? business.first_iss_dt.split('T')[0] : '2024-01-01', // Extract date part only or use default
        slug,
        category,
        is_consumer_facing: consumer_facing,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      }
    })
}

/**
 * Fetch and process recent businesses (last 30 days by default)
 */
export async function fetchRecentBusinesses(daysBack: number = 30): Promise<CalgaryBusinessInput[]> {
  const dateFilter = new Date()
  dateFilter.setDate(dateFilter.getDate() - daysBack)
  const isoDate = dateFilter.toISOString()

  const rawData = await fetchCalgaryBusinesses(5000, 0, isoDate)
  return processBusinessData(rawData)
}

/**
 * Fetch all businesses (use with caution - this can be a lot of data)
 */
export async function fetchAllBusinesses(): Promise<CalgaryBusinessInput[]> {
  const allBusinesses: CalgaryAPIBusiness[] = []
  let offset = 0
  let hasMore = true

  while (hasMore) {
    const batch = await fetchCalgaryBusinesses(MAX_RECORDS_PER_REQUEST, offset)
    
    if (batch.length === 0) {
      hasMore = false
    } else {
      allBusinesses.push(...batch)
      offset += MAX_RECORDS_PER_REQUEST
      
      // Prevent infinite loops
      if (batch.length < MAX_RECORDS_PER_REQUEST) {
        hasMore = false
      }
    }

    // Add a small delay to be nice to the API
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return processBusinessData(allBusinesses)
}