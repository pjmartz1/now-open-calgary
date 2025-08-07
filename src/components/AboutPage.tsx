
import { MapPin, Users, TrendingUp, Shield, Heart, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
          <MapPin className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          About Now Open Calgary
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We're passionate about connecting Calgarians with new local businesses, 
          helping our community discover amazing places while supporting entrepreneurs 
          who make our city vibrant.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Calgary is home to incredible entrepreneurs who bring fresh ideas, unique services, 
          and innovative products to our communities. Our mission is to bridge the gap between 
          these new businesses and the residents who would love to discover them.
        </p>
        <p className="text-gray-600 leading-relaxed">
          By automatically tracking new business licenses from the City of Calgary, we ensure 
          you never miss out on the latest coffee shop, boutique, restaurant, or service 
          opening in your neighborhood.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Real-Time Updates</h3>
          <p className="text-gray-600 text-sm">
            Automatically updated daily with new business licenses from the City of Calgary
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Community Focused</h3>
          <p className="text-gray-600 text-sm">
            Filter by your neighborhood to discover businesses right in your community
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Verified Information</h3>
          <p className="text-gray-600 text-sm">
            All business information comes directly from official City of Calgary records
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <Heart className="w-6 h-6 text-red-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Our Story</h2>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          As longtime Calgary residents, we noticed how often amazing new businesses would 
          open in our neighborhoods without us even knowing. A fantastic new restaurant 
          would be operating for months before we'd discover it by chance.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          We realized that while the City of Calgary publishes all new business licenses, 
          this information wasn't easily accessible to residents who wanted to support 
          local entrepreneurs from day one.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed">
          That's when we created "Who's New in Calgary" - to make discovering and supporting 
          new local businesses as easy as browsing your favorite social media feed.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">500+</div>
          <div className="text-sm text-gray-600">New Businesses Tracked</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">17</div>
          <div className="text-sm text-gray-600">Calgary Communities</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">Daily</div>
          <div className="text-sm text-gray-600">Database Updates</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">Free</div>
          <div className="text-sm text-gray-600">For All Residents</div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Award className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Supporting Local</h3>
              <p className="text-gray-600 text-sm">
                We believe in the power of local businesses to create jobs, build community, 
                and make Calgary unique.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Users className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Community First</h3>
              <p className="text-gray-600 text-sm">
                Every feature we build is designed to strengthen connections between 
                businesses and their neighbors.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Transparency</h3>
              <p className="text-gray-600 text-sm">
                All our data comes from public records, and we're open about how 
                our platform works.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Innovation</h3>
              <p className="text-gray-600 text-sm">
                We're constantly improving our platform to better serve both 
                businesses and residents.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="text-center bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Get in Touch</h2>
        <p className="text-gray-600 mb-4 text-sm">
          Have questions, suggestions, or want to partner with us? We'd love to hear from you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a 
            href="#" 
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            Follow on Twitter
          </a>
        </div>
      </div>
    </div>
  );
};