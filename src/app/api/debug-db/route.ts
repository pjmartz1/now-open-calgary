import { NextResponse } from 'next/server'
import { typedSupabase } from '@/lib/supabase'

export async function GET() {
  try {
    if (!typedSupabase) {
      return NextResponse.json({ 
        error: 'Supabase not available',
        message: 'Environment variables not configured properly'
      }, { status: 500 })
    }

    // Start with basic total count
    const { count: totalCount, error: totalError } = await typedSupabase
      .from('calgary_businesses')
      .select('*', { count: 'exact', head: true })

    if (totalError) {
      return NextResponse.json({ 
        error: `Total count failed: ${totalError.message}`,
        details: totalError 
      }, { status: 500 })
    }

    // Get sample records first to see what data looks like
    const { data: sampleData, error: sampleError } = await typedSupabase
      .from('calgary_businesses')
      .select('tradename, is_consumer_facing, active, category, first_issued_date')
      .limit(5)

    if (sampleError) {
      return NextResponse.json({ 
        error: `Sample data failed: ${sampleError.message}`,
        total_records: totalCount,
        details: sampleError 
      }, { status: 500 })
    }

    // Try to get filtered counts
    let consumerFacingCount = null
    let activeCount = null
    let bothFiltersCount = null

    try {
      const { count: cfCount } = await typedSupabase
        .from('calgary_businesses')
        .select('*', { count: 'exact', head: true })
        .eq('is_consumer_facing', true)
      consumerFacingCount = cfCount
    } catch (e) {
      console.error('Consumer facing count failed:', e)
    }

    try {
      const { count: aCount } = await typedSupabase
        .from('calgary_businesses')
        .select('*', { count: 'exact', head: true })
        .eq('active', true)
      activeCount = aCount
    } catch (e) {
      console.error('Active count failed:', e)
    }

    try {
      const { count: bfCount } = await typedSupabase
        .from('calgary_businesses')
        .select('*', { count: 'exact', head: true })
        .eq('is_consumer_facing', true)
        .eq('active', true)
      bothFiltersCount = bfCount
    } catch (e) {
      console.error('Both filters count failed:', e)
    }

    return NextResponse.json({
      success: true,
      total_records: totalCount,
      is_consumer_facing_true: consumerFacingCount,
      active_true: activeCount,
      both_filters_true: bothFiltersCount,
      sample_records: sampleData,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Debug DB error:', error)
    return NextResponse.json({ 
      error: `Database debug failed: ${error}`,
      message: String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}