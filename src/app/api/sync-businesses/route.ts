// API Route for syncing Calgary business data
// POST /api/sync-businesses
// SECURED: Requires API key authentication

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { 
  fetchRecentBusinesses, 
  fetchAllBusinesses
} from '@/lib/calgary-api'

// Security: Only create admin client with service role key (not anon key)
let supabaseAdmin: ReturnType<typeof createClient> | null = null
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
}

// Security: API key for protecting this endpoint
const API_SECRET_KEY = process.env.API_SECRET_KEY

// Rate limiting: Simple in-memory store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5 // 5 requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }
  
  record.count++
  return true
}

function authenticate(request: NextRequest): boolean {
  // Check API key in Authorization header
  const authHeader = request.headers.get('authorization')
  const apiKeyFromHeader = authHeader?.replace('Bearer ', '')
  
  // Check API key in query params (less secure, for testing only)
  const { searchParams } = new URL(request.url)
  const apiKeyFromQuery = searchParams.get('api_key')
  
  const providedKey = apiKeyFromHeader || apiKeyFromQuery
  
  return providedKey === API_SECRET_KEY && API_SECRET_KEY !== 'your_secure_random_key_here_change_this_immediately'
}
import type { CalgaryBusinessInput } from '@/types/business'

// Types for API responses
interface SyncResult {
  success: boolean
  message: string
  stats: {
    fetched: number
    processed: number
    inserted: number
    updated: number
    errors: number
    skipped: number
  }
  errors?: string[]
  duration: number
}

interface SyncRequest {
  mode?: 'recent' | 'full' | 'test'
  daysBack?: number
  limit?: number
  dryRun?: boolean
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  // Security check 1: Rate limiting
  const clientIP = request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown'
  
  if (!checkRateLimit(clientIP)) {
    return NextResponse.json({
      success: false,
      message: 'Rate limit exceeded. Too many requests.',
      stats: {
        fetched: 0,
        processed: 0,
        inserted: 0,
        updated: 0,
        errors: 1,
        skipped: 0
      },
      duration: Date.now() - startTime
    } as SyncResult, { status: 429 })
  }
  
  // Security check 2: Authentication
  if (!authenticate(request)) {
    return NextResponse.json({
      success: false,
      message: 'Unauthorized. Valid API key required.',
      stats: {
        fetched: 0,
        processed: 0,
        inserted: 0,
        updated: 0,
        errors: 1,
        skipped: 0
      },
      duration: Date.now() - startTime
    } as SyncResult, { status: 401 })
  }
  
  // Security check 3: Service role key required (not anon key)
  if (!supabaseAdmin) {
    return NextResponse.json({
      success: false,
      message: 'Service unavailable. Admin database connection required.',
      stats: {
        fetched: 0,
        processed: 0,
        inserted: 0,
        updated: 0,
        errors: 1,
        skipped: 0
      },
      duration: Date.now() - startTime
    } as SyncResult, { status: 503 })
  }
  
  try {
    // Parse request body
    const body: SyncRequest = await request.json().catch(() => ({}))
    const { 
      mode = 'recent', 
      daysBack = 30, 
      limit = 1000,
      dryRun = false 
    } = body

    console.log(`Starting business sync - Mode: ${mode}, DryRun: ${dryRun}`)

    // Initialize stats
    const stats = {
      fetched: 0,
      processed: 0,
      inserted: 0,
      updated: 0,
      errors: 0,
      skipped: 0
    }
    const errors: string[] = []

    // Fetch data from Calgary API
    let businessData: CalgaryBusinessInput[] = []
    
    try {
      switch (mode) {
        case 'recent':
          businessData = await fetchRecentBusinesses(daysBack)
          break
        case 'full':
          businessData = await fetchAllBusinesses()
          break
        case 'test':
          // Fetch a small sample for testing
          const { fetchCalgaryBusinesses, processBusinessData } = await import('@/lib/calgary-api')
          const testData = await fetchCalgaryBusinesses(Math.min(limit, 50))
          businessData = processBusinessData(testData)
          break
        default:
          throw new Error(`Invalid sync mode: ${mode}`)
      }

      stats.fetched = businessData.length
      console.log(`Fetched ${stats.fetched} businesses from Calgary API`)

    } catch (error) {
      const errorMsg = `Failed to fetch data from Calgary API: ${error}`
      console.error(errorMsg)
      errors.push(errorMsg)
      
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch data from Calgary API',
        stats,
        errors,
        duration: Date.now() - startTime
      } as SyncResult, { status: 500 })
    }

    // Process businesses in batches
    const batchSize = 100
    let processed = 0

    for (let i = 0; i < businessData.length; i += batchSize) {
      const batch = businessData.slice(i, i + batchSize)
      
      for (const business of batch) {
        try {
          stats.processed++
          
          if (dryRun) {
            // In dry run mode, just validate the data
            console.log(`[DRY RUN] Would process: ${business.tradename} (${business.calgary_id})`)
            stats.inserted++
            continue
          }

          // Check if business already exists
          const { data: existingBusiness, error: checkError } = await supabaseAdmin
            .from('calgary_businesses')
            .select('id, calgary_id, updated_at')
            .eq('calgary_id', business.calgary_id)
            .single()

          if (checkError && checkError.code !== 'PGRST116') {
            // Error other than "not found"
            throw checkError
          }

          if (existingBusiness) {
            // Update existing business
            const { error: updateError } = await supabaseAdmin
              .from('calgary_businesses')
              .update({
                tradename: business.tradename,
                address: business.address,
                community: business.community,
                license_type: business.license_type,
                first_issued_date: business.first_issued_date,
                category: business.category,
                is_consumer_facing: business.is_consumer_facing,
                latitude: business.latitude,
                longitude: business.longitude,
                active: true
              })
              .eq('calgary_id', business.calgary_id)

            if (updateError) {
              throw updateError
            }

            stats.updated++
            console.log(`Updated business: ${business.tradename} (${business.calgary_id})`)
            
          } else {
            // Insert new business
            const { error: insertError } = await supabaseAdmin
              .from('calgary_businesses')
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .insert([business as any])

            if (insertError) {
              // Check if it's a duplicate slug error
              if (insertError.code === '23505' && insertError.message?.includes('slug')) {
                // Generate a new unique slug and retry
                const timestamp = Date.now().toString().slice(-6)
                const newSlug = `${business.slug}-${timestamp}`
                
                const { error: retryError } = await supabaseAdmin
                  .from('calgary_businesses')
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .insert([{ ...business, slug: newSlug } as any])
                
                if (retryError) {
                  throw retryError
                }
                
                console.log(`Inserted business with modified slug: ${business.tradename} (${newSlug})`)
              } else {
                throw insertError
              }
            } else {
              console.log(`Inserted new business: ${business.tradename} (${business.calgary_id})`)
            }

            stats.inserted++
          }

        } catch (error) {
          stats.errors++
          const errorMsg = `Error processing business ${business.calgary_id} (${business.tradename}): ${JSON.stringify(error)}`
          console.error(errorMsg)
          console.error('Full error object:', error)
          errors.push(errorMsg)
          
          // Continue processing other businesses
          continue
        }
      }

      processed += batch.length
      
      // Log progress for long-running syncs
      if (processed % 500 === 0) {
        console.log(`Processed ${processed}/${businessData.length} businesses...`)
      }
    }

    const duration = Date.now() - startTime
    const successRate = stats.processed > 0 ? ((stats.inserted + stats.updated) / stats.processed) * 100 : 0

    const result: SyncResult = {
      success: stats.errors < stats.processed * 0.1, // Consider success if less than 10% errors
      message: `Sync completed. Processed ${stats.processed} businesses with ${successRate.toFixed(1)}% success rate`,
      stats,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined, // Limit error messages
      duration
    }

    console.log(`Sync completed in ${duration}ms:`, stats)

    return NextResponse.json(result, { 
      status: result.success ? 200 : 207 // 207 = Multi-Status (partial success)
    })

  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = `Sync failed: ${error}`
    
    console.error(errorMessage)
    
    return NextResponse.json({
      success: false,
      message: errorMessage,
      stats: {
        fetched: 0,
        processed: 0,
        inserted: 0,
        updated: 0,
        errors: 1,
        skipped: 0
      },
      errors: [errorMessage],
      duration
    } as SyncResult, { status: 500 })
  }
}

// GET endpoint for checking sync status or running test sync
export async function GET(request: NextRequest) {
  // Security check 1: Rate limiting
  const clientIP = request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown'
  
  if (!checkRateLimit(clientIP)) {
    return NextResponse.json({
      success: false,
      message: 'Rate limit exceeded. Too many requests.'
    }, { status: 429 })
  }
  
  // Security check 2: Authentication
  if (!authenticate(request)) {
    return NextResponse.json({
      success: false,
      message: 'Unauthorized. Valid API key required.'
    }, { status: 401 })
  }
  
  // Security check 3: Service role key required
  if (!supabaseAdmin) {
    return NextResponse.json({
      success: false,
      message: 'Service unavailable. Admin database connection required.'
    }, { status: 503 })
  }
  
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (action === 'test') {
    // Run a small test sync
    const testRequest = new Request(request.url, {
      method: 'POST',
      body: JSON.stringify({ 
        mode: 'test', 
        limit: 10,
        dryRun: true 
      }),
      headers: { 'Content-Type': 'application/json' }
    })
    
    return POST(testRequest as NextRequest)
  }

  if (action === 'status') {
    // Get database statistics
    try {
      const { data: totalCount } = await supabaseAdmin
        .from('calgary_businesses')
        .select('*', { count: 'exact', head: true })

      const { data: recentCount } = await supabaseAdmin
        .from('calgary_businesses')
        .select('*', { count: 'exact', head: true })
        .gte('first_issued_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])

      const { data: consumerFacingCount } = await supabaseAdmin
        .from('calgary_businesses')
        .select('*', { count: 'exact', head: true })
        .eq('is_consumer_facing', true)

      return NextResponse.json({
        success: true,
        data: {
          total_businesses: totalCount,
          recent_businesses: recentCount,
          consumer_facing_businesses: consumerFacingCount,
          last_updated: new Date().toISOString()
        }
      })

    } catch (error) {
      return NextResponse.json({
        success: false,
        message: `Failed to get status: ${error}`
      }, { status: 500 })
    }
  }

  return NextResponse.json({
    success: false,
    message: 'Invalid action. Use ?action=test or ?action=status'
  }, { status: 400 })
}