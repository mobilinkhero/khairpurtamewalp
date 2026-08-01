import type { Metadata } from 'next'
import { Suspense } from 'react'
import SearchClient from '@/components/public/SearchClient'

export const metadata: Metadata = {
  title: 'Search — Khairpur Tamewali',
  description: 'Search businesses, places, news and events in Khairpur Tamewali.',
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center"><p className="text-sm text-gray-500">Loading search...</p></div>}>
      <SearchClient />
    </Suspense>
  )
}
