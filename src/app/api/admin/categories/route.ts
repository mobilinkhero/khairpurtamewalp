import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const categories = await prisma.category.findMany({
      where: { ...(type ? { type } : {}), isActive: true },
      orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    })
    return apiSuccess(categories)
  } catch (e) {
    return apiError('Internal server error', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)

    const body = await req.json()
    const { name, type, color, icon, sortOrder } = body
    if (!name || !type) return apiError('Name and type are required', 400)

    const category = await prisma.category.create({
      data: { name: name.trim(), type, color: color ?? '#1B5E20', icon: icon ?? '📁', sortOrder: sortOrder ?? 0 },
    })
    return apiSuccess(category, 'Category created')
  } catch (e: any) {
    if (e.code === 'P2002') return apiError('Category already exists for this type', 400)
    return apiError('Internal server error', 500)
  }
}
