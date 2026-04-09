import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

export const metadata: Metadata = {
  title: 'Pain Management Billing & RCM | Interventional Expertise | Cosentus',
  description: 'Interventional injections, SCS, radiofrequency ablation, and medication management demand precise coding and authorization management.',
}

const services = [
  { title: 'Interventional Procedure Coding', desc: 'Epidural, facet, sacroiliac, trigger point, nerve block, RFA, SCS implants/trials. Precise CPT selection with appropriate modifiers for laterality and imaging guidance.', iconPath: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21' },
  { title: 'Medical Necessity & Documentation', desc: 'Payer-specific requirements to reduce denials and defend pre-payment reviews.', iconPath: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
  { title: 'Pre-Payment Review Defense', desc: 'Prepare and defend documentation when payers trigger reviews.', iconPath: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { title: 'Behavioral Health Integration', desc: 'Capture crossover mental health or behavioral codes commonly missed in pain practices.', iconPath: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5' },
  { title: 'Medication Management & Drug Screening', desc: 'Proper coding for medication management and related services.', iconPath: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
  { title: 'Prior Authorization', desc: 'Olivia, our AI agent, tracks and clears authorizations — so procedures never stall.', iconPath: 'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5' },
  { title: 'Denial Management', desc: 'Systematic appeals with clinical rationale (95%+ appeal success).', iconPath: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
  { title: 'Analytics & Visibility', desc: 'Dashboards showing collections by procedure, provider, payer, and denial category.', iconPath: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
]

export default function PainManagementPage() {
  return (
    <main>
      <PageHero
        label="PAIN MANAGEMENT"
        title="Pain Management Procedures Are High-Value. Your Reimbursements Should Be Too."
        subtitle="Injections, SCS, ablations, and medication management — coded precisely, authorized proactively, defended aggressively."
        ctaText="Get Your Free Pain Management Revenue Analysis"
        ctaHref="/contact"
      />

      {/* Problem / Solution Split */}
      <section className="section" style={{ overflow: 'hidden' }}>
        <div className="container">
          <div className="problem-solution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden', minHeight: 340 }}>
            {/* Problem */}
            <RevealOnScroll direction="left">
              <div className="ps-panel ps-problem" style={{ background: 'var(--white)', padding: 'clamp(32px, 4vw, 56px)', height: '100%', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--gray-400)', marginBottom: 16 }}>THE PROBLEM</div>
                <h3 style={{ fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.25, marginBottom: 20 }}>
                  High-Frequency Procedures.<br />High-Frequency Denials.
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
                  {[
                    'Payers scrutinize injection frequency, imaging guidance, and medical necessity',
                    'Modifier or laterality errors cost $200–$500 per visit — and multiply fast',
                    'Pre-payment reviews and opioid-related scrutiny add risk',
                  ].map((item, i) => (
                    <div key={i} className="ps-bullet" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <svg style={{ width: 18, height: 18, flexShrink: 0, marginTop: 2, color: 'var(--gray-400)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                      <span style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--gray-600)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
            {/* Solution */}
            <RevealOnScroll direction="right">
              <div className="ps-panel ps-solution" style={{ background: 'var(--primary)', padding: 'clamp(32px, 4vw, 56px)', height: '100%', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', borderRadius: '0 var(--radius-md) var(--radius-md) 0', position: 'relative' as const, overflow: 'hidden' }}>
                <div className="ps-shimmer" />
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>THE SOLUTION</div>
                <h3 style={{ fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 700, color: 'white', lineHeight: 1.25, marginBottom: 20 }}>
                  Interventional Coding Experts + AI Defense
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
                  {[
                    'Pain division specialists handle interventional coding and payer defense',
                    'AI automates verification and follow-ups at scale',
                    'Human experts focus on documentation defense and appeals',
                    '95%+ appeal success rate with clinical rationale',
                  ].map((item, i) => (
                    <div key={i} className="ps-bullet-light" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <svg className="ps-check" style={{ width: 18, height: 18, flexShrink: 0, marginTop: 2, color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      <span style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.9)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">WHAT WE MANAGE</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Complete Pain Management Revenue Cycle</div>
          </RevealOnScroll>
          <div className="advantage-grid advantages-desktop" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginTop: 48 }}>
            {services.map((s, i) => (
              <RevealOnScroll key={i}>
                <div className="advantage-card">
                  <div className="advantage-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={s.iconPath} /></svg></div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          {/* Mobile */}
          <div className="advantages-mobile" style={{ overflow: 'hidden', width: '100%', marginTop: 32 }}>
            <MobileCarousel autoScrollInterval={4500}>
              {services.map((s, i) => (
                <div key={i} className="advantage-card">
                  <div className="advantage-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={s.iconPath} /></svg></div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              ))}
            </MobileCarousel>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RevealOnScroll><div className="section-label">CLIENT REVIEWS</div></RevealOnScroll>
          <RevealOnScroll delay={0.1}><div className="section-title">What Our Clients Say</div></RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <div className="testimonial-card" style={{
              padding: '40px 36px', background: 'var(--white)', borderRadius: 16,
              border: '1px solid var(--gray-200)', position: 'relative', maxWidth: 680, marginTop: 48,
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
              <div style={{ position: 'absolute', top: 20, left: 28, fontSize: 64, lineHeight: 1, color: 'var(--primary)', opacity: 0.12, fontFamily: 'Georgia, serif', fontWeight: 700 }}>&ldquo;</div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--gray-600)', marginBottom: 28, position: 'relative', zIndex: 1 }}>
                &ldquo;I&apos;ve been in practice for nearly 20 years and Cosentus has provided nothing but positive experiences. Highly recommend without reservations.&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderTop: '1px solid var(--gray-200)', paddingTop: 20 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 600, color: 'white', flexShrink: 0,
                }}>JL</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-900)' }}>Dr. Justin Lo, MD</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>President, Northern California Pain Specialists</div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <CTASection />
    </main>
  )
}
