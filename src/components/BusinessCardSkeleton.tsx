import { Skeleton } from './ui/Skeleton'

export default function BusinessCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 h-full flex flex-col">
        {/* Title and New Badge Row - Fixed Height */}
        <div className="flex items-start justify-between mb-4 min-h-[2.5rem]">
          <div className="flex-1 pr-3">
            <Skeleton className="h-6 w-3/4 mb-1" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <Skeleton className="h-6 w-12 rounded-full flex-shrink-0" />
        </div>

        {/* Category Badge - Fixed Height */}
        <div className="mb-4 h-6 flex items-start">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Location - Fixed Height */}
        <div className="flex items-start mb-4 min-h-[1.25rem]">
          <Skeleton className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* License info - Fixed Height */}
        <div className="mb-4 min-h-[2.5rem] flex-grow">
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Bottom info - Fixed Height at bottom */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center">
            <Skeleton className="w-3 h-3 mr-1 flex-shrink-0" />
            <Skeleton className="h-3 w-24" />
          </div>
          
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Hover effect bar */}
      <div className="h-1 bg-gray-100"></div>
    </div>
  )
}

export function BusinessGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <BusinessCardSkeleton key={i} />
        ))}
      </div>
    </section>
  )
}