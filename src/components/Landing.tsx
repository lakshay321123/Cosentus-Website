'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); o.unobserve(el) } },
      { threshold }
    )
    o.observe(el)
    return () => o.disconnect()
  }, [threshold])
  return [ref, v] as const
}

function Reveal({ children, delay = 0, from = 'bottom', className = '', style = {} }: {
  children: React.ReactNode; delay?: number; from?: string; className?: string; style?: React.CSSProperties
}) {
  const [ref, v] = useReveal()
  const t: Record<string, string> = {
    bottom: 'translateY(40px)', top: 'translateY(-30px)',
    left: 'translateX(-40px)', right: 'translateX(40px)', scale: 'scale(0.92)',
  }
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: v ? 1 : 0, transform: v ? 'none' : t[from] || t.bottom,
      transition: `all 0.8s cubic-bezier(.16,1,.3,1) ${delay}s`,
    }}>{children}</div>
  )
}

function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [c, setC] = useState(0)
  const [ref, v] = useReveal()
  useEffect(() => {
    if (!v) return
    let n = 0; const step = end / 50
    const t = setInterval(() => {
      n += step
      if (n >= end) { setC(end); clearInterval(t) }
      else setC(Math.round(n * 10) / 10)
    }, 25)
    return () => clearInterval(t)
  }, [v, end])
  return <span ref={ref}>{c}{suffix}</span>
}

/* Interactive Canvas BG */
function InteractiveBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const imgRef = useRef<HTMLImageElement | null>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = '/images/hero-bg.jpg'
    imgRef.current = img

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
    }

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }

    let time = 0
    const draw = () => {
      if (!ctx || !imgRef.current?.complete) { frameRef.current = requestAnimationFrame(draw); return }
      time += 0.006
      const w = canvas.width, h = canvas.height
      const mx = mouseRef.current.x, my = mouseRef.current.y
      ctx.drawImage(imgRef.current, (mx - 0.5) * 30 - 15, (my - 0.5) * 20 - 15, w + 30, h + 30)
      const gx = mx * w, gy = my * h
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, w * 0.4)
      grad.addColorStop(0, 'rgba(0,220,240,0.10)')
      grad.addColorStop(0.5, 'rgba(0,181,214,0.04)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
      ctx.save()
      ctx.globalAlpha = 0.035
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        const phase = time * (1 + i * 0.3) + mx * 2
        for (let x = 0; x <= w; x += 4) {
          const y = h * 0.5 + Math.sin(x * 0.003 + phase) * (40 + i * 15) + (my - 0.5) * 40
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath()
        ctx.fillStyle = ['#00B5D6', '#36C2DE', '#68D1E6'][i]
        ctx.fill()
      }
      ctx.restore()
      frameRef.current = requestAnimationFrame(draw)
    }

    img.onload = () => { resize(); draw() }
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', handleMouse)
    resize()
    return () => { cancelAnimationFrame(frameRef.current); window.removeEventListener('resize', resize); canvas.removeEventListener('mousemove', handleMouse) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ display: 'block' }} />
}

/*
  Layout matched to CorelDRAW PDF:
  - Gradient bg top ~300px, white below
  - 3 overlapping arrows: 1 front z=30, 2 middle z=20, 3 back z=10
  - Arrows cascade top-left → center-right → bottom-left
  - Arrow tips touch the gradient/white boundary
*/

export default function Landing() {
  const S = 1.2 // scale factor: 960/800

  return (
    <main className="font-reddit overflow-x-hidden">

      {/* ═══ HERO + TESTIMONIALS as one positioned container ═══ */}
      <section className="relative" style={{ height: 820 * S }}>
        {/* Gradient background — covers top ~300px */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden" style={{ height: 260 * S }}>
          <InteractiveBg />
        </div>

        {/* White background — covers the rest */}
        <div className="absolute left-0 right-0 bg-white" style={{ top: 260 * S, bottom: 0 }} />

        {/* Content positioned absolutely matching PDF layout */}
        <div className="relative z-10 max-w-[960px] mx-auto" style={{ height: '100%' }}>
          {/* THINK GROWTH */}
          <Reveal from="top" delay={0.2}>
            <div className="absolute" style={{ left: '20%', top: 55 * S, width: '60%' }}>
              <h1 className="text-center w-full" style={{
                fontWeight: 800, fontStyle: 'italic',
                fontSize: 48, color: '#FFFFFF',
                letterSpacing: -1.5, lineHeight: 1,
              }}>
                THINK GROWTH
              </h1>
            </div>
          </Reveal>

          {/* Arrow 1 (Anup Singh) — FRONT, top-left */}
          <Reveal from="bottom" delay={0.5}>
            <div className="absolute" style={{ left: '5%', top: 115 * S, width: '40%', zIndex: 30 }}>
              <Image src="/images/1.svg" alt="Testimonial - Anup Singh"
                width={300} height={380} className="w-full h-auto" />
            </div>
          </Reveal>

          {/* Arrow 2 (Dr. Sherman Tran) — MIDDLE, center-right */}
          <Reveal from="bottom" delay={0.8}>
            <div className="absolute" style={{ left: '45%', top: 240 * S, width: '40%', zIndex: 20 }}>
              <Image src="/images/2.svg" alt="Testimonial - Dr. Sherman Tran"
                width={300} height={380} className="w-full h-auto" />
            </div>
          </Reveal>

          {/* Arrow 3 (Dr. Murakami) — BACK, bottom-left */}
          <Reveal from="bottom" delay={1.1}>
            <div className="absolute" style={{ left: '8%', top: 420 * S, width: '38%', zIndex: 10 }}>
              <Image src="/images/3.svg" alt="Testimonial - Dr. Murakami"
                width={280} height={340} className="w-full h-auto" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ DNA + ROLES ═══ */}
      <section className="flex" style={{ background: '#00B5D6', minHeight: 380 * S }}>
        <Reveal from="left" delay={0.2} className="relative" style={{ width: '42%', minHeight: 380 * S }}>
          <Image src="/images/dna-helix.jpg" alt="DNA Helix" fill className="object-cover" />
        </Reveal>
        <div className="flex flex-col justify-center" style={{ width: '58%', padding: `${28 * S}px ${48}px` }}>
          <Reveal from="right" delay={0.4}>
            <p className="text-white" style={{
              fontSize: 21, fontWeight: 400, fontStyle: 'italic',
              lineHeight: 1.5, marginBottom: 32,
            }}>
              Running a practice on your own, you take on many hats beyond clinical care &ndash; from strategy to operations &ndash; you do it all.
            </p>
          </Reveal>
          {['Book Keeper', 'Marketing Guru', 'Strategic Thinker', 'Tech Expert', 'Billing Expert', 'Office Admin', 'People Manager'].map((r, i) => (
            <Reveal key={r} from="right" delay={0.55 + i * 0.1}>
              <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
                <div className="shrink-0" style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFFFFF' }} />
                <span className="text-white" style={{ fontSize: 17, fontWeight: 400 }}>{r}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ U-SHAPED WAVE ═══ */}
      <div style={{ background: '#00B5D6' }}>
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full block" style={{ height: 80 * S }}>
          <path d="M0,0 L0,40 C360,200 1080,200 1440,40 L1440,0 Z" fill="#00B5D6" />
          <path d="M0,40 C360,200 1080,200 1440,40 L1440,200 L0,200 Z" fill="#FFFFFF" />
        </svg>
      </div>

      {/* ═══ RESULTS ═══ */}
      <section className="bg-white" style={{ padding: `${20 * S}px 60px ${48}px` }}>
        <Reveal from="scale">
          <h2 className="text-center" style={{ fontSize: 22, fontWeight: 600, color: '#000000', marginBottom: 36 }}>
            Results you have never seen before!
          </h2>
        </Reveal>

        <div className="max-w-[560px] mx-auto">
          <Reveal from="bottom" delay={0.1}>
            <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
              <div style={{ flex: '0 0 50%' }}>
                <Image src="/images/4a.svg" alt="98.5% Coding Accuracy" width={280} height={114} className="w-full h-auto" />
              </div>
              <div style={{ flex: '0 0 40%' }}>
                <Image src="/images/4b.svg" alt="Patient Satisfaction" width={240} height={91} className="w-full h-auto" />
              </div>
            </div>
          </Reveal>

          <Reveal from="bottom" delay={0.25}>
            <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
              <div style={{ flex: '0 0 50%' }}>
                <Image src="/images/5a.svg" alt="98% Net Collection Rate" width={280} height={97} className="w-full h-auto" />
              </div>
              <div style={{ flex: '0 0 40%' }}>
                <Image src="/images/5b.svg" alt="Higher Collections" width={240} height={91} className="w-full h-auto" />
              </div>
            </div>
          </Reveal>

          <Reveal from="bottom" delay={0.4}>
            <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 12, color: '#616161', fontWeight: 300 }}>Upto</div>
                <div style={{ fontSize: 42, fontWeight: 800, color: '#000000', lineHeight: 1 }}>
                  <Counter end={38} suffix="%" />
                </div>
                <div style={{ fontSize: 12, color: '#616161', fontWeight: 300, marginTop: 4 }}>Increased Revenue</div>
              </div>
              <svg viewBox="0 0 180 72" width="140" height="56">
                <polygon points="90,0 180,72 0,72" fill="#00B5D6" />
                <text x="90" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="700" fontFamily="Reddit Sans,sans-serif">Improved</text>
                <text x="90" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="400" fontFamily="Reddit Sans,sans-serif">Revenue</text>
              </svg>
            </div>
          </Reveal>
        </div>

        <Reveal from="bottom" delay={0.2}>
          <div className="text-center" style={{ marginTop: 28 }}>
            <p style={{ fontSize: 15, fontWeight: 400, color: '#000000', marginBottom: 14 }}>
              Try our Collections Calculator to find out.
            </p>
            <Image src="/images/6.svg" alt="Calculator" width={48} height={56} className="mx-auto" />
          </div>
        </Reveal>
      </section>

      {/* ═══ CHEVRON ═══ */}
      <div className="bg-white">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full block" style={{ height: 50 * S }}>
          <polygon points="720,0 1440,90 0,90" fill="#00B5D6" />
        </svg>
      </div>

      {/* ═══ ABOUT + SERVICES ═══ */}
      <section className="text-center" style={{ background: '#00B5D6', padding: `${28}px 48px ${60}px` }}>
        <Reveal from="bottom">
          <p className="text-white mx-auto" style={{ fontSize: 12, lineHeight: 1.85, maxWidth: 580, marginBottom: 36 }}>
            Cosentus pioneers in transforming Practice Management &amp; Revenue Cycle Management with a comprehensive suite of solutions, including EHR and Practice Management Software. Emphasizing a technology-first approach, we ensure seamless integration for operational efficiency, enabling practitioners to focus on delivering exceptional healthcare.
          </p>
        </Reveal>

        <Reveal from="bottom" delay={0.1}>
          <h2 className="text-white" style={{ fontSize: 18, fontWeight: 600, marginBottom: 36 }}>Our Services</h2>
        </Reveal>

        <div className="flex justify-center" style={{ gap: 64 }}>
          {[
            { label: 'Revenue Cycle\nManagement', img: '7a.svg' },
            { label: 'EHR & Practice\nManagement Software', img: '7b.svg' },
            { label: 'Complete Practice\nManagement', img: '7c.svg' },
          ].map((s, i) => (
            <Reveal key={i} from="bottom" delay={0.15 + i * 0.1}>
              <div className="text-center">
                <div className="mx-auto mb-3 rounded-full border-[2px] border-white flex items-center justify-center overflow-hidden"
                  style={{ width: 100, height: 100, background: '#00B5D6' }}>
                  <Image src={`/images/${s.img}`} alt={s.label} width={64} height={64} />
                </div>
                <p className="text-white whitespace-pre-line" style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.4 }}>{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative text-center" style={{ height: 280 * S }}>
        <Image src="/images/crowd-arrow.jpg" alt="" fill className="object-cover" style={{ objectPosition: 'center 55%' }} />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-10">
          <Reveal from="bottom" delay={0.15}>
            <p className="mx-auto" style={{
              fontSize: 20, fontWeight: 500, color: '#000000',
              lineHeight: 1.4, fontStyle: 'italic', maxWidth: 440, marginBottom: 24,
              textShadow: '0 1px 8px rgba(255,255,255,0.85)',
            }}>
              Are you ready to grow your practice alike thousands of our successful clients?
            </p>
          </Reveal>
          <Reveal from="scale" delay={0.35}>
            <a href="https://cosentus.com/contact-us/" target="_blank" rel="noopener noreferrer"
              className="inline-block text-white font-semibold"
              style={{ background: '#00B5D6', padding: '14px 40px', borderRadius: 3, fontSize: 14 }}>
              Get a Free Audit
            </a>
          </Reveal>
        </div>
      </section>

      {/* ═══ PARTNERS ═══ */}
      <section className="bg-white" style={{ padding: '32px 40px', borderTop: '1px solid #E6E6E6' }}>
        <Reveal from="bottom">
          <p className="text-center" style={{ fontSize: 13, fontWeight: 500, color: '#00B5D6', marginBottom: 20 }}>Our Partners</p>
        </Reveal>
        <Reveal from="bottom" delay={0.12}>
          <div className="flex justify-center items-center max-w-[750px] mx-auto" style={{ gap: 20 }}>
            <button className="rounded-full flex items-center justify-center shrink-0"
              style={{ width: 30, height: 30, border: '1px solid #E6E6E6', background: 'none', fontSize: 14, color: '#616161', cursor: 'pointer' }}>
              &lt;
            </button>
            <div className="flex-1">
              <Image src="/images/8.svg" alt="Partners" width={650} height={52} className="w-full h-auto" style={{ maxHeight: 44 }} />
            </div>
            <button className="rounded-full flex items-center justify-center shrink-0"
              style={{ width: 30, height: 30, border: '1px solid #E6E6E6', background: 'none', fontSize: 14, color: '#616161', cursor: 'pointer' }}>
              &gt;
            </button>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
