import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client for database health checks
let supabaseAdmin: ReturnType<typeof createClient> | null = null
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    if (!supabaseAdmin) {
      return NextResponse.json({
        status: 'unhealthy',
        message: 'Database connection not configured',
        timestamp: new Date().toISOString(),
        response_time: Date.now() - startTime
      }, { status: 503 })
    }

    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabaseAdmin
      .from('calgary_businesses')
      .select('id')
      .limit(1)

    if (connectionError) {
      return NextResponse.json({
        status: 'unhealthy',
        message: 'Database connection failed',
        error: connectionError.message,
        timestamp: new Date().toISOString(),
        response_time: Date.now() - startTime
      }, { status: 503 })
    }

    // Get database statistics
    const { count: totalBusinesses } = await supabaseAdmin
      .from('calgary_businesses')
      .select('*', { count: 'exact', head: true })

    const { count: activeBusinesses } = await supabaseAdmin
      .from('calgary_businesses')
      .select('*', { count: 'exact', head: true })
      .eq('active', true)

    const { count: recentBusinesses } = await supabaseAdmin
      .from('calgary_businesses')
      .select('*', { count: 'exact', head: true })
      .gte('first_issued_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])

    const responseTime = Date.now() - startTime

    return NextResponse.json({
      status: 'healthy',
      message: 'Database connection healthy',
      timestamp: new Date().toISOString(),
      response_time: responseTime,
      statistics: {
        total_businesses: totalBusinesses,
        active_businesses: activeBusinesses,
        recent_businesses_7_days: recentBusinesses
      },
      performance: {
        query_time: responseTime < 1000 ? 'good' : responseTime < 3000 ? 'acceptable' : 'slow',
        connection: 'healthy'
      }
    })

  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      message: 'Database health check failed',
      error: String(error),
      timestamp: new Date().toISOString(),
      response_time: Date.now() - startTime
    }, { status: 503 })
  }
}