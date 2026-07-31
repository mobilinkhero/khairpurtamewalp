import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const news = await prisma.news.findUnique({ where: { id, isPublished: true } })
    if (!news) return apiError('News not found', 404)
    return apiSuccess(news)
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
    const updated = await prisma.news.update({
      where: { id },
      data: {
        ...body,
        publishedAt: body.isPublished ? new Date() : undefined,
      },
    })
    return apiSuccess(updated, 'News updated')
  } catch (err) {
    return apiError('Internal server error', 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)
    const { id } = await params
    await prisma.news.delete({ where: { id } })
    return apiSuccess(null, 'News deleted')
  } catch (err) {
    return apiError('Internal server error', 500)
  }
}
