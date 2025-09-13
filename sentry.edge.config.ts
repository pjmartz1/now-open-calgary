// This file configures the initialization of Sentry for edge runtime.

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN

Sentry.init({
  dsn: SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.05, // Lower for edge to reduce overhead

  // Environment
  environment: process.env.NODE_ENV,

  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',

  // Edge-specific configuration
  debug: process.env.NODE_ENV === 'development',

  // Additional edge tags
  initialScope: {
    tags: {
      component: 'calgary-business-directory-edge',
      runtime: 'edge'
    },
  },
})