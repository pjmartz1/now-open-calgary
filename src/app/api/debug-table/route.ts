import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Supabase not available',
        env_vars: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'
        }
      }, { status: 500 })
    }

    // Test basic connection first
    const { data, error } = await supabase
      .from('calgary_businesses')
      .select('*')
      .limit(1)

    if (error) {
      return NextResponse.json({ 
        error: `Query failed: ${error.message}`,
        code: error.code,
        details: error,
        hint: error.hint
      }, { status: 500 })
    }

    // If we got here, connection works
    return NextResponse.json({
      success: true,
      connection: 'OK',
      sample_record: data?.[0] || null,
      table_exists: data !== null,
      message: 'Basic Supabase connection test successful'
    })

  } catch (error) {
    return NextResponse.json({ 
      error: `Exception: ${error}`,
      message: String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    }, { status: 500 })
  }
}