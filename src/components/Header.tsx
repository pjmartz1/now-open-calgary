'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Search, Utensils, ShoppingBag, Briefcase, Bell, TrendingUp } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

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
            <Link 
              href="/restaurants" 
              className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-red-600 hover:bg-red-50 font-medium transition-all duration-300 rounded-lg group"
            >
              <Utensils className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Restaurants</span>
              <div className="ml-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">12</div>
            </Link>
            <Link 
              href="/retail" 
              className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-300 rounded-lg group"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Retail</span>
              <div className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">8</div>
            </Link>
            <Link 
              href="/services" 
              className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-300 rounded-lg group"
            >
              <Briefcase className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Services</span>
              <div className="ml-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">6</div>
            </Link>
            <Link 
              href="/businesses" 
              className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition-all duration-300 rounded-lg group"
            >
              <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Browse All</span>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* New Today Badge */}
            <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-indigo-50 to-pink-50 rounded-full border border-indigo-200">
              <Bell className="w-3 h-3 text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-700">5 New Today</span>
            </div>

            {/* Search Button */}
            <button 
              onClick={toggleSearch}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
              <kbd className="hidden lg:inline-block ml-2 px-1.5 py-0.5 text-xs bg-white/20 rounded border border-white/20">⌘K</kbd>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-pink-600 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="hidden md:block border-t border-gray-200 py-4">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search new restaurants, shops, services..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                autoFocus
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <button 
                  onClick={toggleSearch}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex justify-center items-center gap-2 mt-3">
              <span className="text-sm text-gray-500">Popular:</span>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 underline">new restaurants</button>
              <span className="text-gray-300">•</span>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 underline">Beltline</button>
              <span className="text-gray-300">•</span>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 underline">coffee shops</button>
            </div>
          </div>
        )}

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-2 pt-4 pb-3 space-y-2">
              {/* New Today Badge - Mobile */}
              <div className="flex items-center justify-center space-x-1 px-3 py-2 bg-gradient-to-r from-indigo-50 to-pink-50 rounded-lg border border-indigo-200 mb-3">
                <Bell className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-700">5 New Businesses Today</span>
              </div>

              <Link
                href="/restaurants"
                className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Utensils className="w-5 h-5" />
                <span>Restaurants</span>
                <div className="ml-auto px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">12 New</div>
              </Link>
              <Link
                href="/retail"
                className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Retail</span>
                <div className="ml-auto px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">8 New</div>
              </Link>
              <Link
                href="/services"
                className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Briefcase className="w-5 h-5" />
                <span>Services</span>
                <div className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">6 New</div>
              </Link>
              <Link
                href="/businesses"
                className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Browse All Categories</span>
              </Link>
              
              {/* Mobile Search */}
              <div className="pt-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search businesses..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
