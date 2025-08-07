import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const port = 3001;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

// Middleware
app.use(cors());
app.use(express.json());

// Create checkout session endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { businessId, featureType, amount, successUrl, cancelUrl } = req.body;

    // Validate required fields
    if (!businessId || !featureType || !amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: businessId, featureType, amount' 
      });
    }

    // Get feature option details
    const featureOptions = {
      basic: { name: 'Basic Featured Listing', duration: 7 },
      premium: { name: 'Premium Featured Listing', duration: 14 },
      enterprise: { name: 'Enterprise Featured Listing', duration: 30 }
    };

    const selectedOption = featureOptions[featureType];
    if (!selectedOption) {
      return res.status(400).json({ error: 'Invalid feature type' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: selectedOption.name,
              description: `Feature your Calgary business listing for ${selectedOption.duration} days`,
              metadata: {
                businessId,
                featureType,
                duration: selectedOption.duration.toString()
              }
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        businessId,
        featureType,
        duration: selectedOption.duration.toString()
      },
      billing_address_collection: 'required',
    });

    res.status(200).json({ 
      id: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
});

// Verify payment endpoint
app.get('/api/verify-payment/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

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
});

// Webhook endpoint for Stripe events
app.post('/api/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful for business:', session.metadata.businessId);
      
      // Here you would update your database to mark the business as featured
      // For now, we'll just log it
      console.log('Featured listing activated:', {
        businessId: session.metadata.businessId,
        featureType: session.metadata.featureType,
        duration: session.metadata.duration
      });
      
      break;
      
    case 'payment_intent.payment_failed':
      const paymentIntent = event.data.object;
      console.log('Payment failed:', paymentIntent.id);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
});

app.listen(port, () => {
  console.log(`🚀 Stripe API server running on http://localhost:${port}`);
  console.log(`📊 Ready to process payments for Calgary businesses`);
});