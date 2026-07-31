'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '@/lib/api'

interface Testimonial { id: string; name: string; role: string; content: string; rating: number; avatarUrl: string; isApproved: boolean; sortOrder: number }

const EMPTY = { name: '', role: '', content: '', rating: 5, avatarUrl: '', isApproved: false, sortOrder: 0 }

export default function TestimonialsPanel() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))

  const { data: items = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ['admin', 'testimonials'],
    queryFn: async () => { const r = await api.get('/admin/testimonials'); return r.data.data },
  })

  const saveMutation = useMutation({
    mutationFn: (d: any) => editing ? api.put(`/admin/testimonials/${editing.id}`, d) : api.post('/admin/testimonials', d),
    onSuccess: () => { toast.success(editing ? 'Updated!' : 'Created!'); setModal(false); qc.invalidateQueries({ queryKey: ['admin', 'testimonials'] }) },
    onError: () => toast.error('Something went wrong'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/testimonials/${id}`),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['admin', 'testimonials'] }) },
  })

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = (t: Testimonial) => { setEditing(t); setForm({ name: t.name, role: t.role, content: t.content, rating: t.rating, avatarUrl: t.avatarUrl, isApproved: t.isApproved, sortOrder: t.sortOrder }); setModal(true) }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{items.length} testimonials</p>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
          Add Testimonial
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-3.5 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <span>Person</span><span>Rating</span><span>Status</span><span>Order</span><span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-gray-50">
          {isLoading ? [...Array(4)].map((_, i) => (
            <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-4 animate-pulse">
              {[...Array(5)].map((_, j) => <div key={j} className="h-4 bg-gray-100 rounded self-center"/>)}
            </div>
          )) : items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-5xl mb-3">💬</div>
              <p className="text-sm font-semibold text-gray-500">No testimonials yet</p>
            </div>
          ) : items.map(t => (
            <div key={t.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-4 items-center hover:bg-gray-50/60 group transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {t.avatarUrl ? <img src={t.avatarUrl} alt="" className="w-full h-full object-cover rounded-xl"/> : t.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400 truncate">{t.role || 'Community Member'}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s => <svg key={s} className={`w-3.5 h-3.5 ${s <= t.rating ? 'fill-amber-400' : 'fill-gray-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold w-fit ${t.isApproved ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${t.isApproved ? 'bg-green-500' : 'bg-amber-400'}`}/>
                {t.isApproved ? 'Approved' : 'Pending'}
              </span>
              <span className="text-sm text-gray-500">#{t.sortOrder}</span>
              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(t)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button onClick={() => { if (confirm(`Delete "${t.name}"?`)) deleteMutation.mutate(t.id) }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
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
              <h2 className="font-bold text-gray-900">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(form) }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Name *</label><input value={form.name} onChange={e => set('name', e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"/></div>
                <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Role</label><input value={form.role} onChange={e => set('role', e.target.value)} placeholder="e.g. Business Owner" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"/></div>
              </div>
              <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Review Content *</label><textarea value={form.content} onChange={e => set('content', e.target.value)} rows={3} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 resize-none"/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Rating (1–5)</label><input type="number" min={1} max={5} value={form.rating} onChange={e => set('rating', Number(e.target.value))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"/></div>
                <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Sort Order</label><input type="number" min={0} value={form.sortOrder} onChange={e => set('sortOrder', Number(e.target.value))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"/></div>
              </div>
              <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Avatar URL</label><input value={form.avatarUrl} onChange={e => set('avatarUrl', e.target.value)} placeholder="https://..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"/></div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div onClick={() => set('isApproved', !form.isApproved)} className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors ${form.isApproved ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.isApproved ? 'translate-x-5' : ''}`}/>
                </div>
                <span className="text-sm font-medium text-gray-700">Approved (visible to users)</span>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
                  {saveMutation.isPending ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving...</> : editing ? '✓ Update' : '+ Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
