import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbiramind.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/privacy', '/terms', '/auth/login', '/auth/register'],
        disallow: ['/api/', '/dashboard/', '/clients/', '/tests/', '/settings/', '/billing/', '/appointments/', '/engines/', '/onboarding/', '/t/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
