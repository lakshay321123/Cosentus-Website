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

// When a card is focused, cards in front of it shift this much
// further down the diagonal per-card-of-distance so the focused
// card is no longer occluded.
const PUSH_X_DESKTOP = 50
const PUSH_Y_DESKTOP = 28
const PUSH_X_MOBILE = 16
const PUSH_Y_MOBILE = 12

export default function HomeTestimonials({
  testimonials = defaultTestimonials,
  title = <>What Our <span style={{ color: '#00B5D6' }}>Clients</span> Say</>,
}: Props = {}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [tappedIdx, setTappedIdx] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  // On mobile, tap is the focus mechanism; on desktop, hover is.
  const focusedIdx = isMobile ? tappedIdx : hoveredIdx

  // On mobile, tapping outside any card clears focus.
  useEffect(() => {
    if (!isMobile) return
    const onDocTap = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (target && !target.closest('[data-testimonial-card]')) {
        setTappedIdx(null)
      }
    }
    document.addEventListener('click', onDocTap)
    return () => document.removeEventListener('click', onDocTap)
  }, [isMobile])

  const stepX = isMobile ? STEP_X_MOBILE : STEP_X_DESKTOP
  const stepY = isMobile ? STEP_Y_MOBILE : STEP_Y_DESKTOP
  const pushX = isMobile ? PUSH_X_MOBILE : PUSH_X_DESKTOP
  const pushY = isMobile ? PUSH_Y_MOBILE : PUSH_Y_DESKTOP

  // Reserve enough space so the stack doesn't overlap the next
  // section. Worst case: focused = card 0, every later card shifts
  // by (i * step) + (i * push) = i * (step + push).
  const N = testimonials.length
  const cardHeight = isMobile ? 220 : 280
  const cardWidth = isMobile ? 280 : 420
  const reservedHeight = (N - 1) * (stepY + pushY) + cardHeight + 40
  const reservedWidth = (N - 1) * (stepX + pushX) + cardWidth

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

                // If a card AHEAD of this one is focused (focusedIdx < i),
                // push this card further along the diagonal.
                let extraX = 0
                let extraY = 0
                if (focusedIdx !== null && focusedIdx < i) {
                  const cardsAhead = i - focusedIdx
                  extraX = cardsAhead * pushX
                  extraY = cardsAhead * pushY
                }
                // If THIS card is focused, lift slightly toward viewer.
                const liftY = focusedIdx === i ? (isMobile ? -8 : -14) : 0

                const isFocused = focusedIdx === i
                const skew = isMobile ? 0 : -8

                return (
                  <article
                    key={i}
                    data-testimonial-card
                    onMouseEnter={() => !isMobile && setHoveredIdx(i)}
                    onMouseLeave={() => !isMobile && setHoveredIdx(null)}
                    onClick={(e) => {
                      if (isMobile) {
                        e.stopPropagation()
                        setTappedIdx(prev => (prev === i ? null : i))
                      }
                    }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: cardWidth,
                      minHeight: cardHeight,
                      transform: `translate(${baseX + extraX}px, ${baseY + extraY + liftY}px) skewY(${skew}deg)`,
                      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease, box-shadow 0.5s ease',
                      filter: isFocused ? 'grayscale(0)' : 'grayscale(1)',
                      zIndex: i + 1,
                      cursor: isMobile ? 'pointer' : 'default',
                      background: 'var(--white)',
                      borderRadius: 16,
                      border: '1px solid var(--gray-200)',
                      padding: isMobile ? '20px 22px' : '28px 32px',
                      boxShadow: isFocused
                        ? '0 20px 50px rgba(0, 0, 0, 0.18)'
                        : '0 8px 22px rgba(0, 0, 0, 0.10)',
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

          {isMobile && (
            <div style={{
              textAlign: 'center',
              fontSize: 12,
              color: 'var(--gray-500)',
              marginTop: 24,
              fontStyle: 'italic',
            }}>
              Tap a card to focus
            </div>
          )}
        </RevealOnScroll>
      </div>
    </section>
  )
}
