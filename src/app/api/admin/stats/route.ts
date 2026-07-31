import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)

    const [businesses, places, news, events, emergency] = await Promise.all([
      prisma.business.count({ where: { isActive: true } }),
      prisma.place.count({ where: { isActive: true } }),
      prisma.news.count({ where: { isPublished: true } }),
      prisma.event.count({ where: { isPublished: true } }),
      prisma.emergencyContact.count({ where: { isActive: true } }),
    ])

    return apiSuccess({ businesses, places, news, events, emergency })
  } catch (err) {
    return apiError('Internal server error', 500)
  }
}
