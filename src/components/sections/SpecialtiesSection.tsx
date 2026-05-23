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
import MobileCarousel from '@/components/ui/MobileCarousel'

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
  /* Mobile carousel pages of 3.
     Per user direction "i want to show 3 specialties at a time. Show
     three and then scroll for the next three. Auto scroll."

     6 cards split into 2 pages of 3 stacked vertically:
       Page 1: Anesthesia, Orthopedics, Pain Management
       Page 2: ASCs, Behavioral Health, Multi-Specialty
     Each page becomes one slide of the carousel. MobileCarousel
     handles auto-scroll, dots, touch swipe, IntersectionObserver
     enter, reduced-motion respect — the same proven component
     already used by Results / Services / Advantages on this page.

     The PAGE_SIZE = 3 is a deliberate choice; 6 specialties / 3
     per page gives exactly 2 slides, which reads as a binary
     "first half / second half" pagination. A different total
     would need different grouping. */
  const PAGE_SIZE = 3
  const pages: Specialty[][] = []
  for (let i = 0; i < specialties.length; i += PAGE_SIZE) {
    pages.push(specialties.slice(i, i + PAGE_SIZE))
  }

  // Single card renderer reused for both desktop and mobile layouts
  // so any future copy/icon/CTA changes only touch one place.
  const renderCard = (s: Specialty, i: number) => (
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
  )

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
              Built for <span className="accent">your</span> specialty
            </h2>
          </header>
        </RevealOnScroll>

        {/* Desktop / tablet: existing grid layout (3-col >1024px, 2-col 601-1024px).
            Hidden on mobile via the .specialties-desktop CSS rule below. */}
        <div className="specialties-grid specialties-desktop">
          {specialties.map(renderCard)}
        </div>

        {/* Mobile (<=600px): MobileCarousel with each slide containing
            3 cards stacked vertically. Auto-scrolls between Page 1
            (Anesthesia / Orthopedics / Pain Management) and Page 2
            (ASCs / Behavioral Health / Multi-Specialty). MobileCarousel
            renders <>{children}</> on desktop, but we hide this whole
            block via CSS on desktop anyway so the desktop grid above
            is the only visible layout there. autoScrollInterval 5000ms
            (vs MobileCarousel default 4000) — gives the user enough
            time to read 3 cards per page before advancing. */}
        <div className="specialties-mobile">
          <MobileCarousel autoScrollInterval={5000}>
            {pages.map((page, pageIdx) => (
              <div key={pageIdx} className="specialties-page">
                {page.map((s, i) => renderCard(s, pageIdx * PAGE_SIZE + i))}
              </div>
            ))}
          </MobileCarousel>
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
          /* GLASS-SQUARE recipe — 100% faithful to glass_square.svg
             (CorelDRAW export supplied by user). The SVG composes to
             two visible layers:
               1. 50% white outline ring (~1% of side thick) -> border
               2. 30% white wash inside the ring             -> background
             The SVG body is uniformly flat — no diagonal gradients
             across the face. */
          background: rgba(255, 255, 255, 0.20);
          border: 1.5px solid rgba(255, 255, 255, 0.50);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.20);
          /* overflow:hidden so any future :after content (none today)
             clips to the rounded corners. position kept for any
             absolute children. */
          position: relative;
          overflow: hidden;
          transition:
            transform 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
            background-color 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
            border-color 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
            box-shadow 280ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        /* GLASS-SQUARE recipe — 100% faithful to glass_square.svg.
           The SVG composes to:
             1. .fil1 = 30% white wash       -> background (above)
             2. .fil0 = 50% white outline    -> border (above)
           That's it. Previously we had ::before/::after pseudos
           painting full-face diagonal gradients, but the source
           SVG has flat body + thin outline only. Removed per user
           direction "100% copy of what I sent you". */

        /* Hover lift — gated behind @media (hover: hover) so this
           doesn't fire as sticky-hover on the mobile carousel below.
           Same fix applied to .insight-card and .hero-card. Touch
           devices report hover:none and skip these rules entirely,
           so the card the user grabbed during a swipe doesn't stay
           visually "lifted" after they've moved on to the next one. */
        @media (hover: hover) {
          .specialty-card:hover .specialty-card-inner {
            transform: translateY(-4px);
            background-color: rgba(255, 255, 255, 0.32);
            border-color: rgba(255, 255, 255, 0.75);
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.30);
          }
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
          font-size: var(--text-base);
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
          font-size: var(--text-sm);
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #00B5D6;
          /* Arrow nudges right on hover via the .specialty-card:hover
             selector below — gives the affordance some life. */
        }

        .specialty-card-arrow {
          transition: transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        @media (hover: hover) {
          .specialty-card:hover .specialty-card-arrow {
            transform: translateX(3px);
          }
        }

        @media (max-width: 1024px) {
          .specialties-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Desktop / tablet: show the grid layout, hide mobile carousel.
           Mobile: show the carousel, hide the grid. Mirrors the same
           desktop/mobile toggle pattern used by ResultsSection. */
        .specialties-mobile {
          display: none;
        }
        @media (max-width: 600px) {
          .specialties-section {
            padding-top: 64px;
            padding-bottom: 64px;
          }
          .specialties-desktop {
            display: none;
          }
          .specialties-mobile {
            display: block;
          }
          /* Each carousel slide is a "page" of 3 cards stacked vertically.
             MobileCarousel sizes each slide to 100% width with 'padding: 0 8px'
             and 'overflow: hidden'. We use that width for the column of
             cards; gap 14px between the stacked cards keeps the visual
             rhythm consistent with the desktop grid. */
          .specialties-page {
            display: flex;
            flex-direction: column;
            gap: 14px;
          }
          .specialty-card-inner {
            padding: 22px;
          }
          .specialty-card-title {
            font-size: var(--text-xl);
          }
          .specialty-card-blurb {
            font-size: 14.5px;
          }
        }
      `}</style>
    </section>
  )
}
