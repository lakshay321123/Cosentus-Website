import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Pain Management Billing & RCM | Interventional Expertise | Cosentus',
  description: 'Interventional injections, SCS, radiofrequency ablation, and medication management demand precise coding and authorization management.',
}

const services = [
  { title: 'Interventional Procedure Coding', desc: 'Epidural, facet, sacroiliac, trigger point, nerve block, RFA, SCS implants/trials. Precise CPT selection with appropriate modifiers for laterality and imaging guidance.' },
  { title: 'Medical Necessity & Documentation', desc: 'Payer-specific requirements to reduce denials and defend pre-payment reviews.' },
  { title: 'Pre-Payment Review Defense', desc: 'Prepare and defend documentation when payers trigger reviews.' },
  { title: 'Behavioral Health Integration', desc: 'Capture crossover mental health or behavioral codes commonly missed in pain practices.' },
  { title: 'Medication Management & Drug Screening', desc: 'Proper coding for medication management and related services.' },
  { title: 'Prior Authorization', desc: 'Olivia proactively follows authorizations and prevents procedural disruption.' },
  { title: 'Denial Management', desc: 'Systematic appeals with clinical rationale (95%+ appeal success).' },
  { title: 'Analytics & Visibility', desc: 'Dashboards showing collections by procedure, provider, payer, and denial category.' },
]

export default function PainManagementPage() {
  return (
    <main>
      <PageHero
        label="PAIN MANAGEMENT"
        title="We Close the Gap Between Clinical Complexity and Payer Scrutiny."
        subtitle="Interventional injections, SCS, radiofrequency ablation, and medication management demand precise coding and authorization management. Our pain management experts ensure every high-value procedure is billed and defended."
        ctaText="Get Your Free Pain Management Revenue Analysis"
        ctaHref="/contact"
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <RevealOnScroll>
            <div className="section-label">THE CHALLENGE</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="section-desc" style={{ maxWidth: '100%', fontSize: 17, lineHeight: 1.8 }}>
              Payers scrutinize injection frequency, imaging guidance, and medical necessity. Modifier or laterality errors cost $200–$500 per visit — multiplying quickly. Pre-payment reviews and opioid-related scrutiny add risk.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="section-desc" style={{ maxWidth: '100%', fontSize: 16, lineHeight: 1.8, marginTop: 20 }}>
              Our pain division specialists handle interventional coding and payer defense. AI automates verification and follow-ups; human experts focus on documentation defense and appeals.
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
            <div className="section-title">Complete Pain Management Revenue Cycle</div>
          </RevealOnScroll>
          <div className="advantage-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginTop: 48 }}>
            {services.map((s, i) => (
              <RevealOnScroll key={i}>
                <div className="advantage-card">
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div style={{ padding: 36, background: 'var(--primary-ghost)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
              <p style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--gray-700)', lineHeight: 1.7, marginBottom: 16 }}>&ldquo;I&apos;ve worked with Cosentus and have had nothing but positive experiences. I recommend Cosentus without reservations.&rdquo;</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-900)' }}>Dr. Justin Lo, MD</p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <CTASection />
    </main>
  )
}
