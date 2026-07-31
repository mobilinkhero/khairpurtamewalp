'use client'

import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import Link from 'next/link'

const statConfig = [
  {
    key: 'businesses',
    label: 'Businesses',
    icon: '🏪',
    href: '/admin/businesses',
    gradient: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100',
    desc: 'Active listings',
  },
  {
    key: 'places',
    label: 'Places',
    icon: '🏛️',
    href: '/admin/places',
    gradient: 'from-emerald-500 to-emerald-600',
    light: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
    desc: 'Landmarks & locations',
  },
  {
    key: 'news',
    label: 'News Articles',
    icon: '📰',
    href: '/admin/news',
    gradient: 'from-amber-500 to-amber-600',
    light: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100',
    desc: 'Published articles',
  },
  {
    key: 'events',
    label: 'Events',
    icon: '🎉',
    href: '/admin/events',
    gradient: 'from-purple-500 to-purple-600',
    light: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-100',
    desc: 'Community events',
  },
  {
    key: 'emergency',
    label: 'Emergency',
    icon: '🚨',
    href: '/admin/emergency',
    gradient: 'from-red-500 to-red-600',
    light: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-100',
    desc: 'Active contacts',
  },
]

export default function DashboardStats() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.getStats,
  })

  if (isLoading) return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
      ))}
    </div>
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {statConfig.map(({ key, label, icon, href, gradient, light, text, border, desc }) => {
        const value = data?.[key as keyof typeof data] ?? 0
        return (
          <Link
            key={key}
            href={href}
            className={`group relative bg-white border ${border} rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 overflow-hidden`}
          >
            {/* Background accent */}
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} opacity-5 rounded-full -translate-y-4 translate-x-4 group-hover:opacity-10 transition-opacity`} />

            <div className={`w-10 h-10 ${light} rounded-xl flex items-center justify-center text-xl mb-4`}>
              {icon}
            </div>
            <p className={`text-3xl font-black ${text} leading-none mb-1`}>{value}</p>
            <p className="text-sm font-bold text-gray-800">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>

            <div className="absolute bottom-4 right-4 text-gray-200 group-hover:text-gray-400 transition-colors text-xs font-bold">→</div>
          </Link>
        )
      })}
    </div>
  )
}
