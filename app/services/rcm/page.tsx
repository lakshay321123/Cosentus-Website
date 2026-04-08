import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import ResultsSection from '@/components/sections/ResultsSection'
import CTASection from '@/components/sections/CTASection'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Comprehensive Revenue Cycle Management | End-to-End RCM | Cosentus',
  description: 'We manage your entire revenue cycle — patient registration to final payment — with specialty-trained teams and Real + Artificial Intelligence.',
}

const rcmSteps = [
  { agent: 'Harper', title: 'Patient Registration & Eligibility Verification', desc: 'Harper verifies insurance and benefits before every appointment, eliminating eligibility denials at the source.' },
  { agent: 'Olivia', title: 'Prior Authorization Management', desc: 'Olivia tracks and closes every open authorization, preventing procedural delays and timely filing lapses.' },
  { agent: 'Emily', title: 'Pre-Service Payment Collection', desc: 'Emily contacts patients 3–7 days before service with verified cost estimates, improving pre-service collection rates 30–40%.' },
  { agent: null, title: 'Charge Capture & Coding', desc: 'AAPC-certified coders ensure accurate CPT selection, modifier application, and clinical documentation alignment.' },
  { agent: null, title: 'Claim Scrubbing & Submission', desc: 'Payer-specific edits applied before every submission. Clean claims. Fast payments.' },
  { agent: 'Michael', title: 'Payment Posting & Reconciliation', desc: 'Michael investigates every payment against expected reimbursement, identifying underpayments before they age.' },
  { agent: 'Chris', title: 'AR Follow-Up & Denial Management', desc: 'Chris proactively contacts payers on pending claims. Human denial experts appeal with clinical rationale (95%+ appeal success).' },
  { agent: 'Cindy', title: 'Patient Billing & Collections', desc: 'Cindy handles patient balances in 50+ languages with real-time payment processing and payment plan options.' },
  { agent: null, title: 'Credentialing & Contracting', desc: 'Provider credentialing, re-credentialing, and contract analytics to protect appropriate payer reimbursement rates.' },
  { agent: null, title: 'Reporting & Analytics', desc: 'Real-time dashboards by provider, payer, procedure, and denial category. Weekly reviews and QBRs included.' },
]

const keyResults = [
  { label: '>98% Net Collection Rate' },
  { label: '>99% Clean Claim Rate' },
  { label: '48-Hour Charge Lag' },
  { label: '<15% AR >90 Days' },
  { label: 'Up to 30% Revenue Growth within 12 months' },
]

export default function RCMPage() {
  return (
    <main>
      <PageHero
        label="COMPREHENSIVE RCM"
        title="End-to-End Revenue Cycle Management. Every Step. Every Dollar."
        subtitle="We manage your entire revenue cycle — patient registration to final payment — with specialty-trained teams and Real + Artificial Intelligence eliminating revenue leakage at every stage."
        ctaText="Get Your Free Comprehensive RCM Assessment"
        ctaHref="/contact"
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <RevealOnScroll>
            <div className="section-label">THE CHALLENGE</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="section-desc" style={{ maxWidth: '100%', fontSize: 17, lineHeight: 1.8 }}>
              Most practices manage their revenue cycle in disconnected pieces. Every handoff is a gap. Every gap is lost revenue.
              Comprehensive RCM eliminates those gaps. One accountable team. AI handles volume; human specialists own judgment calls —
              complex coding, denial strategy, underpayment recovery, and payer negotiation. One dashboard. One team. End-to-end.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">THE COMPLETE REVENUE CYCLE</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">What We Manage — Every Step</div>
          </RevealOnScroll>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 48, maxWidth: 860, margin: '48px auto 0' }}>
            {rcmSteps.map((step, i) => (
              <RevealOnScroll key={i}>
                <div style={{
                  display: 'flex',
                  gap: 20,
                  padding: 28,
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-200)',
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    flexShrink: 0,
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: step.agent ? 'var(--primary)' : 'var(--gray-200)',
                    color: step.agent ? 'white' : 'var(--gray-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 600,
                  }}>{String(i + 1).padStart(2, '0')}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <h4 style={{ fontSize: 16, fontWeight: 500, color: 'var(--gray-900)' }}>{step.title}</h4>
                      {step.agent && (
                        <span style={{
                          fontSize: 11,
                          padding: '2px 10px',
                          background: 'var(--primary-ghost)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--primary)',
                          fontWeight: 500,
                        }}>AI: {step.agent}</span>
                      )}
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--gray-600)' }}>{step.desc}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <RevealOnScroll>
            <div className="section-label">KEY RESULTS</div>
          </RevealOnScroll>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginTop: 32 }}>
            {keyResults.map((r, i) => (
              <RevealOnScroll key={i}>
                <div style={{
                  padding: '16px 28px',
                  background: 'var(--primary)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 400,
                }}>{r.label}</div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  )
}
