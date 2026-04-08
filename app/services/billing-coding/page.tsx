import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Medical Billing & Coding Services | Expert-Led, AI-Powered | Cosentus',
  description: 'Medical billing and coding for physician practices, specialty groups, and surgery centers across 20+ specialties.',
}

const process = [
  { step: '01', title: 'Patient Registration & Eligibility', desc: 'AI verification (Harper) catches issues before service.' },
  { step: '02', title: 'Charge Capture & Coding', desc: 'AAPC-certified coders ensure accurate CPTs, modifiers and clinical documentation alignment.' },
  { step: '03', title: 'Claim Scrubbing & Submission', desc: 'Payer-specific edits for clean claims.' },
  { step: '04', title: 'Payment Posting & Reconciliation', desc: 'Identify underpayments and reconcile payments to expected reimbursements (Michael).' },
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
              { title: 'Dedicated, Specialty-Trained Teams', desc: 'You get named coders and billing leads who understand your clinical workflows and payer rules.' },
              { title: 'R+A Accuracy & Scale', desc: 'AI handles verification, follow-up, and collections; human specialists handle complex coding, clinical validation, and denials.' },
              { title: 'Proactive Denial Prevention', desc: 'Every claim passes payer-specific edits before submission. Every denied dollar is pursued until collected.' },
            ].map((item, i) => (
              <RevealOnScroll key={i}>
                <div className="advantage-card">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 48 }}>
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
