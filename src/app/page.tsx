'use client'

import { useState, useEffect } from "react";
import { MapPin, Clock, Star, ArrowRight, Search, Utensils, ShoppingBag, Briefcase, TrendingUp, Users, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import CalgaryBusinessGrid from "@/components/CalgaryBusinessGrid";
import { BusinessService, BusinessCardData } from "@/services/businessService";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BusinessCardData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [featuredBusinesses, setFeaturedBusinesses] = useState<BusinessCardData[]>([]);

  // Load featured businesses on component mount
  useEffect(() => {
    BusinessService.getCalgaryFeaturedBusinesses(12).then(setFeaturedBusinesses);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await BusinessService.searchBusinesses(searchQuery, 20);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTrendingSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    try {
      const results = await BusinessService.searchBusinesses(query, 20);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10"></div>
        
        {/* Floating Icons Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
            <Utensils className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="absolute top-32 right-20 opacity-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>
            <ShoppingBag className="w-8 h-8 text-pink-600" />
          </div>
          <div className="absolute top-60 left-1/4 opacity-20 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3s' }}>
            <Briefcase className="w-8 h-8 text-purple-600" />
          </div>
          <div className="absolute top-40 right-1/3 opacity-20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-6 mb-6 flex-wrap">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">500+ New Listings</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Trusted by 10,000+ Calgarians</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">Updated Daily</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8">
              <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                New Businesses Calgary
              </span>
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Calgary&apos;s #1 directory for new business openings. Discover the latest restaurants, shops, and services opening their doors in YYC.
            </p>

            {/* Integrated Search */}
            <div className="max-w-2xl mx-auto mb-8">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search new restaurants, shops, services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-32 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg shadow-sm"
                />
                <button 
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-2 top-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-indigo-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </form>
              
              {/* Trending Searches */}
              <div className="flex justify-center items-center gap-2 mt-3 flex-wrap">
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

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="max-w-6xl mx-auto mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Search Results for "{searchQuery}" ({searchResults.length} found)
                  </h2>
                  <CalgaryBusinessGrid businesses={searchResults} />
                  <div className="mt-6 text-center">
                    <button 
                      onClick={() => {
                        setSearchResults([]);
                        setSearchQuery('');
                      }}
                      className="text-indigo-600 hover:text-indigo-800 underline"
                    >
                      Clear search results
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/businesses" className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:from-indigo-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2">
                Discover Today&apos;s Openings
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/businesses" className="border-2 border-indigo-500 text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-all duration-300 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Browse by Neighborhood
              </Link>
            </div>

            {/* Quick Category Access */}
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <Link href="/restaurants" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-lg hover:from-red-100 hover:to-red-200 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                <Utensils className="w-4 h-4" />
                <span className="font-medium">Restaurants</span>
              </Link>
              <Link href="/retail" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                <ShoppingBag className="w-4 h-4" />
                <span className="font-medium">Retail</span>
              </Link>
              <Link href="/services" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                <Briefcase className="w-4 h-4" />
                <span className="font-medium">Services</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Businesses Section */}
      {!searchResults.length && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Featured New Businesses
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the latest and most exciting new businesses opening their doors in Calgary
              </p>
            </div>
            <CalgaryBusinessGrid businesses={featuredBusinesses} />
          </div>
        </section>
      )}

      {/* Schema.org Organization structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Now Open Calgary",
            "url": "https://www.nowopencalgary.ca",
            "logo": "https://www.nowopencalgary.ca/logo.svg",
            "description": "Discover what's new in Calgary! Find the newest businesses, restaurants, shops and services opening their doors. Your complete Calgary business directory for fresh openings.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Calgary",
              "addressRegion": "AB",
              "addressCountry": "CA"
            },
            "areaServed": {
              "@type": "City",
              "name": "Calgary",
              "addressRegion": "AB",
              "addressCountry": "CA"
            },
            "sameAs": [
              "https://www.nowopencalgary.ca"
            ],
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.nowopencalgary.ca/businesses?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
    </div>
  );
}

}



