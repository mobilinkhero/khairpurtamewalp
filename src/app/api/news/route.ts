import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError, getPagination, paginatedResponse } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const { page, limit, skip } = getPagination(searchParams)
    const category = searchParams.get('category')
    const search   = searchParams.get('search')
    // Public API only returns published news
    const where = {
      isPublished: true,
      ...(category && { category }),
      ...(search && { OR: [{ title: { contains: search } }, { summary: { contains: search } }] }),
    }
    const [news, total] = await Promise.all([
      prisma.news.findMany({ where, skip, take: limit, orderBy: { publishedAt: 'desc' } }),
      prisma.news.count({ where }),
    ])
    return apiSuccess(paginatedResponse(news, total, page, limit))
  } catch (err) {
    return apiError('Internal server error', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)

    const body = await req.json()
    const { title, summary, content, imageUrl, category, author, isPublished } = body

    if (!title || !content) return apiError('Title and content are required', 400)

    const news = await prisma.news.create({
      data: {
        title, summary: summary ?? '', content,
        imageUrl: imageUrl ?? '', category: category ?? 'General',
        author: author ?? user.email,
        isPublished: isPublished ?? false,
        publishedAt: isPublished ? new Date() : null,
      },
    })
    return apiSuccess(news, 'News created', 201)
  } catch (err) {
    return apiError('Internal server error', 500)
  }
}
