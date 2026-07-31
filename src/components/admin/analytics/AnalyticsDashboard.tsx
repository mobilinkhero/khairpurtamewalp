'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar,
} from 'recharts'
import { format } from 'date-fns'

const COLORS = ['#16a34a','#2563eb','#d97706','#9333ea','#dc2626','#0891b2','#be185d','#65a30d']

interface Analytics {
  totals: Record<string, number>
  businesses: { total: number; open: number; closed: number; featured: number; byCategory: { name: string; count: number }[] }
  places: { total: number; byCategory: { name: string; count: number }[] }
  news: { total: number; published: number; drafts: number; byCategory: { name: string; count: number }[] }
  events: { total: number; free: number; paid: number; byOrganizer: { name: string; count: number }[] }
  recent: { businesses: any[]; news: any[]; events: any[] }
}

export default function AnalyticsDashboard() {
  const { data, isLoading } = useQuery<Analytics>({
    queryKey: ['admin', 'analytics'],
    queryFn: async () => { const r = await api.get('/admin/analytics'); return r.data.data },
    staleTime: 60000,
  })

  if (isLoading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
      </div>
      <div className="grid grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />)}
      </div>
    </div>
  )

  if (!data) return null

  const overviewCards = [
    { label: 'Businesses',  value: data.totals.businesses, sub: `${data.businesses.open} open`, color: 'text-blue-600',   bg: 'bg-blue-50',   icon: '🏪' },
    { label: 'Places',      value: data.totals.places,     sub: 'Active landmarks',             color: 'text-emerald-600',bg: 'bg-emerald-50',icon: '🏛️' },
    { label: 'News',        value: data.news.published,    sub: `${data.news.drafts} drafts`,   color: 'text-amber-600',  bg: 'bg-amber-50',  icon: '📰' },
    { label: 'Events',      value: data.totals.events,     sub: `${data.events.free} free`,     color: 'text-purple-600', bg: 'bg-purple-50', icon: '🎉' },
    { label: 'Emergency',   value: data.totals.emergency,  sub: 'Active contacts',              color: 'text-red-600',    bg: 'bg-red-50',    icon: '🚨' },
  ]

  const statusData = [
    { name: 'Open',     value: data.businesses.open,              fill: '#16a34a' },
    { name: 'Closed',   value: data.businesses.closed,            fill: '#dc2626' },
    { name: 'Featured', value: data.businesses.featured,          fill: '#d97706' },
  ]

  const newsStatusData = [
    { name: 'Published', value: data.news.published, fill: '#16a34a' },
    { name: 'Drafts',    value: data.news.drafts,    fill: '#d97706' },
  ]

  const eventStatusData = [
    { name: 'Free', value: data.events.free, fill: '#16a34a' },
    { name: 'Paid', value: data.events.paid, fill: '#2563eb' },
  ]

  return (
    <div className="space-y-6">

      {/* ── Overview stat cards ─────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {overviewCards.map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center text-xl mb-3`}>{c.icon}</div>
            <p className={`text-3xl font-black ${c.color}`}>{c.value}</p>
            <p className="text-sm font-bold text-gray-800 mt-0.5">{c.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Row 1: Businesses by category + Pie ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Bar chart — businesses by category */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-900">Businesses by Category</h3>
              <p className="text-xs text-gray-400 mt-0.5">Distribution across all categories</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">{data.businesses.total} total</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.businesses.byCategory} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Bar dataKey="count" name="Businesses" radius={[6, 6, 0, 0]}>
                {data.businesses.byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie — business status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-1">Business Status</h3>
          <p className="text-xs text-gray-400 mb-4">Open vs Closed vs Featured</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {statusData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {statusData.map(s => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.fill }} />
                  <span className="text-xs text-gray-600">{s.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-800">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 2: Places by category + News & Events pie ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Places by category */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-1">Places by Category</h3>
          <p className="text-xs text-gray-400 mb-4">{data.places.total} total places</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.places.byCategory} layout="vertical" margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#6b7280' }} width={70} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Bar dataKey="count" name="Places" radius={[0, 6, 6, 0]}>
                {data.places.byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* News status pie */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-1">News Status</h3>
          <p className="text-xs text-gray-400 mb-2">{data.news.total} total articles</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={newsStatusData} cx="50%" cy="50%" outerRadius={65} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {newsStatusData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {data.news.byCategory.slice(0, 4).map((c, i) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs text-gray-600">{c.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-700">{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Events breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-1">Events Breakdown</h3>
          <p className="text-xs text-gray-400 mb-2">{data.events.total} total events</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={eventStatusData} cx="50%" cy="50%" outerRadius={65} paddingAngle={3} dataKey="value">
                {eventStatusData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {eventStatusData.map(s => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.fill }} />
                  <span className="text-xs text-gray-600">{s.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-700">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 3: Recent activity ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent businesses */}
        <RecentCard title="Recent Businesses" icon="🏪" color="blue">
          {data.recent.businesses.map(b => (
            <div key={b.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 text-sm">🏪</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{b.name}</p>
                <p className="text-xs text-gray-400">{b.category}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <svg className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <span className="text-xs font-bold text-gray-600">{b.rating?.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </RecentCard>

        {/* Recent news */}
        <RecentCard title="Recent Articles" icon="📰" color="amber">
          {data.recent.news.map(n => (
            <div key={n.id} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0 text-sm">📰</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 line-clamp-1">{n.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">{format(new Date(n.createdAt), 'dd MMM')}</span>
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${n.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{n.isPublished ? 'Live' : 'Draft'}</span>
                </div>
              </div>
            </div>
          ))}
        </RecentCard>

        {/* Recent events */}
        <RecentCard title="Recent Events" icon="🎉" color="purple">
          {data.recent.events.map(e => (
            <div key={e.id} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-black text-purple-600">{format(new Date(e.date), 'dd')}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 line-clamp-1">{e.title}</p>
                <p className="text-xs text-gray-400 truncate">📍 {e.venue}</p>
              </div>
            </div>
          ))}
        </RecentCard>
      </div>
    </div>
  )
}

function RecentCard({ title, icon, color, children }: { title: string; icon: string; color: string; children: React.ReactNode }) {
  const colorMap: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', amber: 'bg-amber-50 text-amber-600', purple: 'bg-purple-50 text-purple-600' }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
        <div className={`w-8 h-8 ${colorMap[color]} rounded-lg flex items-center justify-center text-sm`}>{icon}</div>
        <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
      </div>
      <div className="px-5 divide-y divide-gray-50">{children}</div>
    </div>
  )
}
