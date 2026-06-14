'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'

/**
 * ProblemSolutionSection — single source of truth for every "Problem / Solution" split
 * across the site. Used on /cosentus-ai, /partnership, /services/rcm, /specialties/orthopedics,
 * /specialties/asc, /specialties/pain-management, /specialties/multi-specialty,
 * /specialties/behavioral-health.
 *
 * Typography is locked to homepage classes:
 *   - eyebrow: .section-label (22px)
 *   - heading: .section-title (clamp(32, 4vw, 48px) desktop / 26px mobile)
 *   - body:    .section-desc (17px desktop / 15px mobile)
 *   - bullets: 14px desktop / 13px mobile
 *
 * Design (preserved from prior /cosentus-ai implementation):
 *   - 2-column grid on desktop, stacks on mobile
 *   - White left panel (problem), teal #00B5D6 right panel (solution)
 *   - Corner accent SVG, shimmer overlay on solution
 *   - RevealOnScroll for entry, animated bullets/checks
 *
 * CSS classes referenced (already in app/globals.css):
 *   .problem-solution-grid, .ps-panel, .ps-problem, .ps-solution,
 *   .ps-shimmer, .ps-bullet, .ps-bullet-dot, .ps-bullet-light, .ps-check
 */

interface ProblemSolutionSectionProps {
  /** @deprecated No longer rendered. Kept for API compatibility with existing callers. */
  problemEyebrow?: string
  problemTitle: React.ReactNode
  problemBody?: string
  problemBullets: string[]
  /** @deprecated No longer rendered. Kept for API compatibility with existing callers. */
  solutionEyebrow?: string
  solutionTitle: React.ReactNode
  solutionBody?: string
  solutionBullets: string[]
  /** Optional extra class on the root <section>, for per-page scoped
      style overrides without touching this shared component's defaults. */
  className?: string
}

export default function ProblemSolutionSection({
  problemTitle,
  problemBody,
  problemBullets,
  solutionTitle,
  solutionBody,
  solutionBullets,
  className,
}: ProblemSolutionSectionProps) {
  return (
    <section className={className} style={{ overflow: 'hidden' }}>
      <div
        className="problem-solution-grid"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 480 }}
      >
        {/* Problem panel */}
        <div
          className="ps-panel ps-problem"
          style={{
            padding: 'clamp(56px, 6vw, 88px) clamp(40px, 5vw, 88px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            background: 'var(--white)',
            position: 'relative',
          }}
        >
          {/* Decorative corner accent */}
          <div
            className="ps-corner-accent"
            style={{ position: 'absolute', top: 0, left: 0, width: 80, height: 80, opacity: 0.06 }}
          >
            <svg viewBox="0 0 80 80" fill="none">
              <path d="M0 0h80v80" stroke="#616161" strokeWidth="1" />
            </svg>
          </div>

          <RevealOnScroll direction="left">
            <h2 className="section-title" style={{ marginBottom: 24 }}>
              {problemTitle}
            </h2>
          </RevealOnScroll>

          {problemBody && (
            <RevealOnScroll direction="left" delay={0.2}>
              <p className="section-desc" style={{ marginBottom: 32 }}>{problemBody}</p>
            </RevealOnScroll>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {problemBullets.map((item, i) => (
              <RevealOnScroll key={i} direction="left" delay={0.3 + i * 0.1}>
                <div className="ps-bullet" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    className="ps-bullet-dot"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'var(--gray-400)',
                      flexShrink: 0,
                      transition: 'all 0.4s ease',
                    }}
                  />
                  <span className="ps-bullet-text" style={{ color: 'var(--gray-600)', lineHeight: 1.5 }}>
                    {item}
                  </span>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* Solution panel */}
        <div
          className="ps-panel ps-solution"
          style={{
            padding: 'clamp(56px, 6vw, 88px) clamp(40px, 5vw, 88px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            background: '#00B5D6',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Animated shimmer overlay */}
          <div className="ps-shimmer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

          <RevealOnScroll direction="right">
            <h2 className="section-title ps-solution-title" style={{ color: 'white', marginBottom: 24 }}>
              {solutionTitle}
            </h2>
          </RevealOnScroll>

          {solutionBody && (
            <RevealOnScroll direction="right" delay={0.2}>
              <p
                className="section-desc"
                style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 32 }}
              >
                {solutionBody}
              </p>
            </RevealOnScroll>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {solutionBullets.map((item, i) => (
              <RevealOnScroll key={i} direction="right" delay={0.3 + i * 0.1}>
                <div className="ps-bullet-light" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    className="ps-check"
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.4s ease',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="ps-bullet-text" style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
                    {item}
                  </span>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
