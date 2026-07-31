'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { placeApi, type Place } from '@/lib/api'

const CATEGORIES = ['All','Hospitals','Schools','Mosques','Parks','Markets','Government','Landmarks']

function PlaceCard({ p }: { p: Place }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="relative h-40 bg-gray-100">
        {p.imageUrl ? (
          <Image src={p.imageUrl} alt={p.name} fill className="object-cover" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🏛️</div>
        )}
        <span className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {p.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900">{p.name}</h3>
        <p className="text-xs text-gray-500 mt-1">📍 {p.address}</p>
        {p.phone && (
          <a href={`tel:${p.phone}`} className="text-xs text-primary mt-1 block hover:underline">📞 {p.phone}</a>
        )}
        {p.facilities.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {p.facilities.slice(0, 3).map((f) => (
              <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{f}</span>
            ))}
            {p.facilities.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">+{p.facilities.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PlacesPageClient() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['places', category, search],
    queryFn: () => placeApi.getAll({
      ...(category !== 'All' && { category }),
      ...(search && { search }),
      limit: '20',
    }),
  })

  return (
    <div className="space-y-6">
      <input
        type="text"
        placeholder="Search places..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`flex-shrink-0 text-sm px-4 py-1.5 rounded-full font-medium transition-colors ${
              category === c ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data?.data.map((p) => <PlaceCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  )
}
