'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ImageIcon, AlertTriangle } from 'lucide-react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
  fallbackSrc?: string
  sizes?: string
}

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  fallbackSrc,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: OptimizedImageProps) => {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleLoad = useCallback(() => {
    setIsLoading(false)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setImageError(true)
    setIsLoading(false)
    onError?.()
  }, [onError])

  // Generate WebP sources for modern browsers
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
  const isWebP = src.toLowerCase().includes('.webp')

  if (imageError) {
    // Show fallback image or placeholder
    if (fallbackSrc) {
      return (
        <OptimizedImage
          {...{ width, height, className, sizes, alt }}
          src={fallbackSrc}
          onError={() => setImageError(true)}
        />
      )
    }

    // Show error placeholder
    return (
      <div className={cn(
        'flex items-center justify-center bg-gray-100 text-gray-400',
        className
      )} style={{ width, height }}>
        <div className="text-center">
          <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
          <p className="text-xs">Image not available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className={cn(
          'absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center',
          className
        )}>
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}

      {/* Next.js Image component with optimization */}
      <Image
        src={isWebP ? src : webpSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        quality={85}
        onLoad={handleLoad}
        onError={() => {
          // Fallback to original format if WebP fails
          if (!isWebP && src !== webpSrc) {
            const img = document.createElement('img')
            img.src = src
            img.onload = handleLoad
            img.onerror = handleError
          } else {
            handleError()
          }
        }}
        style={{
          objectFit: 'cover',
          ...(width && height && { width, height })
        }}
      />
    </div>
  )
}

// Specialized components for different use cases

export const BusinessImage = ({
  src,
  businessName,
  ...props
}: Omit<OptimizedImageProps, 'alt'> & { businessName: string }) => (
  <OptimizedImage
    {...props}
    src={src}
    alt={`Photo of ${businessName}`}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 300px, 250px"
  />
)

export const HeroImage = ({
  src,
  ...props
}: Omit<OptimizedImageProps, 'alt' | 'priority'>) => (
  <OptimizedImage
    {...props}
    src={src}
    alt="Calgary business hero image"
    priority
    sizes="(max-width: 768px) 100vw, 1200px"
  />
)

export const CategoryImage = ({
  src,
  category,
  ...props
}: Omit<OptimizedImageProps, 'alt'> & { category: string }) => (
  <OptimizedImage
    {...props}
    src={src}
    alt={`${category} businesses in Calgary`}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 400px, 300px"
  />
)

export default OptimizedImage