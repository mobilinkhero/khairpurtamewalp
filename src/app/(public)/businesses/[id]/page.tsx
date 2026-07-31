import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import type { Metadata } from 'next'
import Link from 'next/link'
import ShareButtons from '@/components/public/ShareButtons'
import BusinessMap from '@/components/public/BusinessMap'

export const revalidate = 60

interface Props { params: Promise<{ id: string }> }

async function getBusiness(id: string) {
  try {
    const b = await prisma.business.findUnique({ where: { id, isActive: true } })
    return b
  } catch { return null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const b = await getBusiness(id)
  if (!b) return { title: 'Not Found' }
  return {
    title: `${b.name} — Khairpur Tamewali`,
    description: b.description,
    openGraph: { title: b.name, description: b.description, images: b.imageUrl ? [b.imageUrl] : [] },
  }
}

export default async function BusinessDetailPage({ params }: Props) {
  const { id } = await params
  const b = await getBusiness(id)
  if (!b) notFound()

  let tags: string[] = []
  try { tags = JSON.parse(b.tags) } catch { tags = [] }

  const related = await prisma.business.findMany({
    where: { category: b.category, isActive: true, id: { not: b.id } },
    take: 3,
  })

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero image */}
      <div className="relative h-72 md:h-96 bg-gray-200 dark:bg-gray-800 overflow-hidden">
        {b.imageUrl ? (
          <img src={b.imageUrl} alt={b.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800">🏪</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-lg">{b.category}</span>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg backdrop-blur-sm ${b.isOpen ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                ● {b.isOpen ? 'Open Now' : 'Closed'}
              </span>
              {b.isFeatured && <span className="px-2.5 py-1 bg-yellow-500/80 backdrop-blur-sm text-white text-xs font-semibold rounded-lg">★ Featured</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">{b.name}</h1>
          </div>
        </div>
        <Link href="/businesses" className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-lg hover:bg-white/30 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Rating + share */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className={`w-5 h-5 ${s <= Math.round(b.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200 dark:text-gray-700 dark:fill-gray-700'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                  <span className="text-lg font-black text-gray-900 dark:text-white ml-1">{b.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({b.reviewCount} reviews)</span>
                </div>
              </div>
              <ShareButtons title={b.name} />
            </div>

            {/* Description */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{b.description || 'No description available.'}</p>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map(t => (
                    <span key={t} className="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-lg border border-green-100 dark:border-green-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {b.lat && b.lng && (
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Location</h2>
                <BusinessMap lat={b.lat} lng={b.lng} name={b.name} />
              </div>
            )}
          </div>

          {/* Right — info card */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white">Business Info</h3>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {[
                  { icon: '📞', label: 'Phone', value: b.phone, href: `tel:${b.phone}` },
                  { icon: '📍', label: 'Address', value: b.address },
                  { icon: '🕐', label: 'Hours', value: b.workingHours || 'Not specified' },
                  { icon: '🏷️', label: 'Category', value: b.category },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3 p-4">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-semibold text-primary dark:text-green-400 hover:underline">{item.value}</a>
                      ) : (
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {b.phone && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                  <a href={`tel:${b.phone}`} className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    Call Now
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related businesses */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-5">More in {b.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r: any) => {
                let rTags: string[] = []
                try { rTags = JSON.parse(r.tags) } catch {}
                return (
                  <Link key={r.id} href={`/businesses/${r.id}`} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="h-32 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      {r.imageUrl
                        ? <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="w-full h-full flex items-center justify-center text-4xl">🏪</div>}
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-gray-900 dark:text-white truncate">{r.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        {r.rating.toFixed(1)}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
