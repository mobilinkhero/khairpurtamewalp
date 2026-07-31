'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'

type ResultType = 'business' | 'place' | 'news' | 'event'

interface SearchResult {
  id: string
  title: string
  subtitle: string
  category: string
  imageUrl?: string
  type: ResultType
  href: string
  badge?: string
  badgeColor?: string
}

const TYPE_TABS: { value: ResultType | 'all'; label: string; icon: string }[] = [
  { value: 'all',      label: 'All',        icon: '🔍' },
  { value: 'business', label: 'Businesses', icon: '🏪' },
  { value: 'place',    label: 'Places',     icon: '🏛️' },
  { value: 'news',     label: 'News',       icon: '📰' },
  { value: 'event',    label: 'Events',     icon: '🎉' },
]

export default function SearchClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [activeType, setActiveType] = useState<ResultType | 'all'>('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const [businesses, places, news, events] = await Promise.all([
        fetch(`/api/businesses?search=${encodeURIComponent(q)}&limit=6`).then(r => r.json()),
        fetch(`/api/places?search=${encodeURIComponent(q)}&limit=6`).then(r => r.json()),
        fetch(`/api/news?search=${encodeURIComponent(q)}&limit=6`).then(r => r.json()),
        fetch(`/api/events?search=${encodeURIComponent(q)}&limit=6`).then(r => r.json()),
      ])
      const mapped: SearchResult[] = [
        ...(businesses.data?.data ?? []).map((b: any) => ({
          id: b.id, type: 'business' as ResultType,
          title: b.name, subtitle: b.address,
          category: b.category, imageUrl: b.imageUrl,
          href: `/businesses/${b.id}`,
          badge: b.isOpen ? 'Open' : 'Closed',
          badgeColor: b.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600',
        })),
        ...(places.data?.data ?? []).map((p: any) => ({
          id: p.id, type: 'place' as ResultType,
          title: p.name, subtitle: p.address,
          category: p.category, imageUrl: p.imageUrl,
          href: `/places/${p.id}`,
        })),
        ...(news.data?.data ?? []).map((n: any) => ({
          id: n.id, type: 'news' as ResultType,
          title: n.title, subtitle: n.summary,
          category: n.category, imageUrl: n.imageUrl,
          href: `/news/${n.id}`,
          badge: n.publishedAt ? format(new Date(n.publishedAt), 'dd MMM yyyy') : '',
          badgeColor: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        })),
        ...(events.data?.data ?? []).map((e: any) => ({
          id: e.id, type: 'event' as ResultType,
          title: e.title, subtitle: `${e.venue} · ${e.time || 'TBD'}`,
          category: e.organizer, imageUrl: e.imageUrl,
          href: `/events/${e.id}`,
          badge: e.isFree ? 'Free' : 'Paid',
          badgeColor: e.isFree ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700',
        })),
      ]
      setResults(mapped)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) { setQuery(q); doSearch(q) }
  }, [searchParams, doSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      doSearch(query.trim())
    }
  }

  const typeIcons: Record<ResultType, string> = { business: '🏪', place: '🏛️', news: '📰', event: '🎉' }

  const filtered = activeType === 'all' ? results : results.filter(r => r.type === activeType)
  const counts: Record<string, number> = {}
  results.forEach(r => { counts[r.type] = (counts[r.type] ?? 0) + 1 })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Search hero */}
      <div className="bg-gradient-to-br from-primary to-green-800 py-14 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-black text-white mb-2">Search Khairpur Tamewali</h1>
          <p className="text-green-200 text-sm mb-8">Find businesses, places, news and events</p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search for anything..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                autoFocus
              />
            </div>
            <button type="submit" className="px-6 py-3.5 bg-accent text-gray-900 font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg text-sm whitespace-nowrap">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Type tabs */}
        {searched && (
          <div className="flex gap-2 flex-wrap mb-6">
            {TYPE_TABS.map(t => (
              <button key={t.value} onClick={() => setActiveType(t.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                  activeType === t.value
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}>
                <span>{t.icon}</span>
                {t.label}
                {t.value !== 'all' && counts[t.value] !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-md text-xs font-bold ${activeType === t.value ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                    {counts[t.value]}
                  </span>
                )}
                {t.value === 'all' && results.length > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-md text-xs font-bold ${activeType === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                    {results.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-36 bg-gray-100 dark:bg-gray-800" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && searched && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No results found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Try a different keyword or browse by category</p>
                <div className="flex flex-wrap gap-3 justify-center mt-6">
                  {['/businesses', '/places', '/news', '/events'].map(href => (
                    <Link key={href} href={href} className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors capitalize">
                      {href.slice(1)}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((r: any) => (
                  <Link key={`${r.type}-${r.id}`} href={r.href}
                    className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="h-36 bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                      {r.imageUrl
                        ? <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="w-full h-full flex items-center justify-center text-5xl">{typeIcons[r.type]}</div>}
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold rounded-lg capitalize">{r.type}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 flex-1">{r.title}</p>
                        {r.badge && <span className={`flex-shrink-0 px-2 py-0.5 rounded-lg text-xs font-semibold ${r.badgeColor}`}>{r.badge}</span>}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{r.subtitle}</p>
                      {r.category && <span className="inline-block mt-2 text-xs text-primary dark:text-green-400 font-medium">{r.category}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* Default state */}
        {!searched && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏙️</div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Explore Khairpur Tamewali</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Type anything to search across businesses, places, news and events</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
              {[{ href: '/businesses', icon: '🏪', label: 'Businesses' }, { href: '/places', icon: '🏛️', label: 'Places' }, { href: '/news', icon: '📰', label: 'News' }, { href: '/events', icon: '🎉', label: 'Events' }].map(c => (
                <Link key={c.href} href={c.href} className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-primary hover:shadow-sm transition-all group">
                  <span className="text-3xl">{c.icon}</span>
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-green-400 transition-colors">{c.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
