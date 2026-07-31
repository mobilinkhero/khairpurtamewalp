import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  const items = await prisma.fAQ.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] })
  return apiSuccess(items)
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  const body = await req.json()
  if (!body.question || !body.answer) return apiError('Question and answer are required', 400)
  const item = await prisma.fAQ.create({ data: body })
  return apiSuccess(item, 'FAQ created')
}
