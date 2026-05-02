'use client'

import Link from 'next/link'

const specialties = [
  { label: 'Anesthesia', href: '/specialties/anesthesia' },
  { label: 'Orthopedics', href: '/specialties/orthopedics' },
  { label: 'Pain Management', href: '/specialties/pain-management' },
  { label: 'ASCs', href: '/specialties/asc' },
  { label: 'Behavioral Health', href: '/specialties/behavioral-health' },
  { label: 'Multi-Specialty', href: '/specialties/multi-specialty' },
]

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <video autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          {/* Mobile: vertical 9:16 video (1.9MB). Browser picks the first <source>
              whose media query matches at load time, so phones get the portrait
              file and desktops fall through to the landscape original. */}
          <source src="/images/hero-video-mobile.mp4" media="(max-width: 768px)" type="video/mp4" />
          <source src="/images/hero-video.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,53,69,0.75) 0%, rgba(0,89,110,0.55) 40%, rgba(0,181,214,0.3) 100%)', zIndex: 1 }} />
      </div>

      <div className="hero-content">
        <h1>
          Purpose Built<br />For Your <span className="accent">Specialty.</span>
        </h1>

        {/* Specialty selector, tightly beneath the H1. */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
          maxWidth: 580,
          margin: '24px 0 0',
        }} className="hero-specialty-grid">
          {specialties.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="btn-glass hero-specialty-tile"
              style={{
                borderRadius: 999,
                height: 36,
                padding: '0 16px',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '0.01em',
                fontFamily: 'var(--font-body)',
                textDecoration: 'none',
                background: 'rgba(0, 0, 0, 0.35)',
                borderColor: 'rgba(255, 255, 255, 0.18)',
                color: '#fff',
              }}
            >
              <span>{s.label}</span>
            </Link>
          ))}
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
          .hero-specialty-grid {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: flex-start !important;
            gap: 8px !important;
            max-width: 100% !important;
          }
          .hero-specialty-tile {
            flex: 0 0 auto !important;
          }
        }
        .hero-specialty-tile:hover {
          background: rgba(0, 0, 0, 0.50) !important;
          border-color: rgba(255, 255, 255, 0.30) !important;
          color: #fff !important;
        }
      `}</style>
    </section>
  )
}
