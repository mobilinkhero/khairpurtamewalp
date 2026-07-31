'use client'

import { useState, useRef, useEffect } from 'react'

interface Message { role: 'user' | 'bot'; text: string }

export default function AssistantBot() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([{ role: 'bot', text: '👋 Ask me anything! Try "Find restaurants" or "Show me hospitals" in English or Urdu.' }])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const ask = async () => {
    if (!query.trim()) return
    const q = query; setQuery(''); setMessages(prev => [...prev, { role: 'user', text: q }])
    setLoading(true)
    try {
      const res = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q }) })
      const json = await res.json()
      const reply = json.data?.response || 'Sorry, I could not process that.'
      const results = json.data?.results
      setMessages(prev => [...prev, { role: 'bot', text: reply + (results?.length ? ` (${results.length} results)` : '') }])
    } catch { setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, something went wrong.' }]) }
    setLoading(false)
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 flex flex-col overflow-hidden" style={{ height: '440px' }}>
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-white">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <span className="font-bold text-sm">City Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm'}`}>{m.text}</div>
              </div>
            ))}
            {loading && <div className="flex justify-start"><div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2.5 text-sm text-gray-400"><span className="animate-pulse">Thinking...</span></div></div>}
            <div ref={bottomRef} />
          </div>
          <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()}
              placeholder="Ask in English or Urdu..."
              className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button onClick={ask} disabled={loading || !query.trim()}
              className="px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors text-sm">Send</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-full shadow-2xl hover:scale-105 transition-all z-50 flex items-center justify-center text-2xl" title="AI Assistant">
        {open ? '✕' : '🤖'}
      </button>
    </>
  )
}
