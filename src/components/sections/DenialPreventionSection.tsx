'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'

// Each quarter pairs a method step with the resulting denial rate
const quarters = [
  { q: 'Q1', value: 14, label: '14%', step: 'Identify',  desc: 'Spot the pattern',     icon: 'search'  },
  { q: 'Q2', value: 10, label: '10%', step: 'Analyze',   desc: 'Find root cause',      icon: 'analyze' },
  { q: 'Q3', value: 6,  label: '6%',  step: 'Correct',   desc: 'Fix the workflow',     icon: 'check'   },
  { q: 'Q4', value: 4,  label: '4%',  step: 'Prevent',   desc: 'Category shrinks',     icon: 'shield'  },
]

const ICON_PATHS: Record<string, string> = {
  search:  'M21 21l-4.343-4.343m0 0A8 8 0 104.93 4.93a8 8 0 0011.727 11.727z',
  analyze: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z',
  check:   'M5 13l4 4L19 7',
  shield:  'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
}

const MAX_VALUE = 16

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
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--gray-600)', maxWidth: 720, marginBottom: 56 }}>
            Most vendors react. We prevent. Each quarter we apply this method, and the denial rate shrinks.
          </p>
        </RevealOnScroll>

        {/* ONE integrated visual — method steps annotate the quarters of the chart */}
        <RevealOnScroll delay={0.25}>
          <div style={{
            background: 'var(--white)',
            border: '1px solid var(--gray-200)',
            borderRadius: 'var(--radius-md)',
            padding: '40px 48px 32px',
            position: 'relative',
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          }} className="dp-panel">
            {/* Header row — chart title + headline metric */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 48,
              flexWrap: 'wrap',
              gap: 24,
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: 6 }}>
                  Denial Rate · Quarter Over Quarter
                </div>
                <div style={{ fontSize: 14, color: 'var(--gray-600)' }}>
                  Typical client trajectory after engagement
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 16,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
              }}>
                <div style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: 'var(--gray-400)', lineHeight: 1 }}>
                  14%
                </div>
                <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                  <path d="M2 10 H26 M22 4 L28 10 L22 16" stroke="#00B5D6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: '#00B5D6', lineHeight: 1 }}>
                  4%
                </div>
              </div>
            </div>

            {/* THE INTEGRATED CHART — steps connect to bars via dotted lines.
                4 columns, each column has: step icon + label → connector → bar + quarter */}
            <div className="dp-chart" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
              position: 'relative',
              paddingTop: 0,
            }}>
              {quarters.map((q, i) => {
                const heightPct = (q.value / MAX_VALUE) * 100
                const isLast = i === quarters.length - 1
                return (
                  <div key={q.q} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    position: 'relative',
                    animation: `dp-col-fadein 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.12}s backwards`,
                  }}>
                    {/* STEP CALLOUT — top */}
                    <div style={{
                      padding: '14px 14px 12px',
                      borderRadius: 8,
                      background: isLast ? 'linear-gradient(135deg, #00B5D6 0%, #36C2DE 100%)' : 'var(--white)',
                      border: isLast ? 'none' : '1px solid var(--gray-200)',
                      boxShadow: isLast ? '0 8px 24px rgba(0,181,214,0.25)' : 'none',
                      marginBottom: 16,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: isLast ? 'rgba(255,255,255,0.25)' : '#D6EBF2',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isLast ? 'white' : '#00B5D6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d={ICON_PATHS[q.icon]} />
                          </svg>
                        </div>
                        <div style={{
                          fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                          color: isLast ? 'rgba(255,255,255,0.85)' : '#00B5D6',
                          fontFamily: 'var(--font-display)',
                        }}>
                          0{i + 1}
                        </div>
                      </div>
                      <div style={{
                        fontSize: 16, fontWeight: 700,
                        color: isLast ? 'white' : 'var(--gray-900)',
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '-0.01em',
                        marginBottom: 2,
                      }}>
                        {q.step}
                      </div>
                      <div style={{
                        fontSize: 12,
                        color: isLast ? 'rgba(255,255,255,0.85)' : 'var(--gray-600)',
                        lineHeight: 1.4,
                      }}>
                        {q.desc}
                      </div>
                    </div>

                    {/* DOTTED CONNECTOR — step to bar */}
                    <div style={{
                      width: 1,
                      height: 20,
                      margin: '0 auto',
                      borderLeft: '1.5px dashed #A1DEED',
                    }} />

                    {/* VALUE LABEL above bar */}
                    <div style={{
                      fontSize: isLast ? 24 : 20,
                      fontWeight: 700,
                      color: isLast ? '#00B5D6' : 'var(--gray-700)',
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '-0.02em',
                      textAlign: 'center',
                      marginTop: 12,
                      marginBottom: 8,
                      lineHeight: 1,
                    }}>
                      {q.label}
                    </div>

                    {/* BAR */}
                    <div style={{
                      height: 200,
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      position: 'relative',
                    }}>
                      {/* Subtle horizontal grid lines */}
                      {[0, 0.25, 0.5, 0.75, 1].map((p, gi) => (
                        <div key={gi} style={{
                          position: 'absolute',
                          left: -16, right: -16,
                          bottom: `${p * 100}%`,
                          height: 1,
                          background: 'var(--gray-200)',
                          opacity: gi === 0 ? 0 : 0.5,
                        }} />
                      ))}
                      <div style={{
                        width: '70%',
                        maxWidth: 64,
                        height: `${heightPct}%`,
                        background: isLast
                          ? 'linear-gradient(180deg, #00B5D6 0%, #36C2DE 100%)'
                          : 'linear-gradient(180deg, #A1DEED 0%, #68D1E6 100%)',
                        borderRadius: '6px 6px 0 0',
                        boxShadow: isLast ? '0 6px 18px rgba(0,181,214,0.35)' : 'none',
                        position: 'relative',
                        zIndex: 1,
                        animation: `dp-bargrow 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.6 + i * 0.12}s backwards`,
                        transformOrigin: 'bottom',
                      }} />
                    </div>

                    {/* QUARTER LABEL */}
                    <div style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--gray-500)',
                      letterSpacing: '0.05em',
                      textAlign: 'center',
                      marginTop: 10,
                      paddingTop: 10,
                      borderTop: '1px solid var(--gray-200)',
                    }}>
                      {q.q}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer caption */}
            <div style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: '1px solid var(--gray-200)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 13,
              color: 'var(--gray-600)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00B5D6" strokeWidth="2.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <span>Healthier every quarter, not just busier. Most clients see this trajectory within 12 months.</span>
            </div>
          </div>
        </RevealOnScroll>
      </div>

      <style>{`
        @keyframes dp-bargrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes dp-col-fadein {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .dp-panel { padding: 28px 24px !important; }
          .dp-chart { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; row-gap: 32px !important; }
        }
        @media (max-width: 520px) {
          .dp-chart { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
