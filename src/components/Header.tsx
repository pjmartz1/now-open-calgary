'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Search, Utensils, ShoppingBag, Briefcase, Bell, TrendingUp } from 'lucide-react'
import { BusinessService, BusinessCardData } from '@/services/businessService'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<BusinessCardData[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await BusinessService.searchBusinesses(searchQuery, 10)
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleTrendingSearch = async (query: string) => {
    setSearchQuery(query)
    setIsSearching(true)
    try {
      const results = await BusinessService.searchBusinesses(query, 10)
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchResults([])
    setSearchQuery('')
    setIsSearchOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 transition-all duration-300 group-hover:scale-105 group-hover:rotate-1">
              <Image
                src="/logo.svg"
                alt="Now Open Calgary Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight leading-none">
                Now Open
              </div>
              <div className="text-sm font-semibold text-slate-600 tracking-widest uppercase leading-none">
                Calgary
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/restaurants" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Utensils className="w-4 h-4" />
              Restaurants
              <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">12</span>
            </Link>
            <Link href="/retail" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <ShoppingBag className="w-4 h-4" />
              Retail
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">8</span>
            </Link>
            <Link href="/services" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Briefcase className="w-4 h-4" />
              Services
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">6</span>
            </Link>
            <Link href="/businesses" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <TrendingUp className="w-4 h-4" />
              Browse All
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Bell className="w-4 h-4" />
              5 New Today
            </button>
            <button 
              onClick={toggleSearch}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-pink-600 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Search className="w-4 h-4" />
              Search
              <span className="text-xs opacity-75">⌘K</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="hidden md:block border-t border-gray-200 py-4">
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search new restaurants, shops, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                autoFocus
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {isSearching && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                )}
                <button 
                  type="button"
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="max-w-2xl mx-auto mt-4 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">
                    Search Results ({searchResults.length})
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {searchResults.map((business) => (
                    <Link
                      key={business.id}
                      href={`/business/${business.slug}`}
                      className="block p-4 hover:bg-gray-50 transition-colors"
                      onClick={clearSearch}
                    >
                      <div className="font-medium text-gray-900">{business.tradename}</div>
                      <div className="text-sm text-gray-600">{business.address}</div>
                      <div className="text-xs text-gray-500 mt-1">{business.community}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-center items-center gap-2 mt-3">
              <span className="text-sm text-gray-500">Popular:</span>
              <button 
                onClick={() => handleTrendingSearch('new restaurants')}
                className="text-sm text-indigo-600 hover:text-indigo-800 underline"
              >
                new restaurants
              </button>
              <span className="text-gray-300">•</span>
              <button 
                onClick={() => handleTrendingSearch('Beltline')}
                className="text-sm text-indigo-600 hover:text-indigo-800 underline"
              >
                Beltline
              </button>
              <span className="text-gray-300">•</span>
              <button 
                onClick={() => handleTrendingSearch('coffee shops')}
                className="text-sm text-indigo-600 hover:text-indigo-800 underline"
              >
                coffee shops
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-6 space-y-4">
              <Link href="/restaurants" className="flex items-center justify-between p-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Utensils className="w-5 h-5" />
                  Restaurants
                </div>
                <span className="bg-red-100 text-red-700 text-sm px-2 py-1 rounded-full font-semibold">12</span>
              </Link>
              <Link href="/retail" className="flex items-center justify-between p-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5" />
                  Retail
                </div>
                <span className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full font-semibold">8</span>
              </Link>
              <Link href="/services" className="flex items-center justify-between p-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5" />
                  Services
                </div>
                <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-full font-semibold">6</span>
              </Link>
              <Link href="/businesses" className="flex items-center gap-3 p-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <TrendingUp className="w-5 h-5" />
                Browse All Businesses
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <button className="flex items-center gap-3 w-full p-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  5 New Today
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
