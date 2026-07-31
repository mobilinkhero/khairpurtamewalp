'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { eventApi, type Event } from '@/lib/api'
import { format } from 'date-fns'
import { useCategories } from '@/hooks/useCategories'

interface Props { event: Event | null; onClose: () => void; onSuccess: () => void }

export default function EventModal({ event, onClose, onSuccess }: Props) {
  const isEdit = !!event
  const { categories, isLoading: catLoading } = useCategories('event')

  const [form, setForm] = useState({
    title: event?.title ?? '',
    description: event?.description ?? '',
    imageUrl: event?.imageUrl ?? '',
    date: event?.date ? format(new Date(event.date), 'yyyy-MM-dd') : '',
    time: event?.time ?? '',
    venue: event?.venue ?? '',
    organizer: event?.organizer ?? '',
    category: (event as any)?.category ?? '',
    isFree: event?.isFree ?? true,
    isPublished: event?.isPublished ?? false,
  })

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const mutation = useMutation({
    mutationFn: (data: Partial<Event>) => isEdit ? eventApi.update(event!.id, data) : eventApi.create(data),
    onSuccess: () => { toast.success(isEdit ? 'Event updated!' : 'Event created!'); onSuccess() },
    onError: () => toast.error('Something went wrong'),
  })

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center text-lg">🎉</div>
            <div>
              <h2 className="font-bold text-gray-900">{isEdit ? 'Edit Event' : 'New Event'}</h2>
              <p className="text-xs text-gray-400">{isEdit ? `Editing ${event.title}` : 'Fill in the details below'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={e => { e.preventDefault(); mutation.mutate(form) }} className="p-6 space-y-4">

          {form.imageUrl && (
            <div className="w-full h-28 rounded-xl overflow-hidden bg-gray-100">
              <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} required placeholder="Event title..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Date *</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Time</label>
              <input value={form.time} onChange={e => set('time', e.target.value)} placeholder="e.g. 5:00 PM"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Venue *</label>
              <input value={form.venue} onChange={e => set('venue', e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Organizer</label>
              <input value={form.organizer} onChange={e => set('organizer', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Category
              {catLoading && <span className="ml-2 text-gray-400 font-normal normal-case">loading...</span>}
            </label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 bg-white">
              <option value="">Select category...</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Image URL</label>
            <input value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Describe the event..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 resize-none" />
          </div>

          <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => set('isFree', !form.isFree)}
                className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors ${form.isFree ? 'bg-green-500' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.isFree ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">Free Entry</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => set('isPublished', !form.isPublished)}
                className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors ${form.isPublished ? 'bg-green-500' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.isPublished ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">Publish Now</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={mutation.isPending}
              className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
              {mutation.isPending ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : isEdit ? '✓ Update Event' : '+ Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
