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
                gap: 14,
                marginBottom: 28,
              }} className="ra-agent-grid">
                {agents.map((agent, i) => (
                  <div key={agent.name} style={{
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: '1px solid var(--gray-200)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    animation: `ra-agent-fadein 0.5s ease-out ${0.4 + i * 0.06}s backwards`,
                    background: 'var(--white)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)'
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  >
                    <div style={{
                      height: 160,
                      background: '#f5f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }} className="ra-agent-img-wrap">
                      <img
                        src={`/images/${agent.img}`}
                        alt={agent.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
                      />
                    </div>
                    <div style={{ background: '#00B5D6', padding: '12px 10px', textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.2 }}>
                        {agent.name}
                      </div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', marginTop: 3, lineHeight: 1.3 }}>
                        {agent.shortRole}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Compact stats line — replaces the giant stat boxes */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32,
                fontSize: 13, color: 'var(--gray-600)',
                fontFamily: 'var(--font-display)', letterSpacing: '-0.005em',
              }}>
                <span><strong style={{ color: '#00B5D6', fontSize: 16 }}>9</strong> Voice Agents</span>
                <span style={{ color: 'var(--gray-300)' }}>·</span>
                <span><strong style={{ color: '#00B5D6', fontSize: 16 }}>15</strong> AI Features</span>
                <span style={{ color: 'var(--gray-300)' }}>·</span>
                <span><strong style={{ color: '#00B5D6', fontSize: 16 }}>23</strong> Modules</span>
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
            <AIWorkflowPanel />
          </RevealOnScroll>
        </div>
      </div>

      <style>{`
        .ra-scanline {
          animation: ra-scanline-move 6s ease-in-out infinite;
        }
        .ra-workflow-wrap { height: 100%; display: flex; }
        .ra-workflow-wrap > * { width: 100%; }
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
          .ra-agent-img-wrap { height: 140px !important; }
        }
        @media (max-width: 700px) {
          .ra-agent-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .ra-agent-img-wrap { height: 200px !important; }
        }
        @media (max-width: 420px) {
          .ra-agent-grid { grid-template-columns: 1fr !important; }
          .ra-agent-img-wrap { height: 220px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ra-scanline { display: none; }
        }
      `}</style>
    </section>
  )
}
