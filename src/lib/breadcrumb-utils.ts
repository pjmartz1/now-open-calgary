export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

// Utility function to generate business detail breadcrumbs
export function getBusinessBreadcrumbs(
  businessName: string, 
  category?: string
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Categories', href: '/businesses' }
  ]

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

  // Add current business (no href because it's the current page)
  breadcrumbs.push({
    label: businessName,
    current: true
  })

  return breadcrumbs
}