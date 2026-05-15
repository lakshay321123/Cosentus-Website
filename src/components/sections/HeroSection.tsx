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
  // Hero no longer renders its own <video>. ImmersiveVideoBackground
  // now serves the page-level video for both desktop AND mobile
  // (mobile uses /images/hero-video-mobile.mp4 at native portrait
  // orientation). Removing the local video also fixes the
  // hidden-but-still-decoding issue flagged in coderabbit review of
  // PR #135.
  //
  // The .hero-overlay gradient div below was previously hidden on
  // desktop because ImmersiveVideoBackground draws its own page-wide
  // gradient overlay. Mobile used to keep this overlay because the
  // hero video lived inside the hero element. Now that the immersive
  // video covers mobile too, the overlay is redundant everywhere —
  // the CSS at the bottom of this file hides it universally.

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,53,69,0.75) 0%, rgba(0,89,110,0.55) 40%, rgba(0,181,214,0.3) 100%)', zIndex: 1 }} />
      </div>

      <div className="hero-content">
        <h1>
          Purpose Built<br />For Your Specialty,<br /><span className="accent">Real People + AI.</span> RCM Redefined.
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

      <style>{`
        /* The hero's own gradient overlay is now redundant on every
           viewport because ImmersiveVideoBackground draws a page-wide
           overlay. Hidden everywhere. */
        .hero-overlay {
          display: none;
        }

        @media (max-width: 768px) {
          .hero-specialty-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
            max-width: 100% !important;
            margin-top: 32px !important;
          }
          .hero-specialty-tile {
            /* iOS HIG: 44px minimum touch target, 16px body font for readability.
               Width comes from the grid 1fr cell so every pill is identical. */
            width: 100% !important;
            height: 44px !important;
            padding: 0 16px !important;
            font-size: 16px !important;
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
