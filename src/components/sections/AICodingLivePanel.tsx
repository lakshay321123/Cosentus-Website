'use client'

import { useState, useEffect } from 'react'

// 3 sample encounters that Connie cycles through.
// Codes are realistic but illustrative — 'sample data' note shown in footer.
type CodeRow = { code: string; desc: string; type: 'cpt' | 'icd' | 'mod' | 'unit' }
type Encounter = {
  id: string
  specialty: string
  visit: string
  rows: CodeRow[]
  flag: string | null
}

const encounters: Encounter[] = [
  {
    id: 'C-12847',
    specialty: 'Internal Medicine',
    visit: 'Office Visit · Established · Level 4',
    rows: [
      { code: 'CPT 99214',     desc: 'Office/outpatient, est. patient, level 4', type: 'cpt' },
      { code: 'ICD-10 J20.9',  desc: 'Acute bronchitis, unspecified',             type: 'icd' },
      { code: 'Modifier 25',   desc: 'Significant & separately identifiable',      type: 'mod' },
    ],
    flag: 'Add total time spent if billing time-based',
  },
  {
    id: 'C-12848',
    specialty: 'Anesthesia',
    visit: 'TURP · 60 min · Medical direction',
    rows: [
      { code: 'CPT 00914',     desc: 'Anesthesia for transurethral procedures',   type: 'cpt' },
      { code: 'ICD-10 N40.0',  desc: 'BPH without lower urinary symptoms',         type: 'icd' },
      { code: '8 time units',  desc: '4 base + 4 time, 15-min increments',         type: 'unit' },
    ],
    flag: null,
  },
  {
    id: 'C-12849',
    specialty: 'Orthopedics',
    visit: 'Knee Arthroscopy · Right · Outpatient',
    rows: [
      { code: 'CPT 29881',     desc: 'Arthroscopy, knee, surgical w/ meniscectomy', type: 'cpt' },
      { code: 'ICD-10 M23.231', desc: 'Derangement, medial meniscus, right knee',    type: 'icd' },
      { code: 'Modifier RT',   desc: 'Right side — laterality required',            type: 'mod' },
    ],
    flag: null,
  },
]

const TYPE_BG: Record<string, string> = {
  cpt:  'rgba(255,255,255,0.18)',
  icd:  'rgba(255,255,255,0.18)',
  mod:  'rgba(255,255,255,0.18)',
  unit: 'rgba(255,255,255,0.18)',
}

export default function AICodingLivePanel() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setIdx(i => (i + 1) % encounters.length), 5000)
    return () => clearInterval(t)
  }, [paused])

  const current = encounters[idx]

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
      }}
    >
      {/* Subtle scan-line texture */}
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
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: 'white',
            boxShadow: '0 0 12px rgba(255,255,255,0.9)',
            animation: 'aicl-pulse 1.6s ease-in-out infinite',
          }} />
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'white', fontFamily: 'var(--font-display)' }}>
            AI Coding · Live
          </div>
        </div>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
          background: 'rgba(255,255,255,0.18)',
          padding: '4px 10px',
          borderRadius: 4,
          color: 'white',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            backgroundImage: 'url(/images/connie.png), linear-gradient(135deg, #00B5D6, #36C2DE)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1.5px solid white',
          }} />
          Connie
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '28px 28px 24px' }}>
        {/* Top metric */}
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 5vw, 56px)',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}>
              98.5<span style={{ fontSize: '0.6em', verticalAlign: 'baseline', marginLeft: 2 }}>%</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'white', opacity: 0.85, marginTop: 6 }}>
              Coding Accuracy · 30-day rolling
            </div>
          </div>

          {/* Encounter dots */}
          <div style={{ display: 'flex', gap: 6 }}>
            {encounters.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Encounter ${i + 1}`}
                style={{
                  width: idx === i ? 24 : 8, height: 8, borderRadius: 4,
                  background: idx === i ? 'white' : 'rgba(255,255,255,0.4)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Encounter card — cycles via key={idx} */}
        <div key={idx} style={{
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 10,
          padding: '18px 20px',
          animation: 'aicl-fadein 0.5s ease-out',
        }}>
          {/* Encounter header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'white', opacity: 0.8,
            }}>
              Encounter #{current.id}
            </div>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#00B5D6',
              background: 'white',
              padding: '3px 8px',
              borderRadius: 3,
            }}>
              {current.specialty}
            </div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'white', marginBottom: 16, fontFamily: 'var(--font-display)' }}>
            {current.visit}
          </div>

          {/* Code rows — staggered fadein */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {current.rows.map((row, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                background: TYPE_BG[row.type],
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 6,
                animation: `aicl-rowin 0.4s ease-out ${0.15 + i * 0.12}s backwards`,
              }}>
                {/* Check */}
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00B5D6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                {/* Code + desc */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 13, fontWeight: 700, color: 'white',
                    letterSpacing: '-0.005em',
                    flexShrink: 0,
                  }}>
                    {row.code}
                  </span>
                  <span style={{
                    fontSize: 12, color: 'white', opacity: 0.85,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    minWidth: 0, flex: 1,
                  }}>
                    {row.desc}
                  </span>
                </div>
                {/* AI tag */}
                <div style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
                  color: '#00B5D6', background: 'white',
                  padding: '2px 6px', borderRadius: 3, flexShrink: 0,
                }}>
                  AI
                </div>
              </div>
            ))}

            {/* Flag row (if any) — uses palette colors only, no yellow */}
            {current.flag && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px dashed rgba(255,255,255,0.4)',
                borderRadius: 6,
                animation: `aicl-rowin 0.4s ease-out ${0.15 + current.rows.length * 0.12}s backwards`,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  border: '1.5px solid white',
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div style={{
                  fontSize: 12, color: 'white', opacity: 0.9,
                  flex: 1, minWidth: 0,
                }}>
                  {current.flag}
                </div>
                <div style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
                  color: 'white', background: 'rgba(255,255,255,0.2)',
                  padding: '2px 6px', borderRadius: 3, flexShrink: 0,
                }}>
                  REVIEW
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: 11, color: 'white', opacity: 0.85, letterSpacing: '0.04em' }}>
            AAPC-certified coders verify every suggestion
          </div>
          <div style={{ fontSize: 10, color: 'white', opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Sample data
          </div>
        </div>
      </div>

      <style>{`
        @keyframes aicl-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        @keyframes aicl-fadein {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes aicl-rowin {
          from { opacity: 0; transform: translateX(-6px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
