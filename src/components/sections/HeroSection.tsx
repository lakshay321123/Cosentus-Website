'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const specialties = [
  { label: 'Anesthesia', href: '/specialties/anesthesia' },
  { label: 'Orthopedics', href: '/specialties/orthopedics' },
  { label: 'Pain Management', href: '/specialties/pain-management' },
  { label: 'ASCs', href: '/specialties/asc' },
  { label: 'Behavioral Health', href: '/specialties/behavioral-health' },
  { label: 'Multi-Specialty', href: '/specialties/multi-specialty' },
]

const ROTATION_MS = 2500

export default function HeroSection() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  // Re-mount key for the cycling word — drives the fade+slide animation
  const [animKey, setAnimKey] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-advance every ROTATION_MS unless paused or user prefers reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || paused) return

    intervalRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % specialties.length)
      setAnimKey((k) => k + 1)
    }, ROTATION_MS)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [paused])

  // Manual jump (dot click) — also bumps animKey to retrigger animation
  function jumpTo(i: number) {
    setActiveIdx(i)
    setAnimKey((k) => k + 1)
  }

  const active = specialties[activeIdx]

  return (
    <section className="hero">
      <div className="hero-bg">
        <video autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          <source src="/images/hero-video.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,53,69,0.75) 0%, rgba(0,89,110,0.55) 40%, rgba(0,181,214,0.3) 100%)', zIndex: 1 }} />
      </div>

      <div className="hero-content">
        {/* H1 + picker share a hover region so cursor crossing the gap
            between them doesn't briefly resume rotation. */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Cycling H1 — last word is a clickable Link to the active specialty. */}
          <h1>
            Purpose Built<br />For Your{' '}
            <Link
              href={active.href}
              className="hero-cycle-word accent"
              aria-label={`Go to ${active.label} specialty page`}
            >
              <span key={animKey} className="hero-cycle-word-text">
                {active.label}.
              </span>
            </Link>
          </h1>

          {/* Picker — 6 dots + active specialty caption. */}
          <div
            className="hero-cycle-picker"
            role="tablist"
            aria-label="Choose your specialty"
          >
            <div className="hero-cycle-dots">
              {specialties.map((s, i) => (
                <button
                  key={s.href}
                  type="button"
                  role="tab"
                  aria-selected={i === activeIdx}
                  aria-label={s.label}
                  onClick={() => jumpTo(i)}
                  className={`hero-cycle-dot${i === activeIdx ? ' is-active' : ''}`}
                />
              ))}
            </div>
            <div className="hero-cycle-caption" aria-live="polite">
              {active.label}
            </div>
          </div>
        </div>

        <div className="hero-actions">
          <Link
            href="/contact"
            className="btn-glass hero-cta-dark"
            style={{
              background: 'rgba(0, 0, 0, 0.35)',
              borderColor: 'rgba(255, 255, 255, 0.18)',
              color: '#fff',
            }}
          >
            Get Your Financial MRI
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
        /* Cycling word in the H1.
           - Inline-block so transform animations work
           - Underline only on hover for affordance (it IS clickable)
           - Inherits H1 font sizing — feels native to the headline */
        .hero-cycle-word {
          display: inline-block;
          color: var(--white);
          text-decoration: none;
          position: relative;
          cursor: pointer;
        }
        .hero-cycle-word::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: 4px;
          height: 4px;
          background: rgba(255,255,255,0.0);
          border-radius: 2px;
          transition: background 200ms ease;
        }
        .hero-cycle-word:hover::after {
          background: rgba(255,255,255,0.5);
        }

        /* The text inside is keyed and re-mounts on each rotation,
           triggering this fade+slide animation. */
        .hero-cycle-word-text {
          display: inline-block;
          animation: hero-cycle-in 350ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        @keyframes hero-cycle-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-cycle-word-text { animation: none; }
        }

        /* Picker block — sits where the 6-tile grid used to be. */
        .hero-cycle-picker {
          margin: 36px 0 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Dots row */
        .hero-cycle-dots {
          display: inline-flex;
          gap: 12px;
          align-items: center;
        }
        .hero-cycle-dot {
          appearance: none;
          border: none;
          padding: 0;
          cursor: pointer;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.30);
          transition:
            background 250ms cubic-bezier(0.22, 0.61, 0.36, 1),
            transform 200ms cubic-bezier(0.22, 0.61, 0.36, 1),
            box-shadow 250ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .hero-cycle-dot:hover {
          background: rgba(255, 255, 255, 0.60);
          transform: scale(1.15);
        }
        .hero-cycle-dot.is-active {
          background: #00B5D6;
          box-shadow: 0 0 0 4px rgba(0, 181, 214, 0.18);
          transform: scale(1.15);
        }
        .hero-cycle-dot:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.55);
        }

        /* Caption beneath the dots — small, tracks the active specialty */
        .hero-cycle-caption {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .hero-cycle-dots { gap: 10px; }
          .hero-cycle-dot { width: 9px; height: 9px; }
          .hero-cycle-caption { font-size: 12px; }
        }

        .hero-cta-dark:hover {
          background: rgba(0, 0, 0, 0.50) !important;
          border-color: rgba(255, 255, 255, 0.30) !important;
          color: #fff !important;
        }
      `}</style>
    </section>
  )
}
