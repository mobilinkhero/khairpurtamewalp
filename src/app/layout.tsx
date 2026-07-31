import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import QueryProvider from '@/components/providers/QueryProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { LanguageProvider } from '@/components/providers/LanguageProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Khairpur Tamewali — Your City, Your Community',
    template: '%s | Khairpur Tamewali',
  },
  description: 'Your complete city guide for Khairpur Tamewali — businesses, places, news, events and emergency contacts. Bahawalpur District, Punjab, Pakistan.',
  keywords: ['Khairpur Tamewali', 'KPT', 'Bahawalpur', 'Punjab', 'Pakistan', 'City Guide', 'خیرپور تامیوالی'],
  openGraph: {
    title: 'Khairpur Tamewali — Your City, Your Community',
    description: 'Complete city guide for Khairpur Tamewali — businesses, places, news, events.',
    locale: 'en_PK',
    type: 'website',
    siteName: 'Khairpur Tamewali',
  },
  twitter: { card: 'summary_large_image', title: 'Khairpur Tamewali', description: 'Complete city guide for Khairpur Tamewali.' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <QueryProvider>
            <LanguageProvider>
              {children}
              <Toaster position="top-right" />
            </LanguageProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
