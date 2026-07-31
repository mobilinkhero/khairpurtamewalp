import type { Metadata } from 'next'
import AnalyticsDashboard from '@/components/admin/analytics/AnalyticsDashboard'
export const metadata: Metadata = { title: 'Analytics — Admin' }
export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Content statistics, breakdowns and recent activity</p>
      </div>
      <AnalyticsDashboard />
    </div>
  )
}
