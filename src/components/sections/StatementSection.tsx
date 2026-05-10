'use client'

import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import RevealText from '@/components/ui/RevealText'

export default function StatementSection() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: '#000' }}>
      {/* Video background */}
      <video autoPlay loop muted playsInline style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', opacity: 0.2,
      }}>
        <source src="/images/specialties-hero.mp4" type="video/mp4" />
      </video>

      <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(80px, 10vw, 140px) 0' }}>
        <div className="container">
          {/* Big declaration — both lines cascade word-by-word.
              First line starts immediately, second starts after the first
              line's three words finish (3 * 0.08 = 0.24s) so the lines feel
              sequential rather than overlapping. */}
          <RevealText
            as="h2"
            perWordDelay={0.08}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(36px, 6vw, 80px)',
              color: 'white',
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              marginBottom: 12,
            }}
          >
            WE ARE COSENTUS.
          </RevealText>

          <RevealText
            as="h2"
            perWordDelay={0.08}
            baseDelay={0.3}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(36px, 6vw, 80px)',
              color: '#00B5D6',
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              marginBottom: 56,
            }}
          >
            WE KNOW HEALTHCARE.
          </RevealText>

          {/* 3 proof points */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 48 }} className="statement-proof-grid">
            {[
              { q: 'Will they care about MY practice?', a: 'Every decision we make is for your outcomes, not investor returns. 80% of our founding team is still here. We play the long game.' },
              { q: 'Do they know MY specialty?', a: 'Anesthesia. Ortho. Pain. ASC. Behavioral Health. Multi-Specialty. Each has a dedicated team that lives your codes, your payers, your workflows. Specialists, not generalists.' },
              { q: 'Will I talk to a real person?', a: 'Dedicated director. Named coders. Named billing leads. Your team works your account, and only your account, from 8am to 5pm. When we meet, it\u2019s a board meeting, not a status call.' },
            ].map((item, i) => (
              <RevealOnScroll key={i} delay={0.25 + i * 0.12}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'white', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.q}</h4>
                  <p style={{ fontSize: 16, lineHeight: 1.7, color: 'white' }}>{item.a}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={0.6}>
            <div style={{ textAlign: 'center', marginTop: 56 }}>
              <Link href="/contact" className="btn-glass" style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 13, padding: '0 52px' }}>
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
