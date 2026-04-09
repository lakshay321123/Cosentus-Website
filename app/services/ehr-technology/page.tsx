import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

export const metadata: Metadata = {
  title: 'EHR Agnostic Technology & Integration | Works With Your Existing Systems | Cosentus',
  description: 'Works with your existing EHR — Epic, Athenahealth, eClinicalWorks, and more. Or add Medcloud, our purpose-built PM platform.',
}

const ehrs = ['Epic', 'Athenahealth', 'eClinicalWorks', 'AdvancedMD', 'ModMed', 'nxGen', 'ClarityStack', 'HALOMD', 'Medcloud']

const capabilities = [
  { title: 'Clinical Documentation', desc: 'Specialty templates that support both quality and reimbursement.', iconPath: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21' },
  { title: 'Practice Management', desc: 'Scheduling, insurance management, demographic capture.', iconPath: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
  { title: 'Billing Integration', desc: 'Seamless charge flow to Cosentus billing.', iconPath: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { title: 'Reporting & Analytics', desc: 'Financial and clinical dashboards for operational decisions.', iconPath: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5' },
  { title: 'Interoperability', desc: 'Cloud-based and HIPAA-compliant infrastructure ensures enterprise-grade security across all integrations.', iconPath: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
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
                  <div className="advantage-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg></div>
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
