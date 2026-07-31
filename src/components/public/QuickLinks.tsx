import Link from 'next/link'

const links = [
  {
    href: '/businesses',
    icon: '🏪',
    label: 'Business Directory',
    desc: 'Shops, restaurants & services',
    count: '200+ listings',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    hover: 'hover:border-blue-300 hover:bg-blue-100/60 hover:shadow-blue-100',
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-600',
  },
  {
    href: '/places',
    icon: '🏛️',
    label: 'Places & Landmarks',
    desc: 'Hospitals, schools & mosques',
    count: '50+ places',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    hover: 'hover:border-emerald-300 hover:bg-emerald-100/60 hover:shadow-emerald-100',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-600',
  },
  {
    href: '/news',
    icon: '📰',
    label: 'Community News',
    desc: 'Latest local updates',
    count: 'Daily updates',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    hover: 'hover:border-amber-300 hover:bg-amber-100/60 hover:shadow-amber-100',
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-600',
  },
  {
    href: '/events',
    icon: '🎉',
    label: 'Events',
    desc: 'Upcoming community events',
    count: 'This week',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    hover: 'hover:border-purple-300 hover:bg-purple-100/60 hover:shadow-purple-100',
    dot: 'bg-purple-500',
    badge: 'bg-purple-100 text-purple-600',
  },
  {
    href: '/emergency',
    icon: '🚨',
    label: 'Emergency',
    desc: 'Police, rescue & fire',
    count: '24/7 available',
    bg: 'bg-red-50',
    border: 'border-red-100',
    hover: 'hover:border-red-300 hover:bg-red-100/60 hover:shadow-red-100',
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-600',
  },
]

export default function QuickLinks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-primary font-bold text-xs uppercase tracking-widest mb-3 bg-primary/8 px-4 py-1.5 rounded-full">Quick Access</span>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Everything in One Place</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">All city services and information, just a click away.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`group relative ${l.bg} ${l.border} ${l.hover} border-2 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{l.icon}</div>
              <div className="font-bold text-gray-900 text-sm mb-1.5">{l.label}</div>
              <div className="text-xs text-gray-500 leading-relaxed mb-3">{l.desc}</div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${l.badge}`}>{l.count}</span>
              <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${l.dot} opacity-60`} />
              <div className="absolute bottom-3 right-3 text-gray-300 group-hover:text-gray-500 transition-colors text-xs">→</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
