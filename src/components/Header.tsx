'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, MapPin, Search } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.svg"
                alt="Now Open Calgary Logo"
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-200"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-gray-900">Now Open</div>
              <div className="text-sm font-semibold text-pink-600">Calgary</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/restaurants" 
              className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200"
            >
              Restaurants
            </Link>
            <Link 
              href="/retail" 
              className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200"
            >
              Retail
            </Link>
            <Link 
              href="/services" 
              className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200"
            >
              Services
            </Link>
            <Link 
              href="/businesses" 
              className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200"
            >
              Browse All
            </Link>
          </nav>

          {/* Search Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/businesses" 
              className="flex items-center space-x-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Link>
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/restaurants"
                className="block px-3 py-2 text-gray-700 hover:text-pink-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Restaurants
              </Link>
              <Link
                href="/retail"
                className="block px-3 py-2 text-gray-700 hover:text-pink-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Retail
              </Link>
              <Link
                href="/services"
                className="block px-3 py-2 text-gray-700 hover:text-pink-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/businesses"
                className="block px-3 py-2 text-gray-700 hover:text-pink-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse All
              </Link>
              <div className="pt-2">
                <Link
                  href="/businesses"
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Search className="w-4 h-4" />
                  <span>Search Businesses</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
