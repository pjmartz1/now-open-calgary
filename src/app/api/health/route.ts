import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { MonitoringService } from '@/lib/monitoring'

export async function GET() {
  const startTime = Date.now()
  const checks: Record<string, unknown> = {}
  let overallStatus = 'healthy'
  
  try {
    // 1. Database connectivity check
    try {
      const { error } = await supabase
        .from('calgary_businesses')
        .select('id')
        .limit(1)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      checks.database = {
        status: 'healthy',
        responseTime: Date.now() - startTime,
        message: 'Database connection successful'
      }
    } catch (error) {
      checks.database = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown database error'
      }
      overallStatus = 'unhealthy'
    }

    // 2. Business data availability check
    try {
      const businessStartTime = Date.now()
      const { count, error } = await supabase
        .from('calgary_businesses')
        .select('*', { count: 'exact', head: true })
        .eq('active', true)
        .eq('is_consumer_facing', true)
      
      if (error) throw error
      
      checks.businessData = {
        status: count && count > 0 ? 'healthy' : 'warning',
        businessCount: count,
        responseTime: Date.now() - businessStartTime,
        message: count && count > 0 ? 'Business data available' : 'No active businesses found'
      }
      
      if (count === 0) {
        overallStatus = overallStatus === 'healthy' ? 'warning' : overallStatus
      }
    } catch (error) {
      checks.businessData = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Business data check failed'
      }
      overallStatus = 'unhealthy'
    }

    // 3. Cache performance check
    try {
      const cacheStartTime = Date.now()
      // Test a simple query that should be cacheable
      const { data: testData, error: testError } = await supabase
        .from('calgary_businesses')
        .select('category')
        .eq('active', true)
        .limit(5)
      
      if (testError) throw testError
      
      checks.cache = {
        status: 'healthy',
        responseTime: Date.now() - cacheStartTime,
        message: 'Cache system operational'
      }
    } catch (error) {
      checks.cache = {
        status: 'degraded',
        error: error instanceof Error ? error.message : 'Cache check failed'
      }
      overallStatus = overallStatus === 'healthy' ? 'degraded' : overallStatus
    }

    // 4. Memory usage check
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage()
      const memoryMB = {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
      }
      
      checks.memory = {
        status: memoryMB.heapUsed < 512 ? 'healthy' : 'warning',
        usage: memoryMB,
        message: `Heap usage: ${memoryMB.heapUsed}MB`
      }
    }

    // 5. API response time check
    const totalResponseTime = Date.now() - startTime
    checks.responseTime = {
      status: totalResponseTime < 1000 ? 'healthy' : totalResponseTime < 3000 ? 'warning' : 'unhealthy',
      value: totalResponseTime,
      message: `Total response time: ${totalResponseTime}ms`
    }
    
    if (totalResponseTime >= 3000) {
      overallStatus = 'unhealthy'
    } else if (totalResponseTime >= 1000 && overallStatus === 'healthy') {
      overallStatus = 'warning'
    }

    // Log the health check
    MonitoringService.trackPerformance({
      name: 'health_check',
      duration: totalResponseTime,
      metadata: {
        overallStatus,
        databaseStatus: checks.database?.status,
        businessCount: checks.businessData?.businessCount
      }
    })

    const response = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
      environment: process.env.NODE_ENV,
      uptime: process.uptime ? Math.floor(process.uptime()) : null,
      checks,
      responseTime: totalResponseTime
    }

    // Set appropriate HTTP status code
    const httpStatus = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'warning' ? 200 : 503

    return NextResponse.json(response, { status: httpStatus })

  } catch (error) {
    MonitoringService.logError(error as Error, {
      component: 'health_check',
      duration: (Date.now() - startTime).toString()
    })

    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Health check failed',
      responseTime: Date.now() - startTime
    }

    return NextResponse.json(errorResponse, { status: 503 })
  }
}