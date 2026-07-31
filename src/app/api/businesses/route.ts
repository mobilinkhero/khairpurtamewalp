import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError, getPagination, paginatedResponse } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

// ── GET /api/businesses ───────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const { page, limit, skip } = getPagination(searchParams)
    const category = searchParams.get('category')
    const search   = searchParams.get('search')
    const featured = searchParams.get('featured')

    const where = {
      isActive: true,
      ...(category && category !== 'All' && { category }),
      ...(featured === 'true' && { isFeatured: true }),
      ...(search && {
        OR: [
          { name:        { contains: search } },
          { category:    { contains: search } },
          { description: { contains: search } },
          { address:     { contains: search } },
        ],
      }),
    }

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.business.count({ where }),
    ])

    // Parse JSON tags back to array
    const parsed = businesses.map((b) => ({
      ...b,
      tags: JSON.parse(b.tags || '[]'),
    }))

    return apiSuccess(paginatedResponse(parsed, total, page, limit))
  } catch (err) {
    console.error('[BUSINESSES GET]', err)
    return apiError('Internal server error', 500)
  }
}

// ── POST /api/businesses (admin only) ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)

    const body = await req.json()
    const { name, category, description, address, phone, imageUrl,
            rating, reviewCount, isOpen, workingHours, isFeatured,
            tags, lat, lng } = body

    if (!name || !category || !address || !phone) {
      return apiError('Name, category, address and phone are required', 400)
    }

    const business = await prisma.business.create({
      data: {
        name, category, description: description ?? '',
        address, phone, imageUrl: imageUrl ?? '',
        rating: rating ?? 0, reviewCount: reviewCount ?? 0,
        isOpen: isOpen ?? true,
        workingHours: workingHours ?? '',
        isFeatured: isFeatured ?? false,
        tags: JSON.stringify(tags ?? []),
        lat: lat ?? 0, lng: lng ?? 0,
      },
    })

    return apiSuccess({ ...business, tags: JSON.parse(business.tags) }, 'Business created', 201)
  } catch (err) {
    console.error('[BUSINESSES POST]', err)
    return apiError('Internal server error', 500)
  }
}
