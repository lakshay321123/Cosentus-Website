'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'
import AgentSpotlightCard from '@/components/voice/AgentSpotlightCard'

const services = [
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" /></svg>, title: 'Surgical & Procedural Coding', desc: 'Accurate CPT selection, modifier application, and documentation alignment for every orthopedic procedure.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'Global Period Management', desc: 'Track global windows and capture separately billable post-op visits that other billers miss.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>, title: "Workers' Compensation", desc: 'State- and payer-specific requirements handled for timely collection across all jurisdictions.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.25 5.25a2.121 2.121 0 01-3-3l5.25-5.25m7.5-3l-3.75 3.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'Implant & Device Billing', desc: 'Accurate pass-through processes to ensure implant reimbursement on every case.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>, title: 'Prior Authorization', desc: 'Paige tracks and closes authorizations to keep OR schedules intact. Zero procedural delays.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>, title: 'Denial Management', desc: '95%+ appeal success. We appeal with clinical rationale and payer-specific strategies for high-dollar ortho denials.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>, title: 'Reporting & Analytics', desc: 'Real-time dashboards showing collections by procedure, surgeon, payer, and facility.' },
]

const testimonials = [
  { quote: 'Dedicated, flexible, and responsive team. Very pleased with increase in collections and their ability to work denials. Highly recommend Cosentus for medical offices needing a positive change.', author: 'Ryan King', title: 'Director of Operations, Hand Microsurgery & Reconstructive Orthopaedic' },
  { quote: 'They have been a great service to my practice. I highly recommend them. My collections have significantly increased.', author: 'Dr. Samir and Kavita Sharma', title: 'South Bay Orthopedics' },
]

export default function OrthopedicsContent() {
  return (
    <>
      {/* Challenge + Solution — Split Section */}
      <section style={{ overflow: 'hidden' }}>
        <div className="problem-solution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 400 }}>
          <div className="ps-panel ps-problem" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--white)', position: 'relative' }}>
            <RevealOnScroll direction="left">
              <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#616161" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                THE CHALLENGE
              </div>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginBottom: 24 }}>
                High-Value Cases. Predictable Revenue Leakage.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.2}>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', maxWidth: 500, marginBottom: 32 }}>
                Incorrect modifiers, missed implant pass-throughs, global period errors, and workers&apos; comp complexities — revenue lost before it&apos;s even billed.
              </p>
            </RevealOnScroll>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Modifier errors (59, XE, XS, XP) on every claim',
                'Missed implant pass-throughs worth thousands',
                'Global period miscalculations leaking revenue',
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

          <div className="ps-panel ps-solution" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#00B5D6', position: 'relative', overflow: 'hidden' }}>
            <div className="ps-shimmer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            <RevealOnScroll direction="right">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                THE SOLUTION
              </div>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'white', marginBottom: 24 }}>
                Surgical Practice Veterans + AI
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,0.9)', maxWidth: 500, marginBottom: 32 }}>
                Orthopedic billing experts handle the complexity. AI agents handle the volume. Nothing slips through.
              </p>
            </RevealOnScroll>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Surgical practice veterans for every payer nuance',
                'AI agents automate eligibility, auth & follow-up',
                '95%+ appeal success on high-dollar denials',
                'Root cause denial prevention — denial categories shrink quarter over quarter',
                'Dedicated team — they live ortho codes, not switching to other specialties',
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


      {/* Services */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll><div className="section-label">WHAT WE MANAGE</div></RevealOnScroll>
          <RevealOnScroll delay={0.1}><div className="section-title">Complete Orthopedic Revenue Cycle</div></RevealOnScroll>
          <div className="advantage-grid advantages-desktop" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', marginTop: 48 }}>
            {services.map((s, i) => (
              <RevealOnScroll key={i} delay={i * 0.07}>
                <div className="advantage-card">
                  <div className="advantage-icon">{s.icon}</div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          <div className="advantages-mobile" style={{ overflow: 'hidden', width: '100%', marginTop: 32 }}>
            <MobileCarousel autoScrollInterval={4500}>
              {services.map((s, i) => (
                <div key={i} className="advantage-card">
                  <div className="advantage-icon">{s.icon}</div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              ))}
            </MobileCarousel>
          </div>

          {/* Alta callout — integrated into services section */}
          <RevealOnScroll delay={0.5}>
            <div style={{ marginTop: 40, padding: '24px 32px', background: 'var(--white)', borderRadius: 12, border: '1px solid var(--gray-200)', borderLeft: '4px solid #00B5D6', display: 'flex', alignItems: 'center', gap: 16 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#00B5D6" strokeWidth={1.5} style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--gray-600)', margin: 0 }}>
                <strong style={{ color: 'var(--gray-900)' }}>Alta Management Solutions</strong> — In May 2025, Cosentus acquired Alta, expanding orthopedic and multi-specialty surgical expertise, ASC management, and contract negotiation capabilities.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>


      {/* AI Agent Spotlight — Paige (Prior Authorization) */}
      <section className="section">
        <div className="container">
          <div className="emily-spotlight-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <RevealOnScroll direction="left">
              <div>
                <div className="section-label">AI AGENT SPOTLIGHT</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 16, marginBottom: 20 }}>
                  Prior Authorization Management
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', marginBottom: 32 }}>
                  Paige tracks and clears authorizations for scheduled orthopedic procedures — knee replacements, spinal fusions, arthroscopic surgeries. Zero procedural delays. Zero OR schedule disruptions.
                </p>
                <div style={{ display: 'flex', gap: 32 }}>
                  <div>
                    <div style={{ fontSize: 32, fontWeight: 300, color: 'var(--primary)' }}>Zero</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Procedural Delays</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 32, fontWeight: 300, color: 'var(--primary)' }}>24/7</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Auth Tracking</div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <AgentSpotlightCard
                  agentName="Paige"
                  imgAlt="Paige — Prior Authorization Management"
                  roleLabel="Prior Auth Tracking Specialist"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>


      {/* Leadership */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll><div className="section-label">LEADERSHIP</div></RevealOnScroll>
          <RevealOnScroll delay={0.1}><div className="section-title">Orthopedic Leadership</div></RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', maxWidth: 720, marginTop: 16 }}>
              Surgical practice veterans with deep orthopedic and ASC expertise — strengthened by the May 2025 Alta Management Solutions acquisition. Full team profiles publishing soon.
            </p>
          </RevealOnScroll>
        </div>
      </section>


      {/* Client Reviews */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll><div className="section-label">CLIENT REVIEWS</div></RevealOnScroll>
          <RevealOnScroll delay={0.1}><div className="section-title">What Our Clients Say</div></RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 32, marginTop: 48 }}>
            {testimonials.map((t, i) => (
              <RevealOnScroll key={i} direction={i === 0 ? 'left' : 'right'} delay={0.2 + i * 0.15}>
                <div className="testimonial-card" style={{
                  padding: '40px 36px', background: 'var(--white)', borderRadius: 16,
                  border: '1px solid var(--gray-200)', position: 'relative', height: '100%',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                  <div style={{ position: 'absolute', top: 20, left: 28, fontSize: 64, lineHeight: 1, color: 'var(--primary)', opacity: 0.12, fontFamily: 'Georgia, serif', fontWeight: 700 }}>&ldquo;</div>
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--gray-600)', marginBottom: 28, position: 'relative', zIndex: 1 }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderTop: '1px solid var(--gray-200)', paddingTop: 20 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 600, color: 'white', flexShrink: 0,
                    }}>{t.author.split(' ').filter(w => w[0] === w[0]?.toUpperCase() && !w.includes('.')).map(w => w[0]).slice(0, 2).join('')}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-900)' }}>{t.author}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{t.title}</div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
