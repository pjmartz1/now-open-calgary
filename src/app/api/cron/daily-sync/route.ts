import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request from Vercel
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔄 Starting daily Calgary business sync...')

    // Call our existing sync API with API key
    const syncUrl = new URL('/api/sync-businesses', request.url)
    syncUrl.searchParams.set('api_key', process.env.API_SECRET_KEY || '')
    
    const syncResponse = await fetch(syncUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'recent',
        daysBack: 7, // Reduced from 30 to 7 days to prevent timeouts
        limit: 200, // Reduced from 1000 to 200 to stay within Vercel limits
        dryRun: false
      })
    })

    const syncResult = await syncResponse.json()

    if (!syncResult.success) {
      console.error('❌ Daily sync failed:', syncResult.message)
      return NextResponse.json({
        success: false,
        message: 'Daily sync failed',
        error: syncResult.message,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    console.log('✅ Daily sync completed successfully:', syncResult.stats)

    return NextResponse.json({
      success: true,
      message: 'Daily sync completed successfully',
      stats: syncResult.stats,
      timestamp: new Date().toISOString(),
      next_run: 'Tomorrow at 6:00 AM MT'
    })

  } catch (error) {
    console.error('❌ Daily sync cron job failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Daily sync cron job failed',
      error: String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// Also support manual triggers (for testing)
export async function POST(request: NextRequest) {
  console.log('🔄 Manual daily sync triggered...')
  return GET(request)
}