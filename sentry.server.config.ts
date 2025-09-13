// This file configures the initialization of Sentry on the server side
// The config you add here will be used whenever the server handles a request

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN

Sentry.init({
  dsn: SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.05, // Lower for server-side to reduce overhead

  // Environment
  environment: process.env.NODE_ENV,

  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',

  // Server-specific configuration
  debug: process.env.NODE_ENV === 'development',

  // Enhanced error filtering for server
  beforeSend(event, hint) {
    // Filter out non-critical server errors
    if (event.exception) {
      const error = hint.originalException
      
      if (error instanceof Error) {
        // Skip database connection timeout errors (temporary issues)
        if (error.message.includes('connection timeout') ||
            error.message.includes('ETIMEDOUT')) {
          return null
        }
        
        // Skip rate limiting errors (expected behavior)
        if (error.message.includes('rate limit') ||
            error.message.includes('Too Many Requests')) {
          return null
        }
      }
    }
    
    return event
  },

  // Additional server tags
  initialScope: {
    tags: {
      component: 'calgary-business-directory-server',
      runtime: 'nodejs'
    },
  },
})