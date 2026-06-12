'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'
import AgentSpotlightCard from '@/components/voice/AgentSpotlightCard'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import SpecialtyMarquee, { type SpecialtySolution } from '@/components/sections/SpecialtyMarquee'

// "What Sets Us Apart" cards per Specialty Pages doc (v1, May
// 19 2026), section 4 "ASCs". 3 cards verbatim from doc.
const advantages = [
  {
    // Two-arrows icon — "we manage both fee streams"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>,
    t: 'We Manage Both Fee Streams',
    d: 'Most billing companies handle facility OR professional billing. We manage both. Coordinated under one team, one dashboard, one process.',
  },
  {
    // Shield-with-checkmark — "prevent denials" (same icon as
    // Anesthesia/Orthopedics/Pain card 2 for consistency)
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    t: 'We Don\u2019t Just Recover Denials. We Prevent Them',
    d: 'High case volume creates high denial volume. Unless you fix the root cause. We analyze every denial across facility and professional streams to stop repeat issues.',
  },
  {
    // Chart-bar icon — "ASC economics"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
    t: 'We Know ASC Economics',
    d: 'Case costing, implant pass-throughs, block time utilization, payer mix. Our team understands the business side of running a surgery center, not just the billing side.',
  },
]

// Testimonials.
// Doc T1 attributes the quote to "ASC Administrator"
// (anonymized). The broader Cosentus website messaging doc
// (Mar 2026 v5) attributes the same quote to "John Welsh,
// M.D.". The named attribution is more specific and is
// already on the live site, so keeping it here.
//
// Per user direction (Jun 2026) this page represents the combined
// Ambulatory Services specialty (orthopedics + pain + ASC), so two
// testimonials each are copied verbatim from the Orthopedics and
// Pain Management pages alongside the ASC one (5 total). Tags are
// left as their source specialty on purpose.
const testimonials = [
  {
    tag: 'ASC',
    quote: 'Cosentus has truly been fantastic in all aspects. The job they have done on the outstanding balances saved our surgery center.',
    name: 'John Welsh, M.D.',
    role: 'Surgery Center',
  },
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

// "RCM Solutions: Complete ASC Revenue Cycle" — 8 cards per
// Specialty Pages doc (v1, May 19 2026). Content verbatim from
// doc.
//
// Note vs. Anesthesia/Orthopedics: like Pain Management, the doc
// deliberately omits an "AR Follow-Up & Collections" Chris card
// on ASC. Only Cindy appears (Card 7 Patient Billing &
// Pre-Service Collections).
//
// Card 1 modifier labels are real ASC-relevant modifiers:
//   SG = ASC facility service
//   TC = technical component (facility-side)
//   26 = professional component (interpretation/pro-side)
//   51 = multiple procedures
//   59 = distinct procedural service
//   50 = bilateral procedure
//
// Card 2 uses 'stat' with statValue '23' / statUnit '%' as a
// representative case-margin reference. The card title +
// description carry the specific context (case profitability
// analysis).
//
// Card 6 uses the bespoke 'defense' animation (document +
// shield-check) — appeals are documentation defense, and
// 'defense' fits as well as it does for Pain's pre-payment
// review card.
const solutions: SpecialtySolution[] = [
  {
    eyebrow: 'TWO FEE STREAMS',
    title: 'Facility & Professional Fee Billing',
    description: 'Coordinated billing streams for accurate reimbursements. No missed charges on either side.',
    anim: 'modifiers',
    modifierLabels: ['SG', 'TC', '26', '51', '59', '50'],
  },
  {
    eyebrow: 'CASE PROFITABILITY',
    title: 'Case Costing & Profitability Analysis',
    description: 'Track costs and reimbursements by procedure, surgeon, and payer. Know which cases make money and which don\u2019t.',
    anim: 'stat',
    statValue: '23',
    statUnit: '%',
  },
  {
    eyebrow: 'PASS-THROUGH ACCURACY',
    title: 'Implant & Supply Billing',
    description: 'Accurate documentation and pass-through billing for implants, hardware, and surgical supplies.',
    anim: 'badges',
  },
  {
    eyebrow: 'CONTRACT INTELLIGENCE',
    title: 'Multi-Payer Contract Management',
    description: 'Monitor reimbursements against contract rates. Flag underpayments. Know when a payer isn\u2019t paying what they agreed to.',
    anim: 'rules',
  },
  {
    eyebrow: 'AUTHORIZATIONS',
    title: 'Prior Authorization',
    description: 'Authorizations for scheduled surgeries tracked and cleared before the procedure date. No OR delays.',
    anim: 'stamp',
  },
  {
    eyebrow: 'DENIAL PREVENTION',
    title: 'Denial Management & Appeals',
    description: 'High case volume means high denial volume. Unless you stop them at the source. Root cause reviews across both fee streams.',
    anim: 'defense',
  },
  {
    eyebrow: 'AI AGENT \u2014 CINDY',
    title: 'Patient Billing & Pre-Service Collections',
    description: 'Patients get cost estimates before procedures. Cindy handles balances and payment plans in over 50 languages.',
    anim: 'languages',
    agent: { name: 'Cindy', img: 'cindy.png' },
  },
  {
    eyebrow: 'REAL-TIME INSIGHTS',
    title: 'Analytics & Visibility',
    description: 'Live dashboards showing profitability by case type, surgeon, payer, facility, and denial category.',
    anim: 'chart',
  },
]

export default function ASCContent() {
  return (
    <>
      {/* The Problem / Solution split panel — same inline shape
          as Anesthesia/Orthopedics/Pain. Re-themed for the combined
          Ambulatory Services page (orthopedics + pain + ASC) per user
          direction (Jun 2026). */}
      <section style={{ overflow: 'hidden' }}>
        <div className="problem-solution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 400 }}>
          <div className="ps-panel ps-problem" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: 'var(--white)', position: 'relative' }}>
            <RevealOnScroll direction="left" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 28 }}>
                High-Value Procedures. High-Volume Complexity. Revenue Slipping Through the Cracks.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Orthopedic cases carry high-dollar implant charges, modifier-heavy surgical billing, and global period rules that generic teams consistently misapply',
                  'Pain management faces relentless payer scrutiny on injection frequency, medical necessity, and pre-payment reviews — small coding errors at high volume add up fast',
                  'ASCs juggle dual billing streams (facility + professional), case costing, and multi-payer contracts where underpayments go unnoticed for months',
                  'When these specialties share a generic billing team, the nuances of each get lost — and so does revenue',
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
                Dedicated Ambulatory Teams + AI. Every Specialty Gets the Expertise It Demands.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Specialty-trained billing teams for orthopedics, pain management, and ASCs — each staffed with coders who work their specialty full time and understand the payer rules that apply to it',
                  'AI handles the high-volume, high-frequency work: eligibility verification, authorization tracking, claim follow-up, and patient outreach across all three specialties simultaneously',
                  'Every denied claim across any specialty gets a root cause review — our team doesn\u2019t just appeal, they fix the pattern so the same denial stops recurring',
                  'One unified dashboard gives you visibility into collections, denials, AR aging, and profitability across all your ambulatory operations',
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


      {/* Client Reviews — moved directly below the Problem/Solution
          section per user direction (Jun 2026). Shared
          TestimonialsSection; 5 cards (ASC + 2 Pain + 2 Ortho). */}
      <TestimonialsSection
        testimonials={testimonials}
        label="CLIENT REVIEWS"
        title={<>What Our <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Clients</span> Say.</>}
      />


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


      {/* RCM Solutions: Complete ASC Revenue Cycle.
          Shared SpecialtyMarquee component (grid mode). */}
      <section className="section section-specialty-grid">
        <div className="container">
          <RevealOnScroll><div className="section-title">Complete ASC Revenue Cycle</div></RevealOnScroll>
        </div>

        <SpecialtyMarquee items={solutions} layout="grid" />
      </section>


      {/* AI Agent Spotlight, Priya (Pre-Service Collection).
          Kept in place — same role as Priya on Anesthesia.
          Doc Card 7 mentions "Patients get cost estimates before
          procedures" — Priya is the agent that makes the calls.
          The spotlight elaborates on this sub-aspect of Card 7.
          (Card 7 in the marquee is Cindy for patient balances /
          payment plans; Priya is a separate workflow for
          pre-service estimates.) */}
      <section className="section">
        <div className="container">
          <div className="specialty-spotlight-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <RevealOnScroll direction="left">
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 20 }}>
                  Pre-Service Payment Collection
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', marginBottom: 32 }}>
                  Priya contacts patients before scheduled procedures with verified cost estimates, lifting pre-service collections 30–40% vs post-service billing. For ASCs running dozens of cases daily, that&apos;s thousands in accelerated revenue every week.
                </p>
                <div style={{ display: 'flex', gap: 32 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.02em' }}>30–40%</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Higher Collection Rate</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.02em' }}>3–7 Days</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Before Procedure</div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <AgentSpotlightCard
                  agentName="Priya"
                  imgAlt="Priya, Pre-Service Payment Collection"
                  roleLabel="Pre-Service Cost Estimates"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>


      {/* Leadership.
          Per Specialty Pages doc, ASC leadership is "TBD - to be
          confirmed", with Brandon as Director Orthopedic & ASC
          Services. Keeping placeholder until names are signed off
          (same approach as Orthopedics + Pain Management). */}
      {/* ASC Leadership section temporarily hidden per user direction
          (Jun 2026). Kept in code (commented, NOT deleted) for an easy
          restore — un-comment the block below to bring it back:
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll><div className="section-title">ASC Leadership</div></RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', maxWidth: 720, marginTop: 16 }}>
              ASC and surgical practice management veterans, strengthened by the 2025 Alta Management Solutions acquisition. Full team profiles publishing soon.
            </p>
          </RevealOnScroll>
        </div>
      </section>
      */}
    </>
  )
}
