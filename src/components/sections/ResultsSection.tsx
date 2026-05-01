'use client'

import { useEffect, useRef, useState } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
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
  { target: 30, suffix: '%', prefix: '', label: 'Revenue Growth', sublabel: 'Up to',
    flip: 'Our clients don\u2019t just stop the bleeding \u2014 they grow. Practices see tens of thousands more per month within 90 days of onboarding.' },
  { target: 98, suffix: '%', prefix: '>', label: 'Net Collection', sublabel: '',
    flip: 'For every $100 your practice earns, we collect $98+. Most practices average $91. That gap is real money sitting uncollected.' },
  { target: 99, suffix: '%', prefix: '>', label: 'Clean Claim Rate', sublabel: '',
    flip: 'A 10-point improvement in clean claim rate on $3M in charges means up to $300,000 in recovered revenue annually.' },
  { target: 98.5, suffix: '%', prefix: '', label: 'Coding Accuracy', sublabel: '', decimals: 1,
    flip: 'Every coding error triggers a denial or underpayment. At 98.5% accuracy, we eliminate the mistakes that cost you thousands per month.' },
  { target: 10, suffix: '%', prefix: '< ', label: 'AR > 120 Days', sublabel: '',
    flip: 'The longer a claim sits, the less likely it gets paid. We keep aging claims under control so cash lands in your account faster.' },
  { target: 80, suffix: '%+', prefix: '', label: 'Patient Collection', sublabel: '',
    flip: 'Most practices collect under 50% of patient balances. Our AI agents handle outreach in 50+ languages, recovering what others write off.' },
]

function StatCard({ stat }: { stat: typeof stats[0] }) {
  return (
    <div className="result-item">
      <div className="result-arrow-img" />
      <div className="result-text">
        {stat.sublabel && <div className="result-sublabel">{stat.sublabel}</div>}
        <div className="result-number">
          <Counter target={stat.target} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals || 0} />
        </div>
        <div className="result-label">{stat.label}</div>
        <div className="result-flip">{stat.flip}</div>
      </div>
    </div>
  )
}

export default function ResultsSection() {
  return (
    <section className="results-section" id="results" style={{ overflow: 'hidden' }}>
      <div className="container-wide">
        <RevealOnScroll>
          <div className="results-header"><h2>Based on Our Assessments, Here&apos;s What Our Clients Are Seeing.</h2></div>
        </RevealOnScroll>

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
            Verified client results. Linked to case studies with full methodology.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  )
}
