import { NextResponse } from 'next/server'
import { BusinessService } from '@/services/businessService'

export async function GET() {
  try {
    console.log('Testing business service...')
    
    const businesses = await BusinessService.getCalgaryFeaturedBusinesses(5)
    
    console.log('Fetched businesses:', businesses.length)
    
    return NextResponse.json({
      success: true,
      count: businesses.length,
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
      error: String(error)
    }, { status: 500 })
  }
}