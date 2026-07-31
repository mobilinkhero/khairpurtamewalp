import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'
import { logActivity } from '@/lib/logger'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  const banners = await prisma.banner.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] })
  return apiSuccess(banners)
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  const body = await req.json()
  if (!body.title || !body.imageUrl) return apiError('Title and image are required', 400)
  const banner = await prisma.banner.create({ data: body })
  await logActivity(user, 'created', 'banner', banner.id, banner.title, req)
  return apiSuccess(banner, 'Banner created')
}
