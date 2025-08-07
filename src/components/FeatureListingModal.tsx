import React, { useState } from 'react';
import { X, Star, Check, CreditCard, Zap, Crown } from 'lucide-react';
import { Business } from '../types/Business';
import { FEATURE_LISTING_OPTIONS, createFeatureListingCheckout, redirectToCheckout } from '../services/stripeService';

interface FeatureListingModalProps {
  business: Business;
  onClose: () => void;
  onSuccess: (businessId: string, featureType: string) => void;
}

export const FeatureListingModal: React.FC<FeatureListingModalProps> = ({
  business,
  onClose,
  onSuccess
}) => {
  const [selectedOption, setSelectedOption] = useState('premium');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'payment' | 'success'>('select');

  const handlePurchase = async () => {
    const option = FEATURE_LISTING_OPTIONS.find(opt => opt.id === selectedOption);
    if (!option) return;

    setLoading(true);
    try {
      const session = await createFeatureListingCheckout(
        business.id,
        selectedOption,
        option.price
      );
      
      await redirectToCheckout(session.id);
      
    } catch (error) {
      console.error('Payment failed:', error);
      setLoading(false);
      alert(`Payment failed: ${error.message}. Please try again.`);
    }
  };

  const getIcon = (optionId: string) => {
    switch (optionId) {
      case 'basic': return <Star className="w-5 h-5" />;
      case 'premium': return <Zap className="w-5 h-5" />;
      case 'enterprise': return <Crown className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getColorClasses = (optionId: string) => {
    switch (optionId) {
      case 'basic': return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'premium': return 'border-red-200 bg-red-50 text-red-700';
      case 'enterprise': return 'border-purple-200 bg-purple-50 text-purple-700';
      default: return 'border-blue-200 bg-blue-50 text-blue-700';
    }
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            {business.business_name} is now featured and will appear at the top of search results.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Feature Your Business</h2>
            <p className="text-sm text-gray-600">{business.business_name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Benefits Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Feature Your Business?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Increased Visibility</h4>
                <p className="text-sm text-gray-600">Appear first in search results and get noticed by more customers</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">More Customers</h4>
                <p className="text-sm text-gray-600">Drive more foot traffic and online engagement to your business</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Stand Out</h4>
                <p className="text-sm text-gray-600">Distinguished styling that makes your business memorable</p>
              </div>
            </div>
          </div>

          {/* Pricing Options */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {FEATURE_LISTING_OPTIONS.map((option) => (
                <div
                  key={option.id}
                  className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    selectedOption === option.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${option.popular ? 'ring-2 ring-red-200' : ''}`}
                  onClick={() => setSelectedOption(option.id)}
                >
                  {option.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${getColorClasses(option.id)}`}>
                      {getIcon(option.id)}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">{option.name}</h4>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-gray-900">${option.price}</span>
                      <span className="text-gray-600">/{option.duration} days</span>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {selectedOption === option.id && (
                    <div className="absolute inset-0 border-2 border-red-500 rounded-xl pointer-events-none">
                      <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Button */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Purchase ${FEATURE_LISTING_OPTIONS.find(opt => opt.id === selectedOption)?.price}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};