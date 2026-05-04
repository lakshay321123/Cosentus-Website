'use client'

import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

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
              { q: 'Will they care about MY practice?', a: 'Every decision we make is for your outcomes, not investor returns. 80% of our founding team is still here. We play the long game.' },
              { q: 'Do they know MY specialty?', a: 'Anesthesia. Ortho. Pain. ASC. Behavioral Health. Multi-Specialty. Each has a dedicated team that lives your codes, your payers, your workflows. Specialists, not generalists. Separate resources for rejections, AR, payments, and denials \u2014 so nothing falls through the cracks. Clients typically see up to 21% increase in collections in the first 90 days.' },
              { q: 'Will I talk to a real person?', a: 'You work with a dedicated team of experts \u2014 not a rotating cast. Named director, named coders, named billing leads. They work your account and only your account, from 8am to 5pm. We get paid when you get paid \u2014 complete alignment of incentives. 80% of our founding team is still here. When we meet, it\u2019s a board meeting \u2014 not a status call.' },
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
