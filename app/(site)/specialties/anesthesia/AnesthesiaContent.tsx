'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
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
//
// Each card carries an `eyebrow` (small caps label above the title)
// and an `anim` key that selects the bottom decorative animation
// (see CardAnimation switch below).
const solutions = [
  { t: 'Anesthesia-Specific Coding', d: 'Base units, time units, modifiers, concurrency. Coded accurately for every case type including cardiac, OB, pain, and regional.', eyebrow: 'SPECIALTY EXPERTISE', anim: 'modifiers' as const },
  { t: 'Payer-Specific Billing Rules', d: 'Each payer reimburses anesthesia differently. Our team knows the rules for every major carrier and adapts accordingly.', eyebrow: 'PAYER INTELLIGENCE', anim: 'rules' as const },
  { t: 'Credentialing & Enrollment', d: 'Provider credentialing managed across all payers and facilities. DEA, OIG, and CAQH kept current.', eyebrow: 'FRONT OFFICE', anim: 'badges' as const },
  { t: 'Prior Authorization', d: 'Authorizations tracked and cleared before scheduled procedures. No OR delays. No revenue surprises.', eyebrow: 'AUTHORIZATIONS', anim: 'stamp' as const },
  { t: 'Denial Management & Appeals', d: 'Every denial gets a root cause review. Clinical rationale built by anesthesia experts. 95%+ appeal success rate.', eyebrow: 'DENIAL PREVENTION', anim: 'stat' as const },
  { t: 'AR Follow-Up & Collections', d: 'Chris calls payers thousands of times per week for claim status, escalations, and resolution. Your team focuses on patients.', eyebrow: 'AI AGENT \u2014 CHRIS', anim: 'pulse' as const, agent: { name: 'Chris', img: 'chris.png' } },
  { t: 'Patient Billing & Support', d: 'Cindy handles patient balances, pre-procedure cost estimates, and billing questions in over 50 languages.', eyebrow: 'AI AGENT \u2014 CINDY', anim: 'languages' as const, agent: { name: 'Cindy', img: 'cindy.png' } },
  { t: 'Analytics & Visibility', d: 'Live dashboards by provider, case type, facility, payer, and denial category. No waiting for month-end reports.', eyebrow: 'REAL-TIME INSIGHTS', anim: 'chart' as const },
]

type AnimKind = typeof solutions[number]['anim']

/**
 * CardAnimation — small decorative SVG/CSS motif rendered in the
 * bottom half of each RCM Solutions card. Each motif is themed to
 * the card's content (modifier codes for coding, badges for
 * credentialing, etc.). All animations are CSS-only (transforms +
 * opacity) and respect prefers-reduced-motion via the parent
 * class .anes-marquee[data-reduced=true] which freezes them.
 */
function CardAnimation({ kind }: { kind: AnimKind }) {
  switch (kind) {
    case 'modifiers':
      // Anesthesia modifier codes laid out cleanly in a row. One
      // pill at a time gets the "active" treatment (scale up, brighter
      // border, teal fill) cycling through AA -> QK -> QY -> AD.
      // Reads more like "we know all four" than the previous scattered
      // floating pills which were hard to track.
      return (
        <div className="anim anim-modifiers" aria-hidden="true">
          <div className="anim-mod-row">
            {['AA', 'QK', 'QY', 'AD'].map((code, i) => (
              <span key={code} className={`anim-mod-pill anim-mod-pill-${i}`}>{code}</span>
            ))}
          </div>
        </div>
      )
    case 'rules':
      // A 4x3 grid of small cells that brighten in a diagonal wave,
      // representing the variability of payer rule sets. Previous
      // 3-stacked-sheets animation was too subtle — user said they
      // didn't see any motion. This is unmistakably moving.
      return (
        <div className="anim anim-rules" aria-hidden="true">
          <div className="anim-rules-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className={`anim-rule-cell anim-rule-cell-${i}`} />
            ))}
          </div>
        </div>
      )
    case 'badges':
      // 3 circle badges with checkmarks fading in sequentially
      return (
        <div className="anim anim-badges" aria-hidden="true">
          {[0, 1, 2].map(i => (
            <span key={i} className={`anim-badge anim-badge-${i}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00B5D6" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>
          ))}
        </div>
      )
    case 'stamp':
      // Progress bar with a stamp dot moving along it
      return (
        <div className="anim anim-stamp" aria-hidden="true">
          <div className="anim-stamp-track">
            <div className="anim-stamp-fill" />
            <div className="anim-stamp-dot" />
          </div>
          <div className="anim-stamp-label">APPROVED</div>
        </div>
      )
    case 'stat':
      // Big 95% with rising bars beside it
      return (
        <div className="anim anim-stat" aria-hidden="true">
          <div className="anim-stat-number">
            95<span className="anim-stat-pct">%</span>
          </div>
          <div className="anim-stat-bars">
            {[0, 1, 2, 3].map(i => (
              <span key={i} className={`anim-stat-bar anim-stat-bar-${i}`} />
            ))}
          </div>
        </div>
      )
    case 'pulse':
      // Phone icon with 3 concentric pulse rings
      return (
        <div className="anim anim-pulse" aria-hidden="true">
          <span className="anim-pulse-ring anim-pulse-ring-0" />
          <span className="anim-pulse-ring anim-pulse-ring-1" />
          <span className="anim-pulse-ring anim-pulse-ring-2" />
          <span className="anim-pulse-core">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00B5D6" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72a2 2 0 011.72 2z" />
            </svg>
          </span>
        </div>
      )
    case 'languages':
      // Three chat bubbles in a conversation layout — left/right/left
      // alignment with tail corners, suggesting a translated exchange.
      // Each bubble carries a greeting in a different language. The
      // sequence fades in 0/0.8s/1.6s and resets at 4s. Previous
      // scattered-bubble version was hard to scan; this reads as a
      // real conversation.
      return (
        <div className="anim anim-langs" aria-hidden="true">
          <span className="anim-lang-bubble anim-lang-bubble-left anim-lang-bubble-0">Hello</span>
          <span className="anim-lang-bubble anim-lang-bubble-right anim-lang-bubble-1">Hola</span>
          <span className="anim-lang-bubble anim-lang-bubble-left anim-lang-bubble-2">你好</span>
        </div>
      )
    case 'chart':
      // Bar chart growing sequentially
      return (
        <div className="anim anim-chart" aria-hidden="true">
          {[36, 52, 28, 64, 44, 72, 58].map((h, i) => (
            <span key={i} className={`anim-chart-bar anim-chart-bar-${i}`} style={{ height: `${h}%` }} />
          ))}
        </div>
      )
  }
}

/**
 * DraggableMarquee — auto-scrolling card track with drag-to-scrub.
 *
 * Why a JS-controlled marquee instead of CSS keyframes:
 *   The previous version used `animation: anes-marquee-scroll 60s
 *   linear infinite` with hover-to-pause. Preview feedback was that
 *   readers also want to be able to drag the track left/right to
 *   land on a specific card. CSS keyframes don't combine cleanly
 *   with manual position control — resuming from a dragged position
 *   would require splicing animation-delay math and still risks
 *   jumps. A single requestAnimationFrame loop that updates a ref
 *   and writes inline transform is simpler and gives precise drag
 *   control with no flicker.
 *
 * State lives in refs (not useState) so high-frequency updates
 * during scroll/drag don't trigger React re-renders for every
 * frame. The component renders once and the RAF loop mutates the
 * track's style directly via the trackRef.
 *
 * Seamless loop: the cards are rendered twice, so when the track
 * has translated past -halfWidth we add halfWidth back. The user
 * sees a continuous strip — there's no visible reset.
 *
 * Hover and drag both suppress the auto-scroll tick. When the user
 * releases the pointer the loop resumes from wherever the drag
 * left it.
 *
 * Touch: PointerEvents fire for both mouse and touch. CSS
 * `touch-action: pan-y` lets vertical page scrolling pass through
 * so swiping up/down on the marquee still scrolls the page on
 * mobile; only horizontal pans are captured by the marquee.
 *
 * Reduced motion: respects prefers-reduced-motion at mount time
 * by skipping the RAF speed update entirely. Drag still works.
 */
function DraggableMarquee({ items }: { items: typeof solutions }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const translateXRef = useRef(0)
  const halfWidthRef = useRef(0)
  const isDraggingRef = useRef(false)
  const isHoveringRef = useRef(false)
  const dragStartRef = useRef({ pointerX: 0, translateX: 0 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!trackRef.current) return

    // Total scrollable distance is exactly half the track width
    // (since items are rendered twice). Re-measure on window resize
    // because card widths use clamp() and change at breakpoints.
    const measureHalfWidth = () => {
      if (!trackRef.current) return
      halfWidthRef.current = trackRef.current.scrollWidth / 2
    }
    measureHalfWidth()
    window.addEventListener('resize', measureHalfWidth)

    // Respect reduced-motion preference for the auto-scroll only —
    // dragging still works, the marquee just doesn't move on its own.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Speed: roughly matches the previous 60s CSS animation
    // (half-track distance over 60s at ~60fps). Tunable.
    const SPEED_PX_PER_FRAME = 0.55

    const tick = () => {
      const shouldAutoScroll =
        !isDraggingRef.current && !isHoveringRef.current && !reducedMotion

      if (shouldAutoScroll) {
        translateXRef.current -= SPEED_PX_PER_FRAME
      }

      // Wrap to keep position in (-halfWidth, 0] range. The seamless
      // duplication of cards means a wrap is visually invisible.
      const half = halfWidthRef.current
      if (half > 0) {
        if (translateXRef.current <= -half) translateXRef.current += half
        else if (translateXRef.current > 0) translateXRef.current -= half
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${translateXRef.current}px, 0, 0)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', measureHalfWidth)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Capture so we keep getting pointermove/pointerup even if the
    // pointer leaves the element bounds mid-drag.
    e.currentTarget.setPointerCapture(e.pointerId)
    isDraggingRef.current = true
    dragStartRef.current = {
      pointerX: e.clientX,
      translateX: translateXRef.current,
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    const delta = e.clientX - dragStartRef.current.pointerX
    translateXRef.current = dragStartRef.current.translateX + delta
    // No setState — the RAF tick (which is still running) will
    // pick up the new translateXRef value next frame and write it
    // to the DOM. We could also write it here for snappier feel,
    // but RAF batches DOM writes which is friendlier under load.
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <div
      className="anes-marquee"
      onMouseEnter={() => { isHoveringRef.current = true }}
      onMouseLeave={() => { isHoveringRef.current = false }}
      style={{ marginTop: 48 }}
    >
      <div
        ref={trackRef}
        className="anes-marquee-track"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Cards rendered twice for seamless loop. The second set is
            aria-hidden so screen readers don't read each card twice. */}
        {[...items, ...items].map((s, i) => (
          <article key={i} className="anes-card" aria-hidden={i >= items.length}>
            <div className="anes-card-stripe" />
            {/* Eyebrow row: agent cards (Chris, Cindy) get a clickable
                circular avatar to the left of the eyebrow text that
                links to the R+A page where the agents are fully
                described. Non-agent cards render the eyebrow text only. */}
            {s.agent ? (
              <div className="anes-card-eyebrow-row">
                <Link
                  href="/cosentus-ai"
                  className="anes-card-avatar"
                  aria-label={`Meet ${s.agent.name}, our AI agent`}
                  // Stop drag events from being interpreted as a click
                  // and stop click events from bubbling into the drag
                  // handler on the track. Without this, every drag
                  // that started on the avatar would also navigate.
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <img
                    src={`/images/${s.agent.img}`}
                    alt=""
                    width={80}
                    height={80}
                    draggable={false}
                  />
                </Link>
                <span className="anes-card-eyebrow">{s.eyebrow}</span>
              </div>
            ) : (
              <div className="anes-card-eyebrow">{s.eyebrow}</div>
            )}
            <h3 className="anes-card-title">{s.t}</h3>
            <p className="anes-card-desc">{s.d}</p>
            <div className="anes-card-anim">
              <CardAnimation kind={s.anim} />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

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

          Layout: a horizontal auto-scrolling marquee carousel where
          every card uses the same "lead" treatment that the bento
          version had on its first cell (teal accent stripe, gradient
          white-to-pale-teal background, eyebrow label, display-font
          title). Each card carries a unique CSS animation in its
          lower half tied to the card's content.

          Marquee mechanics (see DraggableMarquee component above):
            - Cards rendered TWICE so the translateX loop is seamless
            - JS-controlled position via requestAnimationFrame, ~0.55px
              per frame (~33px/sec at 60fps). No CSS keyframes anymore.
            - Pause on hover, drag to scrub left/right (PointerEvents
              so it works for mouse and touch)
            - Edge fade via mask-image
            - prefers-reduced-motion: reduce stops the auto-scroll;
              dragging still works

          Card width clamps to roughly 25% of a 1280px container
          (300-340px) so four cards are visible at once on desktop,
          which matches the user's "have four visible, scrolling"
          direction. Mobile shows fewer naturally as the viewport
          narrows. */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll><div className="section-title">Complete Anesthesia Revenue Cycle</div></RevealOnScroll>
        </div>

        {/* Marquee lives OUTSIDE .container so the cards can scroll
            edge-to-edge. The fade mask on .anes-marquee handles the
            "appears from the right, disappears on the left" feel.
            Marquee logic moved into DraggableMarquee — see component
            above for drag-to-scrub behavior. */}
        <DraggableMarquee items={solutions} />

          <style>{`
            /* === Marquee container ===
               Track motion is now JS-controlled via DraggableMarquee
               above. No CSS animation here — the previous keyframe
               (anes-marquee-scroll) was removed when drag-to-scrub
               was added, because resuming a CSS keyframe from a
               dragged position requires animation-delay math that's
               messier than a single RAF loop. */
            .anes-marquee {
              overflow: hidden;
              position: relative;
              /* Edge fade so cards don't cut hard at the edges */
              -webkit-mask-image: linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%);
              mask-image: linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%);
            }
            .anes-marquee-track {
              display: flex;
              gap: 20px;
              width: max-content;
              padding: 8px 20px;
              will-change: transform;
              /* Grab cursor signals draggability. Switches to grabbing
                 while the pointer is held down. */
              cursor: grab;
              /* touch-action: pan-y lets vertical page scrolling pass
                 through on mobile while still capturing horizontal
                 pans for the drag handler. */
              touch-action: pan-y;
              /* Prevent text selection during drag — important
                 because card titles/descriptions are real text and
                 a slow drag otherwise selects them. */
              user-select: none;
              -webkit-user-select: none;
            }
            .anes-marquee-track:active {
              cursor: grabbing;
            }

            /* === Card (all 8 share this — uniform lead-style) === */
            .anes-card {
              flex-shrink: 0;
              width: clamp(280px, 22vw, 330px);
              height: 420px;
              background: linear-gradient(165deg, #FFFFFF 0%, #F4FBFD 100%);
              border: 1px solid var(--gray-200);
              border-radius: 16px;
              padding: 36px 30px 28px;
              display: flex;
              flex-direction: column;
              gap: 12px;
              position: relative;
              overflow: hidden;
              transition: border-color 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
                transform 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
                box-shadow 280ms cubic-bezier(0.22, 0.61, 0.36, 1);
            }
            .anes-card:hover {
              border-color: #00B5D6;
              transform: translateY(-3px);
              box-shadow: 0 16px 36px -16px rgba(0, 181, 214, 0.22);
            }
            .anes-card-stripe {
              position: absolute;
              top: 0; left: 0;
              width: 4px;
              height: 100%;
              background: linear-gradient(180deg, #00B5D6 0%, rgba(0,181,214,0.4) 100%);
            }
            .anes-card-eyebrow {
              font-family: var(--font-display);
              font-size: 16px;
              font-weight: 600;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              color: #00B5D6;
            }
            /* Eyebrow row for agent cards (Chris, Cindy) — avatar
               sits to the left of the eyebrow text, vertically
               centered. */
            .anes-card-eyebrow-row {
              display: flex;
              align-items: center;
              gap: 16px;
            }
            /* Clickable circular avatar. Wrapped in Next.js <Link>.
               Hover effect: subtle scale + brighter border. The
               onPointerDown on the Link in JSX prevents the marquee
               drag handler from also receiving the gesture, so the
               click is unambiguous.
               Size: 80px so the agent face is actually recognizable.
               Preview feedback was 'you can't even see anything' at
               the previous 40px size — doubled. */
            .anes-card-avatar {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 80px;
              height: 80px;
              border-radius: 50%;
              overflow: hidden;
              border: 2px solid #00B5D6;
              background: var(--white);
              flex-shrink: 0;
              cursor: pointer;
              transition: transform 200ms cubic-bezier(0.22, 0.61, 0.36, 1),
                box-shadow 200ms cubic-bezier(0.22, 0.61, 0.36, 1),
                border-color 200ms cubic-bezier(0.22, 0.61, 0.36, 1);
            }
            .anes-card-avatar:hover {
              transform: scale(1.06);
              box-shadow: 0 6px 18px -6px rgba(0, 181, 214, 0.5);
              border-color: #00A0C0;
            }
            .anes-card-avatar:focus-visible {
              outline: none;
              box-shadow: 0 0 0 3px rgba(0, 181, 214, 0.35);
            }
            .anes-card-avatar img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
              /* Prevent the native image drag-and-drop ghost from
                 hijacking pointer drags on the marquee. */
              -webkit-user-drag: none;
              user-select: none;
            }
            .anes-card-title {
              font-family: var(--font-display);
              font-size: 20px;
              font-weight: 400;
              color: var(--gray-900);
              margin: 0;
              line-height: 1.2;
              letter-spacing: -0.01em;
            }
            .anes-card-desc {
              font-size: 14px;
              line-height: 1.6;
              color: var(--gray-600);
              margin: 0;
            }
            .anes-card-anim {
              margin-top: auto;
              height: 110px;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            /* === Per-card animations === */

            /* Modifiers: clean row of 4 pills with sequential highlight.
               Each pill is dimmed by default; one at a time gets the
               full teal treatment with a small scale-up. */
            .anim-modifiers {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .anim-mod-row {
              display: flex;
              gap: 10px;
            }
            .anim-mod-pill {
              font-family: var(--font-display);
              font-size: 14px;
              font-weight: 600;
              letter-spacing: 0.05em;
              color: rgba(0, 181, 214, 0.55);
              background: rgba(0, 181, 214, 0.06);
              border: 1px solid rgba(0, 181, 214, 0.2);
              border-radius: 999px;
              padding: 7px 14px;
              transform-origin: center;
              animation: anes-mod-cycle 3.2s ease-in-out infinite;
            }
            .anim-mod-pill-0 { animation-delay: 0s;   }
            .anim-mod-pill-1 { animation-delay: 0.4s; }
            .anim-mod-pill-2 { animation-delay: 0.8s; }
            .anim-mod-pill-3 { animation-delay: 1.2s; }
            @keyframes anes-mod-cycle {
              0%, 100%, 50% {
                color: rgba(0, 181, 214, 0.55);
                background: rgba(0, 181, 214, 0.06);
                border-color: rgba(0, 181, 214, 0.2);
                transform: scale(1);
                box-shadow: none;
              }
              12.5% {
                color: var(--white);
                background: #00B5D6;
                border-color: #00B5D6;
                transform: scale(1.12);
                box-shadow: 0 6px 14px -6px rgba(0, 181, 214, 0.55);
              }
            }

            /* Rules: 4x3 grid of cells. Cells brighten in a diagonal
               wave (delay increases along the i+j diagonal) which reads
               like a sweep crossing the grid. Visibly animated unlike
               the previous 6px-shift sheet stack. */
            .anim-rules {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .anim-rules-grid {
              display: grid;
              grid-template-columns: repeat(4, 16px);
              grid-template-rows: repeat(3, 16px);
              gap: 6px;
            }
            .anim-rule-cell {
              border-radius: 3px;
              background: rgba(0, 181, 214, 0.12);
              border: 1px solid rgba(0, 181, 214, 0.22);
              animation: anes-rule-wave 2.8s ease-in-out infinite;
            }
            /* Diagonal sweep delays: (col + row) * 0.12s */
            .anim-rule-cell-0  { animation-delay: 0s;    }
            .anim-rule-cell-1  { animation-delay: 0.12s; }
            .anim-rule-cell-2  { animation-delay: 0.24s; }
            .anim-rule-cell-3  { animation-delay: 0.36s; }
            .anim-rule-cell-4  { animation-delay: 0.12s; }
            .anim-rule-cell-5  { animation-delay: 0.24s; }
            .anim-rule-cell-6  { animation-delay: 0.36s; }
            .anim-rule-cell-7  { animation-delay: 0.48s; }
            .anim-rule-cell-8  { animation-delay: 0.24s; }
            .anim-rule-cell-9  { animation-delay: 0.36s; }
            .anim-rule-cell-10 { animation-delay: 0.48s; }
            .anim-rule-cell-11 { animation-delay: 0.60s; }
            @keyframes anes-rule-wave {
              0%, 60%, 100% {
                background: rgba(0, 181, 214, 0.12);
                border-color: rgba(0, 181, 214, 0.22);
                transform: scale(1);
              }
              25%, 35% {
                background: #00B5D6;
                border-color: #00B5D6;
                transform: scale(1.12);
              }
            }

            /* Badges: 3 circles with checkmarks fading in */
            .anim-badges {
              display: flex;
              gap: 14px;
              align-items: center;
            }
            .anim-badge {
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background: rgba(0, 181, 214, 0.08);
              border: 1.5px solid #00B5D6;
              display: flex;
              align-items: center;
              justify-content: center;
              animation: anes-badge-fade 3s ease-in-out infinite;
            }
            .anim-badge-0 { animation-delay: 0s; }
            .anim-badge-1 { animation-delay: 0.4s; }
            .anim-badge-2 { animation-delay: 0.8s; }
            @keyframes anes-badge-fade {
              0%, 80%, 100% { opacity: 1; transform: scale(1); }
              40%           { opacity: 0.4; transform: scale(0.88); }
            }

            /* Stamp: progress bar with moving dot + label */
            .anim-stamp {
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 12px;
              padding: 0 16px;
            }
            .anim-stamp-track {
              position: relative;
              width: 100%;
              height: 6px;
              background: rgba(0, 181, 214, 0.12);
              border-radius: 999px;
              overflow: visible;
            }
            .anim-stamp-fill {
              position: absolute;
              top: 0; left: 0;
              height: 100%;
              background: #00B5D6;
              border-radius: 999px;
              animation: anes-stamp-fill 3.5s ease-in-out infinite;
            }
            .anim-stamp-dot {
              position: absolute;
              top: 50%;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: #00B5D6;
              box-shadow: 0 0 0 4px rgba(0, 181, 214, 0.22);
              transform: translate(-50%, -50%);
              animation: anes-stamp-dot 3.5s ease-in-out infinite;
            }
            @keyframes anes-stamp-fill {
              0%, 100% { width: 0%; }
              60%      { width: 100%; }
              80%      { width: 100%; }
            }
            @keyframes anes-stamp-dot {
              0%, 100% { left: 0%; }
              60%      { left: 100%; }
              80%      { left: 100%; }
            }
            .anim-stamp-label {
              font-family: var(--font-display);
              font-size: 11px;
              font-weight: 600;
              letter-spacing: 0.16em;
              color: #00B5D6;
            }

            /* Stat: big 95% number + rising bars */
            .anim-stat {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 18px;
              width: 100%;
            }
            .anim-stat-number {
              font-family: var(--font-display);
              font-size: 56px;
              font-weight: 300;
              color: var(--gray-900);
              line-height: 1;
              letter-spacing: -0.03em;
            }
            .anim-stat-pct {
              font-size: 28px;
              color: #00B5D6;
              margin-left: 2px;
            }
            .anim-stat-bars {
              display: flex;
              align-items: flex-end;
              gap: 4px;
              height: 60px;
            }
            .anim-stat-bar {
              width: 6px;
              background: linear-gradient(180deg, #00B5D6 0%, rgba(0, 181, 214, 0.4) 100%);
              border-radius: 2px;
              transform-origin: bottom;
              animation: anes-stat-bar-grow 2.5s ease-in-out infinite;
            }
            .anim-stat-bar-0 { height: 28%; animation-delay: 0s;   }
            .anim-stat-bar-1 { height: 50%; animation-delay: 0.15s;}
            .anim-stat-bar-2 { height: 72%; animation-delay: 0.3s; }
            .anim-stat-bar-3 { height: 95%; animation-delay: 0.45s;}
            @keyframes anes-stat-bar-grow {
              0%, 100% { transform: scaleY(1); }
              50%      { transform: scaleY(0.5); }
            }

            /* Pulse: phone + concentric rings (Chris) */
            .anim-pulse {
              position: relative;
              width: 80px;
              height: 80px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .anim-pulse-ring {
              position: absolute;
              inset: 0;
              border-radius: 50%;
              border: 1.5px solid #00B5D6;
              animation: anes-pulse-ring 2.4s ease-out infinite;
              opacity: 0;
            }
            .anim-pulse-ring-0 { animation-delay: 0s; }
            .anim-pulse-ring-1 { animation-delay: 0.8s; }
            .anim-pulse-ring-2 { animation-delay: 1.6s; }
            @keyframes anes-pulse-ring {
              0%   { transform: scale(0.5); opacity: 0.9; }
              80%  { transform: scale(1.6); opacity: 0; }
              100% { transform: scale(1.6); opacity: 0; }
            }
            .anim-pulse-core {
              position: relative;
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background: rgba(0, 181, 214, 0.1);
              border: 1.5px solid #00B5D6;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1;
            }

            /* Languages: 3 chat bubbles staged as a conversation —
               left-aligned 'Hello', right-aligned 'Hola', left-aligned
               '你好' (Chinese). Bubbles have tail corners (one rounded
               corner reduced) and the right one is teal-tinted to read
               like an outbound message. Reads as a real translated
               exchange rather than scattered language codes. */
            .anim-langs {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              gap: 6px;
              padding: 0 18px;
            }
            .anim-lang-bubble {
              font-size: 13px;
              font-weight: 500;
              color: var(--gray-900);
              background: var(--white);
              border: 1px solid rgba(0, 181, 214, 0.3);
              border-radius: 14px;
              padding: 6px 14px;
              width: fit-content;
              max-width: 75%;
              box-shadow: 0 2px 6px -2px rgba(0, 181, 214, 0.18);
              opacity: 0;
              animation: anes-lang-message 4.2s ease-in-out infinite;
            }
            .anim-lang-bubble-left {
              align-self: flex-start;
              border-bottom-left-radius: 4px;
            }
            .anim-lang-bubble-right {
              align-self: flex-end;
              background: rgba(0, 181, 214, 0.12);
              border-color: rgba(0, 181, 214, 0.4);
              color: #006B81;
              border-bottom-right-radius: 4px;
            }
            .anim-lang-bubble-0 { animation-delay: 0s;   }
            .anim-lang-bubble-1 { animation-delay: 0.7s; }
            .anim-lang-bubble-2 { animation-delay: 1.4s; }
            @keyframes anes-lang-message {
              0%, 70%, 100% { opacity: 0; transform: translateY(6px); }
              15%, 60%      { opacity: 1; transform: translateY(0); }
            }

            /* Chart: animated bar chart.
               BUG FIX: previously missing width: 100% meant the chart
               as a flex child of .anes-card-anim shrank to 0 because
               its bars used flex: 1 (basis 0%) with no parent width
               to distribute across. That's why the Analytics card
               looked empty in preview. */
            .anim-chart {
              display: flex;
              align-items: flex-end;
              gap: 6px;
              width: 100%;
              height: 80%;
              padding: 0 12px;
            }
            .anim-chart-bar {
              flex: 1;
              background: linear-gradient(180deg, #00B5D6 0%, rgba(0, 181, 214, 0.35) 100%);
              border-radius: 3px 3px 0 0;
              transform-origin: bottom;
              animation: anes-chart-grow 3s ease-in-out infinite;
            }
            .anim-chart-bar-0 { animation-delay: 0s;    }
            .anim-chart-bar-1 { animation-delay: 0.1s;  }
            .anim-chart-bar-2 { animation-delay: 0.2s;  }
            .anim-chart-bar-3 { animation-delay: 0.3s;  }
            .anim-chart-bar-4 { animation-delay: 0.4s;  }
            .anim-chart-bar-5 { animation-delay: 0.5s;  }
            .anim-chart-bar-6 { animation-delay: 0.6s;  }
            @keyframes anes-chart-grow {
              0%, 100% { transform: scaleY(1); }
              50%      { transform: scaleY(0.4); }
            }

            /* Reduced motion: freeze everything but keep static visuals */
            @media (prefers-reduced-motion: reduce) {
              .anes-marquee-track,
              .anim-mod-pill,
              .anim-rule-cell,
              .anim-badge,
              .anim-stamp-fill,
              .anim-stamp-dot,
              .anim-stat-bar,
              .anim-pulse-ring,
              .anim-lang-bubble,
              .anim-chart-bar {
                animation: none !important;
              }
              /* Make language bubbles all visible at rest so the
                 card isn't blank when animations are off */
              .anim-lang-bubble { opacity: 1; transform: translateY(0); }
            }

            /* Tablet/mobile: same marquee, just narrower cards */
            @media (max-width: 720px) {
              .anes-card {
                width: 78vw;
                height: 400px;
                padding: 28px 24px 24px;
              }
              .anes-card-title { font-size: 19px; }
              /* JS marquee speed is constant across breakpoints —
                 the visual speed difference at narrower viewports
                 is acceptable since the user can drag to scrub. */
            }
          `}</style>
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
