'use client'

import { useState, useRef, useEffect, useLayoutEffect, useCallback, ReactNode } from 'react'

interface MobileCarouselProps {
  children: ReactNode[]
  autoScrollInterval?: number // ms, default 4000
  showDots?: boolean
  className?: string
  darkMode?: boolean // white dots for dark backgrounds
}

export default function MobileCarousel({
  children,
  autoScrollInterval = 4000,
  showDots = true,
  className = '',
  darkMode = false,
}: MobileCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  // hasEntered flips to true the first time the carousel enters the viewport on
  // mobile. Used to gate two things:
  //   1. The pop-in animation for the active slide (so the first card doesn't
  //      animate while still off-screen and the user misses it).
  //   2. Auto-rotation start, so the carousel doesn't burn through cards while
  //      the user hasn't scrolled to it yet.
  const [hasEntered, setHasEntered] = useState(false)
  const touchStartX = useRef(0)
  const touchDeltaX = useRef(0)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const total = children.length

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  // Auto-scroll
  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % total)
    }, autoScrollInterval)
  }, [total, autoScrollInterval])

  const stopAuto = useCallback(() => {
    if (autoRef.current) {
      clearInterval(autoRef.current)
      autoRef.current = null
    }
  }, [])

  // Auto-rotate only after the carousel has actually scrolled into view.
  // Prevents wasting card rotations the user can't see.
  useEffect(() => {
    if (isMobile && hasEntered) startAuto()
    return () => stopAuto()
  }, [isMobile, hasEntered, startAuto, stopAuto])

  // Detect first time the carousel reaches the viewport (mobile only).
  // 0.3 threshold = ~30% in view; conservative enough that we don't fire
  // before the user can see the pop animation.
  useEffect(() => {
    if (!isMobile || hasEntered) return
    const el = wrapperRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [isMobile, hasEntered])

  // Pop-in animation on the active slide. Runs:
  //   - on initial entry (hasEntered flips true with current=0)
  //   - every time the carousel rotates to a new card (current changes)
  // Effect: scale 0.88 -> 1, opacity 0 -> 1, blur 6px -> 0 over 600ms
  // with a slight overshoot (the 1.56 control point in the cubic-bezier)
  // for a punchy "spring landing" feel that reads as alive on mobile.
  // useLayoutEffect (not useEffect) so the keyframe[0] state is applied
  // before the browser paints — prevents a flash of the final state.
  useLayoutEffect(() => {
    if (!isMobile || !hasEntered) return
    const slides = containerRef.current?.querySelectorAll<HTMLElement>('.mobile-carousel-slide')
    if (!slides || !slides[current]) return
    const el = slides[current]

    // Respect user's reduced-motion preference: no animation, just show.
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      el.style.opacity = '1'
      return
    }

    const animation = el.animate(
      [
        { opacity: 0, transform: 'scale(0.88)', filter: 'blur(6px)' },
        { opacity: 1, transform: 'scale(1)', filter: 'blur(0)' },
      ],
      {
        duration: 600,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        fill: 'both',
      }
    )

    return () => {
      try { animation.cancel() } catch { /* element gone */ }
    }
  }, [current, isMobile, hasEntered])

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    stopAuto()
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current
  }

  const onTouchEnd = () => {
    const threshold = 50
    if (touchDeltaX.current > threshold) {
      // Swiped right — go prev
      setCurrent(prev => (prev - 1 + total) % total)
    } else if (touchDeltaX.current < -threshold) {
      // Swiped left — go next
      setCurrent(prev => (prev + 1) % total)
    }
    // Restart auto-scroll after 5s pause
    setTimeout(startAuto, 5000)
  }

  // On desktop, render children normally (no carousel)
  if (!isMobile) {
    return <>{children}</>
  }

  return (
    <div ref={wrapperRef} className={`mobile-carousel ${className}`} style={{ overflow: 'hidden', width: '100%', maxWidth: '100%' }}>
      <div
        ref={containerRef}
        className="mobile-carousel-track"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          display: 'flex',
          transition: 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
          transform: `translateX(-${current * 100}%)`,
          width: '100%',
        }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className="mobile-carousel-slide"
            style={{
              width: '100%',
              minWidth: '100%',
              maxWidth: '100%',
              flexShrink: 0,
              padding: '0 8px',
              boxSizing: 'border-box',
              overflow: 'hidden',
              // Hide the active slide before the pop animation has fired,
              // so the user doesn't briefly see a fully-visible card before
              // it shrinks and pops in. Inactive slides are translated off
              // screen anyway, so their opacity is moot.
              opacity: !hasEntered && current === i ? 0 : undefined,
            }}
          >
            {child}
          </div>
        ))}
      </div>

      {showDots && total > 1 && (
        <div className="mobile-carousel-dots">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrent(i)
                stopAuto()
                setTimeout(startAuto, 5000)
              }}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: current === i ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                background: current === i
                  ? (darkMode ? '#FFFFFF' : '#00B5D6')
                  : (darkMode ? 'rgba(255,255,255,0.3)' : '#CCCCCC'),
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
