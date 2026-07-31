'use client'

import { useQuery } from '@tanstack/react-query'

interface PrayerData {
  data: {
    timings: Record<string, string>
    date: { gregorian: { day: string; month: { en: string }; year: string }; hijri: { day: string; month: { en: string }; year: string } }
  }
}

const PRAYERS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
const PRAYER_ICONS: Record<string, string> = { Fajr: '🌙', Sunrise: '🌅', Dhuhr: '☀️', Asr: '🌤️', Maghrib: '🌇', Isha: '🌃' }

function clean(t: string) { return t.split(' ')[0] }

function getNextPrayer(timings: Record<string, string>) {
  const now = new Date()
  const nowMins = now.getHours() * 60 + now.getMinutes()
  for (const p of PRAYERS) {
    if (p === 'Sunrise') continue
    const parts = clean(timings[p] ?? '').split(':')
    if (parts.length < 2) continue
    const mins = parseInt(parts[0]) * 60 + parseInt(parts[1])
    if (mins > nowMins) return p
  }
  return 'Fajr'
}

export default function PrayerTimesWidget() {
  const today = new Date()
  const { data, isLoading } = useQuery<PrayerData>({
    queryKey: ['prayer', today.toDateString()],
    queryFn: async () => {
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=Khairpur&country=Pakistan&method=1&date=${today.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
      )
      return res.json()
    },
    staleTime: 1000 * 60 * 60 * 6, // 6h
  })

  if (isLoading) return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 animate-pulse h-36" />
  )

  if (!data?.data?.timings) return null

  const { timings, date } = data.data
  const next = getNextPrayer(timings)

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-purple-950 rounded-2xl p-5 text-white relative overflow-hidden">
      <div className="absolute -top-4 -right-4 text-8xl opacity-10 select-none">🕌</div>
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Prayer Times · KPT</p>
            <p className="text-xs text-indigo-300 mt-0.5">{date.gregorian.day} {date.gregorian.month.en} {date.gregorian.year}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-indigo-200">Next</p>
            <p className="text-sm font-black text-white">{next} {PRAYER_ICONS[next]}</p>
            <p className="text-xs font-bold text-indigo-200">{clean(timings[next] ?? '--')}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {PRAYERS.slice(0, 6).map(p => (
            <div key={p} className={`rounded-xl px-2 py-1.5 text-center transition-colors ${p === next ? 'bg-white/25 ring-1 ring-white/40' : 'bg-white/10'}`}>
              <p className="text-xs">{PRAYER_ICONS[p]}</p>
              <p className={`text-xs font-bold ${p === next ? 'text-white' : 'text-indigo-200'}`}>{p}</p>
              <p className={`text-xs font-black ${p === next ? 'text-yellow-300' : 'text-white'}`}>{clean(timings[p] ?? '--')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
