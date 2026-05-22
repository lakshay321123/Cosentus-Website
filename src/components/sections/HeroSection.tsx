'use client'

// HeroSection: 4-line tagline typed out sequentially via
// MultiLineTyping. The previous static <h1> with <br/>s is replaced
// per user direction. Each line types character by character, then
// the next line begins; once all 4 are typed the cursor stays
// blinking on the last line.
//
// Specialty pills used to live here as a 3-column glass-pill grid.
// They moved to SpecialtiesSection.tsx.
//
// Hero no longer renders its own <video>. ImmersiveVideoBackground
// serves the page-level video for both desktop and mobile.
//
// FOUR GLASS CARDS at the bottom of the hero (per user direction):
//   1. Voice Agents — scrolls to the #ra section lower on the page
//   2. Specialty    — links to /specialties
//   3. Zeus AI      — links to /zeus-ai
//   4. About Us     — links to /about
// All four use the same glass-square recipe (30% white wash + 1.5px
// white outline + two diagonal corner sparkles) as the Specialty
// cards, Resource card bodies, Testimonial fan-stack, and Footer
// elsewhere in this PR. Single visual language across the home.

import Link from 'next/link'
import MultiLineTyping from '@/components/ui/MultiLineTyping'

const TAGLINE_LINES = [
  'Purpose Built',
  'For Your Specialty',
  'Real People + AI.',
  'RCM Redefined.',
]

// Each hero card's content + click destination. Box 1 uses an in-page
// anchor (#ra) so it scrolls to the Voice Agents section on the same
// page; the others are Next.js route links.
type HeroCard = {
  title: string
  blurb: string
  href: string
  /** True when href is an in-page anchor — renders as <a> instead of
   *  Next <Link> to use native browser scroll-into-view behavior. */
  scroll?: boolean
}

const HERO_CARDS: HeroCard[] = [
  {
    title: 'Voice Agents',
    blurb: 'Meet the team that handles your front-office calls 24/7.',
    href: '#ra',
    scroll: true,
  },
  {
    title: 'Built For Your Specialty',
    blurb: 'Anesthesia, Pain, Orthopedics, ASCs, Behavioral, Multi-Specialty.',
    href: '/specialties',
  },
  {
    title: 'Zeus AI',
    blurb: 'Our agentic intelligence layer powering every claim and call.',
    href: '/zeus-ai',
  },
  {
    title: 'About Cosentus',
    blurb: '25 years of RCM. Now redefined.',
    href: '/about',
  },
]

export default function HeroSection() {
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
        />
      </div>

      {/* 4 glass cards pinned to the bottom of the hero. Rendered
          OUTSIDE .hero-content so they break free from the container's
          max-width constraint and span the full viewport edge-to-edge.
          Box 1 uses a plain <a> with hash anchor for native scroll to
          #ra; the other three are Next.js <Link> to route pages. */}
      <div className="hero-cards">
        {HERO_CARDS.map((card) => {
          const inner = (
            <>
              <h3 className="hero-card-title">{card.title}</h3>
              <p className="hero-card-blurb">{card.blurb}</p>
            </>
          )
          if (card.scroll) {
            return (
              <a key={card.title} href={card.href} className="hero-card">
                {inner}
              </a>
            )
          }
          return (
            <Link key={card.title} href={card.href} className="hero-card">
              {inner}
            </Link>
          )
        })}
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
           to be robust against any future change. */
        .hero {
          position: relative;
        }

        /* Shift the hero H1 UP so it isn't covered by the bottom
           card row. globals.css declares .hero-content { padding:
           140px 40px 80px }; my override here reduces padding-top to
           anchor the H1 closer to the top of the hero, freeing
           middle space and ensuring all 4 lines of the typing copy
           remain visible above the cards.

           Card row height is fixed at 280px below; with that height
           pinned to the bottom, the remaining vertical space above
           is (100vh - 280px). At 800px viewport that's 520px for
           the H1; at 1080px viewport that's 800px. The reduced
           padding-top gives the H1 room to fit. */
        .home-immersive .hero-content {
          padding-top: 90px;
          padding-bottom: 0;
        }

        /* 4 glass cards pinned to the bottom of the hero, full-bleed
           edge-to-edge. Fixed height (not strict 1:1 aspect ratio)
           so:
             1. Card height doesn't scale with viewport width.
                Previously at 2400px viewport with 4 cols + 1:1
                aspect, each card was 600x600 — eating the H1.
             2. All four cards have the SAME visible height
                regardless of how much content is inside, so they
                look consistently proportioned (the previous
                aspect-ratio approach made cards with denser content
                appear visually compressed even though their box
                was the same size).
        */
        .hero-cards {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          z-index: 3;
          height: 280px;
        }

        .hero-card {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 32px 28px;
          /* No border-radius — strict edge-to-edge with sharp
             corners against neighbors and the viewport. */
          border-radius: 0;
          background: rgba(255, 255, 255, 0.30);
          border: 1.5px solid rgba(255, 255, 255, 0.50);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          text-decoration: none;
          color: inherit;
          transition:
            background-color 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
            border-color 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
            box-shadow 280ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .hero-card:hover {
          background-color: rgba(255, 255, 255, 0.42);
          border-color: rgba(255, 255, 255, 0.75);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.30);
        }

        /* Diagonal sparkle — TOP-LEFT corner (matches glass_square.svg
           mask#id0: 135deg gradient fading at 45%). */
        .hero-card::before {
          content: '';
          position: absolute;
          inset: 0;
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
          font-size: 20px;
          font-weight: 700;
          line-height: 1.25;
          letter-spacing: -0.005em;
          margin: 0 0 10px;
          color: #fff;
        }
        .hero-card-blurb {
          font-size: 14px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
        }

        /* Tablet: 2x2 grid. Row height doubles since two stacked rows. */
        @media (max-width: 900px) {
          .hero-cards {
            grid-template-columns: repeat(2, 1fr);
            height: 380px;
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
        /* Mobile: 1x4 column stack. Auto height so cards size to
           their content rather than a fixed total. */
        @media (max-width: 580px) {
          .hero-cards {
            grid-template-columns: 1fr;
            height: auto;
          }
          .hero-card {
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
