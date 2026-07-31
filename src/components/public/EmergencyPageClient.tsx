import Link from 'next/link'

const tips = [
  { icon: '🚔', title: 'Stay Calm', desc: 'Speak clearly and give your exact location when calling police.' },
  { icon: '🚑', title: 'Medical Emergency', desc: 'Call 1122 for ambulance. Keep the patient still and comfortable.' },
  { icon: '🔥', title: 'Fire Emergency', desc: 'Evacuate immediately, call 16. Do not use elevators.' },
  { icon: '📍', title: 'Share Location', desc: 'Always share your GPS location with emergency services.' },
]

export default function EmergencyPageClient() {
  return (
    <div className="space-y-8">

      {/* SOS Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 animate-pulse">
              🚨
            </div>
            <div>
              <h2 className="font-black text-xl">Emergency? Act Fast!</h2>
              <p className="text-red-100 text-sm mt-0.5">Tap any contact below to call directly. Every second counts.</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <a href="tel:15" className="bg-white text-red-700 font-black px-5 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-sm">
              📞 Police: 15
            </a>
            <a href="tel:1122" className="bg-white/20 border border-white/30 text-white font-black px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors text-sm">
              🚑 Rescue: 1122
            </a>
          </div>
        </div>
      </div>

      {/* Contacts from API — rendered client-side */}
      <EmergencyContactsGrid />

      {/* Safety Tips */}
      <div>
        <h3 className="text-xl font-black text-gray-900 mb-5">🛡️ Safety Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tips.map((t) => (
            <div key={t.title} className="bg-white border border-gray-100 rounded-2xl p-5 flex gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                {t.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{t.title}</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important numbers */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="font-black text-gray-900 mb-4">📋 Quick Reference Numbers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Police', number: '15', color: 'text-blue-600', bg: 'bg-blue-50' },
            { name: 'Rescue 1122', number: '1122', color: 'text-green-600', bg: 'bg-green-50' },
            { name: 'Fire Brigade', number: '16', color: 'text-orange-600', bg: 'bg-orange-50' },
            { name: 'Edhi Foundation', number: '115', color: 'text-red-600', bg: 'bg-red-50' },
          ].map((e) => (
            <a
              key={e.name}
              href={`tel:${e.number}`}
              className={`${e.bg} rounded-xl p-4 text-center hover:shadow-md transition-all hover:-translate-y-0.5`}
            >
              <div className={`text-2xl font-black ${e.color}`}>{e.number}</div>
              <div className="text-xs text-gray-600 mt-1 font-medium">{e.name}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

// Client component for dynamic contacts
import EmergencyContactsGrid from './EmergencyContactsGrid'
