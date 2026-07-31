'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '@/lib/api'

interface FAQ { id: string; question: string; answer: string; category: string; isPublished: boolean; sortOrder: number }

const EMPTY = { question: '', answer: '', category: 'General', isPublished: true, sortOrder: 0 }
const CATS = ['General', 'Businesses', 'Places', 'Events', 'App', 'Emergency']

export default function FAQsPanel() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<FAQ | null>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const [expanded, setExpanded] = useState<string | null>(null)
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))

  const { data: items = [], isLoading } = useQuery<FAQ[]>({
    queryKey: ['admin', 'faqs'],
    queryFn: async () => { const r = await api.get('/admin/faqs'); return r.data.data },
  })

  const saveMutation = useMutation({
    mutationFn: (d: any) => editing ? api.put(`/admin/faqs/${editing.id}`, d) : api.post('/admin/faqs', d),
    onSuccess: () => { toast.success(editing ? 'Updated!' : 'Created!'); setModal(false); qc.invalidateQueries({ queryKey: ['admin', 'faqs'] }) },
    onError: () => toast.error('Something went wrong'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/faqs/${id}`),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['admin', 'faqs'] }) },
  })

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = (f: FAQ) => { setEditing(f); setForm({ question: f.question, answer: f.answer, category: f.category, isPublished: f.isPublished, sortOrder: f.sortOrder }); setModal(true) }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{items.length} FAQs</p>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
          Add FAQ
        </button>
      </div>

      <div className="space-y-2">
        {isLoading ? [...Array(4)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-2xl animate-pulse"/>) :
        items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
            <div className="text-5xl mb-3">❓</div>
            <p className="text-sm font-semibold text-gray-500">No FAQs yet</p>
          </div>
        ) : items.map(faq => (
          <div key={faq.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-4 px-5 py-4 cursor-pointer group" onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600 font-black text-sm">?</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{faq.question}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">{faq.category}</span>
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${faq.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{faq.isPublished ? 'Published' : 'Hidden'}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                <button onClick={() => openEdit(faq)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(faq.id) }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${expanded === faq.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </div>
            {expanded === faq.id && (
              <div className="px-5 pb-4 border-t border-gray-50">
                <p className="text-sm text-gray-600 leading-relaxed mt-3">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{editing ? 'Edit FAQ' : 'Add FAQ'}</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(form) }} className="p-6 space-y-4">
              <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Question *</label><input value={form.question} onChange={e => set('question', e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"/></div>
              <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Answer *</label><textarea value={form.answer} onChange={e => set('answer', e.target.value)} rows={4} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 resize-none"/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Category</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20">
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Sort Order</label><input type="number" min={0} value={form.sortOrder} onChange={e => set('sortOrder', Number(e.target.value))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"/></div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div onClick={() => set('isPublished', !form.isPublished)} className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors ${form.isPublished ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.isPublished ? 'translate-x-5' : ''}`}/>
                </div>
                <span className="text-sm font-medium text-gray-700">Published (visible to users)</span>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
                  {saveMutation.isPending ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving...</> : editing ? '✓ Update' : '+ Add FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
