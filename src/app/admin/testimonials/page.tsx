import type { Metadata } from 'next'
import TestimonialsPanel from '@/components/admin/testimonials/TestimonialsPanel'
export const metadata: Metadata = { title: 'Testimonials — Admin' }
export default function AdminTestimonialsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Testimonials & Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">Manage community reviews shown on the public site</p>
      </div>
      <TestimonialsPanel />
    </div>
  )
}
