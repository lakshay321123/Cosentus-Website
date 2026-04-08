import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

const caseStudies = [
  {
    tag: 'Anesthesia',
    title: 'A 50+ site anesthesia group eliminated revenue leakage, achieved sub-48-hour turnaround, and drove significant cash flow improvement.',
    href: '/case-studies/anesthesia',
  },
  {
    tag: 'Behavioral Health',
    title: 'Hope Services grew revenue from $2M to $16M serving 3,500+ individuals with developmental disabilities.',
    href: '/case-studies/behavioral-health',
  },
  {
    tag: 'Orthopedic',
    title: "A multi-physician orthopedic practice grew revenue 46% — from $1.5M to $2.2M — while cutting Workers' Comp turnaround from 45 to 28 days.",
    href: '/case-studies/orthopedic',
  },
  {
    tag: 'DME',
    title: 'A high-volume DME provider doubled sales from $82M to $165M, reduced DSO by 56%, and cut denial rates 31%.',
    href: '/case-studies/dme',
  },
]

export default function CaseStudiesSection() {
  return (
    <section className="section" id="cases">
      <div className="container">
        <RevealOnScroll>
          <div className="section-label">PROVEN RESULTS</div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <div className="section-title">Case Studies</div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.2}>
          <p className="section-desc">
            Real outcomes from real practices. Every figure is documented with full methodology.
          </p>
        </RevealOnScroll>

        <div className="hero-cases" style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {caseStudies.map((cs, i) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <div
                className="hero-case"
                style={{
                  background: '#00B5D6',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'none',
                }}
              >
                <div className="hero-case-tag" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {cs.tag}
                </div>
                <div className="hero-case-title" style={{ color: '#FFFFFF' }}>
                  {cs.title}
                </div>
                <Link href={cs.href} className="hero-case-link" style={{ color: '#FFFFFF' }}>
                  Read Case Study <ArrowIcon />
                </Link>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
