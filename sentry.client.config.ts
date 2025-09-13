// This file configures the initialization of Sentry on the browser/client side
// The config you add here will be used whenever a page is visited.

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN

Sentry.init({
  dsn: SENTRY_DSN,
  
  // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.1,

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Environment
  environment: process.env.NODE_ENV,

  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',

  // Enhanced error filtering
  beforeSend(event, hint) {
    // Filter out non-critical errors
    if (event.exception) {
      const error = hint.originalException
      
      // Skip certain types of errors
      if (error instanceof Error) {
        // Skip network errors that are likely user connectivity issues
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError') ||
            error.message.includes('Load failed')) {
          return null
        }
        
        // Skip development-only errors
        if (process.env.NODE_ENV === 'development' && 
            error.message.includes('Hydration')) {
          return null
        }
      }
    }
    
    return event
  },

  // Additional tags
  initialScope: {
    tags: {
      component: 'calgary-business-directory'
    },
  },
})