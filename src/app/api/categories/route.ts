import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
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
