'use client'

import { useState } from 'react'
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
          <RevealOnScroll>
            <div className="section-label">THE 8 AI VOICE AGENTS</div>
          </RevealOnScroll>
          {/* AI Agents Section */}

          {/* AI Agents Grid — cosentus.com style */}
          <div style={{ marginTop: 48 }}>
            <RevealOnScroll>
              <h2 style={{ fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 300, color: 'var(--gray-900)', textAlign: 'center', marginBottom: 8 }}>
                COSENTUS AI Agents
              </h2>
              <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: 15, marginBottom: 40, fontStyle: 'italic' }}>
                Click any agent to learn more
              </p>
            </RevealOnScroll>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {allAgents.map((agent, i) => (
                <RevealOnScroll key={i} delay={i * 0.08}>
                  <div
                    onClick={() => setSelectedAgent(agent)}
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
                </RevealOnScroll>
              ))}
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
