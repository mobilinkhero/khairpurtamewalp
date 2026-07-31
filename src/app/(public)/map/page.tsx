import type { Metadata } from 'next'
import MapClient from '@/components/public/MapClient'

export const metadata: Metadata = {
  title: 'City Map — Khairpur Tamewali',
  description: 'Interactive map of businesses and places in Khairpur Tamewali.',
}

export default function MapPage() {
  return <MapClient />
}
