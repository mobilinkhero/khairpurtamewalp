import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { format } from 'date-fns'

async function getNews() {
  return prisma.news.findMany({
    where: { isPublished: true },
    take: 4,
    orderBy: { publishedAt: 'desc' },
  })
}

export default async function LatestNews() {
  const news = await getNews()
  if (!news.length) return null

  const [featured, ...rest] = news

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-primary font-bold text-xs uppercase tracking-widest mb-3 bg-primary/8 px-4 py-1.5 rounded-full">Stay Informed</span>
            <h2 className="text-4xl font-black text-gray-900">Latest News</h2>
            <p className="text-gray-500 mt-2">What&apos;s happening in Khairpur Tamewali</p>
          </div>
          <Link
            href="/news"
            className="self-start sm:self-auto inline-flex items-center gap-2 bg-primary text-white text-sm font-bold px-5 py-3 rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
          >
            All News →
          </Link>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* Featured */}
          <Link href="/news" className="lg:col-span-3 group block">
            <div className="relative h-72 lg:h-[420px] rounded-2xl overflow-hidden bg-gray-100">
              {featured.imageUrl ? (
                <Image
                  src={featured.imageUrl}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl bg-gradient-to-br from-gray-100 to-gray-200">📰</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {featured.category}
                </span>
                <span className="bg-accent text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full">
                  Featured
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white font-black text-xl lg:text-2xl leading-snug mb-2 line-clamp-2">
                  {featured.title}
                </h3>
                <p className="text-white/65 text-sm line-clamp-2 mb-4">{featured.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white/50 text-xs">
                    <span>{featured.publishedAt ? format(new Date(featured.publishedAt), 'dd MMM yyyy') : ''}</span>
                    <span>·</span>
                    <span>by {featured.author}</span>
                  </div>
                  <span className="text-xs text-white/70 bg-white/10 px-3 py-1.5 rounded-full group-hover:bg-white/20 transition-colors">
                    Read more →
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Side list */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {rest.map((n) => (
              <Link key={n.id} href="/news" className="group flex gap-4 p-4 rounded-2xl border border-gray-100 hover:border-primary/20 hover:bg-primary/[0.02] hover:shadow-md transition-all">
                <div className="relative w-24 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  {n.imageUrl ? (
                    <Image src={n.imageUrl} alt={n.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📰</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-primary uppercase tracking-wide bg-primary/8 px-2 py-0.5 rounded-full">{n.category}</span>
                  <h4 className="font-bold text-gray-900 text-sm mt-1.5 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {n.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-2">
                    {n.publishedAt ? format(new Date(n.publishedAt), 'dd MMM yyyy') : ''} · {n.author}
                  </p>
                </div>
              </Link>
            ))}

            {/* View all card */}
            <Link
              href="/news"
              className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-gray-200 text-sm font-semibold text-gray-400 hover:border-primary hover:text-primary transition-all group"
            >
              <span className="group-hover:scale-110 transition-transform">📰</span>
              View all news →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
