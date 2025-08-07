# Now Open Calgary

A modern business directory for newly opened businesses in Calgary, Alberta. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **SEO-First Architecture**: Optimized for search engines with Schema.org markup
- **Real-Time Business Listings**: Discover the newest businesses in Calgary
- **Modern UI/UX**: Tech-forward design with indigo and pink color scheme
- **Responsive Design**: Works perfectly on all devices
- **Category & Neighborhood Filtering**: Browse businesses by type or area
- **Google Maps Integration**: Get directions without API keys
- **Performance Optimized**: Fast loading with Next.js 14

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge, date-fns, slugify

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd project
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: Service role key for server-side operations
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://nowopencalgary.ca
NEXT_PUBLIC_SITE_NAME="Now Open Calgary"
NEXT_PUBLIC_SITE_DESCRIPTION="Discover the newest businesses opening their doors in Calgary, Alberta"

# SEO Configuration
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_google_analytics_id_here
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. Update your `.env.local` with your Supabase credentials

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🗄️ Database Schema

The application uses three main tables:

### Businesses
- Core business information (name, description, address)
- SEO fields (meta_title, meta_description, meta_keywords)
- Location data (latitude, longitude, neighborhood)
- Business details (phone, website, hours, features)
- Status flags (verified, featured, active)

### Categories
- Business categories with icons and colors
- Used for filtering and organization

### Neighborhoods
- Calgary neighborhoods for location-based filtering

## 🎨 Design System

### Colors
- **Primary**: Indigo-500 (#6366f1)
- **Accent**: Pink-500 (#ec4899)
- **Gradients**: Indigo to Pink gradients for CTAs and highlights

### Components
- **BusinessCard**: Individual business listing with Schema.org markup
- **BusinessGrid**: Responsive grid layout for multiple businesses
- **Hero Section**: Gradient background with call-to-action buttons

## 📱 Pages & Routes

- `/` - Homepage with featured businesses
- `/business/[slug]` - Individual business page (to be implemented)
- `/category/[slug]` - Category listing page (to be implemented)
- `/neighborhood/[slug]` - Neighborhood listing page (to be implemented)

## 🔍 SEO Features

- **Schema.org Markup**: LocalBusiness structured data
- **Meta Tags**: Dynamic title and description generation
- **Semantic HTML**: Proper heading hierarchy and semantic elements
- **Performance**: Optimized images and fast loading times

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📈 Analytics & Monitoring

- Google Analytics integration ready
- Supabase real-time subscriptions for live updates
- Error tracking with console logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@nowopencalgary.ca or create an issue in the repository.

## 🔮 Roadmap

- [ ] Individual business detail pages
- [ ] Category and neighborhood listing pages
- [ ] Search functionality with filters
- [ ] Business submission form
- [ ] Email notifications for new businesses
- [ ] Admin dashboard
- [ ] Mobile app (React Native)
- [ ] Social media integration
- [ ] Business reviews and ratings

---

Built with ❤️ for Calgary's business community
