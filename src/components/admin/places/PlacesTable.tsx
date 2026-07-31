'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { placeApi, type Place } from '@/lib/api'
import PlaceModal from './PlaceModal'

export default function PlacesTable() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Place | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Place | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'places', search, page],
    queryFn: () => placeApi.getAll({ ...(search && { search }), page: String(page), limit: '10' }),
  })

  const deleteMutation = useMutation({
    mutationFn: placeApi.delete,
    onSuccess: () => {
      toast.success('Place deleted')
      qc.invalidateQueries({ queryKey: ['admin', 'places'] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
      setDeleteTarget(null)
    },
    onError: () => toast.error('Failed to delete'),
  })

  const categoryColors: Record<string, string> = {
    Hospitals: 'bg-red-50 text-red-700',
    Schools: 'bg-blue-50 text-blue-700',
    Mosques: 'bg-green-50 text-green-700',
    Parks: 'bg-emerald-50 text-emerald-700',
    Markets: 'bg-orange-50 text-orange-700',
    Government: 'bg-purple-50 text-purple-700',
    Landmarks: 'bg-amber-50 text-amber-700',
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search places..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 bg-white"
          />
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Place
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_80px] gap-4 px-5 py-3.5 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <span>Place</span><span>Category</span><span>Facilities</span><span>Featured</span><span className="text-right">Actions</span>
        </div>

        <div className="divide-y divide-gray-50">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-[2fr_1fr_1.5fr_1fr_80px] gap-4 px-5 py-4 animate-pulse">
                <div className="flex items-center gap-3"><div className="w-11 h-11 bg-gray-100 rounded-xl" /><div className="space-y-2 flex-1"><div className="h-3.5 bg-gray-100 rounded w-3/4" /><div className="h-3 bg-gray-100 rounded w-1/2" /></div></div>
                {[...Array(3)].map((_, j) => <div key={j} className="h-4 bg-gray-100 rounded self-center" />)}
                <div className="h-4 bg-gray-100 rounded self-center ml-auto w-16" />
              </div>
            ))
          ) : data?.data.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">🏛️</div>
              <p className="text-sm font-semibold text-gray-500">No places found</p>
            </div>
          ) : data?.data.map((p) => (
            <div key={p.id} className="grid grid-cols-[2fr_1fr_1.5fr_1fr_80px] gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors items-center group">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                  {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg">🏛️</div>}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400 truncate">{p.address}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium w-fit ${categoryColors[p.category] ?? 'bg-gray-100 text-gray-600'}`}>{p.category}</span>
              <div className="flex flex-wrap gap-1">
                {(p.facilities ?? []).slice(0, 2).map((f) => (
                  <span key={f} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs">{f}</span>
                ))}
                {(p.facilities ?? []).length > 2 && <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-xs">+{p.facilities.length - 2}</span>}
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold w-fit ${p.isFeatured ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-400'}`}>
                {p.isFeatured ? '★ Featured' : '— Normal'}
              </span>
              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditing(p); setModalOpen(true) }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => setDeleteTarget(p)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500">Showing <span className="font-semibold text-gray-700">{(page-1)*10+1}–{Math.min(page*10,data.pagination.total)}</span> of <span className="font-semibold text-gray-700">{data.pagination.total}</span></p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p=>p-1)} disabled={!data.pagination.hasPrev} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-white text-gray-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg></button>
              <button onClick={() => setPage(p=>p+1)} disabled={!data.pagination.hasNext} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-white text-gray-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg></button>
            </div>
          </div>
        )}
      </div>

      {modalOpen && <PlaceModal place={editing} onClose={() => setModalOpen(false)} onSuccess={() => { setModalOpen(false); qc.invalidateQueries({ queryKey: ['admin', 'places'] }) }} />}
      {deleteTarget && <DeleteConfirm name={deleteTarget.name} onCancel={() => setDeleteTarget(null)} onConfirm={() => deleteMutation.mutate(deleteTarget.id)} loading={deleteMutation.isPending} />}
    </div>
  )
}

function DeleteConfirm({ name, onCancel, onConfirm, loading }: { name: string; onCancel: () => void; onConfirm: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 text-center">Delete Place</h3>
        <p className="text-sm text-gray-500 text-center mt-2">Are you sure you want to delete <span className="font-semibold text-gray-700">"{name}"</span>?</p>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />} Delete
          </button>
        </div>
      </div>
    </div>
  )
}
