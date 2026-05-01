'use client'

import { useState, useEffect } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'
import PlatformModulesSection from './PlatformModulesSection'
import VoiceCallModal, { type VoiceAgent } from '@/components/voice/VoiceCallModal'
import { AGENTS } from '@/data/voice-agents'

const steps = [
  { num: '1', title: 'We learn your practice', desc: "Deep-dive into specialty workflows, payer mix, and denial patterns. We focus on your three P's — Processes, Procedures, and Protocols — and customize our approach to your specific challenges. No templates." },
  { num: '2', title: 'Named teams take over', desc: 'AAPC-certified coders, denials experts, and a client success manager run your account daily.' },
  { num: '3', title: 'AI agents handle volume', desc: 'Nine agents automate eligibility, prior auth follow-ups, scheduling, patient collection, claim follow-up, AR tracking, and coding support.' },
  { num: '4', title: 'Humans handle judgment', desc: 'Complex coding, clinical validation, denial appeals and underpayment recovery remain with experienced specialists.' },
  { num: '5', title: 'You see everything', desc: "Real-time dashboards, weekly check-ins, monthly ops meetings, and quarterly business reviews ensure full transparency. We don't wait for problems to escalate — when we identify an issue, we perform root cause analysis and act immediately, before it impacts revenue or cash flow." },
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
      {/* Voice call modal — opens when an agent is clicked. Same component
          used on the homepage for consistency. */}
      {activeAgent && (
        <VoiceCallModal agent={activeAgent} onClose={() => setActiveAgent(null)} />
      )}

      {/* The 9 AI Voice Agents */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">THE 9 AI VOICE AGENTS</div>
          </RevealOnScroll>

          {/* AI Agents Grid — circular avatars matching homepage R+A section.
              Click any agent → opens VoiceCallModal for a real Retell voice call. */}
          <div style={{ marginTop: 48 }}>
            <RevealOnScroll>
              <h2 style={{ fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 300, color: 'var(--gray-900)', textAlign: 'center', marginBottom: 8 }}>
                COSENTUS AI Agents
              </h2>
              <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: 15, marginBottom: 40, fontStyle: 'italic' }}>
                Click any agent to start a conversation
              </p>
            </RevealOnScroll>

            {/* Desktop — 5-col first row + 4-col second row not possible with simple grid;
                use 5 columns, second row centers with col-start hack. Cleaner: 3-col grid
                like homepage. With 9 agents in 3 columns we get 3 even rows. */}
            <div className="agents-desktop ra-tech-agents-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '40px 24px',
              maxWidth: 1100,
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
                    {/* Name — bold, matches homepage style */}
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
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 13,
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

            {/* Mobile — carousel of circular cards */}
            <div className="agents-mobile">
              <MobileCarousel autoScrollInterval={3500}>
                {AGENTS.map((agent) => (
                  <div
                    key={agent.name}
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
                      padding: '20px 8px',
                      outline: 'none',
                    }}
                  >
                    <div style={{
                      width: 140,
                      height: 140,
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
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--gray-900)',
                      letterSpacing: '0.01em',
                    }}>
                      {agent.name}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--gray-700)',
                      marginTop: 4,
                    }}>
                      {agent.shortRole}
                    </div>
                  </div>
                ))}
              </MobileCarousel>
            </div>
          </div>

          {/* Responsive: 5 cols → 3 cols on mid-screens, mobile uses carousel via .agents-mobile */}
          <style>{`
            @media (max-width: 1024px) {
              .ra-tech-agents-grid {
                grid-template-columns: repeat(3, 1fr) !important;
                max-width: 720px !important;
              }
            }
            @media (max-width: 700px) {
              .ra-tech-agents-grid .ra-tech-agent-circle {
                width: 110px !important;
                height: 110px !important;
              }
            }
          `}</style>
        </div>
      </section>


      {/* Problem + Solution — Animated Split Section */}
      <section style={{ overflow: 'hidden' }}>
        <div className="problem-solution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 480 }}>
          {/* Left — The Problem */}
          <div className="ps-panel ps-problem" style={{ padding: 'clamp(56px, 6vw, 88px) clamp(40px, 5vw, 88px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--white)', position: 'relative' }}>
            {/* Decorative corner accent */}
            <div className="ps-corner-accent" style={{ position: 'absolute', top: 0, left: 0, width: 80, height: 80, opacity: 0.06 }}>
              <svg viewBox="0 0 80 80" fill="none"><path d="M0 0h80v80" stroke="#616161" strokeWidth="1" /></svg>
            </div>

            <RevealOnScroll direction="left">
              <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#616161" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                THE PROBLEM
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="left" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginBottom: 24 }}>
                Why Specialty Practices Deserve Better
              </h2>
            </RevealOnScroll>

            <RevealOnScroll direction="left" delay={0.2}>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', maxWidth: 480, marginBottom: 32 }}>
                Traditional RCM adds headcount. AI startups remove it. Neither understands the nuances of specialty revenue cycles.
              </p>
            </RevealOnScroll>

            {/* Animated bullet points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Generic billing teams miss specialty nuances',
                'AI-only solutions lack clinical judgment',
                'Revenue leaks at every handoff',
              ].map((item, i) => (
                <RevealOnScroll key={i} direction="left" delay={0.3 + i * 0.12}>
                  <div className="ps-bullet" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="ps-bullet-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gray-400)', flexShrink: 0, transition: 'all 0.4s ease' }} />
                    <span style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          {/* Right — The Solution */}
          <div className="ps-panel ps-solution" style={{ padding: 'clamp(56px, 6vw, 88px) clamp(40px, 5vw, 88px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#00B5D6', position: 'relative', overflow: 'hidden' }}>
            {/* Animated shimmer overlay */}
            <div className="ps-shimmer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

            <RevealOnScroll direction="right">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                THE SOLUTION
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="right" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'white', marginBottom: 24 }}>
                Real + Artificial Intelligence
              </h2>
            </RevealOnScroll>

            <RevealOnScroll direction="right" delay={0.2}>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,0.9)', maxWidth: 480, marginBottom: 32 }}>
                Named human teams for judgment. AI agents for volume. 25 years of specialty expertise no one can replicate.
              </p>
            </RevealOnScroll>

            {/* Animated solution points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Specialty-trained teams for every payer nuance',
                '8 AI agents automating volume workflows',
                'Up to 30% revenue growth within 12 months',
              ].map((item, i) => (
                <RevealOnScroll key={i} direction="right" delay={0.3 + i * 0.12}>
                  <div className="ps-bullet-light" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="ps-check" style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.4s ease' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* How R+A Works — Interactive 5-Step Timeline */}
      <section className="section section-alt" style={{ overflow: 'hidden' }} onMouseEnter={() => setStepPaused(true)} onMouseLeave={() => setStepPaused(false)}>
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">HOW R+A WORKS</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">The 5-Step Process</div>
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

    </>
  )
}
