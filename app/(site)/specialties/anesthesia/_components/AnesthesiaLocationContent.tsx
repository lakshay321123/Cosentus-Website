'use client'

import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import SpecialtyFAQ from '@/components/sections/SpecialtyFAQ'
import SpecialtyMarquee from '@/components/sections/SpecialtyMarquee'
import {
  type AnesthesiaLocation,
  ANESTHESIA_SOLUTIONS,
  ANESTHESIA_STATS,
  ANESTHESIA_DEDICATED_BLOCK,
  ANESTHESIA_FAQ_EHR,
  ANESTHESIA_FAQ_MRI,
} from '../_data/locations'

/**
 * AnesthesiaLocationContent
 *
 * Body for the anesthesia local-SEO pages at
 * /specialties/anesthesia/[city]. Design references AnesthesiaContent.tsx
 * (the main anesthesia page) so these pages don't read as a wall of text:
 *
 *   Local Intro (eyebrow + lead) -> Complete Anesthesia Revenue Cycle
 *   (the shared SpecialtyMarquee grid, identical to the main page) ->
 *   Why Local Knowledge (iconned advantage cards) -> Stats ->
 *   About Cosentus -> FAQ accordion -> footer CTA.
 *
 * The hero (PageHero) is composed in page.tsx, same as the main
 * anesthesia page. Shared blocks (the RCM solutions, stats, the
 * "Dedicated to Anesthesia" card, and the EHR + Financial MRI FAQs)
 * come from _data/locations because they're identical everywhere.
 *
 * Note: in this theme every --gray-* token is pure black, so visual
 * hierarchy is built from size, weight, icons, and dividers — not color.
 */

// Icons for the three "Why Local Knowledge Matters" cards, matching the
// .advantage-icon treatment on the main anesthesia page.
const WHY_ICONS = [
  // Map pin — "We Know California Payers"
  <svg key="pin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>,
  // Focused target — "Dedicated to Anesthesia" (mirrors the main page's
  // "Anesthesia Is All We Do" target icon)
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

export default function AnesthesiaLocationContent({
  location,
}: {
  location: AnesthesiaLocation
}) {
  // Three "Why Local Knowledge Matters" cards. Cards 1 and 3 are
  // city-specific; the middle "Dedicated to Anesthesia" card is shared.
  const whyBlocks = [
    { title: 'We Know California Payers', body: location.whyKnowPayers },
    ANESTHESIA_DEDICATED_BLOCK,
    { title: 'National Reach. Local Focus.', body: location.nationalReach },
  ]

  // FAQ order per doc: city Q&A, city Q&A, then the shared EHR + MRI pair.
  const faqs = [location.faq1, location.faq2, ANESTHESIA_FAQ_EHR, ANESTHESIA_FAQ_MRI]

  return (
    <>
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

      {/* Complete Anesthesia Revenue Cycle — the same SpecialtyMarquee grid
          the main anesthesia page uses, from the shared data source. */}
      <section className="section section-specialty-grid">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">Complete Anesthesia Revenue Cycle</div>
          </RevealOnScroll>
        </div>
        <SpecialtyMarquee items={ANESTHESIA_SOLUTIONS} layout="grid" />
      </section>

      {/* Why Local Knowledge Matters — iconned advantage cards */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">Why Local Knowledge Matters</div>
          </RevealOnScroll>
          <div className="anes-loc-why-grid">
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

      {/* Stats — same treatment as the About / homepage RA numbers:
          4-column grid, subtle gray dividers, big primary numbers. */}
      <section className="section">
        <div className="container">
          <div className="anes-loc-stats">
            {ANESTHESIA_STATS.map((stat, i) => (
              <RevealOnScroll key={i} delay={i * 0.12}>
                <div className="anes-loc-stat">
                  <div className="anes-loc-stat-num">{stat.value}</div>
                  <div className="anes-loc-stat-label">{stat.label}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* About Cosentus — left-aligned, matching the Local Intro block */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 880 }}>
            <RevealOnScroll>
              <div className="section-title">About Cosentus</div>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <p
                style={{
                  margin: '24px 0 0',
                  fontSize: 18,
                  lineHeight: 1.75,
                  color: 'var(--gray-700)',
                }}
              >
                {location.about}
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* FAQ — shared accordion component */}
      <SpecialtyFAQ faqs={faqs} />

      {/* Footer CTA — same .cta-section styling as the site-wide CTA,
          with the headline the doc specifies for these pages. */}
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

      {/* Page-scoped styles. Kept local to avoid bloating globals.css
          for orphan SEO pages. */}
      <style>{`
        .anes-loc-why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          margin-top: 48px;
        }
        .anes-loc-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .anes-loc-stat {
          text-align: center;
          padding: 24px 16px;
        }
        .anes-loc-stat:not(:last-child) {
          border-right: 1px solid var(--gray-200);
        }
        .anes-loc-stat-num {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(44px, 5.5vw, 68px);
          line-height: 1;
          letter-spacing: -0.02em;
          color: var(--primary);
          margin-bottom: 8px;
        }
        .anes-loc-stat-label {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--gray-500);
        }
        @media (max-width: 900px) {
          .anes-loc-why-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .anes-loc-stats { grid-template-columns: repeat(2, 1fr); row-gap: 32px; }
          .anes-loc-stat:not(:last-child) { border-right: none; }
        }
      `}</style>
    </>
  )
}
