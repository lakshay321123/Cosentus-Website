'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

const advantages = [
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, title: 'Real + Artificial Intelligence', desc: 'Human expertise combined with AI, purpose-built for your revenue cycle.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>, title: 'Specialty Expertise', desc: 'Built for the billing complexities of your specialty.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, title: 'True Partnership', desc: 'Independently owned. Long-term decisions, not PE pressure.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>, title: 'Outcome Focused', desc: 'Revenue growth and operational control, not vanity metrics.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>, title: 'Tailored Solutions', desc: 'Designed around your practice, not ours.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>, title: 'Clarity Driven', desc: 'Real-time dashboards and AI-powered insights.' },
]

function AdvantageCard({ adv }: { adv: typeof advantages[0] }) {
  return (
    <div className="advantage-card">
      <div className="advantage-icon">{adv.icon}</div>
      <h4>{adv.title}</h4>
      <p>{adv.desc}</p>
    </div>
  )
}

export default function AdvantagesSection() {
  return (
    <section className="section" id="advantage" style={{ overflow: 'hidden' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="advantage-split">
          {/* Left: Image collage */}
          <RevealOnScroll direction="left">
            <div style={{ position: 'relative' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                borderRadius: 16,
                overflow: 'hidden',
              }}>
                <img src="/images/homepage/doctor-consult.jpg" alt="Doctor consultation" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 12 }} />
                <img src="/images/homepage/team-meeting.jpg" alt="Team collaboration" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 12 }} />
                <img src="/images/homepage/medical-tech.jpg" alt="Medical technology" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 12 }} />
                <img src="/images/homepage/analytics.jpg" alt="Healthcare analytics" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 12 }} />
              </div>
              {/* Floating stat badge */}
              <div style={{
                position: 'absolute', bottom: -20, right: -20,
                background: '#00B5D6', color: 'white',
                borderRadius: 16, padding: '20px 28px',
                boxShadow: '0 12px 40px rgba(0,181,214,0.3)',
              }}>
                <div style={{ fontSize: 32, fontWeight: 300, fontFamily: 'var(--font-display)', lineHeight: 1 }}>25+</div>
                <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Years of RCM</div>
              </div>
            </div>
          </RevealOnScroll>

          {/* Right: Advantages */}
          <div>
            <RevealOnScroll direction="right">
              <div className="section-title">The Cosentus Advantage</div>
            </RevealOnScroll>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 36 }} className="advantage-compact-grid">
              {advantages.map((adv, i) => (
                <RevealOnScroll key={i} direction="right" delay={0.15 + i * 0.08}>
                  <div style={{
                    padding: '20px',
                    borderRadius: 12,
                    border: '1px solid var(--gray-200)',
                    transition: 'all 0.3s ease',
                    background: 'var(--white)',
                    height: '100%',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#00B5D6'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,181,214,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--primary-ghost)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                      <div style={{ width: 18, height: 18, color: '#00B5D6' }}>{adv.icon}</div>
                    </div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 4 }}>{adv.title}</h4>
                    <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5, margin: 0 }}>{adv.desc}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .advantage-split { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 640px) {
          .advantage-compact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
