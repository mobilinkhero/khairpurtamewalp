import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

function toCSV(rows: Record<string, any>[]): string {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const lines = [
    headers.join(','),
    ...rows.map(row => headers.map(h => {
      const val = row[h] === null || row[h] === undefined ? '' : String(row[h])
      return `"${val.replace(/"/g, '""')}"`
    }).join(',')),
  ]
  return lines.join('\n')
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)

  const { searchParams } = new URL(req.url)
  const entity = searchParams.get('entity') ?? 'businesses'

  let rows: any[] = []
  let filename = entity

  if (entity === 'businesses') {
    rows = await prisma.business.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } })
    rows = rows.map(r => ({ id: r.id, name: r.name, category: r.category, address: r.address, phone: r.phone, rating: r.rating, isOpen: r.isOpen, isFeatured: r.isFeatured, workingHours: r.workingHours, createdAt: r.createdAt }))
  } else if (entity === 'places') {
    rows = await prisma.place.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } })
    rows = rows.map(r => ({ id: r.id, name: r.name, category: r.category, address: r.address, phone: r.phone, isFeatured: r.isFeatured, distance: r.distance, createdAt: r.createdAt }))
  } else if (entity === 'news') {
    rows = await prisma.news.findMany({ orderBy: { createdAt: 'desc' } })
    rows = rows.map(r => ({ id: r.id, title: r.title, category: r.category, author: r.author, isPublished: r.isPublished, publishedAt: r.publishedAt, createdAt: r.createdAt }))
  } else if (entity === 'events') {
    rows = await prisma.event.findMany({ orderBy: { date: 'desc' } })
    rows = rows.map(r => ({ id: r.id, title: r.title, date: r.date, time: r.time, venue: r.venue, organizer: r.organizer, isFree: r.isFree, isPublished: r.isPublished, createdAt: r.createdAt }))
  }

  const csv = toCSV(rows)
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
