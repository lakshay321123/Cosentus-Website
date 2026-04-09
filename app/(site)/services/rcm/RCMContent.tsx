'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

const rcmSteps = [
  { agent: 'Harper', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} width={22} height={22}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>, title: 'Eligibility Verification', desc: 'Harper verifies insurance and benefits before every appointment, eliminating eligibility denials at the source.' },
  { agent: 'Olivia', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} width={22} height={22}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>, title: 'Prior Authorization', desc: 'Olivia tracks every open authorization, preventing procedural delays and timely filing lapses.' },
  { agent: 'Emily', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} width={22} height={22}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>, title: 'Pre-Service Collection', desc: 'Emily contacts patients 3–7 days before service with verified cost estimates. 30–40% higher collection rates.' },
  { agent: null, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} width={22} height={22}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>, title: 'Charge Capture & Coding', desc: 'AAPC-certified coders ensure accurate CPT selection, modifier application, and clinical documentation alignment.' },
  { agent: null, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} width={22} height={22}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'Claim Scrubbing & Submission', desc: 'Payer-specific edits applied before every submission. Clean claims. Fast payments.' },
  { agent: 'Michael', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} width={22} height={22}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>, title: 'Payment Reconciliation', desc: 'Michael investigates every payment against expected reimbursement, identifying underpayments before they age.' },
  { agent: 'Chris', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} width={22} height={22}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>, title: 'AR Follow-Up & Denials', desc: 'Chris contacts payers proactively. Human denial experts appeal with clinical rationale. 95%+ success.' },
  { agent: 'Cindy', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} width={22} height={22}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>, title: 'Patient Billing & Collections', desc: 'Cindy handles balances in 50+ languages with real-time payment processing and payment plan options.' },
  { agent: null, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} width={22} height={22}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>, title: 'Credentialing & Contracting', desc: 'Provider credentialing, re-credentialing, and contract analytics to protect reimbursement rates.' },
  { agent: null, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} width={22} height={22}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>, title: 'Reporting & Analytics', desc: 'Real-time dashboards by provider, payer, procedure, and denial category. Weekly reviews and QBRs included.' },
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
                    {step.icon}
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
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: step.agent ? '#00B5D6' : 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.agent ? 'white' : 'var(--gray-500)', flexShrink: 0 }}>{step.icon}</div>
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
