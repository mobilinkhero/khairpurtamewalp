import { apiSuccess } from '@/lib/utils'

export async function POST() {
  const response = apiSuccess(null, 'Logged out successfully')
  const headers = new Headers(response.headers)
  headers.append('Set-Cookie', 'admin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax')
  return new Response(response.body, { status: response.status, headers })
}
