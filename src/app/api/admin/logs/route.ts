import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'
import { getPagination, paginatedResponse } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  const { searchParams } = new URL(req.url)
  const { page, limit, skip } = getPagination(searchParams)
  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.activityLog.count(),
  ])
  return apiSuccess(paginatedResponse(logs, total, page, limit))
}
