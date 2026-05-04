'use client'

import React, { useEffect, useRef, ReactNode, ElementType, CSSProperties } from 'react'

interface RevealTextProps {
  /**
   * The content to reveal word-by-word. Can be:
   *   - a plain string ("Beyond Billing")
   *   - JSX with <br /> ("Line one<br />Line two")
   *   - JSX with styled wrappers (<>RCM that <span>thinks.</span></>)
   *
   * For styled wrappers like <span>: the wrapper is preserved (its props
   * pass through), and each word inside it is animated as part of the
   * shared cascade. So a single highlighted word like <span>thinks.</span>
   * stays styled and joins the same word-delay sequence as everything else.
   */
  children: ReactNode
  /** HTML tag to render. Defaults to span. Pass 'h1', 'h2', 'p' as needed. */
  as?: ElementType
  /** Class added to the wrapping element. */
  className?: string
  /**
   * Seconds between consecutive word starts. 0.06–0.07 feels alive without
   * dragging on long titles. Drop to 0.04 for tight, bump to 0.10 for
   * deliberate / dramatic.
   */
  perWordDelay?: number
  /** Additional delay (s) before the first word starts. Stacks with perWordDelay. */
  baseDelay?: number
  /** Inline style on the wrapper. */
  style?: CSSProperties
}

/**
 * Internal flat unit emitted by walking React children. Each word becomes
 * one Unit, optionally tagged with a `wrap` element it should be cloned
 * inside (preserves <span> styling, <em>, etc.). <br /> passes through
 * as its own unit.
 */
type Unit =
  | { kind: 'word'; text: string; wrap?: React.ReactElement }
  | { kind: 'br' }

/**
 * Walk a React node tree and emit a flat array of Units. Recurses into
 * styled inline elements (anything that's not a <br />) so words inside
 * <span>/<em>/<strong> become part of the same cascade as surrounding
 * text.
 *
 * Implementation note: when an inline wrapper contains multiple words,
 * each word emits its own clone of the wrapper. For single-word
 * highlights (the common case in this codebase) this is fine and
 * preserves all wrapper props.
 */
function walk(node: ReactNode, units: Unit[]): void {
  React.Children.forEach(node, (child) => {
    if (child === null || child === undefined || typeof child === 'boolean') return
    if (typeof child === 'string') {
      // Split on whitespace, drop empties. Each non-empty token becomes
      // a word unit.
      child.split(/\s+/).forEach((w) => {
        if (w.length > 0) units.push({ kind: 'word', text: w })
      })
      return
    }
    if (typeof child === 'number') {
      units.push({ kind: 'word', text: String(child) })
      return
    }
    if (React.isValidElement(child)) {
      if (child.type === 'br') {
        units.push({ kind: 'br' })
        return
      }
      // Recurse into the element's children. Each word found inside is
      // tagged with this element as its `wrap` so the rendered output
      // re-clones the wrapper around the word span (preserving styling).
      const innerUnits: Unit[] = []
      const props = child.props as { children?: ReactNode }
      walk(props?.children, innerUnits)
      innerUnits.forEach((u) => {
        if (u.kind === 'word') {
          // If the inner word already has a wrap (nested styled elements),
          // we keep the innermost one — outer wrapping is dropped to keep
          // rendering shallow. The codebase doesn't use nested styling on
          // titles, so this simplification is safe.
          units.push({ kind: 'word', text: u.text, wrap: u.wrap ?? child })
        } else {
          units.push(u)
        }
      })
    }
  })
}

/**
 * RevealText — splits children into per-word inline-block spans that
 * cascade in as the element enters the viewport.
 *
 * Each word fades up + un-blurs with a stagger. Trigger logic mirrors
 * RevealOnScroll exactly:
 *   - Mobile: threshold 0, rootMargin '0px' — fires at viewport edge
 *   - Desktop: threshold 0.15, rootMargin '0px 0px -100px 0px' — original
 *     above-the-fold cadence
 *   - Both: mount-time check fires immediately if already in view
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

    const isMobile =
      typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

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

  // Flatten children into Units.
  const units: Unit[] = []
  walk(children, units)

  // Find the index of the last word so it can be rendered without a
  // trailing non-break space (avoid stray space before punctuation/EOL).
  let lastWordIndex = -1
  for (let i = units.length - 1; i >= 0; i--) {
    if (units[i].kind === 'word') { lastWordIndex = i; break }
  }

  let wordCounter = 0

  const rendered = units.map((u, idx) => {
    if (u.kind === 'br') {
      return <br key={`br-${idx}`} />
    }
    // u.kind === 'word'
    const delay = baseDelay + wordCounter * perWordDelay
    wordCounter++
    const isLast = idx === lastWordIndex
    const trailing = isLast ? '' : '\u00A0'
    const wordSpan = (
      <span
        key={`w-${idx}`}
        className="reveal-text-word"
        style={{ ['--word-delay' as never]: `${delay}s` }}
      >
        {u.text}
        {trailing}
      </span>
    )
    if (u.wrap) {
      // Re-clone the wrapper element so its styling (color, font-style,
      // etc.) is preserved around the cascading word span.
      return React.cloneElement(u.wrap, { key: `wrap-${idx}` }, wordSpan)
    }
    return wordSpan
  })

  return (
    <Tag ref={ref as never} className={`reveal-text ${className}`.trim()} style={style}>
      {rendered}
    </Tag>
  )
}
