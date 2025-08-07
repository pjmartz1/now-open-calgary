import { MapPin, Clock, Star, ArrowRight, Search, Utensils, ShoppingBag, Briefcase } from "lucide-react";
import Link from "next/link";
import CalgaryBusinessGrid from "@/components/CalgaryBusinessGrid";
import { BusinessService } from "@/services/businessService";

export default async function Home() {
  // Fetch featured Calgary businesses
  const featuredBusinesses = await BusinessService.getCalgaryFeaturedBusinesses(12);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                Now Open Calgary
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover the newest businesses opening their doors in Calgary. 
              From trendy cafes to innovative startups, find what&apos;s fresh in your city.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/businesses" className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-indigo-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                Explore New Businesses
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/businesses" className="border-2 border-indigo-500 text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition-all duration-300 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Browse by Area
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Find New Businesses in Calgary
            </h2>
            <p className="text-gray-600">
              Search by name, category, or neighborhood to discover what&apos;s new in your area
            </p>
          </div>
          
          <div className="relative max-w-2xl mx-auto mb-8">
            <Link href="/businesses" className="block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for new businesses..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg cursor-pointer"
                  readOnly
                />
              </div>
            </Link>
          </div>

          {/* Quick Category Links */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/restaurants" className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
              <Utensils className="w-4 h-4" />
              <span>Restaurants</span>
            </Link>
            <Link href="/retail" className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
              <ShoppingBag className="w-4 h-4" />
              <span>Retail</span>
            </Link>
            <Link href="/services" className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
              <Briefcase className="w-4 h-4" />
              <span>Services</span>
            </Link>
            <Link href="/businesses" className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
              <Star className="w-4 h-4" />
              <span>View All</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Businesses Section */}
      <section className="py-16 bg-gray-50">
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
              Why Choose Now Open Calgary?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay ahead of the curve with real-time updates on Calgary&apos;s newest business openings
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
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Now Open Calgary</h3>
            <p className="text-gray-400 mb-6">
              Your guide to the newest businesses in Calgary, Alberta
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-400">
              © 2024 Now Open Calgary. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
