'use client'

import { useEffect, useState } from 'react'

// 9-stage pipeline, drawn from MedCloud / 23 modules.
// Each stage: name shown in focus state, the "how we integrate / what we do" subtitle,
// and the responsible agent or system. Icon is rendered inline as SVG.
type Stage = {
  name: string          // big stage label
  detail: string        // technical detail (how we integrate / what we do)
  agent?: string        // agent or system tag
  iconPath: string      // SVG path data for the stage icon (24x24 viewBox)
}

const stages: Stage[] = [
  {
    name: 'EHR Intake',
    detail: 'Real-time integration with Epic, Athena, eClinicalWorks, ModMed, AdvancedMD',
    agent: 'EHR-Agnostic',
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l7-4 7 4z',
  },
  {
    name: 'Eligibility Verification',
    detail: 'Real-time 270/271 EDI checks · Benefits · Deductibles · Network status',
    agent: 'Elly',
    iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    name: 'Prior Authorization',
    detail: 'Automated pre-cert workflows · Payer rules engine · Status tracking',
    agent: 'Paige',
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    name: 'AI Scribe',
    detail: 'Ambient voice → structured clinical notes · Real-time transcription',
    agent: 'Documentation AI',
    iconPath: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
  },
  {
    name: 'AI Coding',
    detail: '8-step pipeline · CPT + ICD-10 + Modifiers · NCCI/MUE/HCPCS rules',
    agent: 'Connie · 98.5%',
    iconPath: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  },
  {
    name: 'Claim Scrubbing',
    detail: '50+ rule engine · NCCI edits · E/M validation · Timely-filing checks',
    agent: 'Document AI',
    iconPath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
  },
  {
    name: 'Claim Submission',
    detail: 'EDI 837 to 1,400+ payers · Same-day processing · Clearinghouse routing',
    agent: 'Claims Engine',
    iconPath: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8',
  },
  {
    name: 'Payment Posting',
    detail: '835 ERA parser · EOB OCR via Textract · Underpayment detection',
    agent: 'Document AI',
    iconPath: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  },
  {
    name: 'AR & Denials',
    detail: 'AI-ranked queues · Aging analysis · 95%+ appeal success · CARC/RARC root cause',
    agent: 'Ariel + Appeals AI',
    iconPath: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  },
]

export default function AIWorkflowPanel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [interacted, setInteracted] = useState(false)

  // Auto-cycle: each stage held ~1.5s. Full loop = ~13.5s
  useEffect(() => {
    if (paused || interacted) return
    const t = setInterval(() => {
      setActive(a => (a + 1) % stages.length)
    }, 1500)
    return () => clearInterval(t)
  }, [paused, interacted])

  // Reset interacted flag after 6s of no hover so auto-play resumes
  useEffect(() => {
    if (!interacted) return
    const t = setTimeout(() => setInteracted(false), 6000)
    return () => clearTimeout(t)
  }, [interacted, active])

  const current = stages[active]

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        background: 'linear-gradient(140deg, #00B5D6 0%, #36C2DE 60%, #68D1E6 100%)',
        borderRadius: 'var(--radius-md)',
        padding: 0,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,181,214,0.3)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Scan-line texture — same as AICodingLivePanel for visual continuity */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.025) 3px, rgba(255,255,255,0.025) 4px)',
      }} />

      {/* Header strip */}
      <div style={{
        background: '#00B5D6',
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.25)',
        position: 'relative',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: 'white',
            boxShadow: '0 0 12px rgba(255,255,255,0.9)',
            animation: 'awp-pulse 1.6s ease-in-out infinite',
          }} />
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'white', fontFamily: 'var(--font-display)' }}>
            AI Workflow · Live
          </div>
        </div>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
          background: 'rgba(255,255,255,0.18)',
          padding: '4px 10px',
          borderRadius: 4,
          color: 'white',
        }}>
          End-to-End Pipeline
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '22px 24px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Top focus card — large, dramatic, swaps on stage change */}
        <div key={`focus-${active}`} style={{
          background: 'rgba(255,255,255,0.18)',
          border: '1px solid rgba(255,255,255,0.4)',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 16,
          animation: 'awp-focusin 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Stage progress: x of 9 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              {/* Big icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00B5D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={current.iconPath} />
                </svg>
              </div>
              <div>
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'white', opacity: 0.85, marginBottom: 4,
                }}>
                  Stage {String(active + 1).padStart(2, '0')} of {String(stages.length).padStart(2, '0')}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '-0.015em',
                  lineHeight: 1.1,
                }}>
                  {current.name}
                </div>
              </div>
            </div>
            {current.agent && (
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                color: '#00B5D6',
                background: 'white',
                padding: '5px 10px',
                borderRadius: 4,
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
                flexShrink: 0,
              }}>
                {current.agent}
              </div>
            )}
          </div>

          {/* Detail line — typewriter-style fade-in */}
          <div style={{
            fontSize: 14,
            color: 'white',
            lineHeight: 1.5,
            opacity: 0.95,
            animation: 'awp-detail 0.7s ease-out 0.15s backwards',
          }}>
            {current.detail}
          </div>

          {/* Subtle bottom progress bar — fills as the stage holds */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 2,
            background: 'rgba(255,255,255,0.15)',
          }}>
            <div
              key={`progress-${active}`}
              style={{
                height: '100%',
                background: 'white',
                animation: paused || interacted ? 'none' : 'awp-progress 1.5s linear forwards',
                width: paused || interacted ? '100%' : '0%',
              }}
            />
          </div>
        </div>

        {/* Pipeline — vertical list of all 9 stages, current highlighted */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
          {stages.map((s, i) => {
            const isActive = i === active
            const isPast = i < active
            return (
              <div key={i}>
                <button
                  onClick={() => { setActive(i); setInteracted(true) }}
                  onMouseEnter={() => { setActive(i); setInteracted(true) }}
                  aria-label={`Stage ${i + 1}: ${s.name}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    padding: '6px 10px',
                    border: 'none',
                    background: isActive ? 'rgba(255,255,255,0.22)' : 'transparent',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Node dot */}
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: isActive ? 'white' : isPast ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: isActive ? '0 0 0 4px rgba(255,255,255,0.25), 0 0 14px rgba(255,255,255,0.6)' : 'none',
                    transition: 'all 0.3s ease',
                  }}>
                    {isPast ? (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00B5D6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : isActive ? (
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#00B5D6',
                        animation: 'awp-corepulse 1s ease-in-out infinite',
                      }} />
                    ) : null}
                  </div>

                  {/* Stage label */}
                  <div style={{
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    color: 'white',
                    opacity: isActive ? 1 : isPast ? 0.85 : 0.65,
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-0.005em',
                    transition: 'all 0.3s ease',
                    flex: 1,
                    minWidth: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {s.name}
                  </div>

                  {/* Right-side stage number */}
                  <div style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'white',
                    opacity: isActive ? 0.95 : 0.5,
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.05em',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </button>

                {/* Connector line + traveling pulse */}
                {i < stages.length - 1 && (
                  <div style={{
                    height: 8,
                    width: 2,
                    marginLeft: 21,
                    background: isPast || isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)',
                    position: 'relative',
                    transition: 'background 0.3s ease',
                  }}>
                    {isActive && !paused && !interacted && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: -2,
                        width: 6, height: 6,
                        borderRadius: '50%',
                        background: 'white',
                        boxShadow: '0 0 8px rgba(255,255,255,0.9)',
                        animation: 'awp-travel 0.5s ease-in 1s forwards',
                      }} />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: 12, color: 'white', fontWeight: 500, letterSpacing: '0.02em' }}>
            <strong style={{ fontWeight: 700 }}>9</strong> Voice Agents · <strong style={{ fontWeight: 700 }}>15</strong> AI Features · <strong style={{ fontWeight: 700 }}>23</strong> Modules
          </div>
          <div style={{ fontSize: 10, color: 'white', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.95 }}>
            EHR-Agnostic
          </div>
        </div>
      </div>

      <style>{`
        @keyframes awp-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        @keyframes awp-corepulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        @keyframes awp-focusin {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes awp-detail {
          from { opacity: 0; transform: translateX(-4px); }
          to { opacity: 0.95; transform: translateX(0); }
        }
        @keyframes awp-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes awp-travel {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(8px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
