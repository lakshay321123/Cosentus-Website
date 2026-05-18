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
 * The fan stack:
 *   front  -> rotate -6deg, x 0%   (visible, draggable)
 *   middle -> rotate  0deg, x 33%  (visible)
 *   back   -> rotate  6deg, x 66%  (visible, furthest)
 *   hidden -> same as back but opacity 0 and zIndex below back
 *
 * The "hidden" position lets the parent rotate through 4+ testimonials
 * while only 3 are visible at once; hidden cards sit behind 'back' and
 * fade in when their turn comes up.
 *
 * Drag interaction:
 *   - Only the front card is draggable (dragListener bound to isFront).
 *   - dragConstraints clamps the visual drag to origin (elastic feel).
 *   - On release, if the user dragged left > 150px, fire onShuffleAdvance.
 */

export type CardPosition = 'front' | 'middle' | 'back' | 'hidden'

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
  /** Current position in the fan stack. */
  position: CardPosition
  /** True iff this card is currently the front card (controls drag + cursor). */
  isFront: boolean
  /** Fired when the user drags the front card left past the threshold. */
  onShuffleAdvance: () => void
}

const POSITION_CONFIG: Record<CardPosition, { rotate: string; x: string; opacity: number; zIndex: number }> = {
  front:  { rotate: '-6deg', x: '0%',  opacity: 1, zIndex: 4 },
  middle: { rotate: '0deg',  x: '33%', opacity: 1, zIndex: 3 },
  back:   { rotate: '6deg',  x: '66%', opacity: 1, zIndex: 2 },
  hidden: { rotate: '6deg',  x: '66%', opacity: 0, zIndex: 1 },
}

const DRAG_THRESHOLD_PX = 150

export default function TestimonialCard({
  testimonial,
  author,
  role,
  tag,
  initials,
  position,
  isFront,
  onShuffleAdvance,
}: TestimonialCardProps) {
  const cfg = POSITION_CONFIG[position]

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
        zIndex: cfg.zIndex,
        // Glass surface — cyan tint matches the existing .t-arrow buttons
        // (rgba(0,181,214,0.18)) but lighter at 0.12 to read cleanly at
        // card scale. The inset highlights + outer glow are the
        // signature 'liquid glass' feel from the same component.
        background: 'rgba(0, 181, 214, 0.12)',
        border: '1px solid rgba(0, 181, 214, 0.35)',
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        boxShadow:
          'inset 0 1px 0 rgba(255, 255, 255, 0.45), ' +
          'inset 0 -1px 0 rgba(0, 80, 100, 0.18), ' +
          '0 20px 60px rgba(0, 181, 214, 0.22)',
      }}
      animate={{ rotate: cfg.rotate, x: cfg.x, opacity: cfg.opacity }}
      drag={isFront}
      dragElastic={0.35}
      dragListener={isFront}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      transition={{ duration: 0.35 }}
      className={`absolute left-0 top-0 flex h-[450px] w-[350px] select-none flex-col items-center justify-center gap-5 rounded-2xl p-8 ${
        isFront ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
      // pointer-events-none on non-front cards so clicks don't accidentally
      // target middle/back cards (which can't be dragged anyway). The front
      // card retains pointer events for drag.
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
