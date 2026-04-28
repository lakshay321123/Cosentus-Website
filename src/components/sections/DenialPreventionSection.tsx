'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'

// Quarter-over-quarter denial rate data
const trendData = [
  { quarter: 'Q1', value: 14, label: '14%', highlight: false },
  { quarter: 'Q2', value: 10, label: '10%', highlight: false },
  { quarter: 'Q3', value: 6, label: '6%', highlight: false },
  { quarter: 'Q4', value: 4, label: '4%', highlight: true },
]
const maxValue = 16 // chart ceiling

const steps = [
  { title: 'Identify', desc: 'Spot the pattern.', iconPath: 'M21 21l-4.343-4.343m0 0A8 8 0 104.93 4.93a8 8 0 0011.727 11.727z' },
  { title: 'Analyze', desc: 'Find the root cause.', iconPath: 'M9 17v-2a4 4 0 014-4h4m-4 0V7a4 4 0 00-4-4H5a4 4 0 00-4 4v8a4 4 0 004 4h4' },
  { title: 'Correct', desc: 'Fix the workflow.', iconPath: 'M5 13l4 4L19 7' },
  { title: 'Prevent', desc: 'Category shrinks.', iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
]

export default function DenialPreventionSection() {
  return (
    <section className="section" style={{ overflow: 'hidden' }}>
      <div className="container">
        {/* Left-aligned intro */}
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
            marginBottom: 20,
            maxWidth: 880,
          }}>
            We Don&apos;t Just Chase Denials.<br /><span style={{ color: '#00B5D6', fontStyle: 'italic' }}>We Prevent Them.</span>
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.2}>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--gray-600)', maxWidth: 640, marginBottom: 56 }}>
            Most vendors react. We prevent. Root cause analysis on every denial means the category shrinks every quarter.
          </p>
        </RevealOnScroll>

        {/* Two-column: animated chart on left, 4 steps on right */}
        <div className="dp-layout" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56, alignItems: 'stretch' }}>
          {/* LEFT: animated trend chart */}
          <RevealOnScroll direction="left" delay={0.3}>
            <div style={{
              background: 'var(--white)',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-md)',
              padding: '32px 36px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            }}>
              {/* Chart header */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: 8 }}>
                  Denial Rate — Quarter Over Quarter
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <div style={{
                    fontSize: 'clamp(36px, 4vw, 48px)',
                    fontWeight: 700,
                    color: '#00B5D6',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                  }}>
                    14% <span style={{ fontSize: 24, color: 'var(--gray-400)' }}>→</span> 4%
                  </div>
                </div>
                <div style={{ fontSize: 14, color: 'var(--gray-600)', marginTop: 8 }}>
                  Typical client trajectory after engagement
                </div>
              </div>

              {/* Bar chart */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 24, paddingBottom: 32, paddingTop: 16, position: 'relative' }}>
                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: `${32 + p * 200}px`,
                    height: 1,
                    background: 'var(--gray-200)',
                    opacity: 0.6,
                  }} />
                ))}

                {trendData.map((d, i) => {
                  const heightPct = (d.value / maxValue) * 100
                  const barColor = d.highlight ? '#00B5D6' : '#A1DEED'
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
                      {/* Value label above bar */}
                      <div style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: d.highlight ? '#00B5D6' : 'var(--gray-700)',
                        fontFamily: 'var(--font-display)',
                        animation: `dp-fadein 0.6s ease-out ${0.4 + i * 0.15}s backwards`,
                      }}>
                        {d.label}
                      </div>
                      {/* Bar */}
                      <div style={{
                        width: '100%',
                        maxWidth: 64,
                        height: 200,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'flex-end',
                      }}>
                        <div style={{
                          width: '100%',
                          height: `${heightPct}%`,
                          background: d.highlight
                            ? 'linear-gradient(180deg, #00B5D6 0%, #36C2DE 100%)'
                            : 'linear-gradient(180deg, #A1DEED 0%, #68D1E6 100%)',
                          borderRadius: '8px 8px 0 0',
                          boxShadow: d.highlight ? '0 4px 16px rgba(0,181,214,0.3)' : 'none',
                          animation: `dp-bargrow 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.15}s backwards`,
                          transformOrigin: 'bottom',
                        }} />
                      </div>
                      {/* Quarter label */}
                      <div style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--gray-500)',
                        letterSpacing: '0.05em',
                        position: 'absolute',
                        bottom: -24,
                      }}>
                        {d.quarter}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Footer caption */}
              <div style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: '1px solid var(--gray-200)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: 'var(--gray-600)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00B5D6" strokeWidth="2.5">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <span>Healthier every quarter, not just busier.</span>
              </div>
            </div>
          </RevealOnScroll>

          {/* RIGHT: 4-step process — compressed */}
          <RevealOnScroll direction="right" delay={0.4}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: 4 }}>
                The Cosentus Method
              </div>
              {steps.map((step, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  padding: '18px 20px',
                  background: 'var(--white)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-sm)',
                  flex: 1,
                  transition: 'all 0.25s ease',
                  animation: `dp-fadein 0.5s ease-out ${0.5 + i * 0.1}s backwards`,
                }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    flexShrink: 0,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00B5D6 0%, #36C2DE 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    position: 'relative',
                    boxShadow: '0 4px 12px rgba(0,181,214,0.25)',
                  }}>
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={step.iconPath} />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                      <span style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#00B5D6',
                        fontFamily: 'var(--font-display)',
                      }}>
                        0{i + 1}
                      </span>
                      <h4 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 18,
                        fontWeight: 600,
                        color: 'var(--gray-900)',
                        margin: 0,
                        letterSpacing: '-0.01em',
                      }}>
                        {step.title}
                      </h4>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--gray-600)', margin: '4px 0 0 0' }}>
                      {step.desc}
                    </p>
                  </div>
                  {/* Arrow indicating progression (except on last) */}
                  {i < steps.length - 1 && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2" style={{ flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>

      <style>{`
        @keyframes dp-bargrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes dp-fadein {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1024px) {
          .dp-layout { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  )
}
