'use client'

import { useState, useRef, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '@/lib/api'

interface MediaFile { id: string; filename: string; url: string; alt: string; mimeType: string; size: number; uploadedBy: string; createdAt: string }

export default function MediaManager() {
  const qc = useQueryClient()
  const [urlInput, setUrlInput] = useState('')
  const [altInput, setAltInput] = useState('')
  const [selected, setSelected] = useState<MediaFile | null>(null)
  const [copied, setCopied] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: files = [], isLoading } = useQuery<MediaFile[]>({
    queryKey: ['admin', 'media'],
    queryFn: async () => { const r = await api.get('/admin/media'); return r.data.data },
  })

  const addMutation = useMutation({
    mutationFn: () => api.post('/admin/media', { url: urlInput, alt: altInput, filename: urlInput.split('/').pop() || 'image' }),
    onSuccess: () => { toast.success('Image saved to library'); setUrlInput(''); setAltInput(''); qc.invalidateQueries({ queryKey: ['admin', 'media'] }) },
    onError: () => toast.error('Failed to save image'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/media/${id}`),
    onSuccess: () => { toast.success('Deleted'); setSelected(null); qc.invalidateQueries({ queryKey: ['admin', 'media'] }) },
  })

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    toast.success('URL copied!')
    setTimeout(() => setCopied(''), 2000)
  }

  const uploadFiles = useCallback(async (fileList: FileList) => {
    setUploading(true)
    let success = 0
    for (const file of Array.from(fileList)) {
      if (!file.type.startsWith('image/')) continue
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('alt', file.name)
        await api.post('/admin/media', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        success++
      } catch {
        toast.error(`Failed to upload: ${file.name}`)
      }
    }
    if (success > 0) {
      toast.success(`${success} file(s) uploaded`)
      qc.invalidateQueries({ queryKey: ['admin', 'media'] })
    }
    setUploading(false)
  }, [qc])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files)
  }, [uploadFiles])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-5">

      {/* Upload area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">Upload from Computer</h3>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragOver ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-400 hover:bg-gray-50'
          }`}
        >
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-gray-200 border-t-green-500 rounded-full animate-spin" />
              <p className="text-sm font-medium text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-700">
                <span className="text-green-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, WebP up to 10MB</p>
            </div>
          )}
        </div>
      </div>

      {/* OR divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Or add via URL</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Add URL form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-60">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Image URL *</label>
            <input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://images.unsplash.com/..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
          </div>
          <div className="w-48">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Alt Text</label>
            <input value={altInput} onChange={e => setAltInput(e.target.value)} placeholder="Description..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
          </div>
          <div className="flex items-end">
            <button onClick={() => { if (urlInput.trim()) addMutation.mutate() }}
              disabled={!urlInput.trim() || addMutation.isPending}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-colors whitespace-nowrap">
              {addMutation.isPending ? 'Saving...' : '+ Save to Library'}
            </button>
          </div>
        </div>
        {urlInput.startsWith('http') && (
          <div className="mt-3 h-24 w-40 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
            <img src={urlInput} alt="preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Library <span className="text-gray-400 font-normal">({files.length})</span></h3>
          <p className="text-xs text-gray-400">Click any image to copy URL or delete</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 p-5">
            {[...Array(12)].map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : files.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl mb-3">🖼️</div>
            <p className="text-sm font-semibold text-gray-500">No images yet</p>
            <p className="text-xs text-gray-400 mt-1">Upload images above to build your library</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 p-5">
            {files.map(f => (
              <div key={f.id}
                onClick={() => setSelected(selected?.id === f.id ? null : f)}
                className={`group relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer border-2 transition-all ${selected?.id === f.id ? 'border-green-500 shadow-lg' : 'border-transparent hover:border-gray-300'}`}>
                <img src={f.url} alt={f.alt || f.filename} className="w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).src = '' }} />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={e => { e.stopPropagation(); copyUrl(f.url) }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${copied === f.url ? 'bg-green-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
                    title="Copy URL">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  </button>
                  <button onClick={e => { e.stopPropagation(); if (confirm('Delete this image?')) deleteMutation.mutate(f.id) }}
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center" title="Delete">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
                {/* Local upload badge */}
                {f.url.startsWith('/uploads/') && (
                  <div className="absolute top-1.5 left-1.5 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow">
                    LOCAL
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Selected detail */}
        {selected && (
          <div className="border-t border-gray-100 p-5 flex items-start gap-4 bg-green-50/30">
            <img src={selected.url} alt={selected.alt} className="w-20 h-20 rounded-xl object-cover border border-gray-200 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{selected.filename}</p>
              <div className="flex items-center gap-3 mt-0.5">
                {selected.alt && <p className="text-sm text-gray-500">{selected.alt}</p>}
                <span className="text-xs text-gray-400">{formatSize(selected.size)}</span>
                <span className="text-xs text-gray-400">{selected.mimeType}</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Uploaded by {selected.uploadedBy}</p>
              <div className="flex items-center gap-2 mt-2">
                <input readOnly value={selected.url} className="flex-1 text-xs bg-white border border-gray-200 rounded-lg px-3 py-1.5 font-mono truncate" />
                <button onClick={() => copyUrl(selected.url)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${copied === selected.url ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'}`}>
                  {copied === selected.url ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}