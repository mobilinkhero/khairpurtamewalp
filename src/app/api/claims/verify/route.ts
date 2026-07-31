import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { businessId, otp } = await req.json()
    if (!businessId || !otp) return apiError('Missing fields', 400)

    const claim = await prisma.claimRequest.findFirst({
      where: { businessId, status: 'pending' },
      orderBy: { createdAt: 'desc' },
    })
    if (!claim) return apiError('No pending claim found', 404)
    if (claim.otp !== otp) return apiError('Invalid OTP', 400)
    if (new Date() > claim.otpExpiresAt) return apiError('OTP expired', 400)

    await prisma.claimRequest.update({ where: { id: claim.id }, data: { status: 'verified' } })
    return apiSuccess({ message: 'Phone verified successfully' }, 'Verified')
  } catch (e) { return apiError('Internal server error', 500) }
}
