'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

const caseStudies = [
  {
    tag: 'ASC',
    stat: '129%',
    statLabel: 'Collection Increase',
    title: '15-surgeon ASC. Days in AR 75 → 37. Clean claims 83% → 98%. Collections doubled.',
    image: '/images/homepage/surgery-center.jpg',
    pdf: '/downloads/case-studies/asc-case-study.pdf',
  },
  {
    tag: 'Pain Management',
    stat: '26%',
    statLabel: 'Revenue Increase',
    title: 'Multi-modality pain clinic. E&M documentation + ultrasound coding + electronic WC submission.',
    image: '/images/homepage/doctor-consult.jpg',
    pdf: '/downloads/case-studies/pain-management-case-study.pdf',
  },
  {
    tag: 'Orthopedic',
    stat: '46%',
    statLabel: 'Revenue Growth',
    title: '$1.5M to $2.2M. Workers’ Comp turnaround cut from 45 to 28 days.',
    image: '/images/homepage/medical-tech.jpg',
    pdf: '/downloads/case-studies/orthopedic-case-study.pdf',
  },
]

type CaseStudy = typeof caseStudies[0]

type Mode = 'teaser' | 'viewer'

/**
 * Inner card body — pure visual, no click handler.
 * Parent decides click behavior: teaser wraps in <Link>, viewer wraps in clickable div.
 */
function FlipCardBody({ cs }: { cs: CaseStudy }) {
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
        {/* Front, image + stat */}
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

        {/* Back, details */}
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
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 600, color: 'white',
            letterSpacing: '0.05em', textTransform: 'uppercase' as const,
          }}>
            Read Client Success Story
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </span>
        </div>
      </div>
    </div>
  )
}

/** Card wrapper — teaser mode navigates, viewer mode opens PDF modal. */
function FlipCard({ cs, mode, onOpen }: { cs: CaseStudy; mode: Mode; onOpen?: (cs: CaseStudy) => void }) {
  if (mode === 'teaser') {
    return (
      <Link
        href="/case-studies"
        aria-label={`View ${cs.tag} case study`}
        style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
      >
        <FlipCardBody cs={cs} />
      </Link>
    )
  }
  // viewer mode
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${cs.tag} case study`}
      onClick={() => onOpen?.(cs)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen?.(cs) } }}
    >
      <FlipCardBody cs={cs} />
    </div>
  )
}

/**
 * Mobile-only card body. No flip — touch devices have no hover. Image strip on
 * top with the tag/stat overlay (strong gradient + text-shadows so contrast
 * works on any cover photo), title and CTA on a teal panel below. Keeps total
 * card height short so all three cards stack on the page without dwarfing it.
 */
function MobileCardBody({ cs }: { cs: CaseStudy }) {
  return (
    <div style={{
      borderRadius: 16,
      overflow: 'hidden',
      background: '#00B5D6',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
      width: '100%',
      boxShadow: '0 4px 18px rgba(0, 0, 0, 0.10), 0 1px 3px rgba(0, 0, 0, 0.06)',
    }}>
      {/* Top — fixed-height image strip with overlay */}
      <div style={{ position: 'relative', height: 180, width: '100%', flexShrink: 0 }}>
        <img
          src={cs.image}
          alt={cs.tag}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)',
        }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 18px 14px' }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase' as const, color: '#68D1E6',
            marginBottom: 4,
            textShadow: '0 1px 4px rgba(0,0,0,0.7)',
          }}>{cs.tag}</div>
          <div style={{
            fontSize: 36, fontWeight: 300, color: 'white',
            fontFamily: 'var(--font-display)', lineHeight: 1,
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
          }}>{cs.stat}</div>
          <div style={{
            fontSize: 12, color: 'rgba(255,255,255,0.95)', marginTop: 3,
            textShadow: '0 1px 4px rgba(0,0,0,0.7)',
          }}>{cs.statLabel}</div>
        </div>
      </div>

      {/* Bottom — title + CTA on teal panel */}
      <div style={{ padding: '16px 18px 18px' }}>
        <p style={{
          fontSize: 14, lineHeight: 1.5,
          color: 'rgba(255,255,255,0.95)', margin: 0, marginBottom: 12,
        }}>{cs.title}</p>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 11, fontWeight: 700, color: 'white',
          letterSpacing: '0.06em', textTransform: 'uppercase' as const,
        }}>
          Read Client Success Story
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </span>
      </div>
    </div>
  )
}

function MobileCard({ cs, mode, onOpen }: { cs: CaseStudy; mode: Mode; onOpen?: (cs: CaseStudy) => void }) {
  if (mode === 'teaser') {
    return (
      <Link
        href="/case-studies"
        aria-label={`View ${cs.tag} case study`}
        style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
      >
        <MobileCardBody cs={cs} />
      </Link>
    )
  }
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${cs.tag} case study`}
      onClick={() => onOpen?.(cs)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen?.(cs) } }}
    >
      <MobileCardBody cs={cs} />
    </div>
  )
}

export default function CaseStudiesSection({ mode = 'teaser' }: { mode?: Mode } = {}) {
  const [viewingPdf, setViewingPdf] = useState<CaseStudy | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile viewport client-side (SSR has no window)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Google Docs Viewer needs an absolute, publicly-reachable URL
  const pdfAbsoluteUrl = viewingPdf && typeof window !== 'undefined'
    ? `${window.location.origin}${viewingPdf.pdf}`
    : ''

  return (
    <>
      <section className="section" id="cases" style={{ overflow: 'hidden' }}>
        <div className="container">
          <RevealOnScroll direction="left">
            <div className="section-label">PROVEN RESULTS</div>
          </RevealOnScroll>
          <RevealOnScroll direction="left" delay={0.1}>
            <div className="section-title">Client Success Stories</div>
          </RevealOnScroll>

          {/* Desktop, flip cards */}
          <div className="cases-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 48 }}>
            {caseStudies.map((cs, i) => (
              <RevealOnScroll key={i} direction="scale" delay={0.2 + i * 0.12}>
                <FlipCard cs={cs} mode={mode} onOpen={setViewingPdf} />
              </RevealOnScroll>
            ))}
          </div>

          {/* Mobile — vertical stack, no carousel. All three cards visible by scrolling. */}
          <div className="cases-mobile" style={{ width: '100%', marginTop: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>
            {caseStudies.map((cs, i) => (
              <MobileCard key={i} cs={cs} mode={mode} onOpen={setViewingPdf} />
            ))}
          </div>
        </div>
      </section>

      {/* Embedded PDF Viewer Overlay, only mounts in viewer mode */}
      {mode === 'viewer' && viewingPdf && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', flexDirection: 'column',
          animation: 'cs-fadeIn 0.3s ease',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 24px', background: '#1a1a1a', flexShrink: 0,
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: 'white', margin: 0 }}>
              {viewingPdf.tag}, {viewingPdf.statLabel}
            </h3>
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
                aria-label="Close PDF viewer"
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 18 }}
              >
                ✕
              </button>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 24px 24px' }}>
            <iframe
              src={isMobile ? `https://docs.google.com/viewer?url=${encodeURIComponent(pdfAbsoluteUrl)}&embedded=true` : viewingPdf.pdf}
              style={{ width: '100%', maxWidth: 900, height: '100%', border: 'none', borderRadius: 8, background: 'white' }}
              title={`${viewingPdf.tag} case study`}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes cs-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  )
}
