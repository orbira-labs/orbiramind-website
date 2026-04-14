import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbiramind.com'
  
  // Sadece public sayfalar (panel sayfaları hariç)
  const publicPages = [
    '',
    '/how-it-works',
    '/auth/login',
    '/auth/register',
    '/privacy',
    '/terms',
  ]

  return publicPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route.includes('auth') ? 0.8 : 0.6,
  }))
}
