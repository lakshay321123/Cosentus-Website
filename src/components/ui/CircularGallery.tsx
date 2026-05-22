'use client'

/**
 * CircularGallery
 *
 * 3D-perspective rotating gallery of clickable card tiles. Adapted
 * from the 21st.dev `circular-gallery` reference component supplied
 * by the user — heavily modified for this repo's needs:
 *
 *   - Scroll-driven rotation REMOVED. Per user direction:
 *     "Use the 21st.dev visual style (3D perspective rotated cards)
 *      but auto-rotate only, no sticky scroll — keep the section
 *      a normal height."
 *     The original component made the whole gallery rotate as the
 *     user scrolled the page (sticky 500vh container). Replaced
 *     with a simple requestAnimationFrame auto-rotate.
 *
 *   - Each card is a Next.js <Link> wrapping a route href, so the
 *     entire tile is clickable. Original demo just rendered
 *     non-interactive image tiles.
 *
 *   - Removed shadcn Tailwind theme classes (text-primary-foreground,
 *     bg-card/30, dark:bg-card/30, border-border). This repo does
 *     NOT use shadcn theme tokens — those classes would either
 *     have no effect or pick up unintended global Tailwind config.
 *     Replaced with inline styles + repo-local classes.
 *
 *   - Card body uses the home glass recipe (rgba(255,255,255,0.20)
 *     wash + 1.5px / 50% white outline + backdrop-filter blur). Same
 *     recipe as the hero ladder cards, footer, testimonial fan-stack
 *     etc. — keeps the home page visually unified.
 *
 *   - Pauses auto-rotation on hover so users can read the card they
 *     hover over. Resumes on mouseleave.
 *
 * Layout note:
 *   The gallery sits inside a normal section height (not sticky).
 *   We render this at ~800px tall (controlled by the consumer).
 *   The 3D perspective wrap requires `perspective` on the outer
 *   container; cards are positioned via translateZ(radius) around
 *   the Y axis.
 */

import { useEffect, useRef, useState, HTMLAttributes } from 'react'
import Link from 'next/link'

export interface CircularGalleryItem {
  /** Display title (e.g. "Anesthesia"). */
  title: string
  /** Short description shown below the title in the card overlay. */
  blurb: string
  /** Route the card links to when clicked. */
  href: string
  /** Photo URL — used as the card's background image. */
  photoUrl: string
  /** Optional CSS object-position for the photo (default 'center'). */
  photoPos?: string
  /** Alt text for the photo. */
  photoAlt: string
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: CircularGalleryItem[]
  /** Distance of each card from the center axis. Larger = wider
   *  gallery, more space between adjacent cards. Default 600. */
  radius?: number
  /** Degrees per animation frame the gallery rotates. 0.02 = slow
   *  drift; 0.1 = noticeably moving. Default 0.04. */
  autoRotateSpeed?: number
  /** When true, the gallery pauses rotation. Used so the consumer
   *  can pause externally (e.g. while a modal is open). Internal
   *  hover-pause is automatic and not controlled by this prop. */
  paused?: boolean
}

export default function CircularGallery({
  items,
  radius = 600,
  autoRotateSpeed = 0.04,
  paused = false,
  className,
  style,
  ...rest
}: CircularGalleryProps) {
  // Rotation in degrees. Kept in a ref (not state) so the rAF loop
  // doesn't trigger a React re-render every frame — we mutate the
  // ref then write it to the DOM element's transform directly.
  const rotationRef = useRef(0)
  // Whether the user is currently hovering the gallery — pauses
  // rotation so they can read the card they're looking at.
  const [isHovering, setIsHovering] = useState(false)
  // Track mount state so we don't write to a torn-down DOM in
  // edge cases (rAF can fire after unmount on slow devices).
  const isMountedRef = useRef(true)
  // The inner rotating div — we mutate its style.transform each frame.
  const rotatorRef = useRef<HTMLDivElement | null>(null)
  // Honour prefers-reduced-motion — no rotation, all cards visible.
  const [reducedMotion, setReducedMotion] = useState(false)

  // Detect reduced-motion once on mount.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
  }, [])

  // Auto-rotate loop. Mutates the DOM directly to avoid 60Hz React
  // re-renders. Pauses if hovering, externally paused, or
  // reduced-motion is active.
  useEffect(() => {
    isMountedRef.current = true
    let frame: number

    function tick() {
      if (!isMountedRef.current) return
      if (!isHovering && !paused && !reducedMotion) {
        rotationRef.current += autoRotateSpeed
        if (rotatorRef.current) {
          rotatorRef.current.style.transform = `rotateY(${rotationRef.current}deg)`
        }
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      isMountedRef.current = false
      cancelAnimationFrame(frame)
    }
  }, [isHovering, paused, reducedMotion, autoRotateSpeed])

  // Angle each item sits at around the circle. With 6 items, every
  // 60deg; the rotator + radius positions them at fixed slots and
  // we rotate the parent to spin the whole ring.
  const anglePerItem = items.length > 0 ? 360 / items.length : 0

  return (
    <div
      role="region"
      aria-label="Specialty gallery"
      className={`cg-root ${className ?? ''}`}
      style={{
        // Perspective is what gives the cards depth as they rotate
        // around the Y axis. Higher = more subtle 3D, lower = more
        // dramatic warp. 2000px is the 21st.dev default and reads
        // well at the section's ~640-880px display width.
        perspective: '2000px',
        ...style,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...rest}
    >
      <div
        ref={rotatorRef}
        className="cg-rotator"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {items.map((item, i) => {
          const itemAngle = i * anglePerItem
          return (
            <Link
              key={item.href}
              href={item.href}
              className="cg-card"
              aria-label={item.title}
              style={{
                // Each card is positioned at its slot around the
                // circle: rotated to face outward, then translated
                // out by `radius`. Together this places it on the
                // rim of an imaginary circle whose center is the
                // rotator's origin.
                transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
              }}
            >
              {/* Background photo. Using a plain <img> rather than
                  Next.js <Image> because Image's required width/
                  height props don't play well with the absolutely-
                  positioned 3D-transformed parents, and we'd need
                  to bypass the optimization layer for Unsplash URLs
                  anyway. */}
              <img
                src={item.photoUrl}
                alt={item.photoAlt}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: item.photoPos ?? 'center',
                  /* Slight desaturation + darken on the image
                     itself so the white text overlay reads on any
                     photo. The bottom gradient (below) handles the
                     bottom portion; this filter just keeps the
                     full image from being too punchy. */
                  filter: 'saturate(0.85)',
                }}
                loading="lazy"
              />
              {/* Bottom-to-top dark gradient — keeps title + blurb
                  readable regardless of what's behind. */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.20) 55%, rgba(0, 0, 0, 0) 80%)',
                }}
              />
              {/* Glass frame — sits on top of image as a thin
                  outline, giving the cards the unified home glass
                  treatment without overpowering the photo. Inset
                  shadow approach instead of border so it doesn't
                  shift layout. */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 12,
                  boxShadow: 'inset 0 0 0 1.5px rgba(255, 255, 255, 0.50)',
                  pointerEvents: 'none',
                }}
              />
              {/* Content overlay at the bottom — title + blurb +
                  Learn more affordance. */}
              <div className="cg-card-content">
                <h3 className="cg-card-title">{item.title}</h3>
                <p className="cg-card-blurb">{item.blurb}</p>
                <span className="cg-card-cta" aria-hidden="true">
                  Learn more
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ display: 'inline-block', verticalAlign: 'middle' }}
                  >
                    <path
                      d="M3 7h8m0 0L7 3m4 4l-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      <style>{`
        .cg-root {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cg-rotator {
          position: relative;
          width: 100%;
          height: 100%;
          /* Avoid sub-pixel rendering during rotation. */
          will-change: transform;
        }
        .cg-card {
          /* 300x420 vertical rectangle per user direction
             "Rectangular vertical boxes". The 21st.dev reference
             used 300x400; we go slightly taller to give the title
             + blurb + CTA room without crowding the photo. */
          position: absolute;
          width: 300px;
          height: 420px;
          left: 50%;
          top: 50%;
          margin-left: -150px;
          margin-top: -210px;
          border-radius: 12px;
          overflow: hidden;
          text-decoration: none;
          color: #fff;
          /* GPU compositing for smooth 3D rotation. */
          backface-visibility: hidden;
          /* Backdrop blur picks up the home immersive video bg
             behind the cards. */
          backdrop-filter: blur(8px) saturate(120%);
          -webkit-backdrop-filter: blur(8px) saturate(120%);
          /* Outer shadow to lift cards off the dark bg. */
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.40);
          transition: transform 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
                      box-shadow 280ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .cg-card:focus-visible {
          outline: 2px solid #00B5D6;
          outline-offset: 4px;
        }
        .cg-card:hover {
          /* Subtle lift on hover. Avoiding scale because that
             would conflict with the 3D rotation transform applied
             inline (transform: rotateY + translateZ). Box-shadow
             change reads as "tile slightly raised". */
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.55);
        }
        .cg-card-content {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 22px 22px 20px;
          z-index: 1;
        }
        .cg-card-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.005em;
          margin: 0 0 8px;
          color: #fff;
        }
        .cg-card-blurb {
          font-size: 13.5px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.85);
          margin: 0 0 14px;
        }
        .cg-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #00B5D6;
        }
      `}</style>
    </div>
  )
}
