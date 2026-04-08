'use client'

import { useState, useRef } from 'react'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{role: string; text: string}[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: 'user', text: input }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: "Thanks for your question! Our team will connect with you shortly. Schedule a free revenue analysis for detailed insights about your practice." }])
    }, 800)
  }

  const handleOpen = () => {
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 200)
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={handleOpen}
          aria-label="Open AI chat"
          style={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            zIndex: 9999,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: '#00B5D6',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 24px rgba(0,181,214,0.4), 0 8px 40px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 9999,
          width: 380,
          height: 520,
          borderRadius: 16,
          background: '#00B5D6',
          boxShadow: '0 8px 40px rgba(0,0,0,0.25), 0 0 60px rgba(0,181,214,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'chatOpen 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {/* Header */}
          <div style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 500, color: 'white', margin: 0 }}>Cosentus.ai</h4>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Revenue Intelligence Assistant</p>
            </div>
            <button onClick={() => { setOpen(false); setMessages([]); setInput('') }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 13 }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: '#36C2DE', borderRadius: '14px 14px 14px 4px', padding: '12px 16px', fontSize: 13, lineHeight: 1.6, color: 'white', maxWidth: '88%' }}>
              Hi! I&apos;m Cosentus.ai. How can I help your practice today?
            </div>
            {messages.map((msg, i) => (
              <div key={i} style={{
                background: msg.role === 'user' ? 'white' : '#36C2DE',
                color: msg.role === 'user' ? '#00B5D6' : 'white',
                borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                padding: '12px 16px', fontSize: 13, lineHeight: 1.6, maxWidth: '88%',
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                fontWeight: msg.role === 'user' ? 500 : 400,
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 14px' }}>
              <input
                ref={inputRef}
                type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: 13, fontFamily: 'var(--font-body)' }}
              />
              <button onClick={handleSend} style={{ background: 'white', border: 'none', borderRadius: 8, padding: '6px 16px', color: '#00B5D6', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Send</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes chatOpen {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  )
}
