import React, { useState, useRef, useEffect } from 'react';
import { getBusinessImage, getPlaceholderColor } from '../services/imageService';

interface BusinessImageProps {
  businessType: string;
  businessName: string;
  className?: string;
  priority?: boolean;
}

export const BusinessImage: React.FC<BusinessImageProps> = ({
  businessType,
  businessName,
  className = '',
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const businessImage = getBusinessImage(businessType);
  const placeholderColor = getPlaceholderColor(businessType);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip lazy loading for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before image comes into view
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
      observerRef.current = observer;
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Show placeholder while loading or on error
  if (!isInView || hasError) {
    return (
      <div 
        className={`${placeholderColor} ${className} flex items-center justify-center`}
        style={{ aspectRatio: '4/3' }}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">🏢</div>
          <div className="text-xs text-gray-600 font-medium">
            {businessType}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: '4/3' }}>
      {/* Placeholder */}
      {!isLoaded && (
        <div 
          className={`absolute inset-0 ${placeholderColor} flex items-center justify-center`}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">🏢</div>
            <div className="text-xs text-gray-600 font-medium">
              {businessType}
            </div>
          </div>
        </div>
      )}

      {/* Actual Image */}
      <img
        ref={imgRef}
        src={businessImage.url}
        alt={businessImage.alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
      />

      {/* Loading Spinner */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      )}
    </div>
  );
}; 