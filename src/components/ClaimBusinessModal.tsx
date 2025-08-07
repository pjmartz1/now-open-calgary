import { useState } from 'react';
import { X, Building2, Phone, Globe, Mail, User, MapPin } from 'lucide-react';
import { Business } from '../types/Business';

interface ClaimFormData {
  ownerName: string;
  email: string;
  phone: string;
  website: string;
  description: string;
  verificationMethod: 'phone' | 'email';
  agreeToTerms: boolean;
}

interface ClaimData {
  businessId: string;
  ownerName: string;
  email: string;
  phone: string;
  website: string;
  description: string;
  verificationMethod: 'phone' | 'email';
  submittedAt: string;
}

interface ClaimBusinessModalProps {
  business: Business;
  onClose: () => void;
  onSubmit: (claimData: ClaimData) => void;
}

export const ClaimBusinessModal: React.FC<ClaimBusinessModalProps> = ({
  business,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<ClaimFormData>({
    ownerName: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    verificationMethod: 'phone',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSubmit({
        businessId: business.id,
        ...formData,
        submittedAt: new Date().toISOString()
      });
      alert('Claim submitted successfully! We\'ll review your request within 24 hours.');
      onClose();
    } catch {
      alert('Failed to submit claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof ClaimFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Claim Your Business</h2>
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
        <form onSubmit={handleSubmit} className="p-6">
          {/* Business Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">{business.business_name}</h3>
                <p className="text-sm text-gray-600">{business.business_type}</p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {business.address}, {business.community}
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits of Claiming</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Update your business information and contact details
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Add photos, description, and business hours
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Respond to customer reviews and messages
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Access analytics and insights about your listing
              </li>
            </ul>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Your Name *
              </label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => updateFormData('ownerName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="(403) 555-0123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Website (Optional)
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => updateFormData('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="https://yourbusiness.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Tell customers about your business..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="verification"
                    value="phone"
                    checked={formData.verificationMethod === 'phone'}
                    onChange={(e) => updateFormData('verificationMethod', e.target.value as ClaimFormData['verificationMethod'])}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Phone verification (recommended)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="verification"
                    value="email"
                    checked={formData.verificationMethod === 'email'}
                    onChange={(e) => updateFormData('verificationMethod', e.target.value as ClaimFormData['verificationMethod'])}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email verification</span>
                </label>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="mb-6">
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
                className="mt-1 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-600">
                I confirm that I am authorized to claim this business and agree to the{' '}
                <a href="#" className="text-red-600 hover:text-red-700">Terms of Service</a> and{' '}
                <a href="#" className="text-red-600 hover:text-red-700">Privacy Policy</a>.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.agreeToTerms}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Claim</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};