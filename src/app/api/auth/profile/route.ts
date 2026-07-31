import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { apiSuccess, apiError } from '@/lib/utils'

// GET /api/auth/profile — fetch current user
export async function GET(req: NextRequest) {
  try {
    const auth = await getUserFromRequest(req)
    if (!auth) return apiError('Unauthorized', 401)

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    if (!user) return apiError('User not found', 404)

    return apiSuccess(user)
  } catch {
    return apiError('Internal server error', 500)
  }
}

// PUT /api/auth/profile — update name / email / password
export async function PUT(req: NextRequest) {
  try {
    const auth = await getUserFromRequest(req)
    if (!auth) return apiError('Unauthorized', 401)

    const body = await req.json()
    const { name, email, currentPassword, newPassword } = body

    const user = await prisma.user.findUnique({ where: { id: auth.userId } })
    if (!user) return apiError('User not found', 404)

    // If changing password — verify current password first
    if (newPassword) {
      if (!currentPassword) return apiError('Current password is required', 400)
      const valid = await bcrypt.compare(currentPassword, user.password)
      if (!valid) return apiError('Current password is incorrect', 400)
      if (newPassword.length < 6) return apiError('New password must be at least 6 characters', 400)
    }

    // Check email not taken by another user
    if (email && email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) return apiError('Email already in use', 400)
    }

    const updated = await prisma.user.update({
      where: { id: auth.userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(newPassword && { password: await bcrypt.hash(newPassword, 12) }),
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    return apiSuccess(updated, 'Profile updated successfully')
  } catch {
    return apiError('Internal server error', 500)
  }
}
