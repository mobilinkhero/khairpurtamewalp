import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  const { status } = await req.json()
  if (!['approved', 'rejected'].includes(status)) return apiError('Invalid status', 400)

  const claim = await prisma.claimRequest.update({ where: { id }, data: { status } })
  return apiSuccess(claim, `Claim ${status}`)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  await prisma.claimRequest.delete({ where: { id } })
  return apiSuccess(null, 'Deleted')
}
