'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { businessApi, type Business } from '@/lib/api'

const CATEGORIES = ['All','Restaurants','Clinics','Pharmacies','Schools','Shops','Hotels','Banks','Garages','Bakeries']

function BusinessCard({ b }: { b: Business }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group flex gap-0">
      <div className="relative w-32 flex-shrink-0 bg-gray-100">
        {b.imageUrl ? (
          <Image src={b.imageUrl} alt={b.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl min-h-[120px]">🏪</div>
        )}
        <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm ${b.isOpen ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
          {b.isOpen ? '● Open' : '● Closed'}
        </span>
      </div>
      <div className="p-4 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <span className="text-xs text-primary font-bold uppercase tracking-wide bg-primary/8 px-2 py-0.5 rounded-full">{b.category}</span>
            <h3 className="font-bold text-gray-900 truncate mt-1">{b.name}</h3>
          </div>
          {b.isFeatured && <span className="flex-shrink-0 text-xs bg-accent text-gray-900 font-bold px-2 py-0.5 rounded-full">⭐</span>}
        </div>
        <p className="text-xs text-gray-500 truncate">📍 {b.address}</p>
        <p className="text-xs text-gray-400 truncate">🕐 {b.workingHours}</p>
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-xs font-bold text-gray-800">{b.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({b.reviewCount})</span>
          </div>
          <div className="flex gap-2">
            <a
              href={`https://maps.google.com/?q=${b.lat},${b.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              🗺️ Map
            </a>
            <a href={`tel:${b.phone}`} className="text-xs text-primary font-bold bg-primary/8 px-2.5 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors">
              📞 Call
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BusinessesPageClient() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['businesses', category, search, page],
    queryFn: () => businessApi.getAll({
      ...(category !== 'All' && { category }),
      ...(search && { search }),
      page: String(page),
      limit: '12',
    }),
  })

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Search businesses by name, category..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 bg-white shadow-sm"
        />
      </div>

      {/* Category Filter */}
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

      {/* Results count */}
      {!isLoading && data && (
        <p className="text-sm text-gray-500">
          Showing <strong className="text-gray-900">{data.data.length}</strong> of <strong className="text-gray-900">{data.pagination.total}</strong> businesses
          {category !== 'All' && <span> in <strong className="text-primary">{category}</strong></span>}
        </p>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-bold text-gray-600 text-lg">No businesses found</p>
          <p className="text-sm mt-2">Try a different search or category</p>
          <button onClick={() => { setSearch(''); setCategory('All') }} className="mt-4 text-sm text-primary font-semibold hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.data.map((b) => <BusinessCard key={b.id} b={b} />)}
          </div>

          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!data.pagination.hasPrev}
                className="px-4 py-2 text-sm rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 font-medium transition-colors"
              >
                ← Prev
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(data.pagination.totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 text-sm rounded-xl font-medium transition-colors ${
                      p === data.pagination.page ? 'bg-primary text-white' : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.pagination.hasNext}
                className="px-4 py-2 text-sm rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 font-medium transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
