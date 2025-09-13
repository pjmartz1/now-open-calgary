// Monitoring service for error tracking and performance monitoring
// This is a lightweight implementation that can be enhanced with external services

interface ErrorContext {
  userId?: string
  action?: string
  component?: string
  timestamp: number
  userAgent?: string
  url?: string
  additionalData?: Record<string, unknown>
}

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  tags?: Record<string, string>
}

export class MonitoringService {
  private static instance: MonitoringService
  private errors: Array<{ error: Error; context: ErrorContext }> = []
  private metrics: PerformanceMetric[] = []

  private constructor() {
    // Initialize monitoring
    if (typeof window !== 'undefined') {
      // Client-side initialization
      this.setupClientMonitoring()
    }
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }

  private setupClientMonitoring() {
    // Track unhandled errors
    window.addEventListener('error', (event) => {
      this.captureError(new Error(event.message), {
        component: 'window',
        action: 'unhandled_error',
        timestamp: Date.now(),
        url: window.location.href,
        additionalData: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      })
    })

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(new Error(String(event.reason)), {
        component: 'window',
        action: 'unhandled_rejection',
        timestamp: Date.now(),
        url: window.location.href,
      })
    })
  }

  captureError(error: Error, context: Partial<ErrorContext> = {}) {
    const fullContext: ErrorContext = {
      timestamp: Date.now(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      ...context
    }

    this.errors.push({ error, context: fullContext })

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('Monitoring Service - Error captured:', error.message, fullContext)
    }

    // In production, you could send to external service like Sentry
    // For now, we'll just store locally
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context: Partial<ErrorContext> = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Monitoring Service - ${level.toUpperCase()}: ${message}`, context)
    }
  }

  addMetric(name: string, value: number, tags?: Record<string, string>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      tags
    }

    this.metrics.push(metric)

    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Monitoring Service - Metric:', metric)
    }
  }

  getMetrics(name?: string): PerformanceMetric[] {
    return name ? this.metrics.filter(m => m.name === name) : this.metrics
  }

  getErrors(): Array<{ error: Error; context: ErrorContext }> {
    return this.errors
  }

  clearMetrics() {
    this.metrics = []
  }

  clearErrors() {
    this.errors = []
  }

  // Helper method for database operation monitoring
  trackDatabaseOperation(operation: string, duration: number, success: boolean, details?: Record<string, unknown>) {
    this.addMetric(`database.${operation}.duration`, duration, {
      success: success.toString(),
      operation
    })

    if (!success && details?.error) {
      this.captureError(details.error as Error, {
        action: `database_${operation}`,
        component: 'database',
        timestamp: Date.now(),
        additionalData: details
      })
    }
  }

  // Helper method for cache operation monitoring
  trackCacheOperation(operation: 'hit' | 'miss' | 'set', cacheKey: string, duration?: number) {
    this.addMetric(`cache.${operation}`, 1, {
      cache_key: cacheKey,
      operation
    })

    if (duration) {
      this.addMetric(`cache.${operation}.duration`, duration, {
        cache_key: cacheKey
      })
    }
  }
}

// Export singleton instance
export const monitoring = MonitoringService.getInstance()