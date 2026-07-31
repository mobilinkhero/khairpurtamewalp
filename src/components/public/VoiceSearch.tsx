'use client'

import { useState, useEffect } from 'react'

interface VoiceSearchProps {
  onResult: (text: string) => void
}

export default function VoiceSearch({ onResult }: VoiceSearchProps) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window))
  }, [])

  const startListening = () => {
    if (!supported) return
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'ur-PK'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      onResult(text)
    }
    recognition.start()
  }

  if (!supported) return null

  return (
    <button
      onClick={startListening}
      className={`p-2 rounded-lg transition-colors ${listening ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:bg-gray-100 text-gray-400'}`}
      title="Voice search in Urdu"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    </button>
  )
}
