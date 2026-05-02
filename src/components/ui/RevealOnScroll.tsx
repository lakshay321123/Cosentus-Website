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
 * Mobile fix (May 2026): on small viewports the previous IntersectionObserver
 * config (`rootMargin: '0px 0px -100px 0px'` + initial `translateY(50px)`)
 * created a ~150px dead-zone per heading where the element was past the layout
 * trigger but still invisible. Result on mobile: headings appeared to "stay
 * hidden" briefly, then pop in late. On slow scroll it looked like the
 * heading was tucked under the previous section.
 *
 * Three changes:
 *   1. Mobile uses rootMargin 0 (desktop keeps -100 for the staggered feel).
 *   2. If the element is already in the viewport at mount (top-of-page render
 *      or page navigation), fire reveal immediately — don't wait for a scroll
 *      event that may never come.
 *   3. Smaller initial translateY on mobile (handled in globals.css).
 */
export default function RevealOnScroll({ children, className = '', delay = 0, direction = 'up' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

    // Fire immediately if the element is already on screen at mount —
    // covers above-the-fold content and back-button navigation.
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
      {
        threshold: 0.15,
        // Mobile: trigger as soon as element enters viewport.
        // Desktop: keep the -100px margin for the established staggered feel.
        rootMargin: isMobile ? '0px' : '0px 0px -100px 0px',
      }
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
