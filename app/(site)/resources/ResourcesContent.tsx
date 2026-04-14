'use client'

import { useState } from 'react'
import MotionReveal from '@/components/ui/MotionReveal'
import MobileCarousel from '@/components/ui/MobileCarousel'

const caseStudies = [
  {
    specialty: 'ASC',
    title: 'Collections Doubled, AR Cut in Half',
    headline: '129%',
    headlineLabel: 'Collection Increase',
    summary: 'A 15-surgeon ambulatory surgery center eliminated underpayments and denial issues. Days in AR dropped from 75 to 37, clean claims jumped from 83% to 98%, and overall collections doubled.',
    stats: ['98.6% Coding Accuracy', 'AR >120 Days: 30% → 13%', 'Clean Claims: 83% → 98%', 'Days in AR: 75 → 37'],
    pdf: '/downloads/case-studies/asc-case-study.pdf',
  },
  {
    specialty: 'PAIN MANAGEMENT',
    title: '26% Revenue Increase Through Coding Excellence',
    headline: '26%',
    headlineLabel: 'Revenue Increase',
    summary: 'A multi-modality, multi-location pain clinic with over a dozen clinicians achieved significant revenue growth through E&M documentation improvements, ultrasound guidance coding, and electronic Workers Comp submission.',
    stats: ['Level IV E&M Success', 'Halted High-Cost Injection Loss', 'Electronic WC Submission', 'Custom Modality Dashboards'],
    pdf: '/downloads/case-studies/pain-management-case-study.pdf',
  },
  {
    specialty: 'ORTHOPEDIC',
    title: '46% Revenue Growth, Workers Comp Turnaround Cut',
    headline: '46%',
    headlineLabel: 'Revenue Growth',
    summary: 'A multi-physician orthopedic practice grew revenue from $1.5M to $2.2M while cutting Workers Comp turnaround from 45 to 28 days through surgical coding optimization and contract renegotiation.',
    stats: ['$1.5M → $2.2M Revenue', 'WC Turnaround: 45 → 28 Days', '20% Collections Increase', 'Surgical Coding Optimization'],
    pdf: '/downloads/case-studies/orthopedic-case-study.pdf',
  },
]

const whitepapers = [
  { title: 'Top 5 Strategies for Scaling an Outpatient Facility', desc: 'Proven approaches to grow your outpatient practice while maintaining operational efficiency and quality of care.', pdf: '' },
  { title: 'The Ultimate Accounts Receivable Checklist', desc: 'A comprehensive AR management checklist covering every stage from claim submission to final payment.', pdf: '' },
  { title: '7 Key Elements of Effective Accounts Receivable Management', desc: 'Essential strategies and best practices for optimizing your AR management process and accelerating cash flow.', pdf: '' },
]

export default function ResourcesContent() {
  const [viewingPdf, setViewingPdf] = useState<{ title: string; pdf: string } | null>(null)

  return (
    <>
      {/* Case Studies */}
      <section className="section">
        <div className="container">
          <MotionReveal>
            <div className="section-label">PROVEN RESULTS</div>
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <div className="section-title">Case Studies</div>
          </MotionReveal>
          <MotionReveal delay={0.2}>
            <p className="section-desc">Real outcomes from real practices. Every figure is documented with full methodology.</p>
          </MotionReveal>

          <div className="cases-cards-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24, marginTop: 48 }}>
            {caseStudies.map((cs, i) => (
              <MotionReveal key={i} delay={i * 0.1}>
                <div role="button" tabIndex={0} onClick={() => setViewingPdf({ title: cs.title, pdf: cs.pdf })} onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") setViewingPdf({ title: cs.title, pdf: cs.pdf }) }} style={{ background: 'var(--white)', borderRadius: 12, border: '1px solid var(--gray-200)', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease', height: '100%', display: 'flex', flexDirection: 'column' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,181,214,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div style={{ background: '#00B5D6', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 4 }}>{cs.specialty}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 32, fontWeight: 700, color: 'white', lineHeight: 1 }}>{cs.headline}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{cs.headlineLabel}</div>
                    </div>
                  </div>
                  <div style={{ padding: '24px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 12, lineHeight: 1.4 }}>{cs.title}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--gray-600)', marginBottom: 20, flex: 1 }}>{cs.summary}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                      {cs.stats.map((stat, j) => (
                        <span key={j} style={{ fontSize: 12, padding: '4px 10px', background: 'var(--primary-ghost)', color: '#00B5D6', borderRadius: 4, fontWeight: 500 }}>{stat}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#00B5D6' }}>Read Case Study →</div>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>
          <div className="cases-cards-mobile" style={{ overflow: 'hidden', width: '100%', marginTop: 32 }}>
            <MobileCarousel autoScrollInterval={6000}>
              {caseStudies.map((cs, i) => (
                <div key={i} role="button" tabIndex={0} onClick={() => setViewingPdf({ title: cs.title, pdf: cs.pdf })} onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") setViewingPdf({ title: cs.title, pdf: cs.pdf }) }} style={{ background: 'var(--white)', borderRadius: 12, border: '1px solid var(--gray-200)', overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ background: '#00B5D6', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 4 }}>{cs.specialty}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 28, fontWeight: 700, color: 'white', lineHeight: 1 }}>{cs.headline}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{cs.headlineLabel}</div>
                    </div>
                  </div>
                  <div style={{ padding: '20px 24px' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 8, lineHeight: 1.4 }}>{cs.title}</h3>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--gray-600)', marginBottom: 16 }}>{cs.summary}</p>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#00B5D6' }}>Read Case Study →</div>
                  </div>
                </div>
              ))}
            </MobileCarousel>
          </div>
        </div>
      </section>

      {/* White Papers */}
      <section className="section section-alt">
        <div className="container">
          <MotionReveal>
            <div className="section-label">KNOWLEDGE BASE</div>
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <div className="section-title">White Papers</div>
          </MotionReveal>
          <MotionReveal delay={0.2}>
            <p className="section-desc">Free resources to help your practice grow revenue and optimize operations.</p>
          </MotionReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24, marginTop: 48 }}>
            {whitepapers.map((wp, i) => (
              <MotionReveal key={i} delay={i * 0.1}>
                <div style={{
                  background: 'var(--white)', borderRadius: 12, border: '1px solid var(--gray-200)',
                  padding: 28, transition: 'all 0.3s ease', height: '100%',
                  display: 'flex', flexDirection: 'column',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--primary-ghost)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#00B5D6" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 8, lineHeight: 1.4 }}>{wp.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--gray-600)', marginBottom: 20, flex: 1 }}>{wp.desc}</p>
                  <div style={{ fontSize: 13, color: 'var(--gray-400)', fontStyle: 'italic' }}>Coming soon</div>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Embedded PDF Viewer Overlay */}
      {viewingPdf && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', flexDirection: 'column',
          animation: 'fadeIn 0.3s ease',
        }}>
          {/* Header bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 24px', background: '#1a1a1a', flexShrink: 0,
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: 'white', margin: 0 }}>{viewingPdf.title}</h3>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <a
                href={viewingPdf.pdf}
                download
                style={{ fontSize: 13, color: '#00B5D6', textDecoration: 'none', fontWeight: 500, padding: '6px 16px', border: '1px solid #00B5D6', borderRadius: 6 }}
              >
                Download PDF
              </a>
              <button
                onClick={() => setViewingPdf(null)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 18 }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* PDF iframe */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 24px 24px' }}>
            <iframe
              src={viewingPdf.pdf}
              style={{ width: '100%', maxWidth: 900, height: '100%', border: 'none', borderRadius: 8, background: 'white' }}
              title={viewingPdf.title}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  )
}
