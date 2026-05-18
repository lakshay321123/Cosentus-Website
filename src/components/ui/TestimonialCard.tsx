'use client'

import * as React from 'react'
import { motion, type PanInfo } from 'framer-motion'

/**
 * TestimonialCard — single fan-stacked glass card.
 *
 * Adapted from the 21st.dev shuffle-cards pattern (vaib215), re-themed to
 * match the Cosentus liquid-glass aesthetic used on the existing
 * TestimonialsSection arrow buttons (.t-arrow): cyan tint, backdrop-blur,
 * inset highlights, soft cyan glow.
 *
 * Stack model:
 *   stackIndex 0 .. (totalCards - 1)
 *     0                -> front card (-6deg, x 0%, fully opaque, draggable)
 *     totalCards - 1   -> back card  (+6deg, x 66%, slightly faded)
 *   Every card in between sits on a linear interpolation across rotate,
 *   x-offset, and opacity. This replaces the earlier 4-state enum
 *   (front/middle/back/hidden) which only worked for exactly 3 visible
 *   cards. With 5+ testimonials, the old enum hid the extras at opacity
 *   0 behind 'back', which read as "5 dots but only 3 cards" to users.
 *
 * Drag interaction:
 *   - drag={true} + dragListener={isFront} matches the 21st.dev source
 *     exactly; only the front card responds to pointer events.
 *   - dragConstraints clamps the visual drag to origin (elastic feel).
 *   - On release, if the user dragged left > 150px, fire onShuffleAdvance.
 */

export interface TestimonialCardProps {
  /** The quoted testimonial text (rendered inside curly quotes). */
  testimonial: string
  /** Author display name. */
  author: string
  /** Optional role / title shown under the author. */
  role?: string
  /** Optional specialty tag shown at the top of the card. */
  tag?: string
  /** Initials displayed inside the gradient avatar circle. */
  initials: string
  /** 0 = front card; (totalCards - 1) = back-most card. */
  stackIndex: number
  /** Total number of cards in the fan stack (used to compute spread). */
  totalCards: number
  /** Fired when the user drags the front card left past the threshold. */
  onShuffleAdvance: () => void
}

// Fan-spread parameters — tuned to match the original 3-card 21st.dev
// look at the endpoints (front = -6deg/0%, back = +6deg/66%). The
// in-between cards are linearly interpolated.
const ROTATE_FRONT_DEG = -6
const ROTATE_BACK_DEG = 6
const X_BACK_PERCENT = 66
// Opacity fade from front to back. Light fade (1.0 -> 0.7) gives a depth
// cue without making back cards unreadable. The dark-glass surface
// already blocks bleed-through, so heavy fading isn't needed.
const OPACITY_FRONT = 1
const OPACITY_BACK = 0.7

const DRAG_THRESHOLD_PX = 150

export default function TestimonialCard({
  testimonial,
  author,
  role,
  tag,
  initials,
  stackIndex,
  totalCards,
  onShuffleAdvance,
}: TestimonialCardProps) {
  // progress: 0 at front card, 1 at back card. Guard against div-by-zero
  // when only one testimonial exists.
  const denom = Math.max(1, totalCards - 1)
  const progress = stackIndex / denom

  const rotateDeg = ROTATE_FRONT_DEG + progress * (ROTATE_BACK_DEG - ROTATE_FRONT_DEG)
  const xPercent = progress * X_BACK_PERCENT
  const cardOpacity = OPACITY_FRONT + progress * (OPACITY_BACK - OPACITY_FRONT)
  // Front card has highest z so it sits on top of all others.
  const zIndex = totalCards - stackIndex

  const isFront = stackIndex === 0

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // info.offset.x is negative for left drags. Threshold matches the
    // original 21st.dev component for behavioural parity.
    if (info.offset.x < -DRAG_THRESHOLD_PX) {
      onShuffleAdvance()
    }
  }

  return (
    <motion.div
      style={{
        zIndex,
        // Glass surface — dark teal-navy gradient with a cyan rim.
        //
        // We deliberately moved AWAY from the bright cyan tint (rgba(0,181,214,0.12))
        // because at 12% alpha over the home page's bright video background,
        // the cards were near-transparent and text on cards behind bled
        // through. This dark, opaque base blocks bleed-through while the
        // cyan border + cyan glow + inset cyan highlight preserve the
        // "liquid glass" identity from the .t-arrow buttons.
        //
        // Gradient direction matches the inset-highlight light source
        // (top-left brighter, bottom-right darker) so the glass reads
        // like it's catching light from above.
        background:
          'linear-gradient(135deg, rgba(10, 45, 65, 0.72) 0%, rgba(2, 22, 38, 0.82) 100%)',
        border: '1px solid rgba(0, 181, 214, 0.45)',
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
        boxShadow:
          'inset 0 1px 0 rgba(0, 181, 214, 0.40), ' +    // bright cyan rim along the top
          'inset 0 -1px 0 rgba(0, 40, 55, 0.55), ' +     // darker shadow rim along the bottom
          '0 20px 60px rgba(0, 181, 214, 0.25)',         // soft cyan glow under the card
      }}
      animate={{
        rotate: `${rotateDeg}deg`,
        x: `${xPercent}%`,
        opacity: cardOpacity,
      }}
      // Drag config matches the 21st.dev source pattern exactly:
      //   drag={true}              -> drag is enabled on every card,
      //   dragListener={isFront}   -> but only the front card actually
      //                               listens to pointer events for drag.
      // Earlier I had drag={isFront} (functionally similar) but matching
      // the source removes any ambiguity if framer-motion's behaviour
      // differs subtly between the two forms.
      drag={true}
      dragElastic={0.35}
      dragListener={isFront}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      transition={{ duration: 0.35 }}
      className={`absolute left-0 top-0 flex h-[450px] w-[350px] select-none flex-col items-center justify-center gap-5 rounded-2xl p-8 ${
        isFront ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      {/* Specialty tag — small uppercase cyan label */}
      {tag && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#00B5D6',
          }}
        >
          {tag}
        </div>
      )}

      {/* Avatar — gradient circle with initials (matches existing
          TestimonialsSection avatar styling exactly so site-wide identity
          stays consistent). */}
      <div
        aria-hidden="true"
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00B5D6 0%, #36C2DE 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          fontWeight: 700,
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(0, 181, 214, 0.35)',
          flexShrink: 0,
        }}
      >
        {initials}
      </div>

      {/* Quote — white text reads on cyan-tint glass over the home-page
          immersive video background. Using literal '#fff' (not a gray
          CSS var) so the home-immersive global color-overrides don't
          affect it. */}
      <blockquote
        style={{
          margin: 0,
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: 15,
          lineHeight: 1.55,
          color: '#ffffff',
          fontStyle: 'italic',
          fontWeight: 300,
        }}
      >
        &ldquo;{testimonial}&rdquo;
      </blockquote>

      {/* Attribution */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', fontFamily: 'var(--font-display)' }}>
          {author}
        </div>
        {role && (
          <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
            {role}
          </div>
        )}
      </div>
    </motion.div>
  )
}
