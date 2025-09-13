import * as Sentry from '@sentry/nextjs'

export interface ErrorContext {
  userId?: string
  businessId?: string
  searchTerm?: string
  category?: string
  community?: string
  page?: string
  component?: string
  action?: string
  [key: string]: unknown
}

export interface PerformanceMetrics {
  name: string
  duration: number
  metadata?: Record<string, any>
}

export class MonitoringService {
  /**
   * Log an error with context
   */
  static logError(error: Error, context?: ErrorContext) {
    console.error('Application Error:', error, context)
    
    if (typeof window !== 'undefined' || process.env.NODE_ENV === 'production') {
      Sentry.withScope((scope) => {
        if (context) {
          Object.keys(context).forEach(key => {
            scope.setTag(key, context[key])
          })
          scope.setContext('errorContext', context)
        }
        
        Sentry.captureException(error)
      })
    }
  }

  /**
   * Log a warning message
   */
  static logWarning(message: string, context?: ErrorContext) {
    console.warn('Application Warning:', message, context)
    
    if (typeof window !== 'undefined' || process.env.NODE_ENV === 'production') {
      Sentry.withScope((scope) => {
        if (context) {
          Object.keys(context).forEach(key => {
            scope.setTag(key, context[key])
          })
        }
        scope.setLevel('warning')
        Sentry.captureMessage(message)
      })
    }
  }

  /**
   * Log an info event
   */
  static logInfo(message: string, context?: ErrorContext) {
    console.info('Application Info:', message, context)
    
    if (typeof window !== 'undefined' || process.env.NODE_ENV === 'production') {
      Sentry.withScope((scope) => {
        if (context) {
          Object.keys(context).forEach(key => {
            scope.setTag(key, context[key])
          })
        }
        scope.setLevel('info')
        Sentry.captureMessage(message)
      })
    }
  }

  /**
   * Track performance metrics
   */
  static trackPerformance(metrics: PerformanceMetrics) {
    console.info('Performance Metric:', metrics)
    
    if (typeof window !== 'undefined' || process.env.NODE_ENV === 'production') {
      Sentry.withScope((scope) => {
        if (metrics.metadata) {
          scope.setContext('performance', metrics.metadata)
        }
        scope.setTag('performance_metric', metrics.name)
        scope.setTag('duration', metrics.duration.toString())
        
        Sentry.captureMessage(`Performance: ${metrics.name} took ${metrics.duration}ms`)
      })
    }
  }

  /**
   * Track user actions for analytics
   */
  static trackUserAction(action: string, context?: ErrorContext) {
    console.info('User Action:', action, context)
    
    if (typeof window !== 'undefined' || process.env.NODE_ENV === 'production') {
      Sentry.withScope((scope) => {
        if (context) {
          Object.keys(context).forEach(key => {
            scope.setTag(key, context[key])
          })
        }
        scope.setTag('user_action', action)
        scope.setLevel('info')
        
        Sentry.captureMessage(`User Action: ${action}`)
      })
    }
  }

  /**
   * Track API call performance
   */
  static trackAPICall(endpoint: string, duration: number, status?: number) {
    const context = { endpoint, duration, status }
    
    if (status && status >= 400) {
      this.logError(new Error(`API Error: ${endpoint} returned ${status}`), context)
    } else if (duration > 5000) {
      this.logWarning(`Slow API call: ${endpoint} took ${duration}ms`, context)
    } else {
      this.trackPerformance({
        name: `api_call_${endpoint}`,
        duration,
        metadata: context
      })
    }
  }

  /**
   * Set user context for error tracking
   */
  static setUserContext(userId: string, email?: string, username?: string) {
    if (typeof window !== 'undefined' || process.env.NODE_ENV === 'production') {
      Sentry.setUser({
        id: userId,
        email,
        username,
      })
    }
  }

  /**
   * Clear user context (on logout)
   */
  static clearUserContext() {
    if (typeof window !== 'undefined' || process.env.NODE_ENV === 'production') {
      Sentry.setUser(null)
    }
  }

  /**
   * Add breadcrumb for debugging
   */
  static addBreadcrumb(message: string, category: string, data?: unknown) {
    if (typeof window !== 'undefined' || process.env.NODE_ENV === 'production') {
      Sentry.addBreadcrumb({
        message,
        category,
        data,
        level: 'info',
        timestamp: Date.now() / 1000,
      })
    }
  }

  /**
   * Start a performance transaction
   */
  static startTransaction(name: string, op: string = 'custom') {
    if (typeof window !== 'undefined' || process.env.NODE_ENV === 'production') {
      return Sentry.startTransaction({
        name,
        op,
      })
    }
    
    // Return a mock transaction for development
    return {
      setTag: () => {},
      setData: () => {},
      setStatus: () => {},
      finish: () => {},
    }
  }
}

// Performance monitoring utilities
export const withPerformanceMonitoring = <T extends (...args: unknown[]) => Promise<any>>(
  fn: T,
  name: string
): T => {
  return (async (...args: unknown[]) => {
    const startTime = Date.now()
    const transaction = MonitoringService.startTransaction(name)
    
    try {
      const result = await fn(...args)
      const duration = Date.now() - startTime
      
      MonitoringService.trackPerformance({
        name,
        duration,
        metadata: { success: true }
      })
      
      transaction.setStatus('ok')
      transaction.finish()
      
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      
      MonitoringService.logError(error as Error, {
        component: name,
        duration: duration.toString()
      })
      
      transaction.setStatus('internal_error')
      transaction.finish()
      
      throw error
    }
  }) as T
}

// React Hook for performance monitoring
export const usePerformanceMonitoring = (componentName: string) => {
  const trackComponentMount = () => {
    MonitoringService.addBreadcrumb(
      `Component mounted: ${componentName}`,
      'ui.component',
      { componentName }
    )
  }

  const trackUserInteraction = (interaction: string, data?: unknown) => {
    MonitoringService.trackUserAction(interaction, {
      component: componentName,
      ...data
    })
  }

  return {
    trackComponentMount,
    trackUserInteraction,
  }
}