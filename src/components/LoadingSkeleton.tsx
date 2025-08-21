import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
}

export function BusinessCardSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse", className)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {/* Business name */}
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          {/* Category badge */}
          <div className="h-5 bg-gray-200 rounded w-20"></div>
        </div>
        {/* New badge placeholder */}
        <div className="h-6 bg-gray-200 rounded-full w-12 ml-2"></div>
      </div>

      {/* Location */}
      <div className="flex items-center mb-3">
        <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>

      {/* License info */}
      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

      {/* Bottom info */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center">
          <div className="h-3 w-3 bg-gray-200 rounded mr-1"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>

      {/* Hover effect bar */}
      <div className="h-1 bg-gray-200 rounded mt-4"></div>
    </div>
  )
}

export function BusinessGridSkeleton({ count = 6, className }: LoadingSkeletonProps & { count?: number }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <BusinessCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function SearchBarSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse", className)}>
      {/* Search input */}
      <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
      
      {/* Filter buttons */}
      <div className="flex gap-3">
        <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
      </div>
    </div>
  )
}

export function HeroSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("bg-gradient-to-br from-gray-300 to-gray-400 animate-pulse", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Icon placeholder */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full"></div>
          </div>
          
          {/* Title */}
          <div className="h-12 bg-white/20 rounded w-3/4 mx-auto mb-4"></div>
          
          {/* Subtitle */}
          <div className="h-6 bg-white/20 rounded w-2/3 mx-auto mb-8"></div>
          
          {/* Stats */}
          <div className="flex justify-center gap-6">
            <div className="h-5 bg-white/20 rounded w-24"></div>
            <div className="h-5 bg-white/20 rounded w-24"></div>
            <div className="h-5 bg-white/20 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CategorySkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("bg-white border-b border-gray-200 animate-pulse", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="text-center mb-6">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-48 mx-auto"></div>
        </div>
        
        {/* Category cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}