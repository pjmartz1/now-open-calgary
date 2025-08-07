// Debug endpoint to check Calgary API data
import { NextResponse } from 'next/server'

const CALGARY_API_BASE = 'https://data.calgary.ca/resource/vdjc-pybd.json'

export async function GET() {
  try {
    const url = `${CALGARY_API_BASE}?$limit=3&$order=first_iss_dt DESC`
    
    console.log(`Fetching from: ${url}`)
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NowOpenCalgary/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Calgary API responded with ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      url,
      count: data.length,
      sample: data,
      fields: data.length > 0 ? Object.keys(data[0]) : []
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}