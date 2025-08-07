import { NextResponse } from 'next/server'
import { BusinessService } from '@/services/businessService'

interface Props {
  params: Promise<{ slug: string }>
}

export async function GET(request: Request, { params }: Props) {
  try {
    const { slug } = await params
    console.log('Testing business lookup for slug:', slug)
    
    const business = await BusinessService.getCalgaryBusinessBySlug(slug)
    
    if (!business) {
      return NextResponse.json({
        success: false,
        message: 'Business not found',
        slug
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      business: {
        id: business.id,
        tradename: business.tradename,
        slug: business.slug,
        address: business.address,
        community: business.community,
        license_type: business.license_type,
        first_issued_date: business.first_issued_date,
        category: business.category,
        calgary_id: business.calgary_id
      }
    })
  } catch (error) {
    console.error('Error in test-business API:', error)
    return NextResponse.json({
      success: false,
      error: String(error),
      message: 'Internal server error'
    }, { status: 500 })
  }
}