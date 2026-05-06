import { MetadataRoute } from 'next'
import { getAllQuestions } from '@/lib/content'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://androidvault.example.com'
  const questions = getAllQuestions()
  
  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/questions`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Question routes
  const questionRoutes = questions.map((q) => ({
    url: `${baseUrl}/questions/${q.slug}`,
    lastModified: q.lastUpdated ? new Date(q.lastUpdated) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Category routes
  const categories = Array.from(new Set(questions.map((q) => q.category)))
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/categories/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...routes, ...categoryRoutes, ...questionRoutes]
}
