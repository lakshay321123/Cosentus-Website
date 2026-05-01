'use client'

import { useState, useEffect } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

const testimonials = [
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
    quote: 'Nearly 20 years in practice — Cosentus has provided nothing but positive experiences. Highly recommend without reservations.',
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

export default function TestimonialsSection() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = testimonials.length

  // Auto-advance every 5s unless paused
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setIdx(i => (i + 1) % total), 5000)
    return () => clearInterval(t)
  }, [paused, total])

  const goPrev = () => setIdx(i => (i - 1 + total) % total)
  const goNext = () => setIdx(i => (i + 1) % total)

  return (
    <section className="section section-alt" style={{ overflow: 'hidden' }}>
      <div className="container">
        <RevealOnScroll>
          <div className="section-label">TESTIMONIALS</div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4.5vw, 56px)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--gray-900)',
            marginTop: 12,
            marginBottom: 0,
          }}>
            What Our <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Partners</span> Say.
          </h2>
        </RevealOnScroll>

        {/* Carousel */}
        <RevealOnScroll delay={0.2}>
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{ marginTop: 48, position: 'relative' }}
          >
            {/* Viewport — clips slides outside the visible area */}
            <div style={{
              overflow: 'hidden',
              borderRadius: 16,
            }}>
              {/* Track — full row of slides, slides via transform */}
              <div style={{
                display: 'flex',
                transform: `translateX(-${idx * 100}%)`,
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform',
              }}>
                {testimonials.map((t, i) => (
                  <div key={i} style={{
                    flex: '0 0 100%',
                    minWidth: 0,
                    padding: '8px',
                  }}>
                    <div style={{
                      maxWidth: 880,
                      margin: '0 auto',
                      padding: 'clamp(36px, 5vw, 64px) clamp(28px, 5vw, 72px)',
                      background: 'var(--white)',
                      borderRadius: 16,
                      border: '1px solid var(--gray-200)',
                      position: 'relative',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
                    }}>
                      {/* Tag */}
                      <div style={{
                        fontSize: 11,
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
                        fontSize: 'clamp(20px, 2.4vw, 28px)',
                        fontWeight: 400,
                        lineHeight: 1.45,
                        letterSpacing: '-0.01em',
                        color: 'var(--gray-900)',
                        marginBottom: 36,
                        position: 'relative',
                        zIndex: 1,
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
                          fontSize: 16,
                          fontWeight: 700,
                          color: 'white',
                          flexShrink: 0,
                          boxShadow: '0 4px 12px rgba(0,181,214,0.3)',
                        }}>
                          {getInitials(t.name)}
                        </div>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-900)', fontFamily: 'var(--font-display)' }}>
                            {t.name}
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>
                            {t.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls below — arrows + dots */}
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
                  background: 'var(--white)',
                  border: '1px solid var(--gray-200)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00B5D6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* Dots */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    aria-label={`Testimonial ${i + 1}`}
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
                  background: 'var(--white)',
                  border: '1px solid var(--gray-200)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
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
          background: #00B5D6 !important;
          border-color: #00B5D6 !important;
        }
        .t-arrow:hover svg { stroke: white !important; }
      `}</style>
    </section>
  )
}
