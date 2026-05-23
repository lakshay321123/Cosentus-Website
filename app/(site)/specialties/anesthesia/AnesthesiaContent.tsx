'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'
import AgentSpotlightCard from '@/components/voice/AgentSpotlightCard'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import TeamCircleGrid from '@/components/ui/TeamCircleGrid'

// "What Sets Us Apart" cards. Content per the Specialty Pages doc
// (v1, May 19 2026) — section 1 "Anesthesia (Accreda)". Doc spec is
// exactly 3 cards, replacing the previous 6 generic ones (Real+AI,
// Boutique Support, Privately Owned, etc.) that didn't speak to the
// specialty. Icons chosen to thematically reflect each card.
const advantages = [
  {
    // Focused-target icon — "anesthesia is all we do"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></svg>,
    t: 'Anesthesia Is All We Do',
    d: 'Our anesthesia team wakes up doing anesthesia and goes to bed doing anesthesia. They know every payer game, every modifier trap, and every reimbursement nuance specific to your specialty.',
  },
  {
    // Shield-with-checkmark icon — "prevent denials, not just recover"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    t: 'We Don\u2019t Just Recover Denials. We Prevent Them',
    d: 'Every denied claim gets a root cause review. We find out why it happened, fix the process, and make sure that denial category shrinks quarter over quarter.',
  },
  {
    // Clock/experience icon — "23+ years"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    t: '23+ Years in Anesthesia RCM',
    d: 'This isn\u2019t a new vertical we added to a menu. Accreda was built for anesthesia from day one. 250+ years of combined team experience across every anesthesia subspecialty.',
  },
]

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

// Testimonials per Specialty Pages doc (v1, May 19 2026).
// T1 is a shortened version of the previous live quote; T2 is a
// new Randy Robbins quote sourced from the doc, replacing the
// older quote previously attributed to him.
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

// "RCM Solutions: Complete Anesthesia Revenue Cycle" — 8 cards
// per the Specialty Pages doc (v1, May 19 2026). Card titles and
// descriptions are verbatim from the doc. References to Chris and
// Cindy match the AI agents introduced on the homepage.
const solutions = [
  { t: 'Anesthesia-Specific Coding', d: 'Base units, time units, modifiers, concurrency. Coded accurately for every case type including cardiac, OB, pain, and regional.' },
  { t: 'Payer-Specific Billing Rules', d: 'Each payer reimburses anesthesia differently. Our team knows the rules for every major carrier and adapts accordingly.' },
  { t: 'Credentialing & Enrollment', d: 'Provider credentialing managed across all payers and facilities. DEA, OIG, and CAQH kept current.' },
  { t: 'Prior Authorization', d: 'Authorizations tracked and cleared before scheduled procedures. No OR delays. No revenue surprises.' },
  { t: 'Denial Management & Appeals', d: 'Every denial gets a root cause review. Clinical rationale built by anesthesia experts. 95%+ appeal success rate.' },
  { t: 'AR Follow-Up & Collections', d: 'Chris calls payers thousands of times per week for claim status, escalations, and resolution. Your team focuses on patients.' },
  { t: 'Patient Billing & Support', d: 'Cindy handles patient balances, pre-procedure cost estimates, and billing questions in over 50 languages.' },
  { t: 'Analytics & Visibility', d: 'Live dashboards by provider, case type, facility, payer, and denial category. No waiting for month-end reports.' },
]

export default function AnesthesiaContent() {
  return (
    <>
      {/* The Problem, Split impact section.
          Headline + 4 bullets per the Specialty Pages doc
          (v1, May 19 2026). Previously a single prose paragraph,
          converted to the doc's standardized bullet structure.

          Layout notes:
          - Both panels use justifyContent: 'flex-start' so the two
            headlines sit at the SAME vertical position (top, after
            padding). Center alignment made them drift apart visually
            because each side's content height differed.
          - Bullet font-size is 18px (up from 15px) — preview feedback
            was the previous size was hard to read. 18 sits well
            against the clamp(26, 3vw, 36) headline without competing
            with it.
          - The "THE ACCREDA DIFFERENCE" eyebrow label was removed
            per direction — the headline alone carries the section. */}
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
                Anesthesia Experts + AI Working Together
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Dedicated anesthesia billing team that understands units, modifiers, concurrency, and the rules each payer follows, because that\u2019s all they do',
                  'AI handles eligibility verification, authorization tracking, and claim follow-up across your full volume',
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


      {/* What Sets Accreda Apart — 3 specialty-specific cards per
          Specialty Pages doc (v1, May 19 2026). Previously 6 generic
          cards (Real+AI, Boutique, etc.); replaced with content
          that speaks directly to the anesthesia buyer. */}
      <section className="section">
        <div className="container">
        <RevealOnScroll><div className="section-title">What Sets Accreda Apart</div></RevealOnScroll>

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


      {/* RCM Solutions: Complete Anesthesia Revenue Cycle — 8 cards
          per Specialty Pages doc (v1, May 19 2026). Card titles and
          descriptions are verbatim from the doc; references to Chris
          and Cindy match the AI agents on the homepage.

          Layout: an asymmetric bento grid inspired by the 21st Dev
          bento-product-features pattern, rebuilt natively (no
          shadcn / framer-motion import) to match the rest of the
          site's styling conventions.

          - 4 columns x 3 rows on desktop
          - Card 1 (lead, col 1, rows 1-2): Anesthesia-Specific Coding,
            larger title, teal accent stripe, eyebrow label
          - Cards 2-7 (rows 1 and 2, cols 2-4): standard 1x1 cards
            auto-placed by the grid in source order
          - Card 8 (wide footer, row 3, spans all 4 cols): Analytics
            & Visibility, two-column inner layout with a pulsing
            "LIVE" pill to hint at real-time dashboards
          - Hover on any card: -3px lift + teal border + soft shadow
          - Stagger reveal via RevealOnScroll with incrementing delay
          - Mobile (<=900px): collapses to a single column, the wide
            card stacks its content vertically */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll><div className="section-title">Complete Anesthesia Revenue Cycle</div></RevealOnScroll>

          <div className="anes-bento" style={{ marginTop: 48 }}>
            {/* Lead card — Anesthesia-Specific Coding (col 1, spans 2 rows) */}
            <RevealOnScroll className="anes-bento__pos--lead" delay={0.1}>
              <div className="anes-bento__card anes-bento__card--lead">
                <div className="anes-bento__eyebrow">SPECIALTY EXPERTISE</div>
                <h3 className="anes-bento__title anes-bento__title--lead">{solutions[0].t}</h3>
                <p className="anes-bento__desc">{solutions[0].d}</p>
                {/* Pulsing teal dot at bottom-left as a small visual anchor
                    so the tall card doesn't feel empty in its lower half */}
                <div className="anes-bento__lead-anchor" aria-hidden="true">
                  <span className="anes-bento__pulse-dot" />
                </div>
              </div>
            </RevealOnScroll>

            {/* Standard cards 2-7 — auto-placed into the remaining cells */}
            {solutions.slice(1, 7).map((s, i) => (
              <RevealOnScroll key={s.t} delay={0.15 + i * 0.05}>
                <div className="anes-bento__card">
                  <h3 className="anes-bento__title">{s.t}</h3>
                  <p className="anes-bento__desc">{s.d}</p>
                </div>
              </RevealOnScroll>
            ))}

            {/* Wide footer — Analytics & Visibility, spans all 4 cols on row 3 */}
            <RevealOnScroll className="anes-bento__pos--wide" delay={0.5}>
              <div className="anes-bento__card anes-bento__card--wide">
                <div className="anes-bento__wide-text">
                  <h3 className="anes-bento__title">{solutions[7].t}</h3>
                  <p className="anes-bento__desc">{solutions[7].d}</p>
                </div>
                <div className="anes-bento__pulse" aria-hidden="true">
                  <span className="anes-bento__pulse-dot" />
                  LIVE
                </div>
              </div>
            </RevealOnScroll>
          </div>

          <style>{`
            .anes-bento {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              grid-auto-rows: minmax(180px, auto);
              gap: 16px;
            }

            /* Position classes applied to the RevealOnScroll wrapper
               (which is the actual grid item). Inner .anes-bento__card
               fills 100% height via the card style block below. */
            .anes-bento__pos--lead {
              grid-column: 1 / 2;
              grid-row: 1 / 3;
            }
            .anes-bento__pos--wide {
              grid-column: 1 / 5;
              grid-row: 3;
            }

            /* Base card */
            .anes-bento__card {
              height: 100%;
              background: var(--white);
              border: 1px solid var(--gray-200);
              border-radius: 16px;
              padding: 28px 30px;
              display: flex;
              flex-direction: column;
              gap: 10px;
              position: relative;
              overflow: hidden;
              transition: border-color 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
                transform 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
                box-shadow 280ms cubic-bezier(0.22, 0.61, 0.36, 1);
            }
            .anes-bento__card:hover {
              border-color: #00B5D6;
              transform: translateY(-3px);
              box-shadow: 0 16px 36px -16px rgba(0, 181, 214, 0.22);
            }

            /* Lead variant */
            .anes-bento__card--lead {
              background: linear-gradient(165deg, #FFFFFF 0%, #F4FBFD 100%);
              padding: 38px 34px 32px;
              gap: 14px;
            }
            .anes-bento__card--lead::before {
              content: '';
              position: absolute;
              top: 0; left: 0;
              width: 4px;
              height: 100%;
              background: linear-gradient(180deg, #00B5D6 0%, rgba(0,181,214,0.4) 100%);
            }
            .anes-bento__lead-anchor {
              margin-top: auto;
              padding-top: 24px;
              display: flex;
              align-items: center;
              gap: 8px;
            }

            /* Wide variant — title/desc on left, LIVE pill on right */
            .anes-bento__card--wide {
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              gap: 32px;
              padding: 28px 36px;
            }
            .anes-bento__wide-text {
              display: flex;
              flex-direction: column;
              gap: 8px;
              max-width: 720px;
            }

            /* Typography */
            .anes-bento__eyebrow {
              font-family: var(--font-display);
              font-size: 11px;
              font-weight: 500;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: #00B5D6;
              margin: 0 0 2px 0;
            }
            .anes-bento__title {
              font-size: 17px;
              font-weight: 500;
              color: var(--gray-900);
              margin: 0;
              line-height: 1.3;
            }
            .anes-bento__title--lead {
              font-size: 22px;
              font-weight: 400;
              font-family: var(--font-display);
              line-height: 1.2;
              letter-spacing: -0.01em;
            }
            .anes-bento__desc {
              font-size: 14.5px;
              line-height: 1.6;
              color: var(--gray-600);
              margin: 0;
            }

            /* Pulsing LIVE indicator on wide card + dot on lead card */
            .anes-bento__pulse {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              font-size: 11px;
              font-weight: 600;
              letter-spacing: 0.12em;
              color: #00B5D6;
              background: rgba(0, 181, 214, 0.08);
              border: 1px solid rgba(0, 181, 214, 0.22);
              border-radius: 999px;
              padding: 8px 14px 8px 12px;
              flex-shrink: 0;
            }
            .anes-bento__pulse-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #00B5D6;
              animation: anes-bento-pulse 1.8s ease-in-out infinite;
            }
            @keyframes anes-bento-pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.45; transform: scale(0.7); }
            }

            /* Tablet: 2 columns, lead and wide both span full width */
            @media (max-width: 1100px) {
              .anes-bento { grid-template-columns: repeat(2, 1fr); }
              .anes-bento__pos--lead { grid-column: 1 / -1; grid-row: auto; }
              .anes-bento__pos--wide { grid-column: 1 / -1; grid-row: auto; }
            }

            /* Mobile: single column, wide card stacks */
            @media (max-width: 720px) {
              .anes-bento {
                grid-template-columns: 1fr;
                grid-auto-rows: auto;
              }
              .anes-bento__card { padding: 24px 24px; }
              .anes-bento__card--lead { padding: 28px 24px; }
              .anes-bento__card--wide {
                flex-direction: column;
                align-items: flex-start;
                gap: 16px;
                padding: 24px;
              }
              .anes-bento__title--lead { font-size: 20px; }
            }
          `}</style>
        </div>
      </section>


      {/* Pre-Service Collection, Priya */}
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
                    <div style={{ fontSize: 32, fontWeight: 300, color: 'var(--primary)' }}>30–40%</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Higher Collection Rate</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 32, fontWeight: 300, color: 'var(--primary)' }}>3–7 Days</div>
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


      {/* Leadership, 250+ years */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">Leadership Combined Experience</div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 12, marginTop: 16, marginBottom: 48 }}>
              <span style={{ fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: 200, color: 'var(--primary)', lineHeight: 1 }}>250+</span>
              <span style={{ fontSize: 18, color: 'var(--gray-600)', fontWeight: 300 }}>years exclusively in anesthesia RCM</span>
            </div>
          </RevealOnScroll>

          {/* Team rendered as circle avatars — same pattern as the homepage
              voice agents and the About Us leadership grid. */}
          <TeamCircleGrid
            people={leaders.map(l => ({ name: l.name, title: l.role, photo: l.photo }))}
            baseDelay={0.1}
          />
        </div>
      </section>


      {/* Client Reviews — uses shared TestimonialsSection so design is identical site-wide */}
      <TestimonialsSection
        testimonials={testimonials}
        label="CLIENT REVIEWS"
        title={<>What Our <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Clients</span> Say.</>}
      />
    </>
  )
}
