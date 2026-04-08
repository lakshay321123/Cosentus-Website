import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export const metadata: Metadata = {
  title: 'ASC Billing & RCM | Facility + Professional Fee Expertise | Cosentus',
  description: 'ASC billing requires coordinated facility and professional fee handling, implant accuracy, case costing, and contract monitoring.',
}

const services = [
  { title: 'Facility & Professional Fee Billing', desc: 'Coordinated billing streams for accurate reimbursements.' },
  { title: 'Case Costing & Profitability Analysis', desc: 'Track costs and reimbursements by procedure and payer.' },
  { title: 'Implant & Supply Billing', desc: 'Accurate documentation and pass-through processes.' },
  { title: 'Multi-Payer Contract Management', desc: 'Monitor reimbursements vs contract rates and flag underpayments.' },
  { title: 'Out-of-Network Negotiation', desc: 'Negotiation for high-value out-of-network cases.' },
  { title: 'Prior Authorization', desc: 'Olivia manages authorizations for scheduled cases.' },
  { title: 'Pre-Service Payment Collection', desc: 'Emily collects patient financial responsibility pre-procedure.' },
  { title: 'Denial Management', desc: 'Appeals with clinical rationale and cost justification.' },
]

export default function ASCPage() {
  return (
    <main>
      <PageHero
        label="AMBULATORY SURGERY CENTERS"
        title="Your ASC Runs Dozens of Cases a Day. Your Billing Needs to Keep Up."
        subtitle="ASC billing requires coordinated facility and professional fee handling, implant accuracy, case costing, and contract monitoring. Cosentus ensures every case is profitable."
        ctaText="Get Your Free ASC Revenue Analysis"
        ctaHref="/contact"
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <RevealOnScroll>
            <div className="section-label">THE CHALLENGE</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="section-desc" style={{ maxWidth: '100%', fontSize: 17, lineHeight: 1.8 }}>
              Common ASC revenue losses: missed implant billing, incorrect facility/professional allocation, untracked case costing, and authorization lapses. Our ASC team — strengthened by Alta Management Solutions — coordinates facility and professional billing, tracks case costs in real time, and monitors contracts for underpayment.
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
            <div className="section-title">Complete ASC Revenue Cycle</div>
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

      <CTASection />
    </main>
  )
}
