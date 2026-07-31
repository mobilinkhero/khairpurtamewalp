import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  const updated = await prisma.fAQ.update({ where: { id }, data: await req.json() })
  return apiSuccess(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  await prisma.fAQ.delete({ where: { id } })
  return apiSuccess(null, 'Deleted')
}
