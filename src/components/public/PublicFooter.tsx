import Link from 'next/link'

export default function PublicFooter() {
  return (
    <footer className="bg-[#0a1f0a] dark:bg-gray-950 text-gray-400 border-t border-white/5 dark:border-gray-800">

      {/* CTA strip */}
      <div className="bg-primary dark:bg-gray-900 border-b border-green-700/30">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-black text-xl mb-1">Know a business we&apos;re missing?</h3>
            <p className="text-green-200 dark:text-gray-400 text-sm">Help us grow the directory — contact the admin to add listings.</p>
          </div>
          <Link
            href="/admin"
            className="flex-shrink-0 bg-accent text-gray-900 font-black px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors shadow-lg text-sm"
          >
            Submit a Listing →
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-black text-xs">KT</span>
              </div>
              <div>
                <div className="font-black text-white text-sm">Khairpur Tamewali</div>
                <div className="text-xs text-gray-500">City Guide & Community</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 mb-4">
              Your complete city guide — connecting residents with local businesses,
              places, news and community updates across Khairpur Tamewali.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-gray-500">Live & updated daily</span>
            </div>
            <div className="bg-white/5 rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-500">📍 Bahawalpur District, Punjab</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">🇵🇰 Pakistan</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">🕐 PKT (UTC+5)</div>
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-2">
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Explore</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/',           label: '🏠 Home' },
                { href: '/businesses', label: '🏪 Businesses' },
                { href: '/places',     label: '🏛️ Places' },
                { href: '/news',       label: '📰 News' },
                { href: '/events',     label: '🎉 Events' },
                { href: '/map',        label: '🗺️ City Map' },
                { href: '/search',     label: '🔍 Search' },
                { href: '/about',      label: 'ℹ️ About' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Categories</h4>
            <ul className="space-y-2.5">
              {['Restaurants', 'Hospitals', 'Schools', 'Mosques', 'Markets', 'Hotels', 'Pharmacies', 'Banks'].map((c) => (
                <li key={c}>
                  <Link href={`/businesses?category=${c}`} className="text-sm hover:text-white transition-colors">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">🚨 Emergency</h4>
            <ul className="space-y-3 mb-4">
              {[
                { name: 'Police',        number: '15',   color: 'text-blue-400' },
                { name: 'Rescue 1122',   number: '1122', color: 'text-green-400' },
                { name: 'Fire Brigade',  number: '16',   color: 'text-orange-400' },
                { name: 'Ambulance',     number: '1122', color: 'text-red-400' },
                { name: 'Edhi Foundation', number: '115', color: 'text-yellow-400' },
              ].map((e) => (
                <li key={e.name} className="flex items-center justify-between">
                  <span className="text-sm">{e.name}</span>
                  <a href={`tel:${e.number}`} className={`font-black text-lg ${e.color} hover:opacity-80 transition-opacity`}>{e.number}</a>
                </li>
              ))}
            </ul>
            <Link
              href="/emergency"
              className="block text-center bg-red-600/20 border border-red-600/30 text-red-400 text-xs font-bold py-2.5 rounded-xl hover:bg-red-600/30 transition-colors"
            >
              View All Emergency Contacts →
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Khairpur Tamewali Community Platform · All rights reserved
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>Bahawalpur District · Punjab, Pakistan</span>
            <span>·</span>
            <Link href="/admin" className="hover:text-gray-400 transition-colors">Admin Panel</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
