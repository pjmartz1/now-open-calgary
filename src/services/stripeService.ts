import { loadStripe } from '@stripe/stripe-js';

export interface FeatureListingOption {
  id: string;
  name: string;
  price: number;
  duration: number; // days
  features: string[];
  popular?: boolean;
}

export const FEATURE_LISTING_OPTIONS: FeatureListingOption[] = [
  {
    id: 'basic',
    name: 'Basic Featured',
    price: 50,
    duration: 7,
    features: [
      'Featured badge on listing',
      'Appears first in search results',
      '7 days of promotion'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Featured',
    price: 100,
    duration: 14,
    features: [
      'Premium featured badge',
      'Top placement in all searches',
      'Enhanced listing styling',
      '14 days of promotion',
      'Priority customer support'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Featured',
    price: 200,
    duration: 30,
    features: [
      'Enterprise featured badge',
      'Guaranteed top 3 placement',
      'Custom listing enhancements',
      '30 days of promotion',
      'Dedicated account manager',
      'Analytics dashboard'
    ]
  }
];

// Initialize Stripe
const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

export const createFeatureListingCheckout = async (
  businessId: string, 
  featureType: string, 
  amount: number
) => {
  try {
    if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
      throw new Error('Stripe publishable key not configured');
    }
    
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        businessId,
        featureType,
        amount: amount * 100, // Convert to cents
        successUrl: `${window.location.origin}/success?business=${businessId}&feature=${featureType}`,
        cancelUrl: `${window.location.origin}/cancel`
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }
    
    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Stripe checkout error:', error);
    throw error;
  }
};

export const redirectToCheckout = async (sessionId: string) => {
  try {
    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Stripe not available - API key not configured');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: sessionId
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Stripe redirect error:', error);
    throw error;
  }
};

export const verifyPayment = async (sessionId: string) => {
  try {
    const response = await fetch(`/api/verify-payment/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};