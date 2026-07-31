import type { Metadata } from 'next'
import EmergencyTable from '@/components/admin/emergency/EmergencyTable'

export const metadata: Metadata = { title: 'Emergency Contacts — Admin' }

export default function AdminEmergencyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Emergency Contacts</h1>
        <p className="text-gray-500 text-sm mt-1">Manage emergency service numbers</p>
      </div>
      <EmergencyTable />
    </div>
  )
}
