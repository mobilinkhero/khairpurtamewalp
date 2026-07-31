import type { Metadata } from 'next'
import PlacesTable from '@/components/admin/places/PlacesTable'

export const metadata: Metadata = { title: 'Places — Admin' }

export default function AdminPlacesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Places & Landmarks</h1>
        <p className="text-gray-500 text-sm mt-1">Manage hospitals, schools, mosques and landmarks</p>
      </div>
      <PlacesTable />
    </div>
  )
}
