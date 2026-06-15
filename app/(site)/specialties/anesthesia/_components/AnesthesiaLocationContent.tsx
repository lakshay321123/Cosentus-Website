'use client'

import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import SpecialtyFAQ from '@/components/sections/SpecialtyFAQ'
import {
  type AnesthesiaLocation,
  ANESTHESIA_WHAT_WE_MANAGE,
  ANESTHESIA_STATS,
  ANESTHESIA_DEDICATED_BLOCK,
  ANESTHESIA_FAQ_EHR,
  ANESTHESIA_FAQ_MRI,
} from '../_data/locations'

/**
 * AnesthesiaLocationContent
 *
 * Body for the anesthesia local-SEO pages at
 * /specialties/anesthesia/[city]. Renders the doc's content blocks in
 * the existing anesthesia theme:
 *
 *   Local Intro -> What We Manage (teal-dot list) -> Why Local Knowledge
 *   (3 advantage cards) -> Stats Strip -> About Cosentus -> FAQ accordion
 *   -> footer CTA.
 *
 * The hero (PageHero) is composed in page.tsx, same as the main
 * anesthesia page. Shared blocks (the 8-item services list, the stats,
 * the "Dedicated to Anesthesia" card, and the EHR + Financial MRI FAQs)
 * come from _data/locations because they're identical on every page.
 */

export default function AnesthesiaLocationContent({
  location,
}: {
  location: AnesthesiaLocation
}) {
  // Three "Why Local Knowledge Matters" cards. Card 1 and 3 are
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
      {/* Local Introduction */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 820 }}>
            {location.intro.map((para, i) => (
              <RevealOnScroll key={i} delay={0.05 + i * 0.08}>
                <p
                  style={{
                    fontSize: 18,
                    lineHeight: 1.7,
                    color: 'var(--gray-700)',
                    margin: i === 0 ? '0 0 22px' : 0,
                  }}
                >
                  {para}
                </p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* What We Manage */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">
              What We Manage for Anesthesia Practices in {location.shortName}
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <ul className="anes-loc-manage">
              {ANESTHESIA_WHAT_WE_MANAGE.map((item, i) => (
                <li key={i}>
                  <span aria-hidden="true" className="anes-loc-dot" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </section>

      {/* Why Local Knowledge Matters */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">Why Local Knowledge Matters</div>
          </RevealOnScroll>
          <div className="anes-loc-why-grid">
            {whyBlocks.map((block, i) => (
              <RevealOnScroll key={i} direction="scale" delay={0.15 + i * 0.1}>
                <div className="advantage-card">
                  <h4>{block.title}</h4>
                  <p>{block.body}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="section section-alt">
        <div className="container">
          <div className="anes-loc-stats">
            {ANESTHESIA_STATS.map((stat, i) => (
              <RevealOnScroll key={i} direction="scale" delay={0.1 + i * 0.08}>
                <div>
                  <div className="anes-loc-stat-num">{stat.value}</div>
                  <div className="anes-loc-stat-label">{stat.label}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* About Cosentus */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">About Cosentus</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p
              style={{
                maxWidth: 820,
                margin: '32px auto 0',
                fontSize: 18,
                lineHeight: 1.7,
                color: 'var(--gray-700)',
                textAlign: 'center',
              }}
            >
              {location.about}
            </p>
          </RevealOnScroll>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Page-scoped responsive styles. Kept local to avoid bloating
          globals.css for orphan SEO pages. */}
      <style>{`
        .anes-loc-manage {
          list-style: none;
          padding: 0;
          margin: 44px auto 0;
          max-width: 900px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px 40px;
        }
        .anes-loc-manage li {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          font-size: 17px;
          line-height: 1.6;
          color: var(--gray-700);
        }
        .anes-loc-dot {
          flex-shrink: 0;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00B5D6;
          margin-top: 9px;
        }
        .anes-loc-why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          margin-top: 48px;
        }
        .anes-loc-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          text-align: center;
        }
        .anes-loc-stat-num {
          font-family: var(--font-display);
          font-weight: 300;
          font-size: clamp(44px, 5.5vw, 68px);
          line-height: 1;
          letter-spacing: -0.02em;
          color: #00B5D6;
        }
        .anes-loc-stat-label {
          margin-top: 12px;
          font-size: 15px;
          letter-spacing: 0.02em;
          color: var(--gray-600);
        }
        @media (max-width: 900px) {
          .anes-loc-why-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .anes-loc-manage { grid-template-columns: 1fr; gap: 16px; }
          .anes-loc-stats { grid-template-columns: repeat(2, 1fr); gap: 36px 20px; }
        }
      `}</style>
    </>
  )
}
