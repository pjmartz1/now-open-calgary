import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Payment successful
      res.status(200).json({
        success: true,
        businessId: session.metadata.businessId,
        featureType: session.metadata.featureType,
        duration: session.metadata.duration,
        paymentIntent: session.payment_intent,
        customerEmail: session.customer_details?.email
      });
    } else {
      // Payment not completed
      res.status(400).json({
        success: false,
        status: session.payment_status,
        message: 'Payment not completed'
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      error: 'Failed to verify payment',
      details: error.message 
    });
  }
}