import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  if (!q || q.length < 2) return apiSuccess([])

  const [businesses, places, news, events] = await Promise.all([
    prisma.business.findMany({ where: { isActive: true, name: { contains: q } }, take: 4, select: { id: true, name: true, category: true } }),
    prisma.place.findMany({ where: { isActive: true, name: { contains: q } }, take: 4, select: { id: true, name: true, category: true } }),
    prisma.news.findMany({ where: { title: { contains: q } }, take: 4, select: { id: true, title: true, category: true } }),
    prisma.event.findMany({ where: { title: { contains: q } }, take: 4, select: { id: true, title: true, venue: true } }),
  ])

  const results = [
    ...businesses.map(b => ({ id: b.id, label: b.name, sub: b.category, type: 'business', href: `/admin/businesses` })),
    ...places.map(p => ({ id: p.id, label: p.name, sub: p.category, type: 'place', href: `/admin/places` })),
    ...news.map(n => ({ id: n.id, label: n.title, sub: n.category, type: 'news', href: `/admin/news` })),
    ...events.map(e => ({ id: e.id, label: e.title, sub: e.venue, type: 'event', href: `/admin/events` })),
  ]

  return apiSuccess(results)
}
