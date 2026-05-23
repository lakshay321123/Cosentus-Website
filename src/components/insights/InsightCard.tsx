'use client'

import Link from 'next/link'

export type InsightCardData = {
  href: string
  title: string
  image?: string
  /**
   * Optional CSS object-position value for the cover image (e.g.
   * 'center top', '50% 20%'). Useful when the source image is a
   * portrait or has the subject in the upper portion and the
   * default centre-centre crop would cut the head off in the
   * 16:9 container. Defaults to 'center center'.
   */
  imagePosition?: string
  tag?: string
  date?: string
  external?: boolean // true → opens in new tab
}

export default function InsightCard({ item, ctaLabel = 'Read More' }: { item: InsightCardData; ctaLabel?: string }) {
  const linkProps = item.external
    ? { href: item.href, target: '_blank' as const, rel: 'noopener noreferrer' }
    : { href: item.href }

  return (
    <Link
      {...linkProps}
      className="insight-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--white)',
        border: '1px solid var(--gray-200)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease',
      }}
    >
      {/* Image, uniform 16:9 aspect */}
      {item.image ? (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', background: 'var(--gray-100)' }}>
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="insight-card-img"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: item.imagePosition ?? 'center center',
              transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
          {item.tag && (
            <span style={{
              position: 'absolute', top: 14, left: 14,
              background: 'rgba(0, 181, 214, 0.95)',
              color: 'white',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '5px 10px', borderRadius: 4,
              backdropFilter: 'blur(4px)',
            }}>
              {item.tag}
            </span>
          )}
        </div>
      ) : (
        // No image fallback — gradient block keeps card heights aligned
        <div style={{
          width: '100%',
          aspectRatio: '16 / 9',
          background: 'linear-gradient(135deg, #D6EBF2 0%, #A1DEED 100%)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {item.tag && (
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: '#00B5D6',
            }}>
              {item.tag}
            </span>
          )}
        </div>
      )}

      {/* Body */}
      <div className="insight-card-body" style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {item.date && (
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--gray-500)',
            marginBottom: 8,
          }}>
            {item.date}
          </div>
        )}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 17, fontWeight: 600,
          lineHeight: 1.35,
          letterSpacing: '-0.01em',
          color: 'var(--gray-900)',
          marginBottom: 16,
          // 3-line clamp keeps card heights uniform across the row
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}>
          {item.title}
        </h3>

        <div style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13, fontWeight: 600,
          color: '#00B5D6',
        }}>
          <span>{ctaLabel}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>

      <style>{`
        .insight-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0, 181, 214, 0.12);
          border-color: rgba(0, 181, 214, 0.3);
        }
        .insight-card:hover .insight-card-img {
          transform: scale(1.05);
        }
      `}</style>
    </Link>
  )
}
