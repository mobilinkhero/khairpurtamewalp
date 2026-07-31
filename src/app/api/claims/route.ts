import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { businessId, claimerName, claimerPhone } = await req.json()
    if (!businessId || !claimerName || !claimerPhone) return apiError('Missing fields', 400)

    const business = await prisma.business.findUnique({ where: { id: businessId } })
    if (!business) return apiError('Business not found', 404)

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 min expiry

    // Check if there's already a pending claim
    const existing = await prisma.claimRequest.findFirst({
      where: { businessId, status: { in: ['pending', 'verified'] } },
    })
    if (existing) return apiError('A claim request already exists for this business', 400)

    await prisma.claimRequest.create({
      data: { businessId, businessName: business.name, claimerName, claimerPhone, otp, otpExpiresAt },
    })

    // In production, send SMS via Twilio/etc. For now, log to console
    console.log(`[OTP] Your claim OTP for "${business.name}" is: ${otp}`)

    return apiSuccess({ message: 'OTP sent to your phone', otp }, 'OTP sent') // include OTP in dev
  } catch (e) { return apiError('Internal server error', 500) }
}
