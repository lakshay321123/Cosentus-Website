'use client'


import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import AICodingLivePanel from '@/components/sections/AICodingLivePanel'

// 9 named voice agents — the actual platform, shown as a team
const agents = [
  { name: 'Elly',   role: 'Eligibility',  img: 'elly.png' },
  { name: 'Paige',  role: 'Prior Auth',   img: 'paige.png' },
  { name: 'Priya',  role: 'Pre-Service',  img: 'priya.png' },
  { name: 'April',  role: 'Scheduling',   img: 'april.png' },
  { name: 'Curtis', role: 'Support',      img: 'curtis.png' },
  { name: 'Chris',  role: 'Claim F/U',    img: 'chris.png' },
  { name: 'Cindy',  role: 'Patient Pay',  img: 'cindy.png' },
  { name: 'Ariel',  role: 'AR Follow-Up', img: 'ariel.png' },
  { name: 'Connie', role: 'Coding',       img: 'connie.png' },
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
        <div className="ra-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
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

            {/* Meet your AI team — 3x3 grid of the 9 named voice agents.
                Replaces generic stat boxes with the actual platform: real agents, real names, real roles. */}
            <RevealOnScroll direction="left" delay={0.35}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 1,
                marginBottom: 28,
                background: 'var(--gray-200)',
                border: '1px solid var(--gray-200)',
                borderRadius: 12,
                overflow: 'hidden',
              }} className="ra-agent-grid">
                {agents.map((agent, i) => (
                  <div key={agent.name} style={{
                    background: 'var(--white)',
                    padding: '18px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    cursor: 'default',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    animation: `ra-agent-fadein 0.5s ease-out ${0.4 + i * 0.06}s backwards`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#D6EBF2'
                    e.currentTarget.style.transform = 'scale(1.02)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--white)'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                  >
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00B5D6 0%, #36C2DE 100%)',
                      backgroundImage: `url(/images/${agent.img}), linear-gradient(135deg, #00B5D6 0%, #36C2DE 100%)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      flexShrink: 0,
                      border: '2px solid var(--white)',
                      boxShadow: '0 3px 10px rgba(0,181,214,0.3)',
                      position: 'relative',
                    }}>
                      {/* Active dot — subtle "online" indicator */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0, right: 0,
                        width: 12, height: 12, borderRadius: '50%',
                        background: '#00B5D6',
                        border: '2.5px solid var(--white)',
                        animation: `ra-agent-pulse 2.4s ease-in-out infinite ${i * 0.3}s`,
                      }} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--gray-900)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em', lineHeight: 1.1, marginBottom: 3 }}>
                        {agent.name}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {agent.role}
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

          <RevealOnScroll direction="right" delay={0.3}>
            <AICodingLivePanel />
          </RevealOnScroll>
        </div>
      </div>

      <style>{`
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
        @keyframes ra-agent-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @media (max-width: 480px) {
          .ra-agent-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ra-scanline { display: none; }
        }
      `}</style>
    </section>
  )
}
