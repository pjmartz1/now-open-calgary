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
  return (
    <nav aria-label="Breadcrumb" className={cn("flex", className)}>
      <ol className="flex items-center space-x-2 text-sm">
        {/* Home Link */}
        <li className="flex items-center">
          <Link
            href="/"
            className="text-gray-500 hover:text-indigo-600 transition-colors flex items-center"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {/* Breadcrumb Items */}
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            {item.href && !item.current ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-indigo-600 transition-colors truncate max-w-[200px]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "truncate max-w-[200px]",
                  item.current 
                    ? "text-gray-900 font-medium" 
                    : "text-gray-500"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
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

