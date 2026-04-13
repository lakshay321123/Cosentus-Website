'use client'

import { useState } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

const caseStudies = [
  { tag: 'Anesthesia', stat: '<48hr', statLabel: 'Turnaround', title: '50+ site group. Zero revenue leakage. Sub-48-hour charge turnaround.', href: '/case-studies', image: '/images/homepage/surgery-center.jpg' },
  { tag: 'Behavioral Health', stat: '700%', statLabel: 'Revenue Growth', title: '$2M to $16M. 3,500+ individuals served. Automated Medi-Cal billing.', href: '/case-studies', image: '/images/homepage/healthcare-pro.jpg' },
  { tag: 'Orthopedic', stat: '46%', statLabel: 'Revenue Growth', title: '$1.5M to $2.2M. Workers\u2019 Comp turnaround cut from 45 to 28 days.', href: '/case-studies', image: '/images/homepage/doctor-consult.jpg' },
  { tag: 'DME', stat: '2x', statLabel: 'Sales Doubled', title: '$82M to $165M. DSO down 56%. Denial rates slashed 31%.', href: '/case-studies', image: '/images/homepage/medical-tech.jpg' },
]

function FlipCard({ cs, delay }: { cs: typeof caseStudies[0]; delay: number }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      style={{ perspective: 1000, height: 380, cursor: 'pointer' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
      }}>
        {/* Front — image + stat */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          borderRadius: 16, overflow: 'hidden',
        }}>
          <img src={cs.image} alt={cs.tag} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#00B5D6', marginBottom: 8 }}>{cs.tag}</div>
            <div style={{ fontSize: 48, fontWeight: 300, color: 'white', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{cs.stat}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{cs.statLabel}</div>
          </div>
        </div>

        {/* Back — details */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: 16, overflow: 'hidden',
          background: '#00B5D6',
          padding: 32,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>{cs.tag}</div>
          <div style={{ fontSize: 48, fontWeight: 300, color: 'white', fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: 20 }}>{cs.stat}</div>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', marginBottom: 24 }}>{cs.title}</p>
          <Link href={cs.href} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 600, color: 'white', textDecoration: 'none',
            letterSpacing: '0.05em', textTransform: 'uppercase' as const,
          }}>
            Read Case Study
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CaseStudiesSection() {
  return (
    <section className="section" id="cases" style={{ overflow: 'hidden' }}>
      <div className="container">
        <RevealOnScroll direction="left">
          <div className="section-label">PROVEN RESULTS</div>
        </RevealOnScroll>
        <RevealOnScroll direction="left" delay={0.1}>
          <div className="section-title">Case Studies</div>
        </RevealOnScroll>

        {/* Desktop — flip cards */}
        <div className="cases-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 48 }}>
          {caseStudies.map((cs, i) => (
            <RevealOnScroll key={i} direction="scale" delay={0.2 + i * 0.12}>
              <FlipCard cs={cs} delay={i * 0.1} />
            </RevealOnScroll>
          ))}
        </div>

        {/* Mobile */}
        <div className="cases-mobile" style={{ overflow: "hidden", width: "100%", marginTop: 32 }}>
          <MobileCarousel autoScrollInterval={5000}>
            {caseStudies.map((cs, i) => (
              <FlipCard key={i} cs={cs} delay={0} />
            ))}
          </MobileCarousel>
        </div>
      </div>
    </section>
  )
}
