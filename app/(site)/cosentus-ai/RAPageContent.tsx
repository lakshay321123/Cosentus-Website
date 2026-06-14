'use client'

import { useState, useEffect } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'
import VoiceCallModal, { type VoiceAgent } from '@/components/voice/VoiceCallModal'
import ProblemSolutionSection from '@/components/sections/ProblemSolutionSection'
import TeamCircleGrid from '@/components/ui/TeamCircleGrid'
import ScrollHeroSection from '@/components/sections/ScrollHeroSection'
import ZeusEhrSpiral from '@/components/sections/ZeusEhrSpiral'
import { AGENTS } from '@/data/voice-agents'

const steps = [
  { num: '1', title: 'We learn your practice', desc: "Deep-dive into specialty workflows, payer mix, and denial patterns. We focus on your three P's, Processes, Procedures, and Protocols, and customize our approach to your specific challenges. No templates." },
  { num: '2', title: 'Named teams take over', desc: 'AAPC-certified coders, denials experts, and a client success manager run your account daily.' },
  { num: '3', title: 'AI agents handle volume', desc: 'Nine AI agents work the repetitive load around the clock: eligibility, prior auth follow-ups, scheduling, patient collections, claim follow-up, AR tracking, and coding support.' },
  { num: '4', title: 'Humans handle judgment', desc: 'Complex coding, clinical validation, denial appeals and underpayment recovery remain with experienced specialists.' },
  { num: '5', title: 'You see everything', desc: "Real-time dashboards, weekly check-ins, monthly ops meetings, and quarterly business reviews ensure full transparency. We don't wait for problems to escalate, when we identify an issue, we perform root cause analysis and act immediately, before it impacts revenue or cash flow." },
]

/**
 * Zeus AI leadership — the named humans behind the platform.
 *
 * Photos: Allen, Ajay, Steven, and Lakshay have headshots; we re-use
 * Allen + Ajay's from /about and Steven's from Behavioral Health.
 * Alex has no photo yet — TeamCircleGrid falls back to teal initials
 * in an empty circle until a headshot is supplied.
 * Casey Kaczmarowski removed per user (Jun 2026).
 *
 * No `bio` field is provided yet, so the cards render non-interactive
 * (TeamCircleGrid only adds the click+modal affordance when both
 * `onPersonClick` is wired and the people have bios).
 */
const zeusTeam = [
  { name: 'Allen Ranjan',          title: 'Strategic Advisor, Zeus AI',  photo: '/images/ALLEN RANJAN.jpg' },
  { name: 'Ajay Kumar',            title: 'AI Security & Compliance',    photo: '/images/AJAY KUMAR.jpg' },
  { name: 'Alexander Kashkarian',  title: 'AI Voice & Research' },
  { name: 'Lakshay Mehra',         title: 'AI Architect & Engineering Lead', photo: '/images/Lakshay-Mehra.jpg' },
  { name: 'Steven Sundrud',        title: 'DevOps & Release Engineering', photo: '/images/Steven-Symed.webp' },
  { name: 'Shaleen Chordia',       title: 'AI Development & Research',    photo: '/images/Shaleen-Chordia.jpg' },
]

export default function RAPageContent() {
  const [activeAgent, setActiveAgent] = useState<VoiceAgent | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [stepPaused, setStepPaused] = useState(false)
  // Explicit pause via the pause/play button between the step arrows.
  // Separate from stepPaused (the hover-pause): if the button shared
  // stepPaused, every mouse-leave of the section would silently
  // un-pause what the user explicitly paused.
  const [stepUserPaused, setStepUserPaused] = useState(false)

  // Auto-advance steps every 3 seconds (was 5s, per user Jun 2026),
  // loop back to 1. Paused while hovering OR while explicitly paused
  // via the button.
  useEffect(() => {
    if (stepPaused || stepUserPaused) return
    const timer = setInterval(() => {
      setActiveStep(prev => (prev >= steps.length - 1 ? 0 : prev + 1))
    }, 3000)
    return () => clearInterval(timer)
  }, [stepPaused, stepUserPaused, activeStep])

  return (
    <>
      {/* Voice call modal, opens when an agent is clicked. Same component
          used on the homepage for consistency. */}
      {activeAgent && (
        <VoiceCallModal agent={activeAgent} onClose={() => setActiveAgent(null)} />
      )}

      {/* WHY ZEUS — 23 Modules / 15 AI Features / 45+ Specialties.
          New section per Zeus design prototype. Sits between PageHero (parent)
          and the existing voice agents grid.

          The "Not bolted on." heading + paragraph were removed per user
          (Jun 2026) since that copy moved to the page hero subtitle; the
          three stats below (23 / 15 / 45+) stay. Heading + paragraph are
          commented out (not deleted) just below for easy restore. */}
      <section className="section section-alt" style={{ overflow: 'hidden' }}>
        <div className="container">
          {/* Heading + paragraph removed per user (Jun 2026) - copy moved
              to the page hero subtitle. Kept commented for easy restore. */}
          {/*
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
              Not <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>bolted on.</span>
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
              Cosentus was built around AI from day one. That means every module shares context with every other module — eligibility errors inform coding rules, denial patterns retrain claim scrubbing, payer behavior updates A/R follow-up. Most platforms can&rsquo;t do that because their AI was added later.
            </p>
          </RevealOnScroll>
          */}

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
                    // Matches the homepage RA section stat (.ra-stat-num)
                    // per user (Jun 2026): same clamp, weight 700,
                    // -0.02em. Was clamp(56px, 7vw, 88px) / 300 / -0.03em.
                    fontSize: 'clamp(44px, 5.5vw, 68px)',
                    fontWeight: 700,
                    lineHeight: 1,
                    color: '#00B5D6',
                    letterSpacing: '-0.02em',
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

      {/* Real + AI workflow animation (scroll-expand). Shown here per user
          request (Jun 2026); it is the same animation currently commented
          out on the home page. Sits directly above the Voice AI section. */}
      {/* startExpanded: full-screen on load, no zoom, per user (Jun 2026) */}
      <ScrollHeroSection startExpanded />

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

            {/* Mirrors the homepage RA section layout: on desktop (>1100px)
                5 agents across with the remaining 4 centered below (flex);
                reverts to a 3-column grid at <=1100px, with circles shrinking
                and gaps tightening at <=700 / <=420 breakpoints. */}
            <div className="ra-tech-agents-grid" style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '36px 16px',
              maxWidth: 1080,
              margin: '0 auto',
              width: '100%',
            }}>
              {AGENTS.map((agent, i) => (
                <RevealOnScroll key={agent.name} delay={i * 0.06} className="ra-tech-agent">
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
                      width: '100%',
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
            /* Desktop (>1100px): 5 agents across with the remaining 4
               centered below, matching the homepage RA section. The flex
               container is set inline on .ra-tech-agents-grid; each agent's
               RevealOnScroll wrapper carries .ra-tech-agent for the basis
               (66px = 4 column gaps of 16px + 2px rounding safety). */
            .ra-tech-agent { flex: 0 0 calc((100% - 66px) / 5); }

            /* Tablet (<=1100px): revert to the homepage 3-column grid.
               !important overrides the inline flex base on the container;
               agents drop their flex basis so the grid columns size them. */
            @media (max-width: 1100px) {
              .ra-tech-agents-grid {
                display: grid !important;
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 28px 36px !important;
                max-width: 640px !important;
              }
              .ra-tech-agent { flex: none !important; }
              .ra-tech-agents-grid .ra-tech-agent-circle {
                width: 110px !important;
                height: 110px !important;
              }
            }
            @media (max-width: 700px) {
              .ra-tech-agents-grid {
                gap: 22px 10px !important;
              }
              .ra-tech-agents-grid .ra-tech-agent-circle {
                width: 96px !important;
                height: 96px !important;
              }
              .ra-tech-agents-grid .ra-tech-agent-role {
                font-size: 14px !important;
              }
            }
            @media (max-width: 420px) {
              .ra-tech-agents-grid {
                gap: 18px 8px !important;
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
        className="ps-zeus-sizing"
        problemTitle="Why Specialty Practices Deserve Better"
        problemBody="Traditional RCM adds headcount. AI startups remove it. Neither understands the nuances of specialty revenue cycles."
        problemBullets={[
          'Generic billing teams miss specialty nuances',
          'AI-only solutions lack clinical judgment',
          'Revenue leaks at every handoff',
        ]}
        solutionTitle="Real People + AI"
        solutionBody="Named human teams for judgment. AI agents for volume. 25 years of specialty expertise no one can replicate."
        solutionBullets={[
          'Specialty coders and denial experts who know your payers',
          'Nine AI agents working every claim, around the clock',
          'Up to 30% more revenue in your first year',
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
                  {/* Pause/play toggle between the arrows, per user
                      (Jun 2026). Controls stepUserPaused only — the
                      hover-pause stays independent. */}
                  <button
                    onClick={() => setStepUserPaused(p => !p)}
                    aria-label={stepUserPaused ? 'Resume auto-advance' : 'Pause auto-advance'}
                    style={{
                      width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--gray-200)',
                      background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {stepUserPaused ? (
                      /* Play triangle — shown while paused */
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--gray-600)" stroke="none"><path d="M8 5v14l11-7z"/></svg>
                    ) : (
                      /* Pause bars — shown while auto-advancing */
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--gray-600)" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
                    )}
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

      {/* PlatformModulesSection (23 Modules. One Intelligent Core.)
          removed per user (Jun 2026). Component kept in the repo for
          potential reuse. */}

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

            {/* Right — spiral vortex + Zeus logo + EHR labels.
                Replaced the orbit + lightning SVG per user (Jun 2026):
                the supplied spiral animation plays (gated on viewport
                entry), the Zeus logo fades in at center (where the
                source demo had its Enter button) and the six EHR names
                fade in around it while the swirl forms. */}
            <RevealOnScroll direction="right" delay={0.2}>
              <div className="zeus-ehr-orbit">
                <ZeusEhrSpiral />
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
                    {/* Big number matches homepage .ra-stat-num per user
                        (Jun 2026): clamp(44-68), 700, #00B5D6, -0.02em.
                        Was clamp(48-72) / 300 / gray-900. pre/unit/plus
                        keep their smaller relative sizes but follow the
                        cyan + weight so the numeral reads as one unit. */}
                    {kpi.pre && <span style={{ fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 700, color: '#00B5D6' }}>{kpi.pre}</span>}
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(44px, 5.5vw, 68px)',
                      fontWeight: 700,
                      color: '#00B5D6',
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                    }}>{kpi.big}</span>
                    <span style={{ fontSize: 'clamp(20px, 2.2vw, 26px)', fontWeight: 600, color: '#00B5D6' }}>{kpi.unit}</span>
                    {kpi.plus && <span style={{ fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 700, color: '#00B5D6' }}>{kpi.plus}</span>}
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

      {/* ──────────────── ZEUS LEADERSHIP ──────────────── */}
      {/* The named humans behind the platform. Cards render with teal-initial
          circles where photos aren't yet supplied — TeamCircleGrid handles
          the missing-photo case via its built-in initials fallback. Cards
          are non-interactive (no bio modal) because we don't have bios for
          this team yet. */}
      <section className="section section-alt" style={{ overflow: 'hidden' }}>
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">The People Behind Zeus</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p style={{
              fontSize: 16,
              color: 'var(--gray-700)',
              lineHeight: 1.7,
              maxWidth: 640,
              marginTop: 12,
              marginBottom: 8,
            }}>
              The engineers, researchers, and revenue cycle specialists who decide what Zeus is allowed to do.
            </p>
          </RevealOnScroll>
          <div style={{ marginTop: 32 }}>
            <TeamCircleGrid people={zeusTeam} desktopColumns={3} />
          </div>
        </div>
      </section>

    </>
  )
}
