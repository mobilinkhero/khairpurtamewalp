'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { eventApi, type Event } from '@/lib/api'
import { format, isPast } from 'date-fns'

function EventCard({ e }: { e: Event }) {
  const past = isPast(new Date(e.date))
  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden group ${past ? 'border-gray-100 opacity-70' : 'border-gray-100 hover:border-primary/20 hover:shadow-xl'}`}>
      <div className="h-1.5 bg-gradient-to-r from-primary to-primary-light" />
      <div className="p-6 flex gap-5">
        {/* Date block */}
        <div className="flex-shrink-0 w-16 text-center">
          <div className={`rounded-xl py-3 px-2 ${past ? 'bg-gray-100' : 'bg-primary/10 group-hover:bg-primary/15 transition-colors'}`}>
            <div className={`text-2xl font-black leading-none ${past ? 'text-gray-400' : 'text-primary'}`}>
              {format(new Date(e.date), 'dd')}
            </div>
            <div className={`text-xs font-bold uppercase mt-1 ${past ? 'text-gray-400' : 'text-primary/70'}`}>
              {format(new Date(e.date), 'MMM')}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {format(new Date(e.date), 'yyyy')}
            </div>
          </div>
          {past && <div className="text-xs text-gray-400 mt-1.5 font-medium">Past</div>}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`font-bold leading-snug line-clamp-2 ${past ? 'text-gray-500' : 'text-gray-900 group-hover:text-primary transition-colors'}`}>
              {e.title}
            </h3>
            <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${e.isFree ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
              {e.isFree ? '✓ Free' : 'Paid'}
            </span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{e.description}</p>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 flex items-center gap-1.5"><span>📍</span> {e.venue}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1.5"><span>🕐</span> {e.time}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1.5"><span>👤</span> {e.organizer}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EventsPageClient() {
  const [filter, setFilter] = useState<'upcoming' | 'all'>('upcoming')

  const { data, isLoading } = useQuery({
    queryKey: ['events', filter],
    queryFn: () => eventApi.getAll({
      limit: '20',
      ...(filter === 'upcoming' && { upcoming: 'true' }),
    }),
  })

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {(['upcoming', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
              filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f === 'upcoming' ? '📅 Upcoming' : '🗓️ All Events'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📅</p>
          <p className="font-bold text-gray-600 text-lg">No events found</p>
          <p className="text-sm mt-2">Check back soon for upcoming community events</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500"><strong className="text-gray-900">{data?.data.length}</strong> events</p>
          {data?.data.map((e) => <EventCard key={e.id} e={e} />)}
        </div>
      )}
    </div>
  )
}
