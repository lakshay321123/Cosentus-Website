'use client'
import Image from 'next/image'

import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

const rcmSteps = [
  { agent: 'Harper', icon: '/images/icons/3e.png', title: 'Eligibility Verification', desc: 'Harper verifies insurance and benefits before every appointment, eliminating eligibility denials at the source.' },
  { agent: 'Olivia', icon: '/images/icons/3b.png', title: 'Prior Authorization', desc: 'Olivia tracks every open authorization, preventing procedural delays and timely filing lapses.' },
  { agent: 'Emily', icon: '/images/icons/p3-3a.png', title: 'Pre-Service Collection', desc: 'Emily contacts patients 3–7 days before service with verified cost estimates. 30–40% higher collection rates.' },
  { agent: null, icon: '/images/icons/p3-3b.png', title: 'Charge Capture & Coding', desc: 'AAPC-certified coders ensure accurate CPT selection, modifier application, and clinical documentation alignment.' },
  { agent: null, icon: '/images/icons/p3-3c.png', title: 'Claim Scrubbing & Submission', desc: 'Payer-specific edits applied before every submission. Clean claims. Fast payments.' },
  { agent: 'Michael', icon: '/images/icons/p3-3a.png', title: 'Payment Reconciliation', desc: 'Michael investigates every payment against expected reimbursement, identifying underpayments before they age.' },
  { agent: 'Chris', icon: '/images/icons/p3-3c.png', title: 'AR Follow-Up & Denials', desc: 'Chris contacts payers proactively. Human denial experts appeal with clinical rationale. 95%+ success.' },
  { agent: 'Cindy', icon: '/images/icons/p3-3b.png', title: 'Patient Billing & Collections', desc: 'Cindy handles balances in 50+ languages with real-time payment processing and payment plan options.' },
  { agent: null, icon: '/images/icons/p3-3d.png', title: 'Credentialing & Contracting', desc: 'Provider credentialing, re-credentialing, and contract analytics to protect reimbursement rates.' },
  { agent: null, icon: '/images/icons/p3-3e.png', title: 'Reporting & Analytics', desc: 'Real-time dashboards by provider, payer, procedure, and denial category. Weekly reviews and QBRs included.' },
]

const keyResults = [
  { value: '>98%', label: 'Net Collection Rate' },
  { value: '>99%', label: 'Clean Claim Rate' },
  { value: '48hr', label: 'Charge Lag' },
  { value: '<15%', label: 'AR >90 Days' },
  { value: '30%', label: 'Revenue Growth (12mo)' },
]

export default function RCMContent() {
  return (
    <>
      {/* The Challenge */}
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div>
            <RevealOnScroll>
              <div className="section-label">THE CHALLENGE</div>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, color: 'var(--gray-900)', lineHeight: 1.3, marginBottom: 24, fontFamily: 'var(--font-display)' }}>
                Disconnected Revenue Cycles Leak Revenue
              </h2>
            </RevealOnScroll>
            <RevealOnScroll delay={0.2}>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--gray-600)' }}>
                Most practices manage their revenue cycle in disconnected pieces. Every handoff is a gap. Every gap is lost revenue. Comprehensive RCM eliminates those gaps with one accountable team, end-to-end.
              </p>
            </RevealOnScroll>
          </div>
          <RevealOnScroll delay={0.2}>
            <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', aspectRatio: '4/3' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Healthcare technology"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,181,214,0.15) 0%, transparent 60%)' }} />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* The 10-Step RCM Timeline */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">THE COMPLETE REVENUE CYCLE</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">10 Steps. One Team. Every Dollar.</div>
          </RevealOnScroll>

          <div className="services-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 48 }}>
            {rcmSteps.map((step, i) => (
              <RevealOnScroll key={i} delay={i * 0.06}>
                <div
                  style={{
                    display: 'flex', gap: 16, padding: 24,
                    background: 'var(--white)', borderRadius: 12,
                    border: '1px solid var(--gray-200)', alignItems: 'flex-start',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    height: '100%',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,181,214,0.1)'
                    e.currentTarget.style.borderColor = step.agent ? '#00B5D6' : 'var(--gray-300)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = 'var(--gray-200)'
                  }}
                >
                  {/* Step number with icon */}
                  <div style={{
                    flexShrink: 0, width: 44, height: 44, borderRadius: 10,
                    background: '#00B5D6',
                    color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Image src={step.icon} alt="" width={28} height={28} className="icon-teal" style={{ objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-400)' }}>{String(i + 1).padStart(2, '0')}</span>
                      <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-900)', margin: 0 }}>{step.title}</h4>
                    </div>
                    {step.agent && (
                      <span style={{ fontSize: 11, padding: '2px 8px', background: 'var(--primary-ghost)', borderRadius: 4, color: '#00B5D6', fontWeight: 500, display: 'inline-block', marginBottom: 6 }}>AI Agent: {step.agent}</span>
                    )}
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--gray-600)', margin: 0 }}>{step.desc}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          <div className="services-mobile" style={{ overflow: 'hidden', width: '100%', marginTop: 32 }}>
            <MobileCarousel autoScrollInterval={4000}>
              {rcmSteps.map((step, i) => (
                <div key={i} style={{ padding: 24, background: 'var(--white)', borderRadius: 12, border: '1px solid var(--gray-200)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: step.agent ? '#00B5D6' : 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.agent ? 'white' : 'var(--gray-500)', flexShrink: 0 }}><Image src={step.icon} alt="" width={28} height={28} className="icon-teal" style={{ objectFit: 'contain' }} /></div>
                    <div><h4 style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-900)', margin: 0 }}>{step.title}</h4>
                    {step.agent && <span style={{ fontSize: 11, color: '#00B5D6' }}>{step.agent}</span>}</div>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--gray-600)', margin: 0 }}>{step.desc}</p>
                </div>
              ))}
            </MobileCarousel>
          </div>
        </div>
      </section>

      {/* Key Results — interactive cards */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <RevealOnScroll>
            <div className="section-label">KEY RESULTS</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Measurable Outcomes</div>
          </RevealOnScroll>
          <div className="results-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginTop: 40 }}>
            {keyResults.map((r, i) => (
              <RevealOnScroll key={i} delay={i * 0.12}>
                <div
                  style={{
                    padding: '32px 16px', background: 'var(--white)', borderRadius: 12,
                    border: '1px solid var(--gray-200)',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)'
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,181,214,0.15)'
                    e.currentTarget.style.borderColor = '#00B5D6'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = 'var(--gray-200)'
                  }}
                >
                  <div style={{ fontSize: 'clamp(24px, 2.5vw, 36px)', fontWeight: 300, color: '#00B5D6', fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: 8 }}>{r.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.3 }}>{r.label}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          <div className="results-mobile" style={{ overflow: 'hidden', width: '100%', marginTop: 32 }}>
            <MobileCarousel autoScrollInterval={3000}>
              {keyResults.map((r, i) => (
                <div key={i} style={{ padding: '32px 16px', background: 'var(--white)', borderRadius: 12, border: '1px solid var(--gray-200)', textAlign: 'center' }}>
                  <div style={{ fontSize: 36, fontWeight: 300, color: '#00B5D6', lineHeight: 1, marginBottom: 8 }}>{r.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-500)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{r.label}</div>
                </div>
              ))}
            </MobileCarousel>
          </div>
        </div>
      </section>
    </>
  )
}
