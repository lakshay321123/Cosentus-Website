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
// Opacity fade from front to back. Reduced from 0.70 to 0.35 at back
// because the new lighter glass surface (30% white wash) means a
// 0.70 back card would still show through enough to bleed text from
// the front card and feel busy. 0.35 at back keeps depth cues but
// pushes background cards much further visually.
const OPACITY_FRONT = 1
const OPACITY_BACK = 0.35
// Blur fade — front is sharp, back is heavily blurred. The back cards
// are intentionally unreadable; their job is to suggest "there are
// more testimonials here" via a stack of out-of-focus glass shapes.
// The front card stays crisp at 0px.
const BLUR_FRONT_PX = 0
const BLUR_BACK_PX = 6

const DRAG_THRESHOLD_PX = 150

export default function TestimonialCard({
  testimonial,
  author,
  role,
  tag,
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
  const cardBlurPx = BLUR_FRONT_PX + progress * (BLUR_BACK_PX - BLUR_FRONT_PX)
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
        // GLASS-SQUARE RECIPE — matches glass_square.svg supplied by
        // user. Applied to ALL cards in the fan for a cohesive look;
        // back-card readability is handled via opacity + filter blur
        // (see cardBlurPx above and `filter` below). Layers:
        //   1. 30% white wash interior  -> background
        //   2. 50% white outline ring   -> 1.5px border
        //   3. Top-left + bottom-right diagonal sparkles
        //                               -> ::before/::after on .tcard-front
        // Sparkles only render on the FRONT card (.tcard-front in the
        // <style> block below) so the stack doesn't have 5 cards' worth
        // of overlapping highlights fighting each other.
        background: 'rgba(255, 255, 255, 0.20)',
        border: '1.5px solid rgba(255, 255, 255, 0.50)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        boxShadow: '0 20px 60px rgba(0, 181, 214, 0.25)',
        // Filter blur fades from sharp (front) to soft (back). This is
        // distinct from backdrop-filter above which blurs the bg behind
        // the card; `filter` here blurs the card itself, making non-front
        // cards visually recede.
        filter: cardBlurPx > 0 ? `blur(${cardBlurPx}px)` : undefined,
        // Pseudo-elements (sparkles) need a positioning context and
        // clipping. The motion.div has tailwind `absolute` in className
        // (sets position:absolute), which is the positioning context.
        // overflow:hidden ensures the diagonal sparkles clip to the
        // card's rounded corners.
        overflow: 'hidden',
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
      drag={true}
      dragElastic={0.35}
      dragListener={isFront}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      transition={{ duration: 0.35 }}
      className={`tcard ${isFront ? 'tcard-front' : 'tcard-back'} absolute left-0 top-0 flex h-[450px] w-[350px] select-none flex-col items-center justify-center gap-5 rounded-2xl p-8 ${
        isFront ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      {/* Specialty tag — uppercase eyebrow above the quote */}
      {tag && (
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#0a2d41',
          }}
        >
          {tag}
        </div>
      )}

      {/* Avatar removed — design direction May 2026: the JF/initials
          circle and its cyan glow were distracting on the dark page
          background. With it gone the quote becomes the natural visual
          anchor and the in-card text was bumped up to fill the space. */}

      {/* Quote — dark navy text reads on the 30% white glass wash.
          Previously white text was used because the card surface was
          a dark teal-navy gradient; with the new glass-square recipe
          (lighter wash) the text needs to flip to dark. Every card
          cycles through being the front, so all cards get dark text
          (not just stackIndex 0). */}
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
        &ldquo;{testimonial}&rdquo;
      </blockquote>

      {/* Attribution */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#0a2d41', fontFamily: 'var(--font-display)' }}>
          {author}
        </div>
        {role && (
          <div style={{ fontSize: 14, color: 'rgba(10, 45, 65, 0.70)', textAlign: 'center' }}>
            {role}
          </div>
        )}
      </div>
    </motion.div>
  )
}
