'use client'

/**
 * WorkflowAnimation
 *
 * Real + AI workflow reveal. Renders 13 piece SVGs positioned on a
 * 1631 x 1268 stage that matches the composite SVG's viewBox.
 *
 * STATES
 *   isExpanded = false  -> shows the static composite SVG only
 *                          (preview state inside the small frame
 *                          of ScrollExpandMedia before expansion)
 *   isExpanded = true   -> static composite stays visible underneath,
 *                          but the 13 piece SVGs reveal one-by-one on
 *                          top of it in flow order. Once reveal is
 *                          complete the user sees the same picture as
 *                          the static composite (because the pieces
 *                          ARE the composite, just animated in).
 *
 * REVEAL ORDER (per design direction)
 *   1.  Real People + cyan head
 *   2.  AI head + circuit
 *   3.  Scheduling
 *   4.  Eligibility
 *   5.  Patient intake (top-right curve)
 *   6.  AI Scribe (mid-right curve)
 *   7.  Coding
 *   8.  Claims
 *   9.  Denial (mid-left curve)
 *   10. Appeal (bottom-left curve)
 *   11. Follow Up
 *   12. Collections
 *   13. Support (bottom-right end cap)
 *
 * TIMING
 *   Each piece reveals 250ms after the previous one. Total ~3.5s.
 *
 * RESPONSIVE
 *   Desktop:  S-shape preserved. 1631:1268 aspect ratio scales to
 *             container width.
 *   Mobile (<=768px): pieces stack vertically instead of S-curve.
 *             Same reveal order, each piece 80% width centered.
 *
 * ASSETS
 *   /public/images/workflow/workflow-composite.svg
 *   /public/images/workflow/piece-1.svg ... piece-13.svg
 *
 * Files are used as-is from the source ZIP. Not re-authored.
 */

import { useEffect, useState } from 'react'

interface WorkflowAnimationProps {
  /**
   * When true, the 13 pieces start revealing in sequence on top of
   * the static composite background. Parent (ScrollExpandMedia)
   * flips this true when scroll-expansion reaches progress = 1.
   */
  isExpanded: boolean
}

/**
 * Each piece's position inside the 1631 x 1268 composite viewBox.
 * Coordinates read by overlaying a 100px grid on the rendered
 * composite and measuring each piece's bounding box visually.
 * The boxes are intentionally a hair larger than the visible art
 * to give the SVG image breathing room when scaled down on small
 * containers — extra transparent space is harmless.
 *
 * delay = ms after isExpanded flips true before this piece starts
 * fading in. Linear 250ms stagger.
 */
const PIECES = [
  { id: 1,  x:  140, y:    0, w: 240, h: 320, delay:    0 },  // Real People + cyan head
  { id: 2,  x:  140, y:  150, w: 240, h: 240, delay:  250 },  // AI head + circuit
  { id: 3,  x:  370, y:   20, w: 290, h: 280, delay:  500 },  // Scheduling
  { id: 4,  x:  640, y:   20, w: 290, h: 280, delay:  750 },  // Eligibility
  { id: 5,  x:  880, y:   20, w: 620, h: 600, delay: 1000 },  // Patient intake
  { id: 6,  x:  880, y:  340, w: 620, h: 600, delay: 1250 },  // AI Scribe
  { id: 7,  x:  640, y:  350, w: 290, h: 280, delay: 1500 },  // Coding
  { id: 8,  x:  370, y:  350, w: 290, h: 280, delay: 1750 },  // Claims
  { id: 9,  x:  140, y:  350, w: 320, h: 600, delay: 2000 },  // Denial
  { id: 10, x:  140, y:  620, w: 320, h: 600, delay: 2250 },  // Appeal
  { id: 11, x:  370, y:  700, w: 290, h: 540, delay: 2500 },  // Follow Up
  { id: 12, x:  640, y:  700, w: 290, h: 540, delay: 2750 },  // Collections
  { id: 13, x:  880, y:  700, w: 620, h: 560, delay: 3000 },  // Support
] as const

export default function WorkflowAnimation({ isExpanded }: WorkflowAnimationProps) {
  // animationStarted: have we ever entered the expanded state once?
  // We DON'T un-trigger animation when isExpanded later flips false
  // (e.g. user scrolls back up) — keeping all pieces visible feels
  // more polished than re-hiding them mid-scroll. If you want re-play
  // behaviour later, change this to mirror isExpanded directly.
  const [animationStarted, setAnimationStarted] = useState(false)

  useEffect(() => {
    if (isExpanded && !animationStarted) {
      setAnimationStarted(true)
    }
  }, [isExpanded, animationStarted])

  // Respect prefers-reduced-motion: skip animation, show final state.
  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Detect mobile so we render the vertical stack layout instead of
  // the S-shape. Same breakpoint used everywhere else (768px).
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // === MOBILE: vertical stack ===
  // Each piece becomes a 80%-width row, stacked top-to-bottom in
  // reveal order. No positioning by composite coordinates — just
  // flex column. Static composite NOT shown underneath on mobile
  // because the S-shape doesn't fit narrow viewports anyway.
  if (isMobile) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 12,
          padding: '24px 12px',
          overflow: 'auto',
        }}
      >
        {PIECES.map((p) => {
          const visible = reduceMotion || (animationStarted && true)
          const delayMs = reduceMotion ? 0 : p.delay
          return (
            <img
              key={p.id}
              src={`/images/workflow/piece-${p.id}.svg`}
              alt=""
              style={{
                width: '78%',
                maxWidth: 320,
                height: 'auto',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 600ms ease-out ${delayMs}ms, transform 600ms ease-out ${delayMs}ms`,
              }}
            />
          )
        })}
      </div>
    )
  }

  // === DESKTOP: S-curve composite with absolute-positioned pieces ===
  // The static composite is the BASE LAYER and always visible — it's
  // what the user sees inside the small frame before expansion. The
  // pieces sit ON TOP of it at the same positions, initially invisible.
  // When isExpanded flips true, pieces fade+slide in sequentially.
  //
  // Why keep the static composite under the pieces? Two reasons:
  //   1. Inside the small (pre-expansion) frame the user needs to see
  //      SOMETHING, and showing the final-state composite is the
  //      clearest preview of what's about to happen.
  //   2. On expansion, the pieces fade in over a perfect-match base,
  //      so any positioning drift between piece SVGs and the composite
  //      gets visually concealed instead of producing a bad seam.
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Static composite — always rendered, fills the frame */}
      <img
        src="/images/workflow/workflow-composite.svg"
        alt="Real + AI workflow"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          // Fades to 0.15 once the piece animation has played in, so
          // the freshly-animated pieces stand out. Before animation
          // starts (small frame state) the composite is fully visible
          // as the static preview.
          opacity: animationStarted && !reduceMotion ? 0.15 : 1,
          transition: 'opacity 800ms ease-out',
        }}
      />

      {/* Piece overlay — each piece in its composite-coordinate slot.
          Container has aspectRatio 1631/1268 forced via the wrapper
          (see below). Pieces are positioned in % of that wrapper so
          they scale with it. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          // Match the composite viewBox so the % positioning lines up
          // exactly. The inner box is centred inside the parent and
          // shrunk to fit while preserving aspect.
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            // Force the same aspect ratio as composite-svg viewBox so
            // % coordinates inside this box land in the right place.
            aspectRatio: '1631 / 1268',
            // Fit-cover behaviour via min/max — width takes the
            // smaller of container w/h*ratio, height matches.
            width: 'min(100%, calc(100% * (1631 / 1268)))',
            maxHeight: '100%',
            // Children are absolutely positioned in % of this box.
            // Fallback dimensions if aspect-ratio isn't supported.
          }}
        >
          {PIECES.map((p) => {
            const visible = reduceMotion || animationStarted
            const delayMs = reduceMotion ? 0 : p.delay
            return (
              <img
                key={p.id}
                src={`/images/workflow/piece-${p.id}.svg`}
                alt=""
                style={{
                  position: 'absolute',
                  left:   `${(p.x / 1631) * 100}%`,
                  top:    `${(p.y / 1268) * 100}%`,
                  width:  `${(p.w / 1631) * 100}%`,
                  height: `${(p.h / 1268) * 100}%`,
                  objectFit: 'contain',
                  objectPosition: 'left top',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'scale(1)' : 'scale(0.92)',
                  transformOrigin: 'center',
                  transition:
                    `opacity 600ms ease-out ${delayMs}ms, ` +
                    `transform 600ms cubic-bezier(0.16,1,0.3,1) ${delayMs}ms`,
                  pointerEvents: 'none',
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
