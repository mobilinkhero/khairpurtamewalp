'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { businessApi, type Business } from '@/lib/api'
import { useCategories } from '@/hooks/useCategories'

interface Props { business: Business | null; onClose: () => void; onSuccess: () => void }

export default function BusinessModal({ business, onClose, onSuccess }: Props) {
  const isEdit = !!business
  const { categories, isLoading: catLoading } = useCategories('business')

  const [form, setForm] = useState({
    name: business?.name ?? '',
    category: business?.category ?? '',
    description: business?.description ?? '',
    address: business?.address ?? '',
    phone: business?.phone ?? '',
    imageUrl: business?.imageUrl ?? '',
    workingHours: business?.workingHours ?? '',
    rating: business?.rating ?? 0,
    reviewCount: business?.reviewCount ?? 0,
    isOpen: business?.isOpen ?? true,
    isFeatured: business?.isFeatured ?? false,
    tags: business?.tags?.join(', ') ?? '',
    lat: business?.lat ?? 0,
    lng: business?.lng ?? 0,
  })

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const mutation = useMutation({
    mutationFn: (data: Partial<Business>) =>
      isEdit ? businessApi.update(business!.id, data) : businessApi.create(data),
    onSuccess: () => { toast.success(isEdit ? 'Business updated!' : 'Business added!'); onSuccess() },
    onError: () => toast.error('Something went wrong'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      rating: Number(form.rating),
      reviewCount: Number(form.reviewCount),
      lat: Number(form.lat),
      lng: Number(form.lng),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-lg">🏪</div>
            <div>
              <h2 className="font-bold text-gray-900">{isEdit ? 'Edit Business' : 'Add New Business'}</h2>
              <p className="text-xs text-gray-400">{isEdit ? `Editing ${business.name}` : 'Fill in the details below'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {form.imageUrl && (
            <div className="w-full h-32 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
              <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Business Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Al-Noor Restaurant"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                Category *
                {catLoading && <span className="ml-2 text-gray-400 font-normal normal-case">loading...</span>}
              </label>
              <select value={form.category} onChange={e => set('category', e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 bg-white">
                <option value="">Select category...</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Brief description..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Address *</label>
              <input value={form.address} onChange={e => set('address', e.target.value)} required placeholder="Street, Area"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Phone *</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} required placeholder="+92 300 0000000"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Image URL</label>
            <input value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Working Hours</label>
            <input value={form.workingHours} onChange={e => set('workingHours', e.target.value)} placeholder="Mon–Sun: 9 AM – 10 PM"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Tags <span className="normal-case font-normal text-gray-400">(comma separated)</span></label>
            <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Biryani, BBQ, Desi Food"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Rating (0–5)</label>
              <input type="number" min={0} max={5} step={0.1} value={form.rating} onChange={e => set('rating', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Review Count</label>
              <input type="number" min={0} value={form.reviewCount} onChange={e => set('reviewCount', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
            </div>
          </div>

          <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => set('isOpen', !form.isOpen)}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${form.isOpen ? 'bg-green-500' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.isOpen ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">Currently Open</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => set('isFeatured', !form.isFeatured)}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${form.isFeatured ? 'bg-amber-500' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.isFeatured ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">Featured Listing</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={mutation.isPending}
              className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
              {mutation.isPending ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : isEdit ? '✓ Update Business' : '+ Add Business'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
