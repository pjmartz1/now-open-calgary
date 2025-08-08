import { NextResponse } from 'next/server'
import { typedSupabase } from '@/lib/supabase'

export async function GET() {
  try {
    if (!typedSupabase) {
      return NextResponse.json({ 
        error: 'Supabase not available'
      }, { status: 500 })
    }

    // Get raw data without ANY filters
    const { data: rawData, error, count } = await typedSupabase
      .from('calgary_businesses')
      .select('*', { count: 'exact' })
      .limit(10)

    if (error) {
      return NextResponse.json({ 
        error: `Raw data query failed: ${error.message}`,
        details: error 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      total_count: count,
      showing: rawData?.length || 0,
      raw_data: rawData,
      message: 'Raw data from calgary_businesses table (no filters applied)'
    })

  } catch (error) {
    return NextResponse.json({ 
      error: `Exception: ${error}`,
      message: String(error)
    }, { status: 500 })
  }
}