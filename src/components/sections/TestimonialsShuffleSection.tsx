'use client'

import { useState, useEffect, useCallback, type ReactNode } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import RevealText from '@/components/ui/RevealText'
import TestimonialCard, { type CardPosition } from '@/components/ui/TestimonialCard'

/**
 * TestimonialsShuffleSection — home-page-only fan-stack variant of the
 * shared TestimonialsSection. The shared component is still used on 7
 * other pages (specialties/*, services/rcm, partnership) where the
 * carousel design is the documented "identical site-wide" pattern; this
 * is an intentional home-only divergence per design direction.
 *
 * Data:
 *   Uses the same 5 real Cosentus testimonials as the shared
 *   TestimonialsSection so no content is lost in the swap. All 5 are
 *   reachable via drag or the prev/next controls; only 3 are visible at
 *   a time (front/middle/back), with the remaining 2 sitting hidden
 *   behind 'back' until they cycle in.
 *
 * Behaviour parity with the shared section:
 *   - Auto-advance every 5s
 *   - Pause on hover
 *   - Prev/next arrow buttons (reuse .t-arrow class so the global
 *     home-immersive liquid-glass styling in app/globals.css applies
 *     automatically)
 *   - Aria-labels on all controls
 */

export type ShuffleTestimonial = {
  tag?: string
  quote: string
  name: string
  role: string
}

// Identical copy of the data in the shared TestimonialsSection. Kept
// duplicated (not imported) so this component is self-contained and
// the shared section can evolve independently for the other 7 pages.
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

/** Initials from a name — strips honorifics ("Dr.", "M.D.") because they
 *  contain dots; takes the first 2 capitalised initials. Mirrors the
 *  helper in TestimonialsSection.tsx exactly. */
function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(w => w.length > 0 && w[0] === w[0].toUpperCase() && !w.includes('.'))
    .map(w => w[0])
    .slice(0, 2)
    .join('')
}

function buildInitialPositions(count: number): CardPosition[] {
  return Array.from({ length: count }, (_, i) => {
    if (i === 0) return 'front'
    if (i === 1) return 'middle'
    if (i === 2) return 'back'
    return 'hidden'
  })
}

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
  const [positions, setPositions] = useState<CardPosition[]>(() =>
    buildInitialPositions(testimonials.length)
  )
  const [paused, setPaused] = useState(false)

  // If the testimonials array length changes (rare — usually constant),
  // rebuild the position assignment from scratch.
  useEffect(() => {
    setPositions(buildInitialPositions(testimonials.length))
  }, [testimonials.length])

  // Advance: rotate positions array right by 1 (pop last, unshift to start).
  // Effect: front -> hidden, middle -> front, back -> middle, next-hidden -> back.
  // Wrapped in useCallback so the auto-advance interval doesn't churn.
  const handleAdvance = useCallback(() => {
    setPositions(prev => {
      if (prev.length === 0) return prev
      const next = [...prev]
      const last = next.pop() as CardPosition
      next.unshift(last)
      return next
    })
  }, [])

  // Reverse: rotate left by 1 (shift first, push to end).
  // Effect: front -> middle, middle -> back, back -> hidden, last-hidden -> front.
  const handleReverse = useCallback(() => {
    setPositions(prev => {
      if (prev.length === 0) return prev
      const next = [...prev]
      const first = next.shift() as CardPosition
      next.push(first)
      return next
    })
  }, [])

  // Auto-advance every 5s unless paused (matches existing TestimonialsSection cadence).
  useEffect(() => {
    if (paused) return
    const t = setInterval(handleAdvance, 5000)
    return () => clearInterval(t)
  }, [paused, handleAdvance])

  // Find which testimonial index is currently at 'front' — used for the
  // active dot indicator below the stack.
  const frontIdx = positions.indexOf('front')

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
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
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
                  initials={getInitials(t.name)}
                  position={positions[i] ?? 'hidden'}
                  isFront={positions[i] === 'front'}
                  onShuffleAdvance={handleAdvance}
                />
              ))}
            </div>

            {/* Controls — prev/next arrows + position dots.
                  .t-arrow class is reused from the shared TestimonialsSection;
                  globals.css provides the home-immersive liquid-glass override
                  for that class so styling matches the rest of the home page. */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <button
                onClick={handleReverse}
                aria-label="Previous testimonial"
                className="t-arrow"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'rgba(0, 181, 214, 0.18)',
                  backdropFilter: 'blur(5px) saturate(120%)',
                  WebkitBackdropFilter: 'blur(5px) saturate(120%)',
                  border: '1px solid rgba(0, 181, 214, 0.45)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255, 255, 255, 0.45), ' +
                    'inset 0 -1px 0 rgba(0, 80, 100, 0.18), ' +
                    '0 8px 22px rgba(0, 181, 214, 0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition:
                    'background 200ms cubic-bezier(0.22, 0.61, 0.36, 1), ' +
                    'border-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1), ' +
                    'transform 200ms cubic-bezier(0.22, 0.61, 0.36, 1), ' +
                    'box-shadow 250ms cubic-bezier(0.22, 0.61, 0.36, 1)',
                  flexShrink: 0,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00B5D6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* Dots — one per testimonial; the active one is the
                  card currently at 'front'. */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {testimonials.map((_, i) => {
                  const active = i === frontIdx
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        // Step forward until testimonials[i] is at 'front'.
                        // Up to length-1 advances; bail out via no-op if it
                        // can't be found (shouldn't happen).
                        const current = positions.indexOf('front')
                        if (current === -1) return
                        const len = positions.length
                        let steps = (i - current + len) % len
                        // Each step rotates right by 1; doing it in a single
                        // state update prevents the auto-advance interval
                        // from racing intermediate states.
                        setPositions(prev => {
                          let next = [...prev]
                          for (let s = 0; s < steps; s++) {
                            const last = next.pop() as CardPosition
                            next.unshift(last)
                          }
                          return next
                        })
                      }}
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
                onClick={handleAdvance}
                aria-label="Next testimonial"
                className="t-arrow"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'rgba(0, 181, 214, 0.18)',
                  backdropFilter: 'blur(5px) saturate(120%)',
                  WebkitBackdropFilter: 'blur(5px) saturate(120%)',
                  border: '1px solid rgba(0, 181, 214, 0.45)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255, 255, 255, 0.45), ' +
                    'inset 0 -1px 0 rgba(0, 80, 100, 0.18), ' +
                    '0 8px 22px rgba(0, 181, 214, 0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition:
                    'background 200ms cubic-bezier(0.22, 0.61, 0.36, 1), ' +
                    'border-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1), ' +
                    'transform 200ms cubic-bezier(0.22, 0.61, 0.36, 1), ' +
                    'box-shadow 250ms cubic-bezier(0.22, 0.61, 0.36, 1)',
                  flexShrink: 0,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00B5D6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            {/* Hint shown beneath the controls — discoverability for the
                drag interaction. Subtle so it doesn't dominate. */}
            <div
              style={{
                fontSize: 12,
                color: 'rgba(255, 255, 255, 0.55)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.02em',
              }}
            >
              Drag the top card or use the arrows to browse
            </div>
          </div>
        </RevealOnScroll>
      </div>

      {/* Hover styles for the arrow buttons match the shared
          TestimonialsSection's inline <style> block exactly. The
          .home-immersive override in globals.css further re-tints these
          to white-frost on the home page. */}
      <style>{`
        .t-arrow:hover {
          background: rgba(0, 181, 214, 0.85) !important;
          border-color: rgba(0, 181, 214, 0.7) !important;
          transform: translateY(-1px);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.55),
            inset 0 -1px 0 rgba(0, 80, 100, 0.18),
            0 12px 28px rgba(0, 181, 214, 0.42),
            0 0 24px rgba(0, 181, 214, 0.28) !important;
        }
        .t-arrow:hover svg { stroke: white !important; }
        .t-arrow:active { transform: translateY(0) scale(0.98); transition-duration: 0.1s; }

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
      `}</style>
    </section>
  )
}
