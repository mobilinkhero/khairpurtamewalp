export const revalidate = 60

import HeroSection from '@/components/public/HeroSection'
import FeaturedBusinesses from '@/components/public/FeaturedBusinesses'
import LatestNews from '@/components/public/LatestNews'
import QuickLinks from '@/components/public/QuickLinks'
import UpcomingEvents from '@/components/public/UpcomingEvents'
import EmergencyBanner from '@/components/public/EmergencyBanner'
import CityHighlights from '@/components/public/CityHighlights'
import AppDownloadBanner from '@/components/public/AppDownloadBanner'
import WeatherWidget from '@/components/public/WeatherWidget'
import PrayerTimesWidget from '@/components/public/PrayerTimesWidget'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <EmergencyBanner />
      <QuickLinks />

      {/* Weather & Prayer strip */}
      <section className="py-10 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <WeatherWidget />
          <PrayerTimesWidget />
        </div>
      </section>

      <FeaturedBusinesses />
      <CityHighlights />
      <LatestNews />
      <UpcomingEvents />
      <AppDownloadBanner />
    </>
  )
}
