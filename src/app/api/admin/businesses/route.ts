import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError, getPagination, paginatedResponse } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

// Admin endpoint — returns ALL businesses including inactive
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)

    const { searchParams } = req.nextUrl
    const { page, limit, skip } = getPagination(searchParams)
    const search = searchParams.get('search')

    const where = search
      ? { OR: [{ name: { contains: search } }, { category: { contains: search } }] }
      : {}

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.business.count({ where }),
    ])

    const parsed = businesses.map((b) => ({ ...b, tags: JSON.parse(b.tags || '[]') }))
    return apiSuccess(paginatedResponse(parsed, total, page, limit))
  } catch (err) {
    return apiError('Internal server error', 500)
  }
}
