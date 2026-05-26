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
import MobileCarousel from '@/components/ui/MobileCarousel'

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

  // Auto-scroll for the mobile carousel is now handled by the
  // <MobileCarousel> component below. Removed the previous custom
  // useEffect (with cardsRef + offsetLeft math + IntersectionObserver
  // + scrollTo) because two real-world issues kept biting it:
  //   1. offsetLeft was resolving against an unexpected positioned
  //      ancestor (not the scroll container), so scrollTo targets
  //      were wrong values. Even after adding position:relative to
  //      .hero-cards, the user reported autoplay still wasn't
  //      advancing on the live preview.
  //   2. Maintaining two parallel autoplay implementations (this
  //      file + MobileCarousel) was diverging in subtle ways.
  // MobileCarousel uses translateX percentages instead of offsetLeft
  // so it has no positioning-dependency. Same component already
  // drives Results / Services / Advantages / Specialties carousels
  // on this page — one battle-tested implementation everywhere.

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

        {/* RIGHT column: 3-card staircase on desktop, MobileCarousel
            carousel on mobile.
            MobileCarousel renders its children as a bare fragment on
            desktop (returns <>{children}</>) so the existing .hero-cards
            staircase CSS still applies. On mobile (<=768px) MobileCarousel
            renders its own track + dots and handles autoplay /
            touch swipe / IntersectionObserver enter / reduced-motion
            internally. Removed the previous ref+useEffect because the
            offsetLeft-based scroll math wasn't reliably advancing the
            carousel on the live preview. */}
        <div className="hero-cards">
          <MobileCarousel autoScrollInterval={3500} darkMode>
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
          </MobileCarousel>
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
        /* Arrow disc nudges further right on hover — same pattern
           as .btn-glass:hover svg { transform: translateX(3px); }
           in globals.css. Composes with the disc's existing
           vertical centering transform (translateY(-50%)). Scoped
           under .hero-ready for the same specificity reason as the
           main hover rule above. */
        .hero-ready .hero-action-specialties:hover .hero-action-arrow {
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
        /* Hover — bold, clearly-perceptible "nudge" effect. User
           explicitly said the previous lift was invisible and the
           cyan ring/halo looked like an outline. White-only aesthetic
           per the same feedback applied to the buttons above.
             - translateY(-14px) scale(1.06) — big lift + clear grow,
               so the card visibly pops forward. No subtlety; user
               wanted obvious movement.
             - Brightness 1.22 + saturate 1.10 — translucent SVG cards
               brighten markedly.
             - Shadow: big dark drop only. No cyan ring (0 0 0 1px),
               no centered cyan halo (0 0 32px). The previous shadow
               stack was producing an "outline" look on the dark video
               bg; pure dark drop reads cleanly as the card lifting
               off the page.
             - Transition override on :hover only. The base .hero-card
               transition (set in the CHOREOGRAPHY block below) is
               800ms bouncy on transform for the entrance
               animation; that's too slow + overshoots for a mouse
               hover. Snap to 220ms on hover-IN. Hover-OUT reverts to
               the choreography's bouncy transition — giving a
               satisfying settle-back as the card relaxes into place.
           IMPORTANT 1: scoped under .hero-ready (specificity 0,3,0)
           to beat the post-entrance reset '.hero-ready .hero-card'
           rule below — without this scope, the hover transform is
           overridden by the reset's transform: translate(0,0).

           IMPORTANT 2: transform uses !important. After moving the
           entrance from a transition to a keyframe animation with
           animation-fill-mode: both, the animation HOLDS its 'to'
           keyframe value (translateX(0)) indefinitely. Per the
           CSS Animations spec, animation-held values sit at a
           cascade level ABOVE normal author rules — so this :hover
           rule's transform was being silently overridden by the
           animation's held value. !important on the :hover transform
           promotes it above the animation cascade. Author-important
           > animation > author-normal. filter + box-shadow don't
           need this because the @keyframes only animates transform.
           This was the root cause behind 'now nothing is happening'.

           IMPORTANT 3: gated behind @media (hover: hover) so this
           dramatic lift+scale doesn't fire as sticky-hover on the
           mobile carousel. Touch devices report hover:none and skip
           this rule entirely — same sticky-hover fix we apply to
           .insight-card and .specialty-card. Without the gate, the
           card the user grabbed during swipe would retain the
           translateY/scale highlight even after they moved on to
           the next card. */
        @media (hover: hover) {
          .hero-ready .hero-card:hover {
            transform: translateY(-14px) scale(1.06) !important;
            filter: brightness(1.22) saturate(1.10);
            box-shadow: 0 26px 50px rgba(0, 0, 0, 0.50);
            transition:
              transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
              filter 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
              box-shadow 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
          }
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
             further right reads as "entering from off-screen".
             The entrance slide is driven by the @keyframes
             hero-card-enter animation below (not by transition),
             which lets the transition property keep transform on
             a snappy 220ms curve for hover. Without this split,
             un-hovering reverted transform on the entrance's
             800ms bouncy curve — i.e. cards swam back to rest
             over nearly a full second after hover-out, which the
             user explicitly called out as too slow. */
          transform: translateX(80px);
          transition:
            opacity 800ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
            filter 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
            box-shadow 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        /* Cards-only entrance animation. Replaces what used to be
           a transition on transform (800ms bouncy). Using an animation
           means the entrance's 800ms bouncy slide is decoupled from
           the transform transition, so the transition can stay snappy
           (220ms above) for hover/un-hover. animation-fill-mode: both
           keeps the 'from' keyframe value applied during animation-delay
           (before the animation starts) and the 'to' value held after
           the animation completes — so the card sits at translateX(80)
           through its delay window and at translateX(0) afterward.

           Opacity is included in BOTH keyframes (not just transform).
           Reason: on mobile <MobileCarousel> re-renders the cards as
           NEW DOM nodes after hydration (when isMobile flips true and
           the cards get wrapped in slide divs). For a freshly-mounted
           element, CSS transitions don't fire — there's no previous
           state to transition FROM. So the cards' computed opacity
           comes from the cascade: '.hero-ready .hero-card { opacity:
           1 }' wins, opacity is 1 immediately, no transition runs.
           Meanwhile the transform is held by the animation's fill-
           mode: both at translateX(80px) during the delay. Result:
           the card was visible (opacity:1) at the +80px offset for
           the entire 2800ms delay window — clipped against the
           carousel's overflow:hidden, looking "stuck in the corner".
           Then at t=2800ms the keyframe fired and slid the card
           visibly LEFT to its slot. Adding opacity to the keyframe
           makes the fill-mode hold both transform AND opacity at the
           'from' values during the delay, so the card stays invisible
           until t=2800ms whether it was mounted at t=0 (SSR) or at
           t=~200ms (after MobileCarousel re-render). User report
           2026-05-26: "Zeus AI box gets stuck to the corner, and
           then it goes to the left every time. Whenever I refresh,
           it's the same thing." */
        @keyframes hero-card-enter {
          from { transform: translateX(80px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }

        /* Reveal state — added by useEffect after mount via a
           rAF chain (so initial state paints before transitions
           fire). Headlines + buttons use transition-based reveal
           (transform set to translate(0,0) which their transition
           rules animate to). Cards use the keyframe animation
           defined above; their transform is held by the animation,
           NOT declared here — declaring transform here would
           conflict with the animation and break hover-out timing. */
        .hero-ready .hero-headline-1,
        .hero-ready .hero-headline-2,
        .hero-ready .hero-action {
          opacity: 1;
          transform: translate(0, 0);
        }
        .hero-ready .hero-card {
          opacity: 1;
          animation: hero-card-enter 800ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        /* Per-element delays — the "cinematic pan" sequencing.
           Cards need BOTH transition-delay (for opacity fade-in
           which is still transition-based) AND animation-delay
           (for the slide-in keyframe). They must match so opacity
           and slide land together. */
        .hero-ready .hero-headline-1         { transition-delay: 0ms; }
        .hero-ready .hero-headline-2         { transition-delay: 1000ms; }
        .hero-ready .hero-action-specialties { transition-delay: 2100ms; }
        .hero-ready .hero-action-contact     { transition-delay: 2400ms; }
        .hero-ready .hero-card-zeus          { transition-delay: 2800ms; animation-delay: 2800ms; }
        .hero-ready .hero-card-agents        { transition-delay: 3300ms; animation-delay: 3300ms; }
        .hero-ready .hero-card-net           { transition-delay: 3800ms; animation-delay: 3800ms; }

        @media (prefers-reduced-motion: reduce) {
          /* Cover both the base selectors AND the high-specificity
             hover selectors. The hover rules now use !important on
             transform (to beat the entrance animation's cascade
             level), which means a plain '.hero-card { transform:
             none !important }' would lose to '.hero-ready .hero-card
             :hover { transform: ... !important }' on specificity.
             Listing the hover selectors explicitly here brings them
             back under reduced-motion suppression.

             NOTE on the arrow disc: it's deliberately NOT in this
             group. The arrow's base centering is 'transform:
             translateY(-50%)', so applying 'transform: none !important'
             to it would knock it out of vertical center on hover.
             It gets its own rule below that preserves centering and
             only suppresses the +4px horizontal nudge. */
          .hero-headline-1,
          .hero-headline-2,
          .hero-action,
          .hero-card,
          .hero-ready .hero-action:hover,
          .hero-ready .hero-card:hover {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
            /* Cards now use a keyframe animation for entrance;
               kill it under reduced-motion the same way we kill
               the transitions for headlines + buttons. */
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
          /* HERO FEATURE CARDS — mobile carousel
             Per user direction "I can show them one at a time, bigger
             ones... they can be scrolling left to right, but much
             bigger than this."

             Implementation: <MobileCarousel> wraps the three cards in
             HeroSection.tsx. On mobile MobileCarousel renders its own
             track + dots and handles autoplay / touch swipe /
             IntersectionObserver / reduced-motion internally. On
             desktop it returns <>{children}</> so the staircase CSS
             above still applies unchanged.

             Why we use MobileCarousel here instead of CSS scroll-snap:
             the previous custom autoplay (useEffect + offsetLeft +
             scrollTo) wasn't reliably advancing the carousel on the
             live preview — even after adding position:relative to
             make offsetLeft resolve correctly. MobileCarousel uses
             translateX percentages instead, so there's no positioning
             dependency. Same component already drives the Results,
             Services, Advantages, and Specialties carousels on this
             page; one implementation everywhere is easier to maintain.

             .hero-cards on mobile is now just a passthrough container
             — MobileCarousel's own wrapper handles overflow and width.
             We reset the desktop staircase flex rules here so they
             don't fight MobileCarousel's track layout. */
          .hero-cards {
            display: block;
            padding: 0;
            gap: 0;
            /* The hero-layout-grid parent already carries 16px
               horizontal padding on mobile, so the carousel edge
               aligns with the rest of the hero content. */
          }
          /* Each card sits inside one MobileCarousel slide (100%
             width with 8px horizontal padding). Cards now use 100%
             width of their slide so the card fills the visible area
             instead of sitting at a fixed pixel width with empty
             space around it — this matches the user direction "bigger
             ones, one at a time". Heights still capped to ~230px so
             the carousel doesn't dominate the viewport. */
          .hero-card {
            display: block;
            width: 100%;
            height: 230px;
          }
          .hero-card img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
          }
        }
      `}</style>
    </section>
  )
}
