'use client'

import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export default function PlatformSection() {
  return (
    <section style={{ background: 'var(--gray-50)', padding: 'clamp(64px, 8vw, 120px) 0', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px, 5vw, 80px)', alignItems: 'center', marginBottom: 48 }} className="platform-top-grid">
          <RevealOnScroll direction="left">
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(32px, 4vw, 56px)', color: 'var(--gray-900)',
              lineHeight: 0.95, letterSpacing: '-0.03em',
            }}>
              Not Just a<br />Billing Company.<br /><em style={{ fontStyle: 'italic', color: '#00B5D6' }}>A System.</em>
            </h2>
          </RevealOnScroll>
          <RevealOnScroll direction="right" delay={0.15}>
            <p style={{ fontSize: 17, color: 'var(--gray-500)', lineHeight: 1.7, fontWeight: 300 }}>
              MedCloud. Ai-native from day one. Not retrofitted onto legacy systems.
              Your practice runs on it, or we plug into yours.
            </p>
          </RevealOnScroll>
        </div>

        {/* 3 big stat blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }} className="platform-nums-grid">
          {[
            { n: '23', l: 'Modules' },
            { n: '15', l: 'Ai Features' },
            { n: '9', l: 'Voice Ai Agents' },
          ].map((item, i) => (
            <RevealOnScroll key={i} direction="scale" delay={0.2 + i * 0.1}>
              <div style={{
                background: '#00B5D6', padding: 'clamp(36px, 5vw, 56px) clamp(24px, 3vw, 40px)',
                textAlign: 'center', transition: 'all 0.4s',
                borderRadius: i === 0 ? '16px 0 0 16px' : i === 2 ? '0 16px 16px 0' : '0',
                cursor: 'default',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0a1628' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#00B5D6' }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(40px, 5vw, 64px)', color: 'white', lineHeight: 1 }}>{item.n}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 10 }}>{item.l}</div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={0.5}>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/zeus-ai" className="btn-primary" style={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: 13 }}>
              Explore Zeus
            </Link>
          </div>
        </RevealOnScroll>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .platform-top-grid { grid-template-columns: 1fr !important; }
          .platform-nums-grid { grid-template-columns: 1fr !important; }
          .platform-nums-grid > div > div { border-radius: 0 !important; }
          .platform-nums-grid > div:first-child > div { border-radius: 16px 16px 0 0 !important; }
          .platform-nums-grid > div:last-child > div { border-radius: 0 0 16px 16px !important; }
        }
      `}</style>
    </section>
  )
}
