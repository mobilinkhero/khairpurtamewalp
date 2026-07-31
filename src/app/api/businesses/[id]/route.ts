import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

// ── GET /api/businesses/:id ───────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const business = await prisma.business.findUnique({ where: { id } })
    if (!business || !business.isActive) return apiError('Business not found', 404)
    return apiSuccess({ ...business, tags: JSON.parse(business.tags || '[]') })
  } catch (err) {
    console.error('[BUSINESSES GET ID]', err)
    return apiError('Internal server error', 500)
  }
}

// ── PUT /api/businesses/:id (admin only) ──────────────────────────────────────
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)

    const { id } = await params
    const body = await req.json()

    const updated = await prisma.business.update({
      where: { id },
      data: {
        ...body,
        tags: body.tags ? JSON.stringify(body.tags) : undefined,
        updatedAt: new Date(),
      },
    })

    return apiSuccess({ ...updated, tags: JSON.parse(updated.tags || '[]') }, 'Business updated')
  } catch (err) {
    console.error('[BUSINESSES PUT]', err)
    return apiError('Internal server error', 500)
  }
}

// ── DELETE /api/businesses/:id (admin only) ───────────────────────────────────
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)

    const { id } = await params
    // Soft delete
    await prisma.business.update({ where: { id }, data: { isActive: false } })
    return apiSuccess(null, 'Business deleted')
  } catch (err) {
    console.error('[BUSINESSES DELETE]', err)
    return apiError('Internal server error', 500)
  }
}
