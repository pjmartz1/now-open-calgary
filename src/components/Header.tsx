'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Search, Utensils, ShoppingBag, Briefcase, Bell, TrendingUp, Heart, Music, Car, Sparkles, Dumbbell, ChevronDown } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

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
            <Link href="/restaurants" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Utensils className="w-4 h-4" />
              Restaurants
            </Link>
            <Link href="/retail" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <ShoppingBag className="w-4 h-4" />
              Retail
            </Link>
            <Link href="/services" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Briefcase className="w-4 h-4" />
              Services
            </Link>
            <Link href="/healthcare" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Heart className="w-4 h-4" />
              Healthcare
            </Link>
            <Link href="/beauty" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Sparkles className="w-4 h-4" />
              Beauty
            </Link>
            <Link href="/fitness" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Dumbbell className="w-4 h-4" />
              Fitness
            </Link>
            <Link href="/businesses" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <TrendingUp className="w-4 h-4" />
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
          <div className="hidden md:flex items-center space-x-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Bell className="w-4 h-4" />
              New Today
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
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
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
                <button 
                  type="button"
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>
            
            
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
              <div className="pt-4 border-t border-gray-200">
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
