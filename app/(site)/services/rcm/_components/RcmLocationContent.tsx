'use client'

import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import SpecialtyFAQ from '@/components/sections/SpecialtyFAQ'
import SpecialtyMarquee from '@/components/sections/SpecialtyMarquee'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import {
  type RcmLocation,
  RCM_WHAT_WE_MANAGE,
  RCM_STEPS,
  RCM_STATS,
  RCM_SPECIALTY_NAMES,
  RCM_ORGANIZED_BY_SPECIALTY,
  RCM_FAQ_EHR,
  RCM_FAQ_MRI,
} from '../_data/locations'

/**
 * RcmLocationContent
 *
 * Body for the RCM local-SEO pages at /services/rcm/[city]. Orphan pages (no nav /
 * links anywhere), reachable via search / direct URL, listed in the
 * sitemap. Follows the RCM Location Pages doc's own section order:
 *
 *   Local Introduction -> What We Manage -> Why Local Knowledge Matters ->
 *   Stats -> Specialties We Serve -> About Cosentus -> FAQ -> footer CTA.
 *
 * The hero (PageHero) is composed in page.tsx. Shared blocks (services
 * list, stats, specialty labels, the "Organized by Specialty" card, and
 * the EHR + Financial MRI FAQs) come from ../_data/locations.
 *
 * Note: in this theme every --gray-* token is pure black, so visual
 * hierarchy is built from size, weight, icons, and dividers — not color.
 */

// Check mark used in the "What We Manage" cards.
const CheckIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
)

// Icons for the three "Why Local Knowledge Matters" cards, matching the
// .advantage-icon treatment used elsewhere on the site.
const WHY_ICONS = [
  // Map pin — "We Know California Payers"
  <svg key="pin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>,
  // Focused target — "Organized by Specialty"
  <svg key="target" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>,
  // Globe — "National Reach. Local Focus." / "Headquartered in Orange County."
  <svg key="globe" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 9.5h17M3.5 14.5h17" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.6 2.5 4 5.7 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.7-4-9s1.4-6.5 4-9z" />
  </svg>,
]

export default function RcmLocationContent({
  location,
}: {
  location: RcmLocation
}) {
  const whyBlocks = [
    { title: 'We Know California Payers', body: location.whyKnowPayers },
    { title: RCM_ORGANIZED_BY_SPECIALTY.title, body: RCM_ORGANIZED_BY_SPECIALTY.body },
    { title: location.card3.title, body: location.card3.body },
  ]

  const specialties = RCM_SPECIALTY_NAMES.map(
    (name) => `${name} Billing in ${location.shortName}`,
  )

  const faqs = [location.faq1, location.faq2, RCM_FAQ_EHR, RCM_FAQ_MRI]

  return (
    <>
      {/* About Cosentus — left-aligned */}
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

      {/* Where Practices Lose Revenue / How We Plug The Leaks — same split
          panel as the /services/rcm page. Global ps-* / problem-solution-grid
          styles handle the layout and the responsive stack on mobile. */}
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

      {/* Stats — same treatment as the About / homepage RA numbers */}
      <section className="section section-alt">
        <div className="container">
          <div className="rcm-loc-stats">
            {RCM_STATS.map((stat, i) => (
              <RevealOnScroll key={i} delay={i * 0.12}>
                <div className="rcm-loc-stat">
                  <div className="rcm-loc-stat-num">{stat.value}</div>
                  <div className="rcm-loc-stat-label">{stat.label}</div>
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

      {/* 10 Steps. One Team. Every Dollar. — shared SpecialtyMarquee grid,
          same RCM_STEPS as the /services/rcm page. */}
      <section className="section section-specialty-grid">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">10 Steps. One Team. Every Dollar.</div>
          </RevealOnScroll>
        </div>
        <SpecialtyMarquee items={RCM_STEPS} layout="grid" mobileCarousel />
      </section>

      {/* What We Manage — 9-item icon-check card grid */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">
              What We Manage for Practices in {location.shortName}
            </div>
          </RevealOnScroll>
          <div className="rcm-loc-manage-grid">
            {RCM_WHAT_WE_MANAGE.map((item, i) => (
              <RevealOnScroll key={i} delay={0.05 + (i % 3) * 0.08}>
                <div className="rcm-loc-manage-item">
                  <div className="rcm-loc-check">{CheckIcon}</div>
                  <span>{item}</span>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Why Local Knowledge Matters — iconned advantage cards */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">Why Local Knowledge Matters</div>
          </RevealOnScroll>
          <div className="rcm-loc-why-grid">
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

      {/* Specialties We Serve — non-linked themed labels */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">
              Specialties We Serve in {location.shortName}
            </div>
          </RevealOnScroll>
          <div className="rcm-loc-spec-grid">
            {specialties.map((label, i) => (
              <RevealOnScroll key={i} delay={0.05 + (i % 3) * 0.08}>
                <div className="rcm-loc-spec-item">{label}</div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* What Our Partners Say — shared testimonials (site-wide set) */}
      <TestimonialsSection />

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

      <style>{`
        .rcm-loc-manage-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 48px;
        }
        .rcm-loc-manage-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: 14px;
          padding: 20px 22px;
          height: 100%;
          font-size: 16px;
          line-height: 1.5;
          color: var(--gray-700);
        }
        .rcm-loc-check {
          flex: 0 0 auto;
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: var(--primary-ghost);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rcm-loc-check svg { width: 18px; height: 18px; }
        .rcm-loc-why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          margin-top: 48px;
        }
        .rcm-loc-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .rcm-loc-stat {
          text-align: center;
          padding: 24px 16px;
        }
        .rcm-loc-stat:not(:last-child) {
          border-right: 1px solid var(--gray-200);
        }
        .rcm-loc-stat-num {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(44px, 5.5vw, 68px);
          line-height: 1;
          letter-spacing: -0.02em;
          color: var(--primary);
          margin-bottom: 8px;
        }
        .rcm-loc-stat-label {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--gray-500);
        }
        .rcm-loc-spec-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-top: 48px;
        }
        .rcm-loc-spec-item {
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-left: 3px solid var(--primary);
          border-radius: 12px;
          padding: 22px 24px;
          font-family: var(--font-display);
          font-weight: 500;
          font-size: 18px;
          line-height: 1.4;
          color: var(--gray-900);
        }
        @media (max-width: 900px) {
          .rcm-loc-manage-grid { grid-template-columns: repeat(2, 1fr); }
          .rcm-loc-why-grid { grid-template-columns: 1fr; }
          .rcm-loc-spec-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .rcm-loc-stats { grid-template-columns: repeat(2, 1fr); row-gap: 32px; }
          .rcm-loc-stat:not(:last-child) { border-right: none; }
        }
        @media (max-width: 600px) {
          .rcm-loc-manage-grid { grid-template-columns: 1fr; }
          .rcm-loc-spec-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}
