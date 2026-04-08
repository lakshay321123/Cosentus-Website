import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Orthopedic Billing & RCM | Surgical Precision Meets Revenue Intelligence | Cosentus',
  description: 'Joint replacements, arthroscopy, spinal surgery, and implant cases demand surgical-grade coding and proactive contract management.',
}

const services = [
  { title: 'Surgical & Procedural Coding', desc: 'Accurate CPT selection, modifier application, and documentation alignment.' },
  { title: 'Global Period Management', desc: 'Track global windows and capture separately billable post-op visits.' },
  { title: "Workers' Compensation", desc: 'State- and payer-specific requirements handled for timely collection.' },
  { title: 'Implant & Device Billing', desc: 'Accurate pass-through processes to ensure implant reimbursement.' },
  { title: 'Prior Authorization', desc: 'Olivia tracks and closes authorizations to keep OR schedules intact.' },
  { title: 'Denial Management', desc: 'Orthopedic denials are high-dollar; we appeal with clinical rationale and payer-specific strategies (95%+ appeal success).' },
  { title: 'Reporting & Analytics', desc: 'Real-time dashboards showing collections by procedure, surgeon, payer, and facility.' },
]

const testimonials = [
  { quote: 'Cosentus has been efficient, responsive, and personable in managing my revenue cycle. I have seen my revenue grow tremendously.', author: 'Dr. Jothi Murali-Larson', title: 'Orthopedic Surgeon' },
  { quote: 'My collections have significantly increased with their stewardship.', author: 'Dr. Samir and Kavita Sharma', title: 'South Bay Orthopedics' },
]

export default function OrthopedicsPage() {
  return (
    <main>
      <PageHero
        label="ORTHOPEDICS"
        title="Think Growth. Your Dedicated Orthopedic Revenue Cycle Partner."
        subtitle="Joint replacements, arthroscopy, spinal surgery, and implant cases demand surgical-grade coding and proactive contract management. Cosentus ensures every procedure is captured, billed, and collected."
        ctaText="Get Your Free Orthopedic Revenue Analysis"
        ctaHref="/contact"
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <RevealOnScroll>
            <div className="section-label">THE CHALLENGE</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="section-desc" style={{ maxWidth: '100%', fontSize: 17, lineHeight: 1.8 }}>
              High-volume, high-value encounters with common failures: incorrect modifier usage (59, XE, XS, XP), missed implant pass-throughs, global period miscalculations, and workers&apos; comp complexities. Consistent mistakes produce predictable revenue leakage.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="section-desc" style={{ maxWidth: '100%', fontSize: 16, lineHeight: 1.8, marginTop: 20 }}>
              Our orthopedic billing leaders are surgical practice veterans. AI agents handle eligibility, prior-auth, pre-service payments, and claim follow-up — freeing human coders and denial experts for complex, high-dollar issues.
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
            <div className="section-title">Complete Orthopedic Revenue Cycle</div>
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
            <div className="section-label">ALTA MANAGEMENT SOLUTIONS</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="section-desc" style={{ maxWidth: 700, fontSize: 17, lineHeight: 1.8 }}>
              In May 2025, Cosentus acquired Alta Management Solutions, expanding our orthopedic and multi-specialty surgical expertise and strengthening our ASC and contract negotiation capabilities.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">CLIENT TESTIMONIALS</div>
          </RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 36 }}>
            {testimonials.map((t, i) => (
              <RevealOnScroll key={i}>
                <div style={{ padding: 36, background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                  <p style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--gray-700)', lineHeight: 1.7, marginBottom: 20 }}>&ldquo;{t.quote}&rdquo;</p>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-900)' }}>{t.author}</p>
                  <p style={{ fontSize: 13, color: 'var(--gray-600)' }}>{t.title}</p>
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
