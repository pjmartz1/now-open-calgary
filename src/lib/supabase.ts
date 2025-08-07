import { createClient } from '@supabase/supabase-js'
import type { CalgaryBusiness } from '@/types/business'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database type definitions for Supabase
export interface Database {
  public: {
    Tables: {
      calgary_businesses: {
        Row: CalgaryBusiness
        Insert: Omit<CalgaryBusiness, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CalgaryBusiness, 'id' | 'created_at' | 'updated_at'>>
      }
      businesses: {
        Row: Business
        Insert: Omit<Business, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Business, 'id' | 'created_at' | 'updated_at'>>
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at'>>
      }
      neighborhoods: {
        Row: Neighborhood
        Insert: Omit<Neighborhood, 'id' | 'created_at'>
        Update: Partial<Omit<Neighborhood, 'id' | 'created_at'>>
      }
    }
  }
}

// Typed Supabase client
export const typedSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface Business {
  id: string
  name: string
  slug: string
  description: string
  category: string
  address: string
  city: string
  province: string
  postal_code: string
  phone: string
  website: string
  email: string
  opening_date: string
  hours: string
  features: string[]
  images: string[]
  latitude: number
  longitude: number
  neighborhood: string
  verified: boolean
  featured: boolean
  created_at: string
  updated_at: string
  meta_title: string
  meta_description: string
  meta_keywords: string[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  created_at: string
}

export interface Neighborhood {
  id: string
  name: string
  slug: string
  description: string
  created_at: string
}
