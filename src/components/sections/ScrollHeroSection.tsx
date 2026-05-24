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
 * Inside the small frame: the static composite workflow SVG is
 * the preview. Once expansion completes, the per-piece pieces
 * fade in over the composite in the sequence:
 *   Real People + cyan head -> AI head + circuit -> Scheduling
 *   -> Eligibility -> Patient Intake -> AI Scribe -> Coding
 *   -> Claims -> Denial -> Appeal -> Follow Up -> Collections
 *   -> Support
 *
 * On mobile (<=768px) WorkflowAnimation reflows as a vertical
 * stack with the same reveal order (S-shape doesn't fit phones).
 */

import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero'
import WorkflowAnimation from '@/components/sections/WorkflowAnimation'

export default function ScrollHeroSection() {
  return (
    <ScrollExpandMedia
      mediaType="custom"
      sideText={null}
      customMedia={({ isExpanded }) => (
        <WorkflowAnimation isExpanded={isExpanded} />
      )}
    />
  )
}
