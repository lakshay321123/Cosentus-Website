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
 * /specialties/anesthesia/[city]. Design references AnesthesiaContent.tsx
 * (the main anesthesia page) so these pages don't read as a wall of text:
 *
 *   Local Intro (eyebrow + lead) -> What We Manage (iconned card grid) ->
 *   Why Local Knowledge (iconned advantage cards) -> Stats band ->
 *   About Cosentus -> FAQ accordion -> footer CTA.
 *
 * The hero (PageHero) is composed in page.tsx, same as the main
 * anesthesia page. Shared blocks (services list, stats, the
 * "Dedicated to Anesthesia" card, and the EHR + Financial MRI FAQs)
 * come from _data/locations because they're identical on every page.
 *
 * Note: in this theme every --gray-* token is pure black, so visual
 * hierarchy is built from size, weight, icons, and panels — not color.
 */

// Check icon for the "What We Manage" cards.
const CheckIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
)

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

      {/* What We Manage — iconned card grid */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">
              What We Manage for Anesthesia Practices in {location.shortName}
            </div>
          </RevealOnScroll>
          <div className="anes-loc-manage-grid">
            {ANESTHESIA_WHAT_WE_MANAGE.map((item, i) => (
              <RevealOnScroll key={i} direction="scale" delay={0.08 + i * 0.05}>
                <div className="anes-loc-mcard">
                  <span className="anes-loc-mchip" aria-hidden="true">{CheckIcon}</span>
                  <span className="anes-loc-mtext">{item}</span>
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

      {/* Stats band — teal-ghost panel with dividers */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll direction="scale">
            <div className="anes-loc-stats">
              {ANESTHESIA_STATS.map((stat, i) => (
                <div className="anes-loc-stat" key={i}>
                  <div className="anes-loc-stat-num">{stat.value}</div>
                  <div className="anes-loc-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* About Cosentus */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title" style={{ textAlign: 'center' }}>About Cosentus</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p
              style={{
                maxWidth: 820,
                margin: '32px auto 0',
                fontSize: 18,
                lineHeight: 1.75,
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
        .anes-loc-manage-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          max-width: 980px;
          margin: 44px auto 0;
        }
        .anes-loc-mcard {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          background: var(--white);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 14px;
          padding: 22px 24px;
          height: 100%;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
        }
        .anes-loc-mcard:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.07);
        }
        .anes-loc-mchip {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-ghost);
          color: var(--primary);
          border-radius: 10px;
        }
        .anes-loc-mchip svg { width: 21px; height: 21px; }
        .anes-loc-mtext {
          font-size: 16.5px;
          line-height: 1.55;
          font-weight: 450;
          color: var(--gray-700);
          padding-top: 8px;
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
          align-items: center;
          background: var(--primary-ghost);
          border-radius: 18px;
          padding: clamp(34px, 4vw, 52px) clamp(20px, 3vw, 40px);
          max-width: 1000px;
          margin: 0 auto;
        }
        .anes-loc-stat {
          position: relative;
          text-align: center;
          padding: 0 16px;
        }
        .anes-loc-stat:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 58px;
          background: rgba(0, 181, 214, 0.3);
        }
        .anes-loc-stat-num {
          font-family: var(--font-display);
          font-weight: 300;
          font-size: clamp(40px, 5vw, 64px);
          line-height: 1;
          letter-spacing: -0.02em;
          color: var(--primary);
        }
        .anes-loc-stat-label {
          margin-top: 12px;
          font-size: 13px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--gray-600);
        }
        @media (max-width: 900px) {
          .anes-loc-why-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .anes-loc-manage-grid { grid-template-columns: 1fr; gap: 16px; }
          .anes-loc-stats {
            grid-template-columns: repeat(2, 1fr);
            row-gap: 36px;
            padding: 40px 24px;
          }
          .anes-loc-stat:nth-child(2)::after { display: none; }
        }
      `}</style>
    </>
  )
}
