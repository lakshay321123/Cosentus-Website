'use client'

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
  /** Testimonials to display. Defaults to the site-wide highlight set used on the homepage. */
  testimonials?: Testimonial[]
  /** Section label — DEPRECATED, no longer rendered. Kept in props for API compatibility. */
  label?: string
  /** Section title (supports JSX so callers can include the italic teal accent span). */
  title?: ReactNode
}

export default function TestimonialsSection({
  testimonials = defaultTestimonials,
  title = <>What Our <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Partners</span> Say.</>,
}: Props = {}) {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const [slidesPerView, setSlidesPerView] = useState(2)
  const total = testimonials.length

  // Detect viewport — 2 cards side-by-side on desktop, 1 on mobile (≤900px)
  useEffect(() => {
    const check = () => setSlidesPerView(window.innerWidth <= 900 ? 1 : 2)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  // Clamp idx when slidesPerView shrinks (e.g. desktop -> mobile while idx is at end)
  const maxIdx = Math.max(0, total - slidesPerView)
  useEffect(() => {
    setIdx(i => Math.min(i, maxIdx))
  }, [maxIdx])

  // Auto-advance every 5s unless paused
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setIdx(i => (i >= maxIdx ? 0 : i + 1)), 5000)
    return () => clearInterval(t)
  }, [paused, maxIdx])

  const goPrev = () => setIdx(i => (i <= 0 ? maxIdx : i - 1))
  const goNext = () => setIdx(i => (i >= maxIdx ? 0 : i + 1))

  const stepPercent = 100 / slidesPerView

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

        {/* Carousel */}
        <RevealOnScroll delay={0.45}>
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{ marginTop: 48, position: 'relative' }}
          >
            {/* Viewport, clips slides outside the visible area */}
            <div style={{
              overflow: 'hidden',
              borderRadius: 16,
            }}>
              {/* Track, full row of slides, slides via transform */}
              <div style={{
                display: 'flex',
                transform: `translateX(-${idx * stepPercent}%)`,
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform',
              }}>
                {testimonials.map((t, i) => (
                  <div key={i} style={{
                    flex: `0 0 ${stepPercent}%`,
                    minWidth: 0,
                    padding: '8px',
                  }}>
                    <div style={{
                      height: '100%',
                      padding: 'clamp(32px, 4vw, 48px) clamp(24px, 3.5vw, 44px)',
                      background: 'var(--white)',
                      borderRadius: 16,
                      border: '1px solid var(--gray-200)',
                      position: 'relative',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                      {/* Tag — optional. Only renders if the testimonial provides one. */}
                      {t.tag && (
                        <div style={{
                          fontSize: 'var(--text-xxs)',
                          fontWeight: 700,
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          color: '#00B5D6',
                          marginBottom: 24,
                          position: 'relative',
                          zIndex: 1,
                        }}>
                          {t.tag}
                        </div>
                      )}

                      {/* Big translucent quote mark */}
                      <div aria-hidden="true" style={{
                        position: 'absolute',
                        top: 24,
                        right: 32,
                        fontSize: 96,
                        lineHeight: 1,
                        color: '#00B5D6',
                        opacity: 0.1,
                        fontFamily: 'Georgia, serif',
                        fontWeight: 700,
                      }}>&ldquo;</div>

                      {/* Quote */}
                      <p style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(18px, 1.6vw, 22px)',
                        fontWeight: 400,
                        lineHeight: 1.5,
                        letterSpacing: '-0.005em',
                        color: 'var(--gray-900)',
                        marginBottom: 28,
                        position: 'relative',
                        zIndex: 1,
                        flex: 1,
                      }}>
                        &ldquo;{t.quote}&rdquo;
                      </p>

                      {/* Attribution */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        borderTop: '1px solid var(--gray-200)',
                        paddingTop: 24,
                      }}>
                        <div style={{
                          width: 52,
                          height: 52,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #00B5D6 0%, #36C2DE 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'var(--text-base)',
                          fontWeight: 700,
                          color: 'white',
                          flexShrink: 0,
                          boxShadow: '0 4px 12px rgba(0,181,214,0.3)',
                        }}>
                          {getInitials(t.name)}
                        </div>
                        <div>
                          <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--gray-900)', fontFamily: 'var(--font-display)' }}>
                            {t.name}
                          </div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)', marginTop: 2 }}>
                            {t.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls below, arrows + dots */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
              marginTop: 28,
            }}>
              <button
                onClick={goPrev}
                aria-label="Previous testimonial"
                className="t-arrow"
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(0, 181, 214, 0.18)',
                  backdropFilter: 'blur(5px) saturate(120%)',
                  WebkitBackdropFilter: 'blur(5px) saturate(120%)',
                  border: '1px solid rgba(0, 181, 214, 0.45)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.45), inset 0 -1px 0 rgba(0, 80, 100, 0.18), 0 8px 22px rgba(0, 181, 214, 0.22)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 200ms cubic-bezier(0.22, 0.61, 0.36, 1), border-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 200ms cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 250ms cubic-bezier(0.22, 0.61, 0.36, 1)',
                  flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00B5D6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* Dots */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {Array.from({ length: maxIdx + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    style={{
                      width: idx === i ? 28 : 8,
                      height: 8,
                      borderRadius: 4,
                      background: idx === i ? '#00B5D6' : 'var(--gray-300)',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                aria-label="Next testimonial"
                className="t-arrow"
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(0, 181, 214, 0.18)',
                  backdropFilter: 'blur(5px) saturate(120%)',
                  WebkitBackdropFilter: 'blur(5px) saturate(120%)',
                  border: '1px solid rgba(0, 181, 214, 0.45)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.45), inset 0 -1px 0 rgba(0, 80, 100, 0.18), 0 8px 22px rgba(0, 181, 214, 0.22)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 200ms cubic-bezier(0.22, 0.61, 0.36, 1), border-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 200ms cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 250ms cubic-bezier(0.22, 0.61, 0.36, 1)',
                  flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00B5D6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </RevealOnScroll>
      </div>

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
      `}</style>
    </section>
  )
}
