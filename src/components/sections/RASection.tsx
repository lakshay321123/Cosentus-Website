'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import MotionReveal from '@/components/ui/MotionReveal'
import { useChat } from '@/components/ui/ChatContext'
import { BotMessage } from '@/components/ui/ChatMessage'

const placeholders = [
  'How does R+A reduce denials?',
  'What is my expected revenue lift?',
  'How do AI agents handle patient calls?',
  'What specialties do you support?',
]

function AIPanel() {
  const { messages, sendMessage, setIsOpen, isLoading } = useChat()
  const [expanded, setExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [placeholder, setPlaceholder] = useState('')
  const [phIdx, setPhIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (expanded || input.length > 0) return
    const current = placeholders[phIdx]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setPlaceholder(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) setTimeout(() => setDeleting(true), 2000)
        else setCharIdx(charIdx + 1)
      } else {
        setPlaceholder(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setPhIdx((phIdx + 1) % placeholders.length)
          setCharIdx(0)
        } else setCharIdx(charIdx - 1)
      }
    }, deleting ? 30 : 60)
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, phIdx, expanded, input])

  const handleFocus = () => { setExpanded(true); setPlaceholder('') }
  const handleSend = () => { if (!input.trim() || isLoading) return; sendMessage(input); setInput('') }
  const handleClose = () => { setExpanded(false); setInput(''); setCharIdx(0); setPhIdx(0); setDeleting(false) }

  return (
    <div style={{
      background: expanded ? 'white' : '#00B5D6',
      borderRadius: 'var(--radius-lg)', padding: expanded ? '0' : '56px 40px',
      color: expanded ? '#1a1a1a' : 'white',
      transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      height: 520, display: 'flex', flexDirection: 'column',
      border: expanded ? '2px solid #00B5D6' : 'none', overflow: 'hidden',
    }}>
      {!expanded ? (
        <>
          <h3 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 300, lineHeight: 1.3, marginBottom: 16 }}>
            Ask Anything About<br />Your Revenue Cycle
          </h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 32 }}>
            Cosentus.ai — your always-on revenue intelligence assistant.
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-md)', padding: '16px 24px',
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'text',
          }} onClick={() => inputRef.current?.focus()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.5)" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
              onFocus={handleFocus} onKeyDown={e => { if (e.key === 'Enter') { handleFocus(); setTimeout(() => handleSend(), 100) } }}
              placeholder={placeholder || 'Ask anything...'} className="ra-search-input"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: 15, fontFamily: 'var(--font-body)' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 32 }}>
            {[{ n: '~3,000', l: 'Calls/Day' }, { n: '8', l: 'AI Agents' }, { n: '50+', l: 'Languages' }, { n: '24/7', l: 'Coverage' }].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ fontSize: 20, fontWeight: 500, color: 'white' }}>{s.n}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#00B5D6', flexShrink: 0 }}>
            <div>
              <h4 style={{ fontSize: 18, fontWeight: 600, color: 'white', margin: 0 }}>COSE AI</h4>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', margin: 0 }}>Revenue Intelligence Assistant</p>
            </div>
            <button onClick={handleClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 14 }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: 16, background: 'white' }}>
            <div style={{ background: '#00B5D6', borderRadius: '14px 14px 14px 4px', padding: '14px 18px', fontSize: 14, lineHeight: 1.6, color: 'white', maxWidth: '85%' }}>
              Hey! I&apos;m COSE AI. How can I help you today?
            </div>
            {messages.map((msg, i) => (
              <div key={i} style={{
                background: msg.role === 'user' ? '#F0F0F0' : '#00B5D6',
                color: msg.role === 'user' ? '#1a1a1a' : 'white',
                borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                padding: '14px 18px', fontSize: 14, lineHeight: 1.6, maxWidth: '85%',
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                fontWeight: msg.role === 'user' ? 500 : 400,
              }}>
                {msg.role === 'bot' ? <BotMessage text={msg.text} animate={i === messages.length - 1} /> : msg.text}
              </div>
            ))}
            {isLoading && (
              <div style={{ background: '#00B5D6', borderRadius: '14px 14px 14px 4px', padding: '14px 18px', maxWidth: '60%', display: 'flex', gap: 4, alignItems: 'center' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', animation: 'dotBounce 1.4s infinite' }} />
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', animation: 'dotBounce 1.4s infinite', animationDelay: '0.2s' }} />
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', animation: 'dotBounce 1.4s infinite', animationDelay: '0.4s' }} />
              </div>
            )}
          </div>
          <div style={{ padding: '12px 16px', borderTop: '1px solid #E6E6E6', background: 'white', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 8, background: '#F5F5F5', borderRadius: 10, padding: '10px 14px', border: '1px solid #E6E6E6' }}>
              <input autoFocus type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type your question..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#1a1a1a', fontSize: 14, fontFamily: 'var(--font-body)' }}
              />
              <button onClick={handleSend} style={{ background: '#00B5D6', border: 'none', borderRadius: 8, padding: '8px 20px', color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Send</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function RASection() {
  return (
    <section className="section" id="ra" style={{ overflow: 'hidden' }}>
      <div className="container">
        <div className="ra-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <MotionReveal direction="left">
              <div className="section-label">REAL + ARTIFICIAL INTELLIGENCE</div>
            </MotionReveal>
            <MotionReveal direction="left" delay={0.15}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginBottom: 20 }}>
                Not Just a Billing Company.<br /><span style={{ color: '#00B5D6', fontStyle: 'italic' }}>A Platform.</span>
              </h2>
            </MotionReveal>
            <MotionReveal direction="left" delay={0.25}>
              <p style={{ fontSize: 16, color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 36 }}>
                Claims chased before you notice them. Denials overturned before they cost you. Collections handled while you see patients.
              </p>
            </MotionReveal>

            {/* Platform stats inline */}
            <MotionReveal direction="left" delay={0.35}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, marginBottom: 36 }}>
                {[
                  { n: '23', l: 'Modules' },
                  { n: '15', l: 'AI Features' },
                  { n: '8', l: 'Voice Agents' },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: '#00B5D6', padding: '24px 16px', textAlign: 'center',
                    borderRadius: i === 0 ? '12px 0 0 12px' : i === 2 ? '0 12px 12px 0' : '0',
                    transition: 'background 0.3s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#009BB8' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#00B5D6' }}
                  >
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'white', lineHeight: 1 }}>{item.n}</div>
                    <div style={{ fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>{item.l}</div>
                  </div>
                ))}
              </div>
            </MotionReveal>

            <MotionReveal direction="left" delay={0.45}>
              <Link href="/cosentus-ai" className="btn-ghost" style={{ color: 'var(--primary)', display: 'inline-flex' }}>
                Explore The Platform
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </MotionReveal>
          </div>

          <MotionReveal direction="right" delay={0.3}>
            <AIPanel />
          </MotionReveal>
        </div>
      </div>
    </section>
  )
}
