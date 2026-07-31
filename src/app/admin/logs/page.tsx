import type { Metadata } from 'next'
import ActivityLogPanel from '@/components/admin/logs/ActivityLogPanel'
export const metadata: Metadata = { title: 'Activity Log — Admin' }
export default function AdminLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-gray-500 text-sm mt-1">Every action performed by admins — who did what and when</p>
      </div>
      <ActivityLogPanel />
    </div>
  )
}
