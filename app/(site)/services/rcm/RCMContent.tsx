'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'
import ResultsSection from '@/components/sections/ResultsSection'
import SpecialtyMarquee from '@/components/sections/SpecialtyMarquee'
import { RCM_STEPS } from './_data/locations'

export default function RCMContent() {
  return (
    <>
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
                  'AAPC-certified coders with Ai-assisted accuracy checks',
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

        <SpecialtyMarquee items={RCM_STEPS} layout="grid" mobileCarousel />
      </section>

      {/* The Challenge — relocated to sit below the "10 Steps. One Team.
          Every Dollar." section per user (Jun 2026). */}
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

      {/* Results / Outcomes — dropped in the home page's
          ResultsSection component (6 arrow-shape stat cards with
          flip cards). Wrapped in .rcm-results-on-teal so the
          section renders on a solid teal panel with white text. */}
      <div className="rcm-results-on-teal">
        <ResultsSection showArrows />
      </div>
    </>
  )
}
