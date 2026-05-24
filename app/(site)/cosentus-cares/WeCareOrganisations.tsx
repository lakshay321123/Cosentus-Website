'use client'

import { useState } from 'react'

interface Organisation {
  name: string
  logo: string
  href?: string
  paragraphs: string[]
}

interface Props {
  organisations: Organisation[]
}

/**
 * Threshold: cards whose total description text exceeds this many chars,
 * OR which have more than one paragraph, get a "Read more" button. Below
 * the threshold the text fits comfortably inside the 6-line clamp without
 * the user noticing any truncation, so no toggle is shown.
 */
const READ_MORE_CHAR_THRESHOLD = 250

export default function WeCareOrganisations({ organisations }: Props) {
  // Track which card indices are currently expanded. A Set instead of a
  // boolean array keeps the JSX simple and the comparison cheap.
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const toggle = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <>
      <div className="wecare-orgs-grid">
        {organisations.map((org, i) => {
          const isExpanded = expanded.has(i)
          const totalChars = org.paragraphs.join(' ').length
          const hasMore =
            org.paragraphs.length > 1 || totalChars > READ_MORE_CHAR_THRESHOLD

          return (
            <div
              key={org.name}
              className="wecare-org-card"
              style={{
                // Every collapsed card has the SAME minimum height so the
                // grid reads as a uniform set, regardless of how short the
                // description actually is. Expanded cards grow naturally.
                minHeight: isExpanded ? 'auto' : 380,
              }}
            >
              <div className="wecare-org-logo-box">
                <img
                  src={org.logo}
                  alt={`${org.name} logo`}
                  loading="lazy"
                  className="wecare-org-logo"
                />
              </div>

              <h4 className="wecare-org-name">{org.name}</h4>

              <div
                className={`wecare-org-desc ${isExpanded ? '' : 'clamped'}`}
              >
                {org.paragraphs.map((p, pi) => (
                  <p
                    key={pi}
                    style={{
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: 'var(--gray-600)',
                      marginTop: pi > 0 ? 12 : 0,
                      marginBottom: 0,
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>

              <div className="wecare-org-actions">
                {hasMore ? (
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="wecare-org-readmore"
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? 'Show less' : 'Read more'}
                  </button>
                ) : (
                  /* Spacer so "Visit site" stays right-aligned even when
                     there is no Read more on this card */
                  <span />
                )}

                {org.href && (
                  <a
                    href={org.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wecare-org-visit"
                  >
                    Visit site ↗
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .wecare-orgs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
          margin-top: 56px;
        }
        .wecare-org-card {
          padding: 28px;
          background: var(--white);
          border-radius: var(--radius-md);
          border: 1px solid var(--gray-200);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
        }
        .wecare-org-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
          border-color: rgba(0, 181, 214, 0.3);
        }

        /* Logo: every logo lives inside the same 64px-tall box. The image
           itself is capped at 56px tall and 170px wide, so wide logos hit
           the width cap first (becoming shorter) and tall logos hit the
           height cap first. The visual size lands in a tight band even
           though the source files have wildly different aspect ratios. */
        .wecare-org-logo-box {
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .wecare-org-logo {
          display: block;
          max-height: 56px;
          max-width: 170px;
          width: auto;
          height: auto;
          object-fit: contain;
          /* brightness(0) multiplies RGB by 0 -> solid black, alpha
             preserved. No invert in the chain so no pixelation. */
          filter: brightness(0);
          opacity: 0.85;
          transition: opacity 0.25s ease;
        }
        .wecare-org-card:hover .wecare-org-logo {
          opacity: 1;
        }

        .wecare-org-name {
          font-size: 18px;
          font-weight: 500;
          color: var(--gray-900);
          margin-bottom: 12px;
          font-family: var(--font-display);
        }

        .wecare-org-desc {
          flex: 1;
        }
        /* Truncate to 6 lines when collapsed. -webkit-line-clamp counts
           visual lines across nested <p> blocks. Most modern browsers
           support -webkit-line-clamp regardless of the prefix. */
        .wecare-org-desc.clamped {
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .wecare-org-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 16px;
          flex-wrap: wrap;
        }
        .wecare-org-readmore {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: var(--primary);
          font-family: inherit;
        }
        .wecare-org-readmore:hover {
          text-decoration: underline;
        }
        .wecare-org-visit {
          font-size: 13px;
          font-weight: 500;
          color: var(--gray-700);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .wecare-org-visit:hover {
          color: var(--primary);
        }
      `}</style>
    </>
  )
}
