import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}