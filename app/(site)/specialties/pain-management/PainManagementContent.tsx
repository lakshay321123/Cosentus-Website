'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'
import AgentSpotlightCard from '@/components/voice/AgentSpotlightCard'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import SpecialtyMarquee, { type SpecialtySolution } from '@/components/sections/SpecialtyMarquee'

// "What Sets Us Apart" cards per Specialty Pages doc (v1, May
// 19 2026), section 3 "Pain Management". 3 cards verbatim from
// doc.
const advantages = [
  {
    // Focused-target icon — "interventional pain is all we do"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></svg>,
    t: 'Interventional Pain Is All Our Team Does',
    d: 'Our pain management team knows the difference between a 64633 and a 64635 in their sleep. Interventional coding is what they do. All day, every day.',
  },
  {
    // Shield-with-checkmark — "prevent denials"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    t: 'We Don\u2019t Just Recover Denials. We Prevent Them',
    d: 'Pain management claims face pre-payment reviews, frequency scrutiny, and medical necessity challenges. We perform root cause review and correct documentation patterns to stop future denials.',
  },
  {
    // Magnifying glass — "we know what payers are looking for"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
    t: 'We Know What Payers Are Looking For',
    d: 'Every payer has different rules for pain procedures. Our team tracks these rules, updates workflows, and makes sure your documentation matches what each payer requires. Before the claim goes out.',
  },
]

// Testimonials per Specialty Pages doc (v1, May 19 2026).
const testimonials = [
  {
    tag: 'Pain Management',
    quote: 'I have been working with Cosentus for several years. I appreciate the personal touch they add to their service. Thank you very much!',
    name: 'Dr. Mikko Murakami, QME',
    role: 'Pain Medicine & PM&R',
  },
  {
    tag: 'Pain Management',
    quote: 'I\u2019ve been in practice for nearly 20 years and Cosentus has provided nothing but positive experiences. Highly recommend without reservations.',
    name: 'Justin Lo, MD',
    role: 'President, Northern California Pain Specialists',
  },
]

// "RCM Solutions: Complete Pain Management Revenue Cycle" — 8
// cards per Specialty Pages doc (v1, May 19 2026). Content
// verbatim from doc.
//
// Note vs. Anesthesia/Orthopedics: the doc deliberately omits an
// "AR Follow-Up & Collections" Chris card on Pain Management.
// Only Cindy appears, on Card 7 "Patient Billing & Support".
//
// Card 3 uses the bespoke 'defense' animation (document + shield-
// check pulse) — earlier draft used 'badges' (3 floating ticks)
// which preview feedback said didn't connect to documentation
// defense. Card 5 uses the bespoke 'meds' animation (capsule
// pills cycling) — earlier draft reused 'pulse' (phone rings)
// which preview feedback flagged as visually reading as "call",
// not medication.
//
// Modifier labels chosen to match the doc card's emphasis on
// "modifiers for laterality and imaging guidance":
//   LT/RT/50 = laterality, 26 = imaging guidance pro component,
//   59/51 = multi-procedure.
const solutions: SpecialtySolution[] = [
  {
    eyebrow: 'INTERVENTIONAL CODING',
    title: 'Interventional Procedure Coding',
    description: 'Epidural, facet, sacroiliac, trigger point, nerve block, RFA, SCS implants and trials. Precise CPT selection with correct modifiers for laterality and imaging guidance.',
    anim: 'modifiers',
    modifierLabels: ['LT', 'RT', '50', '26', '59', '51'],
  },
  {
    eyebrow: 'DOCUMENTATION DEFENSE',
    title: 'Medical Necessity & Documentation',
    description: 'We document what each payer requires before the claim goes out to reduce denials and defend pre-payment reviews.',
    anim: 'rules',
  },
  {
    eyebrow: 'PAYER DEFENSE',
    title: 'Pre-Payment Review Defense',
    description: 'When payers trigger reviews, we prepare and defend your documentation with clinical evidence.',
    anim: 'defense',
  },
  {
    eyebrow: 'AUTHORIZATIONS',
    title: 'Prior Authorization',
    description: 'Authorizations tracked and cleared for injections, SCS trials, ablations, and imaging-guided procedures. Payers scrutinize pain more than most. We make sure nothing stalls.',
    anim: 'stamp',
  },
  {
    eyebrow: 'MEDICATION OVERSIGHT',
    title: 'Medication Management & Drug Screening',
    description: 'Proper coding for medication management visits, drug screening, and related services.',
    anim: 'meds',
  },
  {
    eyebrow: 'DENIAL PREVENTION',
    title: 'Denial Management & Appeals',
    description: 'Methodical appeals with clinical evidence. Every denial gets a root cause review to fix the pattern, not just the claim.',
    anim: 'stat',
    statValue: '95',
    statUnit: '%',
  },
  {
    eyebrow: 'Ai AGENT \u2014 CINDY',
    title: 'Patient Billing & Support',
    description: 'Cindy handles patient balances and billing questions in over 50 languages. Clear statements for every visit.',
    anim: 'languages',
    agent: { name: 'Cindy', img: 'cindy.png' },
  },
  {
    eyebrow: 'REAL-TIME INSIGHTS',
    title: 'Analytics & Visibility',
    description: 'Dashboards showing collections by procedure, provider, payer, and denial category. See where your revenue is going.',
    anim: 'chart',
  },
]

export default function PainManagementContent() {
  return (
    <>
      {/* The Problem / Solution split panel — same inline shape
          as Anesthesia/Orthopedics. Content per Specialty Pages
          doc (v1) section 3 "Pain Management". */}
      <section style={{ overflow: 'hidden' }}>
        <div className="problem-solution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 400 }}>
          <div className="ps-panel ps-problem" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: 'var(--white)', position: 'relative' }}>
            <RevealOnScroll direction="left" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 28 }}>
                High-Frequency Procedures. High-Frequency Denials.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Payers scrutinize injection frequency, imaging guidance, and medical necessity more than almost any other specialty',
                  'Modifier or laterality errors cost $200\u2013$500 per visit and multiply fast across a high-volume pain practice',
                  'Pre-payment reviews and opioid-related documentation scrutiny add layers of risk',
                  'Authorization lapses on SCS trials, implants, and repeat procedures silently kill revenue',
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
                Interventional Coding Experts + Ai Defense
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Pain management specialists who handle interventional coding and payer defense as their full-time job',
                  'Ai automates eligibility verification, authorization tracking, and follow-ups across your full volume',
                  'Human experts focus on documentation defense, medical necessity arguments, and appeals',
                  '95%+ appeal success rate with clinical evidence built by people who understand pain procedures',
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


      {/* RCM Solutions: Complete Pain Management Revenue Cycle.
          Shared SpecialtyMarquee component (grid mode). */}
      <section className="section section-specialty-grid">
        <div className="container">
          <RevealOnScroll><div className="section-title">Complete Pain Management Revenue Cycle</div></RevealOnScroll>
        </div>

        <SpecialtyMarquee items={solutions} layout="grid" />
      </section>


      {/* AI Agent Spotlight, Paige (Prior Authorization).
          Kept in place — same supporting role as the Paige
          spotlight on Orthopedics and the Priya spotlight on
          Anesthesia. Elaborates on the Prior Authorization card
          in the marquee above. */}
      <section className="section">
        <div className="container">
          <div className="specialty-spotlight-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <RevealOnScroll direction="left">
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 20 }}>
                  Prior Authorization Management
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', marginBottom: 32 }}>
                  Paige tracks authorizations for injections, SCS trials, ablations, and imaging-guided procedures. Payers scrutinize pain management more than most specialties. Paige makes sure nothing stalls.
                </p>
                <div style={{ display: 'flex', gap: 32 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.02em' }}>Zero</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Procedure Stalls</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.02em' }}>24/7</div>
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
          Per Specialty Pages doc, Pain Management leadership is
          "TBD - to be confirmed". Placeholder until names are
          signed off. */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll><div className="section-title">Pain Management Leadership</div></RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', maxWidth: 720, marginTop: 16 }}>
              Interventional coding specialists with deep payer-defense expertise. Full team profiles publishing soon.
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
