'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'
import AgentSpotlightCard from '@/components/voice/AgentSpotlightCard'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import SpecialtyMarquee, { type SpecialtySolution } from '@/components/sections/SpecialtyMarquee'

// "What Sets Us Apart" cards. Content per Specialty Pages doc
// (v1, May 19 2026), section 2 "Orthopedics". Exactly 3 cards
// per the doc, replacing the previous standalone Alta callout
// (the 2025 Alta acquisition now lives inside card 3).
const advantages = [
  {
    // Focused-target icon — "ortho is what we do all day"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></svg>,
    t: 'Orthopedics Is What Our Team Does. All Day.',
    d: 'Modifiers, implant pass-throughs, global periods, workers\u2019 comp. Our ortho team doesn\u2019t switch to behavioral health after lunch. They stay in their lane.',
  },
  {
    // Shield-with-checkmark — "prevent denials"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    t: 'We Don\u2019t Just Recover Denials. We Prevent Them',
    d: 'Every denied claim gets a root cause review. Ortho denials are high-dollar, so we don\u2019t just appeal. We fix the pattern so it stops happening.',
  },
  {
    // Building / practice icon — "real surgical practice experience"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
    t: 'Built on Real Surgical Practice Experience',
    d: 'In 2025, Cosentus acquired Alta Management Solutions, expanding our orthopedic and surgical billing expertise with a team that has managed ASC and ortho revenue cycles for years.',
  },
]

// Testimonials per Specialty Pages doc (v1, May 19 2026). T1
// replaces the previous Ryan King quote with Dr. Jothi
// Murali-Larson per doc. T2 keeps the Sharma testimonial with
// the doc-verbatim quote (slightly different wording from the
// previous version on the page).
const testimonials = [
  {
    tag: 'Orthopedic',
    quote: 'Cosentus has been efficient, responsive, and personable in managing my revenue cycle. I have seen my revenue grow tremendously. I highly recommend them.',
    name: 'Dr. Jothi Murali-Larson',
    role: 'Orthopedic Surgeon',
  },
  {
    tag: 'Orthopedic',
    quote: 'My collections have significantly increased with their stewardship. They have always been available to answer my questions.',
    name: 'Dr. Samir and Kavita Sharma',
    role: 'South Bay Orthopedics, San Jose, CA',
  },
]

// "RCM Solutions: Complete Orthopedic Revenue Cycle" — 8 cards
// per Specialty Pages doc (v1, May 19 2026). Content verbatim
// from doc. Modifier labels (59, XE, XS, XP, 51, 50) supplied
// to the shared 'modifiers' anim. References to Chris and Cindy
// match the AI agents introduced on the homepage.
const solutions: SpecialtySolution[] = [
  {
    eyebrow: 'SURGICAL EXPERTISE',
    title: 'Orthopedic-Specific Coding',
    description: 'Modifiers, laterality, global periods, multi-procedure surgical cases. Coded by specialists who live in orthopedic CPT codes every day.',
    anim: 'modifiers',
    modifierLabels: ['59', 'XE', 'XS', 'XP', '51', '50'],
  },
  {
    eyebrow: 'PASS-THROUGH ACCURACY',
    title: 'Implant & Supply Billing',
    description: 'Accurate documentation, pass-through billing, and cost reconciliation for implants, hardware, and surgical supplies.',
    anim: 'badges',
  },
  {
    eyebrow: 'CASE-TYPE EXPERTISE',
    title: 'Workers\u2019 Comp & Personal Injury',
    description: 'Different payer rules, different timelines, different documentation. Our team manages WC and PI cases separately with specialty knowledge.',
    anim: 'rules',
  },
  {
    eyebrow: 'AUTHORIZATIONS',
    title: 'Prior Authorization',
    description: 'Authorizations for scheduled surgeries, MRIs, and procedures tracked and cleared before the date of service.',
    anim: 'stamp',
  },
  {
    eyebrow: 'DENIAL PREVENTION',
    title: 'Denial Management & Appeals',
    description: 'Ortho denials are high-dollar. We appeal with clinical evidence, operative notes, and strategies built for each payer. Root cause analysis on every one.',
    anim: 'stat',
    statValue: '95',
    statUnit: '%',
  },
  {
    eyebrow: 'AI AGENT \u2014 CHRIS',
    title: 'AR Follow-Up & Collections',
    description: 'Chris calls payers for claim status, surgical case follow-ups, and escalations. Your staff stays focused on patients, not phone queues.',
    anim: 'pulse',
    agent: { name: 'Chris', img: 'chris.png' },
  },
  {
    eyebrow: 'AI AGENT \u2014 CINDY',
    title: 'Patient Billing & Support',
    description: 'Cindy handles patient balances, co-pay follow-ups, and payment plans in over 50 languages. Clear statements, not confusing bills.',
    anim: 'languages',
    agent: { name: 'Cindy', img: 'cindy.png' },
  },
  {
    eyebrow: 'REAL-TIME INSIGHTS',
    title: 'Analytics & Visibility',
    description: 'See collections by surgeon, procedure type, payer, and denial category. Know where your revenue is going as it happens.',
    anim: 'chart',
  },
]

export default function OrthopedicsContent() {
  return (
    <>
      {/* The Problem / Solution split panel.
          Inline JSX mirroring the Anesthesia page layout so the
          two specialty pages feel like the same shape — not the
          older ProblemSolutionSection component, which has a
          different visual treatment. Both panels use
          justifyContent: flex-start so the two headlines sit at
          the same vertical position. Bullets at 18px to match
          Anesthesia. Content per Specialty Pages doc (v1) section
          2 "Orthopedics". */}
      <section style={{ overflow: 'hidden' }}>
        <div className="problem-solution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 400 }}>
          <div className="ps-panel ps-problem" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: 'var(--white)', position: 'relative' }}>
            <RevealOnScroll direction="left" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 28 }}>
                High-Value Cases. Predictable Revenue Leakage.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Modifier errors on multi-procedure surgical cases cost hundreds of dollars per visit and multiply across volume',
                  'Implant pass-through billing is complex and frequently underpaid or missed entirely',
                  'Workers\u2019 comp and personal injury cases carry different billing rules that generic teams get wrong',
                  'Global period confusion leads to bundled services that should have been billed separately',
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
                Surgical Practice Veterans + AI
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Orthopedic billing specialists who understand modifiers, global periods, implant pass-throughs, and workers\u2019 comp, because that\u2019s their full-time job',
                  'AI handles eligibility, authorization tracking, and claim follow-up across your full volume',
                  'Every denied claim gets a root cause review. Ortho denials are high-dollar, so every appeal matters',
                  'Live visibility into collections by procedure, provider, payer, and case type',
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


      {/* RCM Solutions: Complete Orthopedic Revenue Cycle.
          Uses the shared SpecialtyMarquee component in grid mode. */}
      <section className="section section-specialty-grid">
        <div className="container">
          <RevealOnScroll><div className="section-title">Complete Orthopedic Revenue Cycle</div></RevealOnScroll>
        </div>

        <SpecialtyMarquee items={solutions} layout="grid" />
      </section>


      {/* AI Agent Spotlight, Paige (Prior Authorization).
          Kept in place — not in the doc but adds value the same
          way Priya does on the Anesthesia page. */}
      <section className="section">
        <div className="container">
          <div className="specialty-spotlight-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <RevealOnScroll direction="left">
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 20 }}>
                  Prior Authorization Management
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', marginBottom: 32 }}>
                  Paige tracks and clears authorizations for scheduled orthopedic procedures, knee replacements, spinal fusions, arthroscopic surgeries. Zero procedural delays. Zero OR schedule disruptions.
                </p>
                <div style={{ display: 'flex', gap: 32 }}>
                  <div>
                    <div style={{ fontSize: 32, fontWeight: 300, color: 'var(--primary)' }}>Zero</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Procedural Delays</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 32, fontWeight: 300, color: 'var(--primary)' }}>24/7</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Auth Tracking</div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <AgentSpotlightCard
                  agentName="Paige"
                  imgAlt="Paige, Prior Authorization Management"
                  roleLabel="Prior Auth Tracking Specialist"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>


      {/* Leadership.
          Per Specialty Pages doc, ortho leadership is "TBD — to
          be confirmed by Stephen/Allen". Keeping the placeholder
          rather than putting names that haven't been signed off. */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll><div className="section-title">Orthopedic Leadership</div></RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', maxWidth: 720, marginTop: 16 }}>
              Surgical practice veterans with deep orthopedic and ASC expertise, strengthened by the 2025 Alta Management Solutions acquisition. Full team profiles publishing soon.
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
