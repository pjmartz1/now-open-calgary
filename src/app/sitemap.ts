import { MetadataRoute } from 'next'
import { BusinessService } from '@/services/businessService'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nowopencalgary.ca'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/businesses`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/restaurants`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/retail`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ]

  // Get all businesses for dynamic sitemap entries
  let businessPages: MetadataRoute.Sitemap = []
  
  try {
    const { businesses } = await BusinessService.getAllCalgaryBusinesses({
      limit: 1000, // Get all businesses for sitemap
      offset: 0
    })

    businessPages = businesses.map((business) => ({
      url: `${baseUrl}/business/${business.slug}`,
      lastModified: new Date(business.updatedAt || business.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error generating business sitemap entries:', error)
  }

  return [...staticPages, ...businessPages]
}
