'use client'

import Link from 'next/link'

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

const testimonials = [
  { tag: 'Anesthesia', title: '"Year-over-year collection rate of 97% from commercial payors and 98% overall."', author: '— Dr. John B. Field Jr., MD' },
  { tag: 'Orthopedic', title: '"My reimbursements increased after they started coding for me."', author: '— Dr. Morteza Farr, DO' },
  { tag: 'Pain Management', title: '"Nearly 20 years in practice — Cosentus has provided nothing but positive experiences."', author: '— Justin Lo, MD' },
  { tag: 'ASC', title: '"The job they have done on the outstanding balances saved our surgery center."', author: '— John Welsh, M.D.' },
]

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <video autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          <source src="/images/hero-video.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,53,69,0.75) 0%, rgba(0,89,110,0.55) 40%, rgba(0,181,214,0.3) 100%)', zIndex: 1 }} />
      </div>

      <div className="hero-content">
        <h1>Think <span className="accent">Growth.</span></h1>

        <p className="hero-sub">
          25 years of specialty RCM expertise, amplified by Real&nbsp;+&nbsp;Artificial&nbsp;Intelligence.
        </p>

        <div className="hero-actions">
          <Link href="/contact" className="btn-primary">
            Get Your Free Revenue Analysis <ArrowIcon />
          </Link>
          <Link href="/cosentus-ai" className="btn-ghost">
            See How R+A Works
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="hero-cases">
          {testimonials.map((t, i) => (
            <div key={i} className="hero-case">
              <div className="hero-case-tag">{t.tag}</div>
              <div className="hero-case-title">{t.title}</div>
              <span className="hero-case-link">{t.author}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="22" height="38" rx="11" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.8)">
            <animate attributeName="cy" values="12;24;12" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
    </section>
  )
}
