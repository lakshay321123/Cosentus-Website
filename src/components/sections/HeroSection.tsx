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
        <video key={videoSrc} autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          <source src={videoSrc} type="video/mp4" />
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
            gap: 10px !important;
            max-width: 100% !important;
            margin-top: 32px !important;
          }
          .hero-specialty-tile {
            flex: 0 0 auto !important;
            /* iOS HIG: 44px minimum touch target, 16px body font for readability */
            height: 44px !important;
            padding: 0 22px !important;
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
