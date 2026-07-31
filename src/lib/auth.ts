import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-secret-change-in-production'
)

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

// ── Sign a token ──────────────────────────────────────────────────────────────
export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

// ── Verify a token ────────────────────────────────────────────────────────────
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

// ── Get current user from cookie (server components) ─────────────────────────
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return null
  return verifyToken(token)
}

// ── Get token from request (API routes) ───────────────────────────────────────
export async function getUserFromRequest(req: NextRequest): Promise<JWTPayload | null> {
  // Check Authorization header first
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return verifyToken(authHeader.slice(7))
  }
  // Then check cookie
  const token = req.cookies.get('admin_token')?.value
  if (token) return verifyToken(token)
  return null
}
