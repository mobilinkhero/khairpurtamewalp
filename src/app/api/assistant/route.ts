import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'

const keywords: Record<string, { type: string; field: string; value: string }> = {
  restaurant: { type: 'business', field: 'category', value: 'Restaurant' },
  'کھانا': { type: 'business', field: 'category', value: 'Restaurant' },
  hospital: { type: 'business', field: 'category', value: 'Hospital' },
  'ہسپتال': { type: 'business', field: 'category', value: 'Hospital' },
  doctor: { type: 'business', field: 'category', value: 'Doctor' },
  'ڈاکٹر': { type: 'business', field: 'category', value: 'Doctor' },
  pharmacy: { type: 'business', field: 'category', value: 'Pharmacy' },
  'دواخانہ': { type: 'business', field: 'category', value: 'Pharmacy' },
  school: { type: 'business', field: 'category', value: 'School' },
  'اسکول': { type: 'business', field: 'category', value: 'School' },
  mosque: { type: 'place', field: 'category', value: 'Mosque' },
  'مسجد': { type: 'place', field: 'category', value: 'Mosque' },
  park: { type: 'place', field: 'category', value: 'Park' },
  'پارک': { type: 'place', field: 'category', value: 'Park' },
  market: { type: 'business', field: 'category', value: 'Market' },
  'بازار': { type: 'business', field: 'category', value: 'Market' },
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()
    if (!query || query.trim().length < 2) return apiError('Query too short', 400)

    const lower = query.toLowerCase()
    let matched: { type: string; field: string; value: string } | null = null

    for (const [word, mapping] of Object.entries(keywords)) {
      if (lower.includes(word)) { matched = mapping; break }
    }

    let results: any[] = []
    let response = ''

    if (matched) {
      if (matched.type === 'business') {
        results = await prisma.business.findMany({
          where: { category: { contains: matched.value }, isActive: true },
          take: 5,
        })
      } else {
        results = await prisma.place.findMany({
          where: { category: { contains: matched.value }, isActive: true },
          take: 5,
        })
      }
      response = results.length > 0
        ? `I found ${results.length} ${matched.value}(s). ${results.map((r: any) => r.name).join(', ')}`
        : `Sorry, I couldn't find any ${matched.value} near you.`
    } else {
      // Fallback: search businesses by name
      results = await prisma.business.findMany({
        where: { name: { contains: query, mode: 'insensitive' }, isActive: true },
        take: 5,
      })
      response = results.length > 0
        ? `Here's what I found: ${results.map((r: any) => r.name).join(', ')}`
        : 'I didn\'t understand. Try asking like "Find restaurants" or "Show me hospitals".'
    }

    return apiSuccess({ response, results, matched: matched?.value || null })
  } catch (e) { return apiError('Internal server error', 500) }
}
