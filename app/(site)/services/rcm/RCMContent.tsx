'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'
import ResultsSection from '@/components/sections/ResultsSection'
import SpecialtyMarquee, { type SpecialtySolution } from '@/components/sections/SpecialtyMarquee'

// 10 RCM steps rendered through the shared SpecialtyMarquee
// component (the same drag-to-scrub carousel used on every
// specialty page). Each card maps to one AnimKind from the
// SpecialtyMarquee anim library — all 10 unique on this page,
// drawing from 10 of the 12 available kinds.
//
// Animation map (rationale per card):
//   1  Eligibility Verification (Elly)   -> 'eligibility'
//        Insurance card + verification check. Direct visual
//        match for "verifies insurance and benefits."
//   2  Prior Authorization (Paige)       -> 'stamp'
//        Progress bar + APPROVED label. Consistent with how
//        Prior Auth is rendered on every specialty page.
//   3  Pre-Service Collection (Priya)    -> 'stat'
//        Big number + rising bars. statValue="40" / statUnit="%"
//        carries the "30-40% higher pre-service collection"
//        figure from the card description.
//   4  Charge Capture & Coding (Connie)  -> 'modifiers'
//        CPT modifier code pills cycling. Direct match for the
//        coding theme. Labels are real modifiers commonly used
//        in surgical/procedural coding.
//   5  Claim Scrubbing & Submission      -> 'rules'
//        4x3 grid wave = payer-specific edits being applied
//        across many rule cells.
//   6  Payment Posting & Reconciliation  -> 'badges'
//        3 check circles = received / matched / reconciled.
//        Rhythm of a payment moving through posting.
//   7  AR Follow-Up & Denials (Chris)    -> 'pulse'
//        Phone + 3 pulse rings. Chris's signature card across
//        the site.
//   8  Patient Billing (Cindy)           -> 'languages'
//        Three multilingual chat bubbles. Cindy's signature
//        card across the site.
//   9  Credentialing & Contracting       -> 'defense'
//        Document + shield-check pulse. Credentialing is
//        document-driven payer verification — the doc reads
//        as the credential packet, the shield-check as payer
//        approval.
//  10  Reporting & Analytics             -> 'chart'
//        Bar chart with staggered scale. The canonical
//        analytics card on every specialty page.
//
// The two AnimKinds not used here ('meds' and 'telehealth') are
// domain-specific to Behavioral Health / Pain Management and
// don't have a natural home in a cross-specialty RCM flow.
const rcmSteps: SpecialtySolution[] = [
  {
    eyebrow: 'INSURANCE VERIFICATION',
    title: 'Eligibility Verification',
    description: 'Elly verifies insurance and benefits before every appointment, eliminating eligibility denials at the source.',
    anim: 'eligibility',
    agent: { name: 'Elly', img: 'elly.png' },
  },
  {
    eyebrow: 'AUTHORIZATIONS',
    title: 'Prior Authorization',
    description: 'Paige tracks every open authorization, preventing procedural delays and timely filing lapses.',
    anim: 'stamp',
    agent: { name: 'Paige', img: 'paige.png' },
  },
  {
    eyebrow: 'PRE-SERVICE',
    title: 'Pre-Service Collection',
    description: 'Priya contacts patients 3\u20137 days before service with verified cost estimates. 30\u201340% higher collection rates.',
    anim: 'stat',
    statValue: '40',
    statUnit: '%',
    agent: { name: 'Priya', img: 'priya.png' },
  },
  {
    eyebrow: 'CHARGE CAPTURE',
    title: 'Coding & Capture',
    description: 'AAPC-certified coders ensure accurate CPT selection, modifier application, and clinical documentation alignment. Connie assists with code suggestions and accuracy checks.',
    anim: 'modifiers',
    modifierLabels: ['59', 'XE', 'XS', '51', 'LT', '25'],
    agent: { name: 'Connie', img: 'connie.png' },
  },
  {
    eyebrow: 'CLAIM SCRUBBING',
    title: 'Claim Scrubbing & Submission',
    description: 'Payer-specific edits applied before every submission. Clean claims. Fast payments.',
    anim: 'rules',
  },
  {
    eyebrow: 'PAYMENT POSTING',
    title: 'Payment Posting & Reconciliation',
    description: 'Ariel tracks aging claims and identifies payment delays. Underpayments and reconciliation discrepancies escalate to specialists for resolution.',
    anim: 'badges',
    agent: { name: 'Ariel', img: 'ariel.png' },
  },
  {
    eyebrow: 'AR & DENIALS',
    title: 'AR Follow-Up & Denials',
    description: 'Chris contacts payers proactively. Human denial experts appeal with clinical rationale. 95%+ success.',
    anim: 'pulse',
    agent: { name: 'Chris', img: 'chris.png' },
  },
  {
    eyebrow: 'PATIENT COLLECTIONS',
    title: 'Patient Billing & Collections',
    description: 'Cindy handles balances in 50+ languages with real-time payment processing and payment plan options.',
    anim: 'languages',
    agent: { name: 'Cindy', img: 'cindy.png' },
  },
  {
    eyebrow: 'CREDENTIALING',
    title: 'Credentialing & Contracting',
    description: 'Provider credentialing, re-credentialing, and contract analytics to protect reimbursement rates.',
    anim: 'defense',
  },
  {
    eyebrow: 'REPORTING',
    title: 'Reporting & Analytics',
    description: 'Real-time dashboards by provider, payer, procedure, and denial category. Weekly reviews and QBRs included.',
    anim: 'chart',
  },
]

export default function RCMContent() {
  return (
    <>
      {/* The Challenge */}
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div>
            <RevealOnScroll delay={0.1}>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, color: 'var(--gray-900)', lineHeight: 1.3, marginBottom: 24, fontFamily: 'var(--font-display)' }}>
                Disconnected Revenue Cycles Leak Revenue
              </h2>
            </RevealOnScroll>
            <RevealOnScroll delay={0.2}>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--gray-600)' }}>
                Most practices manage their revenue cycle in disconnected pieces. Every handoff is a gap. Every gap is lost revenue. End-to-End RCM eliminates those gaps with one accountable team, every step, every dollar.
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Problem / Solution split panel — inline implementation
          matching the pattern used by every /specialties/* page
          (BH/Pain/ASC/Ortho/Anesthesia/Multi). Bullets bumped
          from the older ProblemSolutionSection's 14px to 18px
          for readability parity with the specialty pages. Count
          reduced from 6 to 4 per panel per user direction
          ("just see the main four points"). Kept the four
          highest-leverage revenue-leak categories on the problem
          side (eligibility / auth / coding / AR aging) and
          mirrored them on the solution side. */}
      <section style={{ overflow: 'hidden' }}>
        <div className="problem-solution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 400 }}>
          <div className="ps-panel ps-problem" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: 'var(--white)', position: 'relative' }}>
            <RevealOnScroll direction="left" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 28 }}>
                Where Practices Lose Revenue.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Eligibility errors caught after the visit, not before',
                  'Manual prior authorizations missing payer deadlines',
                  'Coding gaps and missed modifiers leaving money on the table',
                  'AR creeping past 90 days with no active recovery',
                ].map((bullet, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 18, lineHeight: 1.6, color: 'var(--gray-700)', marginBottom: 18 }}>
                    <span aria-hidden="true" style={{ flexShrink: 0, width: 7, height: 7, borderRadius: '50%', background: '#00B5D6', marginTop: 10 }} />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          </div>

          <div className="ps-panel ps-solution" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: '#00B5D6', position: 'relative', overflow: 'hidden' }}>
            <div className="ps-shimmer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            <RevealOnScroll direction="right" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'white', marginTop: 0, marginBottom: 28 }}>
                How We Plug The Leaks.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Real-time eligibility verification before every appointment',
                  'Authorization tracking with deadline alerts',
                  'AAPC-certified coders with AI-assisted accuracy checks',
                  'Active AR follow-up \u2014 under 15% AR over 90 days',
                ].map((bullet, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.95)', marginBottom: 18 }}>
                    <span aria-hidden="true" style={{ flexShrink: 0, width: 7, height: 7, borderRadius: '50%', background: 'white', marginTop: 10 }} />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          </div>
        </div>
      </section>


      {/* The 10-Step RCM Timeline — uses the shared SpecialtyMarquee
          component in grid mode (3 col desktop, 2 col mobile). Each
          step renders as a card with its own animation; agents (Elly /
          Paige / Priya / Connie / Ariel / Chris / Cindy) appear via
          the card's agent badge. Section title unchanged. */}
      <section className="section section-specialty-grid">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">10 Steps. One Team. Every Dollar.</div>
          </RevealOnScroll>
        </div>

        <SpecialtyMarquee items={rcmSteps} layout="grid" />
      </section>


      {/* Results / Outcomes — dropped in the home page's
          ResultsSection component (6 arrow-shape stat cards with
          flip cards). Wrapped in .rcm-results-on-teal so the
          section renders on a solid teal panel with white text. */}
      <div className="rcm-results-on-teal">
        <ResultsSection />
      </div>
    </>
  )
}
