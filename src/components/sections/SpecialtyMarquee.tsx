'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/**
 * Maps an agent's circular-headshot filename to its full "popup"
 * scene image (figure + icon), e.g. 'cindy.png' -> 'cindy-popup.png'.
 * Every agent referenced in the specialty/RCM card data has a
 * matching *-popup.png in /public/images (verified). Falls back to
 * the original filename if it already ends in -popup.png.
 */
function popupImg(img: string): string {
  if (img.endsWith('-popup.png')) return img
  return img.replace(/\.png$/, '-popup.png')
}

/**
 * SpecialtyMarquee
 *
 * Horizontal auto-scrolling card carousel used in the "Complete
 * Revenue Cycle" section of every /specialties/* page. Cards
 * scroll left at a constant rate, pause on hover, and can be
 * dragged left/right via pointer events. Each card carries an
 * animated graphic in its lower half themed to the card content.
 *
 * Originally written inline in AnesthesiaContent.tsx and extracted
 * here so the other five specialty pages don't duplicate ~800 lines
 * of marquee + animation code.
 *
 * Customization per specialty:
 *  - 'modifiers' anim takes a `modifierLabels` array so each page
 *    can show its own CPT modifiers (anesthesia: AA/QK/QY/AD,
 *    orthopedics: 59/XE/XS/XP, etc.)
 *  - 'stat' anim takes `statValue` + `statUnit` so each page can
 *    feature a different headline metric.
 *  - cards with `agent` get a clickable circular avatar (Chris,
 *    Cindy, etc.) linked to /cosentus-ai.
 *
 * All animations are CSS-only (transform/opacity, GPU-accelerated)
 * and honor prefers-reduced-motion.
 */

export type AnimKind =
  | 'modifiers'  // CPT modifier code pills cycling with highlight
  | 'rules'      // 4x3 grid of cells in a diagonal wave
  | 'badges'     // 3 checkmark badges fading in sequentially
  | 'stamp'      // Progress bar with moving dot + APPROVED label
  | 'stat'       // Big number with rising bars
  | 'pulse'      // Phone icon with pulse rings (AR / Chris)
  | 'languages'  // Multilingual chat bubbles (Patient Billing / Cindy)
  | 'chart'      // Bar chart with staggered scale (Analytics)
  | 'defense'    // Document + shield-check pulse (Pre-Payment Review)
  | 'meds'       // Capsule pills cycling (Medication Management)
  | 'telehealth' // Monitor + play triangle + pulsing live dot (Telehealth)
  | 'eligibility'// Insurance card + pulsing verification check (Eligibility)

export type SpecialtySolution = {
  /** Small caps eyebrow label above the title */
  eyebrow: string
  /** Card title */
  title: string
  /** 1-2 sentence description */
  description: string
  /** Which animation to render in the lower half */
  anim: AnimKind
  /** For 'modifiers' anim: custom code labels (default ['AA','QK','QY','AD']) */
  modifierLabels?: string[]
  /** For 'stat' anim: custom value (default '95') */
  statValue?: string
  /** For 'stat' anim: custom unit (default '%') */
  statUnit?: string
  /** If present, renders a clickable circular avatar in the eyebrow row */
  agent?: { name: string; img: string }
}

function CardAnimation({ s }: { s: SpecialtySolution }) {
  switch (s.anim) {
    case 'modifiers': {
      const labels = s.modifierLabels ?? ['AA', 'QK', 'QY', 'AD']
      return (
        <div className="anim anim-modifiers" aria-hidden="true">
          <div className="anim-mod-row">
            {labels.map((code, i) => (
              <span
                key={code}
                className={`anim-mod-pill anim-mod-pill-${i}`}
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                {code}
              </span>
            ))}
          </div>
        </div>
      )
    }
    case 'rules':
      return (
        <div className="anim anim-rules" aria-hidden="true">
          <div className="anim-rules-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className={`anim-rule-cell anim-rule-cell-${i}`} />
            ))}
          </div>
        </div>
      )
    case 'badges':
      return (
        <div className="anim anim-badges" aria-hidden="true">
          {[0, 1, 2].map(i => (
            <span key={i} className={`anim-badge anim-badge-${i}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00B5D6" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>
          ))}
        </div>
      )
    case 'stamp':
      return (
        <div className="anim anim-stamp" aria-hidden="true">
          <div className="anim-stamp-track">
            <div className="anim-stamp-fill" />
            <div className="anim-stamp-dot" />
          </div>
          <div className="anim-stamp-label">APPROVED</div>
        </div>
      )
    case 'stat':
      return (
        <div className="anim anim-stat" aria-hidden="true">
          <div className="anim-stat-number">
            {s.statValue ?? '95'}<span className="anim-stat-pct">{s.statUnit ?? '%'}</span>
          </div>
          <div className="anim-stat-bars">
            {[0, 1, 2, 3].map(i => (
              <span key={i} className={`anim-stat-bar anim-stat-bar-${i}`} />
            ))}
          </div>
        </div>
      )
    case 'pulse':
      return (
        <div className="anim anim-pulse" aria-hidden="true">
          <span className="anim-pulse-ring anim-pulse-ring-0" />
          <span className="anim-pulse-ring anim-pulse-ring-1" />
          <span className="anim-pulse-ring anim-pulse-ring-2" />
          <span className="anim-pulse-core">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00B5D6" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72a2 2 0 011.72 2z" />
            </svg>
          </span>
        </div>
      )
    case 'languages':
      return (
        <div className="anim anim-langs" aria-hidden="true">
          <span className="anim-lang-bubble anim-lang-bubble-left anim-lang-bubble-0">Hello</span>
          <span className="anim-lang-bubble anim-lang-bubble-right anim-lang-bubble-1">Hola</span>
          <span className="anim-lang-bubble anim-lang-bubble-left anim-lang-bubble-2">你好</span>
        </div>
      )
    case 'chart':
      return (
        <div className="anim anim-chart" aria-hidden="true">
          {[36, 52, 28, 64, 44, 72, 58].map((h, i) => (
            <span key={i} className={`anim-chart-bar anim-chart-bar-${i}`} style={{ height: `${h}%` }} />
          ))}
        </div>
      )
    case 'defense':
      // Clinical document with a shield-check overlapping its
      // bottom-right corner. The shield pulses (scale + glow) to
      // signal "documentation defended". Used on Pain Management
      // for the Pre-Payment Review Defense card.
      return (
        <div className="anim anim-defense" aria-hidden="true">
          <svg className="anim-defense-doc" viewBox="0 0 44 56" width="44" height="56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="40" height="52" rx="3" fill="#FFFFFF" stroke="#00B5D6" strokeOpacity="0.45" strokeWidth="1.5" />
            <rect x="8" y="12" width="28" height="2.5" rx="1.25" fill="#00B5D6" fillOpacity="0.35" />
            <rect x="8" y="20" width="22" height="2.5" rx="1.25" fill="#00B5D6" fillOpacity="0.35" />
            <rect x="8" y="28" width="26" height="2.5" rx="1.25" fill="#00B5D6" fillOpacity="0.35" />
            <rect x="8" y="36" width="20" height="2.5" rx="1.25" fill="#00B5D6" fillOpacity="0.35" />
          </svg>
          <svg className="anim-defense-shield" viewBox="0 0 36 36" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 2 L32 7 L32 17 C32 25 26 32 18 34 C10 32 4 25 4 17 L4 7 Z" fill="#00B5D6" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M11 18 L16 23 L25 13" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
      )
    case 'meds':
      // Three two-tone capsule pills, sequential color/scale
      // highlight cycle (same rhythm as modifier pills but with
      // pill SVGs instead of CPT-code text). Used on Pain
      // Management for the Medication Management & Drug
      // Screening card. Unambiguous medication visual.
      return (
        <div className="anim anim-meds" aria-hidden="true">
          {[0, 1, 2].map(i => (
            <span key={i} className={`anim-med-cap anim-med-cap-${i}`}>
              <svg viewBox="0 0 44 16" width="44" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="42" height="14" rx="7" fill="currentColor" stroke="#00B5D6" strokeWidth="1.5" />
                <line x1="22" y1="1" x2="22" y2="15" stroke="#00B5D6" strokeWidth="1.5" />
              </svg>
            </span>
          ))}
        </div>
      )
    case 'telehealth':
      // Video-consult glyph: a screen showing a head-and-shoulders
      // figure (the patient/provider on the call) with a pulsing
      // "live" dot. Replaces the earlier monitor + play-triangle,
      // which read as a YouTube play button rather than telehealth.
      return (
        <div className="anim anim-telehealth" aria-hidden="true">
          <svg viewBox="0 0 60 52" width="60" height="52" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Screen */}
            <rect x="2" y="2" width="56" height="38" rx="4" fill="rgba(0,181,214,0.06)" stroke="#00B5D6" strokeWidth="1.5" />
            {/* Person on the screen: head + shoulders */}
            <circle cx="30" cy="16" r="6" fill="#00B5D6" />
            <path d="M18 33 C18 26 24 23 30 23 C36 23 42 26 42 33 Z" fill="#00B5D6" />
            {/* Stand */}
            <rect x="26" y="40" width="8" height="6" fill="#00B5D6" fillOpacity="0.4" />
            <rect x="18" y="46" width="24" height="2.5" rx="1.25" fill="#00B5D6" fillOpacity="0.4" />
            {/* Pulsing live indicator dot, top-right of the screen */}
            <circle cx="50" cy="9" r="3" fill="#00B5D6" className="anim-telehealth-dot" />
          </svg>
        </div>
      )
    case 'eligibility':
      // Insurance card outline with detail lines (cardholder
      // name / ID / group, abstracted) plus a check badge that
      // pulses in and out — reads as "patient's coverage
      // verified, next patient verified, next patient..."
      // Used on Multi-Specialty for Cross-Specialty Eligibility.
      // Earlier draft used 'rules' (4x3 grid sweep) which
      // preview feedback flagged as having no semantic
      // connection to insurance verification — a grid of cells
      // reads as "data" not "eligibility". Opacity-only
      // animation to avoid cross-browser SVG transform issues.
      return (
        <div className="anim anim-eligibility" aria-hidden="true">
          <svg viewBox="0 0 80 50" width="80" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Insurance card body */}
            <rect x="2" y="2" width="76" height="46" rx="5" fill="rgba(0,181,214,0.06)" stroke="#00B5D6" strokeWidth="1.5" />
            {/* Cardholder detail lines (abstracted name / ID /
                group strip — fixed visible at rest, no
                animation, so the card always reads as an ID
                card. */}
            <line x1="10" y1="14" x2="40" y2="14" stroke="#00B5D6" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
            <line x1="10" y1="22" x2="50" y2="22" stroke="#00B5D6" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            <line x1="10" y1="30" x2="34" y2="30" stroke="#00B5D6" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            {/* Verification check badge — circle + tick, both
                pulsing together so the badge appears/disappears
                as one unit. Positioned bottom-right of the card
                where a "verified" stamp would naturally sit. */}
            <g className="anim-eligibility-check">
              <circle cx="62" cy="34" r="10" fill="#00B5D6" />
              <path d="M57.5 34 L60.5 37 L66.5 30.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          </svg>
        </div>
      )
  }
}

interface SpecialtyMarqueeProps {
  items: SpecialtySolution[]
  /**
   * Layout mode:
   *  - 'marquee' (default): horizontal auto-scrolling carousel, drag-enabled, fade edges.
   *  - 'grid': responsive grid (3 col desktop, 2 col mobile). No stripe, no eyebrow
   *    label except for AI agent cards. Used by all specialty pages as of the
   *    "specialty-grid-layout" change (replaces horizontal scroll with vertical scroll).
   */
  layout?: 'marquee' | 'grid'
}

export default function SpecialtyMarquee({ items, layout = 'marquee' }: SpecialtyMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const translateXRef = useRef(0)
  const halfWidthRef = useRef(0)
  const isDraggingRef = useRef(false)
  const isHoveringRef = useRef(false)
  const dragStartRef = useRef({ pointerX: 0, translateX: 0 })
  const rafRef = useRef<number | null>(null)

  // Mobile detection — when `layout === 'grid'` and viewport is ≤720px,
  // we render the marquee carousel instead. SSR renders the desktop
  // grid; on mobile, a brief flash on hydration before switching is
  // acceptable (matches the pattern used elsewhere for matchMedia-based
  // responsive switches in this codebase).
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMounted(true)
    const mq = window.matchMedia('(max-width: 720px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Effective layout: when caller asks for 'grid' but we're on mobile,
  // fall back to 'marquee' so phones keep the swipe/auto-scroll experience.
  const effectiveLayout: 'marquee' | 'grid' =
    isMounted && isMobile && layout === 'grid' ? 'marquee' : layout

  useEffect(() => {
    if (effectiveLayout !== 'marquee') return
    if (!trackRef.current) return

    const measureHalfWidth = () => {
      if (!trackRef.current) return
      // Track contains the items twice; one half-width = one full
      // pass of unique cards.
      halfWidthRef.current = trackRef.current.scrollWidth / 2
    }
    measureHalfWidth()
    window.addEventListener('resize', measureHalfWidth)

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const SPEED_PX_PER_FRAME = 0.55 // ~33 px/sec @ 60fps

    const tick = () => {
      const shouldAutoScroll =
        !isDraggingRef.current && !isHoveringRef.current && !reducedMotion

      if (shouldAutoScroll) {
        translateXRef.current -= SPEED_PX_PER_FRAME
      }

      // Seamless loop: wrap by half-width in either direction so
      // dragging right also stays inside the valid range.
      const half = halfWidthRef.current
      if (half > 0) {
        if (translateXRef.current <= -half) translateXRef.current += half
        else if (translateXRef.current > 0) translateXRef.current -= half
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${translateXRef.current}px, 0, 0)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', measureHalfWidth)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [effectiveLayout])

  // Scroll-reveal for grid mode. Cards start hidden (opacity 0 + translate
  // down 24px) and reveal via IntersectionObserver as they enter the
  // viewport. CSS handles the transition; this effect just toggles the
  // data-revealed attribute. Stagger comes from inline transitionDelay
  // per column position so cards in a row appear left-to-right.
  useEffect(() => {
    if (effectiveLayout !== 'grid') return
    const root = gridRef.current
    if (!root) return

    const cards = Array.from(root.querySelectorAll<HTMLElement>('.spec-card-grid'))
    if (cards.length === 0) return

    // Respect reduced motion: show everything immediately, no transitions.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      cards.forEach((c) => { c.dataset.revealed = 'true' })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ;(entry.target as HTMLElement).dataset.revealed = 'true'
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )

    cards.forEach((c) => observer.observe(c))
    return () => observer.disconnect()
  }, [effectiveLayout, items])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    isDraggingRef.current = true
    dragStartRef.current = {
      pointerX: e.clientX,
      translateX: translateXRef.current,
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    const delta = e.clientX - dragStartRef.current.pointerX
    translateXRef.current = dragStartRef.current.translateX + delta
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <>
      {effectiveLayout === 'grid' ? (
        /* ---------------------------------------------------------------
           Grid mode: responsive grid (3 col on desktop). Mobile (≤720px)
           falls back to the marquee branch below via `effectiveLayout`.

           Per-card structure:
             - title
             - description
             - either an animation (.spec-card-anim) for non-agent cards
               OR an agent footer (.spec-card-agent-footer) for AI agent
               cards. The agent block — avatar + "AI AGENT — NAME" label
               in black — sits at the BOTTOM of the card, after the
               description, replacing the animation slot entirely.

           Scroll-reveal: cards start at opacity 0 + translateY(24px) and
           reveal via IntersectionObserver (handled in the useEffect
           above). Inline transitionDelay staggers within a row (cards 0,
           1, 2 → 0/80/160ms) so a row appears left-to-right.

           CRITICAL: this branch shares the same <style> block as the
           marquee branch below — that block defines all the .anim-*
           classes (modifier pills, stamp track, etc.). All grid-specific
           CSS lives in that same shared block, not in a separate <style>
           tag, so animations work in both layouts. */
        <div className="spec-grid-wrapper" style={{ marginTop: 48 }}>
          <div className="container">
            <div className="spec-grid" ref={gridRef}>
              {items.map((s, i) => (
                <article
                  key={i}
                  className="spec-card spec-card-grid"
                  style={{ transitionDelay: `${(i % 3) * 80}ms` }}
                >
                  <h3 className="spec-card-title">{s.title}</h3>
                  <p className="spec-card-desc">{s.description}</p>
                  {s.agent ? (
                    <div className="spec-card-agent-footer spec-card-agent-footer-popup">
                      <Link
                        href="/cosentus-ai"
                        className="spec-card-agent-popup-link"
                        aria-label={`Meet ${s.agent.name}, our AI agent`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="spec-card-agent-popup-img"
                          src={`/images/${popupImg(s.agent.img)}`}
                          alt=""
                          draggable={false}
                        />
                      </Link>
                      <span className="spec-card-eyebrow">{s.eyebrow}</span>
                    </div>
                  ) : (
                    <div className="spec-card-anim">
                      <CardAnimation s={s} />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="spec-marquee"
          onMouseEnter={() => { isHoveringRef.current = true }}
          onMouseLeave={() => { isHoveringRef.current = false }}
          style={{ marginTop: 48 }}
        >
      <div
        ref={trackRef}
        className="spec-marquee-track"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {[...items, ...items].map((s, i) => (
          <article key={i} className="spec-card" aria-hidden={i >= items.length}>
            <h3 className="spec-card-title">{s.title}</h3>
            <p className="spec-card-desc">{s.description}</p>
            {s.agent ? (
              <div className="spec-card-agent-footer spec-card-agent-footer-popup">
                <Link
                  href="/cosentus-ai"
                  className="spec-card-agent-popup-link"
                  aria-label={`Meet ${s.agent.name}, our AI agent`}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="spec-card-agent-popup-img"
                    src={`/images/${popupImg(s.agent.img)}`}
                    alt=""
                    draggable={false}
                  />
                </Link>
                <span className="spec-card-eyebrow">{s.eyebrow}</span>
              </div>
            ) : (
              <div className="spec-card-anim">
                <CardAnimation s={s} />
              </div>
            )}
          </article>
        ))}
          </div>
        </div>
      )}

      <style>{`
        /* === Marquee shell === */
        .spec-marquee {
          overflow: hidden;
          /* Soft fade-out at edges so cards don't slam against the
             viewport edges. */
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%);
        }
        .spec-marquee-track {
          display: flex;
          gap: 20px;
          width: max-content;
          padding: 8px 20px;
          will-change: transform;
          cursor: grab;
          /* touch-action: pan-y lets vertical page scrolling pass
             through on mobile while still capturing horizontal
             pans for the drag handler. */
          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
        }
        .spec-marquee-track:active { cursor: grabbing; }

        /* === Card === */
        .spec-card {
          flex-shrink: 0;
          width: clamp(280px, 22vw, 330px);
          height: 420px;
          background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 40%, #36C2DE 78%, #00B5D6 100%);
          border: 1px solid var(--gray-200);
          border-radius: 16px;
          padding: 36px 30px 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          overflow: hidden;
          transition: border-color 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
            transform 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
            box-shadow 280ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .spec-card:hover {
          border-color: #00B5D6;
          transform: translateY(-3px);
          box-shadow: 0 16px 36px -16px rgba(0, 181, 214, 0.22);
        }
        .spec-card-stripe {
          position: absolute;
          top: 0; left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #00B5D6 0%, rgba(0,181,214,0.4) 100%);
        }
        .spec-card-eyebrow {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #00B5D6;
        }
        .spec-card-eyebrow-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .spec-card-avatar {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #00B5D6;
          background: var(--white);
          flex-shrink: 0;
          cursor: pointer;
          transition: transform 200ms cubic-bezier(0.22, 0.61, 0.36, 1),
            box-shadow 200ms cubic-bezier(0.22, 0.61, 0.36, 1),
            border-color 200ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .spec-card-avatar:hover {
          transform: scale(1.06);
          box-shadow: 0 6px 18px -6px rgba(0, 181, 214, 0.5);
          border-color: #00A0C0;
        }
        .spec-card-avatar:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 181, 214, 0.35);
        }
        .spec-card-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          -webkit-user-drag: none;
          user-select: none;
        }
        .spec-card-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 400;
          color: var(--gray-900);
          margin: 0;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }
        .spec-card-desc {
          font-size: 15px;
          line-height: 1.7;
          color: var(--gray-600);
          margin: 0;
        }
        .spec-card-anim {
          margin-top: auto;
          height: 110px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* Agent footer: avatar + black label, sits at card bottom in
           place of the animation slot. Same vertical footprint (~110px)
           so cards with an agent line up with cards that have an anim. */
        .spec-card-agent-footer {
          margin-top: auto;
          min-height: 110px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        /* Popup-image agent footer: full figure-plus-icon scene image
           (e.g. cindy-popup.png) replacing the old circular avatar.
           The image's white icon now reads against the card's blue
           bottom. Eyebrow label switches to white for the same reason. */
        .spec-card-agent-footer-popup {
          margin-top: auto;
          min-height: 150px;
          flex-direction: column;
          justify-content: flex-end;
          gap: 6px;
        }
        .spec-card-agent-popup-link {
          display: block;
          width: 100%;
          text-align: center;
          transition: transform 200ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .spec-card-agent-popup-link:hover { transform: scale(1.03); }
        .spec-card-agent-popup-link:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.6);
          border-radius: 8px;
        }
        .spec-card-agent-popup-img {
          width: 100%;
          max-width: 230px;
          height: auto;
          display: block;
          margin: 0 auto;
          -webkit-user-drag: none;
          user-select: none;
        }
        .spec-card-agent-footer-popup .spec-card-eyebrow {
          color: #FFFFFF;
          text-align: center;
        }

        /* === Blue-bottom legibility: recolor animations to white ===
           Cards now have a blue lower half. The per-card animations
           below were authored in brand cyan (#00B5D6) on white. On the
           blue background that cyan disappears, so within the animation
           slot we remap cyan strokes/fills to white. Elements that were
           already white (e.g. ticks inside badges) get a translucent
           dark backing via the wrapper so they don't vanish. This is a
           single mechanical override, not a per-animation redesign. */
        .spec-card-anim svg [stroke="#00B5D6"],
        .spec-card-anim svg [stroke="white"],
        .spec-card-anim svg [stroke="#FFFFFF"] { stroke: #FFFFFF !important; }
        .spec-card-anim svg [fill="#00B5D6"],
        .spec-card-anim svg [fill="#FFFFFF"],
        .spec-card-anim svg [fill="white"] { fill: #FFFFFF !important; }
        .spec-card-anim svg rect[fill^="rgba(0,181,214"],
        .spec-card-anim svg [fill^="rgba(0,181,214"] { fill: rgba(255,255,255,0.18) !important; }

        /* CSS-class-colored animation elements (chart bars, modifier
           pills, language bubbles, stat number, stamp, pulse rings,
           defense doc, meds capsules) are not reachable by the SVG
           attribute selectors above. Blanket-remap their cyan and
           dark-text colors to white/translucent-white so they read on
           the blue card bottom. NOTE: this is a mechanical pass; a few
           animations that relied on dark-text-on-light-fill may need
           individual tuning after preview review. */
        .spec-card-anim .anim-mod-pill,
        .spec-card-anim .anim-stat-number,
        .spec-card-anim .anim-stat-pct,
        .spec-card-anim .anim-stamp-label,
        .spec-card-anim .anim-lang-bubble { color: #FFFFFF !important; }
        .spec-card-anim .anim-chart-bar,
        .spec-card-anim .anim-stat-bar,
        .spec-card-anim .anim-stamp-fill,
        .spec-card-anim .anim-stamp-dot,
        .spec-card-anim .anim-pulse-core,
        .spec-card-anim .anim-rule-cell { background: rgba(255,255,255,0.92) !important; }
        .spec-card-anim .anim-mod-pill,
        .spec-card-anim .anim-lang-bubble,
        .spec-card-anim .anim-stamp-track { border-color: rgba(255,255,255,0.7) !important; }
        .spec-card-anim .anim-badge {
          border-color: #FFFFFF !important;
          background: rgba(255,255,255,0.15) !important;
        }
        .spec-card-anim .anim-badge svg { stroke: #FFFFFF !important; }
        .spec-card-anim .anim-lang-bubble,
        .spec-card-anim .anim-mod-pill { background: rgba(255,255,255,0.15) !important; }
        .spec-card-anim .anim-pulse-ring { border-color: rgba(255,255,255,0.6) !important; }
        .spec-card-anim .anim-pulse-core svg { stroke: #00B5D6 !important; }
        /* Defense shield: blanket rule whitens the shield body AND its
           white tick, making the tick vanish into the shield. Re-cut the
           tick (the fill:none path) in blue so it reads against the now-
           white shield. */
        .spec-card-anim .anim-defense-shield path[fill="none"] { stroke: #00B5D6 !important; }

        /* === Per-card animations === */

        /* Modifiers: row of pills with sequential highlight cycle. */
        .anim-modifiers {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .anim-mod-row { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .anim-mod-pill {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: rgba(0, 181, 214, 0.55);
          background: rgba(0, 181, 214, 0.06);
          border: 1px solid rgba(0, 181, 214, 0.2);
          border-radius: 999px;
          padding: 7px 14px;
          transform-origin: center;
          animation: spec-mod-cycle 3.2s ease-in-out infinite;
        }
        @keyframes spec-mod-cycle {
          0%, 100%, 50% {
            color: rgba(0, 181, 214, 0.55);
            background: rgba(0, 181, 214, 0.06);
            border-color: rgba(0, 181, 214, 0.2);
            transform: scale(1);
            box-shadow: none;
          }
          12.5% {
            color: var(--white);
            background: #00B5D6;
            border-color: #00B5D6;
            transform: scale(1.12);
            box-shadow: 0 6px 14px -6px rgba(0, 181, 214, 0.55);
          }
        }

        /* Rules: 4x3 cell grid with diagonal sweep */
        .anim-rules {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .anim-rules-grid {
          display: grid;
          grid-template-columns: repeat(4, 16px);
          grid-template-rows: repeat(3, 16px);
          gap: 6px;
        }
        .anim-rule-cell {
          border-radius: 3px;
          background: rgba(0, 181, 214, 0.12);
          border: 1px solid rgba(0, 181, 214, 0.22);
          animation: spec-rule-wave 2.8s ease-in-out infinite;
        }
        .anim-rule-cell-0  { animation-delay: 0s;    }
        .anim-rule-cell-1  { animation-delay: 0.12s; }
        .anim-rule-cell-2  { animation-delay: 0.24s; }
        .anim-rule-cell-3  { animation-delay: 0.36s; }
        .anim-rule-cell-4  { animation-delay: 0.12s; }
        .anim-rule-cell-5  { animation-delay: 0.24s; }
        .anim-rule-cell-6  { animation-delay: 0.36s; }
        .anim-rule-cell-7  { animation-delay: 0.48s; }
        .anim-rule-cell-8  { animation-delay: 0.24s; }
        .anim-rule-cell-9  { animation-delay: 0.36s; }
        .anim-rule-cell-10 { animation-delay: 0.48s; }
        .anim-rule-cell-11 { animation-delay: 0.60s; }
        @keyframes spec-rule-wave {
          0%, 60%, 100% {
            background: rgba(0, 181, 214, 0.12);
            border-color: rgba(0, 181, 214, 0.22);
            transform: scale(1);
          }
          25%, 35% {
            background: #00B5D6;
            border-color: #00B5D6;
            transform: scale(1.12);
          }
        }

        /* Badges: 3 check circles fading in */
        .anim-badges {
          display: flex;
          gap: 14px;
          align-items: center;
        }
        .anim-badge {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(0, 181, 214, 0.08);
          border: 1.5px solid #00B5D6;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: spec-badge-fade 3s ease-in-out infinite;
        }
        .anim-badge-0 { animation-delay: 0s; }
        .anim-badge-1 { animation-delay: 0.4s; }
        .anim-badge-2 { animation-delay: 0.8s; }
        @keyframes spec-badge-fade {
          0%, 80%, 100% { opacity: 1; transform: scale(1); }
          40%           { opacity: 0.4; transform: scale(0.88); }
        }

        /* Stamp: progress bar with dot */
        .anim-stamp {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
        }
        .anim-stamp-track {
          position: relative;
          width: 100%;
          height: 6px;
          background: rgba(0, 181, 214, 0.12);
          border-radius: 999px;
          overflow: visible;
        }
        .anim-stamp-fill {
          position: absolute;
          top: 0; left: 0;
          height: 100%;
          background: #00B5D6;
          border-radius: 999px;
          animation: spec-stamp-fill 3.5s ease-in-out infinite;
        }
        .anim-stamp-dot {
          position: absolute;
          top: 50%;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #00B5D6;
          box-shadow: 0 0 0 4px rgba(0, 181, 214, 0.22);
          transform: translate(-50%, -50%);
          animation: spec-stamp-dot 3.5s ease-in-out infinite;
        }
        @keyframes spec-stamp-fill {
          0%, 100% { width: 0%; }
          60%      { width: 100%; }
          80%      { width: 100%; }
        }
        @keyframes spec-stamp-dot {
          0%, 100% { left: 0%; }
          60%      { left: 100%; }
          80%      { left: 100%; }
        }
        .anim-stamp-label {
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          color: #00B5D6;
        }

        /* Stat: big number + bars */
        .anim-stat {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          width: 100%;
        }
        .anim-stat-number {
          font-family: var(--font-display);
          font-size: 56px;
          font-weight: 300;
          color: var(--gray-900);
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .anim-stat-pct {
          font-size: 28px;
          color: #00B5D6;
          margin-left: 2px;
        }
        .anim-stat-bars {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          height: 60px;
        }
        .anim-stat-bar {
          width: 6px;
          background: linear-gradient(180deg, #00B5D6 0%, rgba(0, 181, 214, 0.4) 100%);
          border-radius: 2px;
          transform-origin: bottom;
          animation: spec-stat-bar-grow 2.5s ease-in-out infinite;
        }
        .anim-stat-bar-0 { height: 28%; animation-delay: 0s;    }
        .anim-stat-bar-1 { height: 50%; animation-delay: 0.15s; }
        .anim-stat-bar-2 { height: 72%; animation-delay: 0.3s;  }
        .anim-stat-bar-3 { height: 95%; animation-delay: 0.45s; }
        @keyframes spec-stat-bar-grow {
          0%, 100% { transform: scaleY(1); }
          50%      { transform: scaleY(0.5); }
        }

        /* Pulse: phone + concentric rings */
        .anim-pulse {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .anim-pulse-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px solid #00B5D6;
          animation: spec-pulse-ring 2.4s ease-out infinite;
          opacity: 0;
        }
        .anim-pulse-ring-0 { animation-delay: 0s; }
        .anim-pulse-ring-1 { animation-delay: 0.8s; }
        .anim-pulse-ring-2 { animation-delay: 1.6s; }
        @keyframes spec-pulse-ring {
          0%   { transform: scale(0.5); opacity: 0.9; }
          80%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .anim-pulse-core {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(0, 181, 214, 0.1);
          border: 1.5px solid #00B5D6;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        /* Languages: 3 chat bubbles staged as a conversation */
        .anim-langs {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
          padding: 0 18px;
        }
        .anim-lang-bubble {
          font-size: 13px;
          font-weight: 500;
          color: var(--gray-900);
          background: var(--white);
          border: 1px solid rgba(0, 181, 214, 0.3);
          border-radius: 14px;
          padding: 6px 14px;
          width: fit-content;
          max-width: 75%;
          box-shadow: 0 2px 6px -2px rgba(0, 181, 214, 0.18);
          opacity: 0;
          animation: spec-lang-message 4.2s ease-in-out infinite;
        }
        .anim-lang-bubble-left {
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }
        .anim-lang-bubble-right {
          align-self: flex-end;
          background: rgba(0, 181, 214, 0.12);
          border-color: rgba(0, 181, 214, 0.4);
          color: #006B81;
          border-bottom-right-radius: 4px;
        }
        .anim-lang-bubble-0 { animation-delay: 0s;   }
        .anim-lang-bubble-1 { animation-delay: 0.7s; }
        .anim-lang-bubble-2 { animation-delay: 1.4s; }
        @keyframes spec-lang-message {
          0%, 70%, 100% { opacity: 0; transform: translateY(6px); }
          15%, 60%      { opacity: 1; transform: translateY(0); }
        }

        /* Chart: animated bar chart.
           width: 100% is required — bars use flex: 1 so they need
           an explicit parent width to distribute across. */
        .anim-chart {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          width: 100%;
          height: 80%;
          padding: 0 12px;
        }
        .anim-chart-bar {
          flex: 1;
          background: linear-gradient(180deg, #00B5D6 0%, rgba(0, 181, 214, 0.35) 100%);
          border-radius: 3px 3px 0 0;
          transform-origin: bottom;
          animation: spec-chart-grow 3s ease-in-out infinite;
        }
        .anim-chart-bar-0 { animation-delay: 0s;    }
        .anim-chart-bar-1 { animation-delay: 0.1s;  }
        .anim-chart-bar-2 { animation-delay: 0.2s;  }
        .anim-chart-bar-3 { animation-delay: 0.3s;  }
        .anim-chart-bar-4 { animation-delay: 0.4s;  }
        .anim-chart-bar-5 { animation-delay: 0.5s;  }
        .anim-chart-bar-6 { animation-delay: 0.6s;  }
        @keyframes spec-chart-grow {
          0%, 100% { transform: scaleY(1); }
          50%      { transform: scaleY(0.4); }
        }

        /* Defense: clinical document with a shield-check badge
           overlapping its bottom-right. Shield pulses in scale
           and drops a glow to read as "documentation defended".
           Used for Pre-Payment Review Defense (Pain Management). */
        .anim-defense {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .anim-defense-doc {
          /* Slight left/up nudge so the shield can sit on the
             bottom-right corner without being clipped. */
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-58%, -50%);
        }
        .anim-defense-shield {
          position: absolute;
          bottom: 2px;
          right: 2px;
          transform-origin: center;
          filter: drop-shadow(0 4px 10px rgba(0, 181, 214, 0.35));
          animation: spec-defense-pulse 2.4s ease-in-out infinite;
        }
        @keyframes spec-defense-pulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 4px 10px rgba(0, 181, 214, 0.35));
          }
          50% {
            transform: scale(1.14);
            filter: drop-shadow(0 6px 16px rgba(0, 181, 214, 0.55));
          }
        }

        /* Meds: 3 two-tone capsule pills with sequential color
           + scale highlight. Same rhythm as modifier pills but
           visually distinct (no text, capsule SVG). The fill is
           controlled via 'color' + 'fill: currentColor' so the
           pill body transitions from pale teal to solid teal
           when active. Used for Medication Management & Drug
           Screening (Pain Management). */
        .anim-meds {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .anim-med-cap {
          display: inline-flex;
          color: rgba(0, 181, 214, 0.08);
          transform-origin: center;
          animation: spec-med-cycle 3.2s ease-in-out infinite;
        }
        .anim-med-cap-0 { animation-delay: 0s;   }
        .anim-med-cap-1 { animation-delay: 0.4s; }
        .anim-med-cap-2 { animation-delay: 0.8s; }
        @keyframes spec-med-cycle {
          0%, 100%, 50% {
            color: rgba(0, 181, 214, 0.08);
            transform: scale(1);
            filter: none;
          }
          12.5% {
            color: #00B5D6;
            transform: scale(1.18);
            filter: drop-shadow(0 6px 14px rgba(0, 181, 214, 0.5));
          }
        }

        /* Telehealth: monitor frame with a play triangle inside
           (reads as "video call active") and a small pulsing
           live indicator dot in the top-right corner of the
           screen. The dot uses opacity-only animation because
           CSS transforms on SVG elements are inconsistent
           cross-browser. Used for Telehealth Billing (Behavioral
           Health). */
        .anim-telehealth {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .anim-telehealth-dot {
          animation: spec-telehealth-pulse 1.6s ease-in-out infinite;
        }
        @keyframes spec-telehealth-pulse {
          0%, 100% { opacity: 1;    }
          50%      { opacity: 0.25; }
        }

        /* Eligibility: insurance-card outline with detail lines
           (cardholder name/ID/group abstracted as horizontal
           strokes) and a verification check badge bottom-right.
           The check badge (circle + tick wrapped in a single
           <g>) fades in, holds, fades out — reads as a stream
           of verifications completing one after another. Used
           for Cross-Specialty Eligibility on Multi-Specialty.
           Opacity-only animation to keep SVG transform
           cross-browser quirks out of scope. */
        .anim-eligibility {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .anim-eligibility-check {
          animation: spec-eligibility-verify 2.2s ease-in-out infinite;
        }
        @keyframes spec-eligibility-verify {
          0%, 100%  { opacity: 0; }
          25%, 75%  { opacity: 1; }
        }

        /* Reduced motion: freeze everything but keep visuals visible */
        @media (prefers-reduced-motion: reduce) {
          .spec-marquee-track,
          .anim-mod-pill,
          .anim-rule-cell,
          .anim-badge,
          .anim-stamp-fill,
          .anim-stamp-dot,
          .anim-stat-bar,
          .anim-pulse-ring,
          .anim-lang-bubble,
          .anim-chart-bar,
          .anim-defense-shield,
          .anim-med-cap,
          .anim-telehealth-dot,
          .anim-eligibility-check {
            animation: none !important;
          }
          .anim-lang-bubble {
            opacity: 1;
            transform: translateY(0);
          }
          /* Leave the med capsule in the active (filled) state
             at rest so the card doesn't look empty. */
          .anim-med-cap {
            color: #00B5D6;
          }
          /* Leave the eligibility check visible at rest so the
             card communicates "verified" even with animation
             frozen. */
          .anim-eligibility-check {
            opacity: 1;
          }
        }

        /* Mobile */
        @media (max-width: 720px) {
          .spec-card {
            width: 78vw;
            height: 420px;
            padding: 28px 24px 24px;
          }
          .spec-card-title { font-size: 20px; }
        }

        /* Eyebrow color for agent cards (black instead of brand cyan).
           Applied via the .spec-card-eyebrow-dark class on both grid
           and marquee branches — keeps agent labels readable in body
           color rather than cyan. */
        .spec-card-eyebrow.spec-card-eyebrow-dark {
          color: var(--gray-900);
        }

        /* =================================================================
           === GRID LAYOUT (layout="grid", desktop only) ===================
           Grid mode renders the same .spec-card markup as marquee mode, so
           the .spec-card / .spec-card-title / .spec-card-desc /
           .spec-card-anim / .spec-card-agent-footer styles above are
           reused. These rules add only the grid container, scroll-reveal
           transitions, and a couple of card behavior overrides.

           Mobile (≤720px) falls back to the marquee branch via
           'effectiveLayout' in the component — so this grid CSS only
           ever applies to ≥721px viewports in practice.

           Card width is intentionally NOT changed in grid mode — the
           grid column is capped at 330px (matching the marquee's
           clamp(280px, 22vw, 330px) ceiling) so each card looks
           identical to the marquee version, just laid out in rows.
           ================================================================= */
        .spec-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 330px));
          gap: 28px;
          justify-content: center;
        }
        /* Below desktop but still on tablet (721px–900px): drop to 2
           columns. Mobile (≤720px) doesn't reach this branch because
           effectiveLayout switches to marquee. */
        @media (max-width: 900px) {
          .spec-grid {
            grid-template-columns: repeat(2, minmax(0, 330px));
            gap: 20px;
          }
        }
        /* Neutralize the marquee-only width/flex rules on .spec-card
           inside the grid — the grid column controls the width. */
        .spec-grid .spec-card {
          width: auto;
          flex-shrink: initial;
        }

        /* Scroll-reveal: cards start hidden, IntersectionObserver in
           the component sets data-revealed="true" to trigger the
           transition. Inline 'transitionDelay' on each card staggers
           cards within a row (0/80/160ms by column index). */
        .spec-grid .spec-card-grid {
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 620ms cubic-bezier(0.22, 0.61, 0.36, 1),
            transform 620ms cubic-bezier(0.22, 0.61, 0.36, 1),
            border-color 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
            box-shadow 280ms cubic-bezier(0.22, 0.61, 0.36, 1);
          /* Lock in the will-change hint only during the reveal phase.
             Once revealed, the hover transform still works because the
             above transition list also handles transform. */
          will-change: opacity, transform;
        }
        .spec-grid .spec-card-grid[data-revealed="true"] {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .spec-grid .spec-card-grid,
          .spec-grid .spec-card-grid[data-revealed="true"] {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </>
  )
}
