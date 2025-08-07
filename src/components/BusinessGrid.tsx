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
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
