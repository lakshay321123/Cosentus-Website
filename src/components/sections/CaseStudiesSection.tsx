'use client'

import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

const caseStudies = [
  { tag: 'Anesthesia', stat: '<48hr', statLabel: 'Turnaround', title: '50+ site group eliminated revenue leakage with sub-48-hour turnaround.', href: '/case-studies', image: '/images/homepage/surgery-center.jpg' },
  { tag: 'Behavioral Health', stat: '700%', statLabel: 'Revenue Growth', title: 'Revenue grew from $2M to $16M serving 3,500+ individuals.', href: '/case-studies', image: '/images/homepage/healthcare-pro.jpg' },
  { tag: 'Orthopedic', stat: '46%', statLabel: 'Revenue Growth', title: 'Revenue grew 46% while cutting Workers\u2019 Comp turnaround from 45 to 28 days.', href: '/case-studies', image: '/images/homepage/doctor-consult.jpg' },
  { tag: 'DME', stat: '2x', statLabel: 'Sales Doubled', title: 'Sales doubled from $82M to $165M. DSO reduced 56%. Denial rates cut 31%.', href: '/case-studies', image: '/images/homepage/medical-tech.jpg' },
]

function CaseCard({ cs }: { cs: typeof caseStudies[0] }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid var(--gray-200)',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      cursor: 'pointer',
      overflow: 'hidden',
    }}
    className="case-card"
    >
      {/* Image */}
      <div style={{ width: '100%', height: 160, overflow: 'hidden', position: 'relative' }}>
        <img src={cs.image} alt={cs.tag} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.06)' }}
          onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)' }}
        />
        <div style={{ position: 'absolute', top: 12, left: 12, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'white', background: 'rgba(0,181,214,0.9)', padding: '4px 10px', borderRadius: 6 }}>{cs.tag}</div>
      </div>

      <div style={{ padding: '24px 24px 28px', flex: 1, display: 'flex', flexDirection: 'column' as const }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 36, fontWeight: 300, color: 'var(--gray-900)', lineHeight: 1, fontFamily: 'var(--font-display)' }}>{cs.stat}</div>
          <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>{cs.statLabel}</div>
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--gray-600)', flex: 1 }}>{cs.title}</div>
        <Link href={cs.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--primary)', marginTop: 16, textDecoration: 'none' }}>
          Read Case Study
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </Link>
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

        {/* Desktop */}
        <div className="hero-cases cases-desktop" style={{ marginTop: 48, gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {caseStudies.map((cs, i) => (
            <RevealOnScroll key={i} direction="scale" delay={0.3 + i * 0.15}>
              <CaseCard cs={cs} />
            </RevealOnScroll>
          ))}
        </div>

        {/* Mobile */}
        <div className="cases-mobile" style={{ overflow: "hidden", width: "100%", marginTop: 32 }}>
          <MobileCarousel autoScrollInterval={5000}>
            {caseStudies.map((cs, i) => (
              <CaseCard key={i} cs={cs} />
            ))}
          </MobileCarousel>
        </div>
      </div>
    </section>
  )
}
