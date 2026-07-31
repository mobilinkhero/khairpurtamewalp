import type { Metadata } from 'next'
import FAQsPanel from '@/components/admin/faqs/FAQsPanel'
export const metadata: Metadata = { title: 'FAQs — Admin' }
export default function AdminFAQsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
        <p className="text-gray-500 text-sm mt-1">Manage frequently asked questions shown on the public site</p>
      </div>
      <FAQsPanel />
    </div>
  )
}
