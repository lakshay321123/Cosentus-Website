'use client'

import { useState } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

// 23 system modules grouped by category. AI-powered modules have an agent assigned.
type Module = {
  num: string
  name: string
  category: 'FRONT OFFICE' | 'CLINICAL' | 'REVENUE' | 'PATIENT' | 'INSIGHTS'
  agent?: string // agent name if AI-powered
  desc: string
}

const modules: Module[] = [
  // FRONT OFFICE
  { num: '01', name: 'Scheduling',                category: 'FRONT OFFICE', agent: 'April',  desc: 'Inbound and outbound appointment scheduling with reminders and waitlist management.' },
  { num: '02', name: 'Eligibility & Benefits',    category: 'FRONT OFFICE', agent: 'Elly',   desc: 'Real-time insurance verification, benefits, deductibles, and network status.' },
  { num: '03', name: 'Patient Intake',            category: 'FRONT OFFICE',                  desc: 'Demographic capture, insurance card scanning, consent forms, and digital intake.' },
  { num: '04', name: 'Prior Authorization',       category: 'FRONT OFFICE', agent: 'Paige',  desc: 'Authorization tracking, submission, follow-up, and OR schedule coordination.' },
  { num: '05', name: 'Pre-Service Payments',      category: 'FRONT OFFICE', agent: 'Priya',  desc: 'Cost estimates and pre-procedure payment collection 3-7 days before service.' },

  // CLINICAL
  { num: '06', name: 'AI Scribe',                 category: 'CLINICAL',                      desc: 'Ambient documentation that captures clinical encounters into structured notes.' },
  { num: '07', name: 'Medical Coding',            category: 'CLINICAL', agent: 'Connie',     desc: 'CPT and ICD-10 suggestions with modifier validation and accuracy checks.' },
  { num: '08', name: 'Charge Capture',            category: 'CLINICAL',                      desc: 'Encounter-to-charge conversion with reconciliation against OR and facility records.' },
  { num: '09', name: 'Documentation Review',      category: 'CLINICAL', agent: 'Connie',     desc: 'Clinical documentation improvement and pre-bill review for compliance.' },

  // REVENUE
  { num: '10', name: 'Claim Scrubbing',           category: 'REVENUE',                       desc: 'Payer-specific edits applied before submission. Catches errors before they reach payers.' },
  { num: '11', name: 'Claim Submission',          category: 'REVENUE',                       desc: 'Electronic submission across 1,400+ payers with same-day processing.' },
  { num: '12', name: 'Payment Posting',           category: 'REVENUE',                       desc: 'Automated ERA/EOB posting with underpayment detection and reconciliation.' },
  { num: '13', name: 'AR Follow-Up',              category: 'REVENUE', agent: 'Ariel',       desc: 'Aging claim tracking, payment delay identification, and escalation workflows.' },
  { num: '14', name: 'Denial Management',         category: 'REVENUE',                       desc: 'Root-cause analysis, appeals with clinical rationale, and 95%+ appeal success rate.' },
  { num: '15', name: 'Underpayment Recovery',     category: 'REVENUE',                       desc: 'Contract analytics flag every dollar paid below contracted rates.' },
  { num: '16', name: 'Appeals',                   category: 'REVENUE',                       desc: 'Specialty-specific appeals with clinical rationale and payer-specific strategies.' },
  { num: '17', name: 'Claim Follow-Up',           category: 'REVENUE', agent: 'Chris',       desc: 'Outbound calls to payers for status, escalation, and processing-delay resolution.' },

  // PATIENT
  { num: '18', name: 'Patient Billing',           category: 'PATIENT',                       desc: 'Clear, branded statements with itemized service breakdowns and online portal access.' },
  { num: '19', name: 'Patient Collections',       category: 'PATIENT', agent: 'Cindy',       desc: 'Multilingual balance collection with payment processing in 50+ languages.' },
  { num: '20', name: 'Payment Plans',             category: 'PATIENT',                       desc: 'Flexible payment plan setup, financial hardship policies, and charity care.' },

  // INSIGHTS
  { num: '21', name: 'Reporting',                 category: 'INSIGHTS',                      desc: 'Real-time dashboards by provider, payer, procedure, and denial category.' },
  { num: '22', name: 'Analytics',                 category: 'INSIGHTS',                      desc: 'KPI trending, benchmarking, and predictive insights from your revenue data.' },
  { num: '23', name: 'Customer Support',          category: 'INSIGHTS', agent: 'Curtis',     desc: 'Front-line practice support with intelligent routing and real-time status updates.' },
]

const categoryOrder: Module['category'][] = ['FRONT OFFICE', 'CLINICAL', 'REVENUE', 'PATIENT', 'INSIGHTS']

// Live demo content for a select set of "showcase" modules.
// Modules without a demo entry show a generic capability card.
const liveDemos: Record<string, { headline: string; metric: string; metricLabel: string; rows: { label: string; value: string; status?: 'ok' | 'flag' }[]; footer: string }> = {
  '02': {
    headline: 'Patient #82341 · Aetna PPO',
    metric: '1.2s',
    metricLabel: 'Avg 270/271 response time',
    rows: [
      { label: 'Coverage', value: 'Active', status: 'ok' },
      { label: 'Deductible', value: '$500 of $500 met', status: 'ok' },
      { label: 'Specialist copay', value: '$40', status: 'ok' },
      { label: 'Prior auth (CPT 99214)', value: 'Not required', status: 'ok' },
      { label: 'Network status', value: 'In-network', status: 'ok' },
    ],
    footer: 'Verified before every encounter. Eligibility denials are eliminated at the source.',
  },
  '04': {
    headline: 'Auth #PA-77231 · Cigna · MRI Lumbar',
    metric: '94%',
    metricLabel: 'Auths cleared without OR delay',
    rows: [
      { label: 'Submitted', value: 'Mar 14, 9:42 AM', status: 'ok' },
      { label: 'Status', value: 'Approved', status: 'ok' },
      { label: 'Auth #', value: 'A-4892731', status: 'ok' },
      { label: 'Valid through', value: 'Apr 28, 2026', status: 'ok' },
      { label: 'CPT 72148', value: 'Approved · 1 unit', status: 'ok' },
    ],
    footer: 'Tracked, escalated, and cleared before the procedure date',
  },
  '07': {
    headline: 'Encounter #C-12847 · Office visit · Level 4',
    metric: '98.5%',
    metricLabel: 'Coding accuracy · 30-day rolling',
    rows: [
      { label: 'CPT 99214', value: 'Office visit, est., level 4', status: 'ok' },
      { label: 'ICD-10 J20.9', value: 'Acute bronchitis', status: 'ok' },
      { label: 'Modifier 25', value: 'Significant & separate', status: 'ok' },
      { label: 'Documentation', value: 'Add total time spent', status: 'flag' },
    ],
    footer: 'AAPC-certified coders verify every AI suggestion',
  },
  '13': {
    headline: 'Aging buckets · 30-day view',
    metric: '<10%',
    metricLabel: 'AR over 120 days',
    rows: [
      { label: '0–30 days', value: '$284K', status: 'ok' },
      { label: '31–60 days', value: '$112K', status: 'ok' },
      { label: '61–90 days', value: '$48K', status: 'ok' },
      { label: '91–120 days', value: '$22K', status: 'ok' },
      { label: '120+ days', value: '$18K', status: 'flag' },
    ],
    footer: 'Aging claims escalated to specialists before timely-filing windows close',
  },
  '14': {
    headline: 'Denials · last 30 days',
    metric: '95%',
    metricLabel: 'Appeal success rate',
    rows: [
      { label: 'Total denied', value: '142 claims · $186K', status: 'ok' },
      { label: 'Root cause: auth missing', value: '38%', status: 'flag' },
      { label: 'Root cause: coding', value: '24%', status: 'ok' },
      { label: 'Root cause: eligibility', value: '18%', status: 'ok' },
      { label: 'Recovered', value: '$162K (87%)', status: 'ok' },
    ],
    footer: 'Root-cause analysis on every denial, so that category shrinks next quarter.',
  },
  '19': {
    headline: 'Patient #P-44218 · Spanish',
    metric: '50+',
    metricLabel: 'Languages supported · real-time',
    rows: [
      { label: 'Balance', value: '$420.00', status: 'ok' },
      { label: 'Plan offered', value: '4 mo · $105/mo', status: 'ok' },
      { label: 'Method', value: 'Credit card · auto-pay', status: 'ok' },
      { label: 'Outcome', value: 'Plan accepted', status: 'ok' },
    ],
    footer: 'Empathetic, multilingual, and always available. No patient call goes unanswered.',
  },
}

export default function PlatformModulesSection() {
  const [selectedNum, setSelectedNum] = useState('02') // default: Eligibility, like Zeus
  const selected = modules.find(m => m.num === selectedNum)!
  const demo = liveDemos[selectedNum]

  return (
    <section className="section section-alt" style={{ overflow: 'hidden' }}>
      <div className="container">
        <RevealOnScroll>
          <div className="section-label">Inside Zeus</div>
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
            23 Modules.<br /><span style={{ color: '#00B5D6', fontStyle: 'italic' }}>One Intelligent Core.</span>
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.2}>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--gray-600)', maxWidth: 720, marginBottom: 56 }}>
            Every step of the revenue cycle, in one system. Click any module to see how it works.
          </p>
        </RevealOnScroll>

        {/* DESKTOP: two-column layout (list + live demo).
            Hidden via CSS on mobile (<=768) — replaced by the carousel below. */}
        <div className="modules-desktop-wrap">
        <div className="modules-layout" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          gap: 32,
          alignItems: 'flex-start',
        }}>
          {/* LEFT: Module list grouped by category */}
          <RevealOnScroll direction="left" delay={0.3}>
            <div style={{
              background: 'var(--white)',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 0',
              maxHeight: 640,
              overflowY: 'auto',
            }}>
              {categoryOrder.map(cat => {
                const catModules = modules.filter(m => m.category === cat)
                return (
                  <div key={cat}>
                    <div style={{
                      padding: '14px 24px 10px',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'var(--gray-500)',
                      fontFamily: 'var(--font-display)',
                    }}>
                      {cat}
                    </div>
                    {catModules.map(m => {
                      const isActive = m.num === selectedNum
                      return (
                        <button
                          key={m.num}
                          onClick={() => setSelectedNum(m.num)}
                          style={{
                            width: '100%',
                            padding: '12px 24px',
                            background: isActive ? '#D6EBF2' : 'transparent',
                            border: 'none',
                            borderLeft: isActive ? '3px solid #00B5D6' : '3px solid transparent',
                            display: 'grid',
                            gridTemplateColumns: 'auto 1fr auto',
                            alignItems: 'center',
                            gap: 14,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s ease',
                            fontFamily: 'var(--font-body)',
                          }}
                          onMouseEnter={e => {
                            if (!isActive) e.currentTarget.style.background = 'var(--gray-100)'
                          }}
                          onMouseLeave={e => {
                            if (!isActive) e.currentTarget.style.background = 'transparent'
                          }}
                        >
                          <span style={{
                            fontSize: 11, fontWeight: 700,
                            color: isActive ? '#00B5D6' : 'var(--gray-400)',
                            fontFamily: 'var(--font-display)',
                            letterSpacing: '0.04em',
                          }}>
                            {m.num}
                          </span>
                          <span style={{
                            fontSize: 14, fontWeight: isActive ? 600 : 500,
                            color: isActive ? 'var(--gray-900)' : 'var(--gray-700)',
                            fontFamily: 'var(--font-display)',
                            letterSpacing: '-0.005em',
                          }}>
                            {m.name}
                          </span>
                          {m.agent && (
                            <span style={{
                              fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
                              color: '#00B5D6',
                              background: isActive ? 'white' : '#D6EBF2',
                              padding: '3px 7px', borderRadius: 3,
                            }}>
                              AI
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </RevealOnScroll>

          {/* RIGHT: Live demo panel */}
          <RevealOnScroll direction="right" delay={0.4}>
            <div key={selectedNum} style={{
              background: 'linear-gradient(140deg, #00B5D6 0%, #36C2DE 60%, #68D1E6 100%)',
              borderRadius: 'var(--radius-md)',
              padding: 0,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0,181,214,0.3)',
              animation: 'mod-fadein 0.4s ease-out',
              minHeight: 560,
            }}>
              {/* Scan-line texture */}
              <div aria-hidden="true" style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.025) 3px, rgba(255,255,255,0.025) 4px)',
              }} />

              {/* Header */}
              <div style={{
                background: '#00B5D6',
                padding: '16px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255,255,255,0.25)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', background: 'white',
                    boxShadow: '0 0 12px rgba(255,255,255,0.9)',
                    animation: 'mod-pulse 1.6s ease-in-out infinite',
                  }} />
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'white', fontFamily: 'var(--font-display)' }}>
                    {selected.name} · {demo ? 'Live' : 'Module'}
                  </div>
                </div>
                {selected.agent && (
                  <div style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                    background: 'rgba(255,255,255,0.18)',
                    padding: '4px 10px',
                    borderRadius: 4,
                    color: 'white',
                  }}>
                    {selected.agent}
                  </div>
                )}
              </div>

              {/* Body */}
              <div style={{ padding: '32px 32px 28px', position: 'relative' }}>
                {demo ? (
                  <>
                    {/* Big metric */}
                    <div style={{ marginBottom: 28 }}>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(48px, 6vw, 72px)',
                        fontWeight: 700,
                        color: 'white',
                        letterSpacing: '-0.04em',
                        lineHeight: 0.95,
                      }}>
                        {demo.metric}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'white', opacity: 0.85, marginTop: 8 }}>
                        {demo.metricLabel}
                      </div>
                    </div>

                    {/* Headline */}
                    <div style={{
                      padding: '14px 18px',
                      background: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: 8,
                      marginBottom: 14,
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'white', opacity: 0.75, marginBottom: 4 }}>
                        Sample Encounter
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'white', fontFamily: 'var(--font-display)' }}>
                        {demo.headline}
                      </div>
                    </div>

                    {/* Rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {demo.rows.map((r, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '10px 14px',
                          background: 'rgba(255,255,255,0.1)',
                          border: r.status === 'flag' ? '1px dashed rgba(255,255,255,0.45)' : '1px solid rgba(255,255,255,0.2)',
                          borderRadius: 6,
                          animation: `mod-rowin 0.4s ease-out ${0.1 + i * 0.08}s backwards`,
                        }}>
                          {r.status === 'flag' ? (
                            <div style={{
                              width: 18, height: 18, borderRadius: '50%',
                              background: 'rgba(255,255,255,0.2)',
                              border: '1.5px solid white',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                              </svg>
                            </div>
                          ) : (
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
                          )}
                          <span style={{ fontSize: 13, color: 'white', flex: 1, opacity: 0.9 }}>
                            {r.label}
                          </span>
                          <span style={{
                            fontSize: 13, fontWeight: 600, color: 'white',
                            fontFamily: 'var(--font-display)', letterSpacing: '-0.005em',
                          }}>
                            {r.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div style={{
                      marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.3)',
                      fontSize: 12, color: 'white', opacity: 0.85, lineHeight: 1.5,
                    }}>
                      {demo.footer}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Generic module card for non-demo modules */}
                    <div style={{ marginBottom: 24 }}>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(28px, 3.5vw, 40px)',
                        fontWeight: 600,
                        color: 'white',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                        marginBottom: 12,
                      }}>
                        {selected.name}
                      </div>
                      <div style={{ fontSize: 15, color: 'white', opacity: 0.95, lineHeight: 1.6 }}>
                        {selected.desc}
                      </div>
                    </div>
                    <div style={{
                      padding: 24,
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      borderRadius: 8,
                      marginTop: 32,
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'white', opacity: 0.85, marginBottom: 14 }}>
                        Module Capabilities
                      </div>
                      <div style={{ fontSize: 14, color: 'white', lineHeight: 1.7 }}>
                        Integrated with the rest of the system. Data flows in real time across all 23 modules, with no copy-paste, no manual handoffs, and no information lost between teams.
                      </div>
                    </div>
                    <div style={{
                      marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.3)',
                      fontSize: 12, color: 'white', opacity: 0.85,
                    }}>
                      Click an AI module on the left to see a live demo
                    </div>
                  </>
                )}
              </div>
            </div>
          </RevealOnScroll>
        </div>
        </div>
        {/* end .modules-desktop-wrap */}

        {/* MOBILE: auto-rotating carousel of all 23 modules.
            Each slide = one self-contained card (category, number, name, AI badge, description).
            Hidden on desktop via CSS. Dots disabled — 23 dots would overflow narrow phones;
            using a "n / 23" position counter inside the card instead. */}
        <div className="modules-mobile-wrap">
          <MobileCarousel autoScrollInterval={4000} showDots={false}>
            {modules.map((m, i) => (
              <div key={m.num} style={{
                background: 'var(--white)',
                border: '1px solid var(--gray-200)',
                borderRadius: 16,
                padding: '24px 22px',
                minHeight: 220,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                margin: '0 4px',
              }}>
                {/* Top row: category + AI badge + counter */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--gray-500)',
                    fontFamily: 'var(--font-display)',
                  }}>
                    {m.category}
                  </span>
                  {m.agent && (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      color: '#00B5D6',
                      background: '#D6EBF2',
                      padding: '4px 8px',
                      borderRadius: 4,
                    }}>
                      AI · {m.agent.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Module number + name */}
                <div>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#00B5D6',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.04em',
                    marginBottom: 4,
                  }}>
                    {m.num}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    fontWeight: 500,
                    color: 'var(--gray-900)',
                    margin: 0,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.2,
                  }}>
                    {m.name}
                  </h3>
                </div>

                {/* Description */}
                <p style={{
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: 'var(--gray-600)',
                  margin: 0,
                }}>
                  {m.desc}
                </p>

                {/* Position counter */}
                <div style={{
                  marginTop: 'auto',
                  paddingTop: 12,
                  borderTop: '1px solid var(--gray-100)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: 'var(--gray-400)',
                  fontFamily: 'var(--font-display)',
                }}>
                  {String(i + 1).padStart(2, '0')} / {modules.length}
                </div>
              </div>
            ))}
          </MobileCarousel>
        </div>
      </div>

      <style>{`
        @keyframes mod-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        @keyframes mod-fadein {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mod-rowin {
          from { opacity: 0; transform: translateX(-4px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @media (max-width: 900px) {
          .modules-layout { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
        /* Mobile/desktop split: at <=768 we replace the desktop two-col layout
           with the auto-rotating carousel. The 900px rule above still applies
           to the desktop wrap for tablet widths in 769-900px range. */
        .modules-mobile-wrap { display: none; }
        @media (max-width: 768px) {
          .modules-desktop-wrap { display: none !important; }
          .modules-mobile-wrap { display: block !important; }
        }
      `}</style>
    </section>
  )
}
