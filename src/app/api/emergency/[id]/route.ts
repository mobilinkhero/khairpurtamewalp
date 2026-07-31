import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)
    const { id } = await params
    const body = await req.json()
    const updated = await prisma.emergencyContact.update({ where: { id }, data: body })
    return apiSuccess(updated, 'Contact updated')
  } catch (err) {
    return apiError('Internal server error', 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)
    const { id } = await params
    await prisma.emergencyContact.update({ where: { id }, data: { isActive: false } })
    return apiSuccess(null, 'Contact deleted')
  } catch (err) {
    return apiError('Internal server error', 500)
  }
}
