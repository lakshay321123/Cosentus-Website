'use client'

/**
 * ScrollHeroSection
 *
 * Mid-page section (position #2 on the home page). Wraps the
 * ScrollExpandMedia component, supplying the Cosentus content:
 *   - DNA helix video as the media
 *   - "Combining expert teams..." paragraph as the side text
 *     (visible on the left initially, slides off as user scrolls,
 *     re-appears below the fully-expanded video)
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
      sideText={
        <>
          Combining expert teams and AI-powered technology to optimize your revenue cycle and drive smarter growth.
        </>
      }
    />
  )
}
