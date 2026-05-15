'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const specialties = [
  { label: 'Anesthesia', href: '/specialties/anesthesia' },
  { label: 'Orthopedics', href: '/specialties/orthopedics' },
  { label: 'Pain Management', href: '/specialties/pain-management' },
  { label: 'ASCs', href: '/specialties/asc' },
  { label: 'Behavioral Health', href: '/specialties/behavioral-health' },
  { label: 'Multi-Specialty', href: '/specialties/multi-specialty' },
]

export default function HeroSection() {
  // SSR/initial render uses desktop video; client useEffect swaps to the
  // 9:16 mobile cut (~1.9MB) on phones. <source media> alone proved
  // unreliable in some browsers + Next hydration paths — JS swap is the
  // foolproof path. `key` forces a remount so the browser refetches.
  const [videoSrc, setVideoSrc] = useState('/images/hero-video.mp4')
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const apply = () => setVideoSrc(mq.matches ? '/images/hero-video-mobile.mp4' : '/images/hero-video.mp4')
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return (
    <section className="hero">
      <div className="hero-bg">
        <video key={videoSrc} autoPlay loop muted playsInline className="hero-video">
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,53,69,0.75) 0%, rgba(0,89,110,0.55) 40%, rgba(0,181,214,0.3) 100%)', zIndex: 1 }} />
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
        /* ===== HERO VIDEO ROTATION =====
           Desktop source is 1920x1080 (landscape). Rotating it 90°
           clockwise makes the light streams (which originally flowed
           left→right) flow top→bottom.

           The element is laid out with SWAPPED dimensions
           (width: 100vh; height: 100vw) — i.e. a portrait-shaped box
           sized to the viewport — then rotated 90° CW around its
           top-left corner. After rotation the box would sit to the
           LEFT of the viewport (x in [-100vw, 0]); translateX(100vw),
           applied AFTER rotate in CSS transform-string order (rightmost
           applies first), shifts it back so the rotated frame fills
           exactly the viewport rectangle. object-fit: cover works on
           the pre-rotation 100vh-by-100vw box, which matches the
           rotated frame's portrait orientation, so light streams
           render at native resolution.

           Done in CSS (not inline JS) so the layout is correct at
           initial paint with no SSR/hydration mismatch.

           Desktop (>=769px): HIDDEN. The page-level
           ImmersiveVideoBackground component renders the (rotated,
           crossfading) video fixed behind every section, so the
           hero's own copy is redundant and would just waste GPU
           on decoding the same frames twice.

           Mobile (<=768px) — source is 360x640 (already portrait),
           so rotating would make light flow SIDEWAYS instead of
           top→bottom. Plain inset:0 / 100% / 100% layout. This is
           the ONLY video on mobile (ImmersiveVideoBackground is
           display: none below 768px because fixed-position video
           has known repaint bugs on iOS Safari and the perf cost
           is unacceptable on small devices). */
        .hero-video {
          display: none;
        }
        @media (max-width: 768px) {
          .hero-video {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transform: none;
            transform-origin: initial;
            z-index: 0;
          }
        }

        /* The hero's own gradient overlay is also desktop-redundant
           because ImmersiveVideoBackground draws a page-wide overlay.
           Hide it on desktop; keep on mobile. */
        .hero-bg > div:last-child {
          display: none;
        }
        @media (max-width: 768px) {
          .hero-bg > div:last-child {
            display: block;
          }
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
