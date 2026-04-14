'use client'

import { useState, useEffect, useCallback } from 'react'
import MotionReveal from '@/components/ui/MotionReveal'
import MobileCarousel from '@/components/ui/MobileCarousel'

const steps = [
  { num: '1', title: 'We learn your practice', desc: "Deep-dive into specialty workflows, payer mix, and denial patterns. We focus on your three P's — Processes, Procedures, and Protocols — and customize our approach to your specific challenges. No templates." },
  { num: '2', title: 'Named teams take over', desc: 'AAPC-certified coders, denials experts, and a client success manager run your account daily.' },
  { num: '3', title: 'AI agents handle volume', desc: 'Eight agents automate eligibility, prior auth follow-ups, scheduling, patient collection and claim follow-up.' },
  { num: '4', title: 'Humans handle judgment', desc: 'Complex coding, clinical validation, denial appeals and underpayment recovery remain with experienced specialists.' },
  { num: '5', title: 'You see everything', desc: "Real-time dashboards, weekly check-ins, monthly ops meetings, and quarterly business reviews ensure full transparency. We don't wait for problems to escalate — when we identify an issue, we perform root cause analysis and act immediately, before it impacts revenue or cash flow." },
]

const allAgents = [
  { name: 'Cindy', shortRole: 'Patient Support', role: 'Payment & Balance Specialist', type: 'patient', desc: 'Cindy is multilingual and can handle over 20 phone calls at once. She specializes in helping patients understand their outstanding balances and payment options with clear, empathetic assistance.', capabilities: ['Real time balance inquiries and payment history', 'Secure credit card payment processing', 'Balance breakdown by date of service', 'Insurance coverage explanations'], highlight: true },
  { name: 'Chris', shortRole: 'Claims Follow-Up', role: 'Insurance Claim Specialist', type: 'payer', desc: 'Chris conducts outbound claim status follow ups with insurance carriers. He resolves pending claims, escalates processing delays, and supports denial resolution with persistence.', capabilities: ['Claim status verification with carriers', 'Denial resolution and resubmission support', 'Timely filing tracking and alerts', 'Batch outbound calling to payers'] },
  { name: 'Emily', shortRole: 'Payment Solutions', role: 'Pre-Service Cost Estimates', type: 'patient', desc: 'Emily contacts patients 3 to 7 days before procedures with verified cost estimates. Pre service collection rates are 30 to 40% higher than post service.', capabilities: ['Anesthesia and procedure cost estimates', 'Provider specific payment structures', 'Pre service payment collection', 'Financial responsibility communication'] },
  { name: 'Sarah', shortRole: 'Appt. Scheduling', role: 'Medical Scheduling Specialist', type: 'patient', desc: 'Sarah reduces no shows and scheduling friction with inbound and outbound scheduling, confirmations, and follow ups. Available 24/7 for patient convenience.', capabilities: ['Inbound and outbound scheduling', 'Appointment confirmations and reminders', 'Rescheduling and waitlist management', 'Follow up appointment coordination'] },
  { name: 'Allison', shortRole: 'Customer Support', role: 'General Support & Overflow', type: 'patient', desc: 'Allison handles after hours support, routing, and overflow to guarantee no patient call goes unanswered. She ensures every caller reaches the right department.', capabilities: ['After hours patient support', 'Intelligent call routing', 'Message taking and follow up triggers', 'Overflow handling during peak hours'] },
  { name: 'Harper', shortRole: 'Eligibility Verification', role: 'Eligibility & Benefits Specialist', type: 'payer', desc: 'Harper verifies insurance eligibility, benefits, deductibles, and network status before every appointment. She eliminates eligibility denials at the source.', capabilities: ['Real time insurance verification', 'Benefits and deductible confirmation', 'Network status validation', 'Pre visit eligibility screening'] },
  { name: 'Olivia', shortRole: 'Prior Authorization', role: 'Prior Auth Tracking Specialist', type: 'payer', desc: 'Olivia tracks every open authorization, follows up on pending cases, and escalates urgent requests to prevent procedural delays and timely filing lapses.', capabilities: ['Authorization status tracking', 'Pending case follow up with payers', 'Urgency escalation protocols', 'OR schedule coordination'] },
  { name: 'Michael', shortRole: 'Payment Recovery', role: 'Payment Reconciliation Specialist', type: 'payer', desc: 'Michael investigates missing or underpayments, reconciles expected versus received amounts, and identifies discrepancies in EOBs and ERA files.', capabilities: ['Expected vs received payment analysis', 'Underpayment identification and recovery', 'EOB and ERA reconciliation', 'Contract rate variance detection'] },
]

export default function RAPageContent() {
  const [selectedAgent, setSelectedAgent] = useState<typeof allAgents[0] | null>(null)
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
  
  // Avatar gradient colors per agent
  const avatarColors: Record<string, string> = {
    Cindy: 'linear-gradient(135deg, #00B5D6, #36C2DE)',
    Chris: 'linear-gradient(135deg, #0084A0, #00B5D6)',
    Emily: 'linear-gradient(135deg, #36C2DE, #68D1E6)',
    Sarah: 'linear-gradient(135deg, #A1DEED, #68D1E6)',
    Allison: 'linear-gradient(135deg, #00B5D6, #0084A0)',
    Harper: 'linear-gradient(135deg, #68D1E6, #00B5D6)',
    Olivia: 'linear-gradient(135deg, #36C2DE, #0084A0)',
    Michael: 'linear-gradient(135deg, #0084A0, #36C2DE)',
  }
  return (
    <>
      {/* The 8 AI Voice Agents */}
      <section className="section">
        <div className="container">
          <MotionReveal>
            <div className="section-label">THE 8 AI VOICE AGENTS</div>
          </MotionReveal>
          {/* AI Agents Section */}

          {/* AI Agents Grid — cosentus.com style */}
          <div style={{ marginTop: 48 }}>
            <MotionReveal>
              <h2 style={{ fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 300, color: 'var(--gray-900)', textAlign: 'center', marginBottom: 8 }}>
                COSENTUS AI Agents
              </h2>
              <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: 15, marginBottom: 40, fontStyle: 'italic' }}>
                Click any agent to learn more
              </p>
            </MotionReveal>

            {/* Desktop */}
            <div className="agents-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {allAgents.map((agent, i) => (
                <MotionReveal key={i} delay={i * 0.08}>
                  <div
                    role="button" tabIndex={0} onClick={() => setSelectedAgent(agent)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedAgent(agent) }}
                    style={{ cursor: 'pointer', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--gray-200)', transition: 'all 0.3s ease', height: '100%' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
                  >
                    <div style={{ height: 240, background: '#f5f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <img src={`/images/${agent.name.toLowerCase()}.png`} alt={agent.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} />
                    </div>
                    <div style={{ background: '#00B5D6', padding: '14px 16px', textAlign: 'center' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{agent.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{agent.shortRole}</div>
                    </div>
                  </div>
                </MotionReveal>
              ))}
            </div>
            {/* Mobile */}
            <div className="agents-mobile">
              <MobileCarousel autoScrollInterval={3500}>
                {allAgents.map((agent, i) => (
                  <div
                    key={i}
                    role="button" tabIndex={0} onClick={() => setSelectedAgent(agent)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedAgent(agent) }}
                    style={{ cursor: 'pointer', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--gray-200)' }}
                  >
                    <div style={{ height: 280, background: '#f5f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <img src={`/images/${agent.name.toLowerCase()}.png`} alt={agent.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} />
                    </div>
                    <div style={{ background: '#00B5D6', padding: '14px 16px', textAlign: 'center' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{agent.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{agent.shortRole}</div>
                    </div>
                  </div>
                ))}
              </MobileCarousel>
            </div>
          </div>

          {/* Agent Detail Modal */}
          {selectedAgent && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', padding: 20 }} onClick={() => setSelectedAgent(null)}>
              <div style={{ background: 'white', borderRadius: 16, border: '2px solid #00B5D6', maxWidth: 600, width: '100%', overflow: 'hidden', position: 'relative' }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelectedAgent(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'var(--gray-100)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, zIndex: 1 }}>✕</button>
                <div style={{ padding: '32px 32px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '3px solid #00B5D6' }}>
                    <img src={`/images/${selectedAgent.name.toLowerCase()}.png`} alt={selectedAgent.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 24, fontWeight: 500, color: 'var(--gray-900)', margin: 0 }}>{selectedAgent.name}</h3>
                    <p style={{ fontSize: 14, color: 'var(--gray-500)', margin: 0 }}>{selectedAgent.role}</p>
                    <div style={{ width: 40, height: 3, background: '#00B5D6', borderRadius: 2, marginTop: 8 }} />
                  </div>
                </div>
                <div style={{ padding: '0 32px 24px' }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--gray-700)' }}>{selectedAgent.desc}</p>
                </div>
                <div style={{ padding: '0 32px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {selectedAgent.capabilities.map((cap, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--gray-600)' }}>
                      <div style={{ width: 3, minHeight: 16, background: '#00B5D6', borderRadius: 2, flexShrink: 0 }} />
                      {cap}
                    </div>
                  ))}
                </div>
                <div style={{ padding: '16px 32px 24px', display: 'flex', justifyContent: 'center' }}>
                  <button style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Begin Conversation</button>
                </div>
              </div>
            </div>
          )}
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

            <MotionReveal direction="left">
              <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#616161" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                THE PROBLEM
              </div>
            </MotionReveal>

            <MotionReveal direction="left" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginBottom: 24 }}>
                Why Specialty Practices Deserve Better
              </h2>
            </MotionReveal>

            <MotionReveal direction="left" delay={0.2}>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', maxWidth: 480, marginBottom: 32 }}>
                Traditional RCM adds headcount. AI startups remove it. Neither understands the nuances of specialty revenue cycles.
              </p>
            </MotionReveal>

            {/* Animated bullet points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Generic billing teams miss specialty nuances',
                'AI-only solutions lack clinical judgment',
                'Revenue leaks at every handoff',
              ].map((item, i) => (
                <MotionReveal key={i} direction="left" delay={0.3 + i * 0.12}>
                  <div className="ps-bullet" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="ps-bullet-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gray-400)', flexShrink: 0, transition: 'all 0.4s ease' }} />
                    <span style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                </MotionReveal>
              ))}
            </div>
          </div>

          {/* Right — The Solution */}
          <div className="ps-panel ps-solution" style={{ padding: 'clamp(56px, 6vw, 88px) clamp(40px, 5vw, 88px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#00B5D6', position: 'relative', overflow: 'hidden' }}>
            {/* Animated shimmer overlay */}
            <div className="ps-shimmer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

            <MotionReveal direction="right">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                THE SOLUTION
              </div>
            </MotionReveal>

            <MotionReveal direction="right" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'white', marginBottom: 24 }}>
                Real + Artificial Intelligence
              </h2>
            </MotionReveal>

            <MotionReveal direction="right" delay={0.2}>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,0.9)', maxWidth: 480, marginBottom: 32 }}>
                Named human teams for judgment. AI agents for volume. 25 years of specialty expertise no one can replicate.
              </p>
            </MotionReveal>

            {/* Animated solution points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Specialty-trained teams for every payer nuance',
                '8 AI agents automating volume workflows',
                'Up to 30% revenue growth within 12 months',
              ].map((item, i) => (
                <MotionReveal key={i} direction="right" delay={0.3 + i * 0.12}>
                  <div className="ps-bullet-light" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="ps-check" style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.4s ease' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                </MotionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* How R+A Works — Interactive 5-Step Timeline */}
      <section className="section section-alt" style={{ overflow: 'hidden' }} onMouseEnter={() => setStepPaused(true)} onMouseLeave={() => setStepPaused(false)}>
        <div className="container">
          <MotionReveal>
            <div className="section-label">HOW R+A WORKS</div>
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <div className="section-title">The 5-Step Process</div>
          </MotionReveal>

          <MotionReveal delay={0.25}>
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
          </MotionReveal>
        </div>
      </section>


    </>
  )
}
