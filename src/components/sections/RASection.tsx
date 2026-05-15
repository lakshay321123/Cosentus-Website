'use client'


import { useState } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import AIWorkflowPanel from '@/components/sections/AIWorkflowPanel'
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
        {/* Two-column × two-row grid. Each row's height is set by the taller
            cell, and both cells in a row share that height. This is the only
            way to get true pixel-precise alignment between left and right
            content without flex-stretch hacks.
              Row 1, header: 9/15/23 stats spanning both columns
                              (paragraph moved to IntroVideoSection above)
              Row 2, body:   left = agent grid 3x3 + Explore Zeus button,
                              right = AI Workflow Panel */}
        <div className="ra-main-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'auto auto',
          columnGap: 80,
          rowGap: 32,
          alignItems: 'start',
        }}>

          {/* ROW 1: 9 / 15 / 23 stats span the full width.
              The narrative paragraph that used to sit in column 1 has
              been extracted into IntroVideoSection (which lives above
              this section on the home page). The visually-hidden h2
              that anchored the section for screen readers moved with
              the paragraph; this section now provides its own h2
              below (also visually-hidden) so screen-reader navigation
              by heading still works.
              A11y note: this section still needs a semantic heading —
              "9 AI Voice Agents" describes what's actually on screen
              now that the paragraph has moved away. */}
          <div style={{ gridColumn: '1 / span 2', gridRow: 1 }}>
            <h2
              style={{
                position: 'absolute',
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                border: 0,
              }}
            >
              9 AI Voice Agents
            </h2>
            <RevealOnScroll direction="up" delay={0.15}>
              <div className="ra-stats-row" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
                maxWidth: 720,
                margin: '0 auto',
              }}>
                {[
                  { num: '9', label: 'Voice Agents' },
                  { num: '15', label: 'AI Features' },
                  { num: '23', label: 'Modules' },
                ].map(stat => (
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(36px, 4.5vw, 56px)',
                      fontWeight: 700,
                      color: '#00B5D6',
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                      marginBottom: 6,
                    }}>
                      {stat.num}
                    </div>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--gray-700)',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>

          {/* ROW 2, BODY LEFT: agent grid 3x3 + Explore Zeus button beneath */}
          <div style={{ gridColumn: 1, gridRow: 2 }}>
            <RevealOnScroll direction="left" delay={0.35}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '32px 16px',
              }} className="ra-agent-grid">
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
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      transition: 'transform 0.3s ease',
                      animation: `ra-agent-fadein 0.5s ease-out ${0.4 + i * 0.06}s backwards`,
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div className="ra-agent-circle" style={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: '#f5f9fa',
                      border: '3px solid #00B5D6',
                      boxShadow: '0 6px 20px rgba(0, 181, 214, 0.18)',
                      marginBottom: 12,
                      flexShrink: 0,
                    }}>
                      <img
                        src={`/images/${agent.img}`}
                        alt={agent.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
                      />
                    </div>
                    {/* Name, bold, matches reference voice.html screenshot */}
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--gray-900)',
                      letterSpacing: '0.01em',
                      lineHeight: 1.2,
                    }}>
                      {agent.name}
                    </div>
                    {/* Role, medium weight, lighter than name, matches reference */}
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'var(--gray-700)',
                      marginTop: 4,
                      lineHeight: 1.3,
                      letterSpacing: '0.01em',
                    }}>
                      {agent.shortRole}
                    </div>
                  </div>
                ))}
              </div>
            </RevealOnScroll>

            {/* Explore Zeus button, sits directly under the 3x3 agent grid */}
            <RevealOnScroll direction="left" delay={0.45}>
              <div style={{ marginTop: 32 }}>
                <Link href="/cosentus-ai" className="btn-primary">
                  Explore Zeus
                </Link>
              </div>
            </RevealOnScroll>
          </div>

          {/* ROW 2, BODY RIGHT: AI Workflow Panel (top-aligned with agent grid top) */}
          <div style={{ gridColumn: 2, gridRow: 2 }}>
            <RevealOnScroll direction="right" delay={0.3}>
              <AIWorkflowPanel />
            </RevealOnScroll>
          </div>

        </div>
      </div>

      <style>{`
        .ra-scanline {
          animation: ra-scanline-move 6s ease-in-out infinite;
        }
        /* Mobile: ra-main-grid collapses to 1 column. The inline gridColumn:1/2
           and gridRow:1/2/3 on each cell would still try to use 2 columns.
           Reset them so cells flow naturally in source order. */
        @media (max-width: 768px) {
          .ra-main-grid > div {
            grid-column: 1 !important;
            grid-row: auto !important;
          }
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
        @media (max-width: 1100px) {
          .ra-agent-circle { width: 100px !important; height: 100px !important; }
        }
        @media (max-width: 700px) {
          .ra-agent-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 18px 10px !important;
          }
          .ra-agent-circle { width: 96px !important; height: 96px !important; }
        }
        @media (max-width: 420px) {
          .ra-agent-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 16px 8px !important;
          }
          .ra-agent-circle { width: 88px !important; height: 88px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ra-scanline { display: none; }
        }
      `}</style>
    </section>
  )
}
