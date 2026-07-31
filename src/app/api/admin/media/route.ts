import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)
  const files = await prisma.mediaFile.findMany({ orderBy: { createdAt: 'desc' } })
  return apiSuccess(files)
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)

  const contentType = req.headers.get('content-type') || ''

  // ── File upload via FormData ──────────────────────────────────────────
  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await req.formData()
      const fileField = formData.get('file') as File | null
      const altText = (formData.get('alt') as string) || ''

      if (!fileField) return apiError('No file provided', 400)

      const bytes = Buffer.from(await fileField.arrayBuffer())
      const ext = path.extname(fileField.name) || '.jpg'
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadDir, { recursive: true })
      const filePath = path.join(uploadDir, uniqueName)
      await writeFile(filePath, bytes)

      const url = `/uploads/${uniqueName}`
      const file = await prisma.mediaFile.create({
        data: {
          filename: fileField.name,
          url,
          mimeType: fileField.type || 'image/jpeg',
          size: fileField.size,
          alt: altText,
          uploadedBy: user.email,
        },
      })
      return apiSuccess(file, 'File uploaded successfully')
    } catch (err) {
      return apiError('Upload failed: ' + (err instanceof Error ? err.message : 'Unknown error'), 500)
    }
  }

  // ── URL-based (existing behaviour) ────────────────────────────────────
  const body = await req.json()
  const { filename, url, mimeType, size, alt } = body
  if (!url) return apiError('URL is required', 400)
  const file = await prisma.mediaFile.create({
    data: { filename: filename || 'image', url, mimeType: mimeType || 'image/jpeg', size: size || 0, alt: alt || '', uploadedBy: user.email },
  })
  return apiSuccess(file, 'Media saved')
}
