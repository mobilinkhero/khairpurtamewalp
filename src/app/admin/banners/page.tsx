import type { Metadata } from 'next'
import BannersPanel from '@/components/admin/banners/BannersPanel'
export const metadata: Metadata = { title: 'Banners — Admin' }
export default function AdminBannersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Banners & Announcements</h1>
        <p className="text-gray-500 text-sm mt-1">Manage sliding banners shown on the public home page</p>
      </div>
      <BannersPanel />
    </div>
  )
}
