'use client'

/**
 * ScrollHeroSection
 *
 * Despite the historical "Hero" name, this is now a mid-page section
 * (NOT the page hero). It wraps the modified ScrollExpandMedia
 * component (src/components/blocks/scroll-expansion-hero.tsx) which
 * no longer hijacks page scroll — it renders a normal in-page block
 * with a DNA helix video, a dark-tinted background image, and the
 * "Combining expert teams..." paragraph below.
 *
 * Position on the home page: SECTION 2 (right under HeroSection).
 * Replaces the placeholder IntroVideoSection I'd built earlier with
 * the 16:9 blank video frame.
 *
 * Assets:
 *   /images/specialties-hero.mp4  — DNA helix video, also used as
 *     the hero on every /specialties/* page. PageHero.tsx labels
 *     it "(DNA helix)" in a comment which is the asset the user
 *     originally asked for.
 *   /images/dna-helix.jpg  — DNA still image, used as the static
 *     background behind the video frame.
 *
 * NOTE: title prop is intentionally omitted. The HeroSection above
 * this section already shows "Purpose Built For Your Specialty,
 * Real People + AI. RCM Redefined." — putting a title here would
 * duplicate that. The DNA video itself plus the paragraph below it
 * is the section's content.
 */

import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero'

export default function ScrollHeroSection() {
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/images/specialties-hero.mp4"
      bgImageSrc="/images/dna-helix.jpg"
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
        }
        .scroll-hero-paragraph {
          font-size: clamp(20px, 2.4vw, 28px);
          line-height: 1.5;
          text-align: center;
          color: #fff;
          margin: 0;
        }
      `}</style>
    </ScrollExpandMedia>
  )
}
