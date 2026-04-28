'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'

export default function DenialPreventionSection() {
  return (
    <section className="section section-alt" style={{ overflow: 'hidden' }}>
      <div className="container">
        <RevealOnScroll>
          <div className="section-label">NOT JUST RECOVERY — PREVENTION</div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--gray-900)',
            marginTop: 12,
            marginBottom: 32,
            maxWidth: 880,
          }}>
            We Don&apos;t Just Chase Denials.<br /><span style={{ color: '#00B5D6', fontStyle: 'italic' }}>We Prevent Them.</span>
          </h2>
        </RevealOnScroll>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 16 }} className="denial-prevention-grid">
          <RevealOnScroll direction="left" delay={0.2}>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: 'var(--gray-600)' }}>
              Most RCM vendors wait for a denial to happen, then scramble to appeal it. That&apos;s reactive. That&apos;s expensive. And that&apos;s the industry standard.
            </p>
          </RevealOnScroll>
          <RevealOnScroll direction="right" delay={0.3}>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: 'var(--gray-600)' }}>
              Our model is different. We proactively identify problematic areas and perform a root cause analysis — not just to recover the money, but to understand why the claim was denied, underpaid, or delayed in the first place. Then we correct it. Moving forward, that denial category starts shrinking.
            </p>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.5}>
          <div style={{
            marginTop: 56,
            padding: '32px 40px',
            background: 'var(--white)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--gray-200)',
            borderLeft: '4px solid #00B5D6',
          }}>
            <p style={{
              fontSize: 18,
              lineHeight: 1.6,
              color: 'var(--gray-900)',
              fontWeight: 500,
              margin: 0,
              fontFamily: 'var(--font-display)',
            }}>
              The result: fewer denials over time, not just better recovery rates. Your revenue cycle gets healthier every quarter, not just busier.
            </p>
          </div>
        </RevealOnScroll>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .denial-prevention-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </section>
  )
}
