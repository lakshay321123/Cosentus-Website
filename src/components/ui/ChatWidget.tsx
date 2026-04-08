'use client'

import { useRef, useState, useEffect } from 'react'
import { useChat } from './ChatContext'
import { BotMessage } from './ChatMessage'

export default function ChatWidget() {
  const { messages, sendMessage, isOpen, setIsOpen, isLoading } = useChat()
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200)
  }, [isOpen])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    sendMessage(input)
    setInput('')
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI chat"
          style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
            width: 60, height: 60, borderRadius: '50%', background: '#00B5D6',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 24px rgba(0,181,214,0.4), 0 8px 40px rgba(0,0,0,0.15)',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          {messages.length > 0 && (
            <span style={{ position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: '#fff', color: '#00B5D6', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {messages.filter(m => m.role === 'bot').length}
            </span>
          )}
        </button>
      )}

      {isOpen && (
        <div className="chat-widget" style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
          width: 400, height: 540, borderRadius: 16, background: 'white',
          border: '2px solid #00B5D6',
          boxShadow: '0 8px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,181,214,0.1)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'chatOpen 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {/* Blue header */}
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#00B5D6' }}>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: 'white', margin: 0 }}>Cosentus.ai</h4>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', margin: 0 }}>Revenue Intelligence Assistant</p>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 13 }}>✕</button>
          </div>

          {/* White message area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, background: 'white' }}>
            {/* Welcome — bot style */}
            <div style={{ background: '#00B5D6', borderRadius: '14px 14px 14px 4px', padding: '12px 16px', fontSize: 13, lineHeight: 1.6, color: 'white', maxWidth: '88%' }}>
              Hey! I&apos;m COSE AI. How can I help you today?
            </div>
            {messages.map((msg, i) => (
              <div key={i} style={{
                background: msg.role === 'user' ? '#F0F0F0' : '#00B5D6',
                color: msg.role === 'user' ? '#1a1a1a' : 'white',
                borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                padding: '12px 16px', fontSize: 13, lineHeight: 1.6, maxWidth: '88%',
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                fontWeight: msg.role === 'user' ? 500 : 400,
              }}>
                {msg.role === 'bot' ? (
                  <BotMessage text={msg.text} animate={i === messages.length - 1} />
                ) : msg.text}
              </div>
            ))}
            {isLoading && (
              <div style={{ background: '#00B5D6', borderRadius: '14px 14px 14px 4px', padding: '12px 16px', maxWidth: '60%', display: 'flex', gap: 4, alignItems: 'center' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', animation: 'dotBounce 1.4s infinite', animationDelay: '0s' }} />
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', animation: 'dotBounce 1.4s infinite', animationDelay: '0.2s' }} />
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', animation: 'dotBounce 1.4s infinite', animationDelay: '0.4s' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area with blue accent */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #E6E6E6', background: 'white' }}>
            <div style={{ display: 'flex', gap: 8, background: '#F5F5F5', borderRadius: 10, padding: '10px 14px', border: '1px solid #E6E6E6' }}>
              <input
                ref={inputRef}
                type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#1a1a1a', fontSize: 13, fontFamily: 'var(--font-body)' }}
              />
              <button onClick={handleSend} style={{ background: '#00B5D6', border: 'none', borderRadius: 8, padding: '6px 16px', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Send</button>
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
