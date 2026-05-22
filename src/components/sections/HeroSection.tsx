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

        {/* 4 glass cards spanning the bottom of the hero. Each is
            fully clickable; box 1 uses a plain <a> with hash anchor
            for native smooth-scroll to #ra, the other three are
            Next.js <Link> to route pages. */}
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
      </div>

      <style>{`
        /* The hero's own gradient overlay is now redundant on every
           viewport because ImmersiveVideoBackground draws a page-wide
           overlay. Hidden everywhere. */
        .hero-overlay {
          display: none;
        }

        /* The hero is min-height: 100vh (set in globals.css). Make it
           a flex column so the H1 sits at the top and the .hero-cards
           row gets pushed to the bottom via margin-top: auto. This
           survives the typing animation (which changes the H1's
           rendered height as lines appear) without the cards moving. */
        .home-immersive .hero-content {
          display: flex;
          flex-direction: column;
          padding-bottom: 56px;
        }

        .hero-cards {
          /* margin-top: auto pushes this row to the bottom of the
             flex hero-content column, regardless of H1 height. */
          margin-top: auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          padding-top: 48px;
        }

        /* GLASS-SQUARE recipe — same as Specialty cards, Resource
           card bodies, Testimonial cards, and footer in this PR.
           Reproducing the look in CSS (not stretching glass_square.svg)
           so the border thickness stays uniform at any aspect ratio. */
        .hero-card {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 22px 20px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.30);
          border: 1.5px solid rgba(255, 255, 255, 0.50);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.20);
          text-decoration: none;
          color: inherit;
          transition:
            transform 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
            background-color 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
            border-color 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
            box-shadow 280ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .hero-card:hover {
          transform: translateY(-4px);
          background-color: rgba(255, 255, 255, 0.42);
          border-color: rgba(255, 255, 255, 0.75);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.30);
        }

        /* Diagonal sparkle — TOP-LEFT corner (matches glass_square.svg
           mask#id0: 135deg gradient). */
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
          font-size: 16px;
          font-weight: 700;
          line-height: 1.25;
          letter-spacing: -0.005em;
          margin: 0 0 6px;
          color: #fff;
        }
        .hero-card-blurb {
          font-size: 13px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
        }

        /* Tablet: 2 columns. */
        @media (max-width: 900px) {
          .hero-cards {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
            padding-top: 32px;
          }
        }
        /* Mobile: single column stack. */
        @media (max-width: 580px) {
          .hero-cards {
            grid-template-columns: 1fr;
            gap: 12px;
            padding-top: 24px;
          }
          .hero-card {
            padding: 16px 18px;
          }
          .hero-card-title {
            font-size: 15px;
          }
          .hero-card-blurb {
            font-size: 12.5px;
          }
        }
      `}</style>
    </section>
  )
}
