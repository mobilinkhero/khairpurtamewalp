import type { Metadata } from 'next'
import BusinessesPageClient from '@/components/public/BusinessesPageClient'

export const metadata: Metadata = { title: 'Business Directory' }

export default function BusinessesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Business Directory</h1>
        <p className="text-gray-500 mt-2">Find local businesses, shops, clinics and services in Khairpur Tamewali.</p>
      </div>
      <BusinessesPageClient />
    </div>
  )
}
