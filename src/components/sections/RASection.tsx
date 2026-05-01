'use client'


import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import AIWorkflowPanel from '@/components/sections/AIWorkflowPanel'

// 9 named voice agents — the actual platform, shown as a team
// Names + shortRoles match the canonical design on the Technology page.
const agents = [
  { name: 'Elly',   shortRole: 'Eligibility Verification', img: 'elly.png' },
  { name: 'Paige',  shortRole: 'Prior Authorization',      img: 'paige.png' },
  { name: 'Priya',  shortRole: 'Pre-Procedure Payments',   img: 'priya.png' },
  { name: 'April',  shortRole: 'Appt. Scheduling',         img: 'april.png' },
  { name: 'Curtis', shortRole: 'Customer Support',         img: 'curtis.png' },
  { name: 'Chris',  shortRole: 'Claims Follow-Up',         img: 'chris.png' },
  { name: 'Cindy',  shortRole: 'Patient Support',          img: 'cindy.png' },
  { name: 'Ariel',  shortRole: 'AR Follow-Up',             img: 'ariel.png' },
  { name: 'Connie', shortRole: 'Coding Assistant',         img: 'connie.png' },
]

export default function RASection() {
  return (
    <section className="section" id="ra" style={{ overflow: 'hidden', position: 'relative' }}>
      {/* Single focused decorative accent — radial glow behind headline area only.
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

      {/* Thin horizontal scan line — slow, restrained, single moment of motion */}
      <div aria-hidden="true" className="ra-scanline" style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(0,181,214,0.4) 50%, transparent)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Two-column × three-row grid. Each row's height is set by the taller
            cell, and both cells in a row share that height. This is the only
            way to get true pixel-precise alignment between left and right
            content without flex-stretch hacks.
              Row 1 — header: left = eyebrow + H2 + paragraph, right = stats (9/15/23)
              Row 2 — body:   left = agent grid 3x3,           right = AI Workflow Panel
              Row 3 — footer: left = Explore Platform link,    right = empty */}
        <div className="ra-main-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'auto auto auto',
          columnGap: 80,
          rowGap: 32,
          alignItems: 'start',
        }}>

          {/* ROW 1 — HEADER LEFT: eyebrow + headline + paragraph */}
          <div style={{ gridColumn: 1, gridRow: 1 }}>
            <RevealOnScroll direction="left">
              <div className="section-label">REAL + ARTIFICIAL INTELLIGENCE</div>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.15}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginBottom: 20 }}>
                Not Just a Billing Company.<br /><span style={{ color: '#00B5D6', fontStyle: 'italic' }}>A Platform.</span>
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.25}>
              <p style={{ fontSize: 16, color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 0 }}>
                Claims chased before you notice them. Denials overturned before they cost you. Collections handled while you see patients.
              </p>
            </RevealOnScroll>
          </div>

          {/* ROW 1 — HEADER RIGHT: 9 / 15 / 23 stats, vertically centered in the row */}
          <div style={{ gridColumn: 2, gridRow: 1, alignSelf: 'center', width: '100%' }}>
            <RevealOnScroll direction="right" delay={0.15}>
              <div className="ra-stats-row" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
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

          {/* ROW 2 — BODY LEFT: agent grid 3x3 */}
          <div style={{ gridColumn: 1, gridRow: 2 }}>
            <RevealOnScroll direction="left" delay={0.35}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '32px 16px',
              }} className="ra-agent-grid">
                {agents.map((agent, i) => (
                  <div key={agent.name} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease',
                    animation: `ra-agent-fadein 0.5s ease-out ${0.4 + i * 0.06}s backwards`,
                    cursor: 'default',
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
                    {/* Name — Reddit Sans, NOT bold per Lakshay's reference image */}
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 17,
                      fontWeight: 500,
                      color: 'var(--gray-900)',
                      letterSpacing: '-0.005em',
                      lineHeight: 1.2,
                    }}>
                      {agent.name}
                    </div>
                    {/* Role — readable black, not bold, regular weight */}
                    <div style={{
                      fontSize: 15,
                      fontWeight: 400,
                      color: 'var(--gray-900)',
                      marginTop: 4,
                      lineHeight: 1.3,
                    }}>
                      {agent.shortRole}
                    </div>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>

          {/* ROW 2 — BODY RIGHT: AI Workflow Panel (top-aligned with agent grid top) */}
          <div style={{ gridColumn: 2, gridRow: 2 }}>
            <RevealOnScroll direction="right" delay={0.3}>
              <AIWorkflowPanel />
            </RevealOnScroll>
          </div>

          {/* ROW 3 — FOOTER LEFT: Explore Platform link */}
          <div style={{ gridColumn: 1, gridRow: 3 }}>
            <RevealOnScroll direction="left" delay={0.45}>
              <Link href="/cosentus-ai" className="btn-ghost" style={{ color: 'var(--primary)', display: 'inline-flex' }}>
                Explore The Platform
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </RevealOnScroll>
          </div>

          {/* ROW 3 — FOOTER RIGHT: empty */}

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
          .ra-agent-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .ra-agent-circle { width: 86px !important; height: 86px !important; }
        }
        @media (max-width: 420px) {
          .ra-agent-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .ra-agent-circle { width: 96px !important; height: 96px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ra-scanline { display: none; }
        }
      `}</style>
    </section>
  )
}
