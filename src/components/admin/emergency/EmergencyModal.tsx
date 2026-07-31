'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { emergencyApi, type EmergencyContact } from '@/lib/api'

interface Props { contact: EmergencyContact | null; onClose: () => void; onSuccess: () => void }

export default function EmergencyModal({ contact, onClose, onSuccess }: Props) {
  const isEdit = !!contact
  const [form, setForm] = useState({
    name: contact?.name ?? '',
    number: contact?.number ?? '',
    icon: contact?.icon ?? 'phone',
    color: contact?.color ?? '#D32F2F',
    sortOrder: contact?.sortOrder ?? 0,
  })

  const mutation = useMutation({
    mutationFn: (data: Partial<EmergencyContact>) =>
      isEdit ? emergencyApi.update(contact!.id, data) : emergencyApi.create(data),
    onSuccess: () => { toast.success(isEdit ? 'Updated!' : 'Created!'); onSuccess() },
    onError: () => toast.error('Something went wrong'),
  })

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold">{isEdit ? 'Edit Contact' : 'Add Contact'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate({ ...form, sortOrder: Number(form.sortOrder) }) }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} required className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number *</label>
            <input value={form.number} onChange={(e) => set('number', e.target.value)} required placeholder="e.g. 15 or +92-300-1234567" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input type="color" value={form.color} onChange={(e) => set('color', e.target.value)} className="w-full h-10 border border-gray-200 rounded-xl px-1 cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input type="number" min={0} value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="flex-1 bg-primary text-white font-semibold py-2.5 rounded-xl hover:bg-primary-light disabled:opacity-60">
              {mutation.isPending ? 'Saving...' : isEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
