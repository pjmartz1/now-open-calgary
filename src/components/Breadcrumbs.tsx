'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  // Generate structured data for breadcrumbs (SEO)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.nowopencalgary.ca/"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        ...(item.href && !item.current && {
          "item": `https://www.nowopencalgary.ca${item.href}`
        })
      }))
    ]
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <nav aria-label="Breadcrumb navigation" className={cn("flex", className)} role="navigation">
        <ol className="flex items-center space-x-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
          {/* Home Link */}
          <li className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link
              href="/"
              className="text-gray-500 hover:text-indigo-600 transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-sm"
              itemProp="item"
              aria-label="Go to homepage"
            >
              <Home className="w-4 h-4" />
              <span className="sr-only" itemProp="name">Home</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>

          {/* Breadcrumb Items */}
          {items.map((item, index) => (
            <li 
              key={index} 
              className="flex items-center" 
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" aria-hidden="true" />
              {item.href && !item.current ? (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-indigo-600 transition-colors truncate max-w-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-sm"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <>
                  <span
                    className={cn(
                      "truncate max-w-[200px]",
                      item.current 
                        ? "text-gray-900 font-medium" 
                        : "text-gray-500"
                    )}
                    aria-current={item.current ? "page" : undefined}
                    itemProp="name"
                  >
                    {item.label}
                  </span>
                  {item.href && <meta itemProp="item" content={`https://www.nowopencalgary.ca${item.href}`} />}
                </>
              )}
              <meta itemProp="position" content={String(index + 2)} />
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

// Mobile-optimized breadcrumb component (shows only last 2 items on mobile)
export function MobileBreadcrumbs({ items, className }: BreadcrumbsProps) {
  const mobileItems = items.length > 2 ? items.slice(-2) : items

  return (
    <div className={cn("md:hidden", className)}>
      <Breadcrumbs items={mobileItems} />
      {items.length > 2 && (
        <div className="text-xs text-gray-400 mt-1 flex items-center">
          <span>...</span>
          <ChevronRight className="w-3 h-3 mx-1" />
          <span>{items.length - 2} more levels</span>
        </div>
      )}
    </div>
  )
}

// Responsive breadcrumb wrapper
export function ResponsiveBreadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <>
      {/* Desktop: Full breadcrumbs */}
      <div className={cn("hidden md:block", className)}>
        <Breadcrumbs items={items} />
      </div>
      
      {/* Mobile: Simplified breadcrumbs */}
      <MobileBreadcrumbs items={items} className={className} />
    </>
  )
}

// Utility function to generate category breadcrumbs
export function getCategoryBreadcrumbs(category: string): BreadcrumbItem[] {
  const categoryLabels: Record<string, string> = {
    restaurants: 'Restaurants',
    retail: 'Retail',
    services: 'Services',
    healthcare: 'Healthcare',
    beauty: 'Beauty',
    fitness: 'Fitness',
    entertainment: 'Entertainment',
    automotive: 'Automotive',
  }

  return [
    { label: 'Categories', href: '/businesses' },
    { label: categoryLabels[category] || category, current: true }
  ]
}

// Generate breadcrumbs for search results
export function getSearchBreadcrumbs(searchTerm: string): BreadcrumbItem[] {
  return [
    { label: 'All Businesses', href: '/businesses' },
    { label: `"${searchTerm}"`, current: true }
  ]
}

// Generate breadcrumbs with back navigation
export function getBackNavigationBreadcrumbs(
  currentPage: string,
  backUrl: string,
  backLabel: string
): BreadcrumbItem[] {
  return [
    { label: backLabel, href: backUrl },
    { label: currentPage, current: true }
  ]
}

