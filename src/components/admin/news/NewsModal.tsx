'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { newsApi, type News } from '@/lib/api'
import { useCategories } from '@/hooks/useCategories'

interface Props { news: News | null; onClose: () => void; onSuccess: () => void }

export default function NewsModal({ news, onClose, onSuccess }: Props) {
  const isEdit = !!news
  const { categories, isLoading: catLoading } = useCategories('news')

  const [form, setForm] = useState({
    title: news?.title ?? '',
    summary: news?.summary ?? '',
    content: news?.content ?? '',
    imageUrl: news?.imageUrl ?? '',
    category: news?.category ?? '',
    author: news?.author ?? '',
    isPublished: news?.isPublished ?? false,
  })
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const mutation = useMutation({
    mutationFn: (data: Partial<News>) => isEdit ? newsApi.update(news!.id, data) : newsApi.create(data),
    onSuccess: () => { toast.success(isEdit ? 'Article updated!' : 'Article created!'); onSuccess() },
    onError: () => toast.error('Something went wrong'),
  })

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-lg">📰</div>
            <div>
              <h2 className="font-bold text-gray-900">{isEdit ? 'Edit Article' : 'Write New Article'}</h2>
              <p className="text-xs text-gray-400">{isEdit ? `Editing: ${news.title}` : 'Create a news article or announcement'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={e => { e.preventDefault(); mutation.mutate(form) }} className="p-6 space-y-5">
          {form.imageUrl && (
            <div className="w-full h-28 rounded-xl overflow-hidden bg-gray-100">
              <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Headline *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} required placeholder="Article headline..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Author</label>
              <input value={form.author} onChange={e => set('author', e.target.value)} placeholder="Community Desk"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Image URL</label>
            <input value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Summary</label>
            <textarea value={form.summary} onChange={e => set('summary', e.target.value)} rows={2} placeholder="Short summary shown in lists..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 resize-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Full Content *</label>
            <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={8} required placeholder="Write the full article content..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 resize-none" />
            <p className="text-xs text-gray-400 mt-1">{form.content.length} characters</p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div onClick={() => set('isPublished', !form.isPublished)}
              className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${form.isPublished ? 'bg-green-500' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.isPublished ? 'translate-x-5' : ''}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">{form.isPublished ? 'Published — visible to all users' : 'Draft — not visible to users'}</p>
              <p className="text-xs text-gray-400">Toggle to publish immediately</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={mutation.isPending}
              className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
              {mutation.isPending
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                : isEdit ? '✓ Update Article' : form.isPublished ? '🚀 Publish Now' : '💾 Save Draft'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
