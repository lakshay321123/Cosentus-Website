import { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

export const metadata: Metadata = {
  title: 'ASC Billing & RCM | Facility + Professional Fee Expertise | Cosentus',
  description: 'ASC billing requires coordinated facility and professional fee handling, implant accuracy, case costing, and contract monitoring.',
}

const services = [
  { title: 'Facility & Professional Fee Billing', desc: 'Coordinated billing streams for accurate reimbursements.', img: '/images/icons/p3-3b.png' },
  { title: 'Case Costing & Profitability Analysis', desc: 'Track costs and reimbursements by procedure and payer.', img: '/images/icons/p3-3e.png' },
  { title: 'Implant & Supply Billing', desc: 'Accurate documentation and pass-through processes.', img: '/images/icons/3e.png' },
  { title: 'Multi-Payer Contract Management', desc: 'Monitor reimbursements vs contract rates and flag underpayments.', img: '/images/icons/3d.png' },
  { title: 'Out-of-Network Negotiation', desc: 'Negotiation for high-value out-of-network cases.', img: '/images/icons/p3-3a.png' },
  { title: 'Prior Authorization', desc: 'Olivia, our AI agent, manages authorizations for scheduled cases — so nothing stalls before the OR.', img: '/images/icons/3b.png' },
  { title: 'Pre-Service Payment Collection', desc: 'Emily collects patient financial responsibility pre-procedure.', img: '/images/icons/p3-3a.png' },
  { title: 'Denial Management', desc: 'Appeals with clinical rationale and cost justification.', img: '/images/icons/p3-3c.png' },
]

export default function ASCPage() {
  return (
    <main>
      <PageHero
        label="AMBULATORY SURGERY CENTERS"
        title={<>Your ASC Runs Dozens of Cases a Day.<br />Your Billing Needs to Keep Up.</>}
        subtitle="ASC billing requires coordinated facility and professional fee handling, implant accuracy, case costing, and contract monitoring. Cosentus ensures every case is profitable."
        ctaText="Get Your Free ASC Revenue Analysis"
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
                  High Case Volume.<br />Hidden Revenue Leakage.
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
                  {[
                    'Missed implant billing silently eroding margins',
                    'Incorrect facility/professional allocation losing reimbursement',
                    'Untracked case costing hiding unprofitable procedures',
                    'Authorization lapses causing denials and delays',
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
                  Dedicated ASC Team + Alta Management + AI
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
                  {[
                    'Coordinated facility and professional billing streams',
                    'Real-time case cost tracking and underpayment detection',
                    'AI handles authorizations and follow-ups at scale',
                    'Specialists handle payer negotiation and recovery',
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
            <div className="section-title">Complete ASC Revenue Cycle</div>
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
          <RevealOnScroll delay={0.2}>
            <div className="testimonial-card" style={{
              padding: '40px 36px', background: 'var(--white)', borderRadius: 16,
              border: '1px solid var(--gray-200)', position: 'relative', maxWidth: 680, marginTop: 48,
              display: 'flex', flexDirection: 'column' as const,
            }}>
              <div style={{ position: 'absolute', top: 20, left: 28, fontSize: 64, lineHeight: 1, color: 'var(--primary)', opacity: 0.12, fontFamily: 'Georgia, serif', fontWeight: 700 }} aria-hidden="true">&ldquo;</div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--gray-600)', marginBottom: 28, position: 'relative', zIndex: 1 }}>
                &ldquo;Cosentus has truly been fantastic in all aspects. The job they have done on the outstanding balances saved our surgery center.&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderTop: '1px solid var(--gray-200)', paddingTop: 20 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 600, color: 'white', flexShrink: 0,
                }}>JW</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-900)' }}>John Welsh, M.D.</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Surgery Center</div>
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
