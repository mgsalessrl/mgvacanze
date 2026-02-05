import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mgvacanze.com'

  const routes = [
    '',
    '/itinerari',
    '/servizi',
    '/contact',
    '/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const boatRoutes = [
    '/noleggio-yacht/elyvian-breeze',
    '/noleggio-catamarano/elyvian-spirit',
    '/noleggio-catamarano/elyvian-dream',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...routes, ...boatRoutes]
}
