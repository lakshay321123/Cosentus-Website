'use client'

/**
 * ScrollHeroSection
 *
 * Mid-page section (position #2 on the home page). Wraps the
 * ScrollExpandMedia component, supplying the Cosentus content.
 *
 * Updated May 2026: was a DNA helix video; replaced per design
 * direction with the Real + AI workflow SVG animation. Same
 * scroll-expand mechanic — small frame → user scrolls → frame
 * expands to full screen → on full expand, the 13 workflow
 * pieces reveal one-by-one in flow order.
 *
 * Inside the small frame: all 13 workflow piece SVGs are rendered
 * together as the preview (opacity 1). Once expansion completes,
 * a CSS keyframe animation plays on each piece — fill-mode
 * backwards drives each piece to opacity 0 during its delay
 * window, then fades it back up in sequence:
 *   Real People + cyan head -> AI head + circuit -> Scheduling
 *   -> Eligibility -> Patient Intake -> AI Scribe -> Coding
 *   -> Claims -> Denial -> Appeal -> Follow Up -> Collections
 *   -> Support
 * There is NO composite underlay — early commits tried that
 * approach and it was rejected (the composite source has a
 * horizontal "snake" connecting line and would double-render
 * the labels).
 *
 * On mobile (<=768px) WorkflowAnimation reflows as a vertical
 * stack with the same reveal order (S-shape doesn't fit phones).
 */

import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero'
import WorkflowAnimation from '@/components/sections/WorkflowAnimation'

export default function ScrollHeroSection({ startExpanded = false }: { startExpanded?: boolean }) {
  return (
    <ScrollExpandMedia
      mediaType="custom"
      sideText={null}
      startExpanded={startExpanded}
      customMedia={({ isExpanded }) => (
        <WorkflowAnimation isExpanded={isExpanded} />
      )}
    />
  )
}
