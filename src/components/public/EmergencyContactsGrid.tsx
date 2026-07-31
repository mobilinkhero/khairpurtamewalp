'use client'

import { useQuery } from '@tanstack/react-query'
import { emergencyApi, type EmergencyContact } from '@/lib/api'

function ContactCard({ c }: { c: EmergencyContact }) {
  return (
    <a
      href={`tel:${c.number}`}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-3 cursor-pointer group"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform"
        style={{ backgroundColor: `${c.color}18` }}
      >
        {c.icon || '🚨'}
      </div>
      <div>
        <h3 className="font-bold text-gray-900 text-base">{c.name}</h3>
        <p className="text-3xl font-extrabold mt-1" style={{ color: c.color }}>{c.number}</p>
        <p className="text-xs text-gray-400 mt-2 bg-gray-50 px-3 py-1 rounded-full">📞 Tap to call</p>
      </div>
    </a>
  )
}

export default function EmergencyContactsGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ['emergency'],
    queryFn: emergencyApi.getAll,
  })

  if (isLoading) return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  )

  if (!data?.length) return null

  return (
    <div>
      <h3 className="text-xl font-black text-gray-900 mb-5">📞 Emergency Contacts</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((c) => <ContactCard key={c.id} c={c} />)}
      </div>
    </div>
  )
}
