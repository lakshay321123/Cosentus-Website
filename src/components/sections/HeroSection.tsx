'use client'

import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

const testimonials = [
  {
    tag: 'Anesthesia',
    title: '"Year-over-year collection rate of 97% from commercial payors and 98% overall."',
    author: '— Dr. John B. Field Jr., MD',
  },
  {
    tag: 'Orthopedic',
    title: '"My reimbursements increased after they started coding for me."',
    author: '— Dr. Morteza Farr, DO',
  },
  {
    tag: 'Pain Management',
    title: '"Nearly 20 years in practice — Cosentus has provided nothing but positive experiences."',
    author: '— Justin Lo, MD',
  },
  {
    tag: 'ASC',
    title: '"The job they have done on the outstanding balances saved our surgery center."',
    author: '— John Welsh, M.D.',
  },
]

export default function HeroSection() {
  return (
    <section className="hero">
      {/* Video Background */}
      <div className="hero-bg">
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        >
          <source src="/images/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for text readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(0,53,69,0.7) 0%, rgba(0,89,110,0.5) 40%, rgba(0,181,214,0.3) 100%)',
          zIndex: 1,
        }} />
      </div>

      <div className="hero-content">
        <RevealOnScroll>
          <div className="hero-badge">
            <div className="hero-badge-dot" />
            <span>25+ YEARS OF SPECIALTY RCM</span>
          </div>
        </RevealOnScroll>

        <h1>
          Think <span className="accent">Growth.</span>
        </h1>

        <RevealOnScroll delay={0.2}>
          <p className="hero-sub">
            25 years of specialty RCM expertise, amplified by Real&nbsp;+&nbsp;Artificial&nbsp;Intelligence.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.3}>
          <div className="hero-actions">
            <Link href="/contact" className="btn-primary">
              Get Your Free Revenue Analysis
              <ArrowIcon />
            </Link>
            <Link href="/cosentus-ai" className="btn-ghost">
              See How R+A Works
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.4}>
          <div className="hero-cases">
            {testimonials.map((t, i) => (
              <div key={i} className="hero-case">
                <div className="hero-case-tag">{t.tag}</div>
                <div className="hero-case-title">{t.title}</div>
                <span className="hero-case-link">{t.author}</span>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
