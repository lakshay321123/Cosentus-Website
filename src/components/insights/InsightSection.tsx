'use client'

import { useState } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import InsightCard, { InsightCardData } from './InsightCard'

type Props = {
  label: string                  // e.g. "CASE STUDIES"
  title: string                  // e.g. "Real Practices. Real Revenue Growth."
  items: InsightCardData[]
  initial?: number               // default 3
  loadMoreStep?: number          // default 3
  viewAllHref?: string           // null → no View All link
  ctaLabel?: string              // per-section card CTA wording
  alt?: boolean                  // alt background (section-alt)
  emptyMessage?: string
}

export default function InsightSection({
  label,
  title,
  items,
  initial = 3,
  loadMoreStep = 3,
  viewAllHref,
  ctaLabel = 'Read More',
  alt = false,
  emptyMessage = 'New content coming soon.',
}: Props) {
  const [visible, setVisible] = useState(initial)
  const total = items.length
  const shown = items.slice(0, visible)
  const canLoadMore = visible < total

  return (
    <section className={alt ? 'section section-alt' : 'section'} style={{ overflow: 'hidden' }}>
      <div className="container">
        <RevealOnScroll>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
            marginBottom: 36,
          }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 3.6vw, 42px)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--gray-900)',
                marginTop: 0,
                marginBottom: 0,
              }}>
                {title}
              </h2>
            </div>
            {viewAllHref && total > 0 && (
              <Link
                href={viewAllHref}
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: '#00B5D6',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 18px',
                  border: '1px solid #00B5D6',
                  borderRadius: 999,
                  transition: 'all 0.25s ease',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-body)',
                }}
                className="view-all-link"
              >
                View All
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            )}
          </div>
        </RevealOnScroll>

        {total === 0 ? (
          <div style={{
            padding: '48px 32px',
            background: 'var(--white)',
            border: '1px dashed var(--gray-300)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            color: 'var(--gray-500)',
            fontSize: 'var(--text-base)',
          }}>
            {emptyMessage}
          </div>
        ) : (
          <div className="insight-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}>
            {shown.map((item, i) => (
              <RevealOnScroll key={`${item.href}-${i}`} delay={Math.min(0.05 * (i % 3), 0.2)}>
                <InsightCard item={item} ctaLabel={ctaLabel} />
              </RevealOnScroll>
            ))}
          </div>
        )}

        {canLoadMore && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
            <button
              onClick={() => setVisible(v => Math.min(v + loadMoreStep, total))}
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--gray-700)',
                background: 'var(--white)',
                border: '1px solid var(--gray-300)',
                padding: '12px 28px',
                borderRadius: 999,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                fontFamily: 'var(--font-body)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
              className="load-more-btn"
            >
              Load More
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .insight-grid > * { height: 100%; }
        @media (max-width: 900px) {
          .insight-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 18px !important; }
        }
        @media (max-width: 580px) {
          .insight-grid { grid-template-columns: 1fr !important; }
        }
        .view-all-link:hover { background: #00B5D6; color: white !important; }
        .view-all-link:hover svg { stroke: white; }
        .load-more-btn:hover {
          border-color: #00B5D6;
          color: #00B5D6;
        }
      `}</style>
    </section>
  )
}
