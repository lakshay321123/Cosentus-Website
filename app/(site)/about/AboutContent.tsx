'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import MobileCarousel from '@/components/ui/MobileCarousel'

/* ── Animated counter hook ── */
function useCounter(target: number, suffix = '', decimals = 0) {
  const [value, setValue] = useState('0')
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = performance.now()
          const duration = 2000
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = target * eased
            setValue(current.toFixed(decimals) + suffix)
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, suffix, decimals])

  return { ref, value }
}

/* ── Data ── */
const beliefs = [
  {
    title: 'Customers First',
    desc: 'We measure success by the revenue gains we deliver for practices, not vanity metrics.',
    number: '01',
  },
  {
    title: 'Transparency',
    desc: 'Real-time dashboards, weekly reviews, and same-day reporting. No waiting. No guessing.',
    number: '02',
  },
  {
    title: 'Accountability',
    desc: 'We own outcomes end-to-end. Issues get root-cause analysis and immediate fixes.',
    number: '03',
  },
  {
    title: 'Specialty Focus',
    desc: 'Teams organized by specialty. They know every payer nuance and clinical detail — reducing denials and accelerating cash flow.',
    number: '04',
  },
]

const leadership = [
  { name: 'GS Bhalla', title: 'Chief Executive Officer', photo: '/images/3-GS.jpg', bio: "GS is our founder and serves as Chairman and CEO of the Cosentus group. His mission is to lead a team of global professionals that are focused on building the world's premiere business services organization. GS is a consummate entrepreneur and understands the challenges of growing a business and scaling it profitably without losing sight of its great asset, its people and culture. Having started Cosentus over 20 years ago, he has found an innovative approach to optimizing value for our customers. His dedication to his employees is proven as Cosentus still has more than 80% of its founding employees still working with the company! GS and Manisha live in sunny Orange County, CA with their two children Jas and Tej and three dogs Eeevee, Milo and Percy." },
  { name: 'JR Thompson', title: 'Sr. VP & Chief Operating Officer', photo: '/images/JR THOMPSON.jpg', bio: "J.R. Thompson brings more than 37 years of healthcare management experience to Cosentus. For over 14 years, he was an equity partner at abeo Management Corporation, where he held key leadership positions including President of Provider Services, Chief Marketing Officer, and Senior Vice President for the Texas, California, and Mountain Operating Divisions." },
  { name: 'Manisha Bhalla', title: 'Chief People Officer', photo: '/images/1Manisha.jpg', bio: "The Bhalla's are a family of 7. GS, Manisha, 2 two-legged and 3 four-legged children. As the Executive Director of Cosentus, she loves the entire team and looks forward to seeing everyone every day — and we all look forward to her around-the-office morning greetings and warm, balancing presence! With Cosentus since Day One, she loves giving back to the community, family, and friends without any expectation of a return." },
  { name: 'Viktor Alvarado', title: 'Chief Financial Officer', photo: '/images/Viktor-Alvarado.jpg', bio: "Joined Cosentus in October 2024. Over 25 years of experience in Corporate Finance and Controlling, with expertise in structuring the Finance function to enable high growth." },
  { name: 'Stephen Williamson', title: 'Chief Growth Officer', photo: '/images/Stephen Williamson.jpg', bio: "Stephen Williamson has spent over 30 years building relationships in healthcare — the kind that actually last. As Chief Growth Officer, he leads with radical candor and full transparency." },
  { name: 'Allen Ranjan', title: 'Chief Revenue Officer', photo: '/images/ALLEN RANJAN.jpg', bio: "Allen has spent years absorbing any and all information he can in all aspects of revenue cycle management. We have coined him 'The Encyclopedia'. Allen has been with Cosentus since our company was founded." },
  { name: 'Andrew Clougherty', title: 'Sr. Director of Client Services', photo: '/images/Andrew-Clougherty.jpg', bio: "Andrew has 14 years of experience in the RCM and Medical Billing fields. After a merger with Cosentus in 2023, Andrew assumed the title of Senior Director of RCM Services." },
  { name: 'David Langsam', title: 'Board Advisor', photo: '/images/david-langsam.jpg', bio: "David is an Executive Advisor with Cosentus and a growth-oriented CEO with extensive experience leading PE-backed, tech-enabled healthcare services companies." },
  { name: 'Tom Scott', title: 'Sr. Advisor | Corporate Growth & M&A', photo: '/images/tom-scott.webp', bio: "Senior Advisor for Corporate Growth and M&A at Cosentus. MBA, CPE, and AIE with extensive experience in entrepreneurial leadership, financial management, and business development." },
  { name: 'John Nulty', title: 'Sr. Advisor', photo: '/images/john-nulty.jpg', bio: "Senior Advisor at Cosentus bringing deep expertise in healthcare revenue cycle sales, marketing, and business development. Duke University graduate." },
  { name: 'Raja Inder Bhalla', title: 'Managing Director', photo: '/images/Inder.jpg', bio: "Meet our co-founder of Cosentus, a well-rounded leader. Being from a Finance and International Business background, Raja brings expertise in business operations." },
  { name: 'Ashwin Pajpal', title: 'Global Brand Director', photo: '/images/Ashwin.jpg', bio: "Ashwin is the creative voice guiding everything that we do. With an Art and English Honors Degree, Ashwin found his calling in advertising." },
  { name: 'Wayne Wertz', title: 'Sr. Director of HR & Corporate Operations', photo: '/images/Wayne.jpg', bio: "Wayne has over 25 years in the medical services industry in the areas of HR, operations, and facilities management." },
  { name: 'Ajay Kumar', title: 'Chief Operating Officer - RCM', photo: '/images/AJAY KUMAR.jpg', bio: "Ajay is the Head of Operations for our Cosentus Operations Support Division. He has been with Cosentus for over 20 years — the first employee GS ever hired!" },
  { name: 'Aman Bhasin', title: 'Sr. VP & Head of Global Operations (Non-US)', photo: '/images/AMAN BHASIN.jpg', bio: "Aman brings with him over 20 years of management experience in the BPO industry. He has led global diverse teams of over 5,000 people across India, Philippines, Americas, United Kingdom, Mexico, and Guatemala." },
]

const offices = [
  { city: 'Irvine, CA', label: 'Headquarters', address: '300 Spectrum Center Dr, Suite 1450, Irvine, CA 92618', phone: '(949) 216-4280', maps: 'https://maps.google.com/?q=300+Spectrum+Center+Dr+Suite+1450+Irvine+CA+92618' },
  { city: 'Phoenix, AZ', label: 'Regional Office', address: 'Phoenix, AZ', phone: '(877) 266-9040', maps: 'https://maps.google.com/?q=Cosentus+Phoenix+AZ' },
  { city: 'Mission, TX', label: 'Regional Office', address: 'Mission, TX', phone: '(877) 266-9040', maps: 'https://maps.google.com/?q=Cosentus+Mission+TX' },
  { city: 'Napa, CA', label: 'Regional Office', address: '550 Gateway Dr #100, Napa, CA 94558', phone: '(877) 266-9040', maps: 'https://maps.google.com/?q=550+Gateway+Dr+100+Napa+CA+94558' },
  { city: 'Dallas, TX', label: 'Regional Office', address: 'Dallas, TX', phone: '(888) 521-0055', maps: 'https://maps.google.com/?q=Cosentus+Dallas+TX' },
  { city: 'Salt Lake City, UT', label: 'Regional Office', address: 'Utah', phone: '(877) 266-9040', maps: 'https://maps.google.com/?q=Cosentus+Utah' },
  { city: 'Olathe, KS', label: 'Regional Office', address: 'Olathe, KS', phone: '(913) 262-2323', maps: 'https://maps.google.com/?q=Cosentus+Olathe+KS' },
]

const badges = ['SOC 2', 'HIPAA Compliant', 'HBMA Member', 'Inc. 5000', 'Great Place to Work']

/* ── Scroll Reveal Component with GSAP-like animations ── */
function ScrollReveal({ children, className = '', delay = 0, direction = 'up' }: {
  children: React.ReactNode, className?: string, delay?: number, direction?: 'up' | 'left' | 'right' | 'scale' | 'fade'
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('sr-visible'); obs.unobserve(el) }
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  const cls = direction === 'left' ? 'sr-left' : direction === 'right' ? 'sr-right' : direction === 'scale' ? 'sr-scale' : direction === 'fade' ? 'sr-fade' : 'sr-up'
  return <div ref={ref} className={`${cls} ${className}`} style={delay ? { transitionDelay: `${delay}s` } : undefined}>{children}</div>
}

export default function AboutContent() {
  const [selectedPerson, setSelectedPerson] = useState<typeof leadership[0] | null>(null)
  const [activeValue, setActiveValue] = useState(0)
  const valuesSectionRef = useRef<HTMLDivElement>(null)

  /* Animated counters */
  const stat25 = useCounter(25, '+', 0)
  const stat99 = useCounter(99, '%', 0)
  const stat30 = useCounter(30, '%', 0)
  const stat80 = useCounter(80, '%', 0)

  /* Scroll-driven value highlight */
  useEffect(() => {
    const section = valuesSectionRef.current
    if (!section) return
    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const sectionHeight = rect.height
      const progress = Math.max(0, Math.min(1, -rect.top / (sectionHeight - window.innerHeight)))
      const idx = Math.min(3, Math.floor(progress * 4))
      setActiveValue(idx)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <style>{`
        /* ===== SCROLL REVEAL SYSTEM ===== */
        .sr-up, .sr-left, .sr-right, .sr-scale, .sr-fade {
          opacity: 0;
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.8s ease;
          will-change: opacity, transform;
        }
        .sr-up { transform: translateY(40px); }
        .sr-left { transform: translateX(-40px); }
        .sr-right { transform: translateX(40px); }
        .sr-scale { transform: scale(0.92); }
        .sr-fade { transform: none; }
        .sr-visible { opacity: 1 !important; transform: none !important; filter: none !important; }

        /* ===== WHO WE ARE ===== */
        .about-intro {
          padding: 80px 0 100px;
        }
        .about-intro-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .about-intro-eyebrow {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .about-intro-eyebrow::before {
          content: '';
          width: 32px;
          height: 1.5px;
          background: var(--primary);
        }
        .about-intro h2 {
          font-family: var(--font-display);
          font-size: clamp(32px, 4vw, 50px);
          font-weight: 300;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: var(--gray-900);
          margin-bottom: 0;
        }
        .about-intro-body {
          font-size: 17px;
          line-height: 1.85;
          color: var(--gray-600);
          padding-top: 8px;
        }
        .about-intro-body p + p {
          margin-top: 20px;
          font-size: 15px;
          color: var(--gray-500);
        }

        /* ===== VALUES — STICKY SCROLL ===== */
        .values-section {
          min-height: 250vh;
          position: relative;
        }
        .values-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .values-bg {
          position: absolute;
          inset: 0;
          background: #0a1628;
          transition: background 0.6s ease;
        }
        .values-content {
          position: relative;
          z-index: 2;
          width: 100%;
        }
        .values-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .values-left-label {
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 20px;
        }
        .values-left h2 {
          font-family: var(--font-display);
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 200;
          line-height: 1.05;
          letter-spacing: -0.04em;
          color: white;
          margin-bottom: 48px;
        }
        .values-left h2 em {
          color: #00B5D6;
          font-style: normal;
        }
        .values-progress {
          display: flex;
          gap: 8px;
        }
        .values-progress-dot {
          width: 32px;
          height: 3px;
          border-radius: 2px;
          background: rgba(255,255,255,0.15);
          transition: all 0.5s ease;
        }
        .values-progress-dot.active {
          background: #00B5D6;
          width: 56px;
        }

        /* Right: value cards stacked */
        .values-card-stack {
          position: relative;
          min-height: 300px;
        }
        .value-card-v2 {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 48px;
          border-radius: 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          opacity: 0;
          transform: translateY(30px) scale(0.97);
          transition: all 0.6s cubic-bezier(0.16,1,0.3,1);
          pointer-events: none;
        }
        .value-card-v2.active {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }
        .value-card-number {
          font-family: var(--font-display);
          font-size: 64px;
          font-weight: 200;
          color: #00B5D6;
          opacity: 0.3;
          line-height: 1;
          margin-bottom: 16px;
          letter-spacing: -0.04em;
        }
        .value-card-v2 h3 {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 500;
          color: white;
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }
        .value-card-v2 p {
          font-size: 16px;
          line-height: 1.75;
          color: rgba(255,255,255,0.6);
        }

        /* ===== STATS + INDEPENDENCE ===== */
        .stats-independence {
          padding: 0;
          overflow: hidden;
        }
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-bottom: 1px solid var(--gray-200);
        }
        .stat-cell {
          padding: 64px 32px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .stat-cell + .stat-cell {
          border-left: 1px solid var(--gray-200);
        }
        .stat-cell::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #00B5D6;
          transform: scaleX(0);
          transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
          transform-origin: left;
        }
        .stat-cell:hover::after {
          transform: scaleX(1);
        }
        .stat-value {
          font-family: var(--font-display);
          font-size: clamp(48px, 6vw, 72px);
          font-weight: 200;
          color: #00B5D6;
          line-height: 1;
          letter-spacing: -0.04em;
          margin-bottom: 8px;
        }
        .stat-label {
          font-size: 13px;
          color: var(--gray-500);
          letter-spacing: 0.03em;
        }

        /* Independence — editorial layout */
        .independence-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 560px;
        }
        .independence-image {
          background: #00B5D6;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .independence-image::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url('/images/dna-helix.jpg') center/cover;
          opacity: 0.15;
        }
        .independence-image-inner {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 64px;
        }
        .independence-big-number {
          font-family: var(--font-display);
          font-size: clamp(80px, 12vw, 140px);
          font-weight: 200;
          color: white;
          line-height: 1;
          letter-spacing: -0.05em;
        }
        .independence-big-label {
          font-size: 16px;
          color: rgba(255,255,255,0.7);
          margin-top: 8px;
          letter-spacing: 0.05em;
        }
        .independence-content {
          padding: 80px 64px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: white;
        }
        .independence-content .section-label-v2 {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .independence-content .section-label-v2::before {
          content: '';
          width: 32px;
          height: 1.5px;
          background: var(--primary);
        }
        .independence-content h2 {
          font-family: var(--font-display);
          font-size: clamp(28px, 3vw, 40px);
          font-weight: 300;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--gray-900);
          margin-bottom: 24px;
        }
        .independence-content p {
          font-size: 16px;
          line-height: 1.85;
          color: var(--gray-600);
          margin-bottom: 36px;
        }
        .independence-proof {
          display: flex;
          gap: 48px;
        }
        .proof-item {
          display: flex;
          flex-direction: column;
        }
        .proof-value {
          font-family: var(--font-display);
          font-size: 40px;
          font-weight: 200;
          color: #00B5D6;
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .proof-label {
          font-size: 13px;
          color: var(--gray-500);
          margin-top: 6px;
        }

        /* Recognition bar */
        .recognition-bar {
          padding: 40px 0;
          background: var(--gray-50);
          border-top: 1px solid var(--gray-200);
          overflow: hidden;
        }
        .recognition-track {
          display: flex;
          gap: 56px;
          animation: recognitionScroll 20s linear infinite;
        }
        @keyframes recognitionScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .recognition-item {
          display: flex;
          align-items: center;
          gap: 10px;
          white-space: nowrap;
          font-size: 14px;
          font-weight: 500;
          color: var(--gray-600);
        }
        .recognition-item::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00B5D6;
          flex-shrink: 0;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .about-intro-inner { grid-template-columns: 1fr; gap: 32px; }
          .values-layout { grid-template-columns: 1fr; gap: 40px; }
          .values-card-stack { position: relative; min-height: auto; }
          .value-card-v2 { position: relative; opacity: 1; transform: none; pointer-events: auto; margin-bottom: 16px; }
          .value-card-v2:not(.active) { display: none; }
          .values-section { min-height: auto; }
          .values-sticky { position: relative; height: auto; padding: 80px 0; }
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .stat-cell:nth-child(3) { border-left: none; }
          .independence-section { grid-template-columns: 1fr; }
          .independence-image { min-height: 300px; }
          .independence-content { padding: 64px 40px; }
        }

        @media (max-width: 768px) {
          .about-intro { padding: 48px 0 64px; }
          .stats-row { grid-template-columns: 1fr 1fr; }
          .stat-cell { padding: 40px 20px; }
          .stat-cell + .stat-cell { border-left: 1px solid var(--gray-200); }
          .stat-cell:nth-child(3) { border-left: none; border-top: 1px solid var(--gray-200); }
          .stat-cell:nth-child(4) { border-top: 1px solid var(--gray-200); }
          .independence-content { padding: 48px 24px; }
          .independence-image-inner { padding: 48px 24px; }
          .independence-proof { gap: 32px; }
        }
      `}</style>

      {/* ===== WHO WE ARE ===== */}
      <section className="about-intro">
        <div className="container">
          <div className="about-intro-inner">
            <div>
              <ScrollReveal>
                <div className="about-intro-eyebrow">Who We Are</div>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <h2>A full-service practice growth partner for healthcare.</h2>
              </ScrollReveal>
            </div>
            <div>
              <ScrollReveal delay={0.15}>
                <div className="about-intro-body">
                  <p>
                    For more than 25 years, Cosentus has helped physician practices, specialty groups, and surgery centers grow revenue,
                    eliminate billing inefficiencies, and scale operations — end-to-end, from patient registration to final payment,
                    with Real + Artificial Intelligence and specialty-trained teams.
                  </p>
                  <p>
                    Built on its R+A approach — Real + Artificial Intelligence — Cosentus combines experienced revenue cycle
                    professionals with specialised AI agents to help healthcare organisations manage administrative complexity
                    more efficiently and improve financial performance.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALUES — STICKY SCROLL STORYTELLING ===== */}
      <div className="values-section" ref={valuesSectionRef}>
        <div className="values-sticky">
          <div className="values-bg" />
          <div className="values-content">
            <div className="container">
              <div className="values-layout">
                {/* Left: heading + progress */}
                <div className="values-left">
                  <div className="values-left-label">Our Values</div>
                  <h2>Four principles<br />that drive <em>everything</em><br />we do.</h2>
                  <div className="values-progress">
                    {beliefs.map((_, i) => (
                      <div key={i} className={`values-progress-dot${activeValue === i ? ' active' : ''}`} />
                    ))}
                  </div>
                </div>

                {/* Right: stacked cards */}
                <div className="values-card-stack">
                  {beliefs.map((b, i) => (
                    <div key={i} className={`value-card-v2${activeValue === i ? ' active' : ''}`}>
                      <div className="value-card-number">{b.number}</div>
                      <h3>{b.title}</h3>
                      <p>{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STATS — Animated Counters ===== */}
      <section className="stats-independence">
        <div className="stats-row">
          <div className="stat-cell" ref={stat25.ref}>
            <ScrollReveal>
              <div className="stat-value">{stat25.value}</div>
              <div className="stat-label">Years RCM Expertise</div>
            </ScrollReveal>
          </div>
          <div className="stat-cell">
            <ScrollReveal delay={0.1}>
              <div className="stat-value" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>R+A</div>
              <div className="stat-label">Real + Artificial Intelligence</div>
            </ScrollReveal>
          </div>
          <div className="stat-cell" ref={stat99.ref}>
            <ScrollReveal delay={0.2}>
              <div className="stat-value">{stat99.value}</div>
              <div className="stat-label">Customer Retention</div>
            </ScrollReveal>
          </div>
          <div className="stat-cell" ref={stat30.ref}>
            <ScrollReveal delay={0.3}>
              <div className="stat-value">{stat30.value}</div>
              <div className="stat-label">Up to Revenue Growth</div>
            </ScrollReveal>
          </div>
        </div>

        {/* Independence — editorial split */}
        <div className="independence-section">
          <div className="independence-image">
            <div className="independence-image-inner">
              <ScrollReveal direction="scale">
                <div className="independence-big-number" ref={stat80.ref}>{stat80.value}</div>
                <div className="independence-big-label">of our founding team is still here</div>
              </ScrollReveal>
            </div>
          </div>
          <div className="independence-content">
            <ScrollReveal direction="right">
              <div className="section-label-v2">Independence</div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.1}>
              <h2>Why Independent Matters</h2>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2}>
              <p>
                Cosentus is privately and independently owned. We make long-term decisions for client outcomes,
                not quarterly investor returns. No PE pressure. No shortcuts. Just a 25-year focus on doing right
                by the practices we serve.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.3}>
              <div className="independence-proof">
                <div className="proof-item">
                  <div className="proof-value">25+</div>
                  <div className="proof-label">Years in business</div>
                </div>
                <div className="proof-item">
                  <div className="proof-value">99%</div>
                  <div className="proof-label">Client retention</div>
                </div>
                <div className="proof-item">
                  <div className="proof-value">0</div>
                  <div className="proof-label">PE investors</div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Recognition marquee */}
      <div className="recognition-bar">
        <div className="recognition-track">
          {[...badges, ...badges, ...badges, ...badges].map((b, i) => (
            <div key={i} className="recognition-item">{b}</div>
          ))}
        </div>
      </div>

      {/* ===== LEADERSHIP ===== */}
      <section className="section section-alt" id="leadership">
        <div className="container">
          <ScrollReveal>
            <div className="section-label">OUR TEAM</div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="section-title">Executive Leadership</div>
          </ScrollReveal>

          <div className="leadership-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 20,
            marginTop: 48,
          }}>
            {leadership.map((person, i) => (
              <ScrollReveal key={i} delay={Math.min(i * 0.06, 0.5)}>
                <div
                  data-name={person.name.toLowerCase()}
                  onClick={() => setSelectedPerson(person)}
                  style={{
                    background: 'var(--white)',
                    borderRadius: 12,
                    border: '1px solid var(--gray-200)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    height: '100%',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
                >
                  <div style={{ width: '100%', aspectRatio: '1', background: '#f0f4f5', overflow: 'hidden' }}>
                    <img src={person.photo} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
                  </div>
                  <div style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{person.name}</h4>
                    <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>{person.title}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {selectedPerson && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', padding: 20 }} onClick={() => setSelectedPerson(null)}>
              <div style={{ background: 'white', borderRadius: 16, border: '2px solid #00B5D6', maxWidth: 520, width: '100%', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelectedPerson(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'var(--gray-100)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, zIndex: 1 }} aria-label="Close bio">✕</button>
                <div style={{ padding: '28px 28px 20px', display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '3px solid #00B5D6' }}>
                    <img src={selectedPerson.photo} alt={selectedPerson.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 22, fontWeight: 500, color: 'var(--gray-900)', margin: 0 }}>{selectedPerson.name}</h3>
                    <p style={{ fontSize: 14, color: '#00B5D6', margin: 0, fontWeight: 500 }}>{selectedPerson.title}</p>
                  </div>
                </div>
                <div style={{ padding: '0 28px 28px' }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--gray-700)' }}>{selectedPerson.bio}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== OFFICES ===== */}
      <section className="section">
        <div className="container">
          <ScrollReveal>
            <div className="section-label">OUR OFFICES</div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="section-title">Where We Are</div>
          </ScrollReveal>
          <div className="offices-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 36 }}>
            {offices.map((office, i) => (
              <ScrollReveal key={i} delay={Math.min(i * 0.06, 0.4)}>
                <a href={office.maps} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '24px', background: 'var(--white)', color: 'var(--gray-700)', borderRadius: 12, border: '1px solid var(--gray-200)', textDecoration: 'none', transition: 'all 0.3s ease', height: '100%' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 8px 24px rgba(0,181,214,0.2)'; el.style.background = '#00B5D6'; el.style.color = 'white'; el.style.borderColor = '#00B5D6' }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.background = 'var(--white)'; el.style.color = 'var(--gray-700)'; el.style.borderColor = 'var(--gray-200)' }}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{office.city}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7, marginBottom: 12 }}>{office.label}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.85, marginBottom: 8 }}>{office.address}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{office.phone}</div>
                  <div style={{ fontSize: 12, marginTop: 12, opacity: 0.6 }}>View on Maps →</div>
                </a>
              </ScrollReveal>
            ))}
          </div>
          <div className="offices-mobile" style={{ marginTop: 24 }}>
            <MobileCarousel autoScrollInterval={4000}>
              {offices.map((office, i) => (
                <a key={i} href={office.maps} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '24px', background: 'var(--white)', color: 'var(--gray-700)', borderRadius: 12, border: '1px solid var(--gray-200)', textDecoration: 'none' }}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{office.city}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7, marginBottom: 12 }}>{office.label}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.85, marginBottom: 8 }}>{office.address}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{office.phone}</div>
                  <div style={{ fontSize: 12, marginTop: 12, opacity: 0.6 }}>View on Maps →</div>
                </a>
              ))}
            </MobileCarousel>
          </div>
        </div>
      </section>
    </>
  )
}
