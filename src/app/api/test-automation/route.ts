import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing automation setup...')

    // Test the daily sync endpoint (without auth check)
    const dailySyncUrl = new URL('/api/cron/daily-sync', request.url)
    
    const response = await fetch(dailySyncUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: 'Automation test completed',
      automation_result: result,
      cron_schedule: '0 13 * * * (Daily at 1:00 PM UTC / 6:00 AM MST)',
      next_steps: [
        '1. Add CRON_SECRET environment variable in Vercel',
        '2. Automation will run daily at 6 AM Calgary time',
        '3. Check /api/cron/daily-sync endpoint for logs'
      ],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Automation test failed',
      error: String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}