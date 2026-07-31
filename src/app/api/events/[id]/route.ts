import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const event = await prisma.event.findUnique({ where: { id, isPublished: true } })
    if (!event) return apiError('Event not found', 404)
    return apiSuccess(event)
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
    const updated = await prisma.event.update({
      where: { id },
      data: { ...body, date: body.date ? new Date(body.date) : undefined },
    })
    return apiSuccess(updated, 'Event updated')
  } catch (err) {
    return apiError('Internal server error', 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)
    const { id } = await params
    await prisma.event.delete({ where: { id } })
    return apiSuccess(null, 'Event deleted')
  } catch (err) {
    return apiError('Internal server error', 500)
  }
}
