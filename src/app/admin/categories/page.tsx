import type { Metadata } from 'next'
import CategoriesPanel from '@/components/admin/categories/CategoriesPanel'
export const metadata: Metadata = { title: 'Categories — Admin' }
export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500 text-sm mt-1">Manage categories for businesses, places, news and events</p>
      </div>
      <CategoriesPanel />
    </div>
  )
}
