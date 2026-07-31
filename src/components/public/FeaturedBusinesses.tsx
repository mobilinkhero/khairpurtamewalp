import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'

async function getBusinesses() {
  return prisma.business.findMany({
    where: { isActive: true, isFeatured: true },
    take: 8,
    orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
  })
}

export default async function FeaturedBusinesses() {
  const businesses = await getBusinesses()
  if (!businesses.length) return null

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-primary font-bold text-xs uppercase tracking-widest mb-3 bg-primary/8 px-4 py-1.5 rounded-full">Business Directory</span>
            <h2 className="text-4xl font-black text-gray-900">Featured Businesses</h2>
            <p className="text-gray-500 mt-2">Top-rated local businesses in Khairpur Tamewali</p>
          </div>
          <Link
            href="/businesses"
            className="self-start sm:self-auto inline-flex items-center gap-2 bg-primary text-white text-sm font-bold px-5 py-3 rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
          >
            View All Directory →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {businesses.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/20 hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {b.imageUrl ? (
                  <Image
                    src={b.imageUrl}
                    alt={b.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-gray-50 to-gray-100">🏪</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${b.isOpen ? 'bg-green-500 text-white' : 'bg-gray-600 text-white'}`}>
                  {b.isOpen ? '● Open' : '● Closed'}
                </span>
                {b.isFeatured && (
                  <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-accent text-gray-900 shadow-sm">
                    ⭐ Featured
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <span className="text-xs font-bold text-primary uppercase tracking-wide">{b.category}</span>
                <h3 className="font-bold text-gray-900 text-base mt-1 mb-1 truncate">{b.name}</h3>
                <p className="text-xs text-gray-400 truncate mb-1">📍 {b.address}</p>
                <p className="text-xs text-gray-400 truncate mb-4">🕐 {b.workingHours}</p>

                {/* Rating */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {[1,2,3,4,5].map((star) => (
                        <span key={star} className={`text-xs ${star <= Math.round(b.rating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-800">{b.rating.toFixed(1)}</span>
                  </div>
                  <a
                    href={`tel:${b.phone}`}
                    className="text-xs font-bold text-primary bg-primary/8 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    📞 Call
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            href="/businesses"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-primary hover:text-white transition-all"
          >
            Browse All 200+ Businesses →
          </Link>
        </div>
      </div>
    </section>
  )
}
