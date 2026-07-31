import type { Metadata } from 'next'
import ClaimsPanel from '@/components/admin/claims/ClaimsPanel'
export const metadata: Metadata = { title: 'Claim Requests — Admin' }
export default function AdminClaimsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Claim Requests</h1>
        <p className="text-gray-500 text-sm mt-1">Business owners requesting to claim their listings</p>
      </div>
      <ClaimsPanel />
    </div>
  )
}
