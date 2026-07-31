import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const place = await prisma.place.findUnique({ where: { id } })
    if (!place || !place.isActive) return apiError('Place not found', 404)
    return apiSuccess({ ...place, facilities: JSON.parse(place.facilities || '[]') })
  } catch (err) {
    return apiError('Internal server error', 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)
    const { id } = await params
    const body = await req.json()
    const updated = await prisma.place.update({
      where: { id },
      data: { ...body, facilities: body.facilities ? JSON.stringify(body.facilities) : undefined },
    })
    return apiSuccess({ ...updated, facilities: JSON.parse(updated.facilities || '[]') }, 'Place updated')
  } catch (err) {
    return apiError('Internal server error', 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)
    const { id } = await params
    await prisma.place.update({ where: { id }, data: { isActive: false } })
    return apiSuccess(null, 'Place deleted')
  } catch (err) {
    return apiError('Internal server error', 500)
  }
}
