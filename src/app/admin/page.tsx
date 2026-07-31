import type { Metadata } from 'next'
import DashboardStats from '@/components/admin/DashboardStats'
import RecentActivity from '@/components/admin/RecentActivity'

export const metadata: Metadata = { title: 'Dashboard — Admin' }

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of Khairpur Tamewali content</p>
      </div>
      <DashboardStats />
      <RecentActivity />
    </div>
  )
}
