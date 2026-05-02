'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'
import AgentSpotlightCard from '@/components/voice/AgentSpotlightCard'

const advantages = [
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, t: 'Real + Artificial Intelligence', d: 'Human expertise and AI purpose-built for anesthesia revenue cycle management.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, t: 'Anesthesia Expertise', d: 'Built for time units, modifiers, concurrency, and implant capture.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>, t: 'Boutique Support', d: 'White-glove service with named teams and zero handoffs.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>, t: 'Privately Owned', d: 'No PE churn, no shortcuts, just long-term partnership.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>, t: 'Outcome Focused', d: 'Revenue growth and operational control, not vanity metrics.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>, t: 'Clarity Driven', d: 'AI-powered portal and real-time insights with Clarity Stack\u2122.' },
]

const leaders = [
  { name: 'Logan Lowry', role: 'President', photo: '/images/LOGAN LOWRY.jpg' },
  { name: 'Mark Wines', role: 'Chief Growth Officer', photo: '/images/MARK WINES.jpg' },
  { name: 'JR Thompson', role: 'Sr. VP Chief Operating Officer', photo: '/images/JR THOMPSON.jpg' },
  { name: 'Joseph Demory', role: 'Director Anesthesia Services', photo: '/images/JOSEPH DEMORY.jpg' },
  { name: 'Laurie Allen', role: 'VP Anesthesia Operations', photo: '/images/Laurie Allen.jpg' },
  { name: 'Melissa George', role: 'Sr. RCM Manager', photo: '/images/Melissa George.jpg' },
  { name: 'Evan Sewell', role: 'Director RCM', photo: '/images/Evan Sewell.jpg' },
  { name: 'Liz Hussey', role: 'Credentialing Manager', photo: '/images/Liz Hussey.jpg' },
  { name: 'Maisie Villegas', role: 'Director Quality Improvement', photo: '/images/Maicie.jpg' },
  { name: 'Thomas Wilson', role: 'Regional Director- Anesthesia Services', photo: '/images/Tom Wilson1.jpg' },
]

const testimonials = [
  {
    quote: 'What separates Accreda from other anesthesia billing companies is its dedication to collecting every dollar possible for your business. Their year-over-year collection rate of 97% from commercial and non-commercial payors is staggering and has been vital for our group\u2019s survival. I can wholeheartedly recommend Accreda to help with the anesthesia billing for your practice.',
    name: 'Dr. John B. Field Jr.',
    role: 'Vice President, Anesthesia Associates',
  },
  {
    quote: 'The Accreda team is always available and proactively communicates with me. They do a great job of ensuring there are hands on each claim that falls short of appropriate payment. The entire process is extremely efficient and effective. I feel they have done an amazing job.',
    name: 'Randy Robbins, M.D.',
    role: 'Anesthesia Group Practice Administrator',
  },
]

const solutions = [
  { t: 'Engagement & Experience', d: 'White-glove onboarding and consistent communication.' },
  { t: 'Reporting & Analytics', d: 'Real-time dashboards, trend analysis, and weekly reviews.' },
  { t: 'Practice Management & Consulting', d: 'Operational guidance to increase throughput and profit.' },
  { t: 'Credentialing & Contracting', d: 'Credentialing support and contract analytics to capture appropriate reimbursement.' },
  { t: 'Data Capture & Reconciliation', d: '100% case capture and reconciliation with OR and facility records.' },
  { t: 'Coding & CDI', d: 'AAPC-certified coders and clinical documentation improvement.' },
  { t: 'Scrub & Submit', d: 'Payer-specific edits and claims submission for clean claims.' },
  { t: 'Denials & Underpayment Recovery', d: 'Rapid appeals supported by clinical rationale and documented strategies.' },
]

export default function AnesthesiaContent() {
  return (
    <>
      {/* Why Accreda Exists, Split impact section */}
      <section style={{ overflow: 'hidden' }}>
        <div className="problem-solution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 400 }}>
          <div className="ps-panel ps-problem" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--white)', position: 'relative' }}>
            <RevealOnScroll direction="left">
              <div className="section-label">WHY ACCREDA EXISTS</div>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginBottom: 20 }}>
                Generic RCM Teams Miss Details That Cost Thousands Per Case
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.2}>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', maxWidth: 500 }}>
                Base units, time-unit accuracy, medical direction modifiers, concurrency rules, and implant pass-throughs are exactly where generic teams get anesthesia billing wrong.
              </p>
            </RevealOnScroll>
          </div>

          <div className="ps-panel ps-solution" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#00B5D6', position: 'relative', overflow: 'hidden' }}>
            <div className="ps-shimmer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            <RevealOnScroll direction="right">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: 16 }}>THE ACCREDA DIFFERENCE</div>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'white', marginBottom: 20 }}>
                Anesthesia-Exclusive. Specialty-Obsessed.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,0.9)', maxWidth: 500 }}>
                Accreda is our anesthesia-exclusive division with the specialty focus your group needs. Every coder, every process, and every workflow is built for anesthesia and nothing else.
              </p>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.3}>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.85)', maxWidth: 500, marginTop: 20 }}>
                Not just denial recovery, denial prevention. We perform root cause analysis on every denied claim to stop future denials before they happen. Your denial rate improves every quarter.
              </p>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.4}>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.85)', maxWidth: 500, marginTop: 16, fontStyle: 'italic' }}>
                Our anesthesia team wakes up doing anesthesia and goes to bed doing anesthesia. They&apos;re not switching to behavioral health after lunch. Your team stays in their lane, which is why they know every payer game specific to your specialty.
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </section>


      {/* The Cosentus Advantage, 6 animated cards */}
      <section className="section">
        <div className="container">
          <RevealOnScroll><div className="section-label">THE COSENTUS ADVANTAGE</div></RevealOnScroll>
          <RevealOnScroll delay={0.1}><div className="section-title">What Sets Accreda Apart</div></RevealOnScroll>

          <div className="advantage-grid advantages-desktop" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 48 }}>
            {advantages.map((a, i) => (
              <RevealOnScroll key={i} direction="scale" delay={0.15 + i * 0.1}>
                <div className="advantage-card">
                  <div className="advantage-icon">{a.icon}</div>
                  <h4>{a.t}</h4>
                  <p>{a.d}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          <div className="advantages-mobile" style={{ marginTop: 32 }}>
            <MobileCarousel autoScrollInterval={4000}>
              {advantages.map((a, i) => (
                <div key={i} className="advantage-card">
                  <div className="advantage-icon">{a.icon}</div>
                  <h4>{a.t}</h4>
                  <p>{a.d}</p>
                </div>
              ))}
            </MobileCarousel>
          </div>
        </div>
      </section>


      {/* Solutions for Every Step */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll><div className="section-label">END-TO-END</div></RevealOnScroll>
          <RevealOnScroll delay={0.1}><div className="section-title">Solutions for Every Step</div></RevealOnScroll>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 48 }}>
            {solutions.map((s, i) => (
              <RevealOnScroll key={i} delay={0.1 + i * 0.06}>
                <div className="solution-card" style={{ padding: '24px 28px', background: 'var(--white)', borderRadius: 12, border: '1px solid var(--gray-200)', height: '100%' }}>
                  <h4 style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 8 }}>{s.t}</h4>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--gray-600)', margin: 0 }}>{s.d}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>


      {/* Pre-Service Collection, Priya */}
      <section className="section">
        <div className="container">
          <div className="emily-spotlight-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <RevealOnScroll direction="left">
              <div>
                <div className="section-label">AI AGENT SPOTLIGHT</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 16, marginBottom: 20 }}>
                  Pre-Service Payment Collection
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', marginBottom: 32 }}>
                  Priya contacts patients before procedures with verified cost estimates, lifting pre-service collections 30–40% vs post-service. She handles the volume so your team focuses on clinical care.
                </p>
                <div style={{ display: 'flex', gap: 32 }}>
                  <div>
                    <div style={{ fontSize: 32, fontWeight: 300, color: 'var(--primary)' }}>30–40%</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Higher Collection Rate</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 32, fontWeight: 300, color: 'var(--primary)' }}>3–7 Days</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Before Procedure</div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <AgentSpotlightCard
                  agentName="Priya"
                  imgAlt="Priya, Pre-Service Payment Collection"
                  roleLabel="Pre-Service Cost Estimates"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>


      {/* Leadership, 250+ years */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll><div className="section-label">LEADERSHIP</div></RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Leadership Combined Experience</div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 12, marginTop: 16, marginBottom: 48 }}>
              <span style={{ fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: 200, color: 'var(--primary)', lineHeight: 1 }}>250+</span>
              <span style={{ fontSize: 18, color: 'var(--gray-600)', fontWeight: 300 }}>years exclusively in anesthesia RCM</span>
            </div>
          </RevealOnScroll>

          {/* All leaders in one grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, marginTop: 0 }}>
            {leaders.map((leader, i) => (
              <RevealOnScroll key={i} delay={0.1 + i * 0.05}>
                <div style={{
                  background: 'var(--white)', borderRadius: 12, border: '1px solid var(--gray-200)',
                  overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'default', height: '100%',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
                >
                  <div style={{ width: '100%', aspectRatio: '1', background: '#f0f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img src={leader.photo} alt={leader.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
                  </div>
                  <div style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{leader.name}</h4>
                    <p style={{ fontSize: 12, color: 'var(--gray-500)', margin: 0 }}>{leader.role}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>


      {/* Client Reviews */}
      <section className="section">
        <div className="container">
          <RevealOnScroll><div className="section-label">CLIENT REVIEWS</div></RevealOnScroll>
          <RevealOnScroll delay={0.1}><div className="section-title">What Our Clients Say</div></RevealOnScroll>

          <div className="testimonials-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 32, marginTop: 48 }}>
            <MobileCarousel autoScrollInterval={5000}>
            {testimonials.map((t, i) => (
              <RevealOnScroll key={i} direction={i === 0 ? 'left' : 'right'} delay={0.2 + i * 0.15}>
                <div className="testimonial-card" style={{
                  padding: '40px 36px', background: 'var(--white)', borderRadius: 16,
                  border: '1px solid var(--gray-200)', position: 'relative', height: '100%',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                  {/* Quote mark */}
                  <div style={{ position: 'absolute', top: 20, left: 28, fontSize: 64, lineHeight: 1, color: 'var(--primary)', opacity: 0.12, fontFamily: 'Georgia, serif', fontWeight: 700 }}>&ldquo;</div>

                  <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--gray-600)', marginBottom: 28, position: 'relative', zIndex: 1 }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderTop: '1px solid var(--gray-200)', paddingTop: 20 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 600, color: 'white', flexShrink: 0,
                    }}>{t.name.split(' ').map(n => n[0]).filter(c => c === c.toUpperCase() && c !== '.').slice(0, 2).join('')}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-900)' }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
            </MobileCarousel>
          </div>
        </div>
      </section>
    </>
  )
}
