'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { href: '/admin',             icon: '📊', label: 'Dashboard'   },
  { href: '/admin/businesses',  icon: '🏪', label: 'Businesses'  },
  { href: '/admin/places',      icon: '🏛️', label: 'Places'      },
  { href: '/admin/news',        icon: '📰', label: 'News'        },
  { href: '/admin/events',      icon: '🎉', label: 'Events'      },
  { href: '/admin/emergency',   icon: '🚨', label: 'Emergency'   },
  { href: '/admin/claims',      icon: '📋', label: 'Claims'      },
  { href: '/admin/categories',  icon: '🗂️', label: 'Categories'  },
  { href: '/admin/media',       icon: '🖼️', label: 'Gallery'     },
  { href: '/admin/banners',     icon: '📢', label: 'Banners'     },
  { href: '/admin/testimonials',icon: '⭐', label: 'Testimonials'},
  { href: '/admin/faqs',        icon: '❓', label: 'FAQs'        },
  { href: '/admin/logs',        icon: '📋', label: 'Activity Log'},
  { href: '/admin/users',       icon: '👥', label: 'Admin Users' },
  { href: '/admin/analytics',   icon: '📈', label: 'Analytics'   },
  { href: '/admin/settings',    icon: '⚙️', label: 'Settings'    },
  { href: '/admin/profile',     icon: '👤', label: 'My Profile'  },
]

const pageTitles: Record<string, string> = {
  '/admin':             'Dashboard',
  '/admin/businesses':  'Businesses',
  '/admin/places':      'Places & Landmarks',
  '/admin/news':        'News & Announcements',
  '/admin/events':      'Events',
  '/admin/emergency':   'Emergency Contacts',
  '/admin/claims':      'Claims Management',
  '/admin/categories':  'Categories',
  '/admin/media':       'Gallery / Media Manager',
  '/admin/banners':     'Banners & Announcements',
  '/admin/testimonials':'Testimonials & Reviews',
  '/admin/faqs':        'FAQs',
  '/admin/logs':        'Activity Log',
  '/admin/users':       'Admin Users',
  '/admin/analytics':   'Analytics',
  '/admin/settings':    'App Settings',
  '/admin/profile':     'My Profile',
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname()
  const router    = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Login page — render children only, no shell
  if (pathname === '/admin/login') return <>{children}</>
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [globalQuery, setGlobalQuery] = useState('')
  const [globalResults, setGlobalResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [clock, setClock] = useState('')
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notifRef    = useRef<HTMLDivElement>(null)
  const searchRef   = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const pageTitle = pageTitles[pathname] ?? 'Admin'

  const quickAddItems = [
    { href: '/admin/businesses?add=1', label: 'Business', icon: '🏪' },
    { href: '/admin/places?add=1',     label: 'Place',    icon: '🏛️' },
    { href: '/admin/news?add=1',       label: 'News',     icon: '📰' },
    { href: '/admin/events?add=1',     label: 'Event',    icon: '🎉' },
    { href: '/admin/testimonials?add=1', label: 'Testimonial', icon: '⭐' },
    { href: '/admin/faqs?add=1',       label: 'FAQ',      icon: '❓' },
  ]

  // Real-time clock
  useEffect(() => {
    function tick() {
      const now = new Date()
      setClock(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) +
        ' · ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus()
  }, [searchOpen])

  // Global search debounce
  useEffect(() => {
    if (globalQuery.length < 2) { setGlobalResults([]); setSearching(false); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(globalQuery)}`)
        const json = await res.json()
        setGlobalResults(json.data ?? [])
      } catch { setGlobalResults([]) }
      setSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [globalQuery])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const quickAddRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (quickAddRef.current && !quickAddRef.current.contains(e.target as Node)) setQuickAddOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white z-40 flex flex-col transition-all duration-300 shadow-2xl ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        {/* Logo */}
        <div className="px-6 pt-5 pb-5 border-b border-gray-800 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white font-black text-sm">KT</span>
          </div>
          <div className="whitespace-nowrap">
            <p className="font-bold text-white text-sm leading-tight">Khairpur Tamewali</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item, idx) => {
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
            // Section dividers
            const dividerBefore = idx === 6 || idx === 8 || idx === 9
            return (
              <div key={item.href}>
                {dividerBefore && <div className="my-2 border-t border-gray-800/60" />}
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap group ${
                    isActive
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
                </Link>
              </div>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-gray-800 space-y-1 flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all whitespace-nowrap"
          >
            <span className="text-base w-5 text-center flex-shrink-0">🌐</span>
            <span className="font-medium text-sm">View Website</span>
            <span className="ml-auto text-gray-600 text-xs">↗</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-all whitespace-nowrap"
          >
            <span className="text-base w-5 text-center flex-shrink-0">🚪</span>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-30 lg:hidden" />
      )}

      {/* ── Main area ──────────────────────────────────────────── */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'pl-64' : 'pl-0'}`}>

        {/* ── Top bar ──────────────────────────────────────────── */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 sticky top-0 z-20 shadow-sm">

          {/* Left: hamburger + page title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <span className={`block h-0.5 w-5 bg-gray-600 rounded-full transition-all duration-300 ${sidebarOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-5 bg-gray-600 rounded-full transition-all duration-300 ${sidebarOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-gray-600 rounded-full transition-all duration-300 ${sidebarOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
            <h2 className="text-sm font-semibold text-gray-700">{pageTitle}</h2>
          </div>

          {/* Right: clock + actions */}
          <div className="flex items-center gap-2">

            {/* Real-time clock */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">{clock}</span>
            </div>

            {/* Global search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen((o) => !o)}
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                title="Search everything"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-11 w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search businesses, news, events..."
                        value={globalQuery}
                        onChange={(e) => setGlobalQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
                      />
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {globalQuery.length < 2 ? (
                      <div className="px-4 py-6 text-center">
                        <p className="text-xs text-gray-400">Type at least 2 characters to search</p>
                      </div>
                    ) : searching ? (
                      <div className="px-4 py-6 text-center">
                        <div className="w-5 h-5 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin mx-auto" />
                      </div>
                    ) : globalResults.length === 0 ? (
                      <div className="px-4 py-6 text-center">
                        <p className="text-xs text-gray-400">No results found</p>
                      </div>
                    ) : (
                      globalResults.map((r: any) => (
                        <button
                          key={`${r.entity}-${r.id}`}
                          onClick={() => { router.push(r.url); setSearchOpen(false); setGlobalQuery('') }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors border-b border-gray-50 last:border-0"
                        >
                          <span className="text-base">{r.icon}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-800 truncate">{r.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{r.entity} · {r.category ?? ''}</p>
                          </div>
                          <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* View site */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              🌐 <span className="hidden sm:inline">View Site</span>
            </Link>

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => { setNotifOpen((o) => !o); setUserMenuOpen(false) }}
                className="relative w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-11 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2">
                  <p className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Notifications</p>
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-800">Database connected</p>
                    <p className="text-xs text-gray-400 mt-0.5">Clever Cloud MySQL · Active</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-800">Admin panel ready</p>
                    <p className="text-xs text-gray-400 mt-0.5">All systems operational</p>
                  </div>
                  <div className="border-t border-gray-50 mt-1 pt-1 px-4 py-2">
                    <p className="text-xs text-center text-gray-400">No new notifications</p>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200 mx-1" />

            {/* User menu */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => { setUserMenuOpen((o) => !o); setNotifOpen(false) }}
                className="flex items-center gap-2 pl-1 pr-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-black">A</span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-11 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-sm font-bold text-gray-800">Super Admin</p>
                    <p className="text-xs text-gray-400 truncate">admin@khairpurtamewali.com</p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => { setUserMenuOpen(false); router.push('/admin/profile') }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      My Profile
                    </button>
                    <button onClick={() => { setUserMenuOpen(false); router.push('/admin/settings') }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Settings
                    </button>
                    <Link href="/" target="_blank" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      View Website
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 pt-1">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Page content ─────────────────────────────────────── */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>

        {/* ── Quick Add FAB ────────────────────────────────────── */}
        <div ref={quickAddRef} className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setQuickAddOpen((o) => !o)}
            className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-full shadow-2xl hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
            title="Quick Add"
          >
            <svg className={`w-7 h-7 transition-transform duration-300 ${quickAddOpen ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          {quickAddOpen && (
            <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 w-56">
              <p className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Add</p>
              {quickAddItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setQuickAddOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
