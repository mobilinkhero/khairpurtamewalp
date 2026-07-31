import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { logActivity } from '@/lib/logger'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  if (user.role !== 'SUPER_ADMIN') return apiError('Forbidden', 403)
  const { id } = await params
  const { name, email, role, password } = await req.json()
  const data: any = {}
  if (name) data.name = name
  if (email) data.email = email
  if (role) data.role = role
  if (password) data.password = await bcrypt.hash(password, 12)
  const updated = await prisma.user.update({ where: { id }, data, select: { id: true, name: true, email: true, role: true, createdAt: true } })
  await logActivity(user, 'updated', 'user', id, updated.email, req)
  return apiSuccess(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  if (user.role !== 'SUPER_ADMIN') return apiError('Forbidden', 403)
  const { id } = await params
  if (id === user.userId) return apiError('Cannot delete yourself', 400)
  const target = await prisma.user.findUnique({ where: { id } })
  await prisma.user.delete({ where: { id } })
  await logActivity(user, 'deleted', 'user', id, target?.email || '', req)
  return apiSuccess(null, 'User deleted')
}
