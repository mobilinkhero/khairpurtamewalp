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

    const where = {
      isActive: true,
      ...(category && category !== 'All' && { category }),
      ...(search && {
        OR: [
          { name:        { contains: search } },
          { category:    { contains: search } },
          { description: { contains: search } },
        ],
      }),
    }

    const [places, total] = await Promise.all([
      prisma.place.findMany({ where, skip, take: limit, orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }] }),
      prisma.place.count({ where }),
    ])

    const parsed = places.map((p) => ({ ...p, facilities: JSON.parse(p.facilities || '[]') }))
    return apiSuccess(paginatedResponse(parsed, total, page, limit))
  } catch (err) {
    console.error('[PLACES GET]', err)
    return apiError('Internal server error', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)

    const body = await req.json()
    const { name, category, description, address, imageUrl, facilities, isFeatured, phone, lat, lng, distance } = body

    if (!name || !category || !address) return apiError('Name, category and address are required', 400)

    const place = await prisma.place.create({
      data: {
        name, category,
        description: description ?? '',
        address, imageUrl: imageUrl ?? '',
        facilities: JSON.stringify(facilities ?? []),
        isFeatured: isFeatured ?? false,
        phone: phone ?? '',
        lat: lat ?? 0, lng: lng ?? 0,
        distance: distance ?? '--',
      },
    })

    return apiSuccess({ ...place, facilities: JSON.parse(place.facilities) }, 'Place created', 201)
  } catch (err) {
    console.error('[PLACES POST]', err)
    return apiError('Internal server error', 500)
  }
}
