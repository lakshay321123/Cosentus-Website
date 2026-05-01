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
        <div className="ra-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'stretch' }}>
          <div>
            <RevealOnScroll direction="left">
              <div className="section-label">REAL + ARTIFICIAL INTELLIGENCE</div>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.15}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginBottom: 20 }}>
                Not Just a Billing Company.<br /><span style={{ color: '#00B5D6', fontStyle: 'italic' }}>A Platform.</span>
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.25}>
              <p style={{ fontSize: 16, color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 36 }}>
                Claims chased before you notice them. Denials overturned before they cost you. Collections handled while you see patients.
              </p>
            </RevealOnScroll>

            {/* Meet your AI team — 9 agent cards using the SAME design as the Technology page.
                Image on top + brand-blue footer strip with name and role. */}
            <RevealOnScroll direction="left" delay={0.35}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '32px 16px',
                marginBottom: 32,
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
                    {/* Circular avatar with brand-blue ring — matches /voice.html reference */}
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
                    {/* Name in display font, bold */}
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 17,
                      fontWeight: 700,
                      color: 'var(--gray-900)',
                      letterSpacing: '-0.005em',
                      lineHeight: 1.2,
                    }}>
                      {agent.name}
                    </div>
                    {/* Role text — bigger and black for readability per Lakshay's review */}
                    <div style={{
                      fontSize: 15,
                      fontWeight: 500,
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

            <RevealOnScroll direction="left" delay={0.45}>
              <Link href="/cosentus-ai" className="btn-ghost" style={{ color: 'var(--primary)', display: 'inline-flex' }}>
                Explore The Platform
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </RevealOnScroll>
          </div>

          <RevealOnScroll direction="right" delay={0.3} className="ra-workflow-wrap">
            <div className="ra-workflow-stack">
              {/* Big highlight stats — 9 / 15 / 23. Sits ABOVE the workflow
                  panel on the right column so the panel's top edge aligns
                  with the agent grid's top edge on the left column.
                  Per Lakshay: 'shift this AI workflow down where you see
                  Ellie, Paige, Priya... I want it completely aligned'. */}
              <div className="ra-stats-row" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
                paddingBottom: 28,
                marginBottom: 28,
                borderBottom: '1px solid var(--gray-200)',
                flexShrink: 0,
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
              {/* Panel grows to fill remaining vertical space so its bottom
                  matches the bottom of the agent grid on the left column. */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <AIWorkflowPanel />
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      <style>{`
        /* Right column wrapper — stretches to match the left column's height
           via the parent grid's alignItems: stretch. Inside, the wrapper is
           a flex column: stats block at top (natural height), panel below
           with flex: 1 to fill remaining space. This makes the panel's TOP
           align with the agent grid's TOP (since stats above match the
           eyebrow+headline+paragraph block on the left), and the panel's
           BOTTOM align with the agent grid's BOTTOM (since both stretch to
           the same row height). */
        .ra-workflow-wrap {
          align-self: stretch !important;
          height: auto !important;
          display: flex !important;
          flex-direction: column;
        }
        .ra-workflow-wrap > * {
          flex: 1;
          width: 100%;
          min-height: 0;
        }
        .ra-workflow-stack {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .ra-scanline {
          animation: ra-scanline-move 6s ease-in-out infinite;
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
