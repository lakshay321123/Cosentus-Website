'use client'

/**
 * WorkflowAnimation
 *
 * Real + AI workflow reveal. Renders the supplied composite SVG
 * (workflow-composite.svg) as a single image and animates a
 * clip-path reveal so the workflow appears progressively top-to-
 * bottom over ~7 seconds.
 *
 * WHY THIS APPROACH (and not piece-by-piece)
 *
 *   The 13 piece SVGs in the supplied zip and the composite SVG
 *   were authored as INDEPENDENT files. Their internal coordinate
 *   systems and text placements don't share a reference frame:
 *
 *     - Each piece SVG has its own viewBox and its tile labels
 *       sit at piece-relative positions, not composite-relative.
 *     - When a piece is rendered at a given (w, h), its internal
 *       text scales proportionally. Larger bounding box -> larger
 *       text. Smaller box -> smaller text.
 *     - The pieces have natural composite-coord sizes ranging
 *       from 320x206 to 447x454 — close enough that you'd think
 *       they tile, but the visual variance + label-scale variance
 *       made earlier attempts produce wildly disproportionate
 *       text (Patient intake huge, Scheduling tiny). Verified
 *       this is the bug from screenshot.
 *
 *   The composite SVG is the design's source of truth: every
 *   label is at its intended size, every tile is at its intended
 *   position, the connecting "snake" line is included. Animating
 *   a reveal ON the composite preserves all of that.
 *
 * STATES
 *
 *   isExpanded = false  -> composite at full opacity, no clip,
 *                          static preview inside the small frame
 *   isExpanded = true   -> animation class added. clip-path
 *                          animates from inset(0 0 100% 0)
 *                          [bottom 100% clipped — only top sliver
 *                          visible] to inset(0 0 0% 0) [fully
 *                          revealed]. Top-to-bottom reveal matches
 *                          the S-shape flow order (top row -> mid
 *                          row -> bottom row).
 *
 * TIMING
 *   7000ms ease-out reveal. "Load slowly, we are not in a race".
 *
 * RESPONSIVE
 *   The composite SVG's intrinsic viewBox (1631x1268) scales to
 *   fit the parent frame via object-fit: contain. Same SVG on
 *   desktop and mobile — no separate mobile layout needed because
 *   the composite IS readable when scaled down (the labels are
 *   white on tinted tiles; even at mobile sizes they remain
 *   legible).
 *
 * REDUCED MOTION
 *   prefers-reduced-motion: composite simply appears at full
 *   visibility immediately when isExpanded flips true. No
 *   keyframe animation.
 *
 * BRIEF FLICKER AT ANIMATION START
 *   When isExpanded flips true, the composite snaps from "fully
 *   visible" (preview state) to "fully clipped" (animation frame
 *   0) for one paint frame before the animation begins revealing.
 *   This is intentional and noted here so future maintainers
 *   don't try to "fix" it without considering the alternative
 *   approaches (cross-fade, opacity, etc) that were rejected for
 *   different reasons.
 */

import { useEffect, useRef, useState } from 'react'

interface WorkflowAnimationProps {
  /**
   * Parent (ScrollExpandMedia) flips this true when scroll-expansion
   * reaches progress >= 0.995. Triggers the one-time reveal.
   */
  isExpanded: boolean
}

/** Duration of the clip-path reveal animation. */
const REVEAL_DURATION_MS = 7000

export default function WorkflowAnimation({ isExpanded }: WorkflowAnimationProps) {
  // animationStarted: latches true on first isExpanded=true so the
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

  // Force-restart the animation if isExpanded somehow goes false and
  // back to true (defensive — current latching logic prevents this,
  // but a key prop ensures CSS animation restarts cleanly).
  const animKey = useRef(0)
  if (isExpanded && !animationStarted) animKey.current++

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        // Transparent so the page's ImmersiveVideoBackground shows
        // through. The composite SVG uses 30%-opacity fills baked
        // in by CorelDRAW, so the dark teal video bg gives them
        // usable contrast.
        background: 'transparent',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        key={animKey.current}
        // The wrapper around the composite img holds the animation.
        // clip-path on the wrapper (HTML element) has the best
        // cross-browser support; applying it to <img> directly is
        // also OK but wrapping makes the styling easier to reason
        // about.
        className={
          animationStarted && !reduceMotion ? 'workflow-reveal-anim' : ''
        }
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="/images/workflow/workflow-composite.svg"
          alt="Real + AI revenue cycle workflow"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
          draggable={false}
        />
      </div>

      <style>{`
        /* Top-to-bottom reveal. inset(top right bottom left) — we
           animate the BOTTOM inset from 100% (everything below the
           top edge is clipped) to 0% (nothing is clipped).

           ease-out so the reveal starts fast and slows toward the
           bottom rows — feels less mechanical than linear.

           forwards keeps the end state (fully visible) after the
           animation completes. */
        .workflow-reveal-anim {
          animation: workflowReveal ${REVEAL_DURATION_MS}ms ease-out forwards;
          will-change: clip-path;
        }
        @keyframes workflowReveal {
          from {
            clip-path: inset(0 0 100% 0);
            -webkit-clip-path: inset(0 0 100% 0);
          }
          to {
            clip-path: inset(0 0 0% 0);
            -webkit-clip-path: inset(0 0 0% 0);
          }
        }

        /* Reduced motion users: no animation. The composite is
           always visible (default state, no clip-path applied). */
        @media (prefers-reduced-motion: reduce) {
          .workflow-reveal-anim {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
