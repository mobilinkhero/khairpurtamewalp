import type { Metadata } from 'next'
import SearchClient from '@/components/public/SearchClient'

export const metadata: Metadata = {
  title: 'Search — Khairpur Tamewali',
  description: 'Search businesses, places, news and events in Khairpur Tamewali.',
}

export default function SearchPage() {
  return <SearchClient />
}
