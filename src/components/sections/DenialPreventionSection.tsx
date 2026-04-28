'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'

const steps = [
  {
    title: 'Identify',
    desc: 'Spot problematic claim patterns before they balloon.',
    iconPath: 'M21 21l-4.343-4.343m0 0A8 8 0 104.93 4.93a8 8 0 0011.727 11.727z M11 8v3m0 2.5h.01',
  },
  {
    title: 'Analyze',
    desc: 'Root cause analysis on every denial — not just the symptom.',
    iconPath: 'M9 17v-2a4 4 0 014-4h4m-4 0V7a4 4 0 00-4-4H5a4 4 0 00-4 4v8a4 4 0 004 4h4',
  },
  {
    title: 'Correct',
    desc: 'Fix the documentation pattern, coding rule, or workflow gap.',
    iconPath: 'M5 13l4 4L19 7',
  },
  {
    title: 'Prevent',
    desc: 'That denial category shrinks every quarter going forward.',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
]

export default function DenialPreventionSection() {
  return (
    <section className="section" style={{ overflow: 'hidden' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 880, margin: '0 auto 56px' }}>
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
              marginTop: 16,
              marginBottom: 24,
            }}>
              We Don&apos;t Just Chase Denials.<br /><span style={{ color: '#00B5D6', fontStyle: 'italic' }}>We Prevent Them.</span>
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--gray-600)' }}>
              Most RCM vendors wait for a denial to happen, then scramble to appeal it. That&apos;s reactive. That&apos;s expensive. That&apos;s the industry standard. Our model is different.
            </p>
          </RevealOnScroll>
        </div>

        {/* Reactive vs Proactive comparison */}
        <RevealOnScroll delay={0.25}>
          <div className="dp-compare-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
            marginBottom: 64,
            maxWidth: 920,
            margin: '0 auto 64px',
          }}>
            <div style={{
              padding: '28px 32px',
              background: 'var(--white)',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-md)',
              opacity: 0.7,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: 12,
              }}>
                Industry Standard
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 12, lineHeight: 1.25 }}>
                Wait. Appeal. Repeat.
              </h4>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--gray-600)', margin: 0 }}>
                Denial happens → scramble to appeal → win or lose → same denial happens again next month. The cycle never stops.
              </p>
            </div>
            <div style={{
              padding: '28px 32px',
              background: 'linear-gradient(135deg, #00B5D6 0%, #36C2DE 100%)',
              borderRadius: 'var(--radius-md)',
              color: 'white',
              boxShadow: '0 12px 32px rgba(0,181,214,0.25)',
            }}>
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'white', marginBottom: 12,
              }}>
                The Cosentus Way
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'white', marginBottom: 12, lineHeight: 1.25 }}>
                Identify. Analyze. Prevent.
              </h4>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'white', margin: 0 }}>
                Root cause every denial → correct the pattern → that category shrinks → revenue cycle gets healthier every quarter.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* 4-step process flow */}
        <div className="dp-steps-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          position: 'relative',
        }}>
          {/* Connecting line behind cards */}
          <div className="dp-connector" style={{
            position: 'absolute',
            top: 36,
            left: '12.5%',
            right: '12.5%',
            height: 2,
            background: 'linear-gradient(90deg, transparent, #00B5D6 20%, #00B5D6 80%, transparent)',
            opacity: 0.3,
            zIndex: 0,
          }} />

          {steps.map((step, i) => (
            <RevealOnScroll key={i} delay={0.3 + i * 0.1}>
              <div style={{
                background: 'var(--white)',
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--radius-md)',
                padding: '28px 24px',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1,
                height: '100%',
              }}>
                {/* Numbered icon */}
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00B5D6 0%, #36C2DE 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  position: 'relative',
                  boxShadow: '0 6px 20px rgba(0,181,214,0.3)',
                }}>
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={step.iconPath} />
                  </svg>
                  <div style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--white)',
                    border: '2px solid #00B5D6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#00B5D6',
                    fontFamily: 'var(--font-display)',
                  }}>
                    {i + 1}
                  </div>
                </div>

                <h4 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  fontWeight: 600,
                  color: 'var(--gray-900)',
                  marginBottom: 8,
                  letterSpacing: '-0.01em',
                }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--gray-600)', margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Closing callout */}
        <RevealOnScroll delay={0.7}>
          <div style={{
            marginTop: 56,
            padding: '28px 40px',
            background: 'var(--white)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--gray-200)',
            borderLeft: '4px solid #00B5D6',
            maxWidth: 920,
            margin: '56px auto 0',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: 18,
              lineHeight: 1.55,
              color: 'var(--gray-900)',
              fontWeight: 500,
              margin: 0,
              fontFamily: 'var(--font-display)',
            }}>
              The result: <span style={{ color: '#00B5D6' }}>fewer denials over time</span>, not just better recovery rates. Your revenue cycle gets healthier every quarter, not just busier.
            </p>
          </div>
        </RevealOnScroll>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .dp-steps-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dp-connector { display: none !important; }
        }
        @media (max-width: 640px) {
          .dp-compare-grid { grid-template-columns: 1fr !important; }
          .dp-steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
