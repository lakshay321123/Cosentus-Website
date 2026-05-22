'use client'

// HeroSection: 4-line tagline typed out sequentially via
// MultiLineTyping. Each line types character by character, then
// the next line begins; once all 4 are typed the cursor stays
// blinking on the last line. When the headline finishes typing,
// the bottom-row cards begin entering with a staggered
// slide-up + fade animation.
//
// Specialty pills used to live here as a 3-column glass-pill grid.
// They moved to SpecialtiesSection.tsx.
//
// Hero no longer renders its own <video>. ImmersiveVideoBackground
// serves the page-level video for both desktop and mobile.
//
// THREE GLASS CARDS forming a bottom-aligned LADDER (heights
// 220/290/360px ascending L->R, all bottoms touching the hero
// floor):
//   1. Built For Your Specialty -> /specialties
//   2. Zeus AI                  -> /zeus-ai
//   3. About Cosentus           -> /about
// (Voice Agents card was dropped per user direction.) Each card
// uses the same glass-square recipe (30% white wash + 1.5px white
// outline + two diagonal corner sparkles) as the Specialty cards,
// Resource card bodies, Testimonial fan-stack, and Footer
// elsewhere in this PR. Single visual language across the home.
//
// Card entrance: gated on the headline finishing. Each card
// translates 60px up from below + fades in over 600ms, with a
// 120ms stagger between cards.

import { useState } from 'react'
import Link from 'next/link'
import MultiLineTyping from '@/components/ui/MultiLineTyping'

const TAGLINE_LINES = [
  'Purpose Built',
  'For Your Specialty',
  'Real People + AI.',
  'RCM Redefined.',
]

// Each hero card's content + click destination + height. Ladder
// composition: card 1 shortest, card 3 tallest. All three are Next.js
// <Link>s to route pages (Voice Agents card was dropped per user
// direction).
type HeroCard = {
  title: string
  blurb: string
  href: string
  /** Card height in px on desktop. Forms a rising ladder when
   *  rendered left-to-right in HERO_CARDS order. */
  height: number
}

const HERO_CARDS: HeroCard[] = [
  {
    title: 'Built For Your Specialty',
    blurb: 'Anesthesia, Pain, Orthopedics, ASCs, Behavioral, Multi-Specialty.',
    href: '/specialties',
    height: 220,
  },
  {
    title: 'Zeus AI',
    blurb: 'Our agentic intelligence layer powering every claim and call.',
    href: '/zeus-ai',
    height: 290,
  },
  {
    title: 'About Cosentus',
    blurb: '25 years of RCM. Now redefined.',
    href: '/about',
    height: 360,
  },
]

export default function HeroSection() {
  // Gates the bottom-row card entrance animation. Set to true by
  // MultiLineTyping's onComplete callback once all 4 lines of the
  // headline have finished typing. The 'cards-ready' class added
  // to .hero-cards triggers the per-card slide-up + fade transition
  // defined in the <style> block below.
  const [headlineDone, setHeadlineDone] = useState(false)

  return (
    <section className="hero">
      <div className="hero-bg">
        <div
          className="hero-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(0,53,69,0.75) 0%, rgba(0,89,110,0.55) 40%, rgba(0,181,214,0.3) 100%)',
            zIndex: 1,
          }}
        />
      </div>

      <div className="hero-content">
        <MultiLineTyping
          as="h1"
          lines={TAGLINE_LINES}
          typingSpeed={55}
          lineGap={300}
          onComplete={() => setHeadlineDone(true)}
        />
      </div>

      {/* 3 glass cards forming a bottom-aligned ladder at the
          bottom of the hero. Each card has its own height
          (HERO_CARDS[i].height); they all share the same baseline
          (bottom: 0 on parent) so the ladder rises from left to
          right. Per user direction: rounded corners, visible gaps
          between cards.

          Cards start hidden (opacity 0 + translateY 60px). When the
          headline finishes typing, .hero-cards gets the
          'cards-ready' class, which kicks off the per-card
          transition. Each card has its own transition-delay
          (--stagger * index) so they appear one after the other
          120ms apart. */}
      <div className={`hero-cards${headlineDone ? ' cards-ready' : ''}`}>
        {HERO_CARDS.map((card, idx) => (
          <Link
            key={card.title}
            href={card.href}
            className="hero-card"
            style={{
              height: card.height,
              // Per-card stagger: card 0 starts immediately,
              // card 1 at +120ms, card 2 at +240ms. Read by the
              // .hero-card transition-delay rule via the CSS var.
              ['--card-delay' as string]: `${idx * 120}ms`,
            }}
          >
            <h3 className="hero-card-title">{card.title}</h3>
            <p className="hero-card-blurb">{card.blurb}</p>
          </Link>
        ))}
      </div>

      <style>{`
        /* The hero's own gradient overlay is now redundant on every
           viewport because ImmersiveVideoBackground draws a page-wide
           overlay. Hidden everywhere. */
        .hero-overlay {
          display: none;
        }

        /* .hero is the absolute-positioning context for .hero-cards.
           globals.css declares position: relative on .hero already
           (via .home-immersive scope), but we make it explicit here
           to be robust against any future change.

           globals.css's @media (min-width: 769px) block ALSO declares
           .home-immersive .hero as a flex column with
           justify-content: center — which vertically centers
           .hero-content within the 100vh hero. With the 280px bottom
           card row added, the centered H1 ended up overlapping the
           cards. Override to flex-start so the H1 anchors at the
           top and padding-top below actually controls position. */
        .hero {
          position: relative;
        }
        .home-immersive .hero {
          justify-content: flex-start !important;
        }

        /* Shift the hero H1 UP so it isn't covered by the bottom
           card row. globals.css's @media block sets padding-top:
           140px on .home-immersive .hero-content. With justify-content
           now anchored to the top, this padding-top actually
           controls H1 position. Keeping the original 140px since
           the H1 was already legible at that offset before — the
           overlap was caused by flex centering, not by padding. */
        .home-immersive .hero-content {
          padding-bottom: 0 !important;
        }

        /* 3 glass cards forming a bottom-aligned ladder at the
           bottom of the hero. Per user direction:
             - 3 cards (Voice Agents dropped)
             - heights vary in a ladder: short / medium / tall
             - bottoms all align (touch the hero's bottom edge)
             - cards do NOT touch each other or the viewport edges
               (visible gaps between, side padding on the row)
             - rounded corners matching the source glass_square.svg
               (~9% of the side; values clamped to a reasonable
               24px since cards are no longer strict squares)
        */
        .hero-cards {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          /* align-items: end pins each card's bottom edge to the
             grid track's bottom, so all 3 cards share the same
             baseline regardless of their individual heights —
             producing the ladder rising upward. */
          align-items: end;
          gap: 24px;
          /* Side + bottom padding so the row sits INSIDE the
             viewport with breathing room from the edges (no
             full-bleed anymore). */
          padding: 0 40px 40px;
          z-index: 3;
        }

        .hero-card {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 32px 28px;
          /* Rounded corners matching glass_square.svg's geometry
             (radius 566.87 / side 6370.52 = 8.9% of side). At our
             card widths (~500-700px) that ratio would be huge;
             clamping to a tasteful 24px which still reads as
             clearly rounded without overpowering the type inside. */
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.30);
          border: 1.5px solid rgba(255, 255, 255, 0.50);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.20);
          text-decoration: none;
          color: inherit;

          /* ENTRANCE STATE — cards start invisible and translated
             down. Once parent .hero-cards gets .cards-ready class
             (after MultiLineTyping finishes), the transition fires
             and each card slides up + fades in. */
          opacity: 0;
          transform: translateY(60px);

          /* Combined transition: entrance properties (opacity,
             transform) on a longer duration with per-card stagger;
             hover properties (background, border, shadow) on a
             shorter duration with no delay so hover stays snappy
             after entrance completes. */
          transition:
            opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) var(--card-delay, 0ms),
            transform 600ms cubic-bezier(0.16, 1, 0.3, 1) var(--card-delay, 0ms),
            background-color 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
            border-color 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
            box-shadow 280ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        /* Cards-ready: headline finished typing, slide each card
           into place. Per-card --card-delay drives the stagger
           (set inline in JSX as idx * 120ms). */
        .hero-cards.cards-ready .hero-card {
          opacity: 1;
          transform: translateY(0);
        }
        /* Accessibility: skip the slide-in entirely for users who
           opted out of motion. Cards appear instantly when
           cards-ready fires. */
        @media (prefers-reduced-motion: reduce) {
          .hero-card {
            opacity: 0;
            transform: none;
            transition: none;
          }
          .hero-cards.cards-ready .hero-card {
            opacity: 1;
          }
        }

        .hero-card:hover {
          /* Cards no longer touch neighbours, so transform:translateY
             is safe again. Lift on hover for tactile feedback. The
             entrance transform sets translateY(0); hover overrides
             to translateY(-4px). Because both target the same
             property the transition between them is smooth. */
          transform: translateY(-4px);
          background-color: rgba(255, 255, 255, 0.42);
          border-color: rgba(255, 255, 255, 0.75);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.30);
        }

        /* Diagonal sparkle — TOP-LEFT corner (matches glass_square.svg
           mask#id0: 135deg gradient fading at 45%). */
        .hero-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.55) 0%,
            rgba(255, 255, 255, 0.00) 45%
          );
          pointer-events: none;
          z-index: 0;
        }
        /* BOTTOM-RIGHT corner (mask#id2: 315deg gradient). */
        .hero-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            315deg,
            rgba(255, 255, 255, 0.55) 0%,
            rgba(255, 255, 255, 0.00) 45%
          );
          pointer-events: none;
          z-index: 0;
        }
        /* Lift card contents above the sparkles. */
        .hero-card > * {
          position: relative;
          z-index: 1;
        }

        .hero-card-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          line-height: 1.25;
          letter-spacing: -0.005em;
          margin: 0 0 12px;
          color: #fff;
        }
        .hero-card-blurb {
          font-size: 14px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
        }

        /* Tablet: 3 columns still fit at ~900px viewport but get
           tighter. Reduce card heights proportionally so the row
           doesn't take too much vertical space. */
        @media (max-width: 900px) {
          .hero-cards {
            gap: 16px;
            padding: 0 24px 24px;
          }
          .hero-card {
            padding: 22px 20px;
          }
          .hero-card-title {
            font-size: 17px;
          }
          .hero-card-blurb {
            font-size: 13px;
          }
        }
        /* Mobile: stack to 1 column. The ladder collapses — each card
           sizes to its content. Per-card inline height is overridden
           to auto so the cards size naturally; the ladder pattern
           only makes sense at desktop widths. */
        @media (max-width: 580px) {
          .hero-cards {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 0 16px 16px;
          }
          .hero-card {
            height: auto !important;
            padding: 18px 18px;
          }
          .hero-card-title {
            font-size: 16px;
          }
          .hero-card-blurb {
            font-size: 12.5px;
          }
        }
      `}</style>
    </section>
  )
}
