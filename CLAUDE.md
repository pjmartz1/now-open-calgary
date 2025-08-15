# CLAUDE.md - Now Open Calgary

## Project Overview

**Now Open Calgary** is a modern business directory for newly opened businesses in Calgary, Alberta. Built with Next.js 15, TypeScript, Tailwind CSS, and Supabase, it serves as a real-time discovery platform for Calgary's newest business openings.

## Product Requirements Document (PRD)

### Problem Statement
Calgary residents and visitors struggle to discover new businesses opening in the city. Traditional directories are outdated and don't highlight recent openings. Business owners need a platform to showcase their new ventures to potential customers.

### Solution
A modern, SEO-optimized web application that automatically syncs with Calgary's open business license data to showcase newly opened businesses in real-time.

### Target Audience
- **Primary**: Calgary residents seeking new dining, shopping, and service options
- **Secondary**: Visitors to Calgary looking for fresh experiences
- **Tertiary**: New business owners wanting visibility for their ventures

### Core Features

#### 1. Business Discovery
- Real-time listings of newly opened businesses
- Category-based browsing (Restaurants, Retail, Services)
- Neighborhood-based filtering
- Search functionality
- Featured business highlighting

#### 2. Business Information
- Comprehensive business profiles with Schema.org markup
- Address and location data with Google Maps integration
- Business categories and license types
- Opening dates and "New" badges for recent openings
- View count tracking

#### 3. Data Integration
- Automated syncing with Calgary's Open Data API
- Real-time business license data processing
- Intelligent categorization of businesses
- Consumer-facing business filtering
- Duplicate detection and handling

#### 4. SEO & Performance
- Server-side rendering with Next.js App Router
- Structured data markup for search engines
- Optimized meta tags and descriptions
- Fast loading times and responsive design
- Social media sharing optimization

### Technical Requirements

#### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components with Lucide React icons
- **Color Scheme**: Indigo (#6366f1) and Pink (#ec4899) gradients

#### Backend
- **Database**: Supabase (PostgreSQL)
- **API**: Next.js API Routes
- **Data Source**: Calgary Open Data Portal
- **Authentication**: API key-based for admin operations

#### Infrastructure
- **Hosting**: Vercel (recommended)
- **Domain**: nowopencalgary.ca
- **Analytics**: Google Analytics ready
- **Monitoring**: Built-in error tracking

### Database Schema

#### Calgary Businesses Table
```sql
- id: UUID (primary key)
- calgary_id: String (unique Calgary business license ID)
- tradename: String (business name)
- address: String (full address)
- community: String (Calgary neighborhood)
- license_type: String (type of business license)
- first_issued_date: Date (license issue date)
- slug: String (SEO-friendly URL)
- category: String (restaurants, retail, services, etc.)
- is_consumer_facing: Boolean
- latitude: Number (GPS coordinates)
- longitude: Number (GPS coordinates)
- view_count: Number (page views)
- active: Boolean (business status)
- created_at: Timestamp
- updated_at: Timestamp
```

### API Endpoints

#### Public APIs
- `GET /` - Homepage with featured businesses
- `GET /businesses` - All businesses listing page
- `GET /business/[slug]` - Individual business page
- `GET /restaurants` - Restaurant category page
- `GET /retail` - Retail category page
- `GET /services` - Services category page

#### Admin APIs
- `POST /api/sync-businesses` - Sync Calgary business data (secured)
- `GET /api/sync-businesses?action=status` - Get sync statistics
- `GET /api/sync-businesses?action=test` - Run test sync
- `GET /api/debug-*` - Debug endpoints for development

### Data Processing Pipeline

#### 1. Data Ingestion
- Fetch business license data from Calgary Open Data API
- Filter for active, consumer-facing businesses
- Extract essential business information

#### 2. Data Processing
- Generate SEO-friendly slugs
- Categorize businesses using keyword matching
- Determine consumer-facing status
- Extract and validate GPS coordinates

#### 3. Data Storage
- Upsert businesses into Supabase database
- Handle duplicate slug conflicts
- Track view counts and engagement metrics

#### 4. Data Presentation
- Server-side render business listings
- Generate structured data markup
- Optimize for search engine indexing

## Development Task List

### Phase 1: Foundation (Completed)
- [x] Project setup with Next.js 15 and TypeScript
- [x] Tailwind CSS configuration and design system
- [x] Supabase database setup and schema design
- [x] Basic component architecture (Header, BusinessCard, BusinessGrid)
- [x] Homepage design with hero section and featured businesses
- [x] Responsive layout and mobile optimization

### Phase 2: Data Integration (Completed)
- [x] Calgary Open Data API client implementation
- [x] Business data processing and categorization logic
- [x] Automated business sync API endpoint with security
- [x] Rate limiting and authentication for admin APIs
- [x] Database upsert logic with duplicate handling
- [x] Consumer-facing business filtering

### Phase 3: Business Pages (Completed)
- [x] Category-specific listing pages (restaurants, retail, services)
- [x] Business grid component with pagination support
- [x] Search and filtering functionality
- [x] Individual business detail page structure
- [x] SEO optimization with Schema.org markup

### Phase 4: Content & Polish (Completed)
- [x] Logo integration guide and branding setup
- [x] Error handling and loading states
- [x] 404 and error pages
- [x] Footer with site information
- [x] Social media meta tags and OG images

### Phase 5: Production Ready (Completed)
- [x] Environment configuration for production
- [x] Security hardening (API keys, rate limiting)
- [x] Performance optimization
- [x] Debug and monitoring endpoints
- [x] Deployment configuration for Vercel

### Phase 6: Enhancement Opportunities (Future)
- [ ] Advanced search with filters (location, opening date)
- [ ] Business submission form for owners
- [ ] Email newsletter for new business alerts
- [ ] Business reviews and ratings system
- [ ] Admin dashboard for content management
- [ ] Mobile app (React Native)
- [ ] Integration with social media platforms
- [ ] Business analytics and insights

## Development Commands

### Environment Setup
```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### Development
```bash
# Start development server
npm run dev

# Start with safe mode (no experimental fetch)
npm run dev:safe

# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

### Database Operations
```bash
# Run SQL schema in Supabase SQL editor
# File: supabase-schema.sql

# Test sync from Calgary API (dry run)
curl -X GET "http://localhost:3000/api/sync-businesses?action=test&api_key=your_api_key"

# Get sync status
curl -X GET "http://localhost:3000/api/sync-businesses?action=status&api_key=your_api_key"

# Run full sync (production use only)
curl -X POST "http://localhost:3000/api/sync-businesses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{"mode": "recent", "daysBack": 30}'
```

### Security Configuration
```bash
# Generate secure API key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Set environment variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
API_SECRET_KEY=your_generated_secure_key
```

## File Structure

```
project/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   │   ├── sync-businesses/  # Data sync endpoint
│   │   │   └── debug-*/    # Debug endpoints
│   │   ├── business/[slug]/ # Individual business pages
│   │   ├── businesses/     # All businesses listing
│   │   ├── restaurants/    # Restaurant category
│   │   ├── retail/         # Retail category
│   │   ├── services/       # Services category
│   │   └── page.tsx        # Homepage
│   ├── components/         # React components
│   │   ├── BusinessCard.tsx
│   │   ├── BusinessGrid.tsx
│   │   ├── CalgaryBusinessGrid.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── Header.tsx
│   ├── lib/                # Utility libraries
│   │   ├── calgary-api.ts  # Calgary API client
│   │   ├── supabase.ts     # Database client
│   │   └── utils.ts        # Helper functions
│   ├── services/           # Business logic
│   │   └── businessService.ts
│   ├── types/              # TypeScript definitions
│   │   └── business.ts
│   └── data/               # Sample data
│       └── sample-businesses.ts
├── public/                 # Static assets
├── supabase-schema.sql     # Database schema
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured in Vercel
- [ ] Database schema deployed to production Supabase
- [ ] Logo files uploaded to `/public` directory
- [ ] SSL certificate configured for custom domain
- [ ] Analytics tracking ID configured

### Post-deployment
- [ ] Initial business data sync completed
- [ ] SEO meta tags verified
- [ ] Mobile responsiveness tested
- [ ] Search functionality working
- [ ] Error monitoring enabled
- [ ] Performance metrics baseline established

## Monitoring & Maintenance

### Key Metrics
- Business data freshness (last sync time)
- API response times and error rates
- User engagement (page views, session duration)
- Search functionality usage
- Mobile vs desktop traffic patterns

### Regular Tasks
- Weekly business data sync
- Monthly SEO performance review
- Quarterly security audit
- Database performance monitoring
- User feedback collection and analysis

## Support Information

### Technical Support
- Repository: GitHub repository (if applicable)
- Documentation: This CLAUDE.md file
- Environment: Production hosted on Vercel

### Business Contact
- Email: support@nowopencalgary.ca
- Website: https://nowopencalgary.ca
- Domain: nowopencalgary.ca

## Lessons Learned

### Technical Lessons

#### 1. Data Integration Challenges
**Challenge**: Calgary's Open Data API returns large datasets with inconsistent data quality.
**Solution**: Implemented robust data filtering, validation, and error handling.
**Lesson**: Always expect and prepare for dirty data when working with external APIs. Build defensive parsing logic.

#### 2. Supabase Schema Design
**Challenge**: Initial schema didn't account for slug uniqueness conflicts.
**Solution**: Added timestamp-based slug deduplication logic.
**Lesson**: Plan for edge cases in database constraints early. Unique constraints need conflict resolution strategies.

#### 3. SEO and Performance Optimization
**Challenge**: Large datasets could impact page load times.
**Solution**: Implemented server-side rendering with pagination and lazy loading.
**Lesson**: Next.js App Router's SSR is powerful for SEO but requires careful data fetching optimization.

#### 4. API Security
**Challenge**: Business sync endpoints needed protection from abuse.
**Solution**: Implemented rate limiting, API key authentication, and IP tracking.
**Lesson**: Security should be built in from day one, not added later. Rate limiting is essential for any data-heavy endpoints.

### Development Process Lessons

#### 1. Component Architecture
**Challenge**: Initially built monolithic components that were hard to maintain.
**Solution**: Refactored into smaller, reusable components with clear responsibilities.
**Lesson**: Start with component composition in mind. Single responsibility principle applies to React components.

#### 2. TypeScript Integration
**Challenge**: Complex data transformations between Calgary API and internal types.
**Solution**: Created comprehensive type definitions and transformation utilities.
**Lesson**: Invest time in proper TypeScript definitions early. It prevents many runtime errors and improves developer experience.

#### 3. Error Handling Strategy
**Challenge**: Multiple failure points (API, database, external services) needed graceful handling.
**Solution**: Implemented comprehensive error boundaries and fallback mechanisms.
**Lesson**: Plan error handling as a first-class feature, not an afterthought. Users should never see cryptic error messages.

### Design and UX Lessons

#### 1. Mobile-First Approach
**Challenge**: Complex business listings needed to work well on mobile devices.
**Solution**: Designed mobile layouts first, then enhanced for desktop.
**Lesson**: Mobile-first design is not just about responsive CSS—it's about rethinking information hierarchy.

#### 2. Loading States and Feedback
**Challenge**: Data sync operations could take time, leaving users uncertain.
**Solution**: Added comprehensive loading states, progress indicators, and status feedback.
**Lesson**: Never leave users guessing about system status. Immediate feedback is crucial for perceived performance.

#### 3. Content Strategy
**Challenge**: Business listings needed to be informative but scannable.
**Solution**: Implemented card-based layouts with clear visual hierarchy and essential information upfront.
**Lesson**: Information architecture is as important as visual design. Users scan, don't read.

### Data and Business Logic Lessons

#### 1. Business Categorization
**Challenge**: Automatic categorization from business names and license types was inconsistent.
**Solution**: Built a comprehensive keyword mapping system with fallback categories.
**Lesson**: Business logic for categorization needs constant refinement. Plan for manual overrides and machine learning improvements.

#### 2. Data Freshness vs. Performance
**Challenge**: Balancing real-time data with acceptable page load times.
**Solution**: Implemented scheduled syncs with cached data and "new" indicators.
**Lesson**: Perfect real-time data isn't always necessary. Smart caching with freshness indicators often provides better UX.

#### 3. Geographic Data Handling
**Challenge**: Calgary's coordinate data had accuracy and boundary issues.
**Solution**: Added coordinate validation and fallback to address-based mapping.
**Lesson**: Geographic data is often unreliable. Always validate coordinates and have fallback strategies.

### Deployment and Operations Lessons

#### 1. Environment Management
**Challenge**: Different configurations needed for development, staging, and production.
**Solution**: Comprehensive environment variable strategy with validation.
**Lesson**: Environment configuration should be explicit and validated. Don't assume production will work like development.

#### 2. Database Migration Strategy
**Challenge**: Schema changes needed to be applied safely in production.
**Solution**: Designed backwards-compatible changes and migration scripts.
**Lesson**: Plan database evolution from the beginning. Breaking changes are expensive in production.

#### 3. Monitoring and Observability
**Challenge**: Understanding system health and user behavior in production.
**Solution**: Built-in logging, error tracking, and performance monitoring.
**Lesson**: Observability is not optional for production systems. Instrument everything from day one.

### Project Management Lessons

#### 1. Feature Prioritization
**Challenge**: Balancing MVP features with nice-to-have enhancements.
**Solution**: Focused on core business value first, then iterative improvements.
**Lesson**: Ship early and iterate. Perfect is the enemy of done, especially for content-driven applications.

#### 2. Documentation Strategy
**Challenge**: Keeping documentation current with rapid development.
**Solution**: Embedded documentation in code and maintained this comprehensive CLAUDE.md.
**Lesson**: Documentation should be part of the development process, not a separate task. Living documentation beats perfect documentation.

#### 3. Testing Strategy
**Challenge**: Balancing development speed with code quality.
**Solution**: Focused on integration testing for critical data flows.
**Lesson**: Test the things that break. For data-heavy applications, integration tests are often more valuable than unit tests.

### Performance and Scalability Lessons

#### 1. Database Query Optimization
**Challenge**: Complex business queries could become slow with large datasets.
**Solution**: Implemented proper indexing and query optimization from the start.
**Lesson**: Database performance issues are easier to prevent than fix. Index strategy should be part of initial schema design.

#### 2. Caching Strategy
**Challenge**: Balancing data freshness with performance.
**Solution**: Multi-level caching with appropriate TTLs for different data types.
**Lesson**: Caching is complex but necessary. Plan cache invalidation strategy before implementing caching.

#### 3. Asset Optimization
**Challenge**: Images and assets impacting page load times.
**Solution**: Used Next.js Image optimization and lazy loading strategies.
**Lesson**: Modern frameworks provide great optimization tools, but you still need to use them correctly.

### Key Takeaways for Future Projects

1. **Start with the data model**: Understanding your data deeply prevents many later problems.
2. **Security is not optional**: Build authentication, rate limiting, and input validation from day one.
3. **User experience drives technical decisions**: Performance and reliability are user experience features.
4. **Plan for failure**: Error handling and fallback strategies are as important as happy path functionality.
5. **Documentation enables iteration**: Good documentation makes future development much faster.
6. **Testing prevents regressions**: Focus testing efforts on the most critical and complex parts of the system.
7. **Performance is a feature**: Users notice slow applications more than they notice fast ones.

---

## Recent Codebase Cleanup and Optimization (August 2024)

### Overview
A comprehensive cleanup and optimization effort was completed to streamline the codebase, remove unnecessary code, and improve maintainability. This cleanup focused on consolidating the project to use only Calgary-specific business data and removing legacy components.

### Cleanup Summary

#### 🗑️ Files Removed
**Unused Components:**
- `src/components/BusinessGrid.tsx` - Legacy business grid component
- `src/components/BusinessCard.tsx` - Legacy business card component

**Unused Data:**
- `src/data/sample-businesses.ts` - Legacy sample data
- `src/data/` directory - Empty directory removed

**Unused API Routes:**
- All debug routes: `debug-*`, `test-*` directories
- Kept only essential routes: `sync-businesses/` and `cron/`

**Debug & Utility Files:**
- `fix-domain-urls.js`
- `debug-redirects.js`
- `debug-comprehensive.js`
- `screenshot.js`
- `DEBUG_SUMMARY.md`
- `supabase-schema.sql` (old schema)

**Empty Directories:**
- `src/utils/` - Removed empty directory

#### 🔧 Code Consolidation

**BusinessService.ts Optimization:**
- Removed all legacy business methods (`getBusinesses`, `getFeaturedBusinesses`, etc.)
- Kept only Calgary-specific methods
- Fixed all TypeScript null check errors
- Clean, focused interface with proper error handling

**Supabase Client Consolidation:**
- Consolidated to single client instance
- Removed unused type definitions (`Business`, `Category`, `Neighborhood`)
- Fixed "Multiple GoTrueClient instances" warning
- Streamlined database type definitions

**Type Safety Improvements:**
- All TypeScript errors resolved
- Proper null checks implemented throughout
- Clean type definitions for Calgary business data

#### 🗄️ Database Schema Cleanup

**Unused Tables Identified:**
- `businesses` - Old business table with different schema
- `categories` - Old categories table (not used)
- `neighborhoods` - Old neighborhoods table (not used)

**Cleanup Script Created:**
- `cleanup-unused-tables.sql` - Comprehensive database cleanup script
- Removes all unused tables, views, indexes, and triggers
- Preserves Calgary business data and related objects
- Safe to run multiple times with CASCADE operations

**Remaining Database Objects:**
- `calgary_businesses` - Main table with Calgary business data
- `recent_calgary_businesses` - View for recent businesses
- `calgary_businesses_by_community` - View for community stats
- `calgary_businesses_by_category` - View for category stats
- Required extensions and functions

### Build and Performance Results

#### ✅ Build Status
- **TypeScript Errors:** 0 (all resolved)
- **Linting Errors:** 0 (all resolved)
- **Build Time:** Optimized (13-15 seconds)
- **Bundle Size:** Reduced and optimized

#### 📊 Bundle Analysis
```
Route (app)                                 Size  First Load JS    
┌ ○ /                                    5.07 kB         156 kB
├ ○ /businesses                          4.15 kB         155 kB
├ ○ /restaurants                           167 B         103 kB
├ ○ /retail                                167 B         103 kB
├ ○ /services                              167 B         103 kB
└ ○ /business/[slug]                       165 B         103 kB
```

#### 🚀 Performance Improvements
- **Reduced Bundle Size:** Removed unused components and legacy code
- **Faster Build Times:** Cleaner dependency tree
- **Better Type Safety:** Comprehensive TypeScript coverage
- **Improved Maintainability:** Focused, single-purpose codebase

### Current Project Structure

```
project/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── cron/daily-sync/
│   │   │   └── sync-businesses/
│   │   ├── business/[slug]/
│   │   ├── businesses/
│   │   ├── restaurants/
│   │   ├── retail/
│   │   ├── services/
│   │   └── layout.tsx, page.tsx
│   ├── components/
│   │   ├── CalgaryBusinessGrid.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── Header.tsx
│   ├── lib/
│   │   ├── calgary-api.ts
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── services/
│   │   └── businessService.ts
│   └── types/
│       └── business.ts
├── public/
├── calgary-business-schema.sql
├── cleanup-unused-tables.sql
├── package.json
└── next.config.ts
```

### Features Status

#### ✅ Fully Functional
- **Search System:** Homepage, header, and business listing search
- **Category Pages:** Restaurants, retail, services with filtering
- **Business Details:** Individual business pages with dynamic routing
- **Data Management:** Supabase integration with Calgary business data
- **SEO Optimization:** Meta tags, sitemap, and structured data

#### 🔧 Technical Improvements
- **Error Handling:** Comprehensive error boundaries and fallbacks
- **Loading States:** Proper loading indicators throughout
- **Responsive Design:** Mobile-first approach with Tailwind CSS
- **Type Safety:** Full TypeScript coverage with proper interfaces

### Next Steps

1. **Database Cleanup:** Run `cleanup-unused-tables.sql` in Supabase
2. **Deployment:** Deploy to Vercel with optimized build
3. **Monitoring:** Set up performance monitoring and error tracking
4. **Content:** Populate with Calgary business data via sync process

### Lessons Learned from Cleanup

1. **Legacy Code Accumulation:** Regular cleanup prevents technical debt
2. **Type Safety:** Proper TypeScript usage prevents runtime errors
3. **Database Optimization:** Removing unused tables improves performance
4. **Component Consolidation:** Focused components are easier to maintain
5. **Build Optimization:** Clean dependency tree improves build times

---

*This cleanup effort demonstrates the importance of regular code maintenance and optimization for long-term project health.*

---

*This documentation was generated to capture the complete development process, requirements, and lessons learned from building the Now Open Calgary business directory platform.*