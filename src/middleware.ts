import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Routes that require admin login
const PROTECTED_PATHS = ['/admin']
const AUTH_PATH = '/admin/login'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only run on /admin paths (skip /admin/login itself)
  const isAdminPath = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  if (!isAdminPath || pathname === AUTH_PATH) return NextResponse.next()

  // Check for token in cookie
  const token = req.cookies.get('admin_token')?.value
  if (!token) {
    return NextResponse.redirect(new URL(AUTH_PATH, req.url))
  }

  const payload = await verifyToken(token)
  if (!payload) {
    const response = NextResponse.redirect(new URL(AUTH_PATH, req.url))
    response.cookies.delete('admin_token')
    return response
  }

  // Attach user info to headers for server components
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-user-id', payload.userId)
  requestHeaders.set('x-user-role', payload.role)

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/admin/:path*'],
}
