# GitHub CI/CD Setup Guide - Simplified

## 🔐 Required GitHub Secrets

Add these secrets in your GitHub repository:
**Repository Settings → Secrets and variables → Actions → Repository secrets**

### Essential Secrets (Required)

| Secret Name | Description | Where to Find |
|-------------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Supabase Dashboard → Settings → API |
| `VERCEL_TOKEN` | Vercel account token | Vercel Dashboard → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel organization ID | Vercel Project Settings → General |
| `VERCEL_PROJECT_ID` | Vercel project ID | Vercel Project Settings → General |
| `NEXT_PUBLIC_SITE_URL` | Production site URL | `https://www.nowopencalgary.ca` |

### Optional Secrets (For API/CRON features)

| Secret Name | Description | Purpose |
|-------------|-------------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | API endpoints |
| `API_SECRET_KEY` | API security key | Protected endpoints |
| `CRON_SECRET` | CRON job security | Scheduled tasks |

## 🚀 Simplified Workflow Overview

Your repository has 5 GitHub Actions workflows:

### 1. **CI Pipeline** (`.github/workflows/ci.yml`)
**Triggers:** Push/PR to main/develop
**Purpose:** Build verification
- ESLint & TypeScript validation
- Build verification

### 2. **Deploy Pipeline** (`.github/workflows/deploy.yml`)
**Triggers:** Push to main branch
**Purpose:** Production deployment
- Quality gates (lint, typecheck, build)
- Deploy to Vercel
- Success/failure notifications

### 3. **Database Maintenance** (`.github/workflows/database-maintenance.yml`)
**Triggers:** Scheduled (daily/weekly)
**Purpose:** Database optimization
- Search vector updates
- Performance analysis
- Maintenance routines

### 4. **Business Sync** (`.github/workflows/business-sync.yml`)
**Triggers:** Scheduled (daily)
**Purpose:** Data synchronization
- Calgary Open Data sync
- Business data updates

### 5. **Monitoring** (`.github/workflows/monitoring.yml`)
**Triggers:** Scheduled (every 5 minutes)
**Purpose:** Health monitoring
- Site uptime checks
- SSL certificate monitoring
- Performance audits

## 🛡️ Security Best Practices

✅ **Never commit secrets to code**
✅ **Use GitHub Secrets for all sensitive data**
✅ **Rotate API keys regularly**
✅ **Enable branch protection rules**
✅ **Require status checks before merging**
✅ **Enable security alerts**

## 🔧 Testing Your Setup

1. **Verify secrets are set:**
   - Go to repository Settings → Secrets and variables → Actions
   - Ensure all required secrets are present

2. **Test CI pipeline:**
   ```bash
   git checkout -b test-ci
   git push origin test-ci
   # Create PR to main → Should trigger CI
   ```

3. **Test deployment:**
   ```bash
   git checkout main
   git merge test-ci
   git push origin main
   # Should trigger deployment workflow
   ```

## 🚨 Common Issues & Solutions

**Build Failures:**
- Check secret names match exactly (case-sensitive)
- Verify Supabase URLs don't have trailing slashes
- Ensure API keys are valid and not expired

**Deployment Issues:**
- Verify Vercel tokens have proper permissions
- Check project/org IDs are correct
- Ensure environment variables are set in Vercel

**Test Failures:**
- Database tests may fail if Supabase is unreachable
- E2E tests require proper environment setup
- Accessibility tests need proper DOM structure

## 📊 Monitoring Your CI/CD

**Success Indicators:**
- ✅ All workflow runs show green checkmarks
- ✅ Deployments complete successfully
- ✅ Tests pass consistently
- ✅ No security vulnerabilities detected

**Monitor These Metrics:**
- Build time (target: <3 minutes)
- Test coverage (target: >70%)
- Deployment frequency
- Success/failure rates

---

*Last Updated: Ready for GitHub integration*