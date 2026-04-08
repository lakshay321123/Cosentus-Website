import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Purpose Built for Anesthesia | Accreda by Cosentus | Anesthesia Billing & RCM',
  description: 'Accreda by Cosentus — 23+ years of anesthesia-specific RCM experience, backed by Real + Artificial Intelligence.',
}

const solutions = [
  { icon: '🤝', title: 'Engagement & Experience', desc: 'White-glove onboarding and consistent communication.' },
  { icon: '📊', title: 'Reporting & Analytics', desc: 'Real-time dashboards, trend analysis, and weekly reviews.' },
  { icon: '⚙️', title: 'Practice Management', desc: 'Operational guidance to increase throughput and profit.' },
  { icon: '🏥', title: 'Credentialing & Contracting', desc: 'Credentialing support and contract analytics.' },
  { icon: '📋', title: 'Data Capture & Reconciliation', desc: '100% case capture with OR and facility records.' },
  { icon: '🔬', title: 'Coding & CDI', desc: 'AAPC-certified coders and clinical documentation improvement.' },
  { icon: '✅', title: 'Scrub & Submit', desc: 'Payer-specific edits for clean claims submission.' },
  { icon: '💰', title: 'Denials & Recovery', desc: 'Rapid appeals with clinical rationale and strategies.' },
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
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">SOLUTIONS</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Solutions for Every Step</div>
          </RevealOnScroll>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, marginTop: 48 }}>
            {solutions.map((s, i) => (
              <RevealOnScroll key={i} delay={i * 0.06}>
                <div className="solution-card" style={{
                  padding: 28, background: 'var(--white)', borderRadius: 12,
                  border: '1px solid var(--gray-200)', height: '100%',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
                  <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 6 }}>{s.title}</h4>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--gray-600)' }}>{s.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {/* Why Accreda — compact note below solutions */}
          <RevealOnScroll delay={0.3}>
            <div style={{ marginTop: 48, padding: '24px 32px', background: 'var(--primary-ghost)', borderRadius: 12, borderLeft: '4px solid #00B5D6' }}>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--gray-700)', margin: 0 }}>
                <strong style={{ color: '#00B5D6' }}>Why Accreda?</strong>{' '}
                Base units, time-unit accuracy, medical direction modifiers, concurrency rules, implant pass-throughs — generic RCM teams miss details that cost thousands per case. Accreda is our anesthesia-exclusive division with the specialty focus your group needs.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <CTASection />
    </main>
  )
}
