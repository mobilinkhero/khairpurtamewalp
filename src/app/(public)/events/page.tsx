import type { Metadata } from 'next'
import EventsPageClient from '@/components/public/EventsPageClient'

export const metadata: Metadata = { title: 'Events' }

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
        <p className="text-gray-500 mt-2">Community events, gatherings and programmes in Khairpur Tamewali.</p>
      </div>
      <EventsPageClient />
    </div>
  )
}
