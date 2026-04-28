'use client'

import { useState } from 'react'
import Link from 'next/link'

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

const specialties = [
  { label: 'Anesthesia (Accreda)', href: '/specialties/anesthesia' },
  { label: 'Orthopedics', href: '/specialties/orthopedics' },
  { label: 'Pain Management', href: '/specialties/pain-management' },
  { label: 'ASCs', href: '/specialties/asc' },
  { label: 'Behavioral Health (SiMed)', href: '/specialties/behavioral-health' },
  { label: 'Multi-Specialty', href: '/specialties/multi-specialty' },
]

export default function HeroSection() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section className="hero">
      <div className="hero-bg">
        <video autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          <source src="/images/hero-video.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,53,69,0.75) 0%, rgba(0,89,110,0.55) 40%, rgba(0,181,214,0.3) 100%)', zIndex: 1 }} />
      </div>

      <div className="hero-content">
        <h1 style={{ fontSize: 'clamp(48px, 8vw, 110px)', fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.04em', lineHeight: 0.95 }}>
          Purpose Built<br />For Your <span className="accent">Specialty.</span>
        </h1>

        <p className="hero-sub" style={{ fontSize: 'clamp(16px, 1.6vw, 20px)', fontWeight: 500, letterSpacing: '0.02em', opacity: 0.9, marginTop: 28 }}>
          Choose your Specialty
        </p>

        {/* Specialty selector */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          maxWidth: 720,
          margin: '36px 0 32px',
        }} className="hero-specialty-grid">
          {specialties.map((s, i) => (
            <Link
              key={s.href}
              href={s.href}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              style={{
                padding: '14px 18px',
                background: hovered === i ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.01em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                backdropFilter: 'blur(8px)',
                transform: hovered === i ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >
              <span>{s.label}</span>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ))}
        </div>

        <div className="hero-actions">
          <Link href="/contact" className="btn-primary">
            Get Your Financial MRI <ArrowIcon />
          </Link>
        </div>
      </div>

      <div className="scroll-indicator">
        <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="22" height="38" rx="11" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.8)">
            <animate attributeName="cy" values="12;24;12" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-specialty-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
