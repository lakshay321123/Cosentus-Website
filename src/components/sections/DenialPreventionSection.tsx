'use client'

import { useState, useEffect } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

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
  // active = which step/quarter is currently focused. Auto-cycles unless user interacts.
  const [active, setActive] = useState(3) // start on Q4 (the destination)
  const [paused, setPaused] = useState(false)
  const [interacted, setInteracted] = useState(false) // once user clicks, stop auto-cycle

  useEffect(() => {
    if (paused || interacted) return
    const t = setInterval(() => {
      setActive(a => (a + 1) % quarters.length)
    }, 2400)
    return () => clearInterval(t)
  }, [paused, interacted])

  const handleSelect = (i: number) => {
    setActive(i)
    setInteracted(true)
  }

  return (
    <section className="section" style={{ overflow: 'hidden' }}>
      <div className="container">
        <RevealOnScroll>
          <div className="section-label">NOT JUST RECOVERY — PREVENTION</div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 3.6vw, 42px)',
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--gray-900)',
            marginTop: 12,
            marginBottom: 16,
            maxWidth: 880,
          }}>
            We Don&apos;t Just Chase Denials.<br /><span style={{ color: '#00B5D6', fontStyle: 'italic' }}>We Prevent Them.</span>
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.2}>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--gray-600)', maxWidth: 720, marginBottom: 36 }}>
            Most vendors react. We prevent. Each quarter we apply this method, and the denial rate shrinks.
          </p>
        </RevealOnScroll>

        {/* Compact integrated panel — interactive */}
        <RevealOnScroll delay={0.25}>
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{
              background: 'var(--white)',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-md)',
              padding: '28px 32px 20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}
            className="dp-panel"
          >
            {/* Header — title + headline metric */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 24,
              flexWrap: 'wrap',
              gap: 16,
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: 4 }}>
                  Denial Rate · Quarter Over Quarter
                </div>
                <div style={{ fontSize: 13, color: 'var(--gray-600)' }}>
                  Typical client trajectory after engagement
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
              }}>
                <div style={{ fontSize: 'clamp(28px, 3vw, 38px)', color: 'var(--gray-400)', lineHeight: 1 }}>
                  14%
                </div>
                <svg width="24" height="14" viewBox="0 0 32 20" fill="none">
                  <path d="M2 10 H26 M22 4 L28 10 L22 16" stroke="#00B5D6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div style={{ fontSize: 'clamp(28px, 3vw, 38px)', color: '#00B5D6', lineHeight: 1 }}>
                  4%
                </div>
              </div>
            </div>

            {/* Interactive 4-column chart */}
            <div className="dp-chart" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
            }}>
              {quarters.map((q, i) => {
                const isActive = i === active
                const heightPct = (q.value / MAX_VALUE) * 100
                return (
                  <button
                    key={q.q}
                    onClick={() => handleSelect(i)}
                    onMouseEnter={() => setActive(i)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                    }}
                  >
                    {/* STEP CALLOUT — compact */}
                    <div style={{
                      padding: '12px 14px',
                      borderRadius: 8,
                      background: isActive ? 'linear-gradient(135deg, #00B5D6 0%, #36C2DE 100%)' : 'var(--white)',
                      border: isActive ? 'none' : '1px solid var(--gray-200)',
                      boxShadow: isActive ? '0 8px 22px rgba(0,181,214,0.32)' : 'none',
                      marginBottom: 12,
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%',
                          background: isActive ? 'rgba(255,255,255,0.25)' : '#D6EBF2',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'background 0.4s ease',
                        }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isActive ? 'white' : '#00B5D6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d={ICON_PATHS[q.icon]} />
                          </svg>
                        </div>
                        <div style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                          color: isActive ? 'white' : '#00B5D6',
                          fontFamily: 'var(--font-display)',
                          opacity: isActive ? 0.85 : 1,
                        }}>
                          0{i + 1}
                        </div>
                      </div>
                      <div style={{
                        fontSize: 14, fontWeight: 700,
                        color: isActive ? 'white' : 'var(--gray-900)',
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '-0.01em',
                        marginBottom: 1,
                      }}>
                        {q.step}
                      </div>
                      <div style={{
                        fontSize: 11,
                        color: isActive ? 'white' : 'var(--gray-600)',
                        opacity: isActive ? 0.9 : 1,
                        lineHeight: 1.35,
                      }}>
                        {q.desc}
                      </div>
                    </div>

                    {/* Animated dotted connector — drops down to bar */}
                    <div style={{
                      width: 1.5,
                      height: 14,
                      margin: '0 auto',
                      borderLeft: `1.5px dashed ${isActive ? '#00B5D6' : '#A1DEED'}`,
                      transition: 'border-color 0.4s ease',
                    }} />

                    {/* VALUE LABEL */}
                    <div style={{
                      fontSize: isActive ? 18 : 15,
                      fontWeight: 700,
                      color: isActive ? '#00B5D6' : 'var(--gray-700)',
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '-0.02em',
                      textAlign: 'center',
                      marginTop: 8,
                      marginBottom: 6,
                      lineHeight: 1,
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}>
                      {q.label}
                    </div>

                    {/* BAR — shorter (130px instead of 200px) */}
                    <div style={{
                      height: 130,
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      position: 'relative',
                    }}>
                      {/* Subtle horizontal grid lines */}
                      {[0.25, 0.5, 0.75, 1].map((p, gi) => (
                        <div key={gi} style={{
                          position: 'absolute',
                          left: -6, right: -6,
                          bottom: `${p * 100}%`,
                          height: 1,
                          background: 'var(--gray-200)',
                          opacity: 0.5,
                        }} />
                      ))}
                      <div style={{
                        width: '70%',
                        maxWidth: 56,
                        height: `${heightPct}%`,
                        background: isActive
                          ? 'linear-gradient(180deg, #00B5D6 0%, #36C2DE 100%)'
                          : 'linear-gradient(180deg, #A1DEED 0%, #68D1E6 100%)',
                        borderRadius: '6px 6px 0 0',
                        boxShadow: isActive ? '0 6px 18px rgba(0,181,214,0.35)' : 'none',
                        position: 'relative',
                        zIndex: 1,
                        animation: `dp-bargrow 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.1}s backwards`,
                        transformOrigin: 'bottom',
                        transition: 'background 0.4s ease, box-shadow 0.4s ease, opacity 0.3s ease',
                        opacity: !isActive && active !== i ? 0.7 : 1,
                      }} />
                    </div>

                    {/* QUARTER LABEL */}
                    <div style={{
                      fontSize: 12,
                      fontWeight: isActive ? 700 : 600,
                      color: isActive ? '#00B5D6' : 'var(--gray-500)',
                      letterSpacing: '0.05em',
                      textAlign: 'center',
                      marginTop: 8,
                      paddingTop: 8,
                      borderTop: '1px solid var(--gray-200)',
                      transition: 'all 0.4s ease',
                    }}>
                      {q.q}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Footer caption + cycle indicator */}
            <div style={{
              marginTop: 18,
              paddingTop: 14,
              borderTop: '1px solid var(--gray-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                color: 'var(--gray-600)',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00B5D6" strokeWidth="2.5">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <span>Healthier every quarter, not just busier.</span>
              </div>
              {/* Step dots */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {quarters.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    aria-label={`Step ${i + 1}`}
                    style={{
                      width: active === i ? 22 : 6, height: 6, borderRadius: 3,
                      background: active === i ? '#00B5D6' : 'var(--gray-300)',
                      border: 'none', cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>

      <style>{`
        @keyframes dp-bargrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @media (max-width: 900px) {
          .dp-panel { padding: 22px 20px 16px !important; }
          .dp-chart { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; row-gap: 24px !important; }
        }
        @media (max-width: 520px) {
          .dp-chart { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
