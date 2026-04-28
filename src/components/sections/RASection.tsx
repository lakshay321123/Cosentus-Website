'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
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
          <h3 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', fontWeight: 400, lineHeight: 1.25, marginBottom: 18, color: 'white' }}>
            Ask Anything About<br />Your Revenue Cycle
          </h3>
          <p style={{ fontSize: 16, color: 'white', marginBottom: 32, lineHeight: 1.55 }}>
            Cosentus.ai — your always-on revenue intelligence assistant.
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: 'var(--radius-md)', padding: '16px 24px',
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'text',
          }} onClick={() => inputRef.current?.focus()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
              onFocus={handleFocus} onKeyDown={e => { if (e.key === 'Enter') { handleFocus(); setTimeout(() => handleSend(), 100) } }}
              placeholder={placeholder || 'Ask anything...'} className="ra-search-input"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: 16, fontFamily: 'var(--font-body)' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 32 }}>
            {[{ n: '~3,000', l: 'Calls/Day' }, { n: '9', l: 'AI Agents' }, { n: '50+', l: 'Languages' }, { n: '24/7', l: 'Coverage' }].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: 'white', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'white', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 6 }}>{s.l}</div>
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
    <section className="section" id="ra" style={{ overflow: 'hidden', position: 'relative' }}>
      {/* Single focused decorative accent — radial glow behind headline area only.
          Replaces the noisy random neural mesh per design review. */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '8%',
        left: '-4%',
        width: 520,
        height: 520,
        pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(0,181,214,0.08) 0%, rgba(54,194,222,0.04) 40%, transparent 70%)',
        zIndex: 0,
      }} />

      {/* Thin horizontal scan line — slow, restrained, single moment of motion */}
      <div aria-hidden="true" className="ra-scanline" style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(0,181,214,0.4) 50%, transparent)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="ra-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <RevealOnScroll direction="left">
              <div className="section-label">REAL + ARTIFICIAL INTELLIGENCE</div>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.15}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginBottom: 20 }}>
                Not Just a Billing Company.<br /><span style={{ color: '#00B5D6', fontStyle: 'italic' }}>A Platform.</span>
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.25}>
              <p style={{ fontSize: 16, color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 36 }}>
                Claims chased before you notice them. Denials overturned before they cost you. Collections handled while you see patients.
              </p>
            </RevealOnScroll>

            {/* Platform stats — animated count-up on scroll-in */}
            <RevealOnScroll direction="left" delay={0.35}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, marginBottom: 36 }}>
                {[
                  { n: 23, l: 'Modules', bg: '#00B5D6' },
                  { n: 15, l: 'AI Features', bg: '#36C2DE' },
                  { n: 9, l: 'Voice Agents', bg: '#68D1E6' },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: item.bg, padding: '24px 16px', textAlign: 'center',
                    borderRadius: i === 0 ? '12px 0 0 12px' : i === 2 ? '0 12px 12px 0' : '0',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,181,214,0.35)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  >
                    <CountUp end={item.n} duration={1.4 + i * 0.2} />
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>{item.l}</div>
                  </div>
                ))}
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="left" delay={0.45}>
              <Link href="/cosentus-ai" className="btn-ghost" style={{ color: 'var(--primary)', display: 'inline-flex' }}>
                Explore The Platform
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </RevealOnScroll>
          </div>

          <RevealOnScroll direction="right" delay={0.3}>
            <AIPanel />
          </RevealOnScroll>
        </div>
      </div>

      <style>{`
        .ra-scanline {
          animation: ra-scanline-move 6s ease-in-out infinite;
        }
        @keyframes ra-scanline-move {
          0%, 100% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(80vh); opacity: 1; }
          60% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ra-scanline { display: none; }
        }
      `}</style>
    </section>
  )
}

// Count-up animation for platform stats
function CountUp({ end, duration = 1.5 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const elapsed = (now - start) / 1000
            const progress = Math.min(elapsed / duration, 1)
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(end * eased))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      })
    }, { threshold: 0.3 })
    obs.observe(node)
    return () => obs.disconnect()
  }, [end, duration])

  return (
    <div ref={ref} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'white', lineHeight: 1 }}>
      {count}
    </div>
  )
}
