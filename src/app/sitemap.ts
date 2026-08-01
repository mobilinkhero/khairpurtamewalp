import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const BASE = 'https://khairpurtamewali.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [businesses, places, news, events] = await Promise.all([
    prisma.business.findMany({ where: { isActive: true }, select: { id: true, updatedAt: true } }),
    prisma.place.findMany({ where: { isActive: true }, select: { id: true, updatedAt: true } }),
    prisma.news.findMany({ where: { isPublished: true }, select: { id: true, updatedAt: true } }),
    prisma.event.findMany({ where: { isPublished: true }, select: { id: true, updatedAt: true } }),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/businesses`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/places`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/emergency`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/map`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...businesses.map(b => ({ url: `${BASE}/businesses/${b.id}`, lastModified: b.updatedAt, changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...places.map(p => ({ url: `${BASE}/places/${p.id}`, lastModified: p.updatedAt, changeFrequency: 'weekly' as const, priority: 0.6 })),
    ...news.map(n => ({ url: `${BASE}/news/${n.id}`, lastModified: n.updatedAt, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...events.map(e => ({ url: `${BASE}/events/${e.id}`, lastModified: e.updatedAt, changeFrequency: 'weekly' as const, priority: 0.6 })),
  ]

  return [...staticRoutes, ...dynamicRoutes]
}
