import { MonitoringService } from './monitoring'

export interface DatabaseQueryMetrics {
  query: string
  duration: number
  resultCount?: number
  cached?: boolean
  error?: boolean
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()
  
  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  /**
   * Track database query performance
   */
  trackDatabaseQuery(metrics: DatabaseQueryMetrics) {
    const key = `db_${metrics.query}`
    const existing = this.metrics.get(key) || []
    existing.push(metrics.duration)
    this.metrics.set(key, existing)

    // Log slow queries
    if (metrics.duration > 1000 && !metrics.cached) {
      MonitoringService.logWarning(`Slow database query: ${metrics.query}`, {
        duration: metrics.duration.toString(),
        resultCount: metrics.resultCount?.toString(),
        cached: metrics.cached?.toString()
      })
    }

    // Track in Sentry
    MonitoringService.trackPerformance({
      name: `database_query_${metrics.query}`,
      duration: metrics.duration,
      metadata: {
        query: metrics.query,
        resultCount: metrics.resultCount,
        cached: metrics.cached,
        error: metrics.error
      }
    })
  }

  /**
   * Track page load performance
   */
  trackPageLoad(page: string, loadTime: number, route?: string) {
    const key = `page_${page}`
    const existing = this.metrics.get(key) || []
    existing.push(loadTime)
    this.metrics.set(key, existing)

    MonitoringService.trackPerformance({
      name: `page_load_${page}`,
      duration: loadTime,
      metadata: {
        page,
        route,
        timestamp: Date.now()
      }
    })

    // Log slow page loads
    if (loadTime > 3000) {
      MonitoringService.logWarning(`Slow page load: ${page}`, {
        duration: loadTime.toString(),
        route: route || 'unknown'
      })
    }
  }

  /**
   * Track API response times
   */
  trackAPIResponse(endpoint: string, duration: number, statusCode: number, cached?: boolean) {
    const key = `api_${endpoint}`
    const existing = this.metrics.get(key) || []
    existing.push(duration)
    this.metrics.set(key, existing)

    MonitoringService.trackAPICall(endpoint, duration, statusCode)

    // Additional logging for cached responses
    if (cached && duration < 100) {
      MonitoringService.addBreadcrumb(
        `Fast cached response: ${endpoint}`,
        'api.cache',
        { duration, endpoint }
      )
    }
  }

  /**
   * Get performance statistics
   */
  getStats(key: string) {
    const metrics = this.metrics.get(key)
    if (!metrics || metrics.length === 0) {
      return null
    }

    const sorted = metrics.sort((a, b) => a - b)
    const count = sorted.length
    const sum = sorted.reduce((a, b) => a + b, 0)
    
    return {
      count,
      min: sorted[0],
      max: sorted[count - 1],
      avg: sum / count,
      median: sorted[Math.floor(count / 2)],
      p95: sorted[Math.floor(count * 0.95)],
      p99: sorted[Math.floor(count * 0.99)]
    }
  }

  /**
   * Get all performance metrics for reporting
   */
  getAllStats() {
    const stats: Record<string, any> = {}
    for (const [key] of this.metrics) {
      stats[key] = this.getStats(key)
    }
    return stats
  }

  /**
   * Clear old metrics (call periodically to prevent memory leaks)
   */
  clearOldMetrics(maxAge: number = 3600000) { // Default 1 hour
    // In a real implementation, you'd track timestamps
    // For now, just clear if we have too many metrics
    if (this.metrics.size > 1000) {
      this.metrics.clear()
    }
  }
}

// Utility function to measure execution time
export async function measurePerformance<T>(
  operation: () => Promise<T>,
  name: string,
  context?: Record<string, any>
): Promise<T> {
  const startTime = Date.now()
  const monitor = PerformanceMonitor.getInstance()
  
  try {
    const result = await operation()
    const duration = Date.now() - startTime
    
    MonitoringService.trackPerformance({
      name,
      duration,
      metadata: { ...context, success: true }
    })
    
    return result
  } catch (error) {
    const duration = Date.now() - startTime
    
    MonitoringService.logError(error as Error, {
      operation: name,
      duration: duration.toString(),
      ...context
    })
    
    throw error
  }
}

// Web Vitals tracking
export function trackWebVitals() {
  if (typeof window !== 'undefined') {
    // Track Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => {
        MonitoringService.trackPerformance({
          name: 'web_vital_cls',
          duration: metric.value,
          metadata: { id: metric.id, rating: metric.rating }
        })
      })

      getFID((metric) => {
        MonitoringService.trackPerformance({
          name: 'web_vital_fid',
          duration: metric.value,
          metadata: { id: metric.id, rating: metric.rating }
        })
      })

      getFCP((metric) => {
        MonitoringService.trackPerformance({
          name: 'web_vital_fcp',
          duration: metric.value,
          metadata: { id: metric.id, rating: metric.rating }
        })
      })

      getLCP((metric) => {
        MonitoringService.trackPerformance({
          name: 'web_vital_lcp',
          duration: metric.value,
          metadata: { id: metric.id, rating: metric.rating }
        })
      })

      getTTFB((metric) => {
        MonitoringService.trackPerformance({
          name: 'web_vital_ttfb',
          duration: metric.value,
          metadata: { id: metric.id, rating: metric.rating }
        })
      })
    }).catch(() => {
      // web-vitals not available, skip tracking
    })
  }
}