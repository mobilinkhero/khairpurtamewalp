import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Khairpur Tamewali',
  description: 'Learn about Khairpur Tamewali — history, city stats, emergency contacts and the team behind this platform.',
}

const stats = [
  { value: '~290K', label: 'Population', icon: '👥' },
  { value: '8',     label: 'Union Councils', icon: '🏛️' },
  { value: '1750+', label: 'Years of History', icon: '📜' },
  { value: '24/7',  label: 'Emergency Services', icon: '🚨' },
]

const emergency = [
  { name: 'Police',         number: '15',   color: '#1565C0', icon: '🛡️' },
  { name: 'Rescue 1122',    number: '1122', color: '#D32F2F', icon: '🚑' },
  { name: 'Fire Brigade',   number: '16',   color: '#E65100', icon: '🔥' },
  { name: 'Ambulance',      number: '1122', color: '#D32F2F', icon: '🏥' },
  { name: 'Edhi Foundation',number: '115',  color: '#1B5E20', icon: '❤️' },
]

const timeline = [
  { year: 'Early 18th C', event: 'City established, originally named "Khairpur"' },
  { year: '1750',         event: 'Ahmad Shah Abdali seized control of the region' },
  { year: 'Early 1900s',  event: 'Renamed "Tamewali" after an Englishman known as Tommy discovered a meteorite near the city' },
  { year: 'Modern Era',   event: 'Developed into a regional hub for agriculture, commerce and public services' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-primary via-green-700 to-green-900 py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-green-200 text-sm font-semibold rounded-full mb-4 border border-white/10">Bahawalpur District · Punjab · Pakistan</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">Khairpur Tamewali</h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">A historic city in the heart of Punjab — connecting residents with local businesses, services, news and community updates.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-10 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="text-2xl font-black text-primary dark:text-green-400">{s.value}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20 space-y-16">
        {/* History */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center text-xl">📜</div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">History</h2>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 md:p-8 text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
            <p>Khairpur Tamewali is a city in Bahawalpur District, Punjab, Pakistan. It serves as the capital of Khairpur Tamewali Tehsil and is a regional hub for agriculture, commerce and public services.</p>
            <p>The city was previously known simply as "Khairpur" in the early 18th century. It was renamed Tamewali after an Englishman known as "Tommy" who discovered a meteorite that fell near the junction of the Sidhnai Mailsi Link river and the Bahawal Canal in the early 1900s.</p>
            <p>Historically, the area was ruled by a Jadobansi Rajput king named Lakhi Rai Jadhaun until 1750, when Ahmad Shah Abdali seized control. Today, the local economy is primarily based on cotton and wheat farming, retail trade and public sector employment.</p>
          </div>
        </section>

        {/* Timeline */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-xl">🗓️</div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Timeline</h2>
          </div>
          <div className="space-y-4">
            {timeline.map((t, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="w-3 h-3 bg-white rounded-full" />
                  </div>
                  {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-1" />}
                </div>
                <div className="pb-6">
                  <p className="text-xs font-black text-primary dark:text-green-400 uppercase tracking-wider mb-1">{t.year}</p>
                  <p className="text-gray-700 dark:text-gray-300">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-xl">🚨</div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Emergency Contacts</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergency.map(e => (
              <a key={e.name} href={`tel:${e.number}`} className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: `${e.color}15`, border: `1.5px solid ${e.color}30` }}>{e.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 dark:text-gray-200 truncate">{e.name}</p>
                  <p className="text-2xl font-black" style={{ color: e.color }}>{e.number}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/emergency" className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:underline">
              View all emergency contacts →
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-6">
          <div className="flex gap-3">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div>
              <p className="font-bold text-amber-800 dark:text-amber-400 mb-1">Disclaimer</p>
              <p className="text-sm text-amber-700 dark:text-amber-500 leading-relaxed">This is an independent community platform. It is not affiliated with any government or official entity. Information is provided as-is for community benefit and may not always be up to date.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
