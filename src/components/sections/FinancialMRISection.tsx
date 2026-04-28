'use client'

import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

// 3 diagnostic readouts shown on the scan visual
const readouts = [
  { label: 'AR Days', value: '47', target: '≤35', status: 'critical' },
  { label: 'Clean Claim Rate', value: '89%', target: '≥99%', status: 'warning' },
  { label: 'Denial Rate', value: '14%', target: '≤4%', status: 'critical' },
]

const statusColor: Record<string, string> = {
  critical: '#FF4D5E',
  warning: '#FFB547',
  healthy: '#3DD68C',
}

export default function FinancialMRISection() {
  return (
    <section className="section section-alt" style={{ overflow: 'hidden' }}>
      <div className="container">
        {/* Centered intro */}
        <div style={{ textAlign: 'center', maxWidth: 880, margin: '0 auto 64px' }}>
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
              marginTop: 16,
              marginBottom: 24,
            }}>
              In a Negotiation, He Who Has<br />the <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Information</span> Wins.
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--gray-600)' }}>
              Most healthcare leaders know something is wrong. Cash flow, days in AR, denial rates — the symptoms are visible. The Financial MRI is a no-cost diagnostic that tells you the <em>why</em>.
            </p>
          </RevealOnScroll>
        </div>

        {/* Diagnostic visual + 3 process steps */}
        <div className="financial-mri-layout" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56, alignItems: 'center' }}>
          {/* LEFT: Diagnostic readout panel */}
          <RevealOnScroll direction="left" delay={0.2}>
            <div style={{
              background: 'linear-gradient(180deg, #001b25 0%, #002835 50%, #00343f 100%)',
              borderRadius: 'var(--radius-md)',
              padding: '32px 36px',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(0,181,214,0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            }}>
              {/* Corner brackets — scan frame aesthetic */}
              {[
                { top: 12, left: 12, borderTop: '2px solid #00B5D6', borderLeft: '2px solid #00B5D6' },
                { top: 12, right: 12, borderTop: '2px solid #00B5D6', borderRight: '2px solid #00B5D6' },
                { bottom: 12, left: 12, borderBottom: '2px solid #00B5D6', borderLeft: '2px solid #00B5D6' },
                { bottom: 12, right: 12, borderBottom: '2px solid #00B5D6', borderRight: '2px solid #00B5D6' },
              ].map((c, i) => (
                <div key={i} style={{ position: 'absolute', width: 18, height: 18, ...c }} />
              ))}

              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', background: '#00B5D6',
                    boxShadow: '0 0 12px #00B5D6',
                    animation: 'fmri-pulse 1.6s ease-in-out infinite',
                  }} />
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-display)' }}>
                    Live Scan
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>
                  Sample Practice
                </div>
              </div>

              {/* Pulse line — animated SVG */}
              <div style={{ marginBottom: 28, height: 56, background: 'rgba(0,181,214,0.06)', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
                <svg viewBox="0 0 600 56" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                  <path
                    d="M 0,28 L 80,28 L 100,28 L 110,12 L 120,44 L 130,28 L 220,28 L 240,28 L 250,8 L 260,48 L 270,28 L 380,28 L 400,28 L 410,16 L 420,40 L 430,28 L 600,28"
                    fill="none"
                    stroke="#00B5D6"
                    strokeWidth="1.5"
                    style={{
                      strokeDasharray: 1200,
                      strokeDashoffset: 1200,
                      animation: 'fmri-trace 3.5s ease-out forwards',
                    }}
                  />
                </svg>
                {/* Sweeping highlight */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, height: '100%', width: 80,
                  background: 'linear-gradient(90deg, transparent, rgba(0,181,214,0.35), transparent)',
                  animation: 'fmri-sweep 3s ease-in-out infinite',
                }} />
              </div>

              {/* Diagnostic readouts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {readouts.map((r, i) => (
                  <div key={i} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    alignItems: 'center',
                    gap: 16,
                    padding: '14px 18px',
                    background: 'rgba(0,181,214,0.06)',
                    border: '1px solid rgba(0,181,214,0.15)',
                    borderRadius: 8,
                  }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
                        {r.label}
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 600, color: 'white', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
                        {r.value}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                      Target {r.target}
                    </div>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: statusColor[r.status],
                      boxShadow: `0 0 10px ${statusColor[r.status]}`,
                    }} />
                  </div>
                ))}
              </div>

              {/* Footer diagnosis */}
              <div style={{
                marginTop: 20, paddingTop: 18, borderTop: '1px solid rgba(0,181,214,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
                  Diagnosis
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: '#00B5D6', fontFamily: 'var(--font-display)',
                  letterSpacing: '0.04em',
                }}>
                  Treatment Recommended
                </div>
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
                marginBottom: 24,
                letterSpacing: '-0.01em',
              }}>
                Think of it like visiting your physician.
              </h3>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', marginBottom: 16 }}>
                You know you have pain, but you don&apos;t know the severity until you run diagnostics. We may tell you you&apos;re in great shape — or we may find chronic conditions that need immediate intervention.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', marginBottom: 32 }}>
                Either way, you walk away with the information. <strong style={{ color: 'var(--gray-900)' }}>And in healthcare, information is leverage.</strong>
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
        @media (max-width: 1024px) {
          .financial-mri-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  )
}
