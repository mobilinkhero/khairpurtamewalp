import PublicNavbar from '@/components/public/PublicNavbar'
import PublicFooter from '@/components/public/PublicFooter'
import AssistantBot from '@/components/public/AssistantBot'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <AssistantBot />
    </div>
  )
}
