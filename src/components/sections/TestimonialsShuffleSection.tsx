'use client'

import { useState, useEffect, useCallback, type ReactNode } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import RevealText from '@/components/ui/RevealText'
import TestimonialCard from '@/components/ui/TestimonialCard'

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

        <RevealOnScroll delay={0.45}>
          <div
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
            style={{
              marginTop: 64,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 32,
            }}
          >
            {/* Card stack container.
                  The fan extends ~66% to the right of the front card's
                  position (back card sits at x: 66%), so the visual mass
                  is roughly 1.66 * 350 = 581px wide. To centre, we shift
                  the 350px-wide container left by ~115px (half of the
                  extra 231px width). On narrower viewports we shift
                  less; on phones we scale the whole stack down so it
                  fits without horizontal clipping. */}
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

            {/* Controls — dots only.
                  Arrow buttons were removed per design direction; the
                  remaining interactions are drag-left on the front card
                  (which calls handleAdvance) and clicking a dot to bring
                  that testimonial directly to front. */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {testimonials.map((_, i) => {
                const active = i === frontIdx
                return (
                  <button
                    key={i}
                    // Bring testimonials[i] to front. With the offset
                    // model this is just `setOffset(i)`: a testimonial
                    // at array index i has stackIndex (i - offset + N) % N,
                    // and we want that to be 0, so offset = i.
                    // framer-motion animates each card from its current
                    // computed position to its new computed position.
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
          </div>
        </RevealOnScroll>
      </div>

      <style>{`
        /* Stack container — responsive offset so the fan reads
           centred on desktop and stays inside the viewport on
           narrower screens.

           Card dimensions on mobile changed May 2026 per user
           feedback "testimonials cards not sensitive to mobile,
           need to be more mobile sensitive":

             Mobile  (<640px): 280px × 420px,  margin-left: -92px
             Desktop (>=640px): 350px × 450px,  margin-left: -115px

           The previous mobile pattern used transform: scale(0.88)
           at <=768px and scale(0.72) at <=480px on this container.
           That scaled the cards' interior text down with them —
           the 20px quote effectively became 14.4px on phones and
           the 14px role became ~10px, well below readability.

           New approach: smaller natural card dimensions on mobile
           (set via Tailwind h-[420px] w-[280px] on TestimonialCard)
           with no scale() shrinking, so font sizes stay at their
           original values (20px quote, 17px author, etc) and the
           card just fits the viewport at full text legibility.

           Negative margin-left math: cards translate right by
           xPercent of width (0% front -> 66% back), so the visual
           center of the fan sits ~33% right of the front card's
           left edge. To center it, push the stack left by 33% of
           card width.
             desktop: 350 * 0.33 = 115.5  ->  -115px
             mobile:  280 * 0.33 = 92.4   ->  -92px

           Section parent has overflow: hidden so back cards that
           extend beyond the stack right edge clip cleanly without
           horizontal page scroll. */
        .tcard-stack {
          position: relative;
          width: 280px;
          height: 420px;
          margin-left: -92px;
        }
        @media (min-width: 640px) {
          .tcard-stack {
            width: 350px;
            height: 450px;
            margin-left: -115px;
          }
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
