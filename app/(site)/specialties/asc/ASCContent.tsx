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
    icon: <svg viewBox="0 0 928.85 900.05" className="apart-svg apart-asc-notes" aria-hidden="true">
        <g className="note note-1">
          <path fill="#00B5D6" d="M875.32 311.1c-37.18,7.18 -66.02,36.04 -73.23,73.23l-559.81 0c-7.17,-37.19 -36.05,-66.04 -73.24,-73.23l0 -184.34c37.19,-7.18 66.06,-36.05 73.24,-73.24l559.81 0c7.17,37.19 36.05,66.05 73.23,73.24l0 184.34zm15.87 -311.1l-738.01 0c-20.73,0 -37.63,16.89 -37.63,37.66l0 362.56c0,20.74 16.89,37.64 37.63,37.64l738.01 0c20.77,0 37.67,-16.89 37.67,-37.64l0 -362.56c0,-20.76 -16.89,-37.66 -37.67,-37.66z"/>
          <path fill="#00B5D6" d="M536.59 296.57l0 18.4c0,2.74 -2.22,4.96 -4.94,4.96l-18.89 0c-2.75,0 -4.94,-2.22 -4.94,-4.96l0 -17.83c-19.48,-1.76 -34.86,-16.86 -36.81,-36.28 -0.13,-1.31 0.29,-2.6 1.2,-3.62 0.96,-1.05 2.33,-1.66 3.77,-1.66l19.12 0c2.3,0 4.27,1.55 4.75,3.7 1.18,5.45 6.09,9.4 11.67,9.4l16.73 0c9.59,0 17.82,-6.95 18.7,-15.83 0.54,-5.07 -1.05,-9.92 -4.46,-13.69 -3.34,-3.7 -8.12,-5.84 -13.13,-5.84l-12.29 0c-24.79,0 -45.98,-18.37 -48.28,-41.82 -2.42,-24.73 14.66,-46.7 39.04,-50.53l0 -18.1c0,-2.71 2.19,-4.94 4.94,-4.94l18.89 0c2.71,0 4.94,2.22 4.94,4.94l0 17.84c19.47,1.76 34.86,16.85 36.81,36.29 0.13,1.31 -0.32,2.6 -1.21,3.61 -0.96,1.07 -2.32,1.67 -3.76,1.67l-19.12 0c-2.3,0 -4.3,-1.56 -4.78,-3.7 -1.18,-5.46 -6.06,-9.41 -11.63,-9.41l-16.76 0c-9.56,0 -17.79,6.94 -18.7,15.83 -0.51,5.07 1.07,9.92 4.46,13.69 3.34,3.72 8.15,5.84 13.12,5.84l14.34 0c13.07,0 25.63,5.57 34.42,15.28 8.92,9.84 13.13,22.57 11.83,35.84 -1.98,20.25 -17.95,36.94 -39.01,40.91zm-14.4 -216.02c-76.28,0 -138.37,62.07 -138.37,138.39 0,76.3 62.08,138.37 138.37,138.37 76.32,0 138.39,-62.06 138.39,-138.37 0,-76.31 -62.07,-138.39 -138.39,-138.39z"/>
          <path fill="#00B5D6" d="M242.72 187.69c-17.24,0 -31.23,13.99 -31.23,31.25 0,17.25 13.99,31.24 31.23,31.24 17.27,0 31.26,-13.99 31.26,-31.24 0,-17.26 -13.99,-31.25 -31.26,-31.25z"/>
          <path fill="#00B5D6" d="M779.13 187.69c-17.24,0 -31.23,13.99 -31.23,31.25 0,17.25 13.99,31.24 31.23,31.24 17.26,0 31.26,-13.99 31.26,-31.24 0,-17.26 -14,-31.25 -31.26,-31.25z"/>
        </g>
        <g className="note note-2">
          <path fill="#00B5D6" d="M759.77 773.3c-37.18,7.18 -66.02,36.04 -73.23,73.23l-559.81 0c-7.17,-37.19 -36.05,-66.04 -73.24,-73.23l0 -184.34c37.19,-7.18 66.06,-36.05 73.24,-73.24l559.81 0c7.17,37.19 36.05,66.05 73.23,73.24l0 184.34zm15.87 -311.1l-738.01 0c-20.73,0 -37.63,16.89 -37.63,37.66l0 362.56c0,20.74 16.89,37.64 37.63,37.64l738.01 0c20.77,0 37.67,-16.89 37.67,-37.64l0 -362.56c0,-20.76 -16.89,-37.66 -37.67,-37.66z"/>
          <path fill="#00B5D6" d="M421.04 758.77l0 18.4c0,2.74 -2.22,4.96 -4.94,4.96l-18.89 0c-2.75,0 -4.94,-2.22 -4.94,-4.96l0 -17.83c-19.48,-1.76 -34.86,-16.86 -36.81,-36.28 -0.13,-1.31 0.29,-2.6 1.2,-3.62 0.96,-1.05 2.33,-1.66 3.77,-1.66l19.12 0c2.3,0 4.27,1.55 4.75,3.7 1.18,5.45 6.09,9.4 11.67,9.4l16.73 0c9.59,0 17.82,-6.95 18.7,-15.83 0.54,-5.07 -1.05,-9.92 -4.46,-13.69 -3.34,-3.7 -8.12,-5.84 -13.13,-5.84l-12.29 0c-24.79,0 -45.98,-18.37 -48.28,-41.82 -2.42,-24.73 14.66,-46.7 39.04,-50.53l0 -18.1c0,-2.71 2.19,-4.94 4.94,-4.94l18.89 0c2.71,0 4.94,2.22 4.94,4.94l0 17.84c19.47,1.76 34.86,16.85 36.81,36.29 0.13,1.31 -0.32,2.6 -1.21,3.61 -0.96,1.07 -2.32,1.67 -3.76,1.67l-19.12 0c-2.3,0 -4.3,-1.56 -4.78,-3.7 -1.18,-5.46 -6.06,-9.41 -11.63,-9.41l-16.76 0c-9.56,0 -17.79,6.94 -18.7,15.83 -0.51,5.07 1.07,9.92 4.46,13.69 3.34,3.72 8.15,5.84 13.12,5.84l14.34 0c13.07,0 25.63,5.57 34.42,15.28 8.92,9.84 13.13,22.57 11.83,35.84 -1.98,20.25 -17.95,36.94 -39.01,40.91zm-14.4 -216.02c-76.28,0 -138.37,62.07 -138.37,138.39 0,76.3 62.08,138.37 138.37,138.37 76.32,0 138.39,-62.06 138.39,-138.37 0,-76.31 -62.07,-138.39 -138.39,-138.39z"/>
          <path fill="#00B5D6" d="M127.17 649.89c-17.24,0 -31.23,13.99 -31.23,31.25 0,17.25 13.99,31.24 31.23,31.24 17.27,0 31.26,-13.99 31.26,-31.24 0,-17.26 -13.99,-31.25 -31.26,-31.25z"/>
          <path fill="#00B5D6" d="M663.58 649.89c-17.24,0 -31.23,13.99 -31.23,31.25 0,17.25 13.99,31.24 31.23,31.24 17.26,0 31.26,-13.99 31.26,-31.24 0,-17.26 -14,-31.25 -31.26,-31.25z"/>
        </g>
      </svg>,
    t: 'We Manage Both Fee Streams',
    d: 'Most billing companies handle facility OR professional billing. We manage both. Coordinated under one team, one dashboard, one process.',
  },
  {
    // Shield-with-checkmark — "prevent denials" (same icon as
    // Anesthesia/Orthopedics/Pain card 2 for consistency)
    icon: <svg viewBox="0 0 675.68 961.68" className="apart-svg" aria-hidden="true">
        <path fill="#00B5D6" d="M56.25 156.98l0 0c31.07,0 56.25,25.18 56.25,56.25l0 216.18c0,3.99 3.24,7.23 7.23,7.23l0 0c4,0 7.24,-3.24 7.24,-7.23l0 -304.32c0,-31.07 25.18,-56.25 56.25,-56.25l0 0c31.06,0 56.25,25.18 56.25,56.25l0 304.31c0,3.99 3.24,7.23 7.23,7.23l0 0c4,0 7.23,-3.24 7.23,-7.23l0 -373.15c0,-31.07 25.19,-56.25 56.25,-56.25l0 -0c31.06,0 56.25,25.19 56.25,56.25l0 373.15c0,3.99 3.24,7.23 7.23,7.23l0 0c3.99,0 7.23,-3.24 7.23,-7.23l0 -317.71c0,-31.07 25.18,-56.25 56.25,-56.25l0 0c31.07,0 56.25,25.19 56.25,56.25l0 324.94 0 87.59 0 71.16 76.55 -141.1c14.81,-27.31 48.96,-37.44 76.27,-22.63l0 0c27.31,14.81 37.44,48.96 22.63,76.27l-127.04 294.38c-11.49,26.62 -26.42,51.68 -44.89,74.03 -62.58,75.73 -132.33,85.61 -243.22,85.34 -0.63,0 -1.26,0 -1.88,0l-10.75 0c-133.15,0 -241.09,-107.94 -241.09,-241.09l0 -94.83 0 -189.12 0 -223.41c0,-31.07 25.19,-56.25 56.25,-56.25zm214.74 345.94c-82.8,0 -149.93,67.13 -149.93,149.93 0,82.8 67.13,149.93 149.93,149.93 82.8,0 149.93,-67.13 149.93,-149.93 0,-82.8 -67.13,-149.93 -149.93,-149.93zm0 29.57c-66.47,0 -120.36,53.89 -120.36,120.36 0,66.47 53.89,120.36 120.36,120.36 66.47,0 120.36,-53.89 120.36,-120.36 0,-66.47 -53.89,-120.36 -120.36,-120.36zm-72.42 64.51l54.92 54.92 -54.92 54.92 18.57 18.57 54.92 -54.92 54.92 54.92 18.57 -18.57 -54.92 -54.92 54.92 -54.92 -18.56 -18.56 -54.92 54.92 -54.92 -54.92 -18.56 18.56z"/>
      </svg>,
    t: 'We Don\u2019t Just Recover Denials. We Prevent Them',
    d: 'High case volume creates high denial volume. Unless you fix the root cause. We analyze every denial across facility and professional streams to stop repeat issues.',
  },
  {
    // Chart-bar icon — "ASC economics"
    icon: <svg viewBox="0 0 1337.53 1205.71" className="apart-svg" aria-hidden="true">
        <path fill="#00B5D6" d="M621.67 13.05l-607.36 354c-26.62,15.52 -14.37,71.51 22.53,71.51 421.28,0 842.57,0 1263.85,0 36.9,0 49.16,-56 22.53,-71.51l-607.36 -354c-29.85,-17.4 -64.34,-17.4 -94.2,0zm-459.97 455.95l91.71 0c13.34,0 24.25,10.91 24.25,24.25l0 522.17c0,13.34 -10.91,24.25 -24.25,24.25l-91.71 0c-13.34,0 -24.25,-10.91 -24.25,-24.25l0 -522.17c0,-13.34 10.91,-24.25 24.25,-24.25zm307.47 0l91.71 0c13.34,0 24.25,10.91 24.25,24.25l0 522.17c0,13.34 -10.91,24.25 -24.25,24.25l-91.71 0c-13.34,0 -24.25,-10.91 -24.25,-24.25l0 -522.17c0,-13.34 10.91,-24.25 24.25,-24.25zm307.47 0l91.71 0c13.34,0 24.25,10.91 24.25,24.25l0 522.17c0,13.34 -10.91,24.25 -24.25,24.25l-91.71 0c-13.34,0 -24.25,-10.91 -24.25,-24.25l0 -522.17c0,-13.34 10.91,-24.25 24.25,-24.25zm307.47 0l91.71 0c13.34,0 24.25,10.91 24.25,24.25l0 522.17c0,13.34 -10.91,24.25 -24.25,24.25l-91.71 0c-13.34,0 -24.25,-10.91 -24.25,-24.25l0 -522.17c0,-13.34 10.91,-24.25 24.25,-24.25zm193.44 620.75l0 91.71c0,13.33 -10.91,24.25 -24.25,24.25l-1169.1 0c-13.33,0 -24.25,-10.91 -24.25,-24.25l0 -91.71c0,-13.34 10.91,-24.25 24.25,-24.25l1169.1 0c13.34,0 24.25,10.92 24.25,24.25z"/>
      </svg>,
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
    eyebrow: 'Ai AGENT \u2014 CINDY',
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
                Dedicated Ambulatory Teams + Ai. Every Specialty Gets the Expertise It Demands.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Specialty-trained billing teams for orthopedics, pain management, and ASCs — each staffed with coders who work their specialty full time and understand the payer rules that apply to it',
                  'Ai handles the high-volume, high-frequency work: eligibility verification, authorization tracking, claim follow-up, and patient outreach across all three specialties simultaneously',
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
            <MobileCarousel autoScrollInterval={4000} showArrows>
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

        <SpecialtyMarquee items={solutions} layout="grid" mobileCarousel />
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
