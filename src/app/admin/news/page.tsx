import type { Metadata } from 'next'
import NewsTable from '@/components/admin/news/NewsTable'

export const metadata: Metadata = { title: 'News — Admin' }

export default function AdminNewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">News & Announcements</h1>
        <p className="text-gray-500 text-sm mt-1">Create and manage news articles</p>
      </div>
      <NewsTable />
    </div>
  )
}
