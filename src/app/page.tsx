'use client'

import { useState, useEffect } from "react";
import { MapPin, ArrowRight, Utensils, ShoppingBag, Briefcase, TrendingUp, Users, CheckCircle, Sparkles, Heart, Music, Car, Dumbbell } from "lucide-react";
import Link from "next/link";
import CalgaryBusinessGrid from "@/components/CalgaryBusinessGrid";
import { BusinessService, BusinessCardData } from "@/services/businessService";

export default function Home() {
  const [featuredBusinesses, setFeaturedBusinesses] = useState<BusinessCardData[]>([]);

  // Load featured businesses on component mount
  useEffect(() => {
    BusinessService.getCalgaryFeaturedBusinesses(12).then(setFeaturedBusinesses);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10"></div>
        
        {/* Floating Icons Animation - Hidden on mobile */}
        <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="text-center">
            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-6 mb-8 flex-wrap">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Live Calgary Data</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-xs md:text-sm font-medium text-gray-700">2,100+ Businesses Listed</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-4 h-4 text-indigo-600" />
                <span className="text-xs md:text-sm font-medium text-gray-700">New Spots Added Daily</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Never Miss Calgary&apos;s Hottest New Spots Again
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 md:mb-10 max-w-4xl mx-auto leading-relaxed">
              Get exclusive early access to YYC&apos;s most exciting restaurant openings, unique shops, and hidden gems - all before they&apos;re discovered by the crowds.
            </p>


            {/* Enhanced CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/businesses" className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-indigo-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 group">
                Show Me What&apos;s New Near Me
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/businesses" className="bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 px-6 py-4 rounded-xl font-medium text-lg hover:bg-white hover:shadow-md transition-all duration-300 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Explore My Neighborhood
              </Link>
            </div>

            {/* Quick Category Access */}
            <div role="region" aria-label="Business categories" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap gap-3 justify-center max-w-4xl mx-auto">
              <Link href="/restaurants" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 text-red-800 rounded-lg hover:from-red-100 hover:to-orange-100 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                <Utensils className="w-4 h-4" />
                <span className="font-medium">Restaurants</span>
              </Link>
              <Link href="/retail" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 rounded-lg hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                <ShoppingBag className="w-4 h-4" />
                <span className="font-medium">Retail</span>
              </Link>
              <Link href="/services" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                <Briefcase className="w-4 h-4" />
                <span className="font-medium">Services</span>
              </Link>
              <Link href="/healthcare" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-800 rounded-lg hover:from-purple-100 hover:to-violet-100 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                <Heart className="w-4 h-4" />
                <span className="font-medium">Healthcare</span>
              </Link>
              <Link href="/beauty" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-50 to-rose-50 text-pink-800 rounded-lg hover:from-pink-100 hover:to-rose-100 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Beauty</span>
              </Link>
              <Link href="/fitness" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-800 rounded-lg hover:from-orange-100 hover:to-amber-100 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                <Dumbbell className="w-4 h-4" />
                <span className="font-medium">Fitness</span>
              </Link>
              <Link href="/entertainment" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-900 rounded-lg hover:from-amber-100 hover:to-yellow-100 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                <Music className="w-4 h-4" />
                <span className="font-medium">Entertainment</span>
              </Link>
              <Link href="/automotive" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-50 to-gray-50 text-slate-800 rounded-lg hover:from-slate-100 hover:to-gray-100 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                <Car className="w-4 h-4" />
                <span className="font-medium">Automotive</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Businesses Section */}
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