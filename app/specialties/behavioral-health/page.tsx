import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Behavioral Health Billing & RCM | Psychiatry, Therapy, IOP/PHP & Telehealth | Cosentus',
  description: 'Psychiatry, therapy, IOP/PHP, medication management, and telehealth each carry distinct billing rules.',
}

const services = [
  { title: 'Therapy Session Coding', desc: 'Correct time thresholds and add-on codes for individual, group, and family therapy.' },
  { title: 'Psychiatric & Medication Management', desc: 'Capture both psychiatric and E/M components when clinically appropriate.' },
  { title: 'IOP & PHP Billing', desc: 'Manage payer-specific bundling and per-diem vs per-service differences.' },
  { title: 'Telehealth Billing', desc: 'Correct place-of-service and modifier use across payers.' },
  { title: 'Authorization Management', desc: 'Proactive tracking, submission, and follow-up.' },
  { title: 'Crisis & Add-On Services', desc: 'Accurate capture of crisis interventions and prolonged services.' },
  { title: 'Patient Payment Collection', desc: 'Cindy handles patient balances empathetically in 50+ languages.' },
  { title: 'Analytics & Reporting', desc: 'Dashboards showing revenue per provider, authorization status, and denial patterns.' },
]

export default function BehavioralHealthPage() {
  return (
    <main>
      <PageHero
        label="BEHAVIORAL HEALTH"
        title="Behavioral Health Demand Is Surging. The Billing Complexity Is Surging With It."
        subtitle="Psychiatry, therapy, IOP/PHP, medication management, and telehealth each carry distinct billing rules. Our behavioral health specialists keep revenue aligned with care delivered."
        ctaText="Get Your Free Behavioral Health Revenue Analysis"
        ctaHref="/contact"
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <RevealOnScroll>
            <div className="section-label">THE CHALLENGE</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="section-desc" style={{ maxWidth: '100%', fontSize: 17, lineHeight: 1.8 }}>
              Time-based CPTs, telehealth modifiers, IOP/PHP bundling, and ongoing authorizations create frequent revenue leaks when tracking gaps occur. We capture correct time-based coding, track every authorization expiration, and manage telehealth billing. AI automates eligibility re-checks and authorization tracking; human experts defend denials.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">WHAT WE MANAGE</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Complete Behavioral Health Revenue Cycle</div>
          </RevealOnScroll>
          <div className="advantage-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginTop: 48 }}>
            {services.map((s, i) => (
              <RevealOnScroll key={i}>
                <div className="advantage-card">
                  <div className="advantage-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
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
