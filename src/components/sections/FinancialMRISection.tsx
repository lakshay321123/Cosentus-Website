'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

// Three states the scan cycles through — different "sample practices"
const scanStates = [
  {
    label: 'Multi-Specialty Group',
    readouts: [
      { label: 'AR Days', value: '47', target: '≤35', status: 'critical' },
      { label: 'Clean Claim Rate', value: '89%', target: '≥99%', status: 'warning' },
      { label: 'Denial Rate', value: '14%', target: '≤4%', status: 'critical' },
    ],
    diagnosis: 'Treatment Recommended',
  },
  {
    label: 'Anesthesia Practice',
    readouts: [
      { label: 'AR Days', value: '52', target: '≤35', status: 'critical' },
      { label: 'Net Collection', value: '91%', target: '≥98%', status: 'warning' },
      { label: 'Underpayments', value: '$184K', target: '$0', status: 'critical' },
    ],
    diagnosis: 'Significant Recovery Available',
  },
  {
    label: 'Orthopedic Group',
    readouts: [
      { label: 'AR Days', value: '38', target: '≤35', status: 'warning' },
      { label: 'Clean Claim Rate', value: '94%', target: '≥99%', status: 'warning' },
      { label: 'Workers\u2019 Comp Lag', value: '45d', target: '≤28d', status: 'critical' },
    ],
    diagnosis: 'Immediate Action Required',
  },
]

const statusColor: Record<string, string> = {
  critical: '#FF4D5E',
  warning: '#FFB547',
  healthy: '#3DD68C',
}

export default function FinancialMRISection() {
  const [stateIndex, setStateIndex] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [activeRow, setActiveRow] = useState<number | null>(null)

  // Auto-cycle through scan states
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setStateIndex(prev => (prev + 1) % scanStates.length)
      setAnimKey(k => k + 1)
    }, 6000)
    return () => clearInterval(timer)
  }, [isPaused])

  // Manual scan re-run
  const handleRunScan = () => {
    setStateIndex(prev => (prev + 1) % scanStates.length)
    setAnimKey(k => k + 1)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 8000)
  }

  const current = scanStates[stateIndex]

  return (
    <section className="section section-alt" style={{ overflow: 'hidden' }}>
      <div className="container">
        {/* Left-aligned intro — matches site pattern (RASection, etc.) */}
        <RevealOnScroll>
          <div className="section-label">YOUR REVENUE DIAGNOSTIC</div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4.5vw, 56px)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--gray-900)',
            marginTop: 12,
            marginBottom: 20,
            maxWidth: 880,
          }}>
            In a Negotiation, He Who Has the<br /><span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Information</span> Wins.
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.2}>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--gray-600)', maxWidth: 720, marginBottom: 56 }}>
            Most healthcare leaders know something is wrong. Cash flow, days in AR, denial rates — the symptoms are visible. The Financial MRI is a no-cost diagnostic that tells you the <em>why</em>.
          </p>
        </RevealOnScroll>

        {/* Two-column layout — diagnostic on left, explanation/CTA on right */}
        <div className="financial-mri-layout" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56, alignItems: 'flex-start' }}>
          {/* LEFT: Interactive diagnostic monitor — Cosentus brand gradient */}
          <RevealOnScroll direction="left" delay={0.2}>
            <div
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              style={{
                background: 'linear-gradient(135deg, #00B5D6 0%, #36C2DE 60%, #68D1E6 100%)',
                borderRadius: 'var(--radius-md)',
                padding: '32px 36px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,181,214,0.3)',
              }}
            >
              {/* Subtle scan-line pattern overlay */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.025) 3px, rgba(255,255,255,0.025) 4px)',
              }} />

              {/* Corner brackets */}
              {[
                { top: 12, left: 12, borderTop: '2px solid white', borderLeft: '2px solid white' },
                { top: 12, right: 12, borderTop: '2px solid white', borderRight: '2px solid white' },
                { bottom: 12, left: 12, borderBottom: '2px solid white', borderLeft: '2px solid white' },
                { bottom: 12, right: 12, borderBottom: '2px solid white', borderRight: '2px solid white' },
              ].map((c, i) => (
                <div key={i} style={{ position: 'absolute', width: 18, height: 18, ...c, opacity: 0.7 }} />
              ))}

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', background: 'white',
                    boxShadow: '0 0 12px rgba(255,255,255,0.8)',
                    animation: 'fmri-pulse 1.6s ease-in-out infinite',
                  }} />
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'white', fontFamily: 'var(--font-display)' }}>
                    Live Scan
                  </div>
                </div>
                <div key={`label-${animKey}`} style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'white',
                  animation: 'fmri-fadein 0.5s ease-out',
                }}>
                  {current.label}
                </div>
              </div>

              {/* Pulse line */}
              <div style={{ marginBottom: 28, height: 56, background: 'rgba(255,255,255,0.15)', borderRadius: 8, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.25)' }}>
                <svg key={`trace-${animKey}`} viewBox="0 0 600 56" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                  <path
                    d="M 0,28 L 80,28 L 100,28 L 110,12 L 120,44 L 130,28 L 220,28 L 240,28 L 250,8 L 260,48 L 270,28 L 380,28 L 400,28 L 410,16 L 420,40 L 430,28 L 600,28"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    style={{
                      strokeDasharray: 1200,
                      strokeDashoffset: 1200,
                      animation: 'fmri-trace 3s ease-out forwards',
                    }}
                  />
                </svg>
                <div style={{
                  position: 'absolute', top: 0, left: 0, height: '100%', width: 80,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  animation: 'fmri-sweep 3s ease-in-out infinite',
                }} />
              </div>

              {/* Readouts — clickable rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {current.readouts.map((r, i) => {
                  const isActive = activeRow === i
                  return (
                    <div
                      key={`${animKey}-${i}`}
                      onMouseEnter={() => setActiveRow(i)}
                      onMouseLeave={() => setActiveRow(null)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto auto',
                        alignItems: 'center',
                        gap: 16,
                        padding: '14px 18px',
                        background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
                        border: `1px solid ${isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)'}`,
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: isActive ? 'translateX(4px)' : 'translateX(0)',
                        animation: `fmri-fadein 0.6s ease-out ${i * 0.1}s backwards`,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'white', marginBottom: 4, opacity: 0.85 }}>
                          {r.label}
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em', lineHeight: 1 }}>
                          {r.value}
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: 'white', opacity: 0.85, fontWeight: 500 }}>
                        Target {r.target}
                      </div>
                      <div style={{
                        width: 12, height: 12, borderRadius: '50%',
                        background: statusColor[r.status],
                        boxShadow: `0 0 12px ${statusColor[r.status]}`,
                        animation: 'fmri-pulse 1.8s ease-in-out infinite',
                      }} />
                    </div>
                  )
                })}
              </div>

              {/* Footer + Run Scan button */}
              <div style={{
                marginTop: 20, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
              }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'white', opacity: 0.85, marginBottom: 4 }}>
                    Diagnosis
                  </div>
                  <div key={`diag-${animKey}`} style={{
                    fontSize: 15, fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)',
                    letterSpacing: '-0.01em',
                    animation: 'fmri-fadein 0.6s ease-out',
                  }}>
                    {current.diagnosis}
                  </div>
                </div>
                <button
                  onClick={handleRunScan}
                  style={{
                    background: 'white',
                    color: '#00B5D6',
                    border: 'none',
                    borderRadius: 999,
                    padding: '10px 20px',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.25s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
                >
                  Run Scan
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                    <polyline points="21 3 21 8 16 8" />
                  </svg>
                </button>
              </div>
            </div>
          </RevealOnScroll>

          {/* RIGHT: explanation + CTA */}
          <RevealOnScroll direction="right" delay={0.3}>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(22px, 2.4vw, 30px)',
                fontWeight: 400,
                color: 'var(--gray-900)',
                lineHeight: 1.25,
                marginBottom: 20,
                letterSpacing: '-0.01em',
              }}>
                Think of it like visiting your physician.
              </h3>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', marginBottom: 28 }}>
                You know you have pain, but you don&apos;t know the severity until you run diagnostics. <strong style={{ color: 'var(--gray-900)' }}>In healthcare, information is leverage.</strong>
              </p>

              {/* Quote */}
              <div style={{
                padding: '20px 24px',
                background: 'var(--white)',
                border: '1px solid var(--gray-200)',
                borderLeft: '4px solid #00B5D6',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 32,
              }}>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 17,
                  fontWeight: 500,
                  fontStyle: 'italic',
                  color: 'var(--gray-900)',
                  lineHeight: 1.5,
                  margin: 0,
                }}>
                  &ldquo;Everyone&apos;s leaving money on the table. The only question is — how much are you?&rdquo;
                </p>
              </div>

              <Link href="/contact" className="btn-primary">
                Get Your Financial MRI — Free
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <div style={{ marginTop: 12, fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gray-500)' }}>
                No Cost. No Obligation.
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      <style>{`
        @keyframes fmri-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        @keyframes fmri-sweep {
          0% { transform: translateX(-80px); }
          100% { transform: translateX(620px); }
        }
        @keyframes fmri-trace {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fmri-fadein {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1024px) {
          .financial-mri-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  )
}
