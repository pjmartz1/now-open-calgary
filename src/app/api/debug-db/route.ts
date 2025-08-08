import { NextResponse } from 'next/server'
import { typedSupabase } from '@/lib/supabase'

export async function GET() {
  try {
    if (!typedSupabase) {
      return NextResponse.json({ error: 'Supabase not available' }, { status: 500 })
    }

    // Get total count
    const { data: totalData, error: totalError, count: totalCount } = await typedSupabase
      .from('calgary_businesses')
      .select('*', { count: 'exact', head: true })

    if (totalError) {
      return NextResponse.json({ error: totalError.message }, { status: 500 })
    }

    // Get count by is_consumer_facing
    const { count: consumerFacingCount } = await typedSupabase
      .from('calgary_businesses')
      .select('*', { count: 'exact', head: true })
      .eq('is_consumer_facing', true)

    // Get count by active
    const { count: activeCount } = await typedSupabase
      .from('calgary_businesses')
      .select('*', { count: 'exact', head: true })
      .eq('active', true)

    // Get count by both filters
    const { count: bothFiltersCount } = await typedSupabase
      .from('calgary_businesses')
      .select('*', { count: 'exact', head: true })
      .eq('is_consumer_facing', true)
      .eq('active', true)

    // Get sample records to see actual values
    const { data: sampleData } = await typedSupabase
      .from('calgary_businesses')
      .select('tradename, is_consumer_facing, active, category')
      .limit(5)

    return NextResponse.json({
      success: true,
      total_records: totalCount,
      is_consumer_facing_true: consumerFacingCount,
      active_true: activeCount,
      both_filters_true: bothFiltersCount,
      sample_records: sampleData
    })

  } catch (error) {
    return NextResponse.json({ 
      error: `Database debug failed: ${error}` 
    }, { status: 500 })
  }
}