import { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

export const metadata: Metadata = {
  title: 'Pain Management Billing & RCM | Interventional Expertise | Cosentus',
  description: 'Interventional injections, SCS, radiofrequency ablation, and medication management demand precise coding and authorization management.',
}

const services = [
  { title: 'Interventional Procedure Coding', desc: 'Epidural, facet, sacroiliac, trigger point, nerve block, RFA, SCS implants/trials. Precise CPT selection with appropriate modifiers for laterality and imaging guidance.', img: '/images/icons/p3-3b.png' },
  { title: 'Medical Necessity & Documentation', desc: 'Payer-specific requirements to reduce denials and defend pre-payment reviews.', img: '/images/icons/3c.png' },
  { title: 'Pre-Payment Review Defense', desc: 'Prepare and defend documentation when payers trigger reviews.', img: '/images/icons/3c.png' },
  { title: 'Behavioral Health Integration', desc: 'Capture crossover mental health or behavioral codes commonly missed in pain practices.', img: '/images/icons/3g.png' },
  { title: 'Medication Management & Drug Screening', desc: 'Proper coding for medication management and related services.', img: '/images/icons/p3-3a.png' },
  { title: 'Prior Authorization', desc: 'Olivia, our AI agent, tracks and clears authorizations — so procedures never stall.', img: '/images/icons/3b.png' },
  { title: 'Denial Management', desc: 'Systematic appeals with clinical rationale (95%+ appeal success).', img: '/images/icons/p3-3c.png' },
  { title: 'Analytics & Visibility', desc: 'Dashboards showing collections by procedure, provider, payer, and denial category.', img: '/images/icons/p3-3e.png' },
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
                      <svg aria-hidden="true" style={{ width: 18, height: 18, flexShrink: 0, marginTop: 2, color: 'var(--gray-400)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
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
                      <svg aria-hidden="true" className="ps-check" style={{ width: 18, height: 18, flexShrink: 0, marginTop: 2, color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
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
                  <div className="advantage-icon">{s.img ? <Image src={s.img} alt="" width={28} height={28} className="icon-teal" style={{ objectFit: 'contain' }} /> : null}</div>
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
                  <div className="advantage-icon">{s.img ? <Image src={s.img} alt="" width={28} height={28} className="icon-teal" style={{ objectFit: 'contain' }} /> : null}</div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 24, marginTop: 48 }}>
            {[
              { quote: 'I have been working with Cosentus for several years. I appreciate the personal touch they add to their service. Thank you very much!', name: 'Dr. Mikko Murakami, QME', role: 'Pain Medicine, PM&R', initials: 'MM' },
              { quote: "I've been in practice for nearly 20 years and Cosentus has provided nothing but positive experiences. Highly recommend without reservations.", name: 'Justin Lo, MD', role: 'President, Northern California Pain Specialists', initials: 'JL' },
            ].map((t, i) => (
              <RevealOnScroll key={i} delay={0.2 + i * 0.15}>
                <div className="testimonial-card" style={{
                  padding: '40px 36px', background: 'var(--white)', borderRadius: 16,
                  border: '1px solid var(--gray-200)', position: 'relative',
                  display: 'flex', flexDirection: 'column' as const, height: '100%',
                }}>
                  <div style={{ position: 'absolute', top: 20, left: 28, fontSize: 64, lineHeight: 1, color: 'var(--primary)', opacity: 0.12, fontFamily: 'Georgia, serif', fontWeight: 700 }} aria-hidden="true">&ldquo;</div>
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--gray-600)', marginBottom: 28, position: 'relative', zIndex: 1, flex: 1 }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderTop: '1px solid var(--gray-200)', paddingTop: 20 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 600, color: 'white', flexShrink: 0,
                    }}>{t.initials}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-900)' }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  )
}
