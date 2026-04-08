import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Purpose Built for Anesthesia | Accreda by Cosentus | Anesthesia Billing & RCM',
  description: 'Accreda by Cosentus — 23+ years of anesthesia-specific RCM experience, backed by Real + Artificial Intelligence.',
}

const solutions = [
  'Engagement & Experience — White-glove onboarding and consistent communication.',
  'Reporting & Analytics — Real-time dashboards, trend analysis, and weekly reviews.',
  'Practice Management & Consulting — Operational guidance to increase throughput and profit.',
  'Credentialing & Contracting — Credentialing support and contract analytics.',
  'Data Capture & Case Reconciliation — 100% case capture and reconciliation with OR and facility records.',
  'Coding & Clinical Documentation Improvement — AAPC-certified coders and CDI support.',
  'Scrub & Submit — Payer-specific edits and claims submission for clean claims.',
  'Denials & Underpayment Recovery — Rapid appeals supported by clinical rationale.',
]

export default function AnesthesiaPage() {
  return (
    <main>
      <PageHero
        label="ANESTHESIA — ACCREDA BY COSENTUS"
        title="Beyond Billing. Built for Anesthesia."
        subtitle="Accreda by Cosentus — 23+ years of anesthesia-specific RCM experience, backed by our Real + Artificial Intelligence operating model to capture every time unit, implant, and billable encounter."
        ctaText="Get Your Free Anesthesia Revenue Analysis"
        ctaHref="/contact"
      />
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <RevealOnScroll>
            <div className="section-label">WHY ACCREDA EXISTS</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="section-desc" style={{ maxWidth: '100%', fontSize: 17, lineHeight: 1.8 }}>
              Base units, time-unit accuracy, medical direction modifiers, concurrency rules, implant pass-throughs — generic RCM teams miss details that cost thousands per case. Accreda is our anesthesia-exclusive division with the specialty focus your group needs.
            </p>
          </RevealOnScroll>
        </div>
      </section>
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">SOLUTIONS</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Solutions for Every Step</div>
          </RevealOnScroll>
          <div className="advantage-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginTop: 48 }}>
            {solutions.map((s, i) => (
              <RevealOnScroll key={i}>
                <div className="advantage-card">
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--gray-700)' }}>{s}</p>
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
