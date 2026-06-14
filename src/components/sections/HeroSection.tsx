'use client'

/**
 * HeroSection — homepage hero.
 *
 * History:
 *   - Originally a direct SVG plug-in of a supplied design (May 2026):
 *     headline + buttons + a right-hand 3-card staircase (Zeus / Agents
 *     / Net Collection), all as SVG images in /public/images/hero/.
 *   - Jun 2026: headline converted to real text (Change 1); the three
 *     cards were removed (Change 2). The hero is now a single-column
 *     layout: headline (<h1> text) + subline (<p>) + button row.
 *
 * Current layout (single column, left-anchored):
 *   - headline (real italic 700 text)
 *   - subline (smaller regular 400 text, .hero-sub pattern)
 *   - button row: Our Specialties (pill + arrow disc SVG) + Contact Us
 *
 * Buttons remain the supplied SVGs (btn-specialties.svg, its arrow, and
 * btn-contact.svg).
 *
 * Choreography (slide-up + fade, sequential):
 *   0ms     headline
 *   1000ms  subline
 *   2100ms  Our Specialties button (pill + arrow disc)
 *   2400ms  Contact Us button
 *
 * a11y:
 *   - Headline is a real <h1> of selectable text (was two SVG image
 *     outlines pre-Jun 2026); it is the page's semantic main heading.
 *   - prefers-reduced-motion: all entrance animations skipped
 *   - Button Link wrappers have aria-label matching the SVG content
 */

import { useEffect } from 'react'
import Link from 'next/link'

const ASSETS = {
  btnSpecialties: '/images/hero/btn-specialties.svg',
  btnSpecialtiesArrow: '/images/hero/btn-specialties-arrow.svg',
  btnContact: '/images/hero/btn-contact.svg',
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

      <div className="hero-layout-grid">
        {/* LEFT column: headline + subline + button row.
            Headline + subline are real, selectable HTML text (was two
            CorelDRAW SVG outlines pre-Jun 2026). The <h1> is now the
            visible semantic heading, so the separate visually-hidden
            <h1> was removed to avoid two <h1> elements on the page.
            Typography matches the shared PageHero / .hero-sub pattern
            used on every inner page (e.g. /services/rcm): headline
            italic 700, subline regular 400 at a smaller size + lower
            opacity. Same Reddit Sans throughout — the size/weight/
            opacity contrast is what reads as a distinct treatment. */}
        <div className="hero-left">
          <h1 className="hero-headline hero-headline-1">
            Specialty-focused RCM.<br />
            <span className="hero-headline-line2">Built to collect every dollar.</span>
          </h1>
          <p className="hero-sub hero-headline-2">
            End-to-end revenue cycle management with named teams trained
            in your specialty. We find where revenue is leaking, fix
            what&rsquo;s broken, and deliver full transparency into every
            claim.
          </p>

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
          /* Single column since the right-hand 3-card staircase was
             removed (Change 2, Jun 2026). Was minmax(0,1fr)
             minmax(0,1fr) for the two-column headline | cards layout.
             The left content now spans the container width; the
             headline's own max-width keeps line length in check. */
          grid-template-columns: minmax(0, 1fr);
          align-items: stretch;
          z-index: 3;
        }

        /* ===== LEFT: headline stack + button row =====
             - Headline TOP starts at ~38% from viewport top
             - Button row BOTTOM sits at ~14% from viewport bottom
           (The 14vh bottom inset previously aligned the button row
           with the now-removed card staircase bottoms; it's kept to
           preserve the hero's vertical rhythm — headline upper-mid,
           buttons near the bottom of a full-height hero.)
           Implementation: flex column from headline-top to button-
           bottom anchored, with margin-top:auto on the button row
           pushing it down to the bottom of the column. */
        .hero-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          /* Headline anchored at ~38% from top of viewport. */
          padding-top: 38vh;
          /* Single uniform vertical rhythm between the three stacked
             elements (headline -> subline -> button row). This 28px
             gap is the ONLY source of vertical spacing in the stack;
             .hero-sub margin and the button row's old margin-top:auto
             were removed so the gaps read identical. */
          gap: 28px;
        }

        /* Headline — real text now (was an SVG image sized by width).
           Typography mirrors the shared PageHero title used on every
           inner page (/services/rcm etc.): italic 700, tight letter-
           spacing, near-1 line-height, white. Fluid size via clamp so
           it scales with the viewport and reads as the dominant hero
           element. Max-width keeps the two-sentence headline from
           running into the right-hand card column. */
        .hero-headline {
          display: block;
          margin: 0;
          /* Right-hand card column is gone (Change 2), so the headline
             no longer needs a width cap to stay clear of it. The
             explicit <br/> after the first sentence sets the line
             break; the second sentence is held on ONE line by
             .hero-headline-line2 { white-space: nowrap } below. No
             max-width on desktop so that nowrap line isn't forced to
             overflow a too-narrow box. */
          max-width: none;
          font-family: var(--font-display);
          font-size: clamp(40px, 5vw, 64px);
          font-weight: 700;
          font-style: italic;
          letter-spacing: -0.03em;
          line-height: 1.02;
          color: #ffffff;
        }
        /* Second sentence ("Built to collect every dollar.") is kept on
           ONE line on desktop per user direction. nowrap is scoped here
           (not on the whole headline) and is reset to normal wrapping
           in the mobile media query so it can never overflow a phone-
           width viewport. */
        .hero-headline-line2 {
          white-space: nowrap;
        }
        /* Subline — smaller, lighter, NOT italic. Matches the global
           .hero-sub used by PageHero (clamp(17px,2vw,20px) / 400 /
           rgba white 0.7 / line-height 1.6). Declared locally so the
           hero doesn't depend on cascade order from globals.css. The
           .hero-headline-2 class is retained ONLY as the choreography
           hook (its 1000ms entrance delay); all visual styling comes
           from .hero-sub here. */
        .hero-sub {
          display: block;
          margin: 0;
          max-width: 560px;
          font-family: var(--font-body);
          font-size: clamp(17px, 2vw, 20px);
          font-weight: 400;
          font-style: normal;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.7);
        }

        /* ===== Button row =====
           Sits in normal flow directly after the subline; the 28px
           .hero-left gap provides the spacing above it (uniform with
           the headline->subline gap). gap:14px here is the HORIZONTAL
           space between the two buttons. */
        .hero-action-row {
          display: flex;
          align-items: center;
          gap: 14px;
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
          /* Round the focus/hover outline to match the underlying
             SVG pill so the hover shadow's corners look clean. The
             SVG pill is fully rounded (border-radius would be ~half
             the height = ~30px); using 999 for full pill rounding. */
          border-radius: 999px;
          /* White wash starts transparent; fades in on hover so the
             translucent SVG pill brightens like frosted glass under
             light. Mirrors .btn-glass:hover (background: rgba(255,
             255, 255, 0.10)) — NOT .btn-primary's teal fill, since
             user feedback was "highlight should be white only, not
             blue". Clip the wash to the pill shape so it doesn't
             leak past the SVG's rounded edges. */
          background-color: transparent;
          overflow: hidden;
          /* Hover transition is short and snappy. Entrance
             transitions for opacity/transform are declared in the
             CHOREOGRAPHY section below. */
          transition:
            background-color 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
            transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
            filter 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
            box-shadow 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        /* Hover — WHITE highlight only (no cyan).
             - White background-color wash fades in. The SVG pill is
               translucent (fill-opacity 0.3/0.5), so the white wash
               shows through and the pill brightens uniformly — like
               frosted glass under light. Matches .btn-glass:hover
               convention from globals.css.
             - Brightness 1.15 intensifies the SVG itself.
             - Dark drop shadow ONLY (no cyan glow, no halo). Cyan
               glow against the dark video bg reads as a sharp ring
               around the button, not as light emanating from it —
               user explicitly rejected the blue tint.
             - Lift -2px gives a clear "rising off the page" feel
               that the white wash alone wouldn't provide.
           IMPORTANT: scoped under .hero-ready (specificity 0,3,0) to
           beat the post-entrance reset '.hero-ready .hero-action'
           rule below (specificity 0,2,0) which sets transform:
           translate(0,0). Without this scope, the hover transform
           never applies — same specificity, later rule wins by
           source order, and the lift is silently broken. This was
           the pre-existing bug since b3f9960. */
        .hero-ready .hero-action:hover {
          background-color: rgba(255, 255, 255, 0.18);
          transform: translateY(-2px);
          filter: brightness(1.15);
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45);
        }
        /* Arrow hover nudge DISABLED per user (Jun 2026): the disc
           previously shifted +4px right on hover of the Specialties
           button. Rule kept for easy restore: */
        /*
        .hero-ready .hero-action-specialties:hover .hero-action-arrow {
          transform: translateY(-50%) translateX(4px);
        }
        */
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
          /* Tuck the disc just inside the pill's right edge (a positive
             right value = inset rather than bulging past) and size it a
             touch smaller than the pill height so it reads as a fitted
             icon rather than a full-height white ball. Per user (Jun 2026). */
          right: 1.2%;
          top: 50%;
          transform: translateY(-50%);
          height: 82%;
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

        /* Reveal state — added by useEffect after mount via a
           rAF chain (so initial state paints before transitions
           fire). Headlines + buttons use transition-based reveal
           (transform set to translate(0,0) which their transition
           rules animate to). */
        .hero-ready .hero-headline-1,
        .hero-ready .hero-headline-2,
        .hero-ready .hero-action {
          opacity: 1;
          transform: translate(0, 0);
        }

        /* Per-element delays — the "cinematic pan" sequencing. */
        .hero-ready .hero-headline-1         { transition-delay: 0ms; }
        .hero-ready .hero-headline-2         { transition-delay: 1000ms; }
        .hero-ready .hero-action-specialties { transition-delay: 2100ms; }
        .hero-ready .hero-action-contact     { transition-delay: 2400ms; }

        @media (prefers-reduced-motion: reduce) {
          /* NOTE on the arrow disc: it's deliberately NOT in this
             group. The arrow's base centering is 'transform:
             translateY(-50%)', so applying 'transform: none !important'
             to it would knock it out of vertical center on hover.
             It gets its own rule below that preserves centering and
             only suppresses the +4px horizontal nudge. */
          .hero-headline-1,
          .hero-headline-2,
          .hero-action,
          .hero-ready .hero-action:hover {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
            animation: none !important;
          }

          /* Arrow disc: keep base vertical centering, suppress the
             4px horizontal nudge. Without this, the rule group above
             would set transform: none, killing the translateY(-50%)
             base centering and making the arrow snap to the top of
             the pill on hover. */
          .hero-ready .hero-action-specialties:hover .hero-action-arrow {
            transform: translateY(-50%) !important;
            transition: none !important;
          }
        }

        /* ===== Mobile (< 768px) =====
           Spec is desktop. Defensive baseline: collapse grid to a
           single column. Headline + subline + buttons stack. */
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
            max-width: 100%;
            /* Adaptive mobile size. NOTE: the EFFECTIVE size on the home
               page comes from globals.css ".hero h1 { font-size:
               clamp(24px,8.5vw,40px) !important }" (the !important wins
               over this rule). This value is kept as a matching fallback
               for any context where that global rule doesn't apply. The
               old flat 36px made "Specialty-focused RCM." overflow/wrap
               and orphan "RCM." on phones; 8.5vw scales it so it stays
               readable from ~320px up. */
            font-size: clamp(24px, 8.5vw, 40px);
          }
          /* Let both headline sentences wrap naturally on phones. A
             nowrap attempt pushed the first sentence under the GPTW badge
             and clipped it; the adaptive size above keeps it readable. */
          .hero-headline-line2 {
            white-space: normal;
          }
          .hero-sub {
            max-width: 100%;
            font-size: 15px;
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
            /* Match the desktop disc proportion (82% of pill height)
               instead of 100%. At full pill height on the 44px mobile
               pill the disc became a full-height ball positioned at
               right:1.2%, which overlapped the pill's baked-in
               "Our Specialties" text. 82% keeps it a fitted icon tucked
               at the right end, clear of the label. */
            height: 82%;
          }
        }
      `}</style>
    </section>
  )
}
