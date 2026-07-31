import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import type { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import ShareButtons from '@/components/public/ShareButtons'

export const revalidate = 60
interface Props { params: Promise<{ id: string }> }

async function getEvent(id: string) {
  try { return await prisma.event.findUnique({ where: { id, isPublished: true } }) } catch { return null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const e = await getEvent(id)
  if (!e) return { title: 'Not Found' }
  return {
    title: `${e.title} — Khairpur Tamewali`,
    description: e.description,
    openGraph: { title: e.title, description: e.description, images: e.imageUrl ? [e.imageUrl] : [] },
  }
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params
  const e = await getEvent(id)
  if (!e) notFound()

  const related = await prisma.event.findMany({
    where: { isPublished: true, id: { not: e.id } },
    orderBy: { date: 'asc' }, take: 3,
  })

  const eventDate = new Date(e.date)
  const isPast = eventDate < new Date()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="relative h-72 md:h-96 bg-gray-200 dark:bg-gray-800 overflow-hidden">
        {e.imageUrl
          ? <img src={e.imageUrl} alt={e.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800">🎉</div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`px-3 py-1 text-xs font-bold rounded-lg backdrop-blur-sm ${e.isFree ? 'bg-green-500/80 text-white' : 'bg-blue-500/80 text-white'}`}>
                {e.isFree ? '✓ Free Entry' : '$ Paid Entry'}
              </span>
              {isPast
                ? <span className="px-3 py-1 bg-gray-500/80 backdrop-blur-sm text-white text-xs font-bold rounded-lg">Past Event</span>
                : <span className="px-3 py-1 bg-green-500/80 backdrop-blur-sm text-white text-xs font-bold rounded-lg">● Upcoming</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">{e.title}</h1>
          </div>
        </div>
        <Link href="/events" className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-lg hover:bg-white/30 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ShareButtons title={e.title} />

            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About This Event</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{e.description || 'No description available.'}</p>
            </div>
          </div>

          {/* Info card */}
          <div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden sticky top-24">
              {/* Date badge */}
              <div className={`p-5 text-center ${isPast ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gradient-to-br from-purple-500 to-purple-700'}`}>
                <p className={`text-4xl font-black ${isPast ? 'text-gray-500 dark:text-gray-400' : 'text-white'}`}>{format(eventDate, 'dd')}</p>
                <p className={`text-lg font-bold ${isPast ? 'text-gray-400' : 'text-purple-100'}`}>{format(eventDate, 'MMMM yyyy')}</p>
                <p className={`text-sm ${isPast ? 'text-gray-400' : 'text-purple-200'}`}>{format(eventDate, 'EEEE')}</p>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {[
                  { icon: '🕐', label: 'Time', value: e.time || 'TBD' },
                  { icon: '📍', label: 'Venue', value: e.venue },
                  { icon: '👤', label: 'Organizer', value: e.organizer || 'TBD' },
                  { icon: '🎟️', label: 'Entry', value: e.isFree ? 'Free' : 'Paid' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3 p-4">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-5">More Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.id} href={`/events/${r.id}`} className="group block bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-purple-50 dark:bg-purple-900/20 overflow-hidden flex items-center justify-center">
                    {r.imageUrl
                      ? <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <span className="text-4xl">🎉</span>}
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2">{r.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{format(new Date(r.date), 'dd MMM yyyy')} · {r.venue}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
