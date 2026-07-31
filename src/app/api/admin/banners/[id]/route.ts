import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'
import { logActivity } from '@/lib/logger'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  const body = await req.json()
  const banner = await prisma.banner.update({ where: { id }, data: body })
  await logActivity(user, 'updated', 'banner', banner.id, banner.title, req)
  return apiSuccess(banner, 'Updated')
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  const banner = await prisma.banner.findUnique({ where: { id } })
  await prisma.banner.delete({ where: { id } })
  await logActivity(user, 'deleted', 'banner', id, banner?.title || '', req)
  return apiSuccess(null, 'Deleted')
}
