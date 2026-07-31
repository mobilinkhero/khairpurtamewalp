import type { Metadata } from 'next'
import PlacesPageClient from '@/components/public/PlacesPageClient'

export const metadata: Metadata = { title: 'Places & Landmarks' }

export default function PlacesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Places & Landmarks</h1>
        <p className="text-gray-500 mt-2">Hospitals, schools, mosques, parks and key landmarks in KPT.</p>
      </div>
      <PlacesPageClient />
    </div>
  )
}
