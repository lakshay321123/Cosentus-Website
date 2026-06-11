'use client'

import type { ShuffleTestimonial } from './TestimonialsShuffleSection'

/**
 * TestimonialsMarquee — DESKTOP-ONLY horizontally-scrolling variant of the
 * home-page testimonials.
 *
 * Why this exists:
 *   The home page previously showed the fan-stack (TestimonialsShuffleSection
 *   -> TestimonialCard). Per design direction (Jun 2026) the DESKTOP layout
 *   was changed to a continuous left-scrolling marquee of the same glass
 *   cards, while MOBILE keeps the fan-stack untouched. The swap between the
 *   two is done purely in CSS in TestimonialsShuffleSection (.tcard-stack is
 *   hidden >=1024px, this marquee is hidden <1024px) so neither component has
 *   to know about viewport width in JS — avoids hydration mismatches.
 *
 * Styling parity:
 *   The card surface here is a byte-for-byte copy of the glass recipe in
 *   TestimonialCard.tsx (30%/40% white wash, 50% white border, backdrop blur
 *   + saturate, cyan glow shadow) and the same typography (var(--font-display),
 *   #0a2d41 navy text, italic curly-quote body, uppercase tag eyebrow). No
 *   colours, fonts, sizes, or copy were changed — only the motion model
 *   (fan-stack -> marquee row).
 *
 * Animation:
 *   The track holds the testimonials TWICE in sequence and translates left by
 *   exactly -50% (the width of one full set), so the loop is seamless. Keyframe
 *   `testimonialMarquee` lives in globals.css alongside the existing
 *   `partnerScroll` marquee. Pauses on hover. Respects prefers-reduced-motion
 *   (animation disabled in CSS).
 */

interface Props {
  testimonials: ShuffleTestimonial[]
}

// One glass card. Mirrors TestimonialCard.tsx's surface + typography exactly,
// minus the framer-motion drag/stack behaviour (not needed in a marquee).
function MarqueeCard({ t }: { t: ShuffleTestimonial }) {
  return (
    <div
      className="tmarquee-card"
      style={{
        // GLASS-SQUARE RECIPE, adjusted for the marquee context:
        // - White wash raised 0.40 -> 0.75. The fan cards sat over the
        //   brightest part of the video, so 40% white read milky there;
        //   the marquee spans darker video regions where 40% white
        //   computes to flat gray. 0.75 reproduces the old perceived
        //   whiteness over the darker backdrop.
        // - Cyan glow shadow REMOVED. On the fan it was one localized
        //   glow; across a full-width row the adjacent cards' 60px-blur
        //   glows merged into a continuous lighter band that read as a
        //   background layer behind the section.
        background: 'rgba(255, 255, 255, 0.75)',
        border: '1.5px solid rgba(255, 255, 255, 0.50)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        // Cyan glow — same values as the mobile fan card
        // (TestimonialCard.tsx). Removed in a previous pass while
        // chasing a band artifact; the band was actually the gray
        // 0.40-wash cards, and the glow is part of the wanted look.
        boxShadow: '0 20px 60px rgba(0, 181, 214, 0.25)',
        overflow: 'hidden',
      }}
    >
      {/* Specialty tag — uppercase eyebrow (same as fan-stack card) */}
      {t.tag && (
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#0a2d41',
          }}
        >
          {t.tag}
        </div>
      )}

      {/* Quote — same italic navy curly-quote treatment */}
      <blockquote
        style={{
          margin: 0,
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          lineHeight: 1.5,
          color: '#0a2d41',
          fontStyle: 'italic',
          fontWeight: 400,
        }}
      >
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      {/* Attribution — same sizes/colours */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: '#0a2d41',
            fontFamily: 'var(--font-display)',
          }}
        >
          {t.name}
        </div>
        {t.role && (
          <div style={{ fontSize: 14, color: 'rgba(10, 45, 65, 0.70)', textAlign: 'center' }}>
            {t.role}
          </div>
        )}
      </div>
    </div>
  )
}

export default function TestimonialsMarquee({ testimonials }: Props) {
  // Render the set twice so the -50% translate loops seamlessly.
  const doubled = [...testimonials, ...testimonials]

  return (
    <div
      className="tmarquee-viewport"
      aria-roledescription="testimonial marquee"
      // Pause on hover via a class toggle on the track (CSS handles the
      // actual animation-play-state). Using group-hover-style CSS instead
      // of JS keeps this dependency-free.
    >
      <div className="tmarquee-track">
        {doubled.map((t, i) => (
          // The second half is aria-hidden so screen readers don't read
          // every testimonial twice.
          <div key={`${t.name}-${i}`} aria-hidden={i >= testimonials.length ? true : undefined}>
            <MarqueeCard t={t} />
          </div>
        ))}
      </div>
    </div>
  )
}
