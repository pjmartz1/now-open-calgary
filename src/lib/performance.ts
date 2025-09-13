// Performance monitoring utilities
// Lightweight performance tracking for database queries and API calls

import { monitoring } from './monitoring'

interface PerformanceEntry {
  name: string
  startTime: number
  endTime?: number
  duration?: number
  metadata?: Record<string, unknown>
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private activeEntries: Map<string, PerformanceEntry> = new Map()
  private completedEntries: PerformanceEntry[] = []

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  start(name: string, metadata?: Record<string, unknown>): string {
    const entryId = `${name}_${Date.now()}_${Math.random().toString(36).substring(7)}`

    const entry: PerformanceEntry = {
      name,
      startTime: performance.now(),
      metadata
    }

    this.activeEntries.set(entryId, entry)
    return entryId
  }

  end(entryId: string): PerformanceEntry | null {
    const entry = this.activeEntries.get(entryId)
    if (!entry) {
      console.warn(`PerformanceMonitor: Entry ${entryId} not found`)
      return null
    }

    entry.endTime = performance.now()
    entry.duration = entry.endTime - entry.startTime

    // Remove from active entries and add to completed
    this.activeEntries.delete(entryId)
    this.completedEntries.push(entry)

    // Keep only last 1000 entries to prevent memory leaks
    if (this.completedEntries.length > 1000) {
      this.completedEntries = this.completedEntries.slice(-1000)
    }

    // Send to monitoring service
    monitoring.addMetric(entry.name, entry.duration, {
      performance_type: 'duration',
      ...(entry.metadata as Record<string, string> || {})
    })

    if (process.env.NODE_ENV === 'development') {
      console.log(`PerformanceMonitor: ${entry.name} completed in ${entry.duration.toFixed(2)}ms`)
    }

    return entry
  }

  getCompletedEntries(name?: string): PerformanceEntry[] {
    return name
      ? this.completedEntries.filter(entry => entry.name === name)
      : this.completedEntries
  }

  getAverageTime(name: string): number {
    const entries = this.getCompletedEntries(name)
    if (entries.length === 0) return 0

    const totalTime = entries.reduce((sum, entry) => sum + (entry.duration || 0), 0)
    return totalTime / entries.length
  }

  clear() {
    this.activeEntries.clear()
    this.completedEntries = []
  }
}

// Utility function for measuring async operations
export async function measurePerformance<T>(
  name: string,
  operation: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<T> {
  const monitor = PerformanceMonitor.getInstance()
  const entryId = monitor.start(name, metadata)

  try {
    const result = await operation()
    monitor.end(entryId)
    return result
  } catch (error) {
    monitor.end(entryId)

    // Track the error
    monitoring.captureError(error as Error, {
      action: name,
      component: 'performance_measurement',
      timestamp: Date.now(),
      additionalData: metadata
    })

    throw error
  }
}

// Utility function for measuring synchronous operations
export function measurePerformanceSync<T>(
  name: string,
  operation: () => T,
  metadata?: Record<string, unknown>
): T {
  const monitor = PerformanceMonitor.getInstance()
  const entryId = monitor.start(name, metadata)

  try {
    const result = operation()
    monitor.end(entryId)
    return result
  } catch (error) {
    monitor.end(entryId)

    // Track the error
    monitoring.captureError(error as Error, {
      action: name,
      component: 'performance_measurement',
      timestamp: Date.now(),
      additionalData: metadata
    })

    throw error
  }
}

// Helper function for database query performance tracking
export function trackDatabaseQuery<T>(
  queryName: string,
  operation: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<T> {
  return measurePerformance(`database.${queryName}`, operation, {
    type: 'database_query',
    ...metadata
  })
}

// Helper function for cache operation performance tracking
export function trackCacheOperation<T>(
  operationType: 'get' | 'set' | 'delete',
  cacheKey: string,
  operation: () => Promise<T> | T,
  metadata?: Record<string, unknown>
): Promise<T> {
  const operationName = `cache.${operationType}`

  if (operation instanceof Promise || typeof operation === 'function' && operation.constructor.name === 'AsyncFunction') {
    return measurePerformance(operationName, operation as () => Promise<T>, {
      cache_key: cacheKey,
      type: 'cache_operation',
      ...metadata
    })
  } else {
    return Promise.resolve(measurePerformanceSync(operationName, operation as () => T, {
      cache_key: cacheKey,
      type: 'cache_operation',
      ...metadata
    }))
  }
}

// Web Vitals tracking (client-side only)
export function trackWebVitals() {
  if (typeof window === 'undefined') return

  // Track FCP, LCP, CLS, FID using web-vitals if available
  if ('web-vitals' in window || typeof window !== 'undefined') {
    const monitor = PerformanceMonitor.getInstance()

    // Track navigation timing
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing
      const navigationStart = timing.navigationStart

      window.addEventListener('load', () => {
        const loadComplete = performance.now()
        monitor.start('page.load', { url: window.location.href })

        setTimeout(() => {
          const entryId = monitor.start('page.load_complete', { url: window.location.href })
          monitor.end(entryId)
        }, 0)
      })
    }
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance()