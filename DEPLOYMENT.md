# 🚀 Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Environment Variables**: Prepare your production environment variables

## Step 1: Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Stripe Configuration (Production)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Optional: App URL (auto-detected by Vercel)
VITE_APP_URL=https://your-domain.vercel.app
```

## Step 2: Stripe Production Setup

1. **Switch to Live Mode**: In your Stripe dashboard, switch from test to live mode
2. **Get Live Keys**: Copy your live publishable and secret keys
3. **Configure Webhooks**: 
   - Go to Stripe Dashboard > Webhooks
   - Add endpoint: `https://your-domain.vercel.app/api/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.payment_failed`
   - Copy the webhook secret

## Step 3: Google Maps API Setup

1. **Enable APIs**: In Google Cloud Console, enable:
   - Maps JavaScript API
   - Places API
   - Geocoding API
2. **Create API Key**: Generate a new API key
3. **Restrict Key**: Add your Vercel domain to the key restrictions

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. **Import Project**: 
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Add Environment Variables**:
   - Add all variables from your `.env.local` file
   - Make sure to use production values

4. **Deploy**: Click "Deploy"

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

## Step 5: Post-Deployment Configuration

### 1. Custom Domain (Optional)
- Go to your project settings in Vercel
- Add your custom domain
- Update DNS records as instructed

### 2. Environment Variables Verification
- Verify all environment variables are set correctly
- Test the application functionality

### 3. Stripe Webhook Testing
- Use Stripe CLI to test webhooks locally
- Verify webhook events are being received

## Step 6: Testing Your Deployment

### 1. Basic Functionality
- [ ] Homepage loads correctly
- [ ] Business listings display
- [ ] Search and filters work
- [ ] Business detail modals open

### 2. Payment System
- [ ] Featured listing modal opens
- [ ] Stripe checkout redirects correctly
- [ ] Payment verification works
- [ ] Webhooks are received

### 3. API Integration
- [ ] Calgary API data loads
- [ ] Google Maps integration works
- [ ] Error handling works properly

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in `package.json`
   - Ensure TypeScript compilation passes

2. **Environment Variables**:
   - Verify all variables are set in Vercel dashboard
   - Check for typos in variable names
   - Ensure production values are used

3. **API Routes Not Working**:
   - Check that API files are in the `api/` directory
   - Verify file naming follows Vercel conventions
   - Check function exports are correct

4. **Stripe Issues**:
   - Verify you're using live keys (not test keys)
   - Check webhook endpoint URL is correct
   - Ensure webhook secret is set correctly

### Performance Optimization

1. **Enable Caching**:
   - Add cache headers to API responses
   - Implement client-side caching for business data

2. **Monitor Performance**:
   - Use Vercel Analytics
   - Monitor Core Web Vitals
   - Check bundle size

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to Git
2. **API Keys**: Restrict Google Maps API key to your domain
3. **CORS**: Configure CORS properly for your domain
4. **HTTPS**: Vercel provides SSL certificates automatically

## Monitoring & Analytics

1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Consider adding Sentry or similar
3. **Performance Monitoring**: Use Vercel's built-in monitoring

## Next Steps

After successful deployment:

1. **Set up monitoring and analytics**
2. **Configure custom domain**
3. **Set up CI/CD pipeline**
4. **Add database integration**
5. **Implement user authentication**
6. **Add admin dashboard**

---

## Support

If you encounter issues:

1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Review build logs in Vercel dashboard
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly 