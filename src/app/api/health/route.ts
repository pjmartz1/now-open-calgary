import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client for health checks
let supabaseAdmin: ReturnType<typeof createClient> | null = null
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        api: 'healthy',
        database: 'healthy',
        calgary_api: 'healthy'
      },
      metrics: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        response_time: 0
      },
      version: process.env.npm_package_version || '1.0.0'
    }

    // Test database connection
    if (supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin
          .from('calgary_businesses')
          .select('id')
          .limit(1)

        if (error) {
          healthStatus.services.database = 'unhealthy'
          healthStatus.status = 'degraded'
        }
      } catch (dbError) {
        healthStatus.services.database = 'unhealthy'
        healthStatus.status = 'unhealthy'
      }
    } else {
      healthStatus.services.database = 'unavailable'
      healthStatus.status = 'degraded'
    }

    // Test Calgary API (quick check)
    try {
      const calgaryApiResponse = await fetch('https://data.calgary.ca/resource/vdjc-pybd.json?$limit=1', {
        method: 'GET',
        signal: AbortSignal.timeout(3000) // 3 second timeout
      })

      if (!calgaryApiResponse.ok) {
        healthStatus.services.calgary_api = 'degraded'
      }
    } catch (apiError) {
      healthStatus.services.calgary_api = 'degraded'
      // Don't fail health check if external API is down
    }

    // Calculate response time
    healthStatus.metrics.response_time = Date.now() - startTime

    // Determine overall status
    const unhealthyServices = Object.values(healthStatus.services).filter(status => status === 'unhealthy')
    const degradedServices = Object.values(healthStatus.services).filter(status => status === 'degraded')

    if (unhealthyServices.length > 0) {
      healthStatus.status = 'unhealthy'
    } else if (degradedServices.length > 0) {
      healthStatus.status = 'degraded'
    }

    const statusCode = healthStatus.status === 'healthy' ? 200 :
                      healthStatus.status === 'degraded' ? 207 : 503

    return NextResponse.json(healthStatus, { status: statusCode })

  } catch (error) {
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: String(error),
      response_time: Date.now() - startTime
    }

    return NextResponse.json(errorResponse, { status: 503 })
  }
}