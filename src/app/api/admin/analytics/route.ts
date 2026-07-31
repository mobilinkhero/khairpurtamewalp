import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)

    // Parallel queries
    const [
      totalBusinesses, totalPlaces, totalNews, totalEvents, totalEmergency,
      openBusinesses, featuredBusinesses,
      publishedNews, draftNews,
      publishedEvents, freeEvents,
      businessByCategory, placeByCategory, newsByCategory, eventsByCategory,
      recentBusinesses, recentNews, recentEvents,
    ] = await Promise.all([
      prisma.business.count({ where: { isActive: true } }),
      prisma.place.count({ where: { isActive: true } }),
      prisma.news.count({ where: { isPublished: true } }),
      prisma.event.count({ where: { isPublished: true } }),
      prisma.emergencyContact.count({ where: { isActive: true } }),

      prisma.business.count({ where: { isActive: true, isOpen: true } }),
      prisma.business.count({ where: { isActive: true, isFeatured: true } }),

      prisma.news.count({ where: { isPublished: true } }),
      prisma.news.count({ where: { isPublished: false } }),

      prisma.event.count({ where: { isPublished: true } }),
      prisma.event.count({ where: { isPublished: true, isFree: true } }),

      // Group by category for charts
      prisma.business.groupBy({ by: ['category'], _count: { id: true }, where: { isActive: true }, orderBy: { _count: { id: 'desc' } }, take: 8 }),
      prisma.place.groupBy({ by: ['category'], _count: { id: true }, where: { isActive: true }, orderBy: { _count: { id: 'desc' } } }),
      prisma.news.groupBy({ by: ['category'], _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
      prisma.event.groupBy({ by: ['organizer'], _count: { id: true }, where: { isPublished: true }, orderBy: { _count: { id: 'desc' } }, take: 6 }),

      // Recent items
      prisma.business.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, name: true, category: true, createdAt: true, rating: true } }),
      prisma.news.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, title: true, category: true, createdAt: true, isPublished: true } }),
      prisma.event.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, title: true, venue: true, date: true, isPublished: true } }),
    ])

    return apiSuccess({
      totals: { businesses: totalBusinesses, places: totalPlaces, news: totalNews, events: totalEvents, emergency: totalEmergency },
      businesses: {
        total: totalBusinesses,
        open: openBusinesses,
        closed: totalBusinesses - openBusinesses,
        featured: featuredBusinesses,
        byCategory: businessByCategory.map(r => ({ name: r.category, count: r._count.id })),
      },
      places: {
        total: totalPlaces,
        byCategory: placeByCategory.map(r => ({ name: r.category, count: r._count.id })),
      },
      news: {
        total: totalNews + draftNews,
        published: publishedNews,
        drafts: draftNews,
        byCategory: newsByCategory.map(r => ({ name: r.category, count: r._count.id })),
      },
      events: {
        total: totalEvents,
        free: freeEvents,
        paid: totalEvents - freeEvents,
        byOrganizer: eventsByCategory.map(r => ({ name: r.organizer, count: r._count.id })),
      },
      recent: { businesses: recentBusinesses, news: recentNews, events: recentEvents },
    })
  } catch (e) {
    console.error(e)
    return apiError('Internal server error', 500)
  }
}
