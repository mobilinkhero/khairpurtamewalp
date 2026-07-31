'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface MapItem {
  id: string; name: string; category: string; address: string
  lat: number; lng: number; type: 'business' | 'place'; imageUrl?: string
  isOpen?: boolean; isFeatured?: boolean
}

const TILES = {
  light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
}

export default function MapClient() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const tileLayerRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [items, setItems] = useState<MapItem[]>([])
  const [selected, setSelected] = useState<MapItem | null>(null)
  const [filter, setFilter] = useState<'all' | 'business' | 'place'>('all')
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/businesses?limit=200').then(r => r.json()),
      fetch('/api/places?limit=200').then(r => r.json()),
    ]).then(([biz, plc]) => {
      const businesses: MapItem[] = (biz.data?.data ?? []).map((b: any) => ({
        id: b.id, name: b.name, category: b.category, address: b.address,
        lat: b.lat, lng: b.lng, type: 'business', imageUrl: b.imageUrl,
        isOpen: b.isOpen, isFeatured: b.isFeatured,
      }))
      const places: MapItem[] = (plc.data?.data ?? []).map((p: any) => ({
        id: p.id, name: p.name, category: p.category, address: p.address,
        lat: p.lat, lng: p.lng, type: 'place', imageUrl: p.imageUrl,
      }))
      setItems([...businesses, ...places])
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (loading || !mapRef.current || mapInstance.current) return
    import('leaflet').then(L => {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      const map = L.map(mapRef.current!).setView([29.5672, 72.2436], 14)
      tileLayerRef.current = L.tileLayer(TILES.light, { attribution: '© OpenStreetMap' }).addTo(map)
      mapInstance.current = map; _renderMarkers(L, map)
    })
    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null } }
  }, [loading, items, filter])

  const _renderMarkers = (L: any, map: any) => {
    markersRef.current.forEach(m => map.removeLayer(m))
    markersRef.current = []
    const filtered = filter === 'all' ? items : items.filter(i => i.type === filter)
    filtered.forEach(item => {
      if (!item.lat || !item.lng) return
      const isBiz = item.type === 'business'
      const isFeatured = item.isFeatured
      let bg = isBiz ? '#1B5E20' : '#1565C0'
      let icon = isBiz ? '🏪' : '🏛️'
      let border = '2px solid white'
      let extra = ''
      if (isFeatured) { bg = '#FF8F00'; icon = '⭐'; border = '3px solid #FFD54F'; extra = 'box-shadow:0 0 12px rgba(255,143,0,0.6);' }
      const marker = L.marker([item.lat, item.lng], {
        icon: L.divIcon({
          className: '',
          html: `<div style="width:${isFeatured ? 38 : 32}px;height:${isFeatured ? 38 : 32}px;background:${bg};border:${border};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${isFeatured ? 16 : 14}px;${extra}">${icon}</div>`,
          iconSize: [isFeatured ? 38 : 32, isFeatured ? 38 : 32],
          iconAnchor: [isFeatured ? 19 : 16, isFeatured ? 19 : 16],
        }),
      }).addTo(map).on('click', () => setSelected(item))
      markersRef.current.push(marker)
    })
  }

  // Re-render markers when filter or dark mode changes
  useEffect(() => {
    if (!mapInstance.current) return
    import('leaflet').then(L => {
      if (tileLayerRef.current) mapInstance.current.removeLayer(tileLayerRef.current)
      tileLayerRef.current = L.tileLayer(darkMode ? TILES.dark : TILES.light, { attribution: '© OpenStreetMap' }).addTo(mapInstance.current)
      _renderMarkers(L, mapInstance.current)
    })
  }, [filter, darkMode])

  const counts = { business: items.filter(i => i.type === 'business').length, place: items.filter(i => i.type === 'place').length }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">City Map</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} locations · {items.filter(i => i.isFeatured).length} featured</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All', count: items.length },
              { value: 'business', label: '🏪 Businesses', count: counts.business },
              { value: 'place', label: '🏛️ Places', count: counts.place },
            ].map(f => (
              <button key={f.value} onClick={() => setFilter(f.value as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${filter === f.value ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                {f.label}<span className={`px-1.5 py-0.5 rounded-md text-xs ${filter === f.value ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>{f.count}</span>
              </button>
            ))}
            <button onClick={() => setDarkMode(d => !d)}
              className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
              {darkMode ? '☀️ Light' : '🌙 Night'}
            </button>
          </div>
        </div>
      </div>
      <div className="flex h-[calc(100vh-128px)]">
        <div className="flex-1 relative">
          {loading ? (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <div className="text-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-sm text-gray-500">Loading map...</p></div>
            </div>
          ) : <div ref={mapRef} className="w-full h-full" />}
        </div>
        <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 overflow-y-auto flex-shrink-0 hidden lg:block">
          {selected ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${selected.type === 'business' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{selected.type}</span>
                  {selected.isFeatured && <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-700">⭐ Featured</span>}
                </div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
              </div>
              {selected.imageUrl && <div className="h-36 rounded-xl overflow-hidden bg-gray-100 mb-4"><img src={selected.imageUrl} alt={selected.name} className="w-full h-full object-cover" /></div>}
              <h3 className="font-black text-gray-900 dark:text-white text-lg mb-1">{selected.name}</h3>
              <p className="text-sm text-gray-500 mb-1">{selected.category}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex items-start gap-1.5"><span className="flex-shrink-0 mt-0.5">📍</span>{selected.address}</p>
              {selected.type === 'business' && selected.isOpen !== undefined && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold mb-4 ${selected.isOpen ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${selected.isOpen ? 'bg-green-500' : 'bg-red-400'}`} />{selected.isOpen ? 'Open Now' : 'Closed'}
                </span>
              )}
              <Link href={`/${selected.type === 'business' ? 'businesses' : 'places'}/${selected.id}`}
                className="block w-full text-center py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-green-700 transition-colors text-sm">View Details →</Link>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-3">All Locations</p>
              {(filter === 'all' ? items : items.filter(i => i.type === filter)).slice(0, 30).map(item => (
                <button key={`${item.type}-${item.id}`} onClick={() => { setSelected(item); if (mapInstance.current) mapInstance.current.setView([item.lat, item.lng], 17) }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                    {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : (item.type === 'business' ? '🏪' : '🏛️')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate group-hover:text-primary transition-colors">{item.name}</p>
                      {item.isFeatured && <span className="text-amber-500 text-xs">⭐</span>}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{item.category}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
