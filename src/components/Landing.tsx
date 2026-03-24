'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

function useReveal(threshold = 0.2) {
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

export default function Landing() {
  return (
    <main className="font-reddit overflow-x-hidden">

      {/* ═══ HERO BANNER — compact, ~50vh ═══ */}
      <section className="relative overflow-hidden" style={{ height: '50vh', minHeight: 340 }}>
        <div className="absolute inset-0">
          <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover object-top" priority />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <Reveal from="top" delay={0.2}>
            <h1 style={{
              fontWeight: 800, fontStyle: 'italic',
              fontSize: 42, color: '#FFFFFF',
              letterSpacing: -1, lineHeight: 1,
              textAlign: 'center',
            }}>
              THINK GROWTH
            </h1>
          </Reveal>
        </div>
      </section>

      {/* ═══ TESTIMONIALS — one at a time, on scroll ═══ */}
      {/* Each testimonial is the actual SVG which includes the arrow + text */}
      <section className="bg-white" style={{ paddingTop: 0 }}>
        {/* Testimonial 1 — left aligned, arrow tip touches hero bottom */}
        <Reveal from="bottom" delay={0.2}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
            <div style={{ width: '45%', marginTop: -40 }}>
              <Image src="/images/1.svg" alt="Testimonial - Anup Singh" width={500} height={635}
                className="w-full h-auto" />
            </div>
          </div>
        </Reveal>

        {/* Testimonial 2 — right aligned */}
        <Reveal from="bottom" delay={0.1}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
            <div style={{ width: '45%', marginLeft: 'auto', marginTop: -20 }}>
              <Image src="/images/2.svg" alt="Testimonial - Dr. Sherman Tran" width={500} height={645}
                className="w-full h-auto" />
            </div>
          </div>
        </Reveal>

        {/* Testimonial 3 — center-left */}
        <Reveal from="bottom" delay={0.1}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
            <div style={{ width: '42%', marginLeft: '12%', marginTop: -20 }}>
              <Image src="/images/3.svg" alt="Testimonial - Dr. Murakami" width={450} height={540}
                className="w-full h-auto" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ DNA + ROLES ═══ */}
      <section className="flex" style={{ background: '#00B5D6', minHeight: 600 }}>
        <Reveal from="left" delay={0.2} className="w-1/2 relative" style={{ minHeight: 600 }}>
          <div className="relative w-full" style={{ minHeight: 600 }}>
            <Image src="/images/dna-helix.jpg" alt="DNA Helix" fill className="object-cover" />
          </div>
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

      {/* ═══ U-SHAPED WAVE: Teal curves into white ═══ */}
      <div style={{ background: '#00B5D6' }}>
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full block" style={{ height: 160 }}>
          <path d="M0,0 L0,40 C360,200 1080,200 1440,40 L1440,0 Z" fill="#00B5D6" />
          <path d="M0,40 C360,200 1080,200 1440,40 L1440,200 L0,200 Z" fill="#FFFFFF" />
        </svg>
      </div>

      {/* ═══ RESULTS — centered, using actual SVGs ═══ */}
      <section className="bg-white" style={{ padding: '0 60px 48px' }}>
        <Reveal from="scale">
          <h2 className="text-center" style={{ fontSize: 22, fontWeight: 500, color: '#000000', marginBottom: 36 }}>
            Results you have never seen before!
          </h2>
        </Reveal>

        <div className="max-w-[600px] mx-auto">
          {/* 98.5% + Patient Satisfaction */}
          <Reveal from="bottom" delay={0.1}>
            <div className="flex items-center justify-between mb-6">
              <div style={{ flex: '0 0 48%' }}>
                <Image src="/images/4a.svg" alt="98.5% Coding Accuracy" width={300} height={122} className="w-full h-auto" />
              </div>
              <div style={{ flex: '0 0 40%' }}>
                <Image src="/images/4b.svg" alt="Patient Satisfaction" width={260} height={99} className="w-full h-auto" />
              </div>
            </div>
          </Reveal>

          {/* 98% + Higher Collections */}
          <Reveal from="bottom" delay={0.25}>
            <div className="flex items-center justify-between mb-6">
              <div style={{ flex: '0 0 48%' }}>
                <Image src="/images/5a.svg" alt="98% Net Collection Rate" width={300} height={103} className="w-full h-auto" />
              </div>
              <div style={{ flex: '0 0 40%' }}>
                <Image src="/images/5b.svg" alt="Higher Collections" width={260} height={99} className="w-full h-auto" />
              </div>
            </div>
          </Reveal>

          {/* Upto 38% + Improved Revenue (smaller) */}
          <Reveal from="bottom" delay={0.4}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div style={{ fontSize: 12, color: '#616161', fontWeight: 300 }}>Upto</div>
                <div style={{ fontSize: 44, fontWeight: 800, color: '#000000', lineHeight: 1 }}>
                  <Counter end={38} suffix="%" />
                </div>
                <div style={{ fontSize: 12, color: '#616161', fontWeight: 300, marginTop: 2 }}>Increased Revenue</div>
              </div>
              <svg viewBox="0 0 180 72" width="140" height="56">
                <polygon points="90,0 180,72 0,72" fill="#00B5D6" />
                <text x="90" y="46" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="700" fontFamily="Reddit Sans,sans-serif">Improved</text>
                <text x="90" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="400" fontFamily="Reddit Sans,sans-serif">Revenue</text>
              </svg>
            </div>
          </Reveal>
        </div>

        {/* Calculator */}
        <Reveal from="bottom" delay={0.2}>
          <div className="text-center" style={{ marginTop: 28 }}>
            <p style={{ fontSize: 15, fontWeight: 400, color: '#000000', marginBottom: 14 }}>
              Try our Collections Calculator to find out.
            </p>
            <Image src="/images/6.svg" alt="Calculator" width={44} height={56} className="mx-auto" />
          </div>
        </Reveal>
      </section>

      {/* ═══ CHEVRON into teal ═══ */}
      <div className="bg-white">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full block" style={{ height: 64 }}>
          <polygon points="720,0 1440,90 0,90" fill="#00B5D6" />
        </svg>
      </div>

      {/* ═══ ABOUT + SERVICES ═══ */}
      <section className="text-center" style={{ background: '#00B5D6', padding: '28px 48px 60px' }}>
        <Reveal from="bottom">
          <p className="text-white mx-auto" style={{ fontSize: 12, lineHeight: 1.8, maxWidth: 640, marginBottom: 36 }}>
            Cosentus pioneers in transforming Practice Management & Revenue Cycle Management with a comprehensive suite of solutions, including EHR and Practice Management Software. Emphasizing a technology-first approach, we ensure seamless integration for operational efficiency, enabling practitioners to focus on delivering exceptional healthcare.
          </p>
        </Reveal>

        <Reveal from="bottom" delay={0.1}>
          <h2 className="text-white" style={{ fontSize: 18, fontWeight: 600, marginBottom: 36 }}>Our Services</h2>
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
                  style={{ width: 100, height: 100, background: '#00B5D6' }}>
                  <Image src={`/images/${s.img}`} alt={s.label} width={64} height={64} />
                </div>
                <p className="text-white whitespace-pre-line" style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.35 }}>{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative text-center" style={{ minHeight: 380 }}>
        <Image src="/images/crowd-arrow.jpg" alt="" fill className="object-cover" style={{ objectPosition: 'center 55%' }} />
        <div className="relative z-10" style={{ padding: '90px 40px 60px' }}>
          <Reveal from="bottom" delay={0.15}>
            <p className="mx-auto" style={{
              fontSize: 22, fontWeight: 500, color: '#000000',
              lineHeight: 1.35, fontStyle: 'italic', maxWidth: 480, marginBottom: 24,
              textShadow: '0 1px 6px rgba(255,255,255,0.8)',
            }}>
              Are you ready to grow your practice alike thousands of our successful clients?
            </p>
          </Reveal>
          <Reveal from="scale" delay={0.35}>
            <a href="https://cosentus.com/contact-us/" target="_blank" rel="noopener noreferrer"
              className="inline-block text-white font-semibold"
              style={{ background: '#00B5D6', padding: '12px 40px', borderRadius: 3, fontSize: 14 }}>
              Get a Free Audit
            </a>
          </Reveal>
        </div>
      </section>

      {/* ═══ PARTNERS ═══ */}
      <section className="bg-white" style={{ padding: '36px 40px', borderTop: '1px solid #E6E6E6' }}>
        <Reveal from="bottom">
          <p className="text-center" style={{ fontSize: 13, fontWeight: 500, color: '#00B5D6', marginBottom: 24 }}>Our Partners</p>
        </Reveal>
        <Reveal from="bottom" delay={0.12}>
          <div className="flex justify-center items-center max-w-[800px] mx-auto" style={{ gap: 24 }}>
            <button className="rounded-full flex items-center justify-center shrink-0"
              style={{ width: 32, height: 32, border: '1px solid #E6E6E6', background: 'none', fontSize: 16, color: '#616161', cursor: 'pointer' }}>
              &lt;
            </button>
            <div className="flex-1">
              <Image src="/images/8.svg" alt="Partners" width={700} height={60} className="w-full h-auto" style={{ maxHeight: 48 }} />
            </div>
            <button className="rounded-full flex items-center justify-center shrink-0"
              style={{ width: 32, height: 32, border: '1px solid #E6E6E6', background: 'none', fontSize: 16, color: '#616161', cursor: 'pointer' }}>
              &gt;
            </button>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
