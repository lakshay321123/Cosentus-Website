'use client'

/**
 * ScrollHeroSection
 *
 * Mid-page section (position #2 on the home page). Wraps the
 * ScrollExpandMedia component, supplying the Cosentus content:
 *   - DNA helix video as the media
 *   - No side text (the "Combining expert teams..." paragraph was
 *     removed per design direction; the video carries the section
 *     alone now). sideText is required by ScrollExpandMedia but
 *     accepts ReactNode, so passing null renders empty absolutely-
 *     positioned containers that take no visual space.
 *
 * The component handles the scroll-hijack + freeze + expand
 * interaction itself. This wrapper just supplies content.
 */

import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero'

export default function ScrollHeroSection() {
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/images/specialties-hero.mp4"
      sideText={null}
    />
  )
}
