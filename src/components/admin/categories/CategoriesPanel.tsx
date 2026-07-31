'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '@/lib/api'

interface Category { id: string; name: string; type: string; color: string; icon: string; sortOrder: number; isActive: boolean }

const TYPES = [
  { value: 'business', label: 'Businesses', icon: '🏪', color: 'blue'   },
  { value: 'place',    label: 'Places',     icon: '🏛️', color: 'emerald' },
  { value: 'news',     label: 'News',       icon: '📰', color: 'amber'  },
  { value: 'event',    label: 'Events',     icon: '🎉', color: 'purple' },
]

const typeColors: Record<string, string> = {
  business: 'bg-blue-50 border-blue-100 text-blue-700',
  place:    'bg-emerald-50 border-emerald-100 text-emerald-700',
  news:     'bg-amber-50 border-amber-100 text-amber-700',
  event:    'bg-purple-50 border-purple-100 text-purple-700',
}

const typeBadge: Record<string, string> = {
  business: 'bg-blue-100 text-blue-700',
  place:    'bg-emerald-100 text-emerald-700',
  news:     'bg-amber-100 text-amber-700',
  event:    'bg-purple-100 text-purple-700',
}

export default function CategoriesPanel() {
  const qc = useQueryClient()
  const [activeType, setActiveType] = useState('business')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['admin', 'categories'],
    queryFn: async () => { const r = await api.get('/admin/categories'); return r.data.data },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/categories/${id}`),
    onSuccess: () => { toast.success('Category deleted'); qc.invalidateQueries({ queryKey: ['admin', 'categories'] }); setDeleteTarget(null) },
    onError: () => toast.error('Failed to delete'),
  })

  const filtered = categories.filter(c => c.type === activeType)

  return (
    <div className="space-y-5">
      {/* Type tabs */}
      <div className="flex gap-2 flex-wrap">
        {TYPES.map(t => (
          <button key={t.value} onClick={() => setActiveType(t.value)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
              activeType === t.value
                ? typeColors[t.value] + ' shadow-sm'
                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
            }`}>
            <span>{t.icon}</span> {t.label}
            <span className={`px-1.5 py-0.5 rounded-md text-xs font-bold ${activeType === t.value ? '' : 'bg-gray-100 text-gray-500'}`}>
              {categories.filter(c => c.type === t.value).length}
            </span>
          </button>
        ))}
        <button
          onClick={() => { setEditing(null); setModalOpen(true) }}
          className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          Add Category
        </button>
      </div>

      {/* Categories grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_100px_80px_80px] gap-4 px-5 py-3.5 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <span>Category Name</span><span>Type</span><span>Color</span><span>Order</span><span className="text-right">Actions</span>
        </div>

        {isLoading ? (
          <div className="p-5 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
              {TYPES.find(t => t.value === activeType)?.icon}
            </div>
            <p className="text-sm font-semibold text-gray-500">No categories yet</p>
            <p className="text-xs text-gray-400 mt-1">Add your first {activeType} category</p>
            <button
              onClick={() => { setEditing(null); setModalOpen(true) }}
              className="mt-4 px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors"
            >
              + Add Category
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(cat => (
              <div key={cat.id} className="grid grid-cols-[1fr_1fr_100px_80px_80px] gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors items-center group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: cat.color + '20', border: `1.5px solid ${cat.color}40` }}>
                    {cat.icon}
                  </div>
                  <span className="font-semibold text-gray-900">{cat.name}</span>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium w-fit ${typeBadge[cat.type]}`}>
                  {TYPES.find(t => t.value === cat.type)?.label ?? cat.type}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs text-gray-400 font-mono">{cat.color}</span>
                </div>
                <span className="text-sm text-gray-500 font-medium">#{cat.sortOrder}</span>
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditing(cat); setModalOpen(true) }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => setDeleteTarget(cat)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <CategoryModal
          category={editing}
          defaultType={activeType}
          onClose={() => setModalOpen(false)}
          onSuccess={() => { setModalOpen(false); qc.invalidateQueries({ queryKey: ['admin', 'categories'] }) }}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">{deleteTarget.icon}</div>
            <h3 className="text-lg font-bold text-gray-900 text-center">Delete Category</h3>
            <p className="text-sm text-gray-500 text-center mt-2">Delete <span className="font-semibold text-gray-700">"{deleteTarget.name}"</span>? Existing content using this category will not be deleted.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => deleteMutation.mutate(deleteTarget.id)} disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2">
                {deleteMutation.isPending && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CategoryModal({ category, defaultType, onClose, onSuccess }: { category: Category | null; defaultType: string; onClose: () => void; onSuccess: () => void }) {
  const isEdit = !!category
  const qc = useQueryClient()
  const [form, setForm] = useState({
    name: category?.name ?? '',
    type: category?.type ?? defaultType,
    color: category?.color ?? '#1B5E20',
    icon: category?.icon ?? '📁',
    sortOrder: category?.sortOrder ?? 0,
  })
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const COMMON_ICONS = ['🏪','🍽️','🏥','💊','🏫','📚','🕌','🏛️','🌳','🛒','🏨','🏦','🔧','💈','🥖','📰','🎉','🎪','🎭','🌟','📁','⚡','🔴','🟢']

  const mutation = useMutation({
    mutationFn: async (data: typeof form) => {
      if (isEdit) return api.put(`/admin/categories/${category!.id}`, { ...data, sortOrder: Number(data.sortOrder) })
      return api.post('/admin/categories', { ...data, sortOrder: Number(data.sortOrder) })
    },
    onSuccess: () => { toast.success(isEdit ? 'Updated!' : 'Category created!'); onSuccess() },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Something went wrong'),
  })

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: form.color + '20' }}>{form.icon}</div>
            <div>
              <h2 className="font-bold text-gray-900">{isEdit ? 'Edit Category' : 'New Category'}</h2>
              <p className="text-xs text-gray-400">Fill in the details below</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(form) }} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Category Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Restaurants"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Type *</label>
            <div className="grid grid-cols-4 gap-2">
              {TYPES.map(t => (
                <button key={t.value} type="button" onClick={() => set('type', t.value)}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                    form.type === t.value ? typeColors[t.value] : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}>
                  <span className="text-lg">{t.icon}</span>{t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Icon</label>
            <div className="flex flex-wrap gap-1.5 p-3 border border-gray-200 rounded-xl bg-gray-50">
              {COMMON_ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => set('icon', ic)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${form.icon === ic ? 'bg-green-100 ring-2 ring-green-500 scale-110' : 'hover:bg-white hover:shadow-sm'}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.color} onChange={e => set('color', e.target.value)}
                  className="w-10 h-10 border border-gray-200 rounded-xl cursor-pointer p-0.5" />
                <input type="text" value={form.color} onChange={e => set('color', e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500/20" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Sort Order</label>
              <input type="number" min={0} value={form.sortOrder} onChange={e => set('sortOrder', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={mutation.isPending}
              className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
              {mutation.isPending ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : isEdit ? '✓ Update' : '+ Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
