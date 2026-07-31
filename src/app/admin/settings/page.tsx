import type { Metadata } from 'next'
import AppSettingsPanel from '@/components/admin/settings/AppSettingsPanel'
export const metadata: Metadata = { title: 'App Settings — Admin' }
export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">App Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure hero image, city info, app appearance and system settings</p>
      </div>
      <AppSettingsPanel />
    </div>
  )
}
