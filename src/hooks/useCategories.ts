'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

interface Category {
  id: string
  name: string
  type: string
  color: string
  icon: string
  sortOrder: number
}

// Fallback hardcoded lists in case DB has no categories yet
const FALLBACKS: Record<string, string[]> = {
  business: ['Restaurants','Clinics','Pharmacies','Schools','Shops','Hotels','Banks','Garages','Bakeries','Salons','Tailors','Grocery'],
  place:    ['Hospitals','Schools','Mosques','Parks','Markets','Government','Landmarks'],
  news:     ['Announcements','Health','Agriculture','Education','Community','Sports','General'],
  event:    ['Sports','Cultural','Religious','Educational','Community','Government','Entertainment'],
}

export function useCategories(type: 'business' | 'place' | 'news' | 'event') {
  const { data, isLoading } = useQuery<Category[]>({
    queryKey: ['categories', type],
    queryFn: async () => {
      const res = await api.get(`/admin/categories?type=${type}`)
      return res.data.data
    },
    staleTime: 1000 * 60 * 5, // 5 min
  })

  // If DB has categories, use them. Otherwise fall back to hardcoded list.
  const names: string[] =
    data && data.length > 0
      ? data.map(c => c.name)
      : FALLBACKS[type] ?? []

  return { categories: names, isLoading }
}
