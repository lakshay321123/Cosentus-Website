'use client'

/**
 * HomeTestimonials — diagonal stacked-card visual, home page only.
 *
 * Used in place of <TestimonialsSection /> on the home page. The
 * shared TestimonialsSection (carousel) continues to be used on
 * the 5 specialty pages, /services/rcm, and /partnership.
 *
 * Visual: 5 cards skewed -8deg, stacked along a diagonal axis.
 * Cards grayscale by default; hover a card to lift it forward,
 * regain color, and push the cards in front of it further down
 * the diagonal so they don't occlude the focused one.
 *
 * Mobile (≤900px): skew removed (-8deg + narrow viewports = ugly),
 * smaller offsets, tap-to-focus instead of hover. Tap outside any
 * card clears the focus.
 *
 * Inspired by a 21st.dev 'twitter-testimonial-cards' spec but
 * stripped of Twitter chrome (no @handles, no verified badges, no
 * like/retweet counts, no Twitter icon). Only the stacked
 * diagonal layout is borrowed; testimonial data stays the same
 * Cosentus-brand entries used in the carousel version.
 */

import { useState, useEffect, type ReactNode } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import RevealText from '@/components/ui/RevealText'

export type Testimonial = {
  tag?: string
  quote: string
  name: string
  role: string
}

const defaultTestimonials: Testimonial[] = [
  {
    tag: 'Anesthesia',
    quote: 'Year-over-year collection rate of 97% from commercial payors and 98% overall. I can wholeheartedly recommend Accreda.',
    name: 'Dr. John B. Field Jr.',
    role: 'Vice President, Anesthesia Associates',
  },
  {
    tag: 'Orthopedic',
    quote: 'My reimbursements increased after they started coding for me. They bill right away, work in collection and help with coding.',
    name: 'Dr. Morteza Farr',
    role: 'Board Certified Orthopedic Surgeon',
  },
  {
    tag: 'Pain Management',
    quote: 'Nearly 20 years in practice, Cosentus has provided nothing but positive experiences. Highly recommend without reservations.',
    name: 'Justin Lo, MD',
    role: 'President, Northern California Pain Specialists',
  },
  {
    tag: 'ASC',
    quote: 'Cosentus has truly been fantastic in all aspects. The job they have done on the outstanding balances saved our surgery center.',
    name: 'John Welsh, M.D.',
    role: 'Surgery Center Director',
  },
  {
    tag: 'Behavioral Health',
    quote: 'Cosentus ensures accurate, timely billing, reducing our Days in AR and improving cash flow. Responsive to feedback and quick to implement.',
    name: 'Sujan Vatturi',
    role: 'CIO, Hope Services Counseling Center',
  },
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(w => w.length > 0 && w[0] === w[0].toUpperCase() && !w.includes('.'))
    .map(w => w[0])
    .slice(0, 2)
    .join('')
}

interface Props {
  testimonials?: Testimonial[]
  /** Section title supports JSX so the home page can include the teal accent span. */
  title?: ReactNode
}

// Diagonal offsets per card index (i * step) — desktop
const STEP_X_DESKTOP = 60
const STEP_Y_DESKTOP = 28
// Mobile is tighter and skipping skew
const STEP_X_MOBILE = 22
const STEP_Y_MOBILE = 16

export default function HomeTestimonials({
  testimonials = defaultTestimonials,
  title = <>What Our <span style={{ color: '#00B5D6' }}>Clients</span> Say</>,
}: Props = {}) {
  // Three states, in order of "commitment":
  //   hoveredIdx — desktop only, mouse over a card. Triggers a
  //     preview pop (lift + scale + colorize) but doesn't commit.
  //   previewIdx — mobile only, after a single tap. Same visual
  //     as desktop hover. Tap the same card again to promote it
  //     to focusedIdx.
  //   focusedIdx — committed focus. On wide desktop this triggers
  //     the slide-to-right reading area. On mobile/narrow desktop
  //     this just lifts the card a bit more and recedes the
  //     others to 0.75 opacity.
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [previewIdx, setPreviewIdx] = useState<number | null>(null)
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      setIsMobile(w <= 900)
      // Below 1200px the container doesn't have enough inner width
      // to fit the stack + a side-by-side reading area cleanly
      // (stack 660 + gap 60 + card 420 = 1140 needs ~1140 inner;
      // a 1200px viewport with 24px padding * 2 leaves 1152 inner).
      setIsNarrow(w < 1200)
    }
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  // Click outside any card clears both preview and focus.
  useEffect(() => {
    if (focusedIdx === null && previewIdx === null) return
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (target && !target.closest('[data-testimonial-card]')) {
        setFocusedIdx(null)
        setPreviewIdx(null)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [focusedIdx, previewIdx])

  const stepX = isMobile ? STEP_X_MOBILE : STEP_X_DESKTOP
  const stepY = isMobile ? STEP_Y_MOBILE : STEP_Y_DESKTOP

  const N = testimonials.length
  const cardHeight = isMobile ? 220 : 280
  const cardWidth = isMobile ? 280 : 420

  // Stack reserved space (without any push, since focused card now
  // exits the stack rather than displacing other cards).
  const stackWidth = (N - 1) * stepX + cardWidth
  const stackHeight = (N - 1) * stepY + cardHeight

  // Mobile and narrow desktop don't have room for a side-by-side
  // reading position — fall back to the "lift in place" focus
  // behavior. Wide desktop gets the full slide-to-right treatment.
  const useSlideOut = !isMobile && !isNarrow

  // Reading-area position on the right of the stack (desktop only).
  // Gap of 60-100px from the rightmost edge of the stack puts the
  // focused card in the empty area visible in the user's screenshot.
  const focusedX = stackWidth + 60
  const focusedY = (stackHeight - cardHeight) / 2

  // Container height needs to accommodate either the stack or the
  // focused card position, whichever is taller.
  const reservedHeight = Math.max(stackHeight + 40, cardHeight + 40)
  // Container width needs to fit stack + reading area on desktop.
  const reservedWidth = useSlideOut
    ? focusedX + cardWidth
    : stackWidth

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
            style={{
              marginTop: 56,
              position: 'relative',
              width: '100%',
              height: reservedHeight,
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: reservedWidth,
                height: reservedHeight,
                maxWidth: '100%',
              }}
            >
              {testimonials.map((t, i) => {
                const baseX = i * stepX
                const baseY = i * stepY

                const isFocused = focusedIdx === i
                // Preview is hover on desktop, OR single-tap on mobile
                // (before the second tap that commits to focus).
                const isHovered = !isMobile && hoveredIdx === i
                const isPreviewed = isMobile && previewIdx === i
                const isPreview = (isHovered || isPreviewed) && focusedIdx === null
                const anyFocused = focusedIdx !== null
                const skew = isMobile ? 0 : -8

                // Build transform per card:
                //  - Focused (wide desktop): slide to right reading
                //    area, un-skew, scale up 1.05.
                //  - Focused (mobile/narrow): lift more in place,
                //    keep skew.
                //  - Preview (hover/single-tap, no commit yet): lift
                //    forward, scale 1.04, colorize, z above siblings.
                //  - Unfocused while another is focused: stay in
                //    stack, opacity 0.75 (still readable).
                //  - Default: base stack position, grayscale.
                let transform: string
                let opacity = 1
                let cardFilter = 'grayscale(1)'

                if (isFocused && useSlideOut) {
                  transform = `translate(${focusedX}px, ${focusedY}px) skewY(0deg) scale(1.05)`
                  cardFilter = 'grayscale(0)'
                } else if (isFocused) {
                  // Mobile / narrow desktop: lift more, no slide.
                  transform = `translate(${baseX}px, ${baseY - 14}px) skewY(${skew}deg) scale(1.03)`
                  cardFilter = 'grayscale(0)'
                } else if (isPreview) {
                  // Preview pop: lift, scale, colorize. Stays in
                  // stack but pops noticeably forward and is
                  // readable.
                  transform = `translate(${baseX}px, ${baseY - 14}px) skewY(${skew}deg) scale(1.04)`
                  cardFilter = 'grayscale(0)'
                } else if (anyFocused) {
                  // Another card is focused. Gentle recede — still
                  // readable, just visually de-emphasized.
                  transform = `translate(${baseX}px, ${baseY}px) skewY(${skew}deg)`
                  opacity = 0.75
                } else {
                  transform = `translate(${baseX}px, ${baseY}px) skewY(${skew}deg)`
                }

                // zIndex layering:
                //   focused: top (100)
                //   preview/hover: above siblings but below focused (50)
                //   rest: stack order (1..N)
                const zIndex = isFocused ? 100 : isPreview ? 50 : i + 1

                return (
                  <article
                    key={i}
                    data-testimonial-card
                    onMouseEnter={() => !isMobile && setHoveredIdx(i)}
                    onMouseLeave={() => !isMobile && setHoveredIdx(null)}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isMobile) {
                        // Two-step on mobile:
                        //   Tap 1 on a fresh card -> preview state.
                        //   Tap 2 on the same card -> commit to focus.
                        //   Tap a different card -> reset to preview.
                        if (focusedIdx === i) {
                          // Already focused — dismiss.
                          setFocusedIdx(null)
                          setPreviewIdx(null)
                        } else if (previewIdx === i) {
                          // Same card preview -> commit.
                          setFocusedIdx(i)
                          setPreviewIdx(null)
                        } else {
                          // Fresh card or different card -> preview.
                          setPreviewIdx(i)
                          setFocusedIdx(null)
                        }
                      } else {
                        // Desktop: single click toggles focus.
                        setFocusedIdx(prev => (prev === i ? null : i))
                      }
                    }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: cardWidth,
                      minHeight: cardHeight,
                      transform,
                      transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), filter 0.35s ease, box-shadow 0.4s ease, background 0.35s ease, opacity 0.35s ease',
                      filter: cardFilter,
                      opacity,
                      zIndex,
                      cursor: 'pointer',
                      // Cosentus pantone gray (#616161, RGB 97,97,97).
                      // Translucent so the page video bg shows through;
                      // backdropFilter adds the glass blur. Focused
                      // cards bump opacity higher for stronger
                      // readability. This explicit value dodges the
                      // home-immersive attribute selector for
                      // [style*="background: var(--white)"] which
                      // would otherwise apply an 8%-white tint — too
                      // thin for white text on bright frames of the
                      // underlying video.
                      background: isFocused
                        ? 'rgba(97, 97, 97, 0.82)'
                        : isPreview
                          ? 'rgba(97, 97, 97, 0.70)'
                          : 'rgba(97, 97, 97, 0.55)',
                      backdropFilter: 'blur(14px) saturate(140%)',
                      WebkitBackdropFilter: 'blur(14px) saturate(140%)',
                      borderRadius: 16,
                      padding: isMobile ? '20px 22px' : '28px 32px',
                      boxShadow: isFocused
                        ? '0 30px 70px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
                        : isPreview
                          ? '0 18px 40px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.10)'
                          : '0 10px 28px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    {t.tag && (
                      <div style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: '#00B5D6',
                      }}>
                        {t.tag}
                      </div>
                    )}

                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: isMobile ? 14 : 16,
                      fontWeight: 400,
                      lineHeight: 1.5,
                      letterSpacing: '-0.005em',
                      color: 'var(--gray-900)',
                      margin: 0,
                      flex: 1,
                    }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                      paddingTop: 12,
                      marginTop: 4,
                    }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00B5D6 0%, #36C2DE 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'white',
                        flexShrink: 0,
                      }}>
                        {getInitials(t.name)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--gray-900)',
                          fontFamily: 'var(--font-display)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {t.name}
                        </div>
                        <div style={{
                          fontSize: 11,
                          color: 'var(--gray-500)',
                          marginTop: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {t.role}
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          {focusedIdx === null && previewIdx === null && (
            <div style={{
              textAlign: 'center',
              fontSize: 12,
              color: 'var(--gray-500)',
              marginTop: 24,
              fontStyle: 'italic',
            }}>
              {isMobile
                ? 'Tap to preview, tap again to focus'
                : 'Hover to preview, click to focus'}
            </div>
          )}
        </RevealOnScroll>
      </div>
    </section>
  )
}
