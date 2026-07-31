'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '@/lib/api'

interface Banner { id: string; title: string; subtitle: string; imageUrl: string; linkUrl: string; linkLabel: string; type: string; isActive: boolean; sortOrder: number; expiresAt: string | null }

const TYPE_META: Record<string, { label: string; color: string }> = {
  info:      { label: 'Info',      color: 'bg-blue-100 text-blue-700' },
  warning:   { label: 'Warning',   color: 'bg-amber-100 text-amber-700' },
  emergency: { label: 'Emergency', color: 'bg-red-100 text-red-600' },
  promo:     { label: 'Promo',     color: 'bg-purple-100 text-purple-700' },
}

const EMPTY = { title: '', subtitle: '', imageUrl: '', linkUrl: '', linkLabel: '', type: 'info', isActive: true, sortOrder: 0 }

export default function BannersPanel() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [form, setForm] = useState<any>(EMPTY)

  const { data: banners = [], isLoading } = useQuery<Banner[]>({
    queryKey: ['admin', 'banners'],
    queryFn: async () => { const r = await api.get('/admin/banners'); return r.data.data },
  })

  const saveMutation = useMutation({
    mutationFn: (data: any) => editing ? api.put(`/admin/banners/${editing.id}`, data) : api.post('/admin/banners', data),
    onSuccess: () => { toast.success(editing ? 'Updated!' : 'Created!'); setModal(false); qc.invalidateQueries({ queryKey: ['admin', 'banners'] }) },
    onError: () => toast.error('Something went wrong'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/banners/${id}`),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['admin', 'banners'] }) },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => api.put(`/admin/banners/${id}`, { isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'banners'] }),
  })

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = (b: Banner) => { setEditing(b); setForm({ title: b.title, subtitle: b.subtitle, imageUrl: b.imageUrl, linkUrl: b.linkUrl, linkLabel: b.linkLabel, type: b.type, isActive: b.isActive, sortOrder: b.sortOrder }); setModal(true) }
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{banners.length} banners configured</p>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
          Add Banner
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse"/>)}</div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <div className="text-5xl mb-3">🖼️</div>
          <p className="text-sm font-semibold text-gray-500">No banners yet</p>
          <p className="text-xs text-gray-400 mt-1">Create your first banner or announcement</p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map(b => (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-start gap-4 p-4">
                {b.imageUrl && (
                  <div className="w-24 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover"/>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${TYPE_META[b.type]?.color ?? 'bg-gray-100 text-gray-600'}`}>{TYPE_META[b.type]?.label ?? b.type}</span>
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{b.isActive ? '● Active' : '○ Inactive'}</span>
                    <span className="text-xs text-gray-400">Order #{b.sortOrder}</span>
                  </div>
                  <h3 className="font-bold text-gray-900">{b.title}</h3>
                  {b.subtitle && <p className="text-sm text-gray-500 mt-0.5">{b.subtitle}</p>}
                  {b.linkUrl && <p className="text-xs text-blue-500 mt-0.5 truncate">{b.linkUrl}</p>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => toggleMutation.mutate({ id: b.id, isActive: !b.isActive })}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${b.isActive ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {b.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => openEdit(b)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <button onClick={() => { if (confirm(`Delete "${b.title}"?`)) deleteMutation.mutate(b.id) }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{editing ? 'Edit Banner' : 'Add Banner'}</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(form) }} className="p-6 space-y-4">
              {form.imageUrl && <div className="h-28 rounded-xl overflow-hidden bg-gray-100"><img src={form.imageUrl} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display='none')}/></div>}
              <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Title *</label><input value={form.title} onChange={e => set('title', e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"/></div>
              <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Subtitle</label><input value={form.subtitle} onChange={e => set('subtitle', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"/></div>
              <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Image URL *</label><input value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} required placeholder="https://..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Type</label>
                  <select value={form.type} onChange={e => set('type', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20">
                    {Object.entries(TYPE_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Sort Order</label><input type="number" min={0} value={form.sortOrder} onChange={e => set('sortOrder', Number(e.target.value))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Link URL</label><input value={form.linkUrl} onChange={e => set('linkUrl', e.target.value)} placeholder="/emergency" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"/></div>
                <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Link Label</label><input value={form.linkLabel} onChange={e => set('linkLabel', e.target.value)} placeholder="Read more" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"/></div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div onClick={() => set('isActive', !form.isActive)} className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors ${form.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.isActive ? 'translate-x-5' : ''}`}/>
                </div>
                <span className="text-sm font-medium text-gray-700">Active (visible to users)</span>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
                  {saveMutation.isPending ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving...</> : editing ? '✓ Update' : '+ Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
