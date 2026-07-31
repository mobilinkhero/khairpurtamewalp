import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

export async function GET() {
  try {
    const contacts = await prisma.emergencyContact.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
    return apiSuccess(contacts)
  } catch (err) {
    return apiError('Internal server error', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)
    const body = await req.json()
    const { name, number, icon, color, sortOrder } = body
    if (!name || !number) return apiError('Name and number are required', 400)
    const contact = await prisma.emergencyContact.create({
      data: { name, number, icon: icon ?? 'phone', color: color ?? '#D32F2F', sortOrder: sortOrder ?? 0 },
    })
    return apiSuccess(contact, 'Emergency contact created', 201)
  } catch (err) {
    return apiError('Internal server error', 500)
  }
}
