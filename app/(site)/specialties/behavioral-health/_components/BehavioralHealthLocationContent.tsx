'use client'

import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import TeamCircleGrid from '@/components/ui/TeamCircleGrid'
import SpecialtyFAQ from '@/components/sections/SpecialtyFAQ'
import SpecialtyMarquee from '@/components/sections/SpecialtyMarquee'
import {
  type BehavioralHealthLocation,
  BH_SOLUTIONS,
  BH_LEADERS,
  BH_TESTIMONIALS,
  BH_STATS,
  BH_DEDICATED_BLOCK,
  BH_FAQ_EHR,
  BH_FAQ_MRI,
} from '../_data/locations'

/**
 * BehavioralHealthLocationContent
 *
 * Body for the behavioral-health local-SEO pages at
 * /specialties/behavioral-health/[city]. Mirrors the anesthesia location
 * pages and reuses the main behavioral-health page's generic sections so
 * the city pages feel first-class. Section order:
 *
 *   About Cosentus -> Problem/Solution split -> Stats -> Local Expertise ->
 *   Complete Behavioral Health Revenue Cycle -> What Our Clients Say ->
 *   Behavioral Health Leadership -> Why Local Knowledge -> FAQ -> footer CTA.
 *
 * The hero (PageHero) is composed in page.tsx. Shared content
 * (BH_SOLUTIONS / BH_LEADERS / BH_TESTIMONIALS and the stats / dedicated /
 * FAQ blocks) lives in ../_data/locations so it never drifts from the main
 * page. Note: in this theme every --gray-* token is pure black, so visual
 * hierarchy is built from size, weight, icons, and dividers — not color.
 */

// Icons for the three "Why Local Knowledge Matters" cards, matching the
// .advantage-icon treatment on the main page.
const WHY_ICONS = [
  // Map pin — "We Know California Payers"
  <svg key="pin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>,
  // Focused target — "Dedicated to Behavioral Health"
  <svg key="target" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>,
  // Globe — "National Reach. Local Focus."
  <svg key="globe" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 9.5h17M3.5 14.5h17" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.6 2.5 4 5.7 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.7-4-9s1.4-6.5 4-9z" />
  </svg>,
]

export default function BehavioralHealthLocationContent({
  location,
}: {
  location: BehavioralHealthLocation
}) {
  const whyBlocks = [
    { title: 'We Know California Payers', body: location.whyKnowPayers },
    BH_DEDICATED_BLOCK,
    { title: 'National Reach. Local Focus.', body: location.nationalReach },
  ]

  const faqs = [location.faq1, location.faq2, BH_FAQ_EHR, BH_FAQ_MRI]

  return (
    <>
      {/* About Cosentus — left-aligned, leads the body */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 880 }}>
            <RevealOnScroll>
              <div className="section-title">About Cosentus</div>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <p style={{ margin: '24px 0 0', fontSize: 18, lineHeight: 1.75, color: 'var(--gray-700)' }}>
                {location.about}
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Problem / Solution split — generic behavioral-health content, same
          as the main behavioral-health page. */}
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

      {/* Stats — same treatment as the About / homepage RA numbers */}
      <section className="section">
        <div className="container">
          <div className="bh-loc-stats">
            {BH_STATS.map((stat, i) => (
              <RevealOnScroll key={i} delay={i * 0.12}>
                <div className="bh-loc-stat">
                  <div className="bh-loc-stat-num">{stat.value}</div>
                  <div className="bh-loc-stat-label">{stat.label}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Local Introduction — eyebrow + lead paragraph */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 880 }}>
            <RevealOnScroll>
              <div className="section-label">Local Expertise</div>
            </RevealOnScroll>
            {location.intro.map((para, i) => (
              <RevealOnScroll key={i} delay={0.05 + i * 0.08}>
                <p
                  style={{
                    fontFamily: i === 0 ? 'var(--font-display)' : 'var(--font-body)',
                    fontSize: i === 0 ? 'clamp(20px, 2.2vw, 24px)' : 18,
                    fontWeight: i === 0 ? 300 : 400,
                    lineHeight: i === 0 ? 1.5 : 1.75,
                    color: 'var(--gray-700)',
                    margin: i === 0 ? '0 0 24px' : 0,
                  }}
                >
                  {para}
                </p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Behavioral Health Revenue Cycle — shared SpecialtyMarquee grid */}
      <section className="section section-specialty-grid">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">Complete Behavioral Health Revenue Cycle</div>
          </RevealOnScroll>
        </div>
        <SpecialtyMarquee items={BH_SOLUTIONS} layout="grid" mobileCarousel />
      </section>

      {/* What Our Clients Say — shared TestimonialsSection */}
      <TestimonialsSection
        testimonials={BH_TESTIMONIALS}
        label="CLIENT REVIEWS"
        title={<>What Our <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Clients</span> Say.</>}
      />

      {/* Behavioral Health Leadership — 150+ years (generic) */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">Behavioral Health Leadership</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 12, marginTop: 16, marginBottom: 48 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 5.5vw, 68px)', fontWeight: 700, color: 'var(--primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>150+</span>
              <span style={{ fontSize: 18, color: 'var(--gray-600)', fontWeight: 300 }}>years combined in behavioral health RCM</span>
            </div>
          </RevealOnScroll>
          <TeamCircleGrid people={BH_LEADERS} baseDelay={0.1} />
        </div>
      </section>

      {/* Why Local Knowledge Matters — iconned advantage cards */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">Why Local Knowledge Matters</div>
          </RevealOnScroll>
          <div className="bh-loc-why-grid">
            {whyBlocks.map((block, i) => (
              <RevealOnScroll key={i} direction="scale" delay={0.15 + i * 0.1}>
                <div className="advantage-card">
                  <div className="advantage-icon">{WHY_ICONS[i]}</div>
                  <h4>{block.title}</h4>
                  <p>{block.body}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — shared accordion component */}
      <SpecialtyFAQ faqs={faqs} />

      {/* Footer CTA */}
      <section className="cta-section">
        <div className="container">
          <RevealOnScroll direction="scale">
            <div className="cta-box">
              <h2>Know Exactly Where Your Revenue Is Going.</h2>
              <Link href="/contact" className="btn-primary">
                Get Your No-Cost Financial MRI
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Page-scoped styles. */}
      <style>{`
        .bh-loc-why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          margin-top: 48px;
        }
        .bh-loc-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .bh-loc-stat {
          text-align: center;
          padding: 24px 16px;
        }
        .bh-loc-stat:not(:last-child) {
          border-right: 1px solid var(--gray-200);
        }
        .bh-loc-stat-num {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(44px, 5.5vw, 68px);
          line-height: 1;
          letter-spacing: -0.02em;
          color: var(--primary);
          margin-bottom: 8px;
        }
        .bh-loc-stat-label {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--gray-500);
        }
        @media (max-width: 900px) {
          .bh-loc-why-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .bh-loc-stats { grid-template-columns: repeat(2, 1fr); row-gap: 32px; }
          .bh-loc-stat:not(:last-child) { border-right: none; }
        }
      `}</style>
    </>
  )
}
