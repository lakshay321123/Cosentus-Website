'use client'


import { useState } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import VoiceCallModal, { type VoiceAgent } from '@/components/voice/VoiceCallModal'
import { AGENTS } from '@/data/voice-agents'

const agents = AGENTS

export default function RASection() {
  const [activeAgent, setActiveAgent] = useState<VoiceAgent | null>(null)

  return (
    <section className="section" id="ra" style={{ overflow: 'hidden', position: 'relative' }}>
      {/* Voice call modal, renders only when an agent is clicked */}
      {activeAgent && (
        <VoiceCallModal agent={activeAgent} onClose={() => setActiveAgent(null)} />
      )}
      {/* Single focused decorative accent, radial glow behind headline area only.
          Replaces the noisy random neural mesh per design review. */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '8%',
        left: '-4%',
        width: 520,
        height: 520,
        pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(0,181,214,0.08) 0%, rgba(54,194,222,0.04) 40%, transparent 70%)',
        zIndex: 0,
      }} />

      {/* Thin horizontal scan line, slow, restrained, single moment of motion */}
      <div aria-hidden="true" className="ra-scanline" style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(0,181,214,0.4) 50%, transparent)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Single-column stacked layout:
              1. Visible H2 heading (centered)
              2. 9/15/23 stats row (centered, full-width strip)
              3. 3x3 agent grid (centered on the page)
              4. Explore Zeus button (centered under the grid)
            Agent grid is the centerpiece of the section. */}
        <div className="ra-stack">

          {/* SECTION HEADING — visible, centered, with teal accent
              on the last word per home-page heading convention.
              Reference: the cosentus-ai voice.html page uses this
              same copy ('Click on any agent to start a conversation') as the
              call-to-action above the grid. */}
          <RevealOnScroll direction="up" delay={0.1}>
            <h2 className="ra-heading">
              Click on any agent to start a <span className="accent">conversation</span>
            </h2>
          </RevealOnScroll>

          {/* SUPPORTING SUBHEADING — secondary copy under the H2 that
              frames the agents+stats section. Added per user
              direction with the 'Combining expert teams...' wording.
              Reveal delay 0.14 puts it between the H2 (0.10) and the
              stats row (0.18) so the cascade reads top-to-bottom. */}
          <RevealOnScroll direction="up" delay={0.14}>
            <p className="ra-subheading">
              Combining expert teams and AI-powered technology to optimize your revenue cycle and drive smarter growth.
            </p>
          </RevealOnScroll>

          {/* 9 / 15 / 23 STATS — three-column strip, centered. */}
          <RevealOnScroll direction="up" delay={0.18}>
            <div className="ra-stats-row">
              {[
                { num: '9', label: 'Voice Agents' },
                { num: '15', label: 'AI Features' },
                { num: '23', label: 'Modules' },
              ].map(stat => (
                <div key={stat.label} className="ra-stat">
                  <div className="ra-stat-num">{stat.num}</div>
                  <div className="ra-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* 3x3 AGENT GRID — centered.
              Each agent is a clickable button that opens VoiceCallModal.
              Circle diameter is 132px on desktop (10% larger than the
              prior 120px) per user direction. Mobile sizes (96px / 88px)
              are unchanged because mobile rows are already tight. */}
          <RevealOnScroll direction="up" delay={0.28}>
            <div className="ra-agent-grid">
              {agents.map((agent, i) => (
                <div
                  key={agent.name}
                  role="button"
                  tabIndex={0}
                  aria-label={`Talk to ${agent.name}, ${agent.shortRole}`}
                  onClick={() => setActiveAgent(agent)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setActiveAgent(agent)
                    }
                  }}
                  className="ra-agent"
                  style={{
                    animation: `ra-agent-fadein 0.5s ease-out ${0.35 + i * 0.06}s backwards`,
                  }}
                >
                  <div className="ra-agent-circle">
                    <img
                      src={`/images/${agent.img}`}
                      alt={agent.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
                    />
                  </div>
                  <div className="ra-agent-name">{agent.name}</div>
                  <div className="ra-agent-role">{agent.shortRole}</div>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* EXPLORE ZEUS — centered under the agent grid. */}
          <RevealOnScroll direction="up" delay={0.4}>
            <div className="ra-cta">
              <Link href="/cosentus-ai" className="btn-primary">
                Explore Zeus
              </Link>
            </div>
          </RevealOnScroll>

        </div>
      </div>

      <style>{`
        .ra-scanline {
          animation: ra-scanline-move 6s ease-in-out infinite;
        }

        /* ===== Stacked layout =====
           Replaces the old two-column ra-main-grid. The container
           uses a single flex column so we can give each block its
           own width + alignment without fighting grid placement. */
        .ra-stack {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        /* ===== Section heading =====
           Sized to match the canonical home-page heading scale
           (clamp 32-48px, weight 300) used by SpecialtiesSection,
           ResultsSection, PartnersSection, TestimonialsSection.
           User direction: 'all home headings same size as Built
           for your specialty.' This reverses an earlier
           "smaller text" instruction.
           At the upper clamp value (48px) the sentence "Click on
           any agent to start a conversation" needs roughly 1050px
           — set max-width: 1100px so it stays on one line on
           wide viewports. Will wrap to two lines on narrower
           viewports, expected. */
        .ra-heading {
          font-family: var(--font-display);
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 300;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--gray-900);
          margin: 0 auto;
          text-align: center;
          max-width: 1100px;
          width: 100%;
        }
        .ra-heading .accent {
          color: #00B5D6;
        }

        /* SUPPORTING SUBHEADING — secondary copy under the H2.
           Smaller, lighter weight, softer color so it reads
           clearly as supporting text under the title. Tighter
           max-width than the H2 (650 vs 1100) so it wraps to ~2
           lines on desktop, which keeps it visually grouped with
           the title rather than spreading across the section
           width.

           Color: literal rgba(255,255,255,0.75) since this section
           is home-only and home-immersive's text override would
           catch var(--gray-*) values anyway. Off-home rendering
           would fall back to this same soft white, which still
           reads on the dark video bg used everywhere this section
           appears today. */
        .ra-subheading {
          font-family: var(--font-body);
          font-size: clamp(15px, 1.4vw, 18px);
          font-weight: 400;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.75);
          margin: 16px auto 0;
          text-align: center;
          max-width: 650px;
          width: 100%;
        }

        /* ===== 9 / 15 / 23 stats row =====
           Centered three-column strip. max-width keeps the row from
           sprawling on wide screens. */
        .ra-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          /* Match .ra-agent-grid width below so each stat sits
             directly above its agent column. Both grids use
             repeat(3, 1fr) at the same max-width so column
             centers line up. */
          max-width: 640px;
          margin: 0 auto;
          width: 100%;
        }
        .ra-stat {
          text-align: center;
        }
        .ra-stat-num {
          font-family: var(--font-display);
          font-size: clamp(36px, 4.5vw, 56px);
          font-weight: 700;
          color: #00B5D6;
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }
        .ra-stat-label {
          font-size: 13px;
          font-weight: 600;
          /* White directly. The home-immersive white-text override
             in globals.css catches via [style*="color: var(--gray-X)"]
             attribute selectors which only match INLINE styles, not
             class definitions. Same pattern fix as .ra-agent-name. */
          color: rgba(255, 255, 255, 0.85);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* ===== Agent grid =====
           3 columns at all viewports per user reference (the standalone
           voice.html page is 3x3 across all sizes). Uses
           repeat(3, 1fr) at the same max-width as .ra-stats-row so
           the "9 / 15 / 23" stats sit directly above their
           corresponding agent columns. */
        .ra-agent-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          justify-items: center;
          gap: 36px 16px;
          max-width: 640px;
          margin: 0 auto;
          width: 100%;
        }

        /* Individual agent button (the clickable cell). */
        .ra-agent {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: transform 0.3s ease;
          cursor: pointer;
          outline: none;
        }
        .ra-agent:hover {
          transform: translateY(-4px);
        }
        .ra-agent:focus-visible {
          outline: 2px solid #00B5D6;
          outline-offset: 6px;
          border-radius: 50%;
        }

        /* Circle photo container.
           Default (desktop) size = 132px, which is exactly 10% larger
           than the previous 120px per user direction. The tablet
           (<1100px) and mobile (<700px, <420px) overrides further down
           shrink to fit narrower viewports. */
        .ra-agent-circle {
          width: 132px;
          height: 132px;
          border-radius: 50%;
          overflow: hidden;
          background: #f5f9fa;
          border: 3px solid #00B5D6;
          box-shadow: 0 6px 20px rgba(0, 181, 214, 0.18);
          margin-bottom: 14px;
          flex-shrink: 0;
        }

        .ra-agent-name {
          font-family: var(--font-display);
          font-size: 19px;
          font-weight: 700;
          /* White text on the dark immersive page background. The
             home-immersive white-text override in globals.css uses
             attribute selectors that only match inline styles, so
             classes like this don't get auto-converted. Set the
             color directly here. */
          color: rgba(255, 255, 255, 0.95);
          letter-spacing: 0.01em;
          line-height: 1.2;
        }
        .ra-agent-role {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.75);
          margin-top: 4px;
          line-height: 1.3;
          letter-spacing: 0.01em;
        }

        /* ===== CTA row =====
           Center the Explore Zeus button below the grid. */
        .ra-cta {
          display: flex;
          justify-content: center;
          margin-top: 8px;
        }

        @keyframes ra-scanline-move {
          0%, 100% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(80vh); opacity: 1; }
          60% { opacity: 0; }
        }
        @keyframes ra-agent-fadein {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Tablet: shrink circles + grid gap so 3 cols still fit. */
        @media (max-width: 1100px) {
          .ra-agent-circle { width: 110px; height: 110px; }
          .ra-agent-grid { gap: 28px 36px; }
        }
        /* Phones: tighter gap, smaller circles, keep 3 columns to
           match the standalone voice.html reference. */
        @media (max-width: 700px) {
          .ra-stack { gap: 36px; }
          .ra-agent-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 22px 10px;
          }
          .ra-agent-circle { width: 96px; height: 96px; }
          .ra-agent-name { font-size: 16px; }
          .ra-agent-role { font-size: 12.5px; }
        }
        @media (max-width: 420px) {
          .ra-agent-grid {
            gap: 18px 8px;
          }
          .ra-agent-circle { width: 88px; height: 88px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ra-scanline { display: none; }
        }
      `}</style>
    </section>
  )
}
