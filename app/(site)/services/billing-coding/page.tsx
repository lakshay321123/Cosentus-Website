import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

export const metadata: Metadata = {
  title: 'Medical Billing & Coding Services | Expert-Led, AI-Powered | Cosentus',
  description: 'Medical billing and coding for physician practices, specialty groups, and surgery centers across 20+ specialties.',
}

const process = [
  { step: '01', title: 'Patient Registration & Eligibility', desc: 'AI verification (Elly) catches issues before service.' },
  { step: '02', title: 'Charge Capture & Coding', desc: 'AAPC-certified coders ensure accurate CPTs, modifiers and clinical documentation alignment.' },
  { step: '03', title: 'Claim Scrubbing & Submission', desc: 'Payer-specific edits for clean claims.' },
  { step: '04', title: 'Payment Posting & Reconciliation', desc: 'Identify underpayments and reconcile payments to expected reimbursements (Ariel).' },
  { step: '05', title: 'AR Follow-Up & Denial Management', desc: 'Dedicated teams pursue claims methodically (Chris and human denials experts).' },
  { step: '06', title: 'Patient Billing & Collections', desc: 'Clear statements and empathetic collections (Cindy).' },
]

const specialties = [
  'Anesthesia', 'Orthopedics', 'Pain Management', 'ASCs', 'Behavioral Health',
  'Urgent Care', 'OBGYN', 'Ophthalmology', 'Endoscopy', 'General Surgery',
  'ENT', 'Dermatology',
]

export default function BillingCodingPage() {
  return (
    <main>
      <PageHero
        label="MEDICAL BILLING & CODING"
        title="Expert-Led Medical Billing Across 20+ Specialties."
        subtitle="Medical billing and coding for physician practices, specialty groups, and surgery centers. One focus: maximize revenue while ensuring compliance. Powered by Real + Artificial Intelligence."
        ctaText="Get Your Free Revenue Analysis"
        ctaHref="/contact"
      />

      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">WHAT SETS US APART</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">What Sets Cosentus Billing Apart</div>
          </RevealOnScroll>
          <div className="advantage-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 48 }}>
            {[
              { title: 'Dedicated, Specialty-Trained Teams', desc: 'You get named coders and billing leads who understand your clinical workflows and payer rules.', iconPath: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21' },
              { title: 'R+A Accuracy & Scale', desc: 'AI handles verification, follow-up, and collections; human specialists handle complex coding, clinical validation, and denials.', iconPath: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
              { title: 'Proactive Denial Prevention', desc: 'Every claim passes payer-specific edits before submission. Every denied dollar is pursued until collected.', iconPath: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
            ].map((item, i) => (
              <RevealOnScroll key={i}>
                <div className="advantage-card">
                  <div className="advantage-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg></div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          {/* Mobile process steps */}
          <div className="services-mobile" style={{ marginTop: 32 }}>
            <MobileCarousel autoScrollInterval={4000}>
              {process.map((p, i) => (
                <div key={i} style={{ padding: 32, background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                  <div style={{ fontSize: 32, fontWeight: 200, color: 'var(--primary)', marginBottom: 12, fontFamily: 'var(--font-display)' }}>{p.step}</div>
                  <h4 style={{ fontSize: 16, fontWeight: 400, color: 'var(--gray-900)', marginBottom: 8 }}>{p.title}</h4>
                  <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              ))}
            </MobileCarousel>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">OUR PROCESS</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Our Billing Process</div>
          </RevealOnScroll>
          <div className="services-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 48 }}>
            {process.map((p, i) => (
              <RevealOnScroll key={i}>
                <div style={{ padding: 32, background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                  <div style={{ fontSize: 32, fontWeight: 200, color: 'var(--primary)', marginBottom: 12, fontFamily: 'var(--font-display)' }}>{p.step}</div>
                  <h4 style={{ fontSize: 16, fontWeight: 400, color: 'var(--gray-900)', marginBottom: 8 }}>{p.title}</h4>
                  <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 0', overflow: 'hidden' }}>
        <div className="container" style={{ marginBottom: 24 }}>
          <RevealOnScroll>
            <div className="section-label">SPECIALTIES WE SERVE</div>
          </RevealOnScroll>
        </div>
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
          <div style={{ display: 'flex', animation: 'scrollTicker 25s linear infinite', width: 'max-content' }}>
            {[...specialties, ...specialties].map((s, i) => (
              <span key={i} style={{ whiteSpace: 'nowrap', padding: '0 32px', fontSize: 18, fontWeight: 300, color: 'var(--gray-700)', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M7 0v14M0 7h14" stroke="#00B5D6" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  )
}
