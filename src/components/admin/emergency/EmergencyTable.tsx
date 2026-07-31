'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { emergencyApi, type EmergencyContact } from '@/lib/api'
import EmergencyModal from './EmergencyModal'

const iconMap: Record<string, string> = {
  shield: '🛡️', ambulance: '🚑', heart: '❤️', flame: '🔥', hospital: '🏥', phone: '📞',
}

export default function EmergencyTable() {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<EmergencyContact | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<EmergencyContact | null>(null)

  const { data, isLoading } = useQuery({ queryKey: ['admin', 'emergency'], queryFn: emergencyApi.getAll })

  const deleteMutation = useMutation({
    mutationFn: emergencyApi.delete,
    onSuccess: () => { toast.success('Contact removed'); qc.invalidateQueries({ queryKey: ['admin', 'emergency'] }); setDeleteTarget(null) },
    onError: () => toast.error('Failed to delete'),
  })

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{data?.length ?? 0} emergency contacts configured</p>
        <button onClick={() => { setEditing(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          Add Contact
        </button>
      </div>

      {/* Grid cards layout */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl" />
                <div className="space-y-2 flex-1"><div className="h-4 bg-gray-100 rounded w-3/4" /><div className="h-3 bg-gray-100 rounded w-1/2" /></div>
              </div>
              <div className="h-8 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : data?.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">🚨</div>
          <p className="text-sm font-semibold text-gray-500">No emergency contacts yet</p>
          <p className="text-xs text-gray-400 mt-1">Add police, ambulance, fire brigade numbers</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.sort((a, b) => a.sortOrder - b.sortOrder).map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 group hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Color dot + icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: `${c.color}18`, border: `1.5px solid ${c.color}40` }}
                  >
                    {iconMap[c.icon] ?? '📞'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Order #{c.sortOrder}</p>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditing(c); setModalOpen(true) }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => setDeleteTarget(c)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>

              {/* Call number button */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ backgroundColor: `${c.color}10`, border: `1px solid ${c.color}20` }}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" style={{ color: c.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-black text-xl tracking-wide" style={{ color: c.color }}>{c.number}</span>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ color: c.color, backgroundColor: `${c.color}15` }}>
                  CALL
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && <EmergencyModal contact={editing} onClose={() => setModalOpen(false)} onSuccess={() => { setModalOpen(false); qc.invalidateQueries({ queryKey: ['admin', 'emergency'] }) }} />}
      {deleteTarget && <DeleteConfirm name={deleteTarget.name} onCancel={() => setDeleteTarget(null)} onConfirm={() => deleteMutation.mutate(deleteTarget.id)} loading={deleteMutation.isPending} />}
    </div>
  )
}

function DeleteConfirm({ name, onCancel, onConfirm, loading }: { name: string; onCancel: () => void; onConfirm: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></div>
        <h3 className="text-lg font-bold text-gray-900 text-center">Remove Contact</h3>
        <p className="text-sm text-gray-500 text-center mt-2">Remove <span className="font-semibold text-gray-700">"{name}"</span> from emergency contacts?</p>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />} Remove
          </button>
        </div>
      </div>
    </div>
  )
}
