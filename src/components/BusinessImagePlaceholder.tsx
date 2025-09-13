import { Building, Camera, ImageIcon, Utensils, ShoppingBag, Briefcase, Heart, Music, Car, Dumbbell, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BusinessImagePlaceholderProps {
  businessName: string
  category?: string
  className?: string
  size?: 'small' | 'medium' | 'large'
}

function getCategoryIcon(category: string) {
  const iconMap = {
    restaurants: Utensils,
    retail: ShoppingBag,
    services: Briefcase,
    healthcare: Heart,
    entertainment: Music,
    automotive: Car,
    fitness: Dumbbell,
    beauty: Sparkles,
  }
  
  return iconMap[category as keyof typeof iconMap] || Building
}

function getCategoryGradient(category: string) {
  const gradientMap = {
    restaurants: 'from-red-400 to-orange-500',
    retail: 'from-blue-400 to-cyan-500',
    services: 'from-green-400 to-emerald-500',
    healthcare: 'from-purple-400 to-violet-500',
    entertainment: 'from-yellow-400 to-amber-500',
    automotive: 'from-slate-400 to-gray-500',
    fitness: 'from-orange-400 to-red-500',
    beauty: 'from-pink-400 to-rose-500',
  }
  
  return gradientMap[category as keyof typeof gradientMap] || 'from-gray-400 to-slate-500'
}

export default function BusinessImagePlaceholder({ 
  businessName, 
  category = 'services',
  className,
  size = 'medium'
}: BusinessImagePlaceholderProps) {
  const Icon = getCategoryIcon(category)
  const gradient = getCategoryGradient(category)
  
  const sizeClasses = {
    small: 'h-32',
    medium: 'h-48', 
    large: 'h-64'
  }
  
  const iconSizes = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  return (
    <div className={cn(
      'relative overflow-hidden bg-gradient-to-br',
      gradient,
      sizeClasses[size],
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <defs>
            <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="1" fill="currentColor" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)"/>
        </svg>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
        <Icon className={cn('mb-2', iconSizes[size])} />
        
        <h3 className="text-sm font-semibold text-center line-clamp-2 mb-1">
          {businessName}
        </h3>
        
        <div className="flex items-center gap-1 text-xs opacity-90">
          <Camera className="w-3 h-3" />
          <span>Photo Coming Soon</span>
        </div>
      </div>

      {/* Overlay for future image */}
      <div className="absolute inset-0 bg-black/10"></div>
    </div>
  )
}

// Gallery placeholder for multiple images
export function BusinessImageGallery({ 
  businessName, 
  category,
  imageCount = 3,
  className 
}: { 
  businessName: string
  category?: string
  imageCount?: number
  className?: string
}) {
  return (
    <div className={cn('grid grid-cols-3 gap-2', className)}>
      {/* Main image */}
      <div className="col-span-2">
        <BusinessImagePlaceholder 
          businessName={businessName}
          category={category}
          size="large"
        />
      </div>
      
      {/* Secondary images */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: Math.min(imageCount - 1, 2) }).map((_, index) => (
          <BusinessImagePlaceholder 
            key={index}
            businessName={`${businessName} Interior`}
            category={category}
            size="small"
          />
        ))}
      </div>
      
      {/* More images indicator */}
      {imageCount > 3 && (
        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs font-medium">
          +{imageCount - 3} more
        </div>
      )}
    </div>
  )
}

// Avatar/thumbnail placeholder
export function BusinessAvatarPlaceholder({ 
  businessName, 
  category,
  size = 48,
  className
}: { 
  businessName: string
  category?: string
  size?: number
  className?: string
}) {
  const Icon = getCategoryIcon(category || 'services')
  const gradient = getCategoryGradient(category || 'services')
  const initials = businessName
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-full bg-gradient-to-br flex items-center justify-center',
        gradient,
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* Show initials for smaller sizes, icon for larger */}
      {size < 64 ? (
        <span className="text-white font-semibold text-sm">
          {initials}
        </span>
      ) : (
        <Icon className="w-6 h-6 text-white" />
      )}
    </div>
  )
}