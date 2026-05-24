'use client'

/**
 * WorkflowAnimation
 *
 * Real + AI workflow piece-by-piece reveal. Renders the 13 piece SVGs
 * supplied in Zeus_workflow.zip at their natural composite-coord
 * sizes and at positions computed by label-centroid matching against
 * the composite SVG.
 *
 * NO COMPOSITE IS RENDERED.
 *   The composite SVG has a horizontal "snake" connecting line that
 *   passes BETWEEN the Real People head and the Artificial
 *   Intelligence head (visible in earlier builds). User direction:
 *   that line should not appear there. The 13 piece SVGs do not
 *   include the connecting line — using pieces alone removes it.
 *
 * REVEAL ORDER (flow order from the composite)
 *   1.  Real People + cyan head     (top-left)
 *   2.  AI head + circuit           (below 1)
 *   3.  Scheduling                  (top row tile 1)
 *   4.  Eligibility                 (top row tile 2)
 *   5.  Patient intake              (top-right curve cap)
 *   6.  AI Scribe                   (mid-right curve cap)
 *   7.  Coding                      (mid row tile 1)
 *   8.  Claims                      (mid row tile 2)
 *   9.  Denial                      (mid-left curve cap)
 *   10. Appeal                      (bottom-left curve cap)
 *   11. Follow Up                   (bottom row tile 1)
 *   12. Collections                 (bottom row tile 2)
 *   13. Support                     (bottom-right end cap)
 *
 * SIZES
 *   Every piece is sized at its NATURAL composite-coord dimensions
 *   computed from the SVG mm attributes (width_mm / 149.816 * 1631
 *   for width, height_mm / 116.45 * 1268 for height). Earlier
 *   builds used arbitrary eyeballed sizes that made some pieces 58%
 *   bigger and others 35% smaller than their authoring intent —
 *   that's why labels looked grotesquely disproportionate. Fixed.
 *
 * POSITIONS
 *   Each piece's (x, y) was computed by:
 *     1. Find the white-label centroid in the piece SVG (rendered
 *        at its natural composite-coord size).
 *     2. Find the corresponding white-label centroid in the
 *        composite SVG.
 *     3. piece_top_left = composite_centroid - piece_centroid.
 *   This guarantees each piece's label sits at the same composite
 *   position as the composite's label, so pieces tile correctly.
 *
 * STATES
 *   isExpanded = false  -> all pieces at opacity 1 (preview state;
 *                          the small frame shows the full assembled
 *                          workflow as the user's requested "image
 *                          of the animation")
 *   isExpanded = true   -> animation starts. Pieces snap to opacity
 *                          0, then fade back in one by one in the
 *                          flow order above.
 *
 * TIMING
 *   1000ms fade per piece, 500ms stagger between pieces. Last
 *   piece (Support, delay 6000ms) finishes at ~7000ms total.
 *   User direction: "load slowly, we are not in a race".
 *
 * RESPONSIVE
 *   The SVG viewBox 0 0 1631 1268 scales to fit the parent via
 *   preserveAspectRatio="xMidYMid meet". Same content on desktop
 *   and mobile — letters stay readable on smaller widths because
 *   the parent frame caps at 95vw/85vh.
 *
 * REDUCED MOTION
 *   prefers-reduced-motion: all pieces snap to opacity 1
 *   immediately when isExpanded flips true. No stagger.
 */

import { useEffect, useState } from 'react'

interface WorkflowAnimationProps {
  /**
   * Parent (ScrollExpandMedia) flips this true when scroll-expansion
   * reaches progress >= 0.995. Triggers the one-time reveal.
   */
  isExpanded: boolean
}

/**
 * Each piece's position + natural size in composite coords (0..1631
 * x, 0..1268 y). x,y derived from label-centroid matching against
 * the composite. w,h from the piece SVG's mm dimensions converted
 * to composite-coord units.
 *
 * Pieces with slightly negative y (1, 5) have their top sliver
 * clipped at the viewBox edge — visible content is unaffected.
 *
 * delay = ms after isExpanded flips true. 500ms stagger.
 */
const PIECES = [
  { id:  1, x:  126, y:  -15, w: 320, h: 206, delay:    0, label: 'Real People + cyan head' },
  { id:  2, x:   19, y:  178, w: 437, h: 170, delay:  500, label: 'AI head + circuit' },
  { id:  3, x:  435, y:    6, w: 447, h: 353, delay: 1000, label: 'Scheduling' },
  { id:  4, x:  856, y:    6, w: 424, h: 353, delay: 1500, label: 'Eligibility' },
  { id:  5, x: 1249, y:  -18, w: 393, h: 454, delay: 2000, label: 'Patient intake' },
  { id:  6, x: 1191, y:  408, w: 439, h: 405, delay: 2500, label: 'AI Scribe' },
  { id:  7, x:  814, y:  460, w: 428, h: 355, delay: 3000, label: 'Coding' },
  { id:  8, x:  448, y:  462, w: 415, h: 353, delay: 3500, label: 'Claims' },
  { id:  9, x:  101, y:  461, w: 401, h: 438, delay: 4000, label: 'Denial' },
  { id: 10, x:   98, y:  849, w: 441, h: 418, delay: 4500, label: 'Appeal' },
  { id: 11, x:  475, y:  915, w: 429, h: 354, delay: 5000, label: 'Follow Up' },
  { id: 12, x:  871, y:  917, w: 427, h: 353, delay: 5500, label: 'Collections' },
  { id: 13, x: 1260, y:  916, w: 378, h: 353, delay: 6000, label: 'Support' },
] as const

/** Fade-in duration per piece. */
const PIECE_FADE_MS = 1000

export default function WorkflowAnimation({ isExpanded }: WorkflowAnimationProps) {
  // animationStarted latches true the first time isExpanded becomes
  // true. Used to flip pieces from preview-state (all visible) to
  // animating state (start hidden, fade in sequentially).
  const [animationStarted, setAnimationStarted] = useState(false)
  useEffect(() => {
    if (isExpanded && !animationStarted) setAnimationStarted(true)
  }, [isExpanded, animationStarted])

  // Reduced motion: skip staggered reveal, snap directly to final.
  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Visibility logic:
  //   !animationStarted              -> opacity 1 (preview)
  //   animationStarted + reduceMotion -> opacity 1 (snap to final)
  //   animationStarted (normal)       -> opacity 1 with delay+transition
  //                                      (pieces fade in one by one)
  //
  // The brief one-frame flicker at animation start (all pieces snap
  // from 1 to 0 before fading back to 1) is acceptable and was
  // verified vs. alternatives.

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        // Transparent so the page's ImmersiveVideoBackground shows
        // through. The piece SVGs use 30%-opacity fills (baked in
        // by CorelDRAW); on the dark teal video bg they read with
        // good contrast.
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
        aria-label="Real + AI revenue cycle workflow"
      >
        {PIECES.map((p) => {
          // Opacity is set via CSS style (not SVG attribute) so the
          // CSS transition actually fires. Setting opacity as an SVG
          // attribute doesn't trigger CSS transitions reliably.
          const visible = !animationStarted || reduceMotion || animationStarted
          const opacity = animationStarted ? 1 : 1
          // After much consideration the previous "all visible while
          // !animationStarted, then snap to 0, then fade back" turned
          // out to require unmounting+remounting to reliably restart
          // the per-piece transitions. Simpler: pre-animation opacity
          // 1 (preview), animation triggers a CSS animation on each
          // <image> with from{opacity:0} to{opacity:1} keyframes.
          //
          // Using CSS animation with `forwards` ensures the start
          // state (opacity 0) is applied at frame 0 even if the
          // current style says opacity 1 — overriding the static
          // value while the animation runs.
          const animation =
            animationStarted && !reduceMotion
              ? `pieceFadeIn ${PIECE_FADE_MS}ms ease-out ${p.delay}ms backwards`
              : 'none'
          return (
            <image
              key={p.id}
              href={`/images/workflow/piece-${p.id}.svg`}
              x={p.x}
              y={p.y}
              width={p.w}
              height={p.h}
              aria-label={p.label}
              style={{
                animation,
                opacity, // baseline (used when no animation is running)
              }}
            />
          )
        })}
      </svg>

      <style>{`
        /* Per-piece fade-in. 'backwards' fill mode applies the from{}
           state (opacity 0) during the animation-delay period, so
           pieces don't flash at opacity 1 before their staggered
           start time. */
        @keyframes pieceFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          /* Disable the animation; pieces stay at their baseline
             opacity 1. */
          svg image {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
