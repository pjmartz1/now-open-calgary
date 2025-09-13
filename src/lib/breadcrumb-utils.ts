export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

// Utility function to generate business detail breadcrumbs
export function getBusinessBreadcrumbs(
  businessName: string, 
  category?: string,
  searchContext?: {
    search?: string
    category?: string
    community?: string
  }
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = []

  // If we have search context, show search-aware breadcrumbs
  if (searchContext?.search || searchContext?.category || searchContext?.community) {
    // Build the search URL with parameters
    const searchParams = new URLSearchParams()
    if (searchContext.search) searchParams.set('search', searchContext.search)
    if (searchContext.category) searchParams.set('category', searchContext.category)
    if (searchContext.community) searchParams.set('community', searchContext.community)
    
    const searchUrl = `/businesses?${searchParams.toString()}`
    
    // Create a descriptive label for the search context
    let searchLabel = 'Search Results'
    if (searchContext.search) {
      searchLabel = `"${searchContext.search}"`
    } else if (searchContext.category) {
      const categoryLabels: Record<string, string> = {
        'restaurants': 'Restaurants',
        'retail': 'Retail',
        'services': 'Services',
        'healthcare': 'Healthcare',
        'entertainment': 'Entertainment',
        'beauty': 'Beauty',
        'fitness': 'Fitness',
        'automotive': 'Automotive'
      }
      searchLabel = categoryLabels[searchContext.category] || searchContext.category
    }
    
    breadcrumbs.push({
      label: 'All Businesses',
      href: '/businesses'
    })
    
    breadcrumbs.push({
      label: searchLabel,
      href: searchUrl
    })
  } else {
    // Default breadcrumbs without search context
    breadcrumbs.push({ label: 'Categories', href: '/businesses' })

    if (category) {
      const categoryLabels: Record<string, string> = {
        'restaurants': 'Restaurants',
        'retail': 'Retail',
        'services': 'Services',
        'healthcare': 'Healthcare',
        'entertainment': 'Entertainment',
        'beauty': 'Beauty',
        'fitness': 'Fitness',
        'automotive': 'Automotive'
      }

      const categoryLabel = categoryLabels[category] || category
      breadcrumbs.push({
        label: categoryLabel,
        href: `/${category}`
      })
    }
  }

  // Add current business (no href because it's the current page)
  breadcrumbs.push({
    label: businessName,
    current: true
  })

  return breadcrumbs
}