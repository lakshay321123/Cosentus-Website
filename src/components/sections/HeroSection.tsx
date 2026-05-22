'use client'

/**
 * HeroSection — direct SVG plug-in of the supplied design.
 *
 * Per user direction (this conversation, May 22 2026):
 *   "see the reference image / Recreate it / I have given you each and
 *    every svg / just plug it!"
 *
 * Approach: each design element is one of the supplied SVGs in
 * /public/images/hero/, placed via a CSS Grid that mirrors the spec
 * layout. No CSS recreation. No typography work. No clever positioning
 * math. Two columns:
 *   LEFT  -> headline-1, headline-2, button row (Specialties + Contact)
 *   RIGHT -> 3-card staircase (Zeus, Agents, Net Collection)
 *
 * Geometry from measuring the spec image (5989 x 3270 reference, ~1.83:1):
 *   - Card cluster: ~50% vw wide, bottom-right of viewport, touches right
 *     edge, ~13% above bottom edge
 *   - Cards form a staircase: short (Zeus) / tall (Agents) / medium (Net)
 *     all bottom-aligned
 *   - Card widths in spec: 10.5% / 11.4% / 12.9% vw
 *   - Inter-card gap ~2.3% vw
 *   - Headline + button stack on the left, vertically centered in the
 *     upper-mid of the hero
 *
 * Avatar (Grace) overlays the Agents card's top-right notch. Position
 * verified by rasterizing the SVG and measuring the white circle:
 *   center 72.3% from left, 18.5% from top of card
 *   radius 17.4% of card width
 *
 * Choreography (slide-up + fade, sequential):
 *   0ms     headline-1
 *   200ms   headline-2
 *   500ms   Our Specialties button (pill + arrow disc)
 *   600ms   Contact Us button
 *   800ms   Zeus card
 *   920ms   Agents card
 *   1040ms  Net Collection card
 *
 * a11y:
 *   - Visually-hidden <h1> for SEO + screen readers (visible headline
 *     is two SVG images, not selectable text)
 *   - prefers-reduced-motion: all entrance animations skipped
 *   - All Link wrappers have aria-label matching the SVG content
 */

import { useEffect } from 'react'
import Link from 'next/link'

const ASSETS = {
  headline1: '/images/hero/headline-1.svg',
  headline2: '/images/hero/headline-2.svg',
  btnSpecialties: '/images/hero/btn-specialties.svg',
  btnSpecialtiesArrow: '/images/hero/btn-specialties-arrow.svg',
  btnContact: '/images/hero/btn-contact.svg',
  cardZeus: '/images/hero/card-zeus.svg',
  cardAgents: '/images/hero/card-agents.svg', // has Grace avatar embedded as base64 inline
  cardNetCollection: '/images/hero/card-net-collection.svg',
} as const

export default function HeroSection() {
  // Choreography trigger: add .hero-ready to the section root once
  // mounted so entrance transitions fire. Two-deep rAF so the initial
  // opacity:0/translateY state actually renders before transition.
  useEffect(() => {
    const f1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.querySelector('.hero')?.classList.add('hero-ready')
      })
    })
    return () => cancelAnimationFrame(f1)
  }, [])

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-overlay" />
      </div>

      {/* Visually-hidden <h1> for SEO + screen readers. The visible
          headline is two SVG images, which screen readers see as alt
          text only. Without this <h1> the page has no semantic main
          heading. */}
      <h1 className="visually-hidden">
        Purpose Built For Your Specialty. Real People + Ai. RCM Redefined.
      </h1>

      <div className="hero-grid">
        {/* LEFT column: headlines + button row */}
        <div className="hero-left">
          <img
            src={ASSETS.headline1}
            alt="Purpose Built For Your Specialty"
            className="hero-headline hero-headline-1"
            loading="eager"
          />
          <img
            src={ASSETS.headline2}
            alt="Real People + Ai. RCM Redefined"
            className="hero-headline hero-headline-2"
            loading="eager"
          />

          <div className="hero-actions">
            {/* Our Specialties = pill + arrow disc composed.
                The arrow sits at the right end of the pill,
                overlapping its right edge per spec. Wrapped in
                a single Link so the whole "pill + arrow" is one
                click target -> #specialties. */}
            <Link
              href="#specialties"
              className="hero-action hero-action-specialties"
              aria-label="Our Specialties"
            >
              <img
                src={ASSETS.btnSpecialties}
                alt=""
                aria-hidden="true"
                className="hero-action-pill"
                loading="eager"
              />
              <img
                src={ASSETS.btnSpecialtiesArrow}
                alt=""
                aria-hidden="true"
                className="hero-action-arrow"
                loading="eager"
              />
            </Link>

            <Link
              href="/contact"
              className="hero-action hero-action-contact"
              aria-label="Contact Us"
            >
              <img
                src={ASSETS.btnContact}
                alt=""
                aria-hidden="true"
                loading="eager"
              />
            </Link>
          </div>
        </div>

        {/* RIGHT column: 3-card staircase, bottom-aligned */}
        <div className="hero-cards">
          <Link
            href="/cosentus-ai"
            className="hero-card hero-card-zeus"
            aria-label="Zeus Ai — 360 Degree RCM & EHR Platform"
          >
            <img src={ASSETS.cardZeus} alt="Zeus Ai — 360 Degree RCM & EHR Platform" loading="eager" />
          </Link>

          <Link
            href="#ra"
            className="hero-card hero-card-agents"
            aria-label="Meet our 24/7 Ai Agents, Optimize Workflow"
          >
            <img src={ASSETS.cardAgents} alt="Meet our 24/7 Ai Agents, Optimize Workflow" loading="eager" />
          </Link>

          <Link
            href="#results"
            className="hero-card hero-card-net"
            aria-label="Greater than 98 percent net collection"
          >
            <img src={ASSETS.cardNetCollection} alt=">98% Net Collection" loading="eager" />
          </Link>
        </div>
      </div>

      <style>{`
        /* ===== HERO LAYOUT =====
           The hero is a 100vh positioning context. globals.css scopes
           .home-immersive .hero with display:flex + justify-content:
           center which fights any custom layout we declare. We force
           display:block here so .hero-grid (our 2-column flex) controls
           its own children's positioning. */
        .hero {
          position: relative;
        }
        .home-immersive .hero {
          display: block !important;
          justify-content: flex-start !important;
        }

        /* Pre-existing gradient overlay no longer needed; ImmersiveVideoBackground
           draws the page-wide overlay. */
        .hero-overlay {
          display: none;
        }

        /* Screen-reader-only — visible only to assistive tech. */
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* ===== GRID: left column + right column =====
           Full hero footprint. The two columns are flex-aligned
           independently:
             LEFT  -> headline + buttons centered in upper half
             RIGHT -> cards bottom-aligned, touching right edge
        */
        .hero-grid {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          align-items: stretch;
          /* Padding only on left + bottom; right cards touch the
             viewport edge per spec. */
          padding: 0 0 0 7%;
          z-index: 3;
        }

        /* ===== LEFT: headline stack + button row ===== */
        .hero-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          /* Vertically anchor the stack in the upper-middle so it
             matches the spec's vertical position (~38% from top
             center). */
          justify-content: center;
          padding-top: 4vh;
          padding-bottom: 18vh;
          gap: 14px;
        }

        /* Headlines: fluid-sized so they scale with viewport.
           Spec proportions ~36% vw wide. Both share the same width
           since they're both ~4.5:1 aspect SVGs. */
        .hero-headline {
          display: block;
          width: clamp(320px, 36vw, 620px);
          height: auto;
        }
        /* Tighten the gap between the two headlines per spec
           (they read as one continuous block). */
        .hero-headline-2 {
          margin-top: -10px;
        }

        /* ===== Button row ===== */
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 24px;
        }

        /* Our Specialties: pill + arrow disc.
           Spec: arrow disc sits OVER the right end of the pill,
           overlapping. Using inline-block container so the arrow
           can absolute-position relative to the pill, and the whole
           container sizes to the pill's content. */
        .hero-action {
          display: inline-flex;
          position: relative;
          line-height: 0;
          text-decoration: none;
          transition:
            transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
            filter 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .hero-action:hover {
          transform: translateY(-2px);
          filter: brightness(1.10);
        }
        .hero-action-pill {
          display: block;
          /* Spec pill height ~ 5.5vh-ish on the layout. Using clamp
             so it doesn't get tiny on small viewports or absurd on
             huge ones. */
          height: clamp(48px, 6vh, 70px);
          width: auto;
        }
        .hero-action-arrow {
          /* Arrow disc is the round button on the right end of the
             pill. Position absolutely so it overlaps the pill's right
             edge — center-aligned vertically with the pill. The
             arrow SVG is 1:1 square. */
          position: absolute;
          right: -8%;
          top: 50%;
          transform: translateY(-50%);
          /* Slightly taller than the pill so it pokes out subtly
             at the top + bottom (matches spec). */
          height: 115%;
          width: auto;
        }
        .hero-action-contact img {
          display: block;
          height: clamp(48px, 6vh, 70px);
          width: auto;
        }

        /* ===== RIGHT: card staircase =====
           All cards bottom-aligned. Cluster touches right viewport
           edge and sits ~13% above the bottom (per spec). */
        .hero-cards {
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          gap: 2.3vw;
          padding-bottom: 13vh;
          padding-right: 0;
        }

        .hero-card {
          display: inline-flex;
          position: relative;
          line-height: 0;
          text-decoration: none;
          color: inherit;
          transition:
            transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
            filter 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .hero-card:hover {
          transform: translateY(-4px);
          filter: brightness(1.12);
        }
        .hero-card img {
          display: block;
          width: 100%;
          height: 100%;
        }

        /* Card sizes — measured from spec proportions.
           Zeus is square (1:1, 179x179 viewBox).
           Agents is taller-than-wide (193x252 viewBox = 0.766:1).
           Net Collection is wider-than-tall (260x192 viewBox = 1.353:1).
           Heights set as vw so the staircase proportion holds at any
           viewport width. Widths derive from each SVG's native aspect. */
        .hero-card-zeus {
          width: clamp(110px, 10.5vw, 200px);
          height: clamp(110px, 10.5vw, 200px);
        }
        .hero-card-agents {
          /* Tallest card in the staircase. Width derived from
             aspect 0.766:1 so the SVG renders undistorted. */
          height: calc(clamp(110px, 10.5vw, 200px) * 1.30);
          width: calc(clamp(110px, 10.5vw, 200px) * 1.30 * 0.766);
        }
        .hero-card-net {
          /* Medium. Wider than tall. */
          height: calc(clamp(110px, 10.5vw, 200px) * 0.82);
          width: calc(clamp(110px, 10.5vw, 200px) * 0.82 * 1.353);
        }

        /* ===== CHOREOGRAPHY ===== */
        .hero-headline-1,
        .hero-headline-2,
        .hero-action,
        .hero-card {
          opacity: 0;
          transform: translateY(20px);
          transition:
            opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-action {
          transform: translateY(20px);
          transition:
            opacity 600ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 600ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .hero-card {
          transform: translateY(40px);
          transition:
            opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 700ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .hero-ready .hero-headline-1,
        .hero-ready .hero-headline-2,
        .hero-ready .hero-action,
        .hero-ready .hero-card {
          opacity: 1;
          transform: translateY(0);
        }

        /* Staggered delays */
        .hero-ready .hero-headline-1 { transition-delay: 0ms; }
        .hero-ready .hero-headline-2 { transition-delay: 200ms; }
        .hero-ready .hero-action-specialties { transition-delay: 500ms; }
        .hero-ready .hero-action-contact     { transition-delay: 600ms; }
        .hero-ready .hero-card-zeus    { transition-delay: 800ms; }
        .hero-ready .hero-card-agents  { transition-delay: 920ms; }
        .hero-ready .hero-card-net     { transition-delay: 1040ms; }

        @media (prefers-reduced-motion: reduce) {
          .hero-headline-1,
          .hero-headline-2,
          .hero-action,
          .hero-card {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }

        /* ===== Mobile (< 768px) =====
           Spec is desktop. Defensive baseline: collapse grid to a
           single column. Headlines + buttons on top; cards stack
           as a centered horizontal row below. */
        @media (max-width: 768px) {
          .hero-grid {
            position: static;
            display: flex;
            flex-direction: column;
            padding: 14vh 16px 24px;
            gap: 24px;
          }
          .hero-left {
            padding: 0;
            gap: 10px;
          }
          .hero-headline {
            width: 88%;
            max-width: 360px;
          }
          .hero-actions {
            margin-top: 14px;
          }
          .hero-action-pill {
            height: 44px;
          }
          .hero-action-contact img {
            height: 44px;
          }
          .hero-action-arrow {
            height: 115%;
          }
          .hero-cards {
            padding: 0;
            justify-content: center;
            gap: 10px;
          }
          .hero-card-zeus {
            width: 90px;
            height: 90px;
          }
          .hero-card-agents {
            height: 117px;
            width: 90px;
          }
          .hero-card-net {
            height: 74px;
            width: 100px;
          }
        }
      `}</style>
    </section>
  )
}
