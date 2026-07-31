import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'
import { logActivity } from '@/lib/logger'

// POST /api/admin/bulk
// body: { entity: 'business'|'news'|'event', action: 'publish'|'unpublish'|'delete', ids: string[] }
export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  const { entity, action, ids } = await req.json()
  if (!entity || !action || !Array.isArray(ids) || ids.length === 0) return apiError('Invalid request', 400)

  let count = 0

  if (entity === 'business') {
    if (action === 'delete') {
      const r = await prisma.business.updateMany({ where: { id: { in: ids } }, data: { isActive: false } })
      count = r.count
    } else if (action === 'publish') {
      const r = await prisma.business.updateMany({ where: { id: { in: ids } }, data: { isOpen: true } })
      count = r.count
    } else if (action === 'unpublish') {
      const r = await prisma.business.updateMany({ where: { id: { in: ids } }, data: { isOpen: false } })
      count = r.count
    }
  } else if (entity === 'news') {
    if (action === 'publish') {
      const r = await prisma.news.updateMany({ where: { id: { in: ids } }, data: { isPublished: true, publishedAt: new Date() } })
      count = r.count
    } else if (action === 'unpublish') {
      const r = await prisma.news.updateMany({ where: { id: { in: ids } }, data: { isPublished: false } })
      count = r.count
    } else if (action === 'delete') {
      const r = await prisma.news.deleteMany({ where: { id: { in: ids } } })
      count = r.count
    }
  } else if (entity === 'event') {
    if (action === 'publish') {
      const r = await prisma.event.updateMany({ where: { id: { in: ids } }, data: { isPublished: true } })
      count = r.count
    } else if (action === 'unpublish') {
      const r = await prisma.event.updateMany({ where: { id: { in: ids } }, data: { isPublished: false } })
      count = r.count
    } else if (action === 'delete') {
      const r = await prisma.event.deleteMany({ where: { id: { in: ids } } })
      count = r.count
    }
  }

  await logActivity(user, action as any, entity, '', `${count} items`, req)
  return apiSuccess({ count }, `${action} applied to ${count} items`)
}
