import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import type { Metadata } from 'next'
import Link from 'next/link'
import BusinessMap from '@/components/public/BusinessMap'
import ShareButtons from '@/components/public/ShareButtons'

export const revalidate = 60

interface Props { params: Promise<{ id: string }> }

async function getPlace(id: string) {
  try { return await prisma.place.findUnique({ where: { id, isActive: true } }) } catch { return null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const p = await getPlace(id)
  if (!p) return { title: 'Not Found' }
  return { title: `${p.name} — Khairpur Tamewali`, description: p.description, openGraph: { title: p.name, description: p.description, images: p.imageUrl ? [p.imageUrl] : [] } }
}

export default async function PlaceDetailPage({ params }: Props) {
  const { id } = await params
  const p = await getPlace(id)
  if (!p) notFound()

  let facilities: string[] = []
  try { facilities = JSON.parse(p.facilities) } catch {}

  const related = await prisma.place.findMany({ where: { category: p.category, isActive: true, id: { not: p.id } }, take: 3 })

  const categoryIcons: Record<string, string> = {
    Hospitals: '🏥', Schools: '🏫', Mosques: '🕌', Parks: '🌳',
    Markets: '🛒', Government: '🏛️', Landmarks: '⭐', default: '📍',
  }
  const icon = categoryIcons[p.category] ?? categoryIcons.default

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="relative h-72 md:h-96 bg-gray-200 dark:bg-gray-800 overflow-hidden">
        {p.imageUrl
          ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800">{icon}</div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-lg">{p.category}</span>
              {p.isFeatured && <span className="px-2.5 py-1 bg-yellow-500/80 backdrop-blur-sm text-white text-xs font-semibold rounded-lg">★ Featured</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">{p.name}</h1>
          </div>
        </div>
        <Link href="/places" className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-lg hover:bg-white/30 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ShareButtons title={p.name} />

            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{p.description || 'No description available.'}</p>
            </div>

            {facilities.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Facilities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {facilities.map(f => (
                    <div key={f} className="flex items-center gap-2 px-3 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {p.lat && p.lng && (
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Location</h2>
                <BusinessMap lat={p.lat} lng={p.lng} name={p.name} />
              </div>
            )}
          </div>

          <div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white">Details</h3>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {[
                  { icon: '📍', label: 'Address', value: p.address },
                  { icon: '🏷️', label: 'Category', value: p.category },
                  ...(p.phone ? [{ icon: '📞', label: 'Phone', value: p.phone, href: `tel:${p.phone}` }] : []),
                  ...(p.distance !== '--' ? [{ icon: '📏', label: 'Distance', value: p.distance }] : []),
                ].map((item: any) => (
                  <div key={item.label} className="flex items-start gap-3 p-4">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{item.label}</p>
                      {item.href
                        ? <a href={item.href} className="text-sm font-semibold text-primary dark:text-green-400 hover:underline">{item.value}</a>
                        : <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.value}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-5">More {p.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r: any) => (
                <Link key={r.id} href={`/places/${r.id}`} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="h-32 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    {r.imageUrl
                      ? <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="w-full h-full flex items-center justify-center text-4xl">{icon}</div>}
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{r.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{r.address}</p>
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
