import type { Metadata } from 'next'
import BusinessesTable from '@/components/admin/businesses/BusinessesTable'

export const metadata: Metadata = { title: 'Businesses — Admin' }

export default function AdminBusinessesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Businesses</h1>
        <p className="text-gray-500 text-sm mt-1">Manage the business directory</p>
      </div>
      <BusinessesTable />
    </div>
  )
}
