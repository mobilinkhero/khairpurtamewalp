import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── API response helpers ──────────────────────────────────────────────────────
export function apiSuccess(data: unknown, message = 'Success', status = 200) {
  return Response.json({ success: true, message, data }, { status })
}

export function apiError(message: string, status = 400) {
  return Response.json({ success: false, message, data: null }, { status })
}

// ── Pagination helper ─────────────────────────────────────────────────────────
export function getPagination(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 20)))
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

export function paginatedResponse(data: unknown[], total: number, page: number, limit: number) {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  }
}
