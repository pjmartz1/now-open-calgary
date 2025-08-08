import { NextResponse } from 'next/server'
import { BusinessService } from '@/services/businessService'
import { typedSupabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Testing business service...')
    
    // First check if Supabase is available
    if (!typedSupabase) {
      return NextResponse.json({
        success: false,
        error: 'Supabase client not available',
        env_check: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'
        }
      }, { status: 500 })
    }

    // Try a direct raw query first
    const { data: rawData, error: rawError } = await typedSupabase
      .from('calgary_businesses')
      .select('*')
      .limit(5)

    if (rawError) {
      return NextResponse.json({
        success: false,
        error: `Raw query failed: ${rawError.message}`,
        details: rawError
      }, { status: 500 })
    }

    // Now try the business service
    const businesses = await BusinessService.getCalgaryFeaturedBusinesses(5)
    
    console.log('Fetched businesses:', businesses.length)
    
    return NextResponse.json({
      success: true,
      raw_count: rawData?.length || 0,
      service_count: businesses.length,
      raw_sample: rawData?.[0] || null,
      businesses: businesses.map(b => ({
        id: b.id,
        tradename: b.tradename,
        slug: b.slug,
        address: b.address,
        community: b.community
      }))
    })
  } catch (error) {
    console.error('Error in test-businesses:', error)
    return NextResponse.json({
      success: false,
      error: String(error),
      stack: error instanceof Error ? error.stack : 'No stack'
    }, { status: 500 })
  }
}