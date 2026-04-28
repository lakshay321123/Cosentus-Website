'use client'

import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export default function FinancialMRISection() {
  return (
    <section className="section" style={{ overflow: 'hidden' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="financial-mri-grid">
          <div>
            <RevealOnScroll direction="left">
              <div className="section-label">YOUR REVENUE DIAGNOSTIC</div>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.1}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--gray-900)',
                marginTop: 12,
                marginBottom: 24,
              }}>
                In a Negotiation, He Who Has the<br />
                <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Information</span> Wins.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.2}>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', marginBottom: 18 }}>
                Most healthcare leaders know something is wrong. They can see it in their cash flow, their days in AR, their denial rates. But understanding the <em>why</em> — that&apos;s the monumental task.
              </p>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.3}>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', marginBottom: 18 }}>
                Our Financial MRI is a no-cost, no-obligation diagnostic of your revenue cycle. Think of it like visiting your physician — you know you have pain, but you don&apos;t know the severity until you run diagnostics.
              </p>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.4}>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', marginBottom: 32 }}>
                Either way, you walk away with the information. And in healthcare, information is leverage.
              </p>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.5}>
              <Link href="/contact" className="btn-primary">
                Get Your Financial MRI — Free
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </RevealOnScroll>
          </div>

          {/* Quote callout */}
          <RevealOnScroll direction="right" delay={0.3}>
            <div style={{
              background: 'linear-gradient(135deg, #00B5D6 0%, #36C2DE 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(40px, 5vw, 64px)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 24,
                left: 32,
                fontSize: 120,
                lineHeight: 1,
                color: 'rgba(255,255,255,0.18)',
                fontFamily: 'Georgia, serif',
                fontWeight: 700,
              }} aria-hidden="true">&ldquo;</div>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(22px, 2.4vw, 30px)',
                fontWeight: 300,
                lineHeight: 1.3,
                letterSpacing: '-0.01em',
                position: 'relative',
                zIndex: 1,
                marginTop: 32,
              }}>
                Everyone&apos;s leaving money on the table. The only question is — how much are you?
              </p>
              <div style={{
                marginTop: 32,
                paddingTop: 24,
                borderTop: '1px solid rgba(255,255,255,0.25)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.8)',
              }}>
                No Cost. No Obligation.
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .financial-mri-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  )
}
