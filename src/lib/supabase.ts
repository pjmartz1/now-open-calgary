import { createClient } from '@supabase/supabase-js'
import type { CalgaryBusiness } from '@/types/business'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Database type definitions for Supabase
export interface Database {
  public: {
    Tables: {
      calgary_businesses: {
        Row: CalgaryBusiness
        Insert: Omit<CalgaryBusiness, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CalgaryBusiness, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}

// Single, properly typed Supabase client to prevent multiple instances
// This fixes the "Multiple GoTrueClient instances detected" warning
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey) 
  : null

// Alias for backward compatibility
export const typedSupabase = supabase
