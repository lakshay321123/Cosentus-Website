'use client'

/**
 * ScrollHeroSection
 *
 * Thin wrapper around the third-party ScrollExpandMedia component
 * (src/components/blocks/scroll-expansion-hero.tsx) that supplies the
 * Cosentus content: title text, the DNA helix video, and the
 * "Combining expert teams..." paragraph that surfaces after the
 * media is fully expanded.
 *
 * This section REPLACES the previous HeroSection + IntroVideoSection
 * pair on the home page (per user direction option A: "Replace the
 * existing HeroSection entirely"). Both files still exist in the
 * repo for now and can be deleted in a follow-up cleanup commit
 * once we are sure this hero direction is sticking.
 *
 * Important constraint inherited from ScrollExpandMedia: while the
 * media is not fully expanded, the component hijacks page scroll
 * (window.scrollTo(0, 0) on every scroll event). It MUST be the
 * first thing on the home page or users will be locked at the top
 * with the content above it unreachable below.
 *
 * Asset choice (per user "use any other video you have"):
 *   /images/specialties-hero.mp4  — the DNA helix video, already
 *     used as the hero on every /specialties/* page. ~7MB. The
 *     PageHero.tsx file calls this asset "(DNA helix)" in a
 *     comment which is why the user originally asked for "the
 *     DNA one".
 *   /images/dna-helix.jpg  — static DNA still image. Used here as
 *     the bg image that fades out as the video expands.
 */

import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero'

export default function ScrollHeroSection() {
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/images/specialties-hero.mp4"
      bgImageSrc="/images/dna-helix.jpg"
      title="Purpose Built For Your Specialty."
      scrollToExpand="Scroll to explore"
    >
      {/* This block is faded in by the component once mediaFullyExpanded.
          Keeping it intentionally minimal: the paragraph the user
          asked for, white text, centered, wide reading width.
          The rest of the home page (RASection, SpecialtiesSection,
          ResultsSection, etc.) renders below this — but only becomes
          reachable AFTER the user fully expands the media. */}
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
