'use client'

import { useEffect, useRef, useState } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import RevealText from '@/components/ui/RevealText'
import MobileCarousel from '@/components/ui/MobileCarousel'

function Counter({ target, prefix = '', suffix = '', decimals = 0 }: {
  target: number; prefix?: string; suffix?: string; decimals?: number
}) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 2200
          const start = performance.now()
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 4)
            setValue(parseFloat((target * eased).toFixed(decimals)))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, decimals])

  return <span ref={ref}>{prefix}{value.toFixed(decimals)}{suffix}</span>
}

const stats = [
  // Flip messages use explicit \n line breaks per stat so each line is
  // 2-4 words and the wrapped text fits inside the arrow shaft (the
  // shaft is only ~67.5% of the arrow's total width, so long lines
  // overflow the angled walls). CSS renders \n as a hard break via
  // white-space: pre-line on .result-flip-text.
  { target: 30, suffix: '%', prefix: '', label: 'Revenue\nGrowth', sublabel: 'Up to',
    flip: 'Tens of thousands\nmore per month.\nWithin 90 days.' },
  { target: 98, suffix: '%', prefix: '>', label: 'Net\nCollection', sublabel: '',
    flip: '$98 collected\non every $100.\nMost practices\nstop at $91.' },
  { target: 99, suffix: '%', prefix: '>', label: 'Clean\nClaim Rate', sublabel: '',
    flip: 'On $3M in charges,\nthat\u2019s $300K recovered\nevery year.' },
  { target: 98.5, suffix: '%', prefix: '', label: 'Coding\nAccuracy', sublabel: '', decimals: 1,
    flip: 'Coding errors cost\nthousands monthly.\nWe catch 98.5%\nof them.' },
  { target: 10, suffix: '%', prefix: '< ', label: 'AR\n> 120 Days', sublabel: '',
    flip: 'Aging claims rot.\nWe keep cash\nmoving \u2014 fast.' },
  { target: 80, suffix: '%+', prefix: '', label: 'Patient\nCollection', sublabel: '',
    flip: 'Most practices collect\nunder 50%.\nWe recover the rest\nin 50+ languages.' },
]

function StatCard({ stat }: { stat: typeof stats[0] }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div
      className={`result-item${flipped ? ' flipped' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${stat.label}, tap to ${flipped ? 'see stat' : 'see impact'}`}
      onClick={() => setFlipped(f => !f)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setFlipped(f => !f)
        }
      }}
    >
      <div className="result-flip-card">
        {/* FRONT — glass arrow with ALL stat content (sublabel,
            number, label) inside the arrow body. The .result-text
            wrapper that used to sit beneath the arrow is gone; per
            user direction "labels can be under it [inside the
            arrow]" — REVENUE GROWTH, NET COLLECTION, etc. now sit
            below the number, still within the arrow shape. */}
        <div className="result-flip-front">
          <div className="result-arrow-img">
            <div className="result-arrow-content">
              {/* Sublabel slot is ALWAYS rendered (even when stat.sublabel
                  is empty, we render a non-breaking space) so every card
                  reserves the same vertical space for this row. Without
                  this, only the first card (with "Up to") had a sublabel
                  in the DOM, which pushed its number down relative to
                  the other 5 cards. Empty cards now contribute the same
                  line-height as the populated one, keeping the number
                  row aligned across all 6 stats. */}
              <div className="result-sublabel">{stat.sublabel || '\u00A0'}</div>
              <div className="result-number">
                <Counter target={stat.target} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals || 0} />
              </div>
              <div className="result-label">{stat.label}</div>
            </div>
          </div>
        </div>
        {/* BACK — same arrow shape, dollar-impact message inside.
            Previously the back was a teal rectangle with a divider
            and a duplicate stat identity at the bottom; per user
            direction "this also needs to be within the arrow, so
            you can remove the rectangle-ish thing", we replaced
            both with the same SVG-shaped face used on the front.
            The duplicate stat identity (small number + label at
            bottom) was dropped — no room inside the portrait arrow
            without crowding the impact message, and the user just
            saw the same stat on the front before flipping. */}
        <div className="result-flip-back">
          <div className="result-arrow-content">
            <div className="result-flip-text">{stat.flip}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResultsSection() {
  return (
    <section className="results-section" id="results" style={{ overflow: 'hidden' }}>
      <div className="container-wide">
        <div className="results-header">
          <RevealText as="h2" perWordDelay={0.07}><span className="accent">Results</span> Our Clients See</RevealText>
        </div>

        {/* Desktop: grid layout */}
        <div className="results-grid results-desktop">
          {stats.map((stat, i) => (
            <RevealOnScroll key={i} direction="scale" delay={0.2 + i * 0.25}>
              <StatCard stat={stat} />
            </RevealOnScroll>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="results-mobile" style={{ overflow: "hidden", width: "100%" }}>
          <MobileCarousel autoScrollInterval={3500}>
            {stats.map((stat, i) => (
              <StatCard key={i} stat={stat} />
            ))}
          </MobileCarousel>
        </div>

        <RevealOnScroll delay={2}>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--gray-500)', marginTop: 24 }}>
            Verified client results. Linked to client success stories with full methodology.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  )
}
