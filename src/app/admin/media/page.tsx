import type { Metadata } from 'next'
import MediaManager from '@/components/admin/media/MediaManager'
export const metadata: Metadata = { title: 'Media Manager — Admin' }
export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Media Manager</h1>
        <p className="text-gray-500 text-sm mt-1">Upload images from your computer, or save images via URL — reuse them across your site</p>
      </div>
      <MediaManager />
    </div>
  )
}
