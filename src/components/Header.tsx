'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Search, Utensils, ShoppingBag, Briefcase, Bell, TrendingUp, Heart, Music, Car, Sparkles, Dumbbell, ChevronDown } from 'lucide-react'
import { KeyboardEvents, trapFocus, createSkipLink } from '@/lib/keyboard-navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (!isMenuOpen) {
      // Focus will be trapped in mobile menu
      setTimeout(() => {
        const firstLink = mobileMenuRef.current?.querySelector('a')
        firstLink?.focus()
      }, 0)
    } else {
      // Return focus to menu button
      menuButtonRef.current?.focus()
    }
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      // Focus search input when opened
      setTimeout(() => searchInputRef.current?.focus(), 0)
    } else {
      // Return focus to search button when closed
      searchButtonRef.current?.focus()
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    // Navigate to businesses page with search query
    const searchParams = new URLSearchParams({ search: searchQuery.trim() })
    window.location.href = `/businesses?${searchParams.toString()}`
  }


  const clearSearch = () => {
    setSearchQuery('')
    setIsSearchOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 transition-all duration-300 group-hover:scale-105 group-hover:rotate-1">
              <Image
                src="/logo.svg"
                alt="Now Open Calgary Logo"
                fill
                sizes="40px"
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
          <nav className="hidden lg:flex items-center space-x-1">
            <Link href="/restaurants" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              Restaurants
            </Link>
            <Link href="/retail" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              Retail
            </Link>
            <Link href="/services" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              Services
            </Link>
            <Link href="/healthcare" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              Healthcare
            </Link>
            <Link href="/beauty" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              Beauty
            </Link>
            <Link href="/fitness" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              Fitness
            </Link>
            <Link href="/businesses" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              Browse All
            </Link>
          </nav>
          
          {/* Tablet Navigation - Dropdown Menu */}
          <nav className="hidden md:flex lg:hidden items-center space-x-1">
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                Categories
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link href="/restaurants" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Utensils className="w-4 h-4" />
                    Restaurants
                  </Link>
                  <Link href="/retail" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <ShoppingBag className="w-4 h-4" />
                    Retail
                  </Link>
                  <Link href="/services" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Briefcase className="w-4 h-4" />
                    Services
                  </Link>
                  <Link href="/healthcare" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Heart className="w-4 h-4" />
                    Healthcare
                  </Link>
                  <Link href="/beauty" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Sparkles className="w-4 h-4" />
                    Beauty
                  </Link>
                  <Link href="/fitness" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Dumbbell className="w-4 h-4" />
                    Fitness
                  </Link>
                  <Link href="/entertainment" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Music className="w-4 h-4" />
                    Entertainment
                  </Link>
                  <Link href="/automotive" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Car className="w-4 h-4" />
                    Automotive
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/businesses" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <TrendingUp className="w-4 h-4" />
              Browse All
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Bell className="w-4 h-4" />
              New Today
            </button>
            <button 
              ref={searchButtonRef}
              onClick={toggleSearch}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-xl font-bold text-base hover:from-indigo-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
              aria-label="Open search dialog"
            >
              <Search className="w-5 h-5" />
              <span className="hidden lg:inline">Search Businesses</span>
              <span className="lg:hidden">Search</span>
              <span className="text-xs opacity-75 bg-white/20 px-2 py-1 rounded-md">⌘K</span>
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              ref={searchButtonRef}
              onClick={toggleSearch}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-pink-600 transition-all duration-300 shadow-md"
              aria-label="Open search"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Search</span>
            </button>
            <button
              ref={menuButtonRef}
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Enhanced Expandable Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-gray-200 bg-gradient-to-r from-indigo-50 to-pink-50 py-6">
            <div className="max-w-4xl mx-auto px-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-indigo-500 w-6 h-6" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search new restaurants, shops, services, or locations in Calgary..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-32 py-4 text-lg border-2 border-indigo-200 rounded-2xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 shadow-lg bg-white/90 backdrop-blur-sm transition-all duration-300"
                    autoFocus
                    aria-label="Search businesses in Calgary"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
                    <button 
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      aria-label="Submit search"
                    >
                      Search
                    </button>
                    <button 
                      type="button"
                      onClick={clearSearch}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
                      aria-label="Clear search"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Search suggestions/shortcuts */}
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <span className="text-sm text-gray-600">Quick search:</span>
                  {['pizza', 'coffee', 'salon', 'gym', 'clinic'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSearchQuery(term)
                        handleSearch({ preventDefault: () => {} } as React.FormEvent)
                      }}
                      className="px-3 py-1 bg-white/60 hover:bg-white/80 text-gray-700 text-sm rounded-full border border-gray-200 hover:border-indigo-300 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-3">Categories</h3>
                <Link href="/restaurants" className="flex items-center gap-3 p-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Utensils className="w-5 h-5" />
                  Restaurants
                </Link>
                <Link href="/retail" className="flex items-center gap-3 p-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                  Retail
                </Link>
                <Link href="/services" className="flex items-center gap-3 p-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Briefcase className="w-5 h-5" />
                  Services
                </Link>
                <Link href="/healthcare" className="flex items-center gap-3 p-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Heart className="w-5 h-5" />
                  Healthcare
                </Link>
                <Link href="/beauty" className="flex items-center gap-3 p-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Sparkles className="w-5 h-5" />
                  Beauty
                </Link>
                <Link href="/fitness" className="flex items-center gap-3 p-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Dumbbell className="w-5 h-5" />
                  Fitness
                </Link>
                <Link href="/entertainment" className="flex items-center gap-3 p-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Music className="w-5 h-5" />
                  Entertainment
                </Link>
                <Link href="/automotive" className="flex items-center gap-3 p-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Car className="w-5 h-5" />
                  Automotive
                </Link>
              </div>
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button 
                  onClick={() => {
                    setIsMenuOpen(false)
                    setTimeout(() => toggleSearch(), 100)
                  }}
                  className="flex items-center gap-3 w-full p-3 text-base font-medium bg-gradient-to-r from-indigo-600 to-pink-600 text-white hover:from-indigo-700 hover:to-pink-700 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5" />
                  Search Businesses
                </button>
                <Link href="/businesses" className="flex items-center gap-3 p-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <TrendingUp className="w-5 h-5" />
                  Browse All Businesses
                </Link>
                <button className="flex items-center gap-3 w-full p-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  New Today
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
