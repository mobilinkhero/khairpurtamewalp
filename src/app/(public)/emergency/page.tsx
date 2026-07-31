import type { Metadata } from 'next'
import EmergencyPageClient from '@/components/public/EmergencyPageClient'

export const metadata: Metadata = { title: 'Emergency Contacts' }

export default function EmergencyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🚨 Emergency Contacts</h1>
        <p className="text-gray-500 mt-2">Quick access to emergency services in Khairpur Tamewali.</p>
      </div>
      <EmergencyPageClient />
    </div>
  )
}
