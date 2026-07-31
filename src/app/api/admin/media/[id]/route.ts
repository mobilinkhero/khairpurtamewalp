import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'
import { unlink } from 'fs/promises'
import path from 'path'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  const body = await req.json()
  const file = await prisma.mediaFile.update({ where: { id }, data: body })
  return apiSuccess(file, 'Updated')
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params

  const file = await prisma.mediaFile.findUnique({ where: { id } })
  if (!file) return apiError('Not found', 404)

  // Delete physical file if it's a local upload
  if (file.url.startsWith('/uploads/')) {
    const filePath = path.join(process.cwd(), 'public', file.url)
    try { await unlink(filePath) } catch { /* file may already be gone */ }
  }

  await prisma.mediaFile.delete({ where: { id } })
  return apiSuccess(null, 'Deleted')
}
