# Now Open Calgary 🍁

A comprehensive directory of newly licensed businesses in Calgary, helping residents discover local entrepreneurs and new establishments in their community.

## 🌟 Features

### For Residents
- **Real-time Business Discovery**: Browse newly licensed businesses updated daily from City of Calgary data
- **Smart Search & Filtering**: Find businesses by name, type, community, or date range
- **Interactive Maps**: View business locations with Google Maps integration
- **Mobile Responsive**: Perfect experience on all devices

### For Business Owners
- **Featured Listings**: Promote your business with premium placement
- **Business Claiming**: Claim and manage your business listing
- **Multiple Pricing Tiers**: Basic ($50), Premium ($100), Enterprise ($200) featured options
- **Secure Payments**: Stripe integration for safe transactions

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Maps**: Google Maps JavaScript API
- **Payments**: Stripe Checkout
- **Data Source**: City of Calgary Business Licenses API
- **Build Tool**: Vite
- **Deployment**: Ready for Netlify/Vercel

## 🏗️ Architecture

```
src/
├── components/          # React components
│   ├── BusinessCard.tsx
│   ├── BusinessModal.tsx
│   ├── FilterSidebar.tsx
│   ├── GoogleMap.tsx
│   └── ...
├── services/           # API and external services
│   ├── calgaryAPI.ts
│   ├── stripeService.ts
│   └── googleMapsService.ts
├── types/              # TypeScript definitions
└── App.tsx            # Main application
```

## 🛠️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pjmartz1/New-in-Calgary.git
   cd New-in-Calgary
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env.local` file:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Start API server** (for Stripe payments)
   ```bash
   npm run dev:api
   ```

## 🔧 Configuration

### Google Maps Setup
1. Enable Maps JavaScript API, Places API, and Geocoding API
2. Create API key and restrict to your domain
3. Add to `.env.local` as `VITE_GOOGLE_MAPS_API_KEY`

### Stripe Setup
1. Create Stripe account and get API keys
2. Add publishable key to `.env.local`
3. Configure webhook endpoints for payment processing

### Calgary API
- Currently uses mock data with fallback to real Calgary API
- No additional setup required for development

## 📊 Features Overview

### ✅ Completed
- [x] Business listings with search and filtering
- [x] Google Maps integration with geocoding
- [x] Stripe payment system for featured listings
- [x] Business claiming system
- [x] Responsive design with Calgary branding
- [x] Real-time data from Calgary API

### 🚧 In Progress
- [ ] Database integration for persistent data
- [ ] Email notification system
- [ ] Business owner dashboard
- [ ] Advanced analytics

## 🎨 Design System

- **Primary Color**: Calgary Red (#C41E3A)
- **Secondary Color**: Calgary Blue (#0066CC)
- **Typography**: Clean, modern font stack
- **Components**: Card-based design with hover effects
- **Mobile-first**: Responsive breakpoints for all devices

## 🚀 Deployment

The application is ready for deployment on:
- **Netlify**: Static site deployment
- **Vercel**: Full-stack deployment with API routes
- **Custom hosting**: Standard React build process

## 📈 Performance

- **Bundle Size**: Optimized with Vite
- **API Costs**: Google Maps calls limited and cached
- **Loading**: Lazy loading and efficient state management
- **SEO**: Meta tags and structured data ready

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- City of Calgary for providing open business license data
- Calgary community for supporting local businesses
- Contributors and beta testers

---

**Built with ❤️ for Calgary's entrepreneurial community**