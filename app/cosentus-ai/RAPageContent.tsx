'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'

const problem = {
  title: 'The Problem',
  desc: "Traditional RCM scales by adding people. AI startups try to replace them. Both fail specialty practices. R+A fills the gap.",
}

const steps = [
  { num: '1', title: 'We learn your practice', desc: "Deep-dive into specialty workflows, payer mix, and denial patterns. We focus on your three P's — Processes, Procedures, and Protocols — and customize our approach to your specific challenges. No templates." },
  { num: '2', title: 'Named teams take over', desc: 'AAPC-certified coders, denials experts, and a client success manager run your account daily.' },
  { num: '3', title: 'AI agents handle volume', desc: 'Eight agents automate eligibility, prior auth follow-ups, scheduling, patient collection and claim follow-up.' },
  { num: '4', title: 'Humans handle judgment', desc: 'Complex coding, clinical validation, denial appeals and underpayment recovery remain with experienced specialists.' },
  { num: '5', title: 'You see everything', desc: "Real-time dashboards, weekly check-ins, monthly ops meetings, and quarterly business reviews ensure full transparency. We don't wait for problems to escalate — when we identify an issue, we perform root cause analysis and act immediately, before it impacts revenue or cash flow." },
]

const preServiceAgents = [
  { name: 'Harper', role: 'Eligibility & Benefits Verification', desc: 'Eliminates eligibility denials by verifying coverage before appointments.' },
  { name: 'Olivia', role: 'Prior Authorization Follow-Up', desc: 'Tracks and closes pending authorizations to prevent authorization-related denials and OR delays.' },
  { name: 'Emily', role: 'Pre-Service Payment Collection', desc: 'Contacts patients 3–7 days prior with verified cost estimates. Industry data shows pre-service collection rates are 30–40% higher than post-service.' },
  { name: 'Sarah', role: 'Medical Scheduling', desc: 'Reduces no-shows and scheduling friction with inbound/outbound scheduling and confirmations.' },
]

const postServiceAgents = [
  { name: 'Chris', role: 'Claim Follow-Up', desc: 'Proactively contacts payers to resolve pending claims and processing delays.' },
  { name: 'Michael', role: 'Payment Reconciliation', desc: 'Investigates missing or underpayments, reconciles expected versus received payments.' },
  { name: 'Cindy', role: 'Patient Payment & Collections', desc: 'Multilingual patient balance collection (50+ languages), offers payment plans, and processes payments in real time. As employer-sponsored plans shift more responsibility to patients, patient AR is skyrocketing — Cindy tackles this directly at scale.', highlight: true },
  { name: 'Allison', role: 'Customer Service & Overflow', desc: 'After-hours support and overflow to guarantee no patient call goes unanswered.' },
]

export default function RAPageContent() {
  return (
    <>
      {/* The Problem */}
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <RevealOnScroll>
            <div className="section-label">THE PROBLEM</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">{problem.title}</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="section-desc" style={{ maxWidth: '100%', fontSize: 20, lineHeight: 1.8, fontWeight: 400 }}>
              {problem.desc}
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* How R+A Works — 5-Step Process */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">HOW R+A WORKS</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">The 5-Step Process</div>
          </RevealOnScroll>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 48, maxWidth: 800 }}>
            {steps.map((step, i) => (
              <RevealOnScroll key={i}>
                <div style={{
                  display: 'flex',
                  gap: 24,
                  padding: 32,
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-200)',
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    flexShrink: 0,
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 600,
                  }}>{step.num}</div>
                  <div>
                    <h4 style={{ fontSize: 18, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 8 }}>{step.title}</h4>
                    <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--gray-600)' }}>{step.desc}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* The 8 AI Voice Agents */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">THE 8 AI VOICE AGENTS</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Meet the Agents</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="section-desc">
              Each agent automates a specific high-volume workflow. Automation handles volume; human specialists handle judgment.
              Every interaction surfaces to your dashboard — no automation runs in a silo.
            </p>
          </RevealOnScroll>

          {/* Pre-Service */}
          <div style={{ marginTop: 48 }}>
            <RevealOnScroll>
              <h3 style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 24,
              }}>Pre-Service</h3>
            </RevealOnScroll>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              {preServiceAgents.map((agent, i) => (
                <RevealOnScroll key={i}>
                  <div style={{
                    padding: 28,
                    background: 'var(--primary-ghost)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--gray-200)',
                    height: '100%',
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--primary)', marginBottom: 4 }}>{agent.name}</div>
                    <div style={{ fontSize: 13, fontWeight: 400, color: 'var(--gray-600)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{agent.role}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--gray-700)' }}>{agent.desc}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          {/* Post-Service */}
          <div style={{ marginTop: 48 }}>
            <RevealOnScroll>
              <h3 style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 24,
              }}>Post-Service</h3>
            </RevealOnScroll>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              {postServiceAgents.map((agent, i) => (
                <RevealOnScroll key={i}>
                  <div style={{
                    padding: 28,
                    background: agent.highlight ? 'var(--primary)' : 'var(--primary-ghost)',
                    borderRadius: 'var(--radius-md)',
                    border: agent.highlight ? '1px solid var(--primary)' : '1px solid var(--gray-200)',
                    height: '100%',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 22, fontWeight: 500, color: agent.highlight ? 'white' : 'var(--primary)' }}>{agent.name}</span>
                      {agent.highlight && <span style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(255,255,255,0.2)', borderRadius: 'var(--radius-sm)', color: 'white', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>High Impact</span>}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 400, color: agent.highlight ? 'rgba(255,255,255,0.7)' : 'var(--gray-600)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{agent.role}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: agent.highlight ? 'rgba(255,255,255,0.9)' : 'var(--gray-700)' }}>{agent.desc}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why R+A Can't Be Replicated */}
      <section className="section section-alt">
        <div className="container" style={{ maxWidth: 800 }}>
          <RevealOnScroll>
            <div className="section-label">THE MOAT</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Why R+A Can&apos;t Be Replicated</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="section-desc" style={{ maxWidth: '100%', fontSize: 17, lineHeight: 1.8 }}>
              Built from 25 years of specialty practice expertise, clinical knowledge, and leadership talent.
              Our founding team has stayed together for over two decades. Competitors can build agents or hire coders.
              No one can replicate what takes 25 years to build.
            </p>
          </RevealOnScroll>
        </div>
      </section>
    </>
  )
}
