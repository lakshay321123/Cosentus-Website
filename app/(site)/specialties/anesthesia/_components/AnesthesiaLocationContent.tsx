'use client'

import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import AgentSpotlightCard from '@/components/voice/AgentSpotlightCard'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import TeamCircleGrid from '@/components/ui/TeamCircleGrid'
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
 * /specialties/anesthesia/[city]. Mirrors the main anesthesia page's
 * design and reuses its generic sections so the city pages feel like a
 * first-class part of the site. Section order:
 *
 *   About Cosentus -> Problem/Solution split -> Local Expertise ->
 *   Complete Anesthesia Revenue Cycle -> What Our Clients Say ->
 *   Pre-Service Payment Collection -> Leadership Combined Experience ->
 *   Why Local Knowledge -> Stats -> FAQ -> footer CTA.
 *
 * The hero (PageHero) is composed in page.tsx. Shared anesthesia content
 * (RCM solutions, stats, the testimonials/leaders below, etc.) is generic
 * — identical to the main page — and lives here so edits stay confined to
 * the location pages.
 *
 * Note: in this theme every --gray-* token is pure black, so visual
 * hierarchy is built from size, weight, icons, and dividers — not color.
 */

// Client testimonials — same content as the main anesthesia page.
const testimonials = [
  {
    tag: 'Anesthesia',
    quote: 'What separates Accreda from other anesthesia billing companies is its dedication to collecting every dollar possible for its clients, along with providing an excellent team of people who are loyal and helpful.',
    name: 'Dr. John B. Field Jr.',
    role: 'Vice President, Anesthesia Associates',
  },
  {
    tag: 'Anesthesia',
    quote: 'Year-over-year collection rate of 97% from commercial payers and 98% overall. I can wholeheartedly recommend Accreda.',
    name: 'Randy Robbins, M.D.',
    role: 'Anesthesia Group Practice Administrator',
  },
]

// Leadership — same roster as the main anesthesia page.
const leaders = [
  { name: 'Logan Lowry', role: 'President', photo: '/images/LOGAN LOWRY.jpg' },
  { name: 'Mark Wines', role: 'Chief Growth Officer', photo: '/images/MARK WINES.jpg' },
  { name: 'JR Thompson', role: 'Sr. VP Chief Operating Officer', photo: '/images/JR THOMPSON.jpg' },
  { name: 'Joseph Demory', role: 'Director Anesthesia Services', photo: '/images/JOSEPH DEMORY.jpg' },
  { name: 'Laurie Allen', role: 'VP Anesthesia Operations', photo: '/images/Laurie Allen.jpg' },
  { name: 'Melissa George', role: 'Sr. RCM Manager', photo: '/images/Melissa George.jpg' },
  { name: 'Evan Sewell', role: 'Director RCM', photo: '/images/Evan Sewell.jpg' },
  { name: 'Liz Hussey', role: 'Credentialing Manager', photo: '/images/Liz Hussey.jpg' },
  { name: 'Maisie Villegas', role: 'Director Quality Improvement', photo: '/images/Maicie.jpg' },
  { name: 'Thomas Wilson', role: 'Regional Director- Anesthesia Services', photo: '/images/Tom Wilson1.jpg' },
]

// Icons for the three "Why Local Knowledge Matters" cards, matching the
// .advantage-icon treatment on the main anesthesia page.
const WHY_ICONS = [
  // Map pin — "We Know California Payers"
  <svg key="pin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>,
  // Focused target — "Dedicated to Anesthesia"
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
  const whyBlocks = [
    { title: 'We Know California Payers', body: location.whyKnowPayers },
    ANESTHESIA_DEDICATED_BLOCK,
    { title: 'National Reach. Local Focus.', body: location.nationalReach },
  ]

  const faqs = [location.faq1, location.faq2, ANESTHESIA_FAQ_EHR, ANESTHESIA_FAQ_MRI]

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

      {/* Problem / Solution split — generic anesthesia content, same as
          the main anesthesia page. */}
      <section style={{ overflow: 'hidden' }}>
        <div className="problem-solution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 400 }}>
          <div className="ps-panel ps-problem" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: 'var(--white)', position: 'relative' }}>
            <RevealOnScroll direction="left" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 28 }}>
                Base Units, Time Units, Modifiers. One Wrong Move and Revenue Disappears.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Base units, time-unit accuracy, medical direction modifiers, and concurrency rules trip up generic billing teams every day',
                  'Payers have their own anesthesia-specific reimbursement rules. What works for one doesn\u2019t work for another',
                  'Authorization lapses on high-cost cases lead to write-offs that could have been prevented',
                  'Without anesthesia-trained coders, undercoding and missed charges become the norm',
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
                Anesthesia Experts + Ai Working Together
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Dedicated anesthesia billing team that understands units, modifiers, concurrency, and the rules each payer follows, because that\u2019s all they do',
                  'Ai handles eligibility verification, authorization tracking, and claim follow-up across your full volume',
                  'Every denied claim gets a root cause review to prevent the same issue from recurring',
                  'Live dashboards showing collections by provider, case type, payer, and facility',
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

      {/* Complete Anesthesia Revenue Cycle — shared SpecialtyMarquee grid */}
      <section className="section section-specialty-grid">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">Complete Anesthesia Revenue Cycle</div>
          </RevealOnScroll>
        </div>
        <SpecialtyMarquee items={ANESTHESIA_SOLUTIONS} layout="grid" />
      </section>

      {/* What Our Clients Say — shared TestimonialsSection */}
      <TestimonialsSection
        testimonials={testimonials}
        label="CLIENT REVIEWS"
        title={<>What Our <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Clients</span> Say.</>}
      />

      {/* Pre-Service Payment Collection — Priya spotlight (generic) */}
      <section className="section">
        <div className="container">
          <div className="specialty-spotlight-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <RevealOnScroll direction="left">
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 20 }}>
                  Pre-Service Payment Collection
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', marginBottom: 32 }}>
                  Priya contacts patients before procedures with verified cost estimates, lifting pre-service collections 30–40% vs post-service. She handles the volume so your team focuses on clinical care.
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

      {/* Leadership Combined Experience — 250+ years (generic) */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">Leadership Combined Experience</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 12, marginTop: 16, marginBottom: 48 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 5.5vw, 68px)', fontWeight: 700, color: 'var(--primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>250+</span>
              <span style={{ fontSize: 18, color: 'var(--gray-600)', fontWeight: 300 }}>years exclusively in anesthesia RCM</span>
            </div>
          </RevealOnScroll>
          <TeamCircleGrid
            people={leaders.map(l => ({ name: l.name, title: l.role, photo: l.photo }))}
            baseDelay={0.1}
          />
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

      {/* Stats — same treatment as the About / homepage RA numbers */}
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
