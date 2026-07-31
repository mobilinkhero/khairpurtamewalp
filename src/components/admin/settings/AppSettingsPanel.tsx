'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '@/lib/api'

interface Setting { id: string; key: string; label: string; type: string; group: string; value: string }

const GROUP_META: Record<string, { label: string; icon: string; desc: string }> = {
  appearance: { label: 'Appearance',    icon: '🎨', desc: 'Hero image and visual settings' },
  general:    { label: 'General Info',  icon: '🏙️', desc: 'App name, tagline and city info' },
  city_stats: { label: 'City Stats',    icon: '📊', desc: 'Population and council info shown on About page' },
  links:      { label: 'Links',         icon: '🔗', desc: 'Play Store, contact and social links' },
  about:      { label: 'About & Legal', icon: '📄', desc: 'History text and disclaimer' },
  system:     { label: 'System',        icon: '⚙️', desc: 'Feature toggles and maintenance mode' },
}

export default function AppSettingsPanel() {
  const qc = useQueryClient()
  const [values, setValues] = useState<Record<string, string>>({})
  const [activeGroup, setActiveGroup] = useState('appearance')
  const [previewImage, setPreviewImage] = useState('')

  const { data: settings, isLoading } = useQuery<Setting[]>({
    queryKey: ['admin', 'settings'],
    queryFn: async () => { const r = await api.get('/admin/settings'); return r.data.data },
  })

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {}
      settings.forEach(s => { map[s.key] = s.value })
      setValues(map)
      setPreviewImage(map['hero_image_url'] ?? '')
    }
  }, [settings])

  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => { await api.put('/admin/settings', data) },
    onSuccess: () => { toast.success('Settings saved!'); qc.invalidateQueries({ queryKey: ['admin', 'settings'] }) },
    onError: () => toast.error('Failed to save'),
  })

  const grouped = settings?.reduce((acc, s) => {
    if (!acc[s.group]) acc[s.group] = []
    acc[s.group].push(s)
    return acc
  }, {} as Record<string, Setting[]>) ?? {}

  const groups = Object.keys(GROUP_META)
  const activeSettings = grouped[activeGroup] ?? []
  const isDirty = settings?.some(s => values[s.key] !== s.value)

  if (isLoading) return (
    <div className="grid grid-cols-4 gap-6">
      <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      <div className="col-span-3 space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
    </div>
  )

  return (
    <div className="flex gap-6 items-start">
      {/* ── Sidebar nav ─────────────────────────────── */}
      <div className="w-52 flex-shrink-0 space-y-1 sticky top-20">
        {groups.map(g => {
          const meta = GROUP_META[g]
          const changed = grouped[g]?.some(s => values[s.key] !== s.value)
          return (
            <button key={g} onClick={() => setActiveGroup(g)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                activeGroup === g ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              <span>{meta.icon}</span>
              <span className="flex-1">{meta.label}</span>
              {changed && <span className={`w-2 h-2 rounded-full ${activeGroup === g ? 'bg-white/70' : 'bg-amber-400'}`} />}
            </button>
          )
        })}

        {/* Save button */}
        <div className="pt-3">
          <button
            onClick={() => saveMutation.mutate(values)}
            disabled={saveMutation.isPending || !isDirty}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl disabled:opacity-40 flex items-center justify-center gap-2 transition-colors"
          >
            {saveMutation.isPending
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
              : isDirty ? '💾 Save Changes' : '✓ All Saved'}
          </button>
        </div>
      </div>

      {/* ── Settings panel ──────────────────────────── */}
      <div className="flex-1 space-y-5">
        {/* Group header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl">
              {GROUP_META[activeGroup]?.icon}
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{GROUP_META[activeGroup]?.label}</h2>
              <p className="text-xs text-gray-500">{GROUP_META[activeGroup]?.desc}</p>
            </div>
          </div>
        </div>

        {/* Hero image preview */}
        {activeGroup === 'appearance' && previewImage && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Hero Image Preview</p>
              <span className="text-xs text-gray-400">Shown on home screen</span>
            </div>
            <div className="relative h-48 bg-gray-100">
              <img
                src={previewImage}
                alt="Hero preview"
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                <div>
                  <p className="text-white font-black text-lg">{values['app_name'] ?? 'Khairpur Tamewali'}</p>
                  <p className="text-white/70 text-xs">{values['app_tagline'] ?? 'Your City · Your Community'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings fields */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {activeSettings.map((s) => (
              <div key={s.key} className="px-6 py-4 flex items-start gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{s.label}</label>
                  <p className="text-xs text-gray-400 mb-2 font-mono">{s.key}</p>

                  {s.type === 'boolean' ? (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setValues(v => ({ ...v, [s.key]: v[s.key] === 'true' ? 'false' : 'true' }))}
                        className={`relative w-11 h-6 rounded-full transition-colors ${values[s.key] === 'true' ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${values[s.key] === 'true' ? 'translate-x-5' : ''}`} />
                      </button>
                      <span className={`text-sm font-medium ${values[s.key] === 'true' ? 'text-green-600' : 'text-gray-400'}`}>
                        {values[s.key] === 'true' ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  ) : s.type === 'textarea' ? (
                    <textarea
                      value={values[s.key] ?? ''}
                      onChange={(e) => setValues(v => ({ ...v, [s.key]: e.target.value }))}
                      rows={4}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 resize-none transition-all"
                    />
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={values[s.key] ?? ''}
                        onChange={(e) => {
                          setValues(v => ({ ...v, [s.key]: e.target.value }))
                          if (s.key === 'hero_image_url') setPreviewImage(e.target.value)
                        }}
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all"
                        placeholder={s.type === 'image' ? 'https://...' : ''}
                      />
                    </div>
                  )}
                </div>

                {/* Changed indicator */}
                {values[s.key] !== s.value && (
                  <span className="mt-7 flex-shrink-0 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg">Changed</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
