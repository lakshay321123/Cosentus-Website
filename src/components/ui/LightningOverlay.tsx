'use client'

/**
 * LightningOverlay — scroll-triggered lightning flash layer.
 *
 * Wraps the Lightning canvas with a JS driver that ramps
 * flashIntensity on each scroll event. Each event pushes the
 * intensity to peak (1) and then decays exponentially toward 0
 * over ~700ms. Multiple events stack — fast scrolling produces
 * a sustained brighter burst, slow scrolling produces discrete
 * flashes.
 *
 * Why this lives in its own component (and not inline in PageHero):
 *   PageHero is rendered as a server component. Scroll listeners
 *   and useState require client boundary. Splitting out the
 *   trigger keeps the rest of PageHero server-rendered.
 *
 * Performance:
 *   - Single rAF loop while a flash is active. Stops scheduling
 *     when intensity has decayed to ~0.
 *   - Scroll listener is passive and lightweight (just bumps a
 *     ref). The rAF loop reads from the ref and updates state.
 *   - Lightning component itself pauses when offscreen via its
 *     internal IntersectionObserver.
 *
 * Trigger sources covered:
 *   - wheel events (mouse / trackpad)
 *   - touchmove (mobile scroll drag)
 *   - keydown for scroll keys (space, pagedown, arrows, home, end)
 *   So keyboard users get the same effect as wheel users.
 */

import { useEffect, useRef, useState } from 'react'
import Lightning from '@/components/ui/Lightning'

interface LightningOverlayProps {
  /** Hue 0–360. Default 220 (blue). */
  hue?: number
  /** 0–1. Default 0 (white). */
  saturation?: number
  /** Decay time constant in ms — how long a single flash lasts. */
  decayMs?: number
  /** Brightness multiplier. Default 1.2 — slightly hotter than the
   *  Lightning component's default to compensate for low saturation
   *  (white needs more punch to be visible against dark blue). */
  intensity?: number
  /** Bolt thinness. */
  size?: number
}

export default function LightningOverlay({
  hue = 220,
  saturation = 0,
  decayMs = 700,
  intensity = 1.2,
  size = 2,
}: LightningOverlayProps) {
  // The displayed intensity that feeds into the Lightning prop.
  const [flash, setFlash] = useState(0)
  // Refs to drive the rAF decay loop without re-entry.
  const targetRef = useRef(0) // Most recent peak value (1 on scroll)
  const valueRef = useRef(0) // Currently-displayed value
  const rafRef = useRef<number | null>(null)
  const lastScrollAtRef = useRef(0)

  useEffect(() => {
    // Decay rate per ms — chosen so the value falls from 1 to ~0.05
    // over `decayMs`. Standard exponential: factor^decayMs = 0.05
    // → factor = 0.05^(1/decayMs).
    const decayPerMs = Math.pow(0.05, 1 / decayMs)

    let lastTickAt = performance.now()

    function tick() {
      const now = performance.now()
      const dt = now - lastTickAt
      lastTickAt = now

      // Decay current value toward 0. If a recent scroll boosted
      // target above value, snap up first.
      if (targetRef.current > valueRef.current) {
        valueRef.current = targetRef.current
      }
      valueRef.current *= Math.pow(decayPerMs, dt)
      // Once fully decayed, stop scheduling frames.
      if (valueRef.current < 0.01) {
        valueRef.current = 0
        targetRef.current = 0
        setFlash(0)
        rafRef.current = null
        return
      }
      setFlash(valueRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }

    function pulse() {
      // Throttle: same-frame scroll bursts shouldn't repeatedly
      // boost. Allow at most one boost per 60ms.
      const now = performance.now()
      if (now - lastScrollAtRef.current < 60) return
      lastScrollAtRef.current = now
      targetRef.current = 1
      // Kick the rAF loop if it's idle.
      if (rafRef.current === null) {
        lastTickAt = performance.now()
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    function onWheel() {
      pulse()
    }
    function onTouchMove() {
      pulse()
    }
    function onKeyDown(e: KeyboardEvent) {
      // Only scroll-affecting keys trigger flashes.
      const scrollKeys = [
        ' ',
        'Spacebar',
        'PageDown',
        'PageUp',
        'ArrowDown',
        'ArrowUp',
        'Home',
        'End',
      ]
      if (scrollKeys.includes(e.key)) {
        // Skip if focus is in an editable element.
        const target = e.target as HTMLElement | null
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable)
        ) {
          return
        }
        pulse()
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKeyDown)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [decayMs])

  return (
    <Lightning
      hue={hue}
      saturation={saturation}
      intensity={intensity}
      size={size}
      speed={1.6}
      flashIntensity={flash}
    />
  )
}
