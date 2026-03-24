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

/* ─── Interactive Canvas BG for hero banner only ─── */
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
      if (!ctx || !imgRef.current?.complete) {
        frameRef.current = requestAnimationFrame(draw)
        return
      }
      time += 0.006
      const w = canvas.width
      const h = canvas.height
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      const ox = (mx - 0.5) * 30
      const oy = (my - 0.5) * 20
      ctx.drawImage(imgRef.current, -15 + ox, -15 + oy, w + 30, h + 30)

      const gx = mx * w
      const gy = my * h
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, w * 0.4)
      grad.addColorStop(0, 'rgba(0, 220, 240, 0.10)')
      grad.addColorStop(0.5, 'rgba(0, 181, 214, 0.04)')
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      ctx.save()
      ctx.globalAlpha = 0.035
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        const phase = time * (1 + i * 0.3) + mx * 2
        for (let x = 0; x <= w; x += 4) {
          const y = h * 0.5 + Math.sin(x * 0.003 + phase) * (40 + i * 15) + (my - 0.5) * 40
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.lineTo(w, h)
        ctx.lineTo(0, h)
        ctx.closePath()
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

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ display: 'block' }} />
}

export default function Landing() {
  return (
    <main className="font-reddit overflow-x-hidden">

      {/* ═══ HERO BANNER — gradient extends down to arrow tips ═══ */}
      <section className="relative overflow-hidden" style={{ height: '70vh', minHeight: 480 }}>
        <InteractiveBg />
        <div className="relative z-10 h-full flex items-center justify-center">
          <Reveal from="top" delay={0.2}>
            <h1 style={{
              fontWeight: 800, fontStyle: 'italic',
              fontSize: 42, color: '#FFFFFF',
              letterSpacing: -1, lineHeight: 1, textAlign: 'center',
            }}>
              THINK GROWTH
            </h1>
          </Reveal>
        </div>
      </section>

      {/* ═══ TESTIMONIALS — on WHITE, arrow tips just barely poke into the gradient ═══ */}
      <section className="bg-white relative">
        <div className="max-w-[960px] mx-auto px-6 relative" style={{ paddingBottom: 40 }}>
          <div className="grid grid-cols-2 gap-x-4 items-start">
            {/* Arrow 1 — left, tip just touches gradient edge */}
            <Reveal from="bottom" delay={0.3}>
              <div style={{ marginTop: -60 }}>
                <Image src="/images/1.svg" alt="Testimonial - Anup Singh"
                  width={400} height={510} className="w-full h-auto" />
              </div>
            </Reveal>

            {/* Arrow 2 — right, tip touches gradient edge */}
            <Reveal from="bottom" delay={0.7}>
              <div style={{ marginTop: 40 }}>
                <Image src="/images/2.svg" alt="Testimonial - Dr. Sherman Tran"
                  width={400} height={520} className="w-full h-auto" />
              </div>
            </Reveal>
          </div>

          {/* Arrow 3 — center-left, overlapping both, pulled up */}
          <Reveal from="bottom" delay={1.0}>
            <div style={{ width: '48%', marginLeft: '8%', marginTop: -120 }}>
              <Image src="/images/3.svg" alt="Testimonial - Dr. Murakami"
                width={400} height={460} className="w-full h-auto" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ DNA + ROLES ═══ */}
      <section className="flex" style={{ background: '#00B5D6', minHeight: 600 }}>
        <Reveal from="left" delay={0.2} className="w-1/2 relative" style={{ minHeight: 600 }}>
          <Image src="/images/dna-helix.jpg" alt="DNA Helix" fill className="object-cover" />
        </Reveal>
        <div className="w-1/2 flex flex-col justify-center" style={{ padding: '60px 48px' }}>
          <Reveal from="right" delay={0.4}>
            <p className="text-white" style={{
              fontSize: 22, fontWeight: 400, fontStyle: 'italic',
              lineHeight: 1.45, marginBottom: 36,
            }}>
              Running a practice on your own, you take on many hats beyond clinical care - from strategy to operations - you do it all.
            </p>
          </Reveal>
          {['Book Keeper', 'Marketing Guru', 'Strategic Thinker', 'Tech Expert', 'Billing Expert', 'Office Admin', 'People Manager'].map((r, i) => (
            <Reveal key={r} from="right" delay={0.55 + i * 0.1}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-white shrink-0" />
                <span className="text-white" style={{ fontSize: 16, fontWeight: 400 }}>{r}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ U-SHAPED WAVE ═══ */}
      <div style={{ background: '#00B5D6' }}>
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full block" style={{ height: 150 }}>
          <path d="M0,0 L0,40 C360,200 1080,200 1440,40 L1440,0 Z" fill="#00B5D6" />
          <path d="M0,40 C360,200 1080,200 1440,40 L1440,200 L0,200 Z" fill="#FFFFFF" />
        </svg>
      </div>

      {/* ═══ RESULTS ═══ */}
      <section className="bg-white" style={{ padding: '0 60px 44px' }}>
        <Reveal from="scale">
          <h2 className="text-center" style={{ fontSize: 22, fontWeight: 500, color: '#000000', marginBottom: 32 }}>
            Results you have never seen before!
          </h2>
        </Reveal>

        <div className="max-w-[600px] mx-auto">
          <Reveal from="bottom" delay={0.1}>
            <div className="flex items-center justify-between mb-5">
              <div style={{ flex: '0 0 48%' }}>
                <Image src="/images/4a.svg" alt="98.5% Coding Accuracy" width={280} height={114} className="w-full h-auto" />
              </div>
              <div style={{ flex: '0 0 38%' }}>
                <Image src="/images/4b.svg" alt="Patient Satisfaction" width={240} height={91} className="w-full h-auto" />
              </div>
            </div>
          </Reveal>

          <Reveal from="bottom" delay={0.25}>
            <div className="flex items-center justify-between mb-5">
              <div style={{ flex: '0 0 48%' }}>
                <Image src="/images/5a.svg" alt="98% Net Collection Rate" width={280} height={97} className="w-full h-auto" />
              </div>
              <div style={{ flex: '0 0 38%' }}>
                <Image src="/images/5b.svg" alt="Higher Collections" width={240} height={91} className="w-full h-auto" />
              </div>
            </div>
          </Reveal>

          <Reveal from="bottom" delay={0.4}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div style={{ fontSize: 12, color: '#616161', fontWeight: 300 }}>Upto</div>
                <div style={{ fontSize: 40, fontWeight: 800, color: '#000000', lineHeight: 1 }}>
                  <Counter end={38} suffix="%" />
                </div>
                <div style={{ fontSize: 12, color: '#616161', fontWeight: 300, marginTop: 2 }}>Increased Revenue</div>
              </div>
              <svg viewBox="0 0 180 72" width="130" height="52">
                <polygon points="90,0 180,72 0,72" fill="#00B5D6" />
                <text x="90" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="700" fontFamily="Reddit Sans,sans-serif">Improved</text>
                <text x="90" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="400" fontFamily="Reddit Sans,sans-serif">Revenue</text>
              </svg>
            </div>
          </Reveal>
        </div>

        <Reveal from="bottom" delay={0.2}>
          <div className="text-center" style={{ marginTop: 24 }}>
            <p style={{ fontSize: 15, fontWeight: 400, color: '#000000', marginBottom: 12 }}>
              Try our Collections Calculator to find out.
            </p>
            <Image src="/images/6.svg" alt="Calculator" width={40} height={50} className="mx-auto" />
          </div>
        </Reveal>
      </section>

      {/* ═══ CHEVRON ═══ */}
      <div className="bg-white">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full block" style={{ height: 60 }}>
          <polygon points="720,0 1440,90 0,90" fill="#00B5D6" />
        </svg>
      </div>

      {/* ═══ ABOUT + SERVICES ═══ */}
      <section className="text-center" style={{ background: '#00B5D6', padding: '24px 48px 56px' }}>
        <Reveal from="bottom">
          <p className="text-white mx-auto" style={{ fontSize: 12, lineHeight: 1.8, maxWidth: 600, marginBottom: 32 }}>
            Cosentus pioneers in transforming Practice Management & Revenue Cycle Management with a comprehensive suite of solutions, including EHR and Practice Management Software. Emphasizing a technology-first approach, we ensure seamless integration for operational efficiency, enabling practitioners to focus on delivering exceptional healthcare.
          </p>
        </Reveal>

        <Reveal from="bottom" delay={0.1}>
          <h2 className="text-white" style={{ fontSize: 17, fontWeight: 600, marginBottom: 32 }}>Our Services</h2>
        </Reveal>

        <div className="flex justify-center" style={{ gap: 56 }}>
          {[
            { label: 'Revenue Cycle\nManagement', img: '7a.svg' },
            { label: 'EHR & Practice\nManagement Software', img: '7b.svg' },
            { label: 'Complete Practice\nManagement', img: '7c.svg' },
          ].map((s, i) => (
            <Reveal key={i} from="bottom" delay={0.15 + i * 0.1}>
              <div className="text-center">
                <div className="mx-auto mb-3 rounded-full border-[2px] border-white flex items-center justify-center overflow-hidden"
                  style={{ width: 96, height: 96, background: '#00B5D6' }}>
                  <Image src={`/images/${s.img}`} alt={s.label} width={60} height={60} />
                </div>
                <p className="text-white whitespace-pre-line" style={{ fontSize: 11, fontWeight: 500, lineHeight: 1.35 }}>{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative text-center" style={{ minHeight: 360 }}>
        <Image src="/images/crowd-arrow.jpg" alt="" fill className="object-cover" style={{ objectPosition: 'center 55%' }} />
        <div className="relative z-10" style={{ padding: '80px 40px 56px' }}>
          <Reveal from="bottom" delay={0.15}>
            <p className="mx-auto" style={{
              fontSize: 20, fontWeight: 500, color: '#000000',
              lineHeight: 1.35, fontStyle: 'italic', maxWidth: 460, marginBottom: 24,
              textShadow: '0 1px 6px rgba(255,255,255,0.8)',
            }}>
              Are you ready to grow your practice alike thousands of our successful clients?
            </p>
          </Reveal>
          <Reveal from="scale" delay={0.35}>
            <a href="https://cosentus.com/contact-us/" target="_blank" rel="noopener noreferrer"
              className="inline-block text-white font-semibold"
              style={{ background: '#00B5D6', padding: '12px 36px', borderRadius: 3, fontSize: 14 }}>
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
