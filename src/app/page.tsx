import { MapPin, Clock, Star, ArrowRight, Search, Utensils, ShoppingBag, Briefcase, TrendingUp, Users, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import CalgaryBusinessGrid from "@/components/CalgaryBusinessGrid";
import { BusinessService } from "@/services/businessService";

export default async function Home() {
  // Fetch featured Calgary businesses
  const featuredBusinesses = await BusinessService.getCalgaryFeaturedBusinesses(12);

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
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search new restaurants, shops, services..."
                  className="w-full pl-12 pr-32 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg shadow-sm"
                />
                <button className="absolute right-2 top-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-indigo-600 hover:to-pink-600 transition-all duration-300">
                  Search
                </button>
              </div>
              
              {/* Trending Searches */}
              <div className="flex justify-center items-center gap-2 mt-3 flex-wrap">
                <span className="text-sm text-gray-500">Trending:</span>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 underline">new restaurants</button>
                <span className="text-gray-300">•</span>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 underline">Beltline openings</button>
                <span className="text-gray-300">•</span>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 underline">coffee shops</button>
              </div>
            </div>

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
              <Link href="/businesses" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                <Star className="w-4 h-4" />
                <span className="font-medium">View All</span>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Businesses Section */}
      <section className="py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalgaryBusinessGrid
            businesses={featuredBusinesses}
            title="Latest New Businesses"
            subtitle="Fresh openings from Calgary's vibrant business community"
          />
          
          {featuredBusinesses.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/businesses"
                className="inline-flex items-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
              >
                View All Businesses
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </section>


      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Calgary Chooses Now Open for New Business Discovery
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join 10,000+ Calgarians who rely on us for the freshest business openings, verified addresses, and real-time updates across YYC
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Updates</h3>
              <p className="text-gray-600">Get notified as soon as new businesses open their doors in Calgary</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-pink-50 to-pink-100">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Curated Selection</h3>
              <p className="text-gray-600">Only the best new businesses, carefully selected for quality and innovation</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Focus</h3>
              <p className="text-gray-600">Supporting Calgary&apos;s local economy and discovering hidden gems in your neighborhood</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-500 to-pink-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                      <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Discover What&apos;s New in Calgary?
            </h2>
                      <p className="text-xl text-indigo-100 mb-8">
              Join thousands of Calgarians who are always in the know about the city&apos;s newest businesses
            </p>
          <Link href="/businesses" className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg">
            Start Exploring Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Now Open Calgary</h3>
              <p className="text-gray-400 mb-4">
                Calgary&apos;s premier directory for new business openings. Discover fresh restaurants, trendy shops, and innovative services across YYC.
              </p>
              <p className="text-gray-400 text-sm">
                Serving Calgary, AB | Updated Daily<br />
                500+ Business Listings | 50+ Neighborhoods
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Popular Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/restaurants" className="hover:text-white transition-colors">New Restaurants Calgary</a></li>
                <li><a href="/retail" className="hover:text-white transition-colors">Latest Calgary Shops</a></li>
                <li><a href="/services" className="hover:text-white transition-colors">New Services YYC</a></li>
                <li><a href="/businesses" className="hover:text-white transition-colors">All Business Openings</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Calgary Areas</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/businesses?community=Downtown" className="hover:text-white transition-colors">Downtown Calgary</a></li>
                <li><a href="/businesses?community=Beltline" className="hover:text-white transition-colors">Beltline Businesses</a></li>
                <li><a href="/businesses?community=Kensington" className="hover:text-white transition-colors">Kensington Openings</a></li>
                <li><a href="/businesses?community=Inglewood" className="hover:text-white transition-colors">Inglewood New Spots</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-6 text-sm text-gray-400 mb-4 md:mb-0">
                <a href="#" className="hover:text-white transition-colors">About</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
              <div className="text-sm text-gray-400">
                © 2025 Now Open Calgary. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>

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
