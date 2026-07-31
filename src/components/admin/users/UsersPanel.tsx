'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import api from '@/lib/api'

interface AdminUser { id: string; name: string; email: string; role: string; createdAt: string }
const EMPTY = { name: '', email: '', password: '', role: 'ADMIN' }

export default function UsersPanel() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))

  const { data: users = [], isLoading } = useQuery<AdminUser[]>({
    queryKey: ['admin', 'users'],
    queryFn: async () => { const r = await api.get('/admin/users'); return r.data.data },
  })

  const saveMutation = useMutation({
    mutationFn: (d: any) => editing ? api.put(`/admin/users/${editing.id}`, d) : api.post('/admin/users', d),
    onSuccess: () => { toast.success(editing ? 'User updated!' : 'User created!'); setModal(false); qc.invalidateQueries({ queryKey: ['admin', 'users'] }) },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Something went wrong'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/users/${id}`),
    onSuccess: () => { toast.success('User deleted'); qc.invalidateQueries({ queryKey: ['admin', 'users'] }) },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to delete'),
  })

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = (u: AdminUser) => { setEditing(u); setForm({ name: u.name, email: u.email, password: '', role: u.role }); setModal(true) }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-700">
            ⚠️ Only Super Admins can manage users
          </div>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
          Add Admin
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_80px] gap-4 px-5 py-3.5 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <span>Name</span><span>Email</span><span>Role</span><span>Joined</span><span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-gray-50">
          {isLoading ? [...Array(3)].map((_, i) => (
            <div key={i} className="grid grid-cols-[2fr_2fr_1fr_1fr_80px] gap-4 px-5 py-4 animate-pulse">
              {[...Array(5)].map((_, j) => <div key={j} className="h-4 bg-gray-100 rounded self-center"/>)}
            </div>
          )) : users.map(u => (
            <div key={u.id} className="grid grid-cols-[2fr_2fr_1fr_1fr_80px] gap-4 px-5 py-4 items-center group hover:bg-gray-50/60 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-sm">{u.name.charAt(0).toUpperCase()}</span>
                </div>
                <p className="font-semibold text-gray-900 truncate">{u.name}</p>
              </div>
              <p className="text-sm text-gray-500 truncate">{u.email}</p>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold w-fit ${u.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {u.role === 'SUPER_ADMIN' ? '👑 Super Admin' : '🔑 Admin'}
              </span>
              <p className="text-xs text-gray-400">{format(new Date(u.createdAt), 'dd MMM yyyy')}</p>
              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(u)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button onClick={() => { if (confirm(`Delete ${u.name}?`)) deleteMutation.mutate(u.id) }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{editing ? 'Edit Admin User' : 'Add Admin User'}</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(form) }} className="p-6 space-y-4">
              <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Full Name *</label><input value={form.name} onChange={e => set('name', e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"/></div>
              <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Email *</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"/></div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{editing ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)} required={!editing} minLength={6} placeholder={editing ? 'Leave blank to keep current' : 'Min. 6 characters'} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Role</label>
                <select value={form.role} onChange={e => set('role', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20">
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
                  {saveMutation.isPending ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving...</> : editing ? '✓ Update User' : '+ Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
