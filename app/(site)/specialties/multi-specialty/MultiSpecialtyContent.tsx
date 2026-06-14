'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import SpecialtyMarquee, { type SpecialtySolution } from '@/components/sections/SpecialtyMarquee'

// "What Sets Us Apart" cards per Specialty Pages doc (v1, May
// 19 2026), section 6 "Multi-Specialty". 3 cards verbatim from
// doc.
const advantages = [
  {
    // Stacked-cards / layered-rectangles — "multiple
    // specialties unified under one team"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" /></svg>,
    t: 'One Partner for Every Specialty',
    d: 'Most practices use different vendors for different departments. Or have one vendor that\u2019s mediocre across the board. We\u2019re built to manage multiple specialties at a high level, under one team.',
  },
  {
    // Shield-with-checkmark — "prevent denials" (same icon as
    // the other specialty pages for this same advantage line)
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    t: 'We Don\u2019t Just Recover Denials. We Prevent Them',
    d: 'Root cause reviews across all your specialties. A denial pattern in one department might be a systemic workflow issue. We catch it and fix it for everyone.',
  },
  {
    // Chart-bar-square (dashboard) — "everything in one place"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>,
    t: 'You See Everything in One Place',
    d: 'No more logging into three portals to understand your revenue. One dashboard shows every specialty, every provider, every payer, every denial. Live.',
  },
]

// Testimonials per doc, section 6. Both attributions verbatim.
const testimonials = [
  {
    tag: 'Multi-Specialty',
    quote: 'Cosentus has been an integral part of helping us continue to grow our business, in spite of our hiring challenges post-Covid. The level of accountability is awesome.',
    name: 'Jeff Leonard',
    role: 'CFO, Pacific Medical, Inc',
  },
  {
    tag: 'Multi-Specialty',
    quote: 'Cosentus transformed our billing process, enhancing both efficiency and compliance. Their accountability and detailed explanations on billing issues have been invaluable.',
    name: 'Dr. Dan Vasile',
    role: 'Founder & CEO, Meridian Urgent Care and Occupational Health',
  },
]

// "RCM Solutions: Complete Multi-Specialty Revenue Cycle" — 8
// cards per Specialty Pages doc (v1, May 19 2026), section 6.
// Content verbatim from doc with minor punctuation cleanup
// (doc has stray period-then-lowercase fragments).
//
// Animation map (all 8 unique):
//   Card 1 'modifiers' — CPT codes drawn from six different
//     specialties to make the "multi-department coding" point
//     visually: 99213 (E/M), 27447 (knee replacement),
//     90834 (therapy), 00100 (anesthesia), 64483 (epidural),
//     93000 (EKG). Length 5 each, matches BH's pill width.
//   Card 2 'badges' — 3 check circles = "enrolled, registered,
//     approved" rhythm for credentialing.
//   Card 3 'eligibility' — insurance card outline + pulsing
//     verification check badge. Reads directly as "patient's
//     coverage verified" for each cycle. Earlier draft used
//     'rules' (4x3 grid sweep) which preview feedback flagged
//     as having no semantic connection to eligibility — a grid
//     of cells reads as "data" not "insurance verification".
//   Card 4 'stamp' — Prior Auth uses 'stamp' on every specialty
//     page (consistency).
//   Card 5 'defense' — document + shield-check = "root cause
//     review + appeal".
//   Card 6 'languages' — Cindy (50+ languages) — consistent
//     across all specialty pages.
//   Card 7 'pulse' — Chris (phone + rings) — consistent across
//     specialty pages that have a Chris card.
//   Card 8 'chart' — Analytics card uses 'chart' on every
//     specialty page (consistency).
const solutions: SpecialtySolution[] = [
  {
    eyebrow: 'MULTI-DEPARTMENT',
    title: 'Multi-Department Coding',
    description: 'Accurate coding across all specialties under one roof. Whether it\u2019s E/M, surgical, or procedural. One team handles it.',
    anim: 'modifiers',
    modifierLabels: ['99213', '27447', '90834', '00100', '64483', '93000'],
  },
  {
    eyebrow: 'UNIFIED CREDENTIALING',
    title: 'Unified Credentialing',
    description: 'Provider enrollment managed across all payers and service lines. One process, not five.',
    anim: 'badges',
  },
  {
    eyebrow: 'CROSS-SPECIALTY',
    title: 'Cross-Specialty Eligibility',
    description: 'Live insurance verification for every encounter, every department. No gaps between service lines.',
    anim: 'eligibility',
  },
  {
    eyebrow: 'AUTHORIZATIONS',
    title: 'Prior Authorization',
    description: 'Authorizations managed across all specialties. One tracking system, one follow-up process. Nothing falls through the cracks.',
    anim: 'stamp',
  },
  {
    eyebrow: 'ROOT CAUSE',
    title: 'Denial Management',
    description: 'Root cause reviews that spot patterns across specialties. A denial trend in one department might reveal a systemic issue affecting all of them.',
    anim: 'defense',
  },
  {
    eyebrow: 'AI AGENT \u2014 CINDY',
    title: 'Patient Billing & Collections',
    description: 'Cindy handles patient balances across all departments in over 50 languages. One patient experience, regardless of which specialty they visited.',
    anim: 'languages',
    agent: { name: 'Cindy', img: 'cindy.png' },
  },
  {
    eyebrow: 'AI AGENT \u2014 CHRIS',
    title: 'AR Follow-Up',
    description: 'Chris calls payers for claim status across all your service lines. No department-by-department follow-up headaches.',
    anim: 'pulse',
    agent: { name: 'Chris', img: 'chris.png' },
  },
  {
    eyebrow: 'REAL-TIME INSIGHTS',
    title: 'Unified Analytics',
    description: 'One dashboard. Every specialty. Every provider. Every payer. Every dollar. See the full picture for the first time.',
    anim: 'chart',
  },
]

export default function MultiSpecialtyContent() {
  return (
    <>
      {/* The Problem / Solution split panel — same inline shape
          as the other specialty pages. Content per Specialty
          Pages doc (v1) section 6 "Multi-Specialty". */}
      <section style={{ overflow: 'hidden' }}>
        <div className="problem-solution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 400 }}>
          <div className="ps-panel ps-problem" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: 'var(--white)', position: 'relative' }}>
            <RevealOnScroll direction="left" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 28 }}>
                Multiple Specialties. Multiplied Complexity.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Different coding rules across departments create denial risk when billers switch between specialties',
                  'Staff juggling multiple specialties lose accuracy and speed, errors that compound across volume',
                  'No single vendor seems to understand all of your service lines, so you end up managing multiple relationships',
                  'Reporting is fragmented. No unified view of how each specialty, provider, and payer is actually performing',
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
                One Team Built for Breadth. AI Built for Scale.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Multi-specialty trained team that understands coding and payer rules across all your service lines',
                  'AI handles eligibility, authorization, and follow-ups across every department at the same time',
                  'Unified reporting dashboard: see performance by specialty, provider, and payer in one place',
                  'Root cause reviews across all specialties to prevent systemic denial patterns, not just one-off issues',
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


      {/* What Sets Us Apart — 3 cards per Specialty Pages doc. */}
      <section className="section">
        <div className="container">
          <RevealOnScroll><div className="section-title">What Sets Us Apart</div></RevealOnScroll>

          <div className="advantage-grid advantages-desktop" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 48 }}>
            {advantages.map((a, i) => (
              <RevealOnScroll key={i} direction="scale" delay={0.15 + i * 0.1}>
                <div className="advantage-card">
                  <div className="advantage-icon">{a.icon}</div>
                  <h4>{a.t}</h4>
                  <p>{a.d}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          <div className="advantages-mobile" style={{ marginTop: 32 }}>
            <MobileCarousel autoScrollInterval={4000}>
              {advantages.map((a, i) => (
                <div key={i} className="advantage-card">
                  <div className="advantage-icon">{a.icon}</div>
                  <h4>{a.t}</h4>
                  <p>{a.d}</p>
                </div>
              ))}
            </MobileCarousel>
          </div>
        </div>
      </section>


      {/* RCM Solutions: Complete Multi-Specialty Revenue Cycle.
          Shared SpecialtyMarquee component (grid mode). */}
      <section className="section section-specialty-grid">
        <div className="container">
          <RevealOnScroll><div className="section-title">Complete Multi-Specialty Revenue Cycle</div></RevealOnScroll>
        </div>

        <SpecialtyMarquee items={solutions} layout="grid" />
      </section>


      {/* Leadership.
          Doc lists this as "TBD - Multi-specialty leadership
          team to be confirmed", described as "well-versed
          across all specialties generalists". Placeholder until
          names are signed off. Same pattern as Pain Management
          and ASC. */}
      <section className="section" id="leadership">
        <div className="container">
          <RevealOnScroll><div className="section-title">Multi-Specialty Leadership</div></RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', maxWidth: 720, marginTop: 16 }}>
              Cross-specialty leadership team with deep generalist expertise across coding, payer rules, and operations. Full team profiles publishing soon.
            </p>
          </RevealOnScroll>
        </div>
      </section>


      {/* Client Reviews — shared TestimonialsSection */}
      <TestimonialsSection
        testimonials={testimonials}
        label="CLIENT REVIEWS"
        title={<>What Our <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Clients</span> Say.</>}
      />
    </>
  )
}
