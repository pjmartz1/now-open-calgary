import { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Star } from 'lucide-react';
import { verifyPayment } from '../services/stripeService';

interface PaymentSuccessProps {
  onContinue: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ onContinue }) => {
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      verifyPaymentAndUpdate(sessionId);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyPaymentAndUpdate = async (sessionId: string) => {
    try {
      const result = await verifyPayment(sessionId);
      if (result.success) {
        setPaymentData(result);
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying Payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        
        {paymentData ? (
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Your business is now featured and will appear at the top of search results.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Feature Type:</span>
                <span className="font-semibold text-gray-900 capitalize">{paymentData.featureType}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold text-gray-900">{paymentData.duration} days</span>
              </div>
              {paymentData.customerEmail && (
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Receipt sent to:</span>
                  <span className="font-semibold text-gray-900 text-xs">{paymentData.customerEmail}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-green-600 mb-4">
              <Star className="w-4 h-4 fill-current" />
              <span>Your listing is now featured!</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 mb-6">
            Thank you for your payment. Your featured listing is being activated.
          </p>
        )}
        
        <button
          onClick={onContinue}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <span>Continue to Directory</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};