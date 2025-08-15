import { Business } from '@/lib/supabase'
import BusinessCard from './BusinessCard'

interface BusinessGridProps {
  businesses: Business[]
  title?: string
  subtitle?: string
  className?: string
}

export default function BusinessGrid({ 
  businesses, 
  title, 
  subtitle, 
  className 
}: BusinessGridProps) {
  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
        <p className="text-gray-600">Check back soon for new business openings in Calgary!</p>
      </div>
    )
  }

  return (
    <section className={className}>
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{title}</h2>
          )}
          {subtitle && (
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
        {businesses.map((business) => (
          <BusinessCard 
            key={business.id} 
            business={business}
          />
        ))}
      </div>
    </section>
  )
}
