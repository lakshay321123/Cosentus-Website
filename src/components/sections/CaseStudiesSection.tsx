import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

const caseStudies = [
  { tag: 'Anesthesia', stat: '<48hr', statLabel: 'Turnaround', title: 'A 50+ site anesthesia group eliminated revenue leakage, achieved sub-48-hour turnaround, and drove significant cash flow improvement.', href: '/case-studies' },
  { tag: 'Behavioral Health', stat: '700%', statLabel: 'Revenue Growth', title: 'Hope Services grew revenue from $2M to $16M serving 3,500+ individuals with developmental disabilities.', href: '/case-studies' },
  { tag: 'Orthopedic', stat: '46%', statLabel: 'Revenue Growth', title: "A multi-physician orthopedic practice grew revenue 46% — from $1.5M to $2.2M — while cutting Workers' Comp turnaround from 45 to 28 days.", href: '/case-studies' },
  { tag: 'DME', stat: '2x', statLabel: 'Sales Doubled', title: 'A high-volume DME provider doubled sales from $82M to $165M, reduced DSO by 56%, and cut denial rates 31%.', href: '/case-studies' },
]

function CaseCard({ cs }: { cs: typeof caseStudies[0] }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid var(--gray-200)',
      borderRadius: 'var(--radius-md)',
      padding: '32px 28px',
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      cursor: 'pointer',
      position: 'relative' as const,
      overflow: 'hidden',
    }}
    className="case-card"
    >
      <div style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--primary)', marginBottom: 8 }}>{cs.tag}</div>
        <div style={{ fontSize: 36, fontWeight: 300, color: 'var(--gray-900)', lineHeight: 1, fontFamily: 'var(--font-display)' }}>{cs.stat}</div>
        <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>{cs.statLabel}</div>
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--gray-600)', flex: 1 }}>{cs.title}</div>
      <Link href={cs.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--primary)', marginTop: 20, textDecoration: 'none' }}>
        Read Case Study
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
      </Link>
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
        <RevealOnScroll delay={0.2}>
          <p className="section-desc">Real outcomes from real practices. Every figure is documented with full methodology.</p>
        </RevealOnScroll>

        {/* Desktop */}
        <div className="hero-cases cases-desktop" style={{ marginTop: 48, gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {caseStudies.map((cs, i) => (
            <RevealOnScroll key={i} direction="scale" delay={0.3 + i * 0.25}>
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
