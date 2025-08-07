import React from 'react';
import { Shield, Mail, Calendar } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Privacy Policy
        </h1>
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Effective Date: August 7, 2025</span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-6">
            Now Open Calgary ("we," "our," "us") operates https://nowopencalgary.com (the "Site"). 
            This Privacy Policy explains how we collect, use, and protect your information when you use our Site.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
          <div className="mb-6">
            <p className="text-gray-700 mb-3">
              <strong>Automatically:</strong> IP address, browser type, and usage data through cookies or analytics tools.
            </p>
            <p className="text-gray-700">
              <strong>You Provide:</strong> Information submitted through forms (e.g., when submitting an event or requesting a featured listing).
            </p>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>To display business listings and events.</li>
            <li>To process payments for featured listings (via secure third‑party providers like Stripe or PayPal).</li>
            <li>To respond to inquiries and support requests.</li>
            <li>To improve our services and website functionality.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mb-4">3. Sharing Your Information</h2>
          <p className="text-gray-700 mb-3">
            We do not sell or rent your information. We may share data with:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Service providers (payment processors, hosting services, analytics tools).</li>
            <li>Authorities if required by law.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mb-4">4. Cookies & Tracking</h2>
          <p className="text-gray-700 mb-6">
            We use cookies to improve your browsing experience and analyze site traffic. You can disable cookies 
            in your browser settings, but some features may not work properly.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">5. Third‑Party Links</h2>
          <p className="text-gray-700 mb-6">
            Our Site may contain links to other websites. We are not responsible for their privacy practices or content.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">6. Data Security</h2>
          <p className="text-gray-700 mb-6">
            We take reasonable steps to protect your personal information, but no method of transmission over 
            the internet is completely secure.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">7. Your Rights (Canada)</h2>
          <p className="text-gray-700 mb-6">
            You have the right to access, update, or request deletion of your personal data. 
            Contact us for any privacy-related requests.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
          <p className="text-gray-700 mb-6">
            We may update this Privacy Policy at any time. Changes will be posted on this page with an updated effective date.
          </p>
        </div>

        {/* Contact Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-3 text-gray-600">
            <Mail className="w-5 h-5" />
            <div>
              <p className="font-medium">Questions about this Privacy Policy?</p>
              <p className="text-sm">Contact information will be available soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};