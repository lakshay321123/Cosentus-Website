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
 * Two complementary changes solve it without pre-loading content (which
 * defeats the "section-by-section as you scroll" feel):
 *
 * Mobile (≤768px):
 *   - threshold: 0 — any single pixel of overlap fires the reveal
 *   - rootMargin: '0px' — fire EXACTLY when the element enters the
 *     viewport, not before. (We don't pre-trigger, because that would
 *     cause sections to be already-revealed when the user reaches them,
 *     killing the cascade.)
 *   - No translateY/translateX (handled in globals.css @media block) —
 *     transform-based motion creates "drop in mid-scroll" perception
 *     and is the actual source of the dead-zone bug. Opacity + blur
 *     clearing animates in place with no layout shift.
 *   - Mid-length transition (0.55s) so the reveal is perceptible while
 *     scrolling but completes before the next section's reveal starts.
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
            // Mobile: fire as soon as the first pixel of the element
            // enters the viewport. NOT before — pre-firing meant sections
            // were revealed before the user scrolled to them, defeating
            // the staggered "load one section at a time" feel.
            threshold: 0,
            rootMargin: '0px',
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
