import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError, getPagination, paginatedResponse } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const { page, limit, skip } = getPagination(searchParams)
    const upcoming = searchParams.get('upcoming')
    const where = {
      isPublished: true,
      ...(upcoming === 'true' && { date: { gte: new Date() } }),
    }
    const [events, total] = await Promise.all([
      prisma.event.findMany({ where, skip, take: limit, orderBy: { date: 'asc' } }),
      prisma.event.count({ where }),
    ])
    return apiSuccess(paginatedResponse(events, total, page, limit))
  } catch (err) {
    return apiError('Internal server error', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)

    const body = await req.json()
    const { title, description, imageUrl, date, time, venue, organizer, isFree, isPublished } = body

    if (!title || !date || !venue) return apiError('Title, date and venue are required', 400)

    const event = await prisma.event.create({
      data: {
        title, description: description ?? '',
        imageUrl: imageUrl ?? '',
        date: new Date(date), time: time ?? '',
        venue, organizer: organizer ?? '',
        isFree: isFree ?? true,
        isPublished: isPublished ?? false,
      },
    })
    return apiSuccess(event, 'Event created', 201)
  } catch (err) {
    return apiError('Internal server error', 500)
  }
}
