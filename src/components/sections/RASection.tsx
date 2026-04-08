'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

const features = [
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#00B5D6" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>, title: 'Scalable AI Built for Growth', desc: 'Enterprise-scale capacity that grows with your practice — processing ~3,000 calls daily.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#00B5D6" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>, title: 'Specialized AI Voice Agents', desc: 'Automate eligibility, claims, prior authorizations, scheduling, and patient billing.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#00B5D6" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>, title: 'Up to 30% Revenue Growth', desc: 'Real results, not just reports. AI-powered insights that drive measurable financial improvement.' },
]

const placeholders = [
  'What is my current denial rate?',
  'How does R+A reduce denials?',
  'What is my expected revenue lift?',
  'How do AI agents handle patient calls?',
]

function TypingEffect() {
  const [text, setText] = useState('')
  const [idx, setIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = placeholders[idx]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), 2000)
        } else {
          setCharIdx(charIdx + 1)
        }
      } else {
        setText(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setIdx((idx + 1) % placeholders.length)
          setCharIdx(0)
        } else {
          setCharIdx(charIdx - 1)
        }
      }
    }, deleting ? 30 : 60)
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, idx])

  return (
    <span style={{ color: 'rgba(255,255,255,0.7)' }}>
      {text}
      <span style={{ display: 'inline-block', width: 2, height: 18, marginLeft: 2, verticalAlign: 'text-bottom', background: '#00B5D6', boxShadow: '0 0 8px #00B5D6', animation: 'blink 1s step-end infinite' }} />
    </span>
  )
}

export default function RASection() {
  return (
    <section className="section" id="ra" style={{ overflow: 'hidden' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Left side */}
          <div>
            <RevealOnScroll direction="left">
              <div className="section-label">COSENTUS.AI</div>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.15}>
              <div className="section-title">
                Real + Artificial<br />Intelligence
              </div>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.25}>
              <p style={{ fontSize: 16, color: 'var(--gray-600)', lineHeight: 1.7, marginTop: 16, marginBottom: 32 }}>
                What if your billing team never missed a claim? What if denials were resolved before you knew about them?
                Practices that refuse to settle for average collections use Real&nbsp;+&nbsp;Artificial&nbsp;Intelligence.
              </p>
            </RevealOnScroll>

            {features.map((f, i) => (
              <RevealOnScroll key={i} direction="left" delay={0.35 + i * 0.15}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24 }}>
                  <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--primary-ghost)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {f.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 4 }}>{f.title}</div>
                    <div style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}

            <RevealOnScroll direction="left" delay={0.8}>
              <Link href="/cosentus-ai" className="btn-ghost" style={{ color: 'var(--primary)', marginTop: 8, display: 'inline-flex' }}>
                See How R+A Works
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </RevealOnScroll>
          </div>

          {/* Right side — dark AI panel */}
          <RevealOnScroll direction="right" delay={0.3}>
            <div style={{
              background: 'linear-gradient(135deg, #004D5E 0%, #00748C 50%, #00B5D6 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '56px 40px',
              color: 'white',
            }}>
              <h3 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 300, lineHeight: 1.3, marginBottom: 16 }}>
                Ask Anything About<br />Your Revenue Cycle
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>
                Cosentus.ai — your always-on revenue intelligence assistant, powered by Real&nbsp;+&nbsp;Artificial Intelligence.
              </p>

              {/* Search bar */}
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 24px',
                fontSize: 15,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                backdropFilter: 'blur(10px)',
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.5)" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
                <TypingEffect />
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 32 }}>
                {[
                  { n: '~3,000', l: 'Calls/Day' },
                  { n: '8', l: 'AI Agents' },
                  { n: '50+', l: 'Languages' },
                  { n: '24/7', l: 'Coverage' },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '12px 0' }}>
                    <div style={{ fontSize: 20, fontWeight: 500, color: 'white' }}>{s.n}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
