'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import TeamCircleGrid from '@/components/ui/TeamCircleGrid'
import SpecialtyMarquee from '@/components/sections/SpecialtyMarquee'
import { BH_SOLUTIONS, BH_LEADERS, BH_TESTIMONIALS } from './_data/locations'

// "What Sets Us Apart" cards per Specialty Pages doc (v1, May
// 19 2026), section 5 "Behavioral Health". 3 cards verbatim
// from doc.
const advantages = [
  {
    // Focused-target — "behavioral health is all we do"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></svg>,
    t: 'Behavioral Health Is All Our Team Does',
    d: 'Our team understands the difference between a 90837 and a 90834 and why it matters for your revenue. IOP vs PHP billing rules, telehealth modifiers that change by payer, crisis intervention codes. This is all they do.',
  },
  {
    // Shield-with-checkmark — "prevent denials"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    t: 'We Don\u2019t Just Recover Denials. We Prevent Them',
    d: 'Every denied claim gets a root cause review. Authorization expirations, time-based coding errors, telehealth modifier mismatches. We identify the root cause and correct it so it doesn\u2019t happen again.',
  },
  {
    // Trending-up arrow — "we grow with you"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" /></svg>,
    t: 'We Grow With You',
    d: 'From a single-location therapy practice to a multi-site behavioral health organization. Our model scales. One of our clients grew from $2M to $16M revenue. We managed the billing the whole way.',
  },
]




export default function BehavioralHealthContent() {
  return (
    <>
      {/* The Problem / Solution split panel — same inline shape
          as the other specialty pages. Content per Specialty
          Pages doc (v1) section 5 "Behavioral Health". */}
      <section style={{ overflow: 'hidden' }}>
        <div className="problem-solution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 400 }}>
          <div className="ps-panel ps-problem" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: 'var(--white)', position: 'relative' }}>
            <RevealOnScroll direction="left" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 28 }}>
                Complex Sessions. Constant Revenue Leaks.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Time-based CPTs with strict thresholds trip up generic billers who don\u2019t know the difference between a 90834 and a 90837',
                  'Telehealth modifiers vary by payer and change frequently. Yesterday\u2019s correct code could be today\u2019s denial',
                  'IOP/PHP bundling rules create constant underbilling risk when teams don\u2019t know per-diem vs per-service differences',
                  'Authorization expirations silently kill revenue when tracking gaps occur across ongoing treatment plans',
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
                Behavioral Health Billing Experts + Ai Tracking
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Dedicated behavioral health team that handles time-based coding, telehealth modifiers, IOP/PHP rules, and crisis codes because that\u2019s all they do',
                  'Ai automates eligibility re-checks, authorization tracking, and follow-ups',
                  'Human experts defend denials with clinical evidence and strategies built for each payer',
                  'Every denial gets a root cause review to fix the pattern, not just the claim',
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


      {/* RCM Solutions: Complete Behavioral Health Revenue Cycle.
          Shared SpecialtyMarquee component (grid mode). */}
      <section className="section section-specialty-grid">
        <div className="container">
          <RevealOnScroll><div className="section-title">Complete Behavioral Health Revenue Cycle</div></RevealOnScroll>
        </div>

        <SpecialtyMarquee items={BH_SOLUTIONS} layout="grid" mobileCarousel />
      </section>


      {/* Client Reviews — shared TestimonialsSection.
          Order (Jun 2026, user direction): directly after the Complete
          Revenue Cycle grid, before What Sets Us Apart and Leadership. */}
      <TestimonialsSection
        testimonials={BH_TESTIMONIALS}
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


      {/* Leadership.
          150+ years combined experience, 8 named people per
          doc. Same TeamCircleGrid pattern as Anesthesia (the
          other specialty page with confirmed leadership). */}
      <section className="section" id="leadership">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">Behavioral Health Leadership</div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 12, marginTop: 16, marginBottom: 48 }}>
              {/* Matches homepage .ra-stat-num per user (Jun 2026):
                  clamp(44-68), 700, -0.02em, font-display. Was
                  clamp(48-72) / 200 / no display font. */}
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 5.5vw, 68px)', fontWeight: 700, color: 'var(--primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>150+</span>
              <span style={{ fontSize: 18, color: 'var(--gray-600)', fontWeight: 300 }}>years combined in behavioral health RCM</span>
            </div>
          </RevealOnScroll>

          <TeamCircleGrid people={BH_LEADERS} baseDelay={0.1} />
        </div>
      </section>
    </>
  )
}
