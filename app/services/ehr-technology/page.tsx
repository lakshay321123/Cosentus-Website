import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export const metadata: Metadata = {
  title: 'EHR Agnostic Technology & Integration | Works With Your Existing Systems | Cosentus',
  description: 'Works with your existing EHR — Epic, Athenahealth, eClinicalWorks, and more. Or add Medcloud, our purpose-built PM platform.',
}

const ehrs = ['Epic', 'Athenahealth', 'eClinicalWorks', 'AdvancedMD', 'ModMed', 'nxGen', 'ClarityStack', 'HALOMD', 'Medcloud']

const capabilities = [
  { title: 'Clinical Documentation', desc: 'Specialty templates that support both quality and reimbursement.' },
  { title: 'Practice Management', desc: 'Scheduling, insurance management, demographic capture.' },
  { title: 'Billing Integration', desc: 'Seamless charge flow to Cosentus billing.' },
  { title: 'Reporting & Analytics', desc: 'Financial and clinical dashboards for operational decisions.' },
  { title: 'Interoperability', desc: 'Cloud-based and HIPAA-compliant infrastructure ensures enterprise-grade security across all integrations.' },
]

export default function EHRTechnologyPage() {
  return (
    <main>
      <PageHero
        label="EHR & TECHNOLOGY"
        title="EHR Agnostic. Seamlessly Integrated."
        subtitle="Works with your existing EHR — Epic, Athenahealth, eClinicalWorks, AdvancedMD, ModMed, nxGen, and more. No migrations. No disruption. For practices that want a purpose-built option, Medcloud supports cleaner claims and faster revenue."
        ctaText="Schedule a Technology Assessment"
        ctaHref="/contact"
      />

      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">COMPATIBLE SYSTEMS</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">We Connect to What You Already Use</div>
          </RevealOnScroll>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 32 }}>
            {ehrs.map((ehr, i) => (
              <RevealOnScroll key={i}>
                <span style={{
                  padding: '12px 24px',
                  background: ehr === 'Medcloud' ? 'var(--primary)' : 'var(--white)',
                  color: ehr === 'Medcloud' ? 'white' : 'var(--gray-700)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 15,
                  fontWeight: ehr === 'Medcloud' ? 500 : 400,
                  border: `1px solid ${ehr === 'Medcloud' ? 'var(--primary)' : 'var(--gray-200)'}`,
                }}>{ehr}</span>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">KEY CAPABILITIES</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Technology That Works for You</div>
          </RevealOnScroll>
          <div className="advantage-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 48 }}>
            {capabilities.map((c, i) => (
              <RevealOnScroll key={i}>
                <div className="advantage-card">
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <RevealOnScroll>
            <div className="section-label">MEDCLOUD</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Medcloud — Purpose-Built for Revenue</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="section-desc" style={{ maxWidth: '100%', fontSize: 17, lineHeight: 1.8 }}>
              Our purpose-built cloud EHR and practice management platform — specialty templates, native billing integration, and real-time analytics for practices that want a deeper connection. Revenue-first design ensures documentation prompts capture every billable element.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <CTASection />
    </main>
  )
}
