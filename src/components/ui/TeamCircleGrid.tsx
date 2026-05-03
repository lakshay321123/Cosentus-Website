'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'

/**
 * One row member for TeamCircleGrid.
 * `bio` is optional — when present and onPersonClick is wired up, the card
 * becomes interactive (click/keyboard) and opens the parent's modal.
 */
export interface TeamMember {
  name: string
  title: string
  photo?: string
  bio?: string
}

interface Props {
  /** People to render in the circle grid. */
  people: TeamMember[]
  /**
   * Optional click handler. When provided, cards render as buttons with
   * keyboard handlers and a hover lift. When omitted, cards render as
   * non-interactive divs (no false affordance, no hover lift).
   */
  onPersonClick?: (person: TeamMember) => void
  /**
   * Object-position for each headshot. Defaults to 'center 20%' which
   * frames most professional headshots correctly (faces sit slightly
   * above center). Override per-page if a particular set of photos
   * frames differently.
   */
  objectPosition?: string
  /** RevealOnScroll base delay so a section above can stagger before this. */
  baseDelay?: number
}

/**
 * Reusable circle-avatar grid for leadership / team sections, modeled on
 * the homepage RA voice-agent pattern. The reasons it lives in one
 * component:
 *
 *   1. Mobile correctness — hard 3-column grid that stays 3 cols at every
 *      viewport. The previous per-page grids used auto-fill minmax(200px)
 *      which collapsed to 1 column on phones (~430px) and made the team
 *      "stack one after another", a real complaint.
 *   2. Single source of truth — circle size, border, shadow, hover, and
 *      typography all live here. Any future polish (animation, focus ring,
 *      etc.) edits exactly one file.
 *   3. Visual consistency with the voice agents — the RA section's circles
 *      are the brand reference for "human + AI face cards". Real humans
 *      should match.
 */
export default function TeamCircleGrid({
  people,
  onPersonClick,
  objectPosition = 'center 20%',
  baseDelay = 0,
}: Props) {
  const interactive = !!onPersonClick

  return (
    <>
      <div className="team-circle-grid">
        {people.map((person, i) => {
          const initials = person.name.split(' ').map(n => n[0]).join('')
          const cardCommonStyle: React.CSSProperties = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            transition: 'transform 0.3s ease',
            cursor: interactive ? 'pointer' : 'default',
            outline: 'none',
            background: 'transparent',
            border: 'none',
            padding: 0,
            // Keep the cell width controlled so long titles wrap predictably.
            width: '100%',
          }
          const handleHoverIn = (e: React.MouseEvent<HTMLElement>) => {
            if (interactive) e.currentTarget.style.transform = 'translateY(-4px)'
          }
          const handleHoverOut = (e: React.MouseEvent<HTMLElement>) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }
          const innerContent = (
            <>
              <div className="team-circle">
                {person.photo ? (
                  <img
                    src={person.photo}
                    alt={person.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition,
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: 600,
                      color: '#00B5D6',
                      fontFamily: 'var(--font-display)',
                    }}
                    aria-hidden="true"
                  >
                    {initials}
                  </span>
                )}
              </div>
              <div className="team-circle-name">{person.name}</div>
              <div className="team-circle-title">{person.title}</div>
            </>
          )

          return (
            <RevealOnScroll key={person.name + i} delay={baseDelay + i * 0.04}>
              {interactive ? (
                <button
                  type="button"
                  aria-label={`View bio for ${person.name}, ${person.title}`}
                  onClick={() => onPersonClick!(person)}
                  onMouseEnter={handleHoverIn}
                  onMouseLeave={handleHoverOut}
                  style={cardCommonStyle}
                >
                  {innerContent}
                </button>
              ) : (
                <div style={cardCommonStyle}>{innerContent}</div>
              )}
            </RevealOnScroll>
          )
        })}
      </div>

      {/* Scoped styles — all sizes/breakpoints copied from RASection.tsx
          (homepage voice-agent grid) so the two patterns stay visually identical. */}
      <style jsx>{`
        .team-circle-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 36px 20px;
          margin-top: 36px;
        }
        .team-circle {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          overflow: hidden;
          background: #f5f9fa;
          border: 3px solid #00B5D6;
          box-shadow: 0 6px 20px rgba(0, 181, 214, 0.18);
          margin-bottom: 14px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .team-circle-name {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          color: var(--gray-900);
          letter-spacing: 0.01em;
          line-height: 1.2;
        }
        .team-circle-title {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 500;
          color: var(--gray-700);
          margin-top: 4px;
          line-height: 1.3;
          letter-spacing: 0.01em;
        }
        @media (max-width: 1100px) {
          .team-circle-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 32px 16px;
          }
          .team-circle {
            width: 120px;
            height: 120px;
          }
        }
        @media (max-width: 768px) {
          .team-circle-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px 10px;
          }
          .team-circle {
            width: 96px;
            height: 96px;
            border-width: 2px;
            margin-bottom: 10px;
          }
          .team-circle-name {
            font-size: 14px;
            font-weight: 700;
          }
          .team-circle-title {
            font-size: 11px;
            margin-top: 3px;
          }
        }
        @media (max-width: 420px) {
          .team-circle-grid {
            gap: 22px 8px;
          }
          .team-circle {
            width: 84px;
            height: 84px;
          }
        }
      `}</style>
    </>
  )
}
