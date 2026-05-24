'use client'

/**
 * WorkflowAnimation
 *
 * Real + AI workflow reveal. Uses the 14 SVGs supplied as-is:
 *   public/images/workflow/workflow-composite.svg  (full composite)
 *   public/images/workflow/piece-1.svg ... piece-13.svg (the 13 pieces)
 *
 * STATES
 *   isExpanded = false  -> shows the static composite SVG only
 *                          (preview state inside the small frame
 *                          of ScrollExpandMedia before expansion)
 *   isExpanded = true   -> composite stays visible, pieces fade in
 *                          one-by-one on top of it in flow order.
 *                          The pieces and composite are guaranteed
 *                          to align because they render inside the
 *                          SAME SVG viewBox (no separate sizing math).
 *
 * REVEAL ORDER
 *   1.  Real People + cyan head
 *   2.  AI head + circuit
 *   3.  Scheduling   4. Eligibility   5. Patient intake
 *   6.  AI Scribe    7. Coding        8. Claims
 *   9.  Denial      10. Appeal       11. Follow Up
 *   12. Collections 13. Support
 *
 * BACKGROUND
 *   Transparent. The home page already has an ImmersiveVideoBackground
 *   running at z-index:-1; that video shows through the frame so the
 *   30%-opacity SVG tiles render with usable contrast.
 *
 * ALIGNMENT
 *   Composite and pieces sit inside one <svg viewBox="0 0 1631 1268">.
 *   SVG natively handles fit-with-aspect-ratio via preserveAspectRatio,
 *   so there is no manual width/height/% math to get wrong. Pieces use
 *   raw composite coordinates (not percentages) — the same coords used
 *   for placement when read off the rendered grid composite.
 *
 * RESPONSIVE
 *   Desktop (>768px): S-shape preserved via the shared SVG viewBox.
 *   Mobile (<=768px): pieces stack vertically as 78% rows in reveal
 *                     order. Static composite not shown — S-shape
 *                     labels become unreadable at narrow widths.
 *
 * REDUCED MOTION
 *   prefers-reduced-motion respected. All pieces snap to opacity 1
 *   immediately with no transition.
 */

import { useEffect, useState } from 'react'

interface WorkflowAnimationProps {
  /**
   * Parent (ScrollExpandMedia) flips this true when scroll-expansion
   * reaches progress >= 0.995. Triggers the one-time reveal sequence.
   */
  isExpanded: boolean
}

/**
 * Each piece's bounding box in composite viewBox coords (0..1631 x,
 * 0..1268 y). Measured by overlaying a 100px grid on the rendered
 * composite SVG. delay is ms after isExpanded flips true.
 *
 * Timing: 1000ms fade per piece, 500ms stagger between pieces. Final
 * piece begins at delay 6000ms and finishes around 7000ms. Slower
 * pace per user direction "load slowly, we are not in a race".
 */
const PIECES = [
  { id: 1,  x:  140, y:    0, w: 240, h: 320, delay:    0 },  // Real People + cyan head
  { id: 2,  x:  140, y:  150, w: 240, h: 240, delay:  500 },  // AI head + circuit
  { id: 3,  x:  370, y:   20, w: 290, h: 280, delay: 1000 },  // Scheduling
  { id: 4,  x:  640, y:   20, w: 290, h: 280, delay: 1500 },  // Eligibility
  { id: 5,  x:  880, y:   20, w: 620, h: 600, delay: 2000 },  // Patient intake
  { id: 6,  x:  880, y:  340, w: 620, h: 600, delay: 2500 },  // AI Scribe
  { id: 7,  x:  640, y:  350, w: 290, h: 280, delay: 3000 },  // Coding
  { id: 8,  x:  370, y:  350, w: 290, h: 280, delay: 3500 },  // Claims
  { id: 9,  x:  140, y:  350, w: 320, h: 600, delay: 4000 },  // Denial
  { id: 10, x:  140, y:  620, w: 320, h: 600, delay: 4500 },  // Appeal
  { id: 11, x:  370, y:  700, w: 290, h: 540, delay: 5000 },  // Follow Up
  { id: 12, x:  640, y:  700, w: 290, h: 540, delay: 5500 },  // Collections
  { id: 13, x:  880, y:  700, w: 620, h: 560, delay: 6000 },  // Support
] as const

/** Duration of each piece's individual fade-in. Paired with the
 * stagger above to produce a leisurely sequential reveal. */
const PIECE_FADE_MS = 1000

/** Duration of the composite's cross-fade-out at animation start.
 * Set roughly equal to PIECE_FADE_MS so composite finishes fading
 * before piece-2 begins (delay 500ms), and is gone well before
 * piece-3 onwards. */
const COMPOSITE_FADE_MS = 1000

export default function WorkflowAnimation({ isExpanded }: WorkflowAnimationProps) {
  // animationStarted: latched true on first isExpanded=true so the
  // reveal doesn't replay if the user scrolls back up.
  const [animationStarted, setAnimationStarted] = useState(false)
  useEffect(() => {
    if (isExpanded && !animationStarted) setAnimationStarted(true)
  }, [isExpanded, animationStarted])

  // Reduced-motion support.
  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Mobile detection — vertical stack layout below 768px.
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // === MOBILE: vertical stack ===
  // Each piece becomes an 80%-wide row. Reveal order matches desktop.
  // Background transparent so the page's immersive video shows through.
  if (isMobile) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'transparent',
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
          const visible = reduceMotion || animationStarted
          const delayMs = reduceMotion ? 0 : p.delay
          const durationMs = reduceMotion ? 0 : PIECE_FADE_MS
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
                transition: `opacity ${durationMs}ms ease-out ${delayMs}ms, transform ${durationMs}ms ease-out ${delayMs}ms`,
              }}
            />
          )
        })}
      </div>
    )
  }

  // === DESKTOP: shared-viewBox SVG ===
  // Both the composite (full size 1631x1268) and the per-piece <image>
  // elements live in the same <svg viewBox="0 0 1631 1268">. SVG
  // handles the aspect-fit math via preserveAspectRatio so the
  // contents always render at the same scale and position regardless
  // of the parent frame's shape.
  //
  // Composite stays visible at full opacity throughout. Pieces fade
  // in on top of it (additive against the 30%-opacity SVG fills,
  // so the animated region appears to "light up" as each piece
  // arrives). After the full reveal, the composite is still there
  // underneath — harmless because pieces+composite is the same image.
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        // Transparent so the page's ImmersiveVideoBackground shows
        // through the frame. The teal-tinted SVG tiles read clearly
        // against the dark video bg.
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox="0 0 1631 1268"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
        aria-label="Real + AI workflow"
      >
        {/* Composite — full-size base layer. Acts as the static
            preview when the frame is small. Cross-fades out the
            moment expansion completes so it doesn't overlap with
            the animating pieces.

            IMPORTANT: opacity MUST be set in `style`, not as the SVG
            `opacity` attribute. CSS transitions only fire on CSS
            property changes — setting opacity as an SVG attribute
            causes the value to snap (no animation) and, depending
            on browser, can leave the element stuck at its starting
            value when paired with `style: transition`. Verified
            this was the cause of the May 24 "composite still
            visible behind pieces" bug. */}
        <image
          href="/images/workflow/workflow-composite.svg"
          x={0}
          y={0}
          width={1631}
          height={1268}
          style={{
            opacity: animationStarted ? 0 : 1,
            transition: `opacity ${COMPOSITE_FADE_MS}ms ease-out`,
          }}
        />

        {/* Per-piece overlay images. Each piece <image> sits in the
            shared viewBox at its measured (x,y,w,h). Opacity 0 -> 1
            with staggered delay drives the reveal. Same rule as
            composite: opacity in style, not attribute. */}
        {PIECES.map((p) => {
          const visible = reduceMotion || animationStarted
          const delayMs = reduceMotion ? 0 : p.delay
          const durationMs = reduceMotion ? 0 : PIECE_FADE_MS
          return (
            <image
              key={p.id}
              href={`/images/workflow/piece-${p.id}.svg`}
              x={p.x}
              y={p.y}
              width={p.w}
              height={p.h}
              style={{
                opacity: visible ? 1 : 0,
                transition: `opacity ${durationMs}ms ease-out ${delayMs}ms`,
              }}
            />
          )
        })}
      </svg>
    </div>
  )
}
