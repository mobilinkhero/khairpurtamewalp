import type { Metadata } from 'next'
import EventsTable from '@/components/admin/events/EventsTable'

export const metadata: Metadata = { title: 'Events — Admin' }

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <p className="text-gray-500 text-sm mt-1">Manage community events and gatherings</p>
      </div>
      <EventsTable />
    </div>
  )
}
