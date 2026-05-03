'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * CO-animation: the brand's "CO-SENT-US ~ Together we Conquer" mark from
 * cosentus.com. Two large open letterforms — a C (broken ring with a
 * mouth) on the left and a concentric O (outer ring + inner ring) on
 * the right — each draws itself with a stroke-dashoffset animation
 * when scrolled into view, then the inner text fades up.
 *
 * Why we rebuilt it as SVG rather than animating the white webp from
 * cosentus.com:
 *   - The webp is a 1201x670 raster — recoloring it for a white page
 *     background means recreating the stroke vector anyway
 *   - SVG lets the stroke "draw" from start to end via stroke-dashoffset
 *   - SVG is sharp at every viewport
 *   - One file, no asset coordination
 *
 * Trigger: an IntersectionObserver fires once when the SVG enters the
 * viewport (>=15% visible). After that, hasPlayed stays true and the
 * animation does not replay on scroll-back. Re-triggering felt cheap
 * in testing.
 *
 * Sizing: scales to its container width via 100% on the SVG and a
 * preserveAspectRatio default. The viewBox is wide (1200x520) so the
 * two letters sit side-by-side horizontally; on narrow viewports it
 * shrinks to fit and the inner labels stay readable down to ~360px
 * page width.
 *
 * Default colors lean teal (#00B5D6) per brand. Pass `dark` to swap
 * to white-on-transparent for use over a dark teal panel — preserved
 * as an option even though the About page uses the default light look.
 */
export default function CoAnimation({ dark = false }: { dark?: boolean }) {
  const ref = useRef<SVGSVGElement | null>(null)
  const [hasPlayed, setHasPlayed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || hasPlayed) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasPlayed(true)
            obs.disconnect()
            break
          }
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasPlayed])

  const stroke = dark ? '#FFFFFF' : '#00B5D6'
  const innerText = dark ? '#FFFFFF' : 'var(--gray-900)'
  const subText = dark ? 'rgba(255,255,255,0.85)' : 'var(--gray-700)'

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <svg
        ref={ref}
        viewBox="0 0 1200 520"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          maxWidth: 1100,
          height: 'auto',
          display: 'block',
        }}
        aria-label="CO — Collaborate, Coordinate, Cooperate. Coexpand."
        role="img"
      >
        {/* C — broken ring, opening on the right */}
        <path
          d="M 360 60
             A 200 200 0 1 0 360 460
             M 360 460
             L 360 360
             M 360 60
             L 360 160"
          fill="none"
          stroke={stroke}
          strokeWidth={18}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 1500,
            strokeDashoffset: hasPlayed ? 0 : 1500,
            transition: 'stroke-dashoffset 1.6s cubic-bezier(0.65, 0, 0.35, 1)',
          }}
        />

        {/* O outer ring */}
        <circle
          cx={860}
          cy={260}
          r={210}
          fill="none"
          stroke={stroke}
          strokeWidth={18}
          style={{
            strokeDasharray: 1320,
            strokeDashoffset: hasPlayed ? 0 : 1320,
            transition: 'stroke-dashoffset 1.6s cubic-bezier(0.65, 0, 0.35, 1) 0.2s',
          }}
        />
        {/* O inner ring */}
        <circle
          cx={860}
          cy={260}
          r={130}
          fill="none"
          stroke={stroke}
          strokeWidth={14}
          style={{
            strokeDasharray: 820,
            strokeDashoffset: hasPlayed ? 0 : 820,
            transition: 'stroke-dashoffset 1.4s cubic-bezier(0.65, 0, 0.35, 1) 0.5s',
          }}
        />

        {/* Inside-the-C text: collaborate / coordinate / cooperate.
            Fades + slides up after the strokes have started drawing. */}
        <g
          style={{
            opacity: hasPlayed ? 1 : 0,
            transform: hasPlayed ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.6s ease 1.0s, transform 0.6s ease 1.0s',
            transformOrigin: 'center',
          }}
        >
          <text x={295} y={210} textAnchor="middle" fontFamily="var(--font-display)" fontSize={28} fontWeight={500} fill={innerText} letterSpacing="0.02em">collaborate</text>
          <text x={295} y={258} textAnchor="middle" fontFamily="var(--font-display)" fontSize={28} fontWeight={500} fill={innerText} letterSpacing="0.02em">+</text>
          <text x={295} y={306} textAnchor="middle" fontFamily="var(--font-display)" fontSize={28} fontWeight={500} fill={innerText} letterSpacing="0.02em">coordinate</text>
          <text x={295} y={354} textAnchor="middle" fontFamily="var(--font-display)" fontSize={28} fontWeight={500} fill={innerText} letterSpacing="0.02em">+</text>
          <text x={295} y={402} textAnchor="middle" fontFamily="var(--font-display)" fontSize={28} fontWeight={500} fill={innerText} letterSpacing="0.02em">cooperate</text>
        </g>

        {/* Inside-the-O text: = coexpand. Fades in slightly later. */}
        <g
          style={{
            opacity: hasPlayed ? 1 : 0,
            transform: hasPlayed ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.6s ease 1.3s, transform 0.6s ease 1.3s',
          }}
        >
          <text x={860} y={272} textAnchor="middle" fontFamily="var(--font-display)" fontSize={32} fontWeight={600} fill={innerText} letterSpacing="0.01em">= coexpand</text>
        </g>

        {/* Subhead "Together we Conquer" sits below the letterforms. */}
        <g
          style={{
            opacity: hasPlayed ? 1 : 0,
            transition: 'opacity 0.7s ease 1.6s',
          }}
        >
          <text x={600} y={500} textAnchor="middle" fontFamily="var(--font-display)" fontSize={22} fontWeight={500} fill={subText} letterSpacing="0.04em">CO-SENT-US ~ Together we Conquer</text>
        </g>
      </svg>
    </div>
  )
}
