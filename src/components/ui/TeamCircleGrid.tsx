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
  /**
   * Number of columns at desktop (>=1100px). Default 5. Smaller values
   * (e.g. 3 for the About leadership grid where there are exactly 9
   * people in 3x3) give each cell more room and let the circles be
   * bigger. The component automatically sizes circles up when columns
   * are set to 3 or 4.
   */
  desktopColumns?: number
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
  desktopColumns = 5,
}: Props) {
  const interactive = !!onPersonClick

  // Pick a desktop circle size that fits well in the chosen column count.
  // 3-col layouts (e.g. About) get the largest portraits; 4 and 5-col
  // layouts (specialty pages) keep meaningfully large circles too — the
  // user explicitly asked for the size bump on About to also land on
  // specialty pages with staff images. Mobile is fixed in CSS since
  // column count is always 3 there.
  const desktopCircleSize =
    desktopColumns <= 3 ? 200 :
    desktopColumns === 4 ? 190 :
    180

  return (
    <>
      <div
        className="team-circle-grid"
        style={
          // CSS custom properties drive the desktop column count and circle
          // size — see the styled-jsx block below. Mobile uses fixed
          // hard-coded sizes (always 3 cols).
          //
          // For 3-column layouts (currently just About leadership), we also
          // cap the grid at a narrower max-width and center it. Without the
          // cap, 3 columns of 1fr each spread across the full ~1200px
          // container, which puts the 200px circles ~200px apart visually
          // and reads as "too wide apart". Capping at 920px tightens the
          // adjacent-circle distance to roughly 100px while keeping the
          // text below each circle from feeling cramped.
          {
            ['--tcg-cols' as string]: desktopColumns,
            ['--tcg-size' as string]: `${desktopCircleSize}px`,
            ...(desktopColumns === 3 ? {
              maxWidth: 920,
              marginLeft: 'auto',
              marginRight: 'auto',
            } : {}),
          } as React.CSSProperties
        }
      >
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

      {/* Scoped styles — desktop layout is controlled by CSS custom
          properties (--tcg-cols, --tcg-size) set inline by the component
          based on the desktopColumns prop. Mobile is fixed at 3 cols with
          larger circles and tight column gap to feel dense and tappable. */}
      <style jsx>{`
        .team-circle-grid {
          /* Desktop/tablet (>768px): flex-wrap so a partial last row
             CENTERS under the rows above (per user direction, Jun 2026)
             instead of left-aligning. Column count is still driven by
             --tcg-cols, applied as the child flex-basis below. Mobile
             (<=768px) reverts to a fixed 3-column GRID (see media query
             — display:grid is restored there), so mobile is unchanged. */
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 40px 20px;
          margin-top: 36px;
        }
        .team-circle-grid > :global(*) {
          /* Each card spans one of --tcg-cols columns; column-gap is 20px
             so (cols-1) gaps are subtracted, plus 2px rounding safety.
             Ignored in the mobile grid mode (flex props don't apply to
             grid items). */
          flex: 0 0 calc((100% - (var(--tcg-cols, 5) - 1) * 20px - 2px) / var(--tcg-cols, 5));
        }
        .team-circle {
          width: var(--tcg-size, 180px);
          height: var(--tcg-size, 180px);
          border-radius: 50%;
          overflow: hidden;
          background: #f5f9fa;
          border: 3px solid #00B5D6;
          box-shadow: 0 6px 20px rgba(0, 181, 214, 0.18);
          margin-bottom: 16px;
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
          /* Tablet: clamp the desktop circle so a 200px circle doesn't
             dominate at narrower widths, but keep the column count the
             component asked for. */
          .team-circle {
            width: min(var(--tcg-size, 180px), 150px);
            height: min(var(--tcg-size, 180px), 150px);
          }
        }
        @media (max-width: 768px) {
          /* Mobile: always 3 cols, bigger circles than before, tighter
             column gap so the row reads as a dense row of three. The user
             explicitly asked for "bigger circles and closer" on mobile. */
          .team-circle-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 26px 4px;
          }
          .team-circle {
            width: 116px !important;
            height: 116px !important;
            border-width: 2px;
            margin-bottom: 12px;
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
            gap: 22px 2px;
          }
          .team-circle {
            width: 104px !important;
            height: 104px !important;
          }
        }
      `}</style>
    </>
  )
}
