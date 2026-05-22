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

      <div className="hero-layout-grid">
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

          <div className="hero-action-row">
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
           display:block here so .hero-layout-grid (our 2-column flex) controls
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
        .hero-layout-grid {
          /* Anchor top + bottom to fill the hero vertically.
             Horizontal axis matches .container (globals.css line 78):
               max-width: var(--container)  (1280px)
               margin: 0 auto                (centered)
               padding: 0 24px               (24px gutter each side)
             Same convention as .nav-inner, RASection, SpecialtiesSection,
             ServicesSection, CaseStudiesSection, InsightsTabsSection.
             Hero now aligns with every other section on the page. */
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          max-width: var(--container);
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          align-items: stretch;
          z-index: 3;
        }

        /* ===== LEFT: headline stack + button row =====
           Per spec measurements:
             - Headline 1 "Purpose Built" TOP starts at ~38% from
               viewport top
             - Button row BOTTOM sits at ~14% from viewport bottom
               (aligned with card bottoms — both share the same
               baseline as the staircase)
           Implementation: flex column from headline-top to button-
           bottom anchored, with margin-top:auto on the button row
           pushing it down to the bottom of the column. */
        .hero-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          /* Headline anchored at ~38% from top of viewport.
             padding-top sets the starting Y; the column stretches
             to the bottom of the grid cell via the grid's
             align-items: stretch (set on .hero-layout-grid). */
          padding-top: 38vh;
          /* Padding-bottom must equal the card bottom inset (14vh)
             so the button row, when pushed to the bottom of the
             left column via margin-top:auto, ends up at the SAME
             baseline as the card bottoms. */
          padding-bottom: 14vh;
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

        /* ===== Button row =====
           margin-top: auto pushes this row to the bottom of the
           .hero-left flex column, so the row's BOTTOM sits at the
           column's padding-bottom (14vh from viewport bottom),
           matching the card bottoms. */
        .hero-action-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: auto;
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
          /* Hover transition is short and snappy (220ms) so the
             effect feels responsive. Entrance transitions for
             opacity/transform are declared in the CHOREOGRAPHY
             section below and run on a longer 700ms curve with
             per-element delays. */
          transition:
            transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
            filter 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        /* Hover — matches btn-glass convention from globals.css:
           small lift + brightness boost. */
        .hero-action:hover {
          transform: translateY(-2px);
          filter: brightness(1.10);
        }
        /* Arrow disc nudges further right on hover — same pattern
           as .btn-glass:hover svg { transform: translateX(3px); }
           in globals.css. Composes with the disc's existing
           vertical centering transform (translateY(-50%)). */
        .hero-action-specialties:hover .hero-action-arrow {
          transform: translateY(-50%) translateX(4px);
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
             pill. Position absolutely so it sits AT the pill's right
             edge — center-aligned vertically with the pill.

             Spec measurement: arrow disc extends only ~0.3% past
             the pill's right edge (4px on a 1195px pill). Earlier
             I used right:-8% which pushed it ~8% past the pill,
             making the disc detach visually from the pill and look
             like it was floating in the gap between buttons.

             right:0 = arrow's right edge aligns with pill's right edge.
             A small negative value (-1%) places the disc center
             roughly on the pill's right edge, extending the disc
             slightly past — matches spec. */
          position: absolute;
          right: -1%;
          top: 50%;
          transform: translateY(-50%);
          /* Same height as the pill so they read as a composed
             button. */
          height: 100%;
          width: auto;
          /* Smooth the hover nudge (arrow shifts +4px right when
             the parent Specialties button is hovered). Without this
             transition the shift would snap rather than glide. */
          transition: transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .hero-action-contact img {
          display: block;
          height: clamp(48px, 6vh, 70px);
          width: auto;
        }

        /* ===== RIGHT: card staircase =====
           All cards bottom-aligned. The 14vh bottom padding matches
           the .hero-left padding-bottom so the button row's bottom
           and the card bottoms share the EXACT same y-coordinate.
           Right horizontal inset comes from .hero-layout-grid's symmetric
           padding (7% on each side). */
        .hero-cards {
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          gap: 2.3vw;
          padding-bottom: 14vh;
        }

        .hero-card {
          display: inline-flex;
          position: relative;
          line-height: 0;
          text-decoration: none;
          color: inherit;
          /* Hover transition is short and snappy. Entrance
             transitions (opacity/transform with the bounce curve)
             are declared in the CHOREOGRAPHY section. */
          transition:
            transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
            filter 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
            box-shadow 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
          /* Reserve a small border-radius so the box-shadow's
             corners match the SVG's rounded shape. The actual
             card visual comes from the SVG, but a matched radius
             here keeps the hover glow's corners clean. */
          border-radius: 24px;
        }
        /* Hover — matches site convention (testimonial-card, btn-glass):
             - Subtle lift (translateY -3px)
             - Brightness boost (1.10)
             - Soft drop-shadow + cyan-tinted glow ring
           Same visual language as other interactive cards on the
           page so the home reads cohesively. */
        .hero-card:hover {
          transform: translateY(-3px);
          filter: brightness(1.10);
          box-shadow:
            0 12px 32px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(0, 181, 214, 0.20),
            0 0 24px rgba(0, 181, 214, 0.18);
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

        /* ===== CHOREOGRAPHY — "Cinematic Pan" =====
           Per user direction "Cinematic Pan: Headline lines fade-up
           from below (one line at a time, ~1s per line). Buttons
           slide in from LEFT. Cards slide in from RIGHT one at a
           time with subtle bounce settle. Total ~4.5s."

           Timeline (from page load):
             0ms     Headline 1 starts fading up (1000ms)
             1000ms  Headline 2 starts fading up (1000ms)
             2100ms  Specialties button slides in from LEFT (700ms)
             2400ms  Contact button slides in from LEFT (700ms)
             2800ms  Zeus card slides in from RIGHT + bounce (800ms)
             3300ms  Agents card slides in from RIGHT + bounce (800ms)
             3800ms  Net card slides in from RIGHT + bounce (800ms)
             4600ms  Everything settled

           Direction notation:
             headlines  : translateY(40px) -> 0   (rising from below)
             buttons    : translateX(-50px) -> 0  (sliding from left)
             cards      : translateX(80px) -> 0   (sliding from right)

           Easing notes:
             Headlines + buttons use cubic-bezier(0.16, 1, 0.3, 1)
             — a smooth ease-out with no overshoot.
             Cards use cubic-bezier(0.34, 1.56, 0.64, 1) — an
             ease-out-back curve that overshoots slightly (~7%)
             then settles back, producing the "bounce settle"
             requested. */

        /* All animated elements start hidden. Specific initial
           transforms set per element type so each travels its own
           direction. */
        .hero-headline-1,
        .hero-headline-2 {
          opacity: 0;
          transform: translateY(40px);
          transition:
            opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 1000ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-action {
          opacity: 0;
          /* Slide in from the left side of the viewport. */
          transform: translateX(-50px);
          /* Transition entrance properties on a 700ms curve;
             keep filter (used for hover brightness) on a separate
             snappy 220ms so hover stays responsive. */
          transition:
            opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 700ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .hero-card {
          opacity: 0;
          /* Slide in from the right side. Cards are positioned
             on the right of the layout, so sliding them in from
             further right reads as "entering from off-screen". */
          transform: translateX(80px);
          /* Ease-out-back overshoots ~7% past the target then
             settles back, producing a subtle bounce. The
             transform transition uses this curve; opacity uses
             the standard smooth ease-out (no overshoot needed
             for opacity). */
          transition:
            opacity 800ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1),
            filter 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
            box-shadow 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        /* Reveal state — added by useEffect after mount via a
           rAF chain (so initial state paints before transitions
           fire). */
        .hero-ready .hero-headline-1,
        .hero-ready .hero-headline-2,
        .hero-ready .hero-action,
        .hero-ready .hero-card {
          opacity: 1;
          transform: translate(0, 0);
        }

        /* Per-element delays — the "cinematic pan" sequencing. */
        .hero-ready .hero-headline-1         { transition-delay: 0ms; }
        .hero-ready .hero-headline-2         { transition-delay: 1000ms; }
        .hero-ready .hero-action-specialties { transition-delay: 2100ms; }
        .hero-ready .hero-action-contact     { transition-delay: 2400ms; }
        .hero-ready .hero-card-zeus          { transition-delay: 2800ms; }
        .hero-ready .hero-card-agents        { transition-delay: 3300ms; }
        .hero-ready .hero-card-net           { transition-delay: 3800ms; }

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
          .hero-layout-grid {
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
          .hero-action-row {
            margin-top: 14px;
          }
          .hero-action-pill {
            height: 44px;
          }
          .hero-action-contact img {
            height: 44px;
          }
          .hero-action-arrow {
            height: 100%;
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
