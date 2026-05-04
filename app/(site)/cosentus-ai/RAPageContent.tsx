'use client'

import { useState, useEffect } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'
import PlatformModulesSection from './PlatformModulesSection'
import VoiceCallModal, { type VoiceAgent } from '@/components/voice/VoiceCallModal'
import ProblemSolutionSection from '@/components/sections/ProblemSolutionSection'
import { AGENTS } from '@/data/voice-agents'

const steps = [
  { num: '1', title: 'We learn your practice', desc: "Deep-dive into specialty workflows, payer mix, and denial patterns. We focus on your three P's, Processes, Procedures, and Protocols, and customize our approach to your specific challenges. No templates." },
  { num: '2', title: 'Named teams take over', desc: 'AAPC-certified coders, denials experts, and a client success manager run your account daily.' },
  { num: '3', title: 'AI agents handle volume', desc: 'Nine agents automate eligibility, prior auth follow-ups, scheduling, patient collection, claim follow-up, AR tracking, and coding support.' },
  { num: '4', title: 'Humans handle judgment', desc: 'Complex coding, clinical validation, denial appeals and underpayment recovery remain with experienced specialists.' },
  { num: '5', title: 'You see everything', desc: "Real-time dashboards, weekly check-ins, monthly ops meetings, and quarterly business reviews ensure full transparency. We don't wait for problems to escalate, when we identify an issue, we perform root cause analysis and act immediately, before it impacts revenue or cash flow." },
]

export default function RAPageContent() {
  const [activeAgent, setActiveAgent] = useState<VoiceAgent | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [stepPaused, setStepPaused] = useState(false)

  // Auto-advance steps every 5 seconds, loop back to 1
  useEffect(() => {
    if (stepPaused) return
    const timer = setInterval(() => {
      setActiveStep(prev => (prev >= steps.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [stepPaused, activeStep])

  return (
    <>
      {/* Voice call modal, opens when an agent is clicked. Same component
          used on the homepage for consistency. */}
      {activeAgent && (
        <VoiceCallModal agent={activeAgent} onClose={() => setActiveAgent(null)} />
      )}

      {/* WHY ZEUS — 23 Modules / 15 AI Features / 45+ Specialties.
          New section per Zeus design prototype. Sits between PageHero (parent)
          and the existing voice agents grid. */}
      <section className="section section-alt" style={{ overflow: 'hidden' }}>
        <div className="container">
          <RevealOnScroll>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 3.2vw, 40px)',
              fontWeight: 300,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--gray-900)',
              marginBottom: 12,
              maxWidth: 720,
            }}>
              AI in the core. <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Not on the side.</span>
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p style={{
              fontSize: 16,
              color: 'var(--gray-700)',
              lineHeight: 1.7,
              maxWidth: 640,
              marginBottom: 56,
            }}>
              Built AI-native from day one. Every module, every workflow, every agent — designed around intelligence, not retrofitted into it.
            </p>
          </RevealOnScroll>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
            borderTop: '1px solid var(--gray-200)',
            borderBottom: '1px solid var(--gray-200)',
          }} className="zeus-why-grid">
            {[
              { num: '23', label: 'Modules', desc: 'End-to-end RCM + EHR.' },
              { num: '15', label: 'AI Features', desc: 'Every step, intelligent.' },
              { num: '45+', label: 'Specialties', desc: 'Few-shot specialty configs.' },
            ].map((stat, i) => (
              <RevealOnScroll key={stat.label} delay={0.3 + i * 0.12}>
                <div style={{
                  padding: 'clamp(36px, 4vw, 56px) clamp(20px, 3vw, 40px)',
                  borderRight: i < 2 ? '1px solid var(--gray-200)' : 'none',
                  textAlign: 'center',
                }} className="zeus-why-cell">
                  <div className="zeus-why-num" style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(56px, 7vw, 88px)',
                    fontWeight: 300,
                    lineHeight: 1,
                    color: '#00B5D6',
                    letterSpacing: '-0.03em',
                    marginBottom: 12,
                  }}>
                    {stat.num}
                  </div>
                  <div className="zeus-why-label" style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 18,
                    fontWeight: 600,
                    color: 'var(--gray-900)',
                    marginBottom: 6,
                    letterSpacing: '-0.005em',
                  }}>
                    {stat.label}
                  </div>
                  <div className="zeus-why-desc" style={{
                    fontSize: 14,
                    color: 'var(--gray-700)',
                    lineHeight: 1.5,
                  }}>
                    {stat.desc}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <style>{`
          /* Mobile: keep all three stats on one row instead of stacking.
             Per Lakshay: 'they can just come in one line, right? We are
             just wasting space here completely.' Shrink everything to fit. */
          @media (max-width: 768px) {
            .zeus-why-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
            .zeus-why-cell {
              padding: 20px 6px !important;
              border-right: 1px solid var(--gray-200) !important;
              border-bottom: none !important;
            }
            .zeus-why-grid .zeus-why-cell:last-child {
              border-right: none !important;
              border-bottom: none !important;
            }
            .zeus-why-cell .zeus-why-num {
              font-size: 40px !important;
              margin-bottom: 6px !important;
            }
            .zeus-why-cell .zeus-why-label {
              font-size: 13px !important;
              margin-bottom: 4px !important;
            }
            .zeus-why-cell .zeus-why-desc {
              font-size: 11px !important;
              line-height: 1.35 !important;
            }
          }
          /* Very narrow phones: drop the desc line to keep cells readable */
          @media (max-width: 380px) {
            .zeus-why-cell .zeus-why-num {
              font-size: 34px !important;
            }
            .zeus-why-cell .zeus-why-desc {
              display: none !important;
            }
          }
        `}</style>
      </section>

      {/* The 9 AI Voice Agents */}
      <section className="section">
        <div className="container">
          {/* AI Agents Grid, circular avatars matching homepage R+A section.
              Click any agent → opens VoiceCallModal for a real Retell voice call. */}
          <div style={{ marginTop: 48 }}>
            <RevealOnScroll>
              <h2 style={{ fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 300, color: 'var(--gray-900)', textAlign: 'center', marginBottom: 8 }}>
                Voice AI: Agents that call. Agents that <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>listen.</span>
              </h2>
              <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: 16, marginBottom: 40, fontStyle: 'italic' }}>
                Click any agent to start a conversation
              </p>
            </RevealOnScroll>

            {/* Single responsive grid (replaces previous desktop-grid + mobile-carousel
                split). Mirrors the homepage RA section: 3 columns at all widths,
                circles shrink and gap tightens at <=700 / <=420 breakpoints. */}
            <div className="ra-tech-agents-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '48px 32px',
              maxWidth: 760,
              margin: '0 auto',
            }}>
              {AGENTS.map((agent, i) => (
                <RevealOnScroll key={agent.name} delay={i * 0.06}>
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Talk to ${agent.name}, ${agent.shortRole}`}
                    onClick={() => setActiveAgent(agent)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setActiveAgent(agent)
                      }
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      outline: 'none',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
                  >
                    <div className="ra-tech-agent-circle" style={{
                      width: 130,
                      height: 130,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: '#f5f9fa',
                      border: '3px solid #00B5D6',
                      boxShadow: '0 6px 20px rgba(0, 181, 214, 0.18)',
                      marginBottom: 14,
                      flexShrink: 0,
                    }}>
                      <img
                        src={`/images/${agent.img}`}
                        alt={agent.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
                      />
                    </div>
                    {/* Name, bold, matches homepage style */}
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--gray-900)',
                      letterSpacing: '0.01em',
                      lineHeight: 1.2,
                    }}>
                      {agent.name}
                    </div>
                    <div className="ra-tech-agent-role" style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'var(--gray-700)',
                      marginTop: 4,
                      lineHeight: 1.3,
                      letterSpacing: '0.01em',
                    }}>
                      {agent.shortRole}
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          {/* Mobile responsive sizing — mirrors the homepage RA section breakpoints
              so the Zeus agents grid feels identical at all viewport widths. */}
          <style>{`
            @media (max-width: 1100px) {
              .ra-tech-agents-grid .ra-tech-agent-circle {
                width: 110px !important;
                height: 110px !important;
              }
            }
            @media (max-width: 700px) {
              .ra-tech-agents-grid {
                gap: 18px 10px !important;
                max-width: 100% !important;
              }
              .ra-tech-agents-grid .ra-tech-agent-circle {
                width: 96px !important;
                height: 96px !important;
              }
              .ra-tech-agents-grid .ra-tech-agent-role {
                font-size: 13px !important;
              }
            }
            @media (max-width: 420px) {
              .ra-tech-agents-grid {
                gap: 16px 8px !important;
              }
              .ra-tech-agents-grid .ra-tech-agent-circle {
                width: 88px !important;
                height: 88px !important;
              }
            }
          `}</style>
        </div>
      </section>


      {/* Problem + Solution, Animated Split Section */}
      <ProblemSolutionSection
        problemTitle="Why Specialty Practices Deserve Better"
        problemBody="Traditional RCM adds headcount. AI startups remove it. Neither understands the nuances of specialty revenue cycles."
        problemBullets={[
          'Generic billing teams miss specialty nuances',
          'AI-only solutions lack clinical judgment',
          'Revenue leaks at every handoff',
        ]}
        solutionTitle="Real + Artificial Intelligence"
        solutionBody="Named human teams for judgment. AI agents for volume. 25 years of specialty expertise no one can replicate."
        solutionBullets={[
          'Specialty-trained teams for every payer nuance',
          '8 AI agents automating volume workflows',
          'Up to 30% revenue growth within 12 months',
        ]}
      />


      {/* How R+A Works, Interactive 5-Step Timeline */}
      <section className="section section-alt" style={{ overflow: 'hidden' }} onMouseEnter={() => setStepPaused(true)} onMouseLeave={() => setStepPaused(false)}>
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">How Real People + AI Works — in 5 Steps</div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.25}>
            <div style={{ marginTop: 56 }}>
              {/* Timeline bar with step nodes */}
              <div className="step-timeline" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48, padding: '0 20px' }}>
                {/* Background line */}
                <div style={{ position: 'absolute', top: '50%', left: 40, right: 40, height: 3, background: 'var(--gray-200)', borderRadius: 2, transform: 'translateY(-50%)' }} />
                {/* Active progress line */}
                <div className="step-progress-line" style={{ position: 'absolute', top: '50%', left: 40, height: 3, background: 'var(--primary)', borderRadius: 2, transform: 'translateY(-50%)', transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)', width: `calc(${(activeStep / (steps.length - 1)) * 100}% - 80px * ${(activeStep / (steps.length - 1))})` }} />

                {steps.map((step, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`step-node ${activeStep === i ? 'step-active' : ''} ${i <= activeStep ? 'step-done' : ''}`}
                    style={{
                      position: 'relative', zIndex: 2, width: 56, height: 56, borderRadius: '50%',
                      border: i <= activeStep ? '3px solid var(--primary)' : '3px solid var(--gray-300)',
                      background: i <= activeStep ? 'var(--primary)' : 'var(--white)',
                      color: i <= activeStep ? 'white' : 'var(--gray-500)',
                      fontSize: 20, fontWeight: 600, fontFamily: 'var(--font-display)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: activeStep === i ? '0 0 0 8px rgba(0,181,214,0.15), 0 4px 20px rgba(0,181,214,0.3)' : 'none',
                    }}
                  >
                    {step.num}
                    {/* Step label below */}
                    <span className="step-timeline-label" style={{
                      position: 'absolute', top: 'calc(100% + 12px)', left: '50%', transform: 'translateX(-50%)',
                      fontSize: 12, fontWeight: activeStep === i ? 500 : 400, whiteSpace: 'nowrap',
                      color: activeStep === i ? 'var(--primary)' : 'var(--gray-500)',
                      transition: 'all 0.3s ease', letterSpacing: '0.01em',
                    }}>
                      {step.title}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active step detail panel */}
              <div className="step-detail-panel" style={{
                marginTop: 32, padding: '40px 48px', background: 'var(--white)', borderRadius: 16,
                border: '1px solid var(--gray-200)', position: 'relative', overflow: 'hidden',
                minHeight: 160, transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
                {/* Teal accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: 'var(--primary)', borderRadius: '0 2px 2px 0' }} />

                <div key={activeStep} className="step-detail-content" style={{ animation: 'stepFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)',
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, fontWeight: 600, flexShrink: 0,
                    }}>{steps[activeStep].num}</div>
                    <h4 style={{ fontSize: 22, fontWeight: 500, color: 'var(--gray-900)', margin: 0 }}>
                      {steps[activeStep].title}
                    </h4>
                  </div>
                  <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--gray-600)', margin: 0, paddingLeft: 56 }}>
                    {steps[activeStep].desc}
                  </p>
                </div>

                {/* Step navigation arrows */}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 24 }}>
                  <button
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    style={{
                      width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--gray-200)',
                      background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: activeStep === 0 ? 'default' : 'pointer', opacity: activeStep === 0 ? 0.3 : 1,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gray-600)" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <button
                    onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                    disabled={activeStep === steps.length - 1}
                    style={{
                      width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--primary)',
                      background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: activeStep === steps.length - 1 ? 'default' : 'pointer',
                      opacity: activeStep === steps.length - 1 ? 0.4 : 1,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <PlatformModulesSection />

      {/* MULTI-EHR INTEGRATION — Zeus sits above every EHR.
          New section per Zeus design prototype. Adapted to light theme as
          Lakshay specified (prototype was dark). Zeus center + 6 EHR labels
          in orbit positions, with staggered lightning bolts striking from
          center to each EHR. Stats row + protocol chips. */}
      <section className="section section-alt" style={{ overflow: 'hidden' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(40px, 5vw, 80px)',
            alignItems: 'center',
          }} className="zeus-ehr-grid">
            {/* Left — copy + stats + protocols */}
            <div>
              <RevealOnScroll direction="left">
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(28px, 3.2vw, 40px)',
                  fontWeight: 300,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  color: 'var(--gray-900)',
                  marginBottom: 20,
                }}>
                  One RCM brain.<br />
                  <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Every EHR.</span>
                </h2>
              </RevealOnScroll>
              <RevealOnScroll direction="left" delay={0.2}>
                <p style={{
                  fontSize: 16,
                  color: 'var(--gray-700)',
                  lineHeight: 1.7,
                  marginBottom: 32,
                  maxWidth: 480,
                }}>
                  Zeus sits above your EHRs and speaks every protocol they do. No rip-and-replace. No data silos. Bidirectional sync in minutes, not months.
                </p>
              </RevealOnScroll>

              {/* Stats row */}
              <RevealOnScroll direction="left" delay={0.3}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 16,
                  marginBottom: 32,
                  maxWidth: 480,
                }}>
                  {[
                    { num: '18+', label: 'EHRs supported' },
                    { num: '4', label: 'Protocols native' },
                    { num: '<5 min', label: 'To first sync' },
                  ].map((stat) => (
                    <div key={stat.label} style={{
                      padding: '20px 16px',
                      background: 'var(--white)',
                      border: '1px solid var(--gray-200)',
                      borderRadius: 12,
                    }}>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(22px, 2.5vw, 28px)',
                        fontWeight: 600,
                        color: '#00B5D6',
                        lineHeight: 1,
                        marginBottom: 6,
                        letterSpacing: '-0.02em',
                      }}>
                        {stat.num}
                      </div>
                      <div style={{
                        fontSize: 12,
                        color: 'var(--gray-700)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        fontWeight: 500,
                      }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>

              {/* Protocol chips */}
              <RevealOnScroll direction="left" delay={0.4}>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  maxWidth: 480,
                }}>
                  {[
                    { name: 'HL7 v2', detail: 'ADT · ORM · SIU' },
                    { name: 'FHIR R4', detail: 'REST · Bulk · SMART' },
                    { name: 'X12', detail: '837 · 835 · 270/271' },
                    { name: 'REST API', detail: 'Webhooks · OAuth' },
                  ].map((proto) => (
                    <div key={proto.name} style={{
                      padding: '8px 14px',
                      background: 'var(--white)',
                      border: '1px solid var(--gray-200)',
                      borderRadius: 999,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--gray-900)',
                      }}>{proto.name}</span>
                      <span style={{
                        fontSize: 11,
                        color: 'var(--gray-500)',
                        fontFamily: 'monospace',
                      }}>{proto.detail}</span>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>
            </div>

            {/* Right — Zeus orbit + lightning */}
            <RevealOnScroll direction="right" delay={0.2}>
              <div style={{
                position: 'relative',
                aspectRatio: '1',
                maxWidth: 560,
                margin: '0 auto',
              }} className="zeus-ehr-orbit">
                <svg viewBox="0 0 640 640" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <radialGradient id="zeusEhrGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#00B5D6" stopOpacity="0.30" />
                      <stop offset="100%" stopColor="#00B5D6" stopOpacity="0" />
                    </radialGradient>
                    <filter id="zeusBoltGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="b" />
                      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="zeusBoltBlur" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="6" />
                    </filter>
                  </defs>

                  {/* Ambient glow behind Zeus core */}
                  <circle cx="320" cy="320" r="140" fill="url(#zeusEhrGlow)" />

                  {/* EHR labels — 6 positions around orbit */}
                  <g fontFamily="var(--font-display), Reddit Sans, system-ui" fontWeight="700" textAnchor="middle">
                    <g><text x="320" y="102" fill="var(--gray-900)" fontSize="22">Epic</text><text x="320" y="122" fill="#00B5D6" fontFamily="monospace" fontSize="11" fontWeight="600">FHIR</text></g>
                    <g><text x="510" y="212" fill="var(--gray-900)" fontSize="20">Oracle</text><text x="510" y="232" fill="#00B5D6" fontFamily="monospace" fontSize="11" fontWeight="600">HL7</text></g>
                    <g><text x="540" y="432" fill="var(--gray-900)" fontSize="20">athena</text><text x="540" y="452" fill="#00B5D6" fontFamily="monospace" fontSize="11" fontWeight="600">REST</text></g>
                    <g><text x="320" y="540" fill="var(--gray-900)" fontSize="20">eCW</text><text x="320" y="560" fill="#00B5D6" fontFamily="monospace" fontSize="11" fontWeight="600">HL7</text></g>
                    <g><text x="100" y="432" fill="var(--gray-900)" fontSize="20">NextGen</text><text x="100" y="452" fill="#00B5D6" fontFamily="monospace" fontSize="11" fontWeight="600">HL7</text></g>
                    <g><text x="130" y="212" fill="var(--gray-900)" fontSize="20">Meditech</text><text x="130" y="232" fill="#00B5D6" fontFamily="monospace" fontSize="11" fontWeight="600">FHIR</text></g>
                  </g>

                  {/* Lightning bolts — 6 staggered, teal core for light theme.
                      Each bolt = halo (wide blur) + glow (medium) + bright core.
                      Originating from Zeus center (320,320) to each EHR label. */}
                  <g fill="none" strokeLinecap="round" strokeLinejoin="miter">
                    {/* To Epic (top) */}
                    <g>
                      <path d="M 320 320 L 302 296 L 325 273 L 301 249 L 332 226 L 301 202 L 313 179 L 318 155 L 342 132 L 320 108" stroke="#A1DEED" strokeWidth="14" opacity="0" filter="url(#zeusBoltBlur)">
                        <animate attributeName="opacity" values="0;0.85;0.3;0.7;0.15;0;0" keyTimes="0;0.01;0.04;0.06;0.08;0.12;1" dur="3s" begin="0s" repeatCount="indefinite" />
                      </path>
                      <path d="M 320 320 L 302 296 L 325 273 L 301 249 L 332 226 L 301 202 L 313 179 L 318 155 L 342 132 L 320 108" stroke="#00B5D6" strokeWidth="3" opacity="0" filter="url(#zeusBoltGlow)">
                        <animate attributeName="opacity" values="0;1;0.4;0.85;0.2;0;0" keyTimes="0;0.01;0.04;0.06;0.08;0.12;1" dur="3s" begin="0s" repeatCount="indefinite" />
                      </path>
                    </g>
                    {/* To Oracle (top-right) */}
                    <g>
                      <path d="M 320 320 L 338 309 L 343 282 L 358 266 L 378 259 L 408 263 L 405 226 L 447 245 L 441 203 L 510 215" stroke="#A1DEED" strokeWidth="14" opacity="0" filter="url(#zeusBoltBlur)">
                        <animate attributeName="opacity" values="0;0.85;0.3;0.7;0.15;0;0" keyTimes="0;0.01;0.04;0.06;0.08;0.12;1" dur="3s" begin="0.5s" repeatCount="indefinite" />
                      </path>
                      <path d="M 320 320 L 338 309 L 343 282 L 358 266 L 378 259 L 408 263 L 405 226 L 447 245 L 441 203 L 510 215" stroke="#00B5D6" strokeWidth="3" opacity="0" filter="url(#zeusBoltGlow)">
                        <animate attributeName="opacity" values="0;1;0.4;0.85;0.2;0;0" keyTimes="0;0.01;0.04;0.06;0.08;0.12;1" dur="3s" begin="0.5s" repeatCount="indefinite" />
                      </path>
                    </g>
                    {/* To athena (bottom-right) */}
                    <g>
                      <path d="M 320 320 L 352 315 L 356 352 L 391 342 L 396 378 L 424 379 L 436 404 L 462 407 L 487 413 L 540 432" stroke="#A1DEED" strokeWidth="14" opacity="0" filter="url(#zeusBoltBlur)">
                        <animate attributeName="opacity" values="0;0.85;0.3;0.7;0.15;0;0" keyTimes="0;0.01;0.04;0.06;0.08;0.12;1" dur="3s" begin="1s" repeatCount="indefinite" />
                      </path>
                      <path d="M 320 320 L 352 315 L 356 352 L 391 342 L 396 378 L 424 379 L 436 404 L 462 407 L 487 413 L 540 432" stroke="#00B5D6" strokeWidth="3" opacity="0" filter="url(#zeusBoltGlow)">
                        <animate attributeName="opacity" values="0;1;0.4;0.85;0.2;0;0" keyTimes="0;0.01;0.04;0.06;0.08;0.12;1" dur="3s" begin="1s" repeatCount="indefinite" />
                      </path>
                    </g>
                    {/* To eCW (bottom) */}
                    <g>
                      <path d="M 320 320 L 321 347 L 334 373 L 340 400 L 336 427 L 299 453 L 327 480 L 303 507 L 328 533 L 320 540" stroke="#A1DEED" strokeWidth="14" opacity="0" filter="url(#zeusBoltBlur)">
                        <animate attributeName="opacity" values="0;0.85;0.3;0.7;0.15;0;0" keyTimes="0;0.01;0.04;0.06;0.08;0.12;1" dur="3s" begin="1.5s" repeatCount="indefinite" />
                      </path>
                      <path d="M 320 320 L 321 347 L 334 373 L 340 400 L 336 427 L 299 453 L 327 480 L 303 507 L 328 533 L 320 540" stroke="#00B5D6" strokeWidth="3" opacity="0" filter="url(#zeusBoltGlow)">
                        <animate attributeName="opacity" values="0;1;0.4;0.85;0.2;0;0" keyTimes="0;0.01;0.04;0.06;0.08;0.12;1" dur="3s" begin="1.5s" repeatCount="indefinite" />
                      </path>
                    </g>
                    {/* To NextGen (bottom-left) */}
                    <g>
                      <path d="M 320 320 L 290 317 L 275 339 L 271 376 L 238 368 L 217 380 L 212 415 L 183 415 L 161 425 L 100 432" stroke="#A1DEED" strokeWidth="14" opacity="0" filter="url(#zeusBoltBlur)">
                        <animate attributeName="opacity" values="0;0.85;0.3;0.7;0.15;0;0" keyTimes="0;0.01;0.04;0.06;0.08;0.12;1" dur="3s" begin="2s" repeatCount="indefinite" />
                      </path>
                      <path d="M 320 320 L 290 317 L 275 339 L 271 376 L 238 368 L 217 380 L 212 415 L 183 415 L 161 425 L 100 432" stroke="#00B5D6" strokeWidth="3" opacity="0" filter="url(#zeusBoltGlow)">
                        <animate attributeName="opacity" values="0;1;0.4;0.85;0.2;0;0" keyTimes="0;0.01;0.04;0.06;0.08;0.12;1" dur="3s" begin="2s" repeatCount="indefinite" />
                      </path>
                    </g>
                    {/* To Meditech (top-left) */}
                    <g>
                      <path d="M 320 320 L 296 305 L 282 281 L 261 263 L 240 256 L 215 260 L 202 230 L 178 246 L 165 220 L 130 215" stroke="#A1DEED" strokeWidth="14" opacity="0" filter="url(#zeusBoltBlur)">
                        <animate attributeName="opacity" values="0;0.85;0.3;0.7;0.15;0;0" keyTimes="0;0.01;0.04;0.06;0.08;0.12;1" dur="3s" begin="2.5s" repeatCount="indefinite" />
                      </path>
                      <path d="M 320 320 L 296 305 L 282 281 L 261 263 L 240 256 L 215 260 L 202 230 L 178 246 L 165 220 L 130 215" stroke="#00B5D6" strokeWidth="3" opacity="0" filter="url(#zeusBoltGlow)">
                        <animate attributeName="opacity" values="0;1;0.4;0.85;0.2;0;0" keyTimes="0;0.01;0.04;0.06;0.08;0.12;1" dur="3s" begin="2.5s" repeatCount="indefinite" />
                      </path>
                    </g>
                  </g>

                  {/* Zeus brand logo lockup — vertical (ZEUS wordmark + bolt).
                      Asset: /public/images/zeus/zeus-logo-v.png — transparent PNG,
                      teal logo, programmatically stripped from zeus_logo_V_blue.png. */}
                  <image href="/images/zeus/zeus-logo-v.png" x="220" y="286" width="200" height="68" />
                </svg>
              </div>
            </RevealOnScroll>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .zeus-ehr-grid { grid-template-columns: 1fr !important; }
            .zeus-ehr-orbit { max-width: 480px !important; margin-top: 32px !important; }
          }
        `}</style>
      </section>

      {/* NUMBERS THAT MOVE — KPI benchmark grid.
          New section per Zeus design prototype. Six cards, each comparing
          Zeus to industry benchmarks. Last substantive section before the
          parent's CTA. */}
      <section className="section" style={{ overflow: 'hidden' }}>
        <div className="container">
          <RevealOnScroll>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 3.2vw, 40px)',
              fontWeight: 300,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--gray-900)',
              marginBottom: 12,
            }}>
              Numbers that <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>move.</span>
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p style={{
              fontSize: 16,
              color: 'var(--gray-700)',
              lineHeight: 1.7,
              maxWidth: 560,
              marginBottom: 56,
            }}>
              Per client. Per cycle. Benchmarks that make CFOs lean forward.
            </p>
          </RevealOnScroll>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }} className="zeus-kpi-grid">
            <MobileCarousel autoScrollInterval={4500}>
            {[
              { label: 'Clean claim rate', tag: '▲ 4pts', tagDir: 'up', pre: '', big: '98', unit: '%', plus: '+', industry: '90–95%', zeus: 'Zeus 98%+' },
              { label: 'Coding accuracy', tag: '▲ 10pts', tagDir: 'up', pre: '', big: '99', unit: '%', plus: '', industry: '85–90%', zeus: 'Zeus 99%' },
              { label: 'Denial rate', tag: '▼ 55%', tagDir: 'down', pre: '<', big: '5', unit: '%', plus: '', industry: '6–12%', zeus: 'Zeus <5%' },
              { label: 'Coding time per chart', tag: '▼ 80%', tagDir: 'down', pre: '', big: '3', unit: 'min', plus: '', industry: '10–15 min', zeus: 'Zeus 3 min' },
              { label: 'Days in A/R', tag: '▼ 35%', tagDir: 'down', pre: '<', big: '30', unit: '', plus: '', industry: '35–50 days', zeus: 'Zeus <30d' },
              { label: 'Appeal success', tag: '▲ 15pts', tagDir: 'up', pre: '', big: '65', unit: '%', plus: '+', industry: '50–55%', zeus: 'Zeus 65%+' },
            ].map((kpi, i) => (
              <RevealOnScroll key={kpi.label} direction="scale" delay={0.3 + i * 0.08}>
                <div style={{
                  padding: 'clamp(24px, 3vw, 32px)',
                  background: 'var(--white)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 16,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  transition: 'transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.3s',
                }} className="zeus-kpi-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{
                      fontSize: 13,
                      color: 'var(--gray-700)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      fontWeight: 500,
                    }}>{kpi.label}</span>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '4px 8px',
                      borderRadius: 999,
                      background: kpi.tagDir === 'up' ? 'rgba(0, 181, 214, 0.10)' : 'rgba(0, 181, 214, 0.10)',
                      color: '#00B5D6',
                      fontFamily: 'monospace',
                      whiteSpace: 'nowrap',
                    }}>{kpi.tag}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, lineHeight: 1 }}>
                    {kpi.pre && <span style={{ fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 300, color: 'var(--gray-900)' }}>{kpi.pre}</span>}
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(48px, 6vw, 72px)',
                      fontWeight: 300,
                      color: 'var(--gray-900)',
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                    }}>{kpi.big}</span>
                    <span style={{ fontSize: 'clamp(20px, 2.2vw, 26px)', fontWeight: 400, color: 'var(--gray-700)' }}>{kpi.unit}</span>
                    {kpi.plus && <span style={{ fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 300, color: '#00B5D6' }}>{kpi.plus}</span>}
                  </div>
                  <div style={{
                    paddingTop: 12,
                    borderTop: '1px solid var(--gray-200)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    flexWrap: 'wrap',
                  }}>
                    <span style={{ color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Industry</span>
                    <span style={{ color: 'var(--gray-700)', fontWeight: 600 }}>{kpi.industry}</span>
                    <span style={{ color: 'var(--gray-300)' }}>→</span>
                    <span style={{ color: '#00B5D6', fontWeight: 700 }}>{kpi.zeus}</span>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
            </MobileCarousel>
          </div>
        </div>

        <style>{`
          .zeus-kpi-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(0, 181, 214, 0.10);
            border-color: rgba(0, 181, 214, 0.30) !important;
          }
          @media (max-width: 900px) {
            .zeus-kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          /* On mobile MobileCarousel takes over: kill the grid so its
             one-slide-at-a-time layout has the full width to itself.
             Beats the 900px rule via source order + !important. */
          @media (max-width: 768px) {
            .zeus-kpi-grid {
              display: block !important;
              gap: 0 !important;
            }
          }
        `}</style>
      </section>

    </>
  )
}
