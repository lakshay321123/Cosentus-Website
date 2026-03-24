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

function Reveal({ children, delay = 0, from = 'bottom', className = '' }: {
  children: React.ReactNode; delay?: number; from?: string; className?: string
}) {
  const [ref, v] = useReveal()
  const t: Record<string, string> = {
    bottom: 'translateY(40px)', top: 'translateY(-40px)',
    left: 'translateX(-40px)', right: 'translateX(40px)', scale: 'scale(0.92)',
  }
  return (
    <div ref={ref} className={className} style={{
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

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover" priority />
        </div>

        <div className="relative z-10">
          {/* THINK GROWTH — properly sized */}
          <Reveal from="top" delay={0.2}>
            <h1 className="text-center" style={{
              padding: '60px 40px 24px',
              fontWeight: 800, fontStyle: 'italic',
              fontSize: 48, color: '#FFFFFF',
              letterSpacing: -1.5, lineHeight: 1,
            }}>
              THINK GROWTH
            </h1>
          </Reveal>

          {/* Testimonial 1 — uses actual 1.svg which includes the arrow shape + text */}
          <div className="max-w-[900px] mx-auto px-8">
            <Reveal from="bottom" delay={0.5}>
              <div className="flex justify-start" style={{ marginBottom: 40 }}>
                <div style={{ width: '50%' }}>
                  <Image src="/images/1.svg" alt="Testimonial - Anup Singh" width={500} height={635} className="w-full h-auto" />
                </div>
              </div>
            </Reveal>

            {/* Testimonial 2 — right side, staggered */}
            <Reveal from="bottom" delay={0.3}>
              <div className="flex justify-end" style={{ marginTop: -60, marginBottom: 40 }}>
                <div style={{ width: '50%' }}>
                  <Image src="/images/2.svg" alt="Testimonial - Dr. Sherman Tran" width={500} height={645} className="w-full h-auto" />
                </div>
              </div>
            </Reveal>

            {/* Testimonial 3 — left/center, staggered */}
            <Reveal from="bottom" delay={0.3}>
              <div className="flex justify-start" style={{ marginTop: -40, paddingBottom: 40 }}>
                <div style={{ width: '48%', marginLeft: '8%' }}>
                  <Image src="/images/3.svg" alt="Testimonial - Dr. Murakami" width={450} height={540} className="w-full h-auto" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ DNA + ROLES ═══ */}
      <section className="flex min-h-[650px]" style={{ background: '#00B5D6' }}>
        <Reveal from="left" delay={0.2} className="w-1/2 relative min-h-[650px]">
          <Image src="/images/dna-helix.jpg" alt="DNA Helix" fill className="object-cover" />
        </Reveal>
        <div className="w-1/2 flex flex-col justify-center" style={{ padding: '60px 56px' }}>
          <Reveal from="right" delay={0.4}>
            <p className="text-white" style={{
              fontSize: 24, fontWeight: 400, fontStyle: 'italic',
              lineHeight: 1.45, marginBottom: 40,
            }}>
              Running a practice on your own, you take on many hats beyond clinical care - from strategy to operations - you do it all.
            </p>
          </Reveal>
          {['Book Keeper', 'Marketing Guru', 'Strategic Thinker', 'Tech Expert', 'Billing Expert', 'Office Admin', 'People Manager'].map((r, i) => (
            <Reveal key={r} from="right" delay={0.6 + i * 0.1}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-white shrink-0" />
                <span className="text-white" style={{ fontSize: 17, fontWeight: 400 }}>{r}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ WAVE ═══ */}
      <div style={{ background: '#00B5D6' }}>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full block" style={{ height: 90 }}>
          <path d="M0,0 C360,120 1080,120 1440,0 L1440,120 L0,120Z" fill="#FFFFFF" />
        </svg>
      </div>

      {/* ═══ RESULTS — actual SVG files ═══ */}
      <section className="bg-white" style={{ padding: '16px 80px 48px' }}>
        <Reveal from="scale">
          <h2 className="text-center" style={{ fontSize: 24, fontWeight: 500, color: '#000000', marginBottom: 40 }}>
            Results you have never seen before!
          </h2>
        </Reveal>

        <div className="max-w-[700px] mx-auto">
          {/* 98.5% + Patient Satisfaction — actual SVGs */}
          <Reveal from="bottom" delay={0.15}>
            <div className="flex items-center justify-between mb-8">
              <div style={{ flex: '0 0 42%' }}>
                <Image src="/images/4a.svg" alt="98.5% Coding Accuracy" width={350} height={143} className="w-full h-auto" />
              </div>
              <div style={{ flex: '0 0 38%' }}>
                <Image src="/images/4b.svg" alt="Patient Satisfaction" width={300} height={114} className="w-full h-auto" />
              </div>
            </div>
          </Reveal>

          {/* 98% + Higher Collections */}
          <Reveal from="bottom" delay={0.3}>
            <div className="flex items-center justify-between mb-8">
              <div style={{ flex: '0 0 42%' }}>
                <Image src="/images/5a.svg" alt="98% Net Collection Rate" width={350} height={121} className="w-full h-auto" />
              </div>
              <div style={{ flex: '0 0 38%' }}>
                <Image src="/images/5b.svg" alt="Higher Collections" width={300} height={114} className="w-full h-auto" />
              </div>
            </div>
          </Reveal>

          {/* 38% + Improved Revenue — counter for animation */}
          <Reveal from="bottom" delay={0.45}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <div style={{ fontSize: 13, color: '#616161', fontWeight: 300 }}>Upto</div>
                <div style={{ fontSize: 52, fontWeight: 800, color: '#000000', lineHeight: 1 }}>
                  <Counter end={38} suffix="%" />
                </div>
                <div style={{ fontSize: 13, color: '#616161', fontWeight: 300, marginTop: 2 }}>Increased Revenue</div>
              </div>
              <svg viewBox="0 0 200 80" width="160" height="64">
                <polygon points="100,0 200,80 0,80" fill="#00B5D6" />
                <text x="100" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="17" fontWeight="700" fontFamily="Reddit Sans,sans-serif">Improved</text>
                <text x="100" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="400" fontFamily="Reddit Sans,sans-serif">Revenue</text>
              </svg>
            </div>
          </Reveal>
        </div>

        {/* Calculator */}
        <Reveal from="bottom" delay={0.2}>
          <div className="text-center" style={{ marginTop: 32 }}>
            <p style={{ fontSize: 17, fontWeight: 400, color: '#000000', marginBottom: 16 }}>
              Try our Collections Calculator to find out.
            </p>
            <Image src="/images/6.svg" alt="Calculator" width={48} height={60} className="mx-auto" />
          </div>
        </Reveal>
      </section>

      {/* ═══ CHEVRON ═══ */}
      <div className="bg-white">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full block" style={{ height: 70 }}>
          <polygon points="720,0 1440,100 0,100" fill="#00B5D6" />
        </svg>
      </div>

      {/* ═══ ABOUT + SERVICES ═══ */}
      <section className="text-center" style={{ background: '#00B5D6', padding: '32px 60px 64px' }}>
        <Reveal from="bottom">
          <p className="text-white mx-auto" style={{ fontSize: 13, lineHeight: 1.8, maxWidth: 700, marginBottom: 40 }}>
            Cosentus pioneers in transforming Practice Management & Revenue Cycle Management with a comprehensive suite of solutions, including EHR and Practice Management Software. Emphasizing a technology-first approach, we ensure seamless integration for operational efficiency, enabling practitioners to focus on delivering exceptional healthcare.
          </p>
        </Reveal>

        <Reveal from="bottom" delay={0.1}>
          <h2 className="text-white" style={{ fontSize: 20, fontWeight: 600, marginBottom: 40 }}>Our Services</h2>
        </Reveal>

        <div className="flex justify-center" style={{ gap: 72 }}>
          {[
            { label: 'Revenue Cycle\nManagement', img: '7a.svg' },
            { label: 'EHR & Practice\nManagement Software', img: '7b.svg' },
            { label: 'Complete Practice\nManagement', img: '7c.svg' },
          ].map((s, i) => (
            <Reveal key={i} from="bottom" delay={0.2 + i * 0.12}>
              <div className="text-center">
                <div className="mx-auto mb-4 rounded-full border-[2px] border-white flex items-center justify-center overflow-hidden"
                  style={{ width: 110, height: 110, background: '#00B5D6' }}>
                  <Image src={`/images/${s.img}`} alt={s.label} width={70} height={70} />
                </div>
                <p className="text-white whitespace-pre-line" style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative text-center" style={{ minHeight: 420 }}>
        <Image src="/images/crowd-arrow.jpg" alt="" fill className="object-cover" style={{ objectPosition: 'center 55%' }} />
        <div className="relative z-10" style={{ padding: '100px 48px 60px' }}>
          <Reveal from="bottom" delay={0.2}>
            <p className="mx-auto" style={{
              fontSize: 24, fontWeight: 500, color: '#000000',
              lineHeight: 1.35, fontStyle: 'italic', maxWidth: 520, marginBottom: 28,
              textShadow: '0 1px 8px rgba(255,255,255,0.8)',
            }}>
              Are you ready to grow your practice alike thousands of our successful clients?
            </p>
          </Reveal>
          <Reveal from="scale" delay={0.4}>
            <a href="https://cosentus.com/contact-us/" target="_blank" rel="noopener noreferrer"
              className="inline-block text-white font-semibold"
              style={{ background: '#00B5D6', padding: '14px 44px', borderRadius: 4, fontSize: 15 }}>
              Get a Free Audit
            </a>
          </Reveal>
        </div>
      </section>

      {/* ═══ PARTNERS — actual 8.svg ═══ */}
      <section className="bg-white" style={{ padding: '40px 48px', borderTop: '1px solid #E6E6E6' }}>
        <Reveal from="bottom">
          <p className="text-center" style={{ fontSize: 14, fontWeight: 500, color: '#00B5D6', marginBottom: 28 }}>Our Partners</p>
        </Reveal>
        <Reveal from="bottom" delay={0.15}>
          <div className="flex justify-center items-center max-w-[900px] mx-auto" style={{ gap: 28 }}>
            <button className="rounded-full flex items-center justify-center shrink-0"
              style={{ width: 36, height: 36, border: '1px solid #E6E6E6', background: 'none', fontSize: 18, color: '#616161', cursor: 'pointer' }}>
              &lt;
            </button>
            <div className="flex-1">
              <Image src="/images/8.svg" alt="Partners" width={800} height={70} className="w-full h-auto" style={{ maxHeight: 56 }} />
            </div>
            <button className="rounded-full flex items-center justify-center shrink-0"
              style={{ width: 36, height: 36, border: '1px solid #E6E6E6', background: 'none', fontSize: 18, color: '#616161', cursor: 'pointer' }}>
              &gt;
            </button>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
