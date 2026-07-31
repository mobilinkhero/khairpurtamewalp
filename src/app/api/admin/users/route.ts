import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { logActivity } from '@/lib/logger'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  if (user.role !== 'SUPER_ADMIN') return apiError('Forbidden', 403)
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }, orderBy: { createdAt: 'asc' } })
  return apiSuccess(users)
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  if (user.role !== 'SUPER_ADMIN') return apiError('Forbidden — only Super Admin can create users', 403)
  const { name, email, password, role } = await req.json()
  if (!name || !email || !password) return apiError('Name, email and password are required', 400)
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return apiError('Email already exists', 400)
  const newUser = await prisma.user.create({
    data: { name, email, password: await bcrypt.hash(password, 12), role: role || 'ADMIN' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })
  await logActivity(user, 'created', 'user', newUser.id, newUser.email, req)
  return apiSuccess(newUser, 'Admin user created')
}
