import { Metadata } from 'next'
import { MapPin, TrendingUp, Clock, Users, CheckCircle, Database, Shield, Zap } from 'lucide-react'
import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Now Open Calgary | Your Trusted Calgary Business Discovery Platform',
  description: 'Learn about Now Open Calgary - the premier platform for discovering new businesses in YYC. Real-time data from Calgary business licenses. Find new restaurants, shops & services before they become popular.',
  keywords: ['about now open calgary', 'calgary business directory', 'new businesses calgary discovery', 'calgary business platform', 'YYC business directory', 'calgary business license data', 'local business discovery calgary'],
  openGraph: {
    title: 'About Now Open Calgary | Your Trusted Calgary Business Discovery Platform',
    description: 'Learn about Now Open Calgary - the premier platform for discovering new businesses in YYC. Real-time data from Calgary business licenses.',
    type: 'website',
    url: 'https://www.nowopencalgary.ca/about',
    siteName: 'Now Open Calgary'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Now Open Calgary | Your Trusted Calgary Business Discovery Platform',
    description: 'Learn about Now Open Calgary - the premier platform for discovering new businesses in YYC. Real-time data from Calgary business licenses.'
  },
  alternates: {
    canonical: 'https://www.nowopencalgary.ca/about'
  }
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs items={[
            { label: 'About', current: true }
          ]} />
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              About Now Open Calgary
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
              Your trusted source for discovering Calgary&apos;s newest businesses before they become the next big thing. We turn official city data into your competitive advantage.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-indigo-100">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Database className="w-5 h-5 mr-2" />
                <span>Real-time Calgary Data</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Users className="w-5 h-5 mr-2" />
                <span>2,100+ Businesses Tracked</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Clock className="w-5 h-5 mr-2" />
                <span>Updated Daily</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Mission */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 mx-auto"></div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Calgary&apos;s business scene is exploding with innovation and opportunity. Every week, dozens of new restaurants, shops, and services open their doors across YYC. But here&apos;s the challenge: by the time most people discover these hidden gems, they&apos;re already crowded and the &quot;insider&quot; experience is gone.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              <strong className="text-gray-900">Now Open Calgary</strong> solves this problem by giving you exclusive early access to Calgary&apos;s newest businesses. We transform official Calgary business license data into actionable intelligence, helping you discover amazing new spots before they hit the mainstream.
            </p>
          </div>
        </section>

        {/* How We Work */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How We Work
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-Time Data Collection</h3>
              <p className="text-gray-600">
                We continuously monitor Calgary&apos;s official business license database, capturing new registrations the moment they&apos;re issued.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Intelligent Processing</h3>
              <p className="text-gray-600">
                Our system automatically categorizes, verifies, and enriches business data with location details and operating information.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Curated Discovery</h3>
              <p className="text-gray-600">
                We present the most exciting new openings in an easy-to-browse format, helping you find exactly what you&apos;re looking for.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Now Open Calgary
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 mx-auto"></div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Official Data Source</h4>
                    <p className="text-gray-600">All our information comes directly from Calgary&apos;s official business license database, ensuring 100% accuracy.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Daily Updates</h4>
                    <p className="text-gray-600">New businesses are added to our platform within hours of receiving their Calgary business license.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Local Focus</h4>
                    <p className="text-gray-600">We&apos;re exclusively focused on Calgary, giving you deeper insights into YYC&apos;s business ecosystem.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-orange-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Community Driven</h4>
                    <p className="text-gray-600">Built by Calgarians, for Calgarians. We understand what makes our city&apos;s business scene unique.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <Shield className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Privacy Focused</h4>
                    <p className="text-gray-600">We only display publicly available business information. No personal data or private details.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-pink-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Early Access</h4>
                    <p className="text-gray-600">Discover new businesses before they appear on other platforms or become widely known.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-2xl p-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our Commitment to Calgary
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                Calgary is one of Canada&apos;s most dynamic business environments. From innovative tech startups in the Beltline to family-owned restaurants in Kensington, new businesses are constantly reshaping our city&apos;s landscape. We&apos;re committed to supporting this growth by connecting Calgarians with the businesses that matter most to them.
              </p>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Whether you&apos;re looking for the city&apos;s newest Korean BBQ spot, a cutting-edge fitness studio, or a boutique shop with unique finds, Now Open Calgary is your insider guide to YYC&apos;s evolving business scene.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Ready to Discover Calgary&apos;s Hidden Gems?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of Calgarians who use Now Open Calgary to stay ahead of the curve and discover amazing new businesses before everyone else.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/businesses"
                className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-indigo-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explore New Businesses
              </Link>
              <Link
                href="/restaurants"
                className="bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:shadow-md transition-all duration-300"
              >
                Browse Restaurants
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Now Open Calgary",
            "description": "Learn about Now Open Calgary - the premier platform for discovering new businesses in Calgary. Real-time data from Calgary business licenses.",
            "url": "https://www.nowopencalgary.ca/about",
            "mainEntity": {
              "@type": "Organization",
              "name": "Now Open Calgary",
              "url": "https://www.nowopencalgary.ca",
              "logo": "https://www.nowopencalgary.ca/logo.svg",
              "description": "Now Open Calgary is the premier platform for discovering new businesses opening in Calgary, Alberta. We provide real-time access to newly licensed businesses before they become widely known.",
              "foundingDate": "2024",
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
              "knowsAbout": [
                "Calgary business directory",
                "New restaurant openings Calgary",
                "Calgary retail businesses",
                "YYC business licenses",
                "Calgary business discovery",
                "New businesses Calgary 2025"
              ],
              "slogan": "Discover Calgary's newest businesses before they become the next big thing",
              "mission": "To help Calgarians discover amazing new businesses before they hit the mainstream by providing early access to official Calgary business license data."
            }
          })
        }}
      />
    </div>
  )
}