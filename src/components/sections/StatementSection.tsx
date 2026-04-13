'use client'

import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export default function StatementSection() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: '#0a1628' }}>
      {/* Video background */}
      <video autoPlay loop muted playsInline style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', opacity: 0.2,
      }}>
        <source src="/images/specialties-hero.mp4" type="video/mp4" />
      </video>

      <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(80px, 10vw, 140px) 0' }}>
        <div className="container">
          {/* Big declaration */}
          <RevealOnScroll>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(36px, 6vw, 80px)',
              color: 'white',
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              marginBottom: 12,
            }}>
              WE ARE COSENTUS.
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={0.15}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(36px, 6vw, 80px)',
              color: '#00B5D6',
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              marginBottom: 56,
            }}>
              WE KNOW HEALTHCARE.
            </h2>
          </RevealOnScroll>

          {/* 3 proof points */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 48 }} className="statement-proof-grid">
            {[
              { q: 'Will they care about MY practice?', a: 'No investors to answer to. We only answer to you.' },
              { q: 'Do they know MY specialty?', a: 'Anesthesia. Ortho. Pain. ASC. Behavioral Health. We already work your codes.' },
              { q: 'Will I talk to a real person?', a: 'Named team. Direct line. They know your payers by heart.' },
            ].map((item, i) => (
              <RevealOnScroll key={i} delay={0.25 + i * 0.12}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'white', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.q}</h4>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>{item.a}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={0.6}>
            <div style={{ textAlign: 'center', marginTop: 56 }}>
              <Link href="/contact" style={{
                display: 'inline-block', padding: '18px 52px',
                fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'white', background: '#00B5D6', textDecoration: 'none',
                borderRadius: 50, transition: 'all 0.4s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#000' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#00B5D6'; e.currentTarget.style.color = 'white' }}
              >
                {"Let's Talk"}
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .statement-proof-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  )
}
