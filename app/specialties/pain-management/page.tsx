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
  { title: 'Prior Authorization', desc: 'Olivia proactively follows authorizations and prevents procedural disruption.', iconPath: 'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5' },
  { title: 'Denial Management', desc: 'Systematic appeals with clinical rationale (95%+ appeal success).', iconPath: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
  { title: 'Analytics & Visibility', desc: 'Dashboards showing collections by procedure, provider, payer, and denial category.', iconPath: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
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
                  <div className="advantage-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={s.iconPath} /></svg></div>
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
