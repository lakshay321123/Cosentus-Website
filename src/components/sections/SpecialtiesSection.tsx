'use client'

/**
 * SpecialtiesSection
 *
 * Dedicated home-page section showcasing the six specialty practices
 * Cosentus serves, each linking to its own specialty page. Replaces
 * (and richens) the small glass pills that used to live in the hero.
 *
 * Why a dedicated section instead of pills in the hero:
 *   - Hero is now narrative-only (H1 + immersive video) so the viewer
 *     gets a clean first impression before being asked to choose
 *   - Specialties deserve more than a label — a short value-prop line
 *     per card makes the page useful for a CFO/admin who's deciding
 *     whether to click through
 *   - Card layout lets the section breathe and act as a hard visual
 *     break between the agent-grid and the results numbers above and
 *     below it in the page flow
 *
 * Each card is a Next <Link>, so the whole tile is clickable and
 * keyboard-navigable. No JS click handlers needed.
 */

import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

type Specialty = {
  label: string
  href: string
  blurb: string
}

const specialties: Specialty[] = [
  {
    label: 'Anesthesia',
    href: '/specialties/anesthesia',
    blurb: 'Time-unit precision, modifier accuracy, and concurrency rules — built by anesthesia veterans.',
  },
  {
    label: 'Orthopedics',
    href: '/specialties/orthopedics',
    blurb: 'Surgical coding, global periods, implant pass-throughs, and workers\u2019 comp handled end-to-end.',
  },
  {
    label: 'Pain Management',
    href: '/specialties/pain-management',
    blurb: 'Interventional injections, RFA, SCS, medical-necessity documentation defense.',
  },
  {
    label: 'ASCs',
    href: '/specialties/asc',
    blurb: 'Coordinated facility + professional billing, case costing, contract underpayment recovery.',
  },
  {
    label: 'Behavioral Health',
    href: '/specialties/behavioral-health',
    blurb: 'Time-based therapy CPTs, IOP/PHP bundling, telehealth modifiers, authorization tracking.',
  },
  {
    label: 'Multi-Specialty',
    href: '/specialties/multi-specialty',
    blurb: 'Mixed-specialty groups, multi-site operations, and primary care \u2014 one accountable RCM partner.',
  },
]

export default function SpecialtiesSection() {
  return (
    <section
      className="section specialties-section"
      id="specialties"
      style={{ overflow: 'hidden', position: 'relative' }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <RevealOnScroll direction="up" delay={0.1}>
          <header className="specialties-header">
            <h2 className="specialties-title">
              Built for <span className="accent">your</span> specialty.
            </h2>
            <p className="specialties-subtitle">
              Pick your specialty to see exactly how Cosentus handles its billing complexity.
            </p>
          </header>
        </RevealOnScroll>

        <div className="specialties-grid">
          {specialties.map((s, i) => (
            <RevealOnScroll
              key={s.href}
              direction="up"
              delay={0.15 + i * 0.05}
            >
              <Link href={s.href} className="specialty-card">
                <div className="specialty-card-inner">
                  <h3 className="specialty-card-title">{s.label}</h3>
                  <p className="specialty-card-blurb">{s.blurb}</p>
                  <span className="specialty-card-cta" aria-hidden="true">
                    Learn more
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="specialty-card-arrow"
                    >
                      <path
                        d="M3 7h8m0 0L7 3m4 4l-4 4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>

      <style>{`
        .specialties-section {
          padding-top: 96px;
          padding-bottom: 96px;
        }

        .specialties-header {
          /* Left-aligned per user direction. max-width keeps line
             length readable for the subtitle; margin-bottom matches
             the previous centered layout. */
          text-align: left;
          max-width: 720px;
          margin: 0 0 48px;
        }

        .specialties-title {
          font-family: var(--font-display);
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 300;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 16px;
          color: var(--gray-900);
        }
        .specialties-title .accent {
          color: #00B5D6;
          font-style: italic;
        }

        .specialties-subtitle {
          font-size: 17px;
          line-height: 1.5;
          color: var(--gray-600);
          margin: 0;
        }

        .specialties-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .specialty-card {
          /* Whole tile is the link; remove default underline + inherit
             color so the inner styles win. */
          display: block;
          text-decoration: none;
          color: inherit;
          height: 100%;
          /* The visual frame is the inner div so the focus ring on
             the link reads as a tight outline around the actual card.
             Default link focus ring would feel detached. */
          border-radius: 16px;
        }
        .specialty-card:focus-visible {
          outline: 2px solid #00B5D6;
          outline-offset: 3px;
        }

        .specialty-card-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 28px;
          border-radius: 16px;
          /* Glass treatment that matches the rest of the home-immersive
             surfaces. Same recipe family as testimonial cards: low
             white wash + thin border + subtle backdrop blur. */
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(12px) saturate(140%);
          -webkit-backdrop-filter: blur(12px) saturate(140%);
          transition:
            transform 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
            background-color 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
            border-color 280ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .specialty-card:hover .specialty-card-inner {
          transform: translateY(-4px);
          background-color: rgba(255, 255, 255, 0.10);
          border-color: rgba(0, 181, 214, 0.40);
        }

        .specialty-card-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.01em;
          margin: 0 0 12px;
          color: var(--gray-900);
        }

        .specialty-card-blurb {
          font-size: 15px;
          line-height: 1.5;
          color: var(--gray-600);
          margin: 0 0 20px;
          /* Flex-grow so the CTA always sits at the bottom of the
             card regardless of blurb length. */
          flex: 1;
        }

        .specialty-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #00B5D6;
          /* Arrow nudges right on hover via the .specialty-card:hover
             selector below — gives the affordance some life. */
        }

        .specialty-card-arrow {
          transition: transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .specialty-card:hover .specialty-card-arrow {
          transform: translateX(3px);
        }

        @media (max-width: 1024px) {
          .specialties-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .specialties-section {
            padding-top: 64px;
            padding-bottom: 64px;
          }
          .specialties-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .specialty-card-inner {
            padding: 22px;
          }
          .specialty-card-title {
            font-size: 20px;
          }
          .specialty-card-blurb {
            font-size: 14.5px;
          }
        }
      `}</style>
    </section>
  )
}
