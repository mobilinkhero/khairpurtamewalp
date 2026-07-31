export default function AppDownloadBanner() {
  return (
    <section className="py-16 bg-[#0a2e0a] relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

          {/* Left */}
          <div className="text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Mobile App Available
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Take Khairpur Tamewali<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-300">
                Everywhere You Go
              </span>
            </h2>
            <p className="text-green-100/70 text-base leading-relaxed mb-8">
              Get the official app for instant access to businesses, emergency contacts,
              prayer times, weather updates and community news — right on your phone.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: '🕌', text: 'Prayer Times' },
                { icon: '🌤️', text: 'Local Weather' },
                { icon: '🚨', text: 'Emergency SOS' },
                { icon: '🔔', text: 'News Alerts' },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-2 text-green-200/80 text-sm">
                  <span>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            {/* Download buttons */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="flex items-center gap-3 bg-white text-gray-900 font-bold px-5 py-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors shadow-lg">
                <span className="text-2xl">🤖</span>
                <div className="text-left">
                  <div className="text-xs text-gray-500 leading-none">Get it on</div>
                  <div className="text-sm font-black leading-tight">Google Play</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 border border-white/20 text-white font-bold px-5 py-3 rounded-xl cursor-pointer hover:bg-white/20 transition-colors backdrop-blur-sm">
                <span className="text-2xl">🍎</span>
                <div className="text-left">
                  <div className="text-xs text-white/60 leading-none">Download on</div>
                  <div className="text-sm font-black leading-tight">App Store</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Phone mockup */}
          <div className="flex-shrink-0">
            <div className="relative w-56 h-[440px] bg-gray-900 rounded-[2.5rem] border-4 border-gray-700 shadow-2xl overflow-hidden">
              {/* Screen */}
              <div className="absolute inset-2 bg-[#0a2e0a] rounded-[2rem] overflow-hidden">
                {/* Status bar */}
                <div className="flex items-center justify-between px-4 pt-3 pb-2">
                  <span className="text-white/60 text-xs">9:41</span>
                  <div className="flex gap-1">
                    <span className="text-white/60 text-xs">●●●</span>
                  </div>
                </div>
                {/* App content preview */}
                <div className="px-3 space-y-2">
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="text-white text-xs font-bold mb-1">🌤️ Weather</div>
                    <div className="text-accent text-lg font-black">32°C</div>
                    <div className="text-white/50 text-xs">Khairpur Tamewali</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="text-white text-xs font-bold mb-2">🕌 Prayer Times</div>
                    <div className="space-y-1">
                      {['Fajr 4:32', 'Dhuhr 12:15', 'Asr 3:45'].map((p) => (
                        <div key={p} className="flex justify-between text-xs text-white/70">
                          <span>{p.split(' ')[0]}</span>
                          <span className="text-accent">{p.split(' ')[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-red-900/50 rounded-xl p-3 border border-red-500/30">
                    <div className="text-red-300 text-xs font-bold">🚨 Emergency</div>
                    <div className="text-white text-xs mt-1">Police · Rescue · Fire</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2">
                    <div className="text-white text-xs font-bold mb-1.5">📰 Latest News</div>
                    <div className="h-2 bg-white/20 rounded mb-1" />
                    <div className="h-2 bg-white/15 rounded w-3/4" />
                  </div>
                </div>
              </div>
              {/* Home indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-600 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
