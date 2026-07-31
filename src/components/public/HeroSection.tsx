import Link from 'next/link'

const stats = [
  { value: '200+', label: 'Businesses', icon: '🏪' },
  { value: '50+',  label: 'Landmarks',  icon: '🏛️' },
  { value: '24/7', label: 'Emergency',  icon: '🚨' },
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0a2e0a] min-h-[92vh] flex items-center">

      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-primary/25 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-accent/8 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-primary/15 blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-accent/40 animate-float" />
      <div className="absolute top-40 right-20 w-2 h-2 rounded-full bg-green-400/50 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-1/4 w-2 h-2 rounded-full bg-accent/30 animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-white/20 animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 w-full">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-5 py-2.5 rounded-full mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Bahawalpur District · Punjab, Pakistan
            <span className="w-px h-3 bg-white/20" />
            <span className="text-accent">🌿 Est. City Guide</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Your Complete Guide to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-300 to-accent animate-gradient">
              Khairpur Tamewali
            </span>
          </h1>

          <p className="text-lg md:text-xl text-green-100/75 leading-relaxed mb-4 max-w-2xl mx-auto">
            Discover local businesses, explore landmarks, read community news,
            find upcoming events, and access emergency services — all in one place.
          </p>

          {/* Trust line */}
          <p className="text-sm text-green-300/60 mb-10">
            Trusted by thousands of residents · Updated daily
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/businesses"
              className="group bg-accent text-gray-900 font-black px-8 py-4 rounded-xl hover:bg-yellow-300 transition-all shadow-xl shadow-accent/25 text-sm flex items-center gap-2"
            >
              🏪 Browse Businesses
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/places"
              className="bg-white/10 border border-white/25 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm text-sm"
            >
              🏛️ Explore Places
            </Link>
            <Link
              href="/emergency"
              className="bg-red-600/80 border border-red-500/50 text-white font-bold px-8 py-4 rounded-xl hover:bg-red-600 transition-all backdrop-blur-sm text-sm flex items-center gap-2"
            >
              🚨 Emergency
            </Link>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10 max-w-lg mx-auto mb-12">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/5 backdrop-blur-sm py-6 px-4 text-center hover:bg-white/10 transition-colors">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-2xl font-black text-accent">{s.value}</div>
                <div className="text-xs text-green-300 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quick nav pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { href: '/businesses', label: 'Restaurants' },
              { href: '/businesses?category=Hospitals', label: 'Hospitals' },
              { href: '/businesses?category=Schools', label: 'Schools' },
              { href: '/places', label: 'Mosques' },
              { href: '/news', label: 'Latest News' },
              { href: '/events', label: 'Events' },
            ].map((p) => (
              <Link
                key={p.label}
                href={p.href}
                className="text-xs text-white/50 border border-white/10 px-3 py-1.5 rounded-full hover:text-white hover:border-white/30 transition-all"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
