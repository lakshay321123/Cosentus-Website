'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'scale' | 'flag'
}

/**
 * RevealOnScroll
 *
 * Mobile fix (May 2026, v2): the original observer config
 * (`threshold: 0.15` + `rootMargin: '0px 0px -100px 0px'` + initial
 * `translateY(50px) blur(4px)`) created a ~150px dead-zone per heading
 * on mobile where the element had crossed the layout boundary but was
 * still invisible. Slow scroll exposed this as "headings hidden between
 * sections, then popping in late".
 *
 * v2 strategy: animations should START before the element is even visible,
 * so by the time the user's eye reaches it, the animation is complete or
 * almost complete. No more catching the mid-state.
 *
 * Mobile (≤768px):
 *   - threshold: 0 — any single pixel of overlap fires the reveal
 *   - rootMargin: '0px 0px 120px 0px' — POSITIVE bottom margin extends the
 *     trigger area 120px BELOW the viewport, so reveal fires while element
 *     is still off-screen, just below the fold
 *   - No translateY/translateX (handled in globals.css @media block) —
 *     transform-based motion creates "drop in mid-scroll" perception;
 *     opacity + blur clearing animates in place with no layout shift
 *   - Shorter transition duration (0.45s vs 0.9–1.0s on desktop) so
 *     the reveal completes quickly
 *
 * Desktop: rootMargin and threshold unchanged so the established
 * staggered above-the-fold cadence is preserved.
 *
 * Mount-time viewport check (both viewports): if the element is already
 * on screen when its observer attaches (above-the-fold render or page
 * back-button navigation), fire reveal immediately instead of waiting for
 * a scroll event that may never come.
 */
export default function RevealOnScroll({ children, className = '', delay = 0, direction = 'up' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

    // Mount-time check — element already visible? Reveal now, no observer.
    const rect = el.getBoundingClientRect()
    const vh = typeof window !== 'undefined' ? window.innerHeight : 0
    if (rect.top < vh && rect.bottom > 0) {
      el.classList.add('visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      isMobile
        ? {
            // Mobile: pre-trigger 120px before the element actually enters.
            // By the time user can see the element, animation is already done.
            threshold: 0,
            rootMargin: '0px 0px 120px 0px',
          }
        : {
            // Desktop: keep the original staggered feel.
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px',
          },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const baseClass = direction === 'left' ? 'reveal-left'
    : direction === 'right' ? 'reveal-right'
    : direction === 'scale' ? 'reveal-scale'
    : direction === 'flag' ? 'reveal-flag'
    : 'reveal'

  return (
    <div
      ref={ref}
      className={`${baseClass} ${className}`}
      style={delay > 0 ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  )
}
