'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { newsApi, type News } from '@/lib/api'
import { format } from 'date-fns'

const CATEGORIES = ['All', 'Local', 'Health', 'Education', 'Business', 'Events', 'Government', 'Sports']

function NewsCard({ n }: { n: News }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {n.imageUrl ? (
          <Image src={n.imageUrl} alt={n.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-gray-50 to-gray-100">📰</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
          {n.category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors leading-snug">{n.title}</h3>
        <p className="text-sm text-gray-500 mt-2 line-clamp-3 leading-relaxed">{n.summary}</p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs">✍️</div>
            <span className="text-xs text-gray-500 font-medium">{n.author}</span>
          </div>
          <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
            {n.publishedAt ? format(new Date(n.publishedAt), 'dd MMM yyyy') : ''}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function NewsPageClient() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['news', search, category, page],
    queryFn: () => newsApi.getAll({
      ...(search && { search }),
      ...(category !== 'All' && { category }),
      page: String(page),
      limit: '9',
    }),
  })

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Search news and announcements..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white shadow-sm"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => { setCategory(c); setPage(1) }}
            className={`flex-shrink-0 text-sm px-4 py-2 rounded-full font-semibold transition-all ${
              category === c
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📰</p>
          <p className="font-bold text-gray-600 text-lg">No articles found</p>
          <button onClick={() => { setSearch(''); setCategory('All') }} className="mt-4 text-sm text-primary font-semibold hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {!isLoading && data && (
            <p className="text-sm text-gray-500">
              <strong className="text-gray-900">{data.pagination.total}</strong> articles found
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data?.data.map((n) => <NewsCard key={n.id} n={n} />)}
          </div>
          {data && data.pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button onClick={() => setPage((p) => p - 1)} disabled={!data.pagination.hasPrev} className="px-4 py-2 text-sm rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 font-medium">← Prev</button>
              <span className="px-4 py-2 text-sm text-gray-600 font-medium">{data.pagination.page} / {data.pagination.totalPages}</span>
              <button onClick={() => setPage((p) => p + 1)} disabled={!data.pagination.hasNext} className="px-4 py-2 text-sm rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 font-medium">Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
