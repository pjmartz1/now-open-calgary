
import { FileText, Mail, Calendar } from 'lucide-react';

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
          <FileText className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Terms & Conditions
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
            Welcome to Now Open Calgary. By accessing or using https://nowopencalgary.com (the "Site"), 
            you agree to the following Terms & Conditions. If you do not agree, please do not use the Site.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">1. Use of Site</h2>
          <p className="text-gray-700 mb-3">
            You may use the Site for lawful purposes only. You agree not to:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Post false or misleading business information.</li>
            <li>Use the Site for spamming or unauthorized advertising.</li>
            <li>Attempt to hack, disrupt, or interfere with the Site's functionality.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mb-4">2. Business Listings & Data Accuracy</h2>
          <p className="text-gray-700 mb-6">
            Our listings are based on publicly available City of Calgary Business Licences data. 
            We do not guarantee the accuracy, completeness, or current status of any listing.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">3. Featured Listings & Payments</h2>
          <p className="text-gray-700 mb-6">
            Payments for featured listings are processed through third‑party providers. 
            All fees are non‑refundable unless otherwise stated.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
          <p className="text-gray-700 mb-6">
            All content on the Site, except for publicly sourced data, is owned by Now Open Calgary 
            and may not be copied without permission.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">5. Third‑Party Links</h2>
          <p className="text-gray-700 mb-6">
            The Site may contain links to other websites. We are not responsible for the content 
            or practices of these third parties.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
          <p className="text-gray-700 mb-6">
            Now Open Calgary is not liable for any damages arising from the use or inability to use the Site, 
            including reliance on the accuracy of business information.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">7. Changes to Terms</h2>
          <p className="text-gray-700 mb-6">
            We may update these Terms at any time. Continued use of the Site means you accept the revised Terms.
          </p>
        </div>

        {/* Contact Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-3 text-gray-600">
            <Mail className="w-5 h-5" />
            <div>
              <p className="font-medium">Questions about these Terms?</p>
              <p className="text-sm">Contact information will be available soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};