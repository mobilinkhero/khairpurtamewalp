import type { Metadata } from 'next'
import NewsPageClient from '@/components/public/NewsPageClient'

export const metadata: Metadata = { title: 'News & Announcements' }

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">News & Announcements</h1>
        <p className="text-gray-500 mt-2">Latest news, announcements and updates from Khairpur Tamewali.</p>
      </div>
      <NewsPageClient />
    </div>
  )
}
