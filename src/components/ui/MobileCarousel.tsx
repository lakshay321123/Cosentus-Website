'use client'

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react'

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
  const touchStartX = useRef(0)
  const touchDeltaX = useRef(0)
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

  useEffect(() => {
    if (isMobile) startAuto()
    return () => stopAuto()
  }, [isMobile, startAuto, stopAuto])

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
    <div className={`mobile-carousel ${className}`}>
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
        }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className="mobile-carousel-slide"
            style={{
              minWidth: '100%',
              flexShrink: 0,
              padding: '0 4px',
              boxSizing: 'border-box',
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
