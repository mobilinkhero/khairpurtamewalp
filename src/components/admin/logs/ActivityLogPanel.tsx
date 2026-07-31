'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import api from '@/lib/api'

const ACTION_COLORS: Record<string, string> = {
  created:     'bg-green-100 text-green-700',
  updated:     'bg-blue-100 text-blue-700',
  deleted:     'bg-red-100 text-red-600',
  published:   'bg-purple-100 text-purple-700',
  unpublished: 'bg-amber-100 text-amber-700',
  login:       'bg-gray-100 text-gray-600',
  logout:      'bg-gray-100 text-gray-600',
}

const ENTITY_ICONS: Record<string, string> = {
  business: '🏪', place: '🏛️', news: '📰', event: '🎉',
  banner: '🖼️', faq: '❓', user: '👤', settings: '⚙️',
}

export default function ActivityLogPanel() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'logs', page],
    queryFn: async () => {
      const r = await api.get(`/admin/logs?page=${page}&limit=20`)
      return r.data.data
    },
  })

  const logs = data?.data ?? []
  const pagination = data?.pagination

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[120px_100px_100px_1fr_160px] gap-4 px-5 py-3.5 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <span>Admin</span>
          <span>Action</span>
          <span>Entity</span>
          <span>Detail</span>
          <span>Time</span>
        </div>

        <div className="divide-y divide-gray-50">
          {isLoading ? (
            [...Array(10)].map((_, i) => (
              <div key={i} className="grid grid-cols-[120px_100px_100px_1fr_160px] gap-4 px-5 py-3.5 animate-pulse">
                {[...Array(5)].map((_, j) => <div key={j} className="h-4 bg-gray-100 rounded self-center" />)}
              </div>
            ))
          ) : logs.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-5xl mb-3">📋</div>
              <p className="text-sm font-semibold text-gray-500">No activity yet</p>
              <p className="text-xs text-gray-400 mt-1">Admin actions will appear here</p>
            </div>
          ) : logs.map((log: any) => (
            <div key={log.id} className="grid grid-cols-[120px_100px_100px_1fr_160px] gap-4 px-5 py-3.5 items-center hover:bg-gray-50/50 transition-colors">
              {/* Admin */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-black">{log.userName?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-xs text-gray-700 font-medium truncate">{log.userName?.split('@')[0]}</span>
              </div>
              {/* Action */}
              <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold w-fit capitalize ${ACTION_COLORS[log.action] ?? 'bg-gray-100 text-gray-600'}`}>
                {log.action}
              </span>
              {/* Entity */}
              <div className="flex items-center gap-1.5">
                <span className="text-base">{ENTITY_ICONS[log.entity] ?? '📄'}</span>
                <span className="text-xs text-gray-600 capitalize">{log.entity}</span>
              </div>
              {/* Detail */}
              <p className="text-sm text-gray-700 truncate">{log.entityName || log.detail}</p>
              {/* Time */}
              <p className="text-xs text-gray-400 whitespace-nowrap">
                {format(new Date(log.createdAt), 'dd MMM yyyy, HH:mm')}
              </p>
            </div>
          ))}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500">{pagination.total} total logs</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => p - 1)} disabled={!pagination.hasPrev}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-white text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              </button>
              <span className="px-3 py-1.5 text-xs text-gray-600 font-medium">{pagination.page}/{pagination.totalPages}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={!pagination.hasNext}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-white text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
