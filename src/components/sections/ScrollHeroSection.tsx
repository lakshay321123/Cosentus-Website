'use client'

/**
 * ScrollHeroSection
 *
 * Mid-page section (NOT the page hero). Wraps the ScrollExpandMedia
 * component which uses scroll-position-driven animation (via
 * framer-motion useScroll) to expand the DNA helix video from a
 * small centered box to fill the viewport as the user scrolls
 * through the section. No scroll-hijack — user scrolls normally.
 *
 * Position on the home page: SECTION 2 (right under HeroSection).
 *
 * Asset:
 *   /images/specialties-hero.mp4  — DNA helix video, also used as
 *     the hero on every /specialties/* page. The "video that's
 *     already in the header of another page" the user referred to.
 *
 * NOTE: title and bgImageSrc props are intentionally omitted.
 *   - title: would duplicate the Hero tagline above this section
 *   - bgImageSrc: user explicitly asked for the DNA still bg AND
 *     the teal page bg to go away. With no bgImageSrc the page-level
 *     ImmersiveVideoBackground shows through cleanly.
 */

import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero'

export default function ScrollHeroSection() {
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/images/specialties-hero.mp4"
    >
      <div className="scroll-hero-content">
        <p className="scroll-hero-paragraph">
          Combining expert teams and AI-powered technology to optimize your revenue cycle and drive smarter growth.
        </p>
      </div>
      <style>{`
        .scroll-hero-content {
          max-width: 880px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .scroll-hero-paragraph {
          font-size: clamp(18px, 2vw, 22px);
          line-height: 1.5;
          text-align: center;
          color: #fff;
          margin: 0;
        }
      `}</style>
    </ScrollExpandMedia>
  )
}
