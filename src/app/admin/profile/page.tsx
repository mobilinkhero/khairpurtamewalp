import type { Metadata } from 'next'
import ProfileForm from '@/components/admin/profile/ProfileForm'

export const metadata: Metadata = { title: 'My Profile — Admin' }

export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account information and password</p>
      </div>
      <ProfileForm />
    </div>
  )
}
