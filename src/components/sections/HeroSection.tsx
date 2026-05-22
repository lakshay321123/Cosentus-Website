'use client'

/**
 * HeroSection — new layout per user-supplied design brief
 * (hero_section_layout.jpg + Cosentus_website_hero_section_elements.zip,
 * 22 May 2026).
 *
 * Layout summary:
 *   LEFT side:
 *     - Headline 1 (SVG): "Purpose Built / For Your Specialty," — white
 *     - Headline 2 (SVG): "Real People + Ai. / RCM Redefined"    — cyan
 *     - Action row: Our Specialties button + Contact Us button
 *   BOTTOM-RIGHT staircase:
 *     - Card 1: Zeus Ai          -> /cosentus-ai      (shortest)
 *     - Card 2: 24/7 Ai Agents   -> #ra anchor        (tallest, has avatar notch)
 *     - Card 3: >98% Net Collection -> #results anchor (medium)
 *
 * Per user direction (this conversation):
 *   - Use the SVG assets as-is (NOT recreated in CSS). Each design
 *     element is rendered as an <img> referencing files in
 *     /public/images/hero/.
 *   - Drop the previous typing animation. Static headline.
 *   - Replace the previous 3 ladder cards (Specialty/Zeus/About).
 *   - Full hero choreography: headline -> buttons -> cards,
 *     sequential, slide-up + fade pattern matching the previous
 *     ladder cards.
 *
 * A11y notes:
 *   - The headline is SVG-as-image, so screen readers see the SVGs'
 *     alt text instead of selectable text. To preserve the page's
 *     <h1> for SEO and a11y, a visually-hidden <h1> renders the
 *     same text in DOM. CSS clip-path .visually-hidden is the
 *     standard a11y pattern.
 *   - prefers-reduced-motion: animations are skipped; elements
 *     appear instantly without transform/transitions.
 */

import { useEffect } from 'react'
import Link from 'next/link'

// File paths in /public/images/hero/ for the 7 design assets
// (3 cards + 2 buttons + 2 headlines).
const ASSETS = {
  headline1: '/images/hero/headline-1.svg', // "Purpose Built / For Your Specialty," (white)
  headline2: '/images/hero/headline-2.svg', // "Real People + Ai. / RCM Redefined"   (cyan #A7D9E6)
  btnSpecialties: '/images/hero/btn-specialties.svg', // pill + integrated circular arrow
  btnContact: '/images/hero/btn-contact.svg',         // pill, no arrow
  cardZeus: '/images/hero/card-zeus.svg',             // 1:1 square (179x179 viewBox)
  cardAgents: '/images/hero/card-agents.svg',         // 0.766:1 (193x252) with notch at top-right
  cardNetCollection: '/images/hero/card-net-collection.svg', // 1.35:1 (260x192)
} as const

// Grace avatar — the same image CindyVoiceAgent uses elsewhere
// on the home (currently the floating bottom-right widget).
// Per user direction: "Use the existing avatar PNG in /public".
const AVATAR_SRC = '/images/grace-avatar.png'

export default function HeroSection() {
  // Choreography trigger: add .hero-ready to the section root once
  // mounted so the entrance transitions fire. Using two-deep rAF
  // so the initial (opacity:0 / translateY) state definitely
  // renders before the transition starts. Without this, the class
  // could be on the element from first paint and the transition
  // would not fire.
  useEffect(() => {
    const f1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const hero = document.querySelector('.hero')
        hero?.classList.add('hero-ready')
      })
    })
    return () => cancelAnimationFrame(f1)
  }, [])

  return (
    <section className="hero">
      {/* Background overlay placeholder — kept for parity with the
          previous JSX. Real video bg comes from page-level
          ImmersiveVideoBackground. */}
      <div className="hero-bg">
        <div className="hero-overlay" />
      </div>

      {/* Visually-hidden <h1> for SEO + screen readers. The visible
          headline is the two SVG images below; without this <h1>
          the page would have no semantic main heading. */}
      <h1 className="visually-hidden">
        Purpose Built For Your Specialty. Real People + Ai. RCM Redefined.
      </h1>

      {/* LEFT column: headline images + action buttons */}
      <div className="hero-left">
        <img
          src={ASSETS.headline1}
          alt="Purpose Built For Your Specialty"
          className="hero-headline hero-headline-1"
          /* Skip lazy-load — headline is in the initial viewport. */
          loading="eager"
        />
        <img
          src={ASSETS.headline2}
          alt="Real People + Ai. RCM Redefined"
          className="hero-headline hero-headline-2"
          loading="eager"
        />

        <div className="hero-actions">
          {/* "Our Specialties" — scrolls to the #specialties section
              on the home page. Using an anchor href so it works
              without any router push (browser-native smooth scroll
              behaviour is enabled in globals.css). */}
          <Link href="#specialties" className="hero-action" aria-label="Our Specialties">
            <img src={ASSETS.btnSpecialties} alt="Our Specialties" loading="eager" />
          </Link>
          {/* "Contact Us" -> /contact route. */}
          <Link href="/contact" className="hero-action" aria-label="Contact Us">
            <img src={ASSETS.btnContact} alt="Contact Us" loading="eager" />
          </Link>
        </div>
      </div>

      {/* BOTTOM-RIGHT staircase: 3 cards. */}
      <div className="hero-cards">
        {/* Card 1: Zeus Ai -> /cosentus-ai route. */}
        <Link href="/cosentus-ai" className="hero-card hero-card-zeus" aria-label="Zeus Ai — 360 Degree RCM & EHR Platform">
          <img src={ASSETS.cardZeus} alt="Zeus Ai — 360 Degree RCM & EHR Platform" loading="eager" />
        </Link>

        {/* Card 2: Agents -> #ra anchor (the agent grid section).
            Avatar is overlaid absolutely at the SVG's notch
            position. Geometry verified by rasterizing the SVG:
              center 72.3% x / 18.5% y
              radius 17.4% of card width
            Note: viewBox is 193.5 x 252.49 — image height-to-width
            ratio 1.305:1. The container preserves that ratio so
            the avatar sits inside the notch correctly at any
            display size. */}
        <Link href="#ra" className="hero-card hero-card-agents" aria-label="Meet our 24/7 Ai Agents, Optimize Workflow">
          <img src={ASSETS.cardAgents} alt="Meet our 24/7 Ai Agents, Optimize Workflow" loading="eager" />
          <img
            src={AVATAR_SRC}
            alt=""
            className="hero-card-agents-avatar"
            aria-hidden="true"
            loading="eager"
          />
        </Link>

        {/* Card 3: Net Collection -> #results anchor (the arrows). */}
        <Link href="#results" className="hero-card hero-card-net" aria-label="Greater than 98 percent net collection">
          <img src={ASSETS.cardNetCollection} alt=">98% Net Collection" loading="eager" />
        </Link>
      </div>

      <style>{`
        /* The hero is a positioning context for the left column +
           bottom-right card row. Override the global
           .home-immersive .hero flex centering so the left/right
           layout can be controlled with absolute positioning. */
        .hero {
          position: relative;
        }
        .home-immersive .hero {
          /* Force flex-start so the previous justify-content:center
             override in globals.css (line ~737) doesn't fight our
             absolute children. */
          justify-content: flex-start !important;
          display: block !important;
        }

        /* The previous hero gradient overlay is redundant on every
           viewport — ImmersiveVideoBackground draws the page-wide
           overlay. Hidden everywhere. */
        .hero-overlay {
          display: none;
        }

        /* Screen-reader-only — visually hidden but still in the DOM. */
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

        /* LEFT column — headline + action buttons stacked vertically.
           Positioned with significant left padding to match the
           design's left margin (~7% of viewport on desktop). */
        .hero-left {
          /* Absolutely positioned so cards can sit at bottom-right
             of the hero independently. The hero itself has
             100vh height (from globals.css on .home-immersive
             .hero). We anchor to the LEFT side with a top offset
             that centers the headline vertically in the upper 60%
             of the viewport. */
          position: absolute;
          left: 7%;
          right: auto;
          top: 38%;
          transform: translateY(-50%);
          max-width: 640px;
          z-index: 3;

          /* CHOREOGRAPHY STEP 1 — headline appears first. */
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 18px;
        }

        /* Headline images — fluid-sized so they scale with viewport.
           Width is fluid via clamp; height auto preserves the SVG's
           native aspect ratio (~4.6:1 for both headlines). */
        .hero-headline {
          display: block;
          width: clamp(280px, 38vw, 560px);
          height: auto;
        }
        /* Both headlines start invisible + offset; the .ready class
           added below the threshold-delay timer fades them in. */
        .hero-headline-1,
        .hero-headline-2 {
          opacity: 0;
          transform: translateY(20px);
          transition:
            opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        /* Stagger between the two headlines via animation-delay so
           the user sees them appear in sequence (white first, then
           cyan). 200ms gap. */
        .hero-headline-2 {
          transition-delay: 200ms;
        }
        /* Both headlines slide in after first paint via the
           .hero-ready class on body (set by the load-pulse below). */
        .hero-ready .hero-headline-1,
        .hero-ready .hero-headline-2 {
          opacity: 1;
          transform: translateY(0);
        }

        /* ACTION row — two buttons inline. Per design, they sit
           a clear gap below the headline. */
        .hero-actions {
          display: flex;
          gap: 16px;
          margin-top: 14px;
          align-items: center;
        }
        .hero-action {
          /* The button is a flat SVG image inside a Link wrapper.
             We give the wrapper an explicit height so the button's
             clickable area matches the visible button bounds. The
             SVG's aspect ratio carries the rest. */
          display: inline-flex;
          line-height: 0;
          text-decoration: none;
          /* Lift slightly on hover to give the user feedback that
             these are interactive. transform: translateY is safe
             here because each .hero-action's bounds are
             independent. */
          transition: transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
                      filter 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
          /* CHOREOGRAPHY STEP 2 — buttons appear after headlines.
             Initial state: hidden + offset. */
          opacity: 0;
          transform: translateY(20px);
        }
        .hero-action img {
          display: block;
          height: clamp(44px, 5.5vh, 60px);
          width: auto;
        }
        .hero-action:hover {
          transform: translateY(-2px);
          /* Subtle brightening on hover */
          filter: brightness(1.10);
        }
        .hero-ready .hero-action {
          opacity: 1;
          transform: translateY(0);
          transition:
            opacity 600ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 600ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        /* Stagger the two buttons — Specialties first, Contact 100ms later. */
        .hero-ready .hero-action:nth-child(1) {
          transition-delay: 500ms;
        }
        .hero-ready .hero-action:nth-child(2) {
          transition-delay: 600ms;
        }

        /* BOTTOM-RIGHT staircase cards. */
        .hero-cards {
          position: absolute;
          right: 5%;
          bottom: 6%;
          display: flex;
          align-items: flex-end;
          gap: 14px;
          z-index: 3;
        }
        .hero-card {
          display: inline-flex;
          line-height: 0;
          text-decoration: none;
          color: inherit;
          /* Cards start hidden + offset for the slide-up. */
          opacity: 0;
          transform: translateY(40px);
          transition:
            opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 700ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
          /* Each card has its own height/width set below — the
             SVGs are display:block and inherit the wrapper's
             explicit dimensions. */
          position: relative;
        }
        .hero-card img {
          display: block;
          width: 100%;
          height: 100%;
        }
        .hero-card:hover {
          filter: brightness(1.12);
        }

        /* Card sizing — keep the staircase aspect (shortest -> tallest
           -> medium L->R). All heights are fluid using clamp so the
           composition holds on tablet too. Widths derive from
           each SVG's native aspect ratio. */
        .hero-card-zeus {
          /* Square (1:1). Smaller height -> shortest in the staircase. */
          width: clamp(120px, 13vw, 170px);
          height: clamp(120px, 13vw, 170px);
        }
        .hero-card-agents {
          /* Tallest in the staircase. Aspect 193.5 / 252.49 = 0.766. */
          height: clamp(180px, 19vw, 245px);
          width: calc(clamp(180px, 19vw, 245px) * 0.766);
        }
        .hero-card-net {
          /* Medium height, wider than tall. Aspect 260.45 / 192.47 = 1.353. */
          height: clamp(130px, 14vw, 180px);
          width: calc(clamp(130px, 14vw, 180px) * 1.353);
        }

        /* Avatar inside the Agents card's top-right notch.
           Position values from rasterized SVG measurement:
             center  72.3% x / 18.5% y
             radius  17.4% of card width
           Diameter = 2 * 17.4% = 34.8% of card width. We use
           34% to leave a 0.4% safety margin around the inner
           edge of the SVG's white circle so the avatar doesn't
           bleed past the white border. */
        .hero-card-agents-avatar {
          position: absolute;
          width: 32%;
          aspect-ratio: 1;
          /* Translate so the avatar's center hits the circle's
             center: left + half-width = cx. Equivalent:
             left: cx% - half-width. With width:32% and cx:72.3%,
             left = 72.3 - 16 = 56.3%. Same approach for top. */
          left: 56.3%;
          top: 6.5%;  /* cy 18.5% - half-height (16%) ≈ 2.5%, but adjusted
                         visually because the SVG's "circle" extends
                         slightly above; tuned to 6.5% so the avatar
                         doesn't poke above the white ring. */
          border-radius: 50%;
          object-fit: cover;
          /* Lift above the SVG image. */
          z-index: 1;
        }

        /* CHOREOGRAPHY STEP 3 — cards appear LAST, after the
           buttons. Stagger between cards = 120ms (matching the
           previous ladder pattern, per user "current hero
           pattern"). */
        .hero-ready .hero-card {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-ready .hero-card-zeus    { transition-delay: 800ms; }
        .hero-ready .hero-card-agents  { transition-delay: 920ms; }
        .hero-ready .hero-card-net     { transition-delay: 1040ms; }

        /* prefers-reduced-motion: skip the slide-up animation
           entirely. Everything renders instantly. */
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

        /* TABLET — tighten gaps + shrink slightly. */
        @media (max-width: 1024px) {
          .hero-left {
            left: 5%;
            max-width: 540px;
          }
          .hero-cards {
            right: 3%;
            gap: 10px;
          }
        }

        /* MOBILE — stack the layout. Headline + buttons centered/
           full width; cards become a horizontal row at the bottom
           that may scroll horizontally on very narrow viewports.
           Keeping it simple: cards stack into a 1-column grid
           below the headline on mobile so nothing overflows.

           Flagged for follow-up: the design is desktop-oriented and
           mobile may need its own bespoke layout. This is a
           defensive baseline so the page is usable on mobile. */
        @media (max-width: 768px) {
          .hero-left {
            position: static;
            transform: none;
            max-width: none;
            padding: 24px 20px 0;
            margin-top: 14vh;
          }
          .hero-headline {
            width: 80%;
            max-width: 360px;
          }
          .hero-cards {
            position: static;
            margin: 28px 16px 24px;
            justify-content: center;
            flex-wrap: wrap;
          }
          .hero-card-zeus,
          .hero-card-agents,
          .hero-card-net {
            height: clamp(90px, 22vw, 140px);
          }
          .hero-card-zeus {
            width: clamp(90px, 22vw, 140px);
          }
          .hero-card-agents {
            width: calc(clamp(90px, 22vw, 140px) * 0.766);
          }
          .hero-card-net {
            width: calc(clamp(90px, 22vw, 140px) * 1.353);
          }
        }
      `}</style>
    </section>
  )
}
