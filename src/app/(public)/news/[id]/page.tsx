import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import type { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import ShareButtons from '@/components/public/ShareButtons'

export const revalidate = 60
interface Props { params: Promise<{ id: string }> }

async function getNews(id: string) {
  try { return await prisma.news.findUnique({ where: { id, isPublished: true } }) } catch { return null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const n = await getNews(id)
  if (!n) return { title: 'Not Found' }
  return {
    title: `${n.title} — Khairpur Tamewali`,
    description: n.summary,
    openGraph: { title: n.title, description: n.summary, images: n.imageUrl ? [n.imageUrl] : [], type: 'article' },
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params
  const n = await getNews(id)
  if (!n) notFound()

  const related = await prisma.news.findMany({
    where: { category: n.category, isPublished: true, id: { not: n.id } },
    orderBy: { publishedAt: 'desc' }, take: 3,
  })

  const categoryColors: Record<string, string> = {
    Announcements: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    Health: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    Agriculture: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Education: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Community: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    Sports: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    General: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      {n.imageUrl && (
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img src={n.imageUrl} alt={n.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-green-400 mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to News
        </Link>

        {/* Article header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[n.category] ?? categoryColors.General}`}>
              {n.category}
            </span>
            {n.publishedAt && (
              <span className="text-sm text-gray-400 dark:text-gray-500">
                {format(new Date(n.publishedAt), 'dd MMMM yyyy')}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-4">{n.title}</h1>
          {n.summary && (
            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed border-l-4 border-primary pl-4">{n.summary}</p>
          )}
          <div className="flex items-center gap-3 mt-6">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-black">{n.author?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{n.author || 'Community Desk'}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Khairpur Tamewali</p>
            </div>
          </div>
        </div>

        {/* Article content */}
        <div className="prose prose-gray dark:prose-invert max-w-none mb-10">
          {n.content.split('\n').map((para, i) => para.trim() && (
            <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-base">{para}</p>
          ))}
        </div>

        {/* Share */}
        <div className="py-6 border-t border-b border-gray-100 dark:border-gray-800 mb-10">
          <ShareButtons title={n.title} />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-5">More in {n.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.id} href={`/news/${r.id}`} className="group block bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
                  {r.imageUrl && <div className="h-32 overflow-hidden"><img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>}
                  <div className="p-4">
                    <p className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2">{r.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{r.publishedAt ? format(new Date(r.publishedAt), 'dd MMM yyyy') : ''}</p>
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
