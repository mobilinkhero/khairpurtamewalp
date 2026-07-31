'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function ProfileForm() {
  const qc = useQueryClient()

  // ── Fetch current user ──────────────────────────────────
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['admin', 'profile'],
    queryFn: async () => {
      const { data } = await api.get('/auth/profile')
      return data.data
    },
  })

  // ── Profile form state ──────────────────────────────────
  const [profileForm, setProfileForm] = useState({ name: '', email: '' })
  const [profileInitialized, setProfileInitialized] = useState(false)
  if (user && !profileInitialized) {
    setProfileForm({ name: user.name, email: user.email })
    setProfileInitialized(true)
  }

  // ── Password form state ─────────────────────────────────
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState(false)

  // ── Update profile mutation ─────────────────────────────
  const updateProfile = useMutation({
    mutationFn: async (data: Partial<typeof profileForm>) => {
      const res = await api.put('/auth/profile', data)
      return res.data.data
    },
    onSuccess: () => {
      toast.success('Profile updated successfully')
      qc.invalidateQueries({ queryKey: ['admin', 'profile'] })
      setProfileInitialized(false)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update profile')
    },
  })

  // ── Update password mutation ────────────────────────────
  const updatePassword = useMutation({
    mutationFn: async () => {
      const res = await api.put('/auth/profile', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      return res.data.data
    },
    onSuccess: () => {
      toast.success('Password changed successfully')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to change password')
    },
  })

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileForm.name.trim()) return toast.error('Name is required')
    if (!profileForm.email.trim()) return toast.error('Email is required')
    updateProfile.mutate(profileForm)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordForm.currentPassword) return toast.error('Enter your current password')
    if (passwordForm.newPassword.length < 6) return toast.error('New password must be at least 6 characters')
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return toast.error('Passwords do not match')
    updatePassword.mutate()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
            <div className="h-5 w-40 bg-gray-100 rounded mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((j) => <div key={j} className="h-10 bg-gray-100 rounded-xl" />)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">

      {/* ── Profile card ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center shadow-md">
            <span className="text-white text-2xl font-black">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
              {user?.role?.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleProfileSubmit} className="p-6 space-y-5">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Account Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
            <input
              type="text"
              value={user?.role?.replace('_', ' ')}
              disabled
              className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Member Since</label>
            <input
              type="text"
              value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
              disabled
              className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {updateProfile.isPending ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── Change password card ──────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">Change Password</h3>
            <p className="text-sm text-gray-500 mt-0.5">Make sure to use a strong password</p>
          </div>
          <button
            type="button"
            onClick={() => setShowPasswords((s) => !s)}
            className="text-xs text-gray-400 hover:text-gray-600 font-medium"
          >
            {showPasswords ? 'Hide' : 'Show'} fields
          </button>
        </div>

        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
              placeholder="Enter current password"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
                placeholder="Min. 6 characters"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                placeholder="Repeat new password"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                  passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword
                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                    : 'border-gray-200 focus:ring-green-500/20 focus:border-green-500/50'
                }`}
              />
              {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
          </div>

          {/* Password strength indicator */}
          {passwordForm.newPassword && (
            <div>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map((level) => {
                  const strength = passwordForm.newPassword.length >= 12 ? 4
                    : passwordForm.newPassword.length >= 8 ? 3
                    : passwordForm.newPassword.length >= 6 ? 2
                    : 1
                  return (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        level <= strength
                          ? strength === 1 ? 'bg-red-400'
                            : strength === 2 ? 'bg-orange-400'
                            : strength === 3 ? 'bg-yellow-400'
                            : 'bg-green-500'
                          : 'bg-gray-100'
                      }`}
                    />
                  )
                })}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {passwordForm.newPassword.length < 6 ? 'Too short'
                  : passwordForm.newPassword.length < 8 ? 'Weak'
                  : passwordForm.newPassword.length < 12 ? 'Good'
                  : 'Strong'}
              </p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updatePassword.isPending || !passwordForm.currentPassword || !passwordForm.newPassword}
              className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40 flex items-center gap-2"
            >
              {updatePassword.isPending ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── Danger zone ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-red-50">
          <h3 className="font-bold text-red-600">Danger Zone</h3>
          <p className="text-sm text-gray-500 mt-0.5">These actions are irreversible</p>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">Sign out of all sessions</p>
            <p className="text-xs text-gray-400 mt-0.5">Removes all active login sessions</p>
          </div>
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' })
              window.location.href = '/admin/login'
            }}
            className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
          >
            Sign Out All
          </button>
        </div>
      </div>

    </div>
  )
}
