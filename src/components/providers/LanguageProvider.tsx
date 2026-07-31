'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { Lang } from '@/lib/translations'

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    document.documentElement.lang = l === 'ur' ? 'ur' : 'en'
    document.documentElement.dir = l === 'ur' ? 'rtl' : 'ltr'
  }, [])

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'ur' : 'en')
  }, [lang, setLang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
