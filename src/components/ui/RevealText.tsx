'use client'

import { useEffect, useRef, ReactNode, ElementType, CSSProperties } from 'react'

interface RevealTextProps {
  /** The text to reveal word-by-word. Must be a plain string for splitting. */
  children: string
  /** HTML tag to render. Defaults to span — pass 'h1' / 'h2' / 'p' as needed. */
  as?: ElementType
  /** Class added to the wrapping element. */
  className?: string
  /**
   * Seconds between consecutive word starts. 0.06s feels alive without
   * dragging on long titles. Bump to 0.08–0.10 for slow/dramatic, drop
   * to 0.04 for short headings where you want it tight.
   */
  perWordDelay?: number
  /** Additional delay (s) before the first word starts. Stacks with perWordDelay. */
  baseDelay?: number
  /** Inline style on the wrapper. */
  style?: CSSProperties
}

/**
 * RevealText — splits a string into inline-block per-word spans and
 * cascades them in as the heading enters the viewport. Each word fades up
 * + un-blurs with a stagger driven by a CSS variable, so the text appears
 * to "type itself in" without actually being a typewriter effect.
 *
 * Usage (string title):
 *   <RevealText as="h1" className="hero-title">Beyond Billing.</RevealText>
 *
 * Limitations:
 *   - Children must be a plain string. JSX children won't split correctly.
 *   - For titles with mixed plain text + JSX (e.g. <em> highlights),
 *     fall back to the regular RevealOnScroll wrapper.
 *
 * Mobile/desktop trigger logic mirrors RevealOnScroll exactly so the
 * timing feels consistent with the rest of the site:
 *   - Mobile: threshold 0, rootMargin '0px' — fires at viewport edge
 *   - Desktop: threshold 0.15, rootMargin '0px 0px -100px 0px' — original
 *     above-the-fold staggered cadence
 *   - Both: mount-time check fires immediately if already in view (covers
 *     above-the-fold render and back-button navigation)
 */
export default function RevealText({
  children,
  as: Tag = 'span',
  className = '',
  perWordDelay = 0.06,
  baseDelay = 0,
  style,
}: RevealTextProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

    // Mount-time: already in view? Reveal immediately, skip the observer.
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
        ? { threshold: 0, rootMargin: '0px' }
        : { threshold: 0.15, rootMargin: '0px 0px -100px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Split on whitespace. Use the original word with a non-break space
  // appended (except on the last word) so the rendered output preserves
  // spacing without letting words wrap mid-word.
  const words = children.split(/\s+/).filter(Boolean)

  return (
    <Tag ref={ref as never} className={`reveal-text ${className}`.trim()} style={style}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="reveal-text-word"
          style={{ ['--word-delay' as never]: `${baseDelay + i * perWordDelay}s` }}
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  )
}
