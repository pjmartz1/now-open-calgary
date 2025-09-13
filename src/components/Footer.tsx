import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.svg"
                  alt="Now Open Calgary Logo"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Now Open
                </div>
                <div className="text-sm text-gray-400">Calgary</div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted source for discovering new businesses opening in Calgary. We help you find the latest restaurants, shops, services, and more before they become the talk of the town.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/restaurants" className="text-gray-400 hover:text-white transition-colors">
                  New Restaurants
                </Link>
              </li>
              <li>
                <Link href="/retail" className="text-gray-400 hover:text-white transition-colors">
                  New Retail Stores
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                  New Services
                </Link>
              </li>
              <li>
                <Link href="/healthcare" className="text-gray-400 hover:text-white transition-colors">
                  Healthcare Providers
                </Link>
              </li>
              <li>
                <Link href="/beauty" className="text-gray-400 hover:text-white transition-colors">
                  Beauty & Wellness
                </Link>
              </li>
              <li>
                <Link href="/fitness" className="text-gray-400 hover:text-white transition-colors">
                  Fitness Centers
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/businesses" className="text-gray-400 hover:text-white transition-colors">
                  Browse All Businesses
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
            
            {/* Location & Update Info */}
            <div className="mt-8">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Calgary, Alberta, Canada</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-400">Updated Daily</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} Now Open Calgary. All rights reserved. Made with ❤️ for YYC.
            </div>
            
            {/* Trust Badges */}
            <div className="flex items-center space-x-6 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3" />
                <span>Updated Daily</span>
              </div>
              <div>6,968+ Businesses Listed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Local SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Now Open Calgary",
            "description": "Calgary's premier business directory for new restaurant, retail, and service openings",
            "url": "https://www.nowopencalgary.ca",
            "logo": "https://www.nowopencalgary.ca/logo.svg",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Calgary",
              "addressRegion": "AB",
              "addressCountry": "CA"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Service",
              "email": "info@nowopencalgary.ca"
            },
            "sameAs": [
              "https://facebook.com/nowopencalgary",
              "https://twitter.com/nowopencalgary", 
              "https://instagram.com/nowopencalgary"
            ],
            "areaServed": {
              "@type": "City",
              "name": "Calgary",
              "addressRegion": "AB",
              "addressCountry": "CA"
            }
          })
        }}
      />
    </footer>
  )
}