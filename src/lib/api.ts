import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── Types ──────────────────────────────────────────────────────────────────────
export interface Business {
  id: string
  name: string
  category: string
  description: string
  address: string
  phone: string
  imageUrl: string
  rating: number
  reviewCount: number
  isOpen: boolean
  workingHours: string
  isFeatured: boolean
  tags: string[]
  lat: number
  lng: number
  isActive: boolean
  createdAt: string
}

export interface Place {
  id: string
  name: string
  category: string
  description: string
  address: string
  imageUrl: string
  facilities: string[]
  isFeatured: boolean
  phone: string
  lat: number
  lng: number
  distance: string
  isActive: boolean
  createdAt: string
}

export interface News {
  id: string
  title: string
  summary: string
  content: string
  imageUrl: string
  category: string
  author: string
  isPublished: boolean
  publishedAt: string | null
  createdAt: string
}

export interface Event {
  id: string
  title: string
  description: string
  imageUrl: string
  date: string
  time: string
  venue: string
  organizer: string
  isFree: boolean
  isPublished: boolean
  createdAt: string
}

export interface EmergencyContact {
  id: string
  name: string
  number: string
  icon: string
  color: string
  sortOrder: number
  isActive: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface Stats {
  businesses: number
  places: number
  news: number
  events: number
  emergency: number
}

// ── Business API ───────────────────────────────────────────────────────────────
export const businessApi = {
  getAll: async (params?: Record<string, string>) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Business>>>('/businesses', { params })
    return data.data
  },
  getOne: async (id: string) => {
    const { data } = await api.get<ApiResponse<Business>>(`/businesses/${id}`)
    return data.data
  },
  create: async (payload: Partial<Business>) => {
    const { data } = await api.post<ApiResponse<Business>>('/businesses', payload)
    return data.data
  },
  update: async (id: string, payload: Partial<Business>) => {
    const { data } = await api.put<ApiResponse<Business>>(`/businesses/${id}`, payload)
    return data.data
  },
  delete: async (id: string) => {
    await api.delete(`/businesses/${id}`)
  },
}

// ── Places API ─────────────────────────────────────────────────────────────────
export const placeApi = {
  getAll: async (params?: Record<string, string>) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Place>>>('/places', { params })
    return data.data
  },
  getOne: async (id: string) => {
    const { data } = await api.get<ApiResponse<Place>>(`/places/${id}`)
    return data.data
  },
  create: async (payload: Partial<Place>) => {
    const { data } = await api.post<ApiResponse<Place>>('/places', payload)
    return data.data
  },
  update: async (id: string, payload: Partial<Place>) => {
    const { data } = await api.put<ApiResponse<Place>>(`/places/${id}`, payload)
    return data.data
  },
  delete: async (id: string) => {
    await api.delete(`/places/${id}`)
  },
}

// ── News API ───────────────────────────────────────────────────────────────────
export const newsApi = {
  getAll: async (params?: Record<string, string>) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<News>>>('/news', { params })
    return data.data
  },
  getOne: async (id: string) => {
    const { data } = await api.get<ApiResponse<News>>(`/news/${id}`)
    return data.data
  },
  create: async (payload: Partial<News>) => {
    const { data } = await api.post<ApiResponse<News>>('/news', payload)
    return data.data
  },
  update: async (id: string, payload: Partial<News>) => {
    const { data } = await api.put<ApiResponse<News>>(`/news/${id}`, payload)
    return data.data
  },
  delete: async (id: string) => {
    await api.delete(`/news/${id}`)
  },
}

// ── Events API ─────────────────────────────────────────────────────────────────
export const eventApi = {
  getAll: async (params?: Record<string, string>) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Event>>>('/events', { params })
    return data.data
  },
  getOne: async (id: string) => {
    const { data } = await api.get<ApiResponse<Event>>(`/events/${id}`)
    return data.data
  },
  create: async (payload: Partial<Event>) => {
    const { data } = await api.post<ApiResponse<Event>>('/events', payload)
    return data.data
  },
  update: async (id: string, payload: Partial<Event>) => {
    const { data } = await api.put<ApiResponse<Event>>(`/events/${id}`, payload)
    return data.data
  },
  delete: async (id: string) => {
    await api.delete(`/events/${id}`)
  },
}

// ── Emergency API ──────────────────────────────────────────────────────────────
export const emergencyApi = {
  getAll: async () => {
    const { data } = await api.get<ApiResponse<EmergencyContact[]>>('/emergency')
    return data.data
  },
  create: async (payload: Partial<EmergencyContact>) => {
    const { data } = await api.post<ApiResponse<EmergencyContact>>('/emergency', payload)
    return data.data
  },
  update: async (id: string, payload: Partial<EmergencyContact>) => {
    const { data } = await api.put<ApiResponse<EmergencyContact>>(`/emergency/${id}`, payload)
    return data.data
  },
  delete: async (id: string) => {
    await api.delete(`/emergency/${id}`)
  },
}

// ── Admin API ──────────────────────────────────────────────────────────────────
export const adminApi = {
  getStats: async () => {
    const { data } = await api.get<ApiResponse<Stats>>('/admin/stats')
    return data.data
  },
  login: async (email: string, password: string) => {
    const { data } = await api.post<ApiResponse<{ id: string; name: string; email: string; role: string }>>(
      '/auth/login',
      { email, password }
    )
    return data.data
  },
  logout: async () => {
    await api.post('/auth/logout')
  },
}

// ── Admin-only versions (include all records) ──────────────────────────────────
export const adminBusinessApi = {
  getAll: async (params?: Record<string, string>) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Business>>>('/admin/businesses', { params })
    return data.data
  },
}

export default api
