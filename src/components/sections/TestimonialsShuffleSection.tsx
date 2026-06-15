'use client'

import { useState, useEffect, useCallback, type ReactNode } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import RevealText from '@/components/ui/RevealText'
import TestimonialCard from '@/components/ui/TestimonialCard'
import TestimonialsMarquee from '@/components/sections/TestimonialsMarquee'

/**
 * TestimonialsShuffleSection — home-page-only fan-stack variant of the
 * shared TestimonialsSection. The shared component is still used on 7
 * other pages (specialties/*, services/rcm, partnership) where the
 * carousel design is the documented "identical site-wide" pattern; this
 * is an intentional home-only divergence per design direction.
 *
 * Stack model:
 *   All N testimonials are rendered simultaneously. The visual fan
 *   spreads from front (stackIndex 0, -6deg, x 0%) to back (stackIndex
 *   N-1, +6deg, x 66%). Each card's rotate/x/opacity is derived by
 *   linear interpolation across stackIndex inside the card component.
 *
 *   A single `offset` integer tracks which testimonial is at front:
 *     testimonials[i].stackIndex == (i - offset + N) % N
 *   So advancing = `setOffset(o => (o + 1) % N)`.
 *
 *   This replaced an earlier 4-state enum (front/middle/back/hidden)
 *   that only showed 3 cards visually for N>3. Users perceived the
 *   gap between "5 dots" and "3 visible cards" as a bug.
 *
 * Behaviour:
 *   - Auto-advance every 5s, paused on hover.
 *   - Drag the front card left > 150px to advance manually.
 *   - Tap a dot to bring that testimonial directly to front.
 */

export type ShuffleTestimonial = {
  tag?: string
  quote: string
  name: string
  role: string
}

// The 5 testimonials shared with TestimonialsSection. Kept duplicated
// (not imported) so this component is self-contained and the shared
// section can evolve independently for the other 7 pages.
const defaultTestimonials: ShuffleTestimonial[] = [
  {
    tag: 'Anesthesia',
    quote:
      'Year-over-year collection rate of 97% from commercial payors and 98% overall. I can wholeheartedly recommend Accreda.',
    name: 'Dr. John B. Field Jr.',
    role: 'Vice President, Anesthesia Associates',
  },
  {
    tag: 'Orthopedic',
    quote:
      'My reimbursements increased after they started coding for me. They bill right away, work in collection and help with coding.',
    name: 'Dr. Morteza Farr',
    role: 'Board Certified Orthopedic Surgeon',
  },
  {
    tag: 'Pain Management',
    quote:
      'Nearly 20 years in practice, Cosentus has provided nothing but positive experiences. Highly recommend without reservations.',
    name: 'Justin Lo, MD',
    role: 'President, Northern California Pain Specialists',
  },
  {
    tag: 'ASC',
    quote:
      'Cosentus has truly been fantastic in all aspects. The job they have done on the outstanding balances saved our surgery center.',
    name: 'John Welsh, M.D.',
    role: 'Surgery Center Director',
  },
  {
    tag: 'Behavioral Health',
    quote:
      'Cosentus ensures accurate, timely billing, reducing our Days in AR and improving cash flow. Responsive to feedback and quick to implement.',
    name: 'Sujan Vatturi',
    role: 'CIO, Hope Services Counseling Center',
  },
]

interface Props {
  /** Override the default testimonial set. */
  testimonials?: ShuffleTestimonial[]
  /** Section title (ReactNode so callers can include the cyan italic accent span). */
  title?: ReactNode
}

export default function TestimonialsShuffleSection({
  testimonials = defaultTestimonials,
  title = (
    <>
      What Our <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Clients</span> Say.
    </>
  ),
}: Props = {}) {
  // `offset` is the index of the testimonial currently at the FRONT of
  // the stack. A testimonial at array index `i` has stackIndex
  // `(i - offset + N) % N` (0 means front). Advancing the stack is just
  // `setOffset(o => (o + 1) % N)`. This is far simpler than the previous
  // position-array rotation and naturally supports any N.
  const [offset, setOffset] = useState(0)
  const [paused, setPaused] = useState(false)

  const N = testimonials.length

  // If the testimonials array length shrinks below the current offset
  // (very rare — callers usually pass a constant array), clamp.
  useEffect(() => {
    if (offset >= N && N > 0) setOffset(0)
  }, [N, offset])

  // Advance: bring the NEXT testimonial to front. Wrapped in useCallback
  // so the auto-advance interval doesn't churn and so the same identity
  // can be passed to TestimonialCard.
  const handleAdvance = useCallback(() => {
    setOffset(o => (N > 0 ? (o + 1) % N : 0))
  }, [N])

  // Step the stack back one (bring the PREVIOUS testimonial to front).
  // Used by the desktop-only prev arrow. Mirrors handleAdvance.
  const handleBack = useCallback(() => {
    setOffset(o => (N > 0 ? (o - 1 + N) % N : 0))
  }, [N])

  // Auto-advance every 5s unless paused. Skipped when there's only one
  // testimonial — no point rotating a stack of one.
  useEffect(() => {
    if (paused || N <= 1) return
    const t = setInterval(handleAdvance, 5000)
    return () => clearInterval(t)
  }, [paused, handleAdvance, N])

  // The testimonial currently at front — used for active dot highlight.
  const frontIdx = offset

  return (
    <section className="section section-alt" style={{ overflow: 'hidden' }}>
      <div className="container">
        <RevealText
          as="h2"
          perWordDelay={0.06}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4.5vw, 56px)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--gray-900)',
            marginTop: 12,
            marginBottom: 0,
          }}
        >
          {title}
        </RevealText>

        {/* MOBILE (< 1024px): the original fan-stack, untouched. Hidden on
            desktop via .tcard-mobile-wrap below. The desktop marquee is
            rendered separately, outside .container, further down. */}
        <RevealOnScroll delay={0.45}>
          <div
            className="tcard-mobile-wrap"
            // Pause auto-advance on mouse hover (desktop) or touch
            // (mobile). Without the touch handlers, the 5s rotation
            // could shift a card out from under a user mid-read on
            // phones. onTouchCancel covers the edge case where the OS
            // interrupts the touch (e.g. a system gesture).
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
            onTouchCancel={() => setPaused(false)}
            // NOTE: no inline `display` here. Visibility AND the flex
            // layout live in the .tcard-mobile-wrap CSS rule below —
            // an inline display:flex would override the desktop
            // `display: none` media query (that exact bug shipped in
            // the first cut of this layout).
            style={{ marginTop: 64 }}
          >
            {/* Card stage = stack + the two desktop side-arrows.
                  The fan extends ~66% to the right of the front card's
                  position (back card sits at x: 66%), so the visual mass
                  is roughly 1.66 * 350 = 581px wide. To centre, we shift
                  the 350px-wide stack left by ~115px (half of the extra
                  231px width). The .tcard-stage gives the prev/next arrow
                  buttons a positioning context so they can sit just
                  outside the centred visual mass, vertically centred on
                  the cards. On narrower viewports we shift less; on phones
                  we scale the stack down (and the arrows are hidden). */}
            <div className="tcard-stage">
              <button
                type="button"
                className="tcard-nav-btn tcard-nav-prev"
                onClick={handleBack}
                aria-label="Previous testimonial"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div className="tcard-stack" aria-roledescription="testimonial fan stack">
                {testimonials.map((t, i) => (
                  <TestimonialCard
                    key={`${t.name}-${i}`}
                    tag={t.tag}
                    testimonial={t.quote}
                    author={t.name}
                    role={t.role}
                    // stackIndex: 0 means front. Modular arithmetic on the
                    // offset means clicking the dot for testimonial[N-1]
                    // brings it directly to front, with intermediate cards
                    // animating into their new fan positions.
                    stackIndex={(i - offset + N) % N}
                    totalCards={N}
                    onShuffleAdvance={handleAdvance}
                  />
                ))}
              </div>

              <button
                type="button"
                className="tcard-nav-btn tcard-nav-next"
                onClick={handleAdvance}
                aria-label="Next testimonial"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Controls — dots. Tap a dot to jump that testimonial to
                  front. Prev/next navigation now lives in the side arrows
                  flanking the card stage (desktop only); drag/tap the
                  front card still advances on touch. */}
            <div className="tcard-dots-row" style={{ display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'center' }}>
              <button
                type="button"
                className="tcard-nav-btn tcard-nav-inline"
                onClick={handleBack}
                aria-label="Previous testimonial"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {testimonials.map((_, i) => {
                  const active = i === frontIdx
                  return (
                    <button
                      key={i}
                      onClick={() => setOffset(i)}
                      aria-label={`Go to testimonial ${i + 1}`}
                      aria-current={active ? 'true' : undefined}
                      style={{
                        width: active ? 28 : 8,
                        height: 8,
                        borderRadius: 4,
                        background: active ? '#00B5D6' : 'var(--gray-300)',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  )
                })}
              </div>
              <button
                type="button"
                className="tcard-nav-btn tcard-nav-inline"
                onClick={handleAdvance}
                aria-label="Next testimonial"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </div>
        </RevealOnScroll>

        {/* DESKTOP (>= 1024px): left-scrolling marquee of the same glass
            cards. Hidden on mobile via .tcard-desktop-wrap. Rendered with
            the same testimonials array so content stays in sync with the
            mobile fan-stack. */}
        <RevealOnScroll delay={0.45}>
          <div className="tcard-desktop-wrap" style={{ marginTop: 64 }}>
            <TestimonialsMarquee testimonials={testimonials} />
          </div>
        </RevealOnScroll>
      </div>

      <style>{`
        /* Desktop/mobile swap. Mobile-first: fan-stack shows, marquee
           hidden. At >=1024px the marquee shows and the fan-stack hides.
           Done in CSS (not JS) to avoid SSR/hydration mismatch — both
           render server-side and CSS decides visibility per viewport. */
        .tcard-desktop-wrap { display: none; }
        .tcard-mobile-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
        }
        @media (min-width: 1024px) {
          .tcard-desktop-wrap { display: block; }
          .tcard-mobile-wrap { display: none; }
        }

        /* Stack container — responsive offset so the fan reads centred
           on desktop and stays inside the viewport on narrower screens. */
        .tcard-stack {
          position: relative;
          width: 350px;
          height: 450px;
          margin-left: -115px;
        }
        @media (max-width: 768px) {
          .tcard-stack {
            margin-left: -80px;
            transform: scale(0.88);
            transform-origin: center center;
          }
        }
        @media (max-width: 480px) {
          .tcard-stack {
            margin-left: -50px;
            transform: scale(0.72);
            transform-origin: center center;
          }
        }

        /* Stage = positioning context for the side arrows. Same box as
           the stack (350x450). The stack keeps its own margin-left:-115px
           to centre the fan's visual mass inside this stage, so the mass
           stays centred exactly as before; the stage just gives the
           absolutely-positioned arrows something to anchor to. */
        .tcard-stage {
          position: relative;
          width: 350px;
          height: 450px;
        }

        /* Manual prev/next arrow buttons — DESKTOP ONLY.
           Teal outline reads on both the dark home-immersive background
           and a light section background; fills teal on hover. Hidden at
           768px and below so phones keep the tap/drag + dots pattern. */
        .tcard-nav-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          flex: 0 0 auto;
          border-radius: 50%;
          border: 1.5px solid #00B5D6;
          background: transparent;
          color: #00B5D6;
          cursor: pointer;
          padding: 0;
          transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;
        }
        .tcard-nav-btn:hover {
          background: #00B5D6;
          color: #ffffff;
        }
        .tcard-nav-btn:active {
          transform: scale(0.92);
        }
        /* Place the arrows just outside the centred visual mass and
           vertically centred on the cards. The mass spans stage-x -115
           (front-card left) to 466 (back-card right), centred on the
           stage centre (175). We park each 44px button ~360px from the
           stage centre (~24px clear of the rotated card corners). Position
           is done with left:50% + margins, NOT transform, so the :active
           scale above doesn't override the placement. */
        .tcard-nav-prev,
        .tcard-nav-next {
          position: absolute;
          top: 50%;
          margin-top: -22px;   /* half of 44px height -> vertical centre */
          left: 50%;
        }
        .tcard-nav-prev {
          margin-left: -382px; /* stage centre 175 - 360 - 22 (half btn) */
        }
        .tcard-nav-next {
          margin-left: 338px;  /* stage centre 175 + 360 - 22 (half btn) */
        }
        @media (max-width: 768px) {
          .tcard-nav-btn {
            display: none;
          }
        }

        /* Inline prev/next buttons live in the dots row and show ONLY on
           phones (<=768px), where the absolute side-arrows are hidden.
           They reuse .tcard-nav-btn styling (teal outline, reads on the
           dark home background) but sit statically in the row. Source
           order matters: these come after the rules above so they win at
           equal specificity. */
        .tcard-nav-inline { display: none; position: static; margin: 0; }
        @media (max-width: 768px) {
          .tcard-nav-inline { display: inline-flex; }
        }

        /* GLASS-SQUARE recipe — 100% faithful to glass_square.svg.
           All cards (front + back) use the 30% white wash + 50%
           white border defined inline in TestimonialCard.tsx. The
           SVG body is flat — no diagonal full-face gradients.
           Previously ::before/::after pseudos painted diagonal
           sparkles only on the front card, but the source SVG has
           flat body + thin outline only. Removed per user
           direction "100% copy of what I sent you". */
      `}</style>
    </section>
  )
}
