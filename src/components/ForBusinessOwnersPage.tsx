import React from 'react';
import { Star, Users, TrendingUp, Shield, CheckCircle, ArrowRight, Crown, Zap } from 'lucide-react';

interface ForBusinessOwnersPageProps {
  onFeatureClick: () => void;
}

export const ForBusinessOwnersPage: React.FC<ForBusinessOwnersPageProps> = ({ onFeatureClick }) => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
          <Star className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Grow Your Calgary Business
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          Get discovered by thousands of Calgary residents looking for new local businesses. 
          Stand out from the competition and drive more customers to your door.
        </p>
        <button 
          onClick={onFeatureClick}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
        >
          <span>Feature Your Business</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Reach New Customers</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Connect with Calgary residents actively looking for new businesses in their community. 
            Get discovered by your ideal customers from day one.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Increase Visibility</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Featured businesses appear first in search results and get special styling 
            that makes them stand out from the competition.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Build Trust</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            All listings are verified through official City of Calgary business licenses, 
            giving customers confidence in your legitimacy.
          </p>
        </div>
      </div>

      {/* Featured Listing Plans */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Featured Listing Plans</h2>
          <p className="text-gray-600">
            Choose the plan that best fits your business goals and budget
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Basic Plan */}
          <div className="bg-white rounded-lg shadow-sm border p-6 relative">
            <div className="text-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Featured</h3>
              <div className="mb-3">
                <span className="text-2xl font-bold text-gray-900">$50</span>
                <span className="text-gray-600">/7 days</span>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                Featured badge on listing
              </li>
              <li className="flex items-center text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                Appears first in search results
              </li>
              <li className="flex items-center text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                7 days of promotion
              </li>
            </ul>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors">
              Get Started
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-red-500 p-6 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Most Popular
              </span>
            </div>

            <div className="text-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Featured</h3>
              <div className="mb-3">
                <span className="text-2xl font-bold text-gray-900">$100</span>
                <span className="text-gray-600">/14 days</span>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                Premium featured badge
              </li>
              <li className="flex items-center text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                Top placement in all searches
              </li>
              <li className="flex items-center text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                Enhanced listing styling
              </li>
              <li className="flex items-center text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                14 days of promotion
              </li>
              <li className="flex items-center text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                Priority customer support
              </li>
            </ul>

            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors">
              Get Started
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-lg shadow-sm border p-6 relative">
            <div className="text-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise Featured</h3>
              <div className="mb-3">
                <span className="text-2xl font-bold text-gray-900">$200</span>
                <span className="text-gray-600">/30 days</span>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                Enterprise featured badge
              </li>
              <li className="flex items-center text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                Guaranteed top 3 placement
              </li>
              <li className="flex items-center text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                Custom listing enhancements
              </li>
              <li className="flex items-center text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                30 days of promotion
              </li>
              <li className="flex items-center text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                Dedicated account manager
              </li>
              <li className="flex items-center text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                Analytics dashboard
              </li>
            </ul>

            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 font-bold text-sm">KC</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Kensington Coffee Roasters</h3>
                <p className="text-sm text-gray-600">Coffee Shop • Kensington</p>
              </div>
            </div>
            <p className="text-gray-600 text-xs italic mb-3">
              "Within our first week of featuring our listing, we had a 40% increase in foot traffic. 
              The investment paid for itself in just three days!"
            </p>
            <div className="text-xs text-gray-500">
              Featured for 14 days • Premium Plan
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-600 font-bold text-sm">ML</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Marda Loop Fitness Studio</h3>
                <p className="text-sm text-gray-600">Fitness • Marda Loop</p>
              </div>
            </div>
            <p className="text-gray-600 text-xs italic mb-3">
              "The featured listing helped us reach our target membership goal 2 months ahead of schedule. 
              Great ROI and excellent customer service!"
            </p>
            <div className="text-xs text-gray-500">
              Featured for 30 days • Enterprise Plan
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">How quickly will my featured listing go live?</h3>
            <p className="text-gray-600 text-sm">
              Featured listings are activated immediately after payment confirmation, typically within 5-10 minutes.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Can I update my business information?</h3>
            <p className="text-gray-600 text-sm">
              Yes! Business owners can claim their listing to add photos, descriptions, hours, and contact information.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">What payment methods do you accept?</h3>
            <p className="text-gray-600 text-sm">
              We accept all major credit cards and debit cards through our secure Stripe payment system.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Can I extend my featured listing?</h3>
            <p className="text-gray-600 text-sm">
              Absolutely! You can extend or upgrade your featured listing at any time before or after it expires.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-red-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-4 max-w-xl mx-auto text-sm">
          Join hundreds of Calgary businesses that have already discovered the power of featured listings. 
          Start driving more customers to your business today.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={onFeatureClick}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors inline-flex items-center justify-center space-x-2 text-sm"
          >
            <Star className="w-5 h-5" />
            <span>Feature Your Business</span>
          </button>
        </div>
      </div>
    </div>
  );
};