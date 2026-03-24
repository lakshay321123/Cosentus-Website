'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

function useReveal(threshold = 0.12) {
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
    bottom: 'translateY(50px)', top: 'translateY(-50px)',
    left: 'translateX(-50px)', right: 'translateX(50px)', scale: 'scale(0.9)',
  }
  return (
    <div ref={ref} className={className} style={{
      opacity: v ? 1 : 0, transform: v ? 'none' : t[from] || t.bottom,
      transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${delay}s`,
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

      {/* ═══ HERO: Blue gradient BG + THINK GROWTH + Testimonial arrows ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover" priority />
        </div>

        <div className="relative z-10">
          <Reveal from="top" delay={0.3}>
            <h1 className="text-center" style={{
              padding: '80px 40px 20px',
              fontWeight: 800, fontStyle: 'italic',
              fontSize: 'clamp(52px, 8vw, 96px)',
              color: '#FFFFFF', letterSpacing: -3, lineHeight: 0.9,
            }}>
              THINK GROWTH
            </h1>
          </Reveal>

          {/* USE THE ACTUAL SVG FILES - 1.svg, 2.svg, 3.svg */}
          <div className="max-w-[1200px] mx-auto px-8 pb-16">
            <div className="grid grid-cols-2 gap-x-8 items-start">
              {/* Testimonial 1 (Anup Singh) — left */}
              <Reveal from="bottom" delay={0.6}>
                <div className="relative">
                  {/* Arrow shape behind */}
                  <Image src="/images/6a.svg" alt="" width={500} height={65}
                    className="w-full" style={{ transform: 'scaleY(6)', transformOrigin: 'bottom', marginBottom: -20 }} />
                  <div className="relative z-10 -mt-8">
                    <Image src="/images/1.svg" alt="Testimonial - Anup Singh" width={500} height={635} className="w-full h-auto" />
                  </div>
                </div>
              </Reveal>

              {/* Testimonial 2 (Dr. Sherman Tran) — right, offset down */}
              <Reveal from="bottom" delay={1.0}>
                <div className="relative" style={{ marginTop: 120 }}>
                  <Image src="/images/6a.svg" alt="" width={500} height={65}
                    className="w-full" style={{ transform: 'scaleY(6)', transformOrigin: 'bottom', marginBottom: -20 }} />
                  <div className="relative z-10 -mt-8">
                    <Image src="/images/2.svg" alt="Testimonial - Dr. Sherman Tran" width={500} height={635} className="w-full h-auto" />
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Testimonial 3 (Dr. Murakami) — center */}
            <Reveal from="bottom" delay={1.4}>
              <div className="relative max-w-[55%] mx-auto" style={{ marginTop: -40 }}>
                <Image src="/images/6a.svg" alt="" width={500} height={65}
                  className="w-full" style={{ transform: 'scaleY(6)', transformOrigin: 'bottom', marginBottom: -20 }} />
                <div className="relative z-10 -mt-8">
                  <Image src="/images/3.svg" alt="Testimonial - Dr. Murakami" width={500} height={540} className="w-full h-auto" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ DNA + ROLES ═══ */}
      <section className="flex min-h-[750px]" style={{ background: '#00B5D6' }}>
        <Reveal from="left" delay={0.3} className="w-1/2 relative min-h-[750px]">
          <Image src="/images/dna-helix.jpg" alt="DNA Helix" fill className="object-cover" />
        </Reveal>
        <div className="w-1/2 flex flex-col justify-center" style={{ padding: '80px 72px' }}>
          <Reveal from="right" delay={0.5}>
            <p className="text-white" style={{
              fontSize: 'clamp(24px, 2.8vw, 36px)',
              fontWeight: 400, fontStyle: 'italic',
              lineHeight: 1.4, marginBottom: 52,
            }}>
              Running a practice on your own, you take on many hats beyond clinical care - from strategy to operations - you do it all.
            </p>
          </Reveal>
          {['Book Keeper', 'Marketing Guru', 'Strategic Thinker', 'Tech Expert', 'Billing Expert', 'Office Admin', 'People Manager'].map((r, i) => (
            <Reveal key={r} from="right" delay={0.7 + i * 0.12}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-white shrink-0" />
                <span className="text-white" style={{ fontSize: 22, fontWeight: 500 }}>{r}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ WAVE ═══ */}
      <div style={{ background: '#00B5D6' }}>
        <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="w-full block" style={{ height: 120 }}>
          <path d="M0,0 C320,140 1120,140 1440,0 L1440,140 L0,140Z" fill="#FFFFFF" />
        </svg>
      </div>

      {/* ═══ RESULTS — using actual SVG files ═══ */}
      <section className="bg-white" style={{ padding: '20px 80px 64px' }}>
        <Reveal from="scale">
          <h2 className="text-center" style={{ fontSize: 32, fontWeight: 500, color: '#000000', marginBottom: 56 }}>
            Results you have never seen before!
          </h2>
        </Reveal>

        <div className="max-w-[850px] mx-auto">
          {/* 98.5% Coding Accuracy + Patient Satisfaction badge */}
          <Reveal from="bottom" delay={0.15}>
            <div className="flex items-center justify-between mb-12">
              <div style={{ flex: '0 0 45%' }}>
                <Image src="/images/4a.svg" alt="98.5% Coding Accuracy" width={400} height={164} className="w-full h-auto" />
              </div>
              <div style={{ flex: '0 0 40%' }}>
                <Image src="/images/4b.svg" alt="Patient Satisfaction" width={350} height={133} className="w-full h-auto" />
              </div>
            </div>
          </Reveal>

          {/* 98% Net Collection Rate + Higher Collections badge */}
          <Reveal from="bottom" delay={0.35}>
            <div className="flex items-center justify-between mb-12">
              <div style={{ flex: '0 0 45%' }}>
                <Image src="/images/5a.svg" alt="98% Net Collection Rate" width={400} height={139} className="w-full h-auto" />
              </div>
              <div style={{ flex: '0 0 40%' }}>
                <Image src="/images/5b.svg" alt="Higher Collections" width={350} height={133} className="w-full h-auto" />
              </div>
            </div>
          </Reveal>

          {/* Upto 38% — counter animated */}
          <Reveal from="bottom" delay={0.55}>
            <div className="flex items-center justify-between mb-12">
              <div>
                <div style={{ fontSize: 16, color: '#616161', fontWeight: 300 }}>Upto</div>
                <div style={{ fontSize: 'clamp(52px, 6vw, 76px)', fontWeight: 800, color: '#000000', lineHeight: 1 }}>
                  <Counter end={38} suffix="%" />
                </div>
                <div style={{ fontSize: 17, color: '#616161', fontWeight: 300, marginTop: 4 }}>Increased Revenue</div>
              </div>
              {/* Reuse 5b style for "Improved Revenue" — or use 6a chevron */}
              <svg viewBox="0 0 240 100" width="200" height="83">
                <polygon points="120,0 240,100 0,100" fill="#00B5D6" />
                <text x="120" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="700" fontFamily="Reddit Sans,sans-serif">Improved</text>
                <text x="120" y="86" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="400" fontFamily="Reddit Sans,sans-serif">Revenue</text>
              </svg>
            </div>
          </Reveal>
        </div>

        {/* Calculator — actual 6.svg */}
        <Reveal from="bottom" delay={0.3}>
          <div className="text-center" style={{ marginTop: 40 }}>
            <p style={{ fontSize: 22, fontWeight: 400, color: '#000000', marginBottom: 20 }}>
              Try our Collections Calculator to find out.
            </p>
            <Image src="/images/6.svg" alt="Calculator" width={60} height={76} className="mx-auto" />
          </div>
        </Reveal>
      </section>

      {/* ═══ CHEVRON INTO TEAL ═══ */}
      <div className="bg-white">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full block" style={{ height: 100 }}>
          <polygon points="720,0 1440,120 0,120" fill="#00B5D6" />
        </svg>
      </div>

      {/* ═══ ABOUT + SERVICES — actual 7a, 7b, 7c SVGs ═══ */}
      <section className="text-center" style={{ background: '#00B5D6', padding: '40px 80px 80px' }}>
        <Reveal from="bottom">
          <p className="text-white mx-auto" style={{ fontSize: 16, lineHeight: 1.85, maxWidth: 850, marginBottom: 56 }}>
            Cosentus pioneers in transforming Practice Management & Revenue Cycle Management with a comprehensive suite of solutions, including EHR and Practice Management Software. Emphasizing a technology-first approach, we ensure seamless integration for operational efficiency, enabling practitioners to focus on delivering exceptional healthcare.
          </p>
        </Reveal>

        <Reveal from="bottom" delay={0.15}>
          <h2 className="text-white" style={{ fontSize: 28, fontWeight: 600, marginBottom: 56 }}>Our Services</h2>
        </Reveal>

        <div className="flex justify-center" style={{ gap: 100 }}>
          {[
            { label: 'Revenue Cycle\nManagement', img: '7a.svg' },
            { label: 'EHR & Practice\nManagement Software', img: '7b.svg' },
            { label: 'Complete Practice\nManagement', img: '7c.svg' },
          ].map((s, i) => (
            <Reveal key={i} from="bottom" delay={0.25 + i * 0.15}>
              <div className="text-center">
                <div className="mx-auto mb-5 rounded-full border-[3px] border-white flex items-center justify-center overflow-hidden"
                  style={{ width: 140, height: 140, background: '#00B5D6' }}>
                  <Image src={`/images/${s.img}`} alt={s.label} width={90} height={90} />
                </div>
                <p className="text-white whitespace-pre-line" style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.4 }}>{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ CTA — crowd arrow image ═══ */}
      <section className="relative text-center" style={{ minHeight: 500 }}>
        <Image src="/images/crowd-arrow.jpg" alt="" fill className="object-cover" style={{ objectPosition: 'center 55%' }} />
        <div className="relative z-10" style={{ padding: '140px 60px 80px' }}>
          <Reveal from="bottom" delay={0.2}>
            <p className="mx-auto" style={{
              fontSize: 32, fontWeight: 500, color: '#000000',
              lineHeight: 1.3, fontStyle: 'italic', maxWidth: 650, marginBottom: 40,
              textShadow: '0 2px 12px rgba(255,255,255,0.9)',
            }}>
              Are you ready to grow your practice alike thousands of our successful clients?
            </p>
          </Reveal>
          <Reveal from="scale" delay={0.5}>
            <a href="https://cosentus.com/contact-us/" target="_blank" rel="noopener noreferrer"
              className="inline-block text-white text-lg font-semibold"
              style={{ background: '#00B5D6', padding: '20px 56px', borderRadius: 4, boxShadow: '0 6px 28px rgba(0,0,0,0.25)' }}>
              Get a Free Audit
            </a>
          </Reveal>
        </div>
      </section>

      {/* ═══ PARTNERS — actual 8.svg ═══ */}
      <section className="bg-white" style={{ padding: '56px 60px', borderTop: '1px solid #E6E6E6' }}>
        <Reveal from="bottom">
          <p className="text-center" style={{ fontSize: 18, fontWeight: 500, color: '#00B5D6', marginBottom: 40 }}>Our Partners</p>
        </Reveal>
        <Reveal from="bottom" delay={0.2}>
          <div className="flex justify-center items-center max-w-[1100px] mx-auto" style={{ gap: 40 }}>
            <button className="rounded-full flex items-center justify-center shrink-0"
              style={{ width: 48, height: 48, border: '1px solid #E6E6E6', background: 'none', fontSize: 24, color: '#616161', cursor: 'pointer' }}>
              &lt;
            </button>
            <div className="flex-1">
              <Image src="/images/8.svg" alt="Partners: ASCA, HIMSS, ASA, UCA, CDA" width={900} height={80}
                className="w-full h-auto" style={{ maxHeight: 70 }} />
            </div>
            <button className="rounded-full flex items-center justify-center shrink-0"
              style={{ width: 48, height: 48, border: '1px solid #E6E6E6', background: 'none', fontSize: 24, color: '#616161', cursor: 'pointer' }}>
              &gt;
            </button>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
