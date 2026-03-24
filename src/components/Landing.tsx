'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

/* ─── Scroll Reveal ─── */
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

/* ─── Counter ─── */
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

/* ═══════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════ */
export default function Landing() {
  return (
    <main className="font-reddit overflow-x-hidden">

      {/* ═══ SECTION 1: HERO ═══ */}
      <section className="relative overflow-hidden" style={{ minHeight: '100vh' }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover" priority />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* THINK GROWTH */}
          <Reveal from="top" delay={0.3}>
            <h1 className="text-center" style={{
              padding: '80px 40px 40px',
              fontWeight: 800, fontStyle: 'italic',
              fontSize: 'clamp(52px, 8vw, 96px)',
              color: '#FFFFFF', letterSpacing: -3, lineHeight: 0.9,
            }}>
              THINK GROWTH
            </h1>
          </Reveal>

          {/* Testimonial Arrows */}
          <div className="max-w-[1200px] mx-auto px-8 pb-16">
            {/* Row: Arrow 1 (left) + Arrow 2 (right) */}
            <div className="grid grid-cols-2 gap-x-12 items-start">
              {/* Arrow 1 */}
              <Reveal from="bottom" delay={0.6}>
                <div className="relative" style={{ marginTop: 20 }}>
                  <svg viewBox="0 0 500 400" className="w-full" style={{ filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.15))' }}>
                    <polygon points="250,0 500,400 0,400" fill="#A1DEED" />
                  </svg>
                  <div className="absolute" style={{ top: '32%', left: '14%', right: '14%', bottom: '5%' }}>
                    <p style={{ fontSize: 'clamp(11px, 1.1vw, 14px)', lineHeight: 1.65, color: '#000000', marginBottom: 12 }}>
                      Our group transitioned to Cosentus from a national billing company. We had an immediate 20% increase in collections. We have found them to be competent and responsive, providing access to a team of skilled billing professionals. We are thrilled to work with our personalized team and view them as invaluable partners to our practice.
                    </p>
                    <p style={{ fontWeight: 700, fontSize: 'clamp(10px, 1vw, 13px)', color: '#000000' }}>Anup Singh, M.D.Chairman</p>
                    <p style={{ fontSize: 'clamp(9px, 0.9vw, 12px)', color: '#616161' }}>Vascular Interventional Partners</p>
                  </div>
                </div>
              </Reveal>

              {/* Arrow 2 */}
              <Reveal from="bottom" delay={1.0}>
                <div className="relative" style={{ marginTop: 120 }}>
                  <svg viewBox="0 0 500 400" className="w-full" style={{ filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.15))' }}>
                    <polygon points="250,0 500,400 0,400" fill="#A1DEED" />
                  </svg>
                  <div className="absolute" style={{ top: '30%', left: '14%', right: '14%', bottom: '5%' }}>
                    <p style={{ fontSize: 'clamp(11px, 1.1vw, 14px)', lineHeight: 1.65, color: '#000000', marginBottom: 12 }}>
                      Since switching over, our collection rate was nearly 100% of contracted rate. The monthly dashboard reports are a great tool in helping us manage our company. Cosentus and their team have been a great partner in the growth of our medical group in the past 5 years. We are pleased and glad that we made the switch.
                    </p>
                    <p style={{ fontWeight: 700, fontSize: 'clamp(10px, 1vw, 13px)', color: '#000000' }}>Dr. Sherman Tran</p>
                    <p style={{ fontSize: 'clamp(9px, 0.9vw, 12px)', color: '#616161' }}>Spine and Sports Surgery Center - San Jose, CA</p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Arrow 3 (center bottom) */}
            <Reveal from="bottom" delay={1.4}>
              <div className="relative max-w-[55%] mx-auto" style={{ marginTop: -30 }}>
                <svg viewBox="0 0 500 400" className="w-full" style={{ filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.15))' }}>
                  <polygon points="250,0 500,400 0,400" fill="#A1DEED" />
                </svg>
                <div className="absolute" style={{ top: '32%', left: '14%', right: '14%', bottom: '5%' }}>
                  <p style={{ fontSize: 'clamp(11px, 1.1vw, 14px)', lineHeight: 1.65, color: '#000000', marginBottom: 12 }}>
                    I have been working with Cosentus for several years. They work with me to improve their systems to provide me with great reimbursements. I appreciate the personal touch they add to their service. Thank you very much.
                  </p>
                  <p style={{ fontWeight: 700, fontSize: 'clamp(10px, 1vw, 13px)', color: '#000000' }}>Dr Mikiko Murakami, QME</p>
                  <p style={{ fontSize: 'clamp(9px, 0.9vw, 12px)', color: '#616161' }}>Pain, Medicine, PM & R</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2: DNA + ROLES ═══ */}
      <section className="flex min-h-[750px]" style={{ background: '#00B5D6' }}>
        <Reveal from="left" delay={0.3} className="w-1/2 relative">
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

      {/* ═══ WAVE: Teal to White ═══ */}
      <div style={{ background: '#00B5D6' }}>
        <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="w-full block" style={{ height: 120 }}>
          <path d="M0,0 C320,140 1120,140 1440,0 L1440,140 L0,140Z" fill="#FFFFFF" />
        </svg>
      </div>

      {/* ═══ SECTION 3: RESULTS ═══ */}
      <section className="bg-white" style={{ padding: '20px 80px 64px' }}>
        <Reveal from="scale">
          <h2 className="text-center" style={{ fontSize: 32, fontWeight: 500, color: '#000000', marginBottom: 56 }}>
            Results you have never seen before!
          </h2>
        </Reveal>

        <div className="max-w-[850px] mx-auto">
          {[
            { end: 98.5, sfx: '%', label: 'Coding Accuracy', b1: 'Patient', b2: 'Satisfaction' },
            { end: 98, sfx: '%', label: 'Net Collection Rate', b1: 'Higher', b2: 'Collections' },
            { end: 38, sfx: '%', label: 'Increased Revenue', b1: 'Improved', b2: 'Revenue', pre: 'Upto' },
          ].map((s, i) => (
            <Reveal key={i} from="bottom" delay={0.15 + i * 0.2}>
              <div className="flex items-center justify-between" style={{ marginBottom: 44 }}>
                <div>
                  {s.pre && <div style={{ fontSize: 16, color: '#616161', fontWeight: 300 }}>{s.pre}</div>}
                  <div style={{ fontSize: 'clamp(52px, 6vw, 76px)', fontWeight: 800, color: '#000000', lineHeight: 1 }}>
                    <Counter end={s.end} suffix={s.sfx} />
                  </div>
                  <div style={{ fontSize: 17, color: '#616161', fontWeight: 300, marginTop: 4 }}>{s.label}</div>
                </div>
                <Image
                  src={`/images/${i === 0 ? '4b' : i === 1 ? '5b' : '5b'}.svg`}
                  alt={s.b1} width={200} height={80}
                />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Calculator */}
        <Reveal from="bottom" delay={0.3}>
          <div className="text-center" style={{ marginTop: 40 }}>
            <p style={{ fontSize: 22, fontWeight: 400, color: '#000000', marginBottom: 20 }}>
              Try our Collections Calculator to find out.
            </p>
            <Image src="/images/6.svg" alt="Calculator" width={60} height={76} className="mx-auto" />
          </div>
        </Reveal>
      </section>

      {/* ═══ CHEVRON: White to Teal ═══ */}
      <div className="bg-white">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full block" style={{ height: 100 }}>
          <polygon points="720,0 1440,120 0,120" fill="#00B5D6" />
        </svg>
      </div>

      {/* ═══ SECTION 4: ABOUT + SERVICES ═══ */}
      <section className="text-center" style={{ background: '#00B5D6', padding: '40px 80px 80px' }}>
        <Reveal from="bottom">
          <p className="text-white mx-auto" style={{
            fontSize: 16, lineHeight: 1.85, maxWidth: 850, marginBottom: 56,
          }}>
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
                <div className="mx-auto mb-5 rounded-full border-[3px] border-white flex items-center justify-center"
                  style={{ width: 140, height: 140 }}>
                  <Image src={`/images/${s.img}`} alt={s.label} width={80} height={80} />
                </div>
                <p className="text-white whitespace-pre-line" style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.4 }}>{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 5: CTA WITH CROWD ═══ */}
      <section className="relative text-center" style={{ minHeight: 500 }}>
        <Image src="/images/crowd-arrow.jpg" alt="" fill className="object-cover" style={{ objectPosition: 'center 55%' }} />
        <div className="relative z-10" style={{ padding: '140px 60px 80px' }}>
          <Reveal from="bottom" delay={0.2}>
            <p className="mx-auto" style={{
              fontSize: 32, fontWeight: 500, color: '#000000',
              lineHeight: 1.3, fontStyle: 'italic',
              maxWidth: 650, marginBottom: 40,
              textShadow: '0 2px 12px rgba(255,255,255,0.9)',
            }}>
              Are you ready to grow your practice alike thousands of our successful clients?
            </p>
          </Reveal>
          <Reveal from="scale" delay={0.5}>
            <a href="https://cosentus.com/contact-us/" target="_blank" rel="noopener noreferrer"
              className="inline-block text-white text-lg font-semibold"
              style={{
                background: '#00B5D6', padding: '20px 56px',
                borderRadius: 4, boxShadow: '0 6px 28px rgba(0,0,0,0.25)',
              }}>
              Get a Free Audit
            </a>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 6: PARTNERS ═══ */}
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
