import { prisma } from '@/lib/db'
import type { JWTPayload } from '@/lib/auth'
import type { NextRequest } from 'next/server'

export async function logActivity(
  user: JWTPayload,
  action: string,
  entity: string,
  entityId: string,
  entityName: string,
  req?: NextRequest,
) {
  try {
    const ip = req?.headers.get('x-forwarded-for') ?? req?.headers.get('x-real-ip') ?? ''
    await prisma.activityLog.create({
      data: {
        userId: user.userId,
        userName: user.email,
        action,
        entity,
        entityId,
        entityName,
        detail: `${action} ${entity}${entityName ? `: ${entityName}` : ''}`,
        ipAddress: ip,
      },
    })
  } catch {
    // non-blocking — log failures should never crash the API
  }
}
