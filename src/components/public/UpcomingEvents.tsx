import Link from 'next/link'
import { prisma } from '@/lib/db'
import { format } from 'date-fns'

async function getEvents() {
  return prisma.event.findMany({
    where: { isPublished: true, date: { gte: new Date() } },
    take: 6,
    orderBy: { date: 'asc' },
  })
}

export default async function UpcomingEvents() {
  const events = await getEvents()
  if (!events.length) return null

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-primary font-bold text-xs uppercase tracking-widest mb-3 bg-primary/8 px-4 py-1.5 rounded-full">What&apos;s On</span>
            <h2 className="text-4xl font-black text-gray-900">Upcoming Events</h2>
            <p className="text-gray-500 mt-2">Don&apos;t miss what&apos;s happening in the community</p>
          </div>
          <Link
            href="/events"
            className="self-start sm:self-auto inline-flex items-center gap-2 bg-primary text-white text-sm font-bold px-5 py-3 rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
          >
            All Events →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((e) => (
            <div
              key={e.id}
              className="bg-white rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Top color bar */}
              <div className="h-1.5 bg-gradient-to-r from-primary to-primary-light" />

              <div className="p-6 flex gap-5">
                {/* Date block */}
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="bg-primary/10 rounded-xl py-3 px-2 group-hover:bg-primary/15 transition-colors">
                    <div className="text-2xl font-black text-primary leading-none">
                      {format(new Date(e.date), 'dd')}
                    </div>
                    <div className="text-xs font-bold text-primary/70 uppercase mt-1">
                      {format(new Date(e.date), 'MMM')}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {format(new Date(e.date), 'yyyy')}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {e.title}
                    </h3>
                    <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${e.isFree ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {e.isFree ? '✓ Free' : 'Paid'}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <span>📍</span> {e.venue}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <span>🕐</span> {e.time}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      <span>👤</span> {e.organizer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-primary hover:text-white transition-all"
          >
            🎉 View All Events →
          </Link>
        </div>
      </div>
    </section>
  )
}
