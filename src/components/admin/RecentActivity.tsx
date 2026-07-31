'use client'

import { useQuery } from '@tanstack/react-query'
import { businessApi, newsApi, eventApi } from '@/lib/api'
import { format } from 'date-fns'
import Link from 'next/link'

export default function RecentActivity() {
  const { data: bizData } = useQuery({ queryKey: ['businesses', 'recent'], queryFn: () => businessApi.getAll({ limit: '5' }) })
  const { data: newsData } = useQuery({ queryKey: ['news', 'recent'], queryFn: () => newsApi.getAll({ limit: '5' }) })
  const { data: eventData } = useQuery({ queryKey: ['events', 'recent'], queryFn: () => eventApi.getAll({ limit: '5' }) })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Recent Businesses */}
      <ActivityCard
        title="Recent Businesses"
        icon="🏪"
        href="/admin/businesses"
        accentClass="bg-blue-50 text-blue-600"
      >
        {bizData?.data.map((b) => (
          <div key={b.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-sm flex-shrink-0">🏪</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{b.name}</p>
              <p className="text-xs text-gray-400">{b.category}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${b.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {b.isOpen ? 'Open' : 'Closed'}
              </span>
              {b.isFeatured && <span className="text-xs text-amber-500 font-bold">⭐ Featured</span>}
            </div>
          </div>
        ))}
      </ActivityCard>

      {/* Recent News */}
      <ActivityCard
        title="Recent Articles"
        icon="📰"
        href="/admin/news"
        accentClass="bg-amber-50 text-amber-600"
      >
        {newsData?.data.map((n) => (
          <div key={n.id} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-sm flex-shrink-0">📰</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 line-clamp-1">{n.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-400">{n.publishedAt ? format(new Date(n.publishedAt), 'dd MMM') : '—'}</span>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${n.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {n.isPublished ? 'Live' : 'Draft'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </ActivityCard>

      {/* Upcoming Events */}
      <ActivityCard
        title="Upcoming Events"
        icon="🎉"
        href="/admin/events"
        accentClass="bg-purple-50 text-purple-600"
      >
        {eventData?.data.map((e) => (
          <div key={e.id} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
            <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <div className="text-center">
                <div className="text-xs font-black text-purple-600 leading-none">{format(new Date(e.date), 'dd')}</div>
                <div className="text-[9px] text-purple-400 uppercase">{format(new Date(e.date), 'MMM')}</div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 line-clamp-1">{e.title}</p>
              <p className="text-xs text-gray-400 truncate">📍 {e.venue}</p>
            </div>
            <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${e.isFree ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-600'}`}>
              {e.isFree ? 'Free' : 'Paid'}
            </span>
          </div>
        ))}
      </ActivityCard>
    </div>
  )
}

function ActivityCard({
  title, icon, href, accentClass, children,
}: {
  title: string
  icon: string
  href: string
  accentClass: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 ${accentClass} rounded-lg flex items-center justify-center text-sm`}>{icon}</div>
          <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
        </div>
        <Link href={href} className="text-xs text-primary font-semibold hover:underline">View all →</Link>
      </div>
      <div className="px-5 divide-y divide-gray-50">{children}</div>
    </div>
  )
}
