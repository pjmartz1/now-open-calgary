import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { MonitoringService } from '@/lib/monitoring'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Test basic database connectivity
    const { data, error } = await supabase
      .from('calgary_businesses')
      .select('count')
      .limit(1)
    
    if (error) {
      throw new Error(`Database connection failed: ${error.message}`)
    }
    
    // Test query performance
    const queryStartTime = Date.now()
    const { count, error: countError } = await supabase
      .from('calgary_businesses')
      .select('*', { count: 'exact', head: true })
      .eq('active', true)
    
    if (countError) {
      throw new Error(`Database query failed: ${countError.message}`)
    }
    
    const queryTime = Date.now() - queryStartTime
    const totalTime = Date.now() - startTime
    
    // Log performance
    MonitoringService.trackPerformance({
      name: 'database_health_check',
      duration: totalTime,
      metadata: {
        queryTime,
        businessCount: count
      }
    })
    
    const response = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        queryTime: `${queryTime}ms`,
        totalResponseTime: `${totalTime}ms`,
        businessCount: count
      },
      performance: {
        connectionTime: `${totalTime - queryTime}ms`,
        queryExecutionTime: `${queryTime}ms`,
        status: queryTime < 1000 ? 'good' : queryTime < 3000 ? 'slow' : 'critical'
      }
    }
    
    return NextResponse.json(response, { status: 200 })
    
  } catch (error) {
    const totalTime = Date.now() - startTime
    
    MonitoringService.logError(error as Error, {
      component: 'database_health_check',
      duration: totalTime.toString()
    })
    
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown database error'
      },
      responseTime: `${totalTime}ms`
    }
    
    return NextResponse.json(errorResponse, { status: 503 })
  }
}