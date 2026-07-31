import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { signToken } from '@/lib/auth'
import { apiSuccess, apiError } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return apiError('Email and password are required', 400)
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return apiError('Invalid credentials', 401)

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return apiError('Invalid credentials', 401)

    const token = await signToken({ userId: user.id, email: user.email, role: user.role })

    const response = apiSuccess(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      'Login successful'
    )

    // Set HTTP-only cookie
    const headers = new Headers(response.headers)
    headers.append(
      'Set-Cookie',
      `admin_token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    )

    return new Response(response.body, { status: response.status, headers })
  } catch (err) {
    console.error('[AUTH LOGIN]', err)
    return apiError('Internal server error', 500)
  }
}
