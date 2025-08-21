'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { BusinessCardData } from '@/services/businessService'
import CalgaryBusinessGrid from './CalgaryBusinessGrid'
import { BusinessGridSkeleton } from './LoadingSkeleton'

interface LazyBusinessGridProps {
  businesses: BusinessCardData[]
  title?: string
  subtitle?: string
  className?: string
  itemsPerPage?: number
}

export default function LazyBusinessGrid({ 
  businesses, 
  title, 
  subtitle, 
  className,
  itemsPerPage = 6
}: LazyBusinessGridProps) {
  const [displayedBusinesses, setDisplayedBusinesses] = useState<BusinessCardData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const observerRef = useRef<HTMLDivElement>(null)

  // Initialize with first page
  useEffect(() => {
    setIsLoading(true)
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      setDisplayedBusinesses(businesses.slice(0, itemsPerPage))
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [businesses, itemsPerPage])

  const loadMoreBusinesses = useCallback(() => {
    const nextPage = currentPage + 1
    const startIndex = (nextPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    if (startIndex < businesses.length) {
      setIsLoading(true)
      // Simulate loading delay
      setTimeout(() => {
        const newBusinesses = businesses.slice(startIndex, endIndex)
        setDisplayedBusinesses(prev => [...prev, ...newBusinesses])
        setCurrentPage(nextPage)
        setIsLoading(false)
      }, 500)
    }
  }, [currentPage, businesses, itemsPerPage])

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isLoading) {
          loadMoreBusinesses()
        }
      },
      { threshold: 0.1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [isLoading, currentPage, businesses.length, loadMoreBusinesses])

  const hasMore = displayedBusinesses.length < businesses.length

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
        <p className="text-gray-600">Check back soon for new business openings in Calgary!</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
      )}
      
      <CalgaryBusinessGrid businesses={displayedBusinesses} />
      
      {/* Loading indicator for additional items */}
      {isLoading && hasMore && (
        <div className="mt-8">
          <BusinessGridSkeleton count={Math.min(itemsPerPage, businesses.length - displayedBusinesses.length)} />
        </div>
      )}
      
      {/* Intersection observer trigger */}
      {hasMore && (
        <div ref={observerRef} className="h-20 flex items-center justify-center">
          {!isLoading && (
            <div className="text-gray-500 text-sm">
              Scroll for more businesses...
            </div>
          )}
        </div>
      )}
      
      {/* End indicator */}
      {!hasMore && displayedBusinesses.length > itemsPerPage && (
        <div className="text-center mt-8 py-4 text-gray-500 text-sm">
          You&apos;ve seen all {businesses.length} businesses
        </div>
      )}
    </div>
  )
}