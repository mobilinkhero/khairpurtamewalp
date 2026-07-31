'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { format } from 'date-fns'

interface Claim {
  id: string; businessId: string; businessName: string; claimerName: string; claimerPhone: string; status: string; note: string; createdAt: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  verified: 'bg-blue-50 text-blue-700 border-blue-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
}

export default function ClaimsPanel() {
  const qc = useQueryClient()
  const [selected, setSelected] = useState<Claim | null>(null)
  const [note, setNote] = useState('')

  const { data: claims = [], isLoading } = useQuery<Claim[]>({
    queryKey: ['admin', 'claims'],
    queryFn: async () => { const r = await api.get('/admin/claims'); return r.data.data },
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.put(`/admin/claims/${id}`, { status: 'approved' }),
    onSuccess: () => { toast.success('Claim approved'); qc.invalidateQueries({ queryKey: ['admin', 'claims'] }); setSelected(null) },
  })

  const rejectMutation = useMutation({
    mutationFn: (id: string) => api.put(`/admin/claims/${id}`, { status: 'rejected' }),
    onSuccess: () => { toast.success('Claim rejected'); qc.invalidateQueries({ queryKey: ['admin', 'claims'] }); setSelected(null) },
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {isLoading ? (
        <div className="p-8 space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : claims.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">📋</div>
          <p className="text-sm font-semibold text-gray-500">No claim requests</p>
          <p className="text-xs text-gray-400 mt-1">When business owners request to claim listings, they appear here</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {claims.map((c) => (
            <div key={c.id} onClick={() => setSelected(selected?.id === c.id ? null : c)}
              className={`p-5 hover:bg-gray-50/60 cursor-pointer transition-colors ${selected?.id === c.id ? 'bg-green-50/40' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{c.businessName}</h3>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColors[c.status] || 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
                  </div>
                  <p className="text-sm text-gray-600">Claimed by <span className="font-semibold">{c.claimerName}</span> · {c.claimerPhone}</p>
                  <p className="text-xs text-gray-400 mt-1">{format(new Date(c.createdAt), 'dd MMM yyyy, h:mm a')}</p>
                </div>
                {selected?.id === c.id && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {c.status === 'verified' && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); approveMutation.mutate(c.id) }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors">Approve</button>
                        <button onClick={(e) => { e.stopPropagation(); rejectMutation.mutate(c.id) }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors">Reject</button>
                      </>
                    )}
                    {c.status === 'pending' && <span className="text-xs text-gray-400 italic">Waiting for OTP verification</span>}
                    {c.status === 'approved' && <span className="text-xs text-green-600 font-semibold">✓ Approved</span>}
                    {c.status === 'rejected' && <span className="text-xs text-red-600 font-semibold">✕ Rejected</span>}
                  </div>
                )}
              </div>
              {selected?.id === c.id && c.note && (
                <div className="mt-3 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">Note: {c.note}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
