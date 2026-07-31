import type { Metadata } from 'next'
import UsersPanel from '@/components/admin/users/UsersPanel'
export const metadata: Metadata = { title: 'Admin Users — Admin' }
export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
        <p className="text-gray-500 text-sm mt-1">Manage admin accounts, roles and access</p>
      </div>
      <UsersPanel />
    </div>
  )
}
