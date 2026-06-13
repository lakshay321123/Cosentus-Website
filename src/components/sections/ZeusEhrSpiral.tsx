'use client'

/**
 * ZeusEhrSpiral — replacement for the Zeus orbit + lightning SVG in the
 * Multi-EHR section of /cosentus-ai, per user (Jun 2026).
 *
 * Visual: the "spiral animation" canvas the user supplied (white dots
 * swirling into a vortex on black), with the Zeus logo lockup fading in
 * at the center (where the source demo had its "Enter" button) and the
 * six EHR names + protocols fading in around it while the swirl plays.
 *
 * Adaptations from the supplied component (documented per source-fidelity
 * rule — the original is a shadcn/Tailwind/gsap snippet, this repo is
 * none of those):
 *   - gsap removed. Its only use was one infinite linear 15s tween
 *     driving `time` 0→1; a requestAnimationFrame loop does the same
 *     without adding a dependency.
 *   - Sizes from the CONTAINER (square, aspect-ratio 1) instead of
 *     window.innerWidth/innerHeight — this renders inside a grid cell,
 *     not fullscreen. Also fixes the source's SSR crash (window access
 *     in a useState initializer).
 *   - Tailwind classNames -> inline styles (repo convention).
 *   - The source's setupRandomGenerator() seeded-random path created
 *     the 5000 stars TWICE (once seeded, once not, ending with 10k
 *     stars and no determinism). Stars are created once here.
 *   - Everything is gated on the container entering the viewport
 *     (IntersectionObserver, fires once) so the swirl + label reveal
 *     play when the visitor actually arrives, not at page load.
 *   - prefers-reduced-motion: no looping animation; a single static
 *     frame is drawn and the logo + labels show immediately.
 */

import { useEffect, useRef, useState } from 'react'

// ---- math/animation core (from the supplied component) -------------------

class Vector2D {
  constructor(public x: number, public y: number) {}
}

class Vector3D {
  constructor(public x: number, public y: number, public z: number) {}
}

class AnimationController {
  private ctx: CanvasRenderingContext2D
  private size: number
  private stars: Star[] = []
  public time = 0

  private readonly changeEventTime = 0.32
  public readonly cameraZ = -400
  public readonly cameraTravelDistance = 3400
  private readonly startDotYOffset = 28
  public readonly viewZoom = 100
  private readonly numberOfStars = 5000
  private readonly trailLength = 80

  constructor(ctx: CanvasRenderingContext2D, size: number) {
    this.ctx = ctx
    this.size = size
    // EXACTLY as the supplied source: setupRandomGenerator() creates
    // the 5000 stars with a seeded RNG, then createStars() runs AGAIN
    // with the normal RNG — 10,000 stars total. An earlier pass
    // "fixed" this to a single 5000 batch; user rejected that (the
    // doubled density is part of the intended look). Do not change.
    this.setupRandomGenerator()
    this.createStars()
  }

  private setupRandomGenerator() {
    const originalRandom = Math.random
    const customRandom = () => {
      let seed = 1234
      return () => {
        seed = (seed * 9301 + 49297) % 233280
        return seed / 233280
      }
    }
    Math.random = customRandom()
    this.createStars()
    Math.random = originalRandom
  }

  private createStars() {
    for (let i = 0; i < this.numberOfStars; i++) {
      this.stars.push(new Star(this.cameraZ, this.cameraTravelDistance))
    }
  }

  public ease(p: number, g: number): number {
    if (p < 0.5) return 0.5 * Math.pow(2 * p, g)
    return 1 - 0.5 * Math.pow(2 * (1 - p), g)
  }

  public easeOutElastic(x: number): number {
    const c4 = (2 * Math.PI) / 4.5
    if (x <= 0) return 0
    if (x >= 1) return 1
    return Math.pow(2, -8 * x) * Math.sin((x * 8 - 0.75) * c4) + 1
  }

  public map(value: number, start1: number, stop1: number, start2: number, stop2: number): number {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
  }

  public constrain(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
  }

  public lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t
  }

  public spiralPath(p: number): Vector2D {
    p = this.constrain(1.2 * p, 0, 1)
    p = this.ease(p, 1.8)
    const numberOfSpiralTurns = 6
    const theta = 2 * Math.PI * numberOfSpiralTurns * Math.sqrt(p)
    const r = 170 * Math.sqrt(p)
    return new Vector2D(r * Math.cos(theta), r * Math.sin(theta) + this.startDotYOffset)
  }

  public rotate(v1: Vector2D, v2: Vector2D, p: number, orientation: boolean): Vector2D {
    const middle = new Vector2D((v1.x + v2.x) / 2, (v1.y + v2.y) / 2)
    const dx = v1.x - middle.x
    const dy = v1.y - middle.y
    const angle = Math.atan2(dy, dx)
    const o = orientation ? -1 : 1
    const r = Math.sqrt(dx * dx + dy * dy)
    const bounce = Math.sin(p * Math.PI) * 0.05 * (1 - p)
    return new Vector2D(
      middle.x + r * (1 + bounce) * Math.cos(angle + o * Math.PI * this.easeOutElastic(p)),
      middle.y + r * (1 + bounce) * Math.sin(angle + o * Math.PI * this.easeOutElastic(p)),
    )
  }

  public showProjectedDot(position: Vector3D, sizeFactor: number) {
    const t2 = this.constrain(this.map(this.time, this.changeEventTime, 1, 0, 1), 0, 1)
    const newCameraZ = this.cameraZ + this.ease(Math.pow(t2, 1.2), 1.8) * this.cameraTravelDistance
    if (position.z > newCameraZ) {
      const dotDepthFromCamera = position.z - newCameraZ
      const x = (this.viewZoom * position.x) / dotDepthFromCamera
      const y = (this.viewZoom * position.y) / dotDepthFromCamera
      const sw = (400 * sizeFactor) / dotDepthFromCamera
      // EXACTLY as the supplied source: lineWidth is set but the dot is
      // a FILLED arc of fixed radius 0.5 — every star renders as a tiny
      // uniform point. An earlier pass changed the radius to
      // Math.max(sw / 2, 0.5) (bigger, size-varied dots); user rejected
      // that. Do not change.
      this.ctx.lineWidth = sw
      this.ctx.beginPath()
      this.ctx.arc(x, y, 0.5, 0, Math.PI * 2)
      this.ctx.fill()
    }
  }

  private drawStartDot() {
    if (this.time > this.changeEventTime) {
      const dy = (this.cameraZ * this.startDotYOffset) / this.viewZoom
      const position = new Vector3D(0, dy, this.cameraTravelDistance)
      this.showProjectedDot(position, 2.5)
    }
  }

  public render() {
    const ctx = this.ctx
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, this.size, this.size)
    ctx.save()
    ctx.translate(this.size / 2, this.size / 2)

    const t1 = this.constrain(this.map(this.time, 0, this.changeEventTime + 0.25, 0, 1), 0, 1)
    const t2 = this.constrain(this.map(this.time, this.changeEventTime, 1, 0, 1), 0, 1)

    ctx.rotate(-Math.PI * this.ease(t2, 2.7))
    this.drawTrail(t1)

    ctx.fillStyle = 'white'
    for (const star of this.stars) star.render(t1, this)

    this.drawStartDot()
    ctx.restore()
  }

  private drawTrail(t1: number) {
    for (let i = 0; i < this.trailLength; i++) {
      const f = this.map(i, 0, this.trailLength, 1.1, 0.1)
      const sw = (1.3 * (1 - t1) + 3.0 * Math.sin(Math.PI * t1)) * f
      this.ctx.fillStyle = 'white'
      const pathTime = t1 - 0.00015 * i
      const position = this.spiralPath(pathTime)
      const offset = new Vector2D(position.x + 5, position.y + 5)
      const rotated = this.rotate(position, offset, Math.sin(this.time * Math.PI * 2) * 0.5 + 0.5, i % 2 === 0)
      this.ctx.beginPath()
      this.ctx.arc(rotated.x, rotated.y, sw / 2, 0, Math.PI * 2)
      this.ctx.fill()
    }
  }
}

class Star {
  private dx: number
  private dy: number
  private spiralLocation: number
  private strokeWeightFactor: number
  private z: number
  private angle: number
  private distance: number
  private rotationDirection: number
  private expansionRate: number
  private finalScale: number

  constructor(cameraZ: number, cameraTravelDistance: number) {
    this.angle = Math.random() * Math.PI * 2
    this.distance = 30 * Math.random() + 15
    this.rotationDirection = Math.random() > 0.5 ? 1 : -1
    this.expansionRate = 1.2 + Math.random() * 0.8
    this.finalScale = 0.7 + Math.random() * 0.6
    this.dx = this.distance * Math.cos(this.angle)
    this.dy = this.distance * Math.sin(this.angle)
    this.spiralLocation = (1 - Math.pow(1 - Math.random(), 3.0)) / 1.3
    const min = 0.5 * cameraZ
    const max = cameraTravelDistance + cameraZ
    this.z = min + Math.random() * (max - min)
    const lerp = (s: number, e: number, t: number) => s * (1 - t) + e * t
    this.z = lerp(this.z, cameraTravelDistance / 2, 0.3 * this.spiralLocation)
    this.strokeWeightFactor = Math.pow(Math.random(), 2.0)
  }

  render(p: number, c: AnimationController) {
    const spiralPos = c.spiralPath(this.spiralLocation)
    const q = p - this.spiralLocation
    if (q <= 0) return

    const dp = c.constrain(4 * q, 0, 1)
    const linearEasing = dp
    const elasticEasing = c.easeOutElastic(dp)
    const powerEasing = Math.pow(dp, 2)

    let easing: number
    if (dp < 0.3) easing = c.lerp(linearEasing, powerEasing, dp / 0.3)
    else if (dp < 0.7) easing = c.lerp(powerEasing, elasticEasing, (dp - 0.3) / 0.4)
    else easing = elasticEasing

    let screenX: number, screenY: number
    if (dp < 0.3) {
      screenX = c.lerp(spiralPos.x, spiralPos.x + this.dx * 0.3, easing / 0.3)
      screenY = c.lerp(spiralPos.y, spiralPos.y + this.dy * 0.3, easing / 0.3)
    } else if (dp < 0.7) {
      const midProgress = (dp - 0.3) / 0.4
      const curveStrength = Math.sin(midProgress * Math.PI) * this.rotationDirection * 1.5
      const baseX = spiralPos.x + this.dx * 0.3
      const baseY = spiralPos.y + this.dy * 0.3
      const targetX = spiralPos.x + this.dx * 0.7
      const targetY = spiralPos.y + this.dy * 0.7
      const perpX = -this.dy * 0.4 * curveStrength
      const perpY = this.dx * 0.4 * curveStrength
      screenX = c.lerp(baseX, targetX, midProgress) + perpX * midProgress
      screenY = c.lerp(baseY, targetY, midProgress) + perpY * midProgress
    } else {
      const finalProgress = (dp - 0.7) / 0.3
      const baseX = spiralPos.x + this.dx * 0.7
      const baseY = spiralPos.y + this.dy * 0.7
      const targetDistance = this.distance * this.expansionRate * 1.5
      const spiralTurns = 1.2 * this.rotationDirection
      const spiralAngle = this.angle + spiralTurns * finalProgress * Math.PI
      const targetX = spiralPos.x + targetDistance * Math.cos(spiralAngle)
      const targetY = spiralPos.y + targetDistance * Math.sin(spiralAngle)
      screenX = c.lerp(baseX, targetX, finalProgress)
      screenY = c.lerp(baseY, targetY, finalProgress)
    }

    const vx = ((this.z - c.cameraZ) * screenX) / c.viewZoom
    const vy = ((this.z - c.cameraZ) * screenY) / c.viewZoom
    const position = new Vector3D(vx, vy, this.z)

    let sizeMultiplier = 1.0
    if (dp < 0.6) sizeMultiplier = 1.0 + dp * 0.2
    else {
      const t = (dp - 0.6) / 0.4
      sizeMultiplier = 1.2 * (1.0 - t) + this.finalScale * t
    }

    c.showProjectedDot(position, 8.5 * this.strokeWeightFactor * sizeMultiplier)
  }
}

// ---- EHR labels (same six as the previous orbit SVG, positions as % of
//      the old 640x640 viewBox so the layout reads the same) --------------

const EHRS: Array<{ name: string; proto: string; left: string; top: string; fontSize: number }> = [
  { name: 'Epic',     proto: 'FHIR', left: '50%',   top: '16%',   fontSize: 22 },
  { name: 'Oracle',   proto: 'HL7',  left: '79.7%', top: '34%',   fontSize: 20 },
  { name: 'athena',   proto: 'REST', left: '84.4%', top: '68.5%', fontSize: 20 },
  { name: 'eCW',      proto: 'HL7',  left: '50%',   top: '85.5%', fontSize: 20 },
  { name: 'NextGen',  proto: 'HL7',  left: '15.6%', top: '68.5%', fontSize: 20 },
  { name: 'Meditech', proto: 'FHIR', left: '20.3%', top: '34%',   fontSize: 20 },
]

// Choreography (single run, then freeze — per user Jun 2026):
//   1. swirl forms and circles
//   2. Zeus logo appears (demo-style fade + rise + pulse)
//   3. all six EHR labels appear in quick succession, CLUSTERED close
//      to the swirl (55% of the way out from center)
//   4. as the stars pan outward, the labels pan out with them to their
//      final orbit positions
//   5. the animation stops on a full-starfield frame — stars static
const LOGO_MS = 1200          // Zeus appears first
const LABELS_START_MS = 2800  // first EHR, after the logo is in
const LABEL_STAGGER_S = 0.3   // per-label opacity delay
const PANOUT_MS = 6500        // stars visibly dispersing -> labels follow
const FREEZE_MS = 10500       // stop here, stars static (set after visual check)

// Mid (clustered) positions: center + (final - center) * 0.55
const MID_FACTOR = 0.55
const mid = (pct: string) => {
  const v = parseFloat(pct)
  return `${50 + (v - 50) * MID_FACTOR}%`
}

const LOOP_MS = 15000 // same 15s cycle as the source's gsap timeline

export default function ZeusEhrSpiral() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [inView, setInView] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  // Start everything only when the visual is actually on screen.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // Stage flags, all timer-driven off section entry (user rejected
  // sweep-crossing reveals — they pushed the last labels past the
  // loop restart, ~18s in).
  const [labelsOn, setLabelsOn] = useState(false)
  const [panOut, setPanOut] = useState(false)

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setLabelsOn(true)
      setPanOut(true)
      return
    }
    const t1 = setTimeout(() => setLabelsOn(true), LABELS_START_MS)
    const t2 = setTimeout(() => setPanOut(true), PANOUT_MS)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [inView, reduceMotion])

  // Canvas: size from the container, drive time with rAF. SINGLE RUN:
  // the animation plays once up to FREEZE_MS and stops on that frame —
  // stars static, no loop restart.
  useEffect(() => {
    if (!inView) return
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const cssSize = wrap.getBoundingClientRect().width // square container
    canvas.width = cssSize * dpr
    canvas.height = cssSize * dpr
    canvas.style.width = `${cssSize}px`
    canvas.style.height = `${cssSize}px`
    ctx.scale(dpr, dpr)

    const controller = new AnimationController(ctx, cssSize)

    if (reduceMotion) {
      // The end state, immediately.
      controller.time = FREEZE_MS / LOOP_MS
      controller.render()
      return
    }

    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      if (elapsed >= FREEZE_MS) {
        controller.time = FREEZE_MS / LOOP_MS
        controller.render() // final static frame; no further rAF
        return
      }
      controller.time = (elapsed % LOOP_MS) / LOOP_MS
      controller.render()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduceMotion])

  // Logo appearance mirrors the source demo's "Enter" button exactly:
  // a 2s timer flips visibility, the wrapper transitions opacity +
  // translate-y over 1.5s, and the element itself pulses continuously
  // (the demo's animate-pulse). Labels then come one by one while the
  // stars are circling.
  const [logoVisible, setLogoVisible] = useState(false)
  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setLogoVisible(true)
      return
    }
    const timer = setTimeout(() => setLogoVisible(true), LOGO_MS) // before the EHRs
    return () => clearTimeout(timer)
  }, [inView, reduceMotion])

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        aspectRatio: '1',
        maxWidth: 560,
        margin: '0 auto',
        borderRadius: 20,
        overflow: 'hidden',
        background: '#000',
      }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block' }} />

      {/* Zeus logo — center, where the source demo had its Enter
          button, appearing the same way: fade + slight rise, then a
          continuous gentle pulse. Wrapper = entrance transition,
          inner img = infinite pulse (mirrors the demo's structure:
          fading container div + animate-pulse button). */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '26%', // smaller per user (Jun 2026); was 36%
          transform: `translate(-50%, -50%) translateY(${logoVisible ? 0 : 16}px)`,
          opacity: logoVisible ? 1 : 0,
          transition: reduceMotion ? 'none' : 'opacity 1.5s ease-out, transform 1.5s ease-out',
          pointerEvents: 'none',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/zeus/zeus-logo-v.png"
          alt="Zeus"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            filter: 'drop-shadow(0 0 22px rgba(255,255,255,0.30))', // was teal; 'remove everything blue'
            animation: logoVisible && !reduceMotion ? 'zeusLogoPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
          }}
        />
      </div>

      {/* EHR labels — appear clustered close to the swirl while it
          circles (after Zeus), then PAN OUT to their final orbit
          positions as the stars disperse. All text white per user. */}
      {EHRS.map((e, i) => (
        <div
          key={e.name}
          style={{
            position: 'absolute',
            left: panOut ? e.left : mid(e.left),
            top: panOut ? e.top : mid(e.top),
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            opacity: labelsOn ? 1 : 0,
            transition: reduceMotion
              ? 'none'
              : `opacity 0.7s ease-out ${i * LABEL_STAGGER_S}s, left 2.6s cubic-bezier(0.22, 1, 0.36, 1), top 2.6s cubic-bezier(0.22, 1, 0.36, 1)`,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display), Reddit Sans, system-ui',
              fontWeight: 700,
              fontSize: e.fontSize,
              color: '#fff',
              lineHeight: 1.15,
            }}
          >
            {e.name}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.78)', letterSpacing: '0.04em' }}>
            {e.proto}
          </div>
        </div>
      ))}

      <style>{`
        /* Same curve + opacity range as Tailwind's animate-pulse,
           which the source demo used on its Enter button. */
        @keyframes zeusLogoPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
