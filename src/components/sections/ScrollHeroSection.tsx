'use client'

/**
 * ScrollHeroSection
 *
 * Mid-page section. Wraps the ScrollExpandMedia component, supplying
 * the Cosentus content. Currently live only on /cosentus-ai (the home
 * page's copy is commented out).
 *
 * Updated May 2026: was a DNA helix video; replaced per design
 * direction with the Real + AI workflow SVG animation. Same
 * scroll-expand mechanic — small frame → user scrolls → frame
 * expands to full screen → on full expand, the 13 workflow
 * pieces reveal one-by-one in flow order.
 *
 * Updated Jun 2026 (startExpanded mode, used by /cosentus-ai):
 * the frame renders fully expanded from first paint (no zoom), and
 * the 13-piece reveal does NOT start at mount — it waits until the
 * user actually scrolls the section into view (IntersectionObserver,
 * fires once at ~35% visibility). Without this gate the reveal played
 * while the section was still below the fold, so visitors arrived
 * mid- or post-animation. In the original (non-startExpanded) mode
 * the reveal trigger is unchanged: ScrollExpandMedia's own
 * isExpanded (progress >= 0.995).
 *
 * Inside the small frame: all 13 workflow piece SVGs are rendered
 * together as the preview (opacity 1). Once the reveal triggers,
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

import { useEffect, useRef, useState } from 'react'
import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero'
import WorkflowAnimation from '@/components/sections/WorkflowAnimation'

export default function ScrollHeroSection({ startExpanded = false }: { startExpanded?: boolean }) {
  // In startExpanded mode the reveal is gated on the section entering
  // the viewport. Fires once, then disconnects — the reveal is a
  // one-time sequence and must not restart on re-entry.
  const [inView, setInView] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!startExpanded) return
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      // ~35% of the section visible = the person has actually arrived,
      // not just grazed the edge while scrolling past.
      { threshold: 0.35 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [startExpanded])

  return (
    <div ref={wrapRef}>
      <ScrollExpandMedia
        mediaType="custom"
        sideText={null}
        startExpanded={startExpanded}
        customMedia={({ isExpanded }) => (
          <WorkflowAnimation isExpanded={startExpanded ? inView : isExpanded} />
        )}
      />
    </div>
  )
}
