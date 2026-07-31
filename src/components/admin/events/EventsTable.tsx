'use client'

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { eventApi, type Event } from '@/lib/api'
import { format, isPast } from 'date-fns'
import EventModal from './EventModal'

export default function EventsTable() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Event | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'events', page],
    queryFn: () => eventApi.getAll({ page: String(page), limit: '10' }),
  })

  const deleteMutation = useMutation({
    mutationFn: eventApi.delete,
    onSuccess: () => { toast.success('Event deleted'); qc.invalidateQueries({ queryKey: ['admin', 'events'] }); setDeleteTarget(null) },
    onError: () => toast.error('Failed to delete'),
  })

  const toggleSelect = (id: string) => {
    setSelected((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next })
  }
  const toggleAll = () => {
    if (!data?.data) return
    if (selected.size === data.data.length) { setSelected(new Set()); return }
    setSelected(new Set(data.data.map((e) => e.id)))
  }

  const bulkAction = useCallback(async (action: 'publish' | 'unpublish' | 'delete') => {
    if (selected.size === 0) { toast.error('No items selected'); return }
    if (action === 'delete' && !confirm(`Delete ${selected.size} events?`)) return
    setBulkLoading(true)
    try {
      const res = await fetch('/api/admin/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: 'events', ids: Array.from(selected), action }),
      })
      if (!res.ok) throw new Error()
      toast.success(`${action === 'delete' ? 'Deleted' : action === 'publish' ? 'Published' : 'Unpublished'} ${selected.size} events`)
      setSelected(new Set())
      qc.invalidateQueries({ queryKey: ['admin', 'events'] })
    } catch { toast.error('Bulk action failed') }
    setBulkLoading(false)
  }, [selected, qc])

  const exportCSV = useCallback(() => {
    if (!data?.data?.length) { toast.error('No data to export'); return }
    const headers = ['Title', 'Description', 'Date', 'Time', 'Venue', 'Organizer', 'isFree', 'isPublished']
    const rows = data.data.map((e) => [`"${e.title.replace(/"/g, '""')}"`, `"${(e.description || '').replace(/"/g, '""')}"`, e.date, e.time, `"${e.venue}"`, e.organizer, e.isFree, e.isPublished])
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'events.csv'; a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV exported')
  }, [data])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 bg-white" />
          </div>
          {selected.size > 0 && (
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-xl px-3 py-2 whitespace-nowrap">
              <span className="text-xs font-semibold text-green-700 mr-1">{selected.size} selected</span>
              <button onClick={() => bulkAction('publish')} disabled={bulkLoading} className="px-2.5 py-1 text-xs font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">Publish</button>
              <button onClick={() => bulkAction('unpublish')} disabled={bulkLoading} className="px-2.5 py-1 text-xs font-semibold bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50">Unpublish</button>
              <button onClick={() => bulkAction('delete')} disabled={bulkLoading} className="px-2.5 py-1 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">Delete</button>
              <button onClick={() => setSelected(new Set())} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700">✕</button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Export CSV
          </button>
          <button onClick={() => { setEditing(null); setModalOpen(true) }}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm whitespace-nowrap">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Add Event
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[40px_2fr_1fr_1.5fr_1fr_1fr_80px] gap-4 px-5 py-3.5 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <button onClick={toggleAll} className="flex items-center justify-center">
            <input type="checkbox" checked={data?.data?.length > 0 && selected.size === data.data.length}
              readOnly className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer" />
          </button>
          <span>Event</span><span>Date</span><span>Venue</span><span>Entry</span><span>Status</span><span className="text-right">Actions</span>
        </div>

        <div className="divide-y divide-gray-50">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_80px] gap-4 px-5 py-4 animate-pulse">
                <div className="flex items-center gap-3"><div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0" /><div className="space-y-2 flex-1"><div className="h-3.5 bg-gray-100 rounded w-3/4" /><div className="h-3 bg-gray-100 rounded w-1/2" /></div></div>
                {[...Array(4)].map((_, j) => <div key={j} className="h-4 bg-gray-100 rounded self-center" />)}
                <div className="h-4 bg-gray-100 rounded self-center ml-auto w-16" />
              </div>
            ))
          ) : data?.data.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">🎉</div>
              <p className="text-sm font-semibold text-gray-500">No events yet</p>
            </div>
          ) : data?.data.map((e) => {
            const eventDate = new Date(e.date)
            const past = isPast(eventDate)
            return (
              <div key={e.id} className="grid grid-cols-[40px_2fr_1fr_1.5fr_1fr_1fr_80px] gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors items-center group">
                <div className="flex items-center justify-center">
                  <input type="checkbox" checked={selected.has(e.id)} onChange={() => toggleSelect(e.id)}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer" />
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  {/* Calendar date badge */}
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border ${past ? 'bg-gray-100 border-gray-200' : 'bg-purple-50 border-purple-100'}`}>
                    <span className={`text-xs font-bold uppercase ${past ? 'text-gray-400' : 'text-purple-500'}`}>{format(eventDate, 'MMM')}</span>
                    <span className={`text-lg font-black leading-none ${past ? 'text-gray-500' : 'text-purple-700'}`}>{format(eventDate, 'dd')}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{e.title}</p>
                    <p className="text-xs text-gray-400">{e.time || 'Time TBD'} · {e.organizer}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{format(eventDate, 'dd MMM yyyy')}</p>
                  <p className="text-xs text-gray-400">{format(eventDate, 'EEEE')}</p>
                </div>
                <p className="text-sm text-gray-600 truncate">{e.venue}</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold w-fit ${e.isFree ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                  {e.isFree ? '✓ Free' : '$ Paid'}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold w-fit ${
                  past ? 'bg-gray-100 text-gray-400'
                  : e.isPublished ? 'bg-green-50 text-green-700'
                  : 'bg-amber-50 text-amber-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${past ? 'bg-gray-400' : e.isPublished ? 'bg-green-500' : 'bg-amber-400'}`} />
                  {past ? 'Past' : e.isPublished ? 'Live' : 'Draft'}
                </span>
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditing(e); setModalOpen(true) }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => setDeleteTarget(e)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            )
          })}
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

      {modalOpen && <EventModal event={editing} onClose={() => setModalOpen(false)} onSuccess={() => { setModalOpen(false); qc.invalidateQueries({ queryKey: ['admin', 'events'] }) }} />}
      {deleteTarget && <DeleteConfirm title={deleteTarget.title} onCancel={() => setDeleteTarget(null)} onConfirm={() => deleteMutation.mutate(deleteTarget.id)} loading={deleteMutation.isPending} />}
    </div>
  )
}

function DeleteConfirm({ title, onCancel, onConfirm, loading }: { title: string; onCancel: () => void; onConfirm: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></div>
        <h3 className="text-lg font-bold text-gray-900 text-center">Delete Event</h3>
        <p className="text-sm text-gray-500 text-center mt-2">Delete <span className="font-semibold text-gray-700">"{title}"</span>? This cannot be undone.</p>
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
