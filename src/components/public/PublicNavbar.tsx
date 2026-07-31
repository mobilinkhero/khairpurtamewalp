'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { t } from '@/lib/translations'

const navLinks = [
  { href: '/',           labelKey: 'nav.home' },
  { href: '/businesses', labelKey: 'nav.businesses' },
  { href: '/places',     labelKey: 'nav.places' },
  { href: '/news',       labelKey: 'nav.news' },
  { href: '/events',     labelKey: 'nav.events' },
  { href: '/map',        labelKey: 'nav.map' },
  { href: '/about',      labelKey: 'nav.about' },
]

export default function PublicNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const { lang, toggleLang } = useLanguage()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
      setSearchOpen(false)
    }
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary dark:bg-gray-900 text-white text-xs py-2 hidden md:block border-b border-green-700/30">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <span className="text-green-200 dark:text-gray-400">📍 Bahawalpur District, Punjab, Pakistan</span>
          <div className="flex items-center gap-6 text-green-200 dark:text-gray-400">
            <span>Police: <strong className="text-white">15</strong></span>
            <span>Rescue: <strong className="text-white">1122</strong></span>
            <span>Fire: <strong className="text-white">16</strong></span>
            <Link href="/emergency" className="text-white font-semibold hover:text-accent transition-colors">🚨 Emergency</Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800/50 sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-black text-xs tracking-tight">KT</span>
              </div>
              <div className="hidden sm:block">
                  <div className="font-black text-gray-900 dark:text-white leading-tight">
                    {t('app.name', lang)}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{t('app.tagline', lang)}</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3.5 py-2 text-sm font-semibold rounded-lg transition-all',
                    pathname === link.href
                      ? 'text-primary dark:text-green-400 bg-primary/8 dark:bg-green-900/30'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  )}
                >
                  {t(link.labelKey, lang)}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              {/* Search */}
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-40 sm:w-56 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button type="button" onClick={() => setSearchOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </form>
              ) : (
                <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors" title="Search">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </button>
              )}

              {/* Language toggle */}
              <button
                onClick={toggleLang}
                className={cn('px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors hidden sm:flex items-center gap-1', lang === 'ur' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700')}
                title={lang === 'ur' ? 'Switch to English' : 'اردو میں جائیں'}
              >
                {lang === 'ur' ? 'EN' : 'اردو'}
              </button>

              {/* Dark mode */}
              {mounted && (
                <button
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                  title="Toggle dark mode"
                >
                  {isDark ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                  )}
                </button>
              )}

              {/* Emergency */}
              <Link href="/emergency" className="hidden sm:flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-red-700 transition-colors">
                🚨 <span className="hidden lg:inline">Emergency</span>
              </Link>

              {/* Mobile menu toggle */}
              <button className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setOpen(!open)}>
                {open
                  ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 space-y-1 shadow-lg">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                className={cn('block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors', pathname === link.href ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800')}>
                {t(link.labelKey, lang)}
              </Link>
            ))}
            <div className="flex items-center gap-2 px-4 py-2">
              <button onClick={toggleLang} className={cn('px-3 py-1.5 rounded-lg text-xs font-bold', lang === 'ur' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400')}>
                {lang === 'ur' ? 'EN' : 'اردو'}
              </button>
              {mounted && <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {isDark ? '☀️ Light' : '🌙 Dark'}
              </button>}
            </div>
            <Link href="/emergency" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 dark:bg-red-950/30">
              🚨 Emergency Contacts
            </Link>
          </div>
        )}
      </header>
    </>
  )
}
