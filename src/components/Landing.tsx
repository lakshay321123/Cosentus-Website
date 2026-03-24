'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

/* ─── Scroll Reveal Hook ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.unobserve(el)
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible] as const
}

/* ─── Reveal Wrapper ─── */
function Reveal({
  children,
  delay = 0,
  from = 'bottom',
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  from?: 'bottom' | 'top' | 'left' | 'right' | 'scale'
  className?: string
}) {
  const [ref, visible] = useReveal()
  const origins: Record<string, string> = {
    bottom: 'translateY(60px)',
    top: 'translateY(-60px)',
    left: 'translateX(-60px)',
    right: 'translateX(60px)',
    scale: 'scale(0.85)',
  }
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : origins[from],
        transition: `opacity 0.8s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

/* ─── Animated Counter ─── */
function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const [ref, visible] = useReveal()
  useEffect(() => {
    if (!visible) return
    let n = 0
    const step = end / 60
    const t = setInterval(() => {
      n += step
      if (n >= end) {
        setCount(end)
        clearInterval(t)
      } else {
        setCount(Math.round(n * 10) / 10)
      }
    }, 20)
    return () => clearInterval(t)
  }, [visible, end])
  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

/* ─── Testimonial Arrow ─── */
function TestimonialArrow({
  text,
  name,
  title,
  delay = 0,
}: {
  text: string
  name: string
  title: string
  delay?: number
}) {
  return (
    <Reveal from="bottom" delay={delay}>
      <div className="relative" style={{ paddingTop: '68%' }}>
        <svg
          viewBox="0 0 400 320"
          preserveAspectRatio="none"
          className="absolute top-0 left-0 w-full h-full"
        >
          <polygon points="200,0 400,320 0,320" fill="#68D1E6" />
        </svg>
        <div className="absolute z-10" style={{ top: '30%', left: '13%', right: '13%', bottom: '6%' }}>
          <p className="text-xs leading-relaxed text-black mb-2">{text}</p>
          <p className="font-bold text-xs text-black">{name}</p>
          <p className="text-xs" style={{ color: '#616161' }}>
            {title}
          </p>
        </div>
      </div>
    </Reveal>
  )
}

/* ─── Stat Badge (Chevron) ─── */
function StatBadge({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <svg viewBox="0 0 240 100" width="200" height="83">
      <polygon points="120,0 240,100 0,100" fill="#00B5D6" />
      <text
        x="120"
        y="62"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="20"
        fontWeight="700"
        fontFamily="Reddit Sans, sans-serif"
      >
        {line1}
      </text>
      <text
        x="120"
        y="86"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="15"
        fontWeight="400"
        fontFamily="Reddit Sans, sans-serif"
      >
        {line2}
      </text>
    </svg>
  )
}

/* ═══════════════════════════════════════════
   MAIN LANDING COMPONENT
   ═══════════════════════════════════════════ */
export default function Landing() {
  const roles = [
    'Book Keeper',
    'Marketing Guru',
    'Strategic Thinker',
    'Tech Expert',
    'Billing Expert',
    'Office Admin',
    'People Manager',
  ]

  const stats = [
    { end: 98.5, sfx: '%', label: 'Coding Accuracy', b1: 'Patient', b2: 'Satisfaction' },
    { end: 98, sfx: '%', label: 'Net Collection Rate', b1: 'Higher', b2: 'Collections' },
    { end: 38, sfx: '%', label: 'Increased Revenue', b1: 'Improved', b2: 'Revenue', pre: 'Upto' },
  ]

  const partners = [
    { n: 'ASCA', s: 'Ambulatory Surgery\nCenter Association' },
    { n: 'HIMSS', s: '' },
    { n: 'ASA', s: 'American Society of\nAnesthesiologists' },
    { n: 'UCA', s: 'Urgent Care\nAssociation' },
    { n: 'CDA', s: 'Endorsed\nServices' },
  ]

  return (
    <main>
      {/* ═══ HERO ═══ */}
      <section
        className="hero-bg relative overflow-hidden"
        style={{
          backgroundImage: 'url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* THINK GROWTH */}
        <Reveal from="top" delay={0.2}>
          <div className="text-center" style={{ padding: '72px 40px 32px' }}>
            <h1
              className="font-reddit"
              style={{
                fontWeight: 800,
                fontStyle: 'italic',
                fontSize: 'clamp(56px, 8vw, 88px)',
                color: '#FFFFFF',
                letterSpacing: -2,
                lineHeight: 0.95,
                textShadow: '0 4px 40px rgba(0,0,0,0.3)',
              }}
            >
              THINK GROWTH
            </h1>
          </div>
        </Reveal>

        {/* Arrows with testimonials */}
        <div className="max-w-[1100px] mx-auto px-8 pb-12">
          <div className="grid grid-cols-2 gap-x-10">
            <TestimonialArrow
              text="Our group transitioned to Cosentus from a national billing company. We had an immediate 20% increase in collections. We have found them to be competent and responsive, providing access to a team of skilled billing professionals. We are thrilled to work with our personalized team and view them as invaluable partners to our practice."
              name="Anup Singh, M.D.Chairman"
              title="Vascular Interventional Partners"
              delay={0.5}
            />
            <div className="mt-20">
              <TestimonialArrow
                text="Since switching over, our collection rate was nearly 100% of contracted rate. The monthly dashboard reports are a great tool in helping us manage our company. Cosentus and their team have been a great partner in the growth of our medical group in the past 5 years. We are pleased and glad that we made the switch."
                name="Dr. Sherman Tran"
                title="Spine and Sports Surgery Center - San Jose, CA"
                delay={0.9}
              />
            </div>
          </div>
          <div className="max-w-[50%] mx-auto -mt-10">
            <TestimonialArrow
              text="I have been working with Cosentus for several years. They work with me to improve their systems to provide me with great reimbursements. I appreciate the personal touch they add to their service. Thank you very much."
              name="Dr Mikiko Murakami, QME"
              title="Pain, Medicine, PM & R"
              delay={1.2}
            />
          </div>
        </div>
      </section>

      {/* ═══ DNA + ROLES ═══ */}
      <section className="flex min-h-[720px] overflow-hidden" style={{ background: '#00B5D6' }}>
        <Reveal from="left" delay={0.2} className="w-1/2">
          <div
            className="w-full h-full min-h-[720px]"
            style={{
              backgroundImage: 'url(/images/dna-helix.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </Reveal>
        <div className="w-1/2 flex flex-col justify-center" style={{ padding: '80px 64px' }}>
          <Reveal from="right" delay={0.4}>
            <p
              className="text-white mb-12"
              style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 400, lineHeight: 1.45 }}
            >
              Running a practice on your own, you take on many hats beyond clinical care - from strategy
              to operations - you do it all.
            </p>
          </Reveal>
          {roles.map((r, i) => (
            <Reveal key={r} from="right" delay={0.6 + i * 0.15}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
                <span className="text-white text-xl">{r}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ WAVE TRANSITION ═══ */}
      <div style={{ background: '#00B5D6' }}>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full block" style={{ height: 100 }}>
          <path d="M0,0 C360,120 1080,120 1440,0 L1440,120 L0,120Z" fill="#FFFFFF" />
        </svg>
      </div>

      {/* ═══ RESULTS ═══ */}
      <section className="bg-white" style={{ padding: '40px 60px 56px' }}>
        <Reveal from="scale" delay={0.1}>
          <h2 className="text-center mb-12" style={{ fontSize: 30, fontWeight: 500, color: '#000000' }}>
            Results you have never seen before!
          </h2>
        </Reveal>
        <div className="max-w-[800px] mx-auto">
          {stats.map((s, i) => (
            <Reveal key={i} from="bottom" delay={0.2 + i * 0.25}>
              <div className="flex items-center justify-between mb-10">
                <div>
                  {s.pre && (
                    <div style={{ fontSize: 15, color: '#616161', fontWeight: 300 }}>{s.pre}</div>
                  )}
                  <div style={{ fontSize: 'clamp(48px, 7vw, 72px)', fontWeight: 800, color: '#000000', lineHeight: 1 }}>
                    <Counter end={s.end} suffix={s.sfx} />
                  </div>
                  <div style={{ fontSize: 16, color: '#616161', fontWeight: 300 }}>{s.label}</div>
                </div>
                <StatBadge line1={s.b1} line2={s.b2} />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Calculator */}
        <Reveal from="bottom" delay={0.3}>
          <div className="text-center mt-8">
            <p className="text-xl mb-5" style={{ color: '#000000' }}>
              Try our Collections Calculator to find out.
            </p>
            <div className="float-anim inline-block">
              <Image src="/images/6.svg" alt="Calculator" width={56} height={70} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ CHEVRON INTO TEAL ═══ */}
      <div className="bg-white">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full block" style={{ height: 80 }}>
          <polygon points="720,0 1440,100 0,100" fill="#00B5D6" />
        </svg>
      </div>

      {/* ═══ ABOUT + SERVICES ═══ */}
      <section className="text-center" style={{ background: '#00B5D6', padding: '40px 60px 80px' }}>
        <Reveal from="bottom" delay={0.1}>
          <p className="text-white max-w-[800px] mx-auto mb-12" style={{ fontSize: 15, lineHeight: 1.8 }}>
            Cosentus pioneers in transforming Practice Management & Revenue Cycle Management with a
            comprehensive suite of solutions, including EHR and Practice Management Software.
            Emphasizing a technology-first approach, we ensure seamless integration for operational
            efficiency, enabling practitioners to focus on delivering exceptional healthcare.
          </p>
        </Reveal>

        <Reveal from="bottom" delay={0.2}>
          <h2 className="text-white mb-12" style={{ fontSize: 26, fontWeight: 600 }}>
            Our Services
          </h2>
        </Reveal>

        <div className="flex justify-center gap-20">
          {[
            { label: 'Revenue Cycle\nManagement', img: '7a.svg' },
            { label: 'EHR & Practice\nManagement Software', img: '7b.svg' },
            { label: 'Complete Practice\nManagement', img: '7c.svg' },
          ].map((s, i) => (
            <Reveal key={i} from="bottom" delay={0.3 + i * 0.2}>
              <div className="text-center">
                <div
                  className="w-[120px] h-[120px] rounded-full border-[3px] border-white flex items-center justify-center mx-auto mb-4"
                >
                  <Image src={`/images/${s.img}`} alt={s.label} width={70} height={70} />
                </div>
                <p className="text-white text-sm font-medium whitespace-pre-line leading-snug">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ CTA WITH CROWD ═══ */}
      <section
        className="crowd-bg text-center relative"
        style={{
          backgroundImage: 'url(/images/crowd-arrow.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 60%',
          padding: '120px 60px 80px',
        }}
      >
        <Reveal from="bottom" delay={0.2}>
          <p
            className="max-w-[620px] mx-auto mb-9"
            style={{
              fontSize: 30,
              fontWeight: 500,
              color: '#000000',
              lineHeight: 1.35,
              fontStyle: 'italic',
              textShadow: '0 1px 8px rgba(255,255,255,0.8)',
            }}
          >
            Are you ready to grow your practice alike thousands of our successful clients?
          </p>
        </Reveal>
        <Reveal from="scale" delay={0.5}>
          <a
            href="https://cosentus.com/contact-us/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded text-white text-lg font-semibold"
            style={{
              background: '#00B5D6',
              padding: '18px 52px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            }}
          >
            Get a Free Audit
          </a>
        </Reveal>
      </section>

      {/* ═══ PARTNERS ═══ */}
      <section className="bg-white" style={{ padding: '52px 60px', borderTop: '1px solid #E6E6E6' }}>
        <Reveal from="bottom" delay={0.1}>
          <p className="text-center mb-9" style={{ fontSize: 16, fontWeight: 500, color: '#00B5D6' }}>
            Our Partners
          </p>
        </Reveal>
        <Reveal from="bottom" delay={0.25}>
          <div className="flex justify-center items-center gap-9 max-w-[1000px] mx-auto">
            <button
              className="rounded-full flex items-center justify-center"
              style={{
                width: 44,
                height: 44,
                border: '1px solid #E6E6E6',
                background: 'none',
                fontSize: 22,
                color: '#616161',
                cursor: 'pointer',
              }}
            >
              &lt;
            </button>
            {partners.map((l) => (
              <div key={l.n} className="text-center min-w-[100px]">
                <span className="block text-2xl font-bold" style={{ color: '#616161' }}>
                  {l.n}
                </span>
                {l.s && (
                  <span
                    className="block whitespace-pre-line"
                    style={{ fontSize: 9, color: '#616161', lineHeight: 1.3, marginTop: 3 }}
                  >
                    {l.s}
                  </span>
                )}
              </div>
            ))}
            <button
              className="rounded-full flex items-center justify-center"
              style={{
                width: 44,
                height: 44,
                border: '1px solid #E6E6E6',
                background: 'none',
                fontSize: 22,
                color: '#616161',
                cursor: 'pointer',
              }}
            >
              &gt;
            </button>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
