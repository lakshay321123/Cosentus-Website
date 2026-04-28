'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'

// Same testimonial set as before, but rendered with the card-based design
// used across every specialty page (Anesthesia, Orthopedics, Pain, ASC,
// Behavioral Health) for site-wide design consistency.
const testimonials = [
  {
    tag: 'Anesthesia',
    quote: 'Year-over-year collection rate of 97% from commercial payors and 98% overall. I can wholeheartedly recommend Accreda.',
    name: 'Dr. John B. Field Jr.',
    role: 'Vice President, Anesthesia Associates',
  },
  {
    tag: 'Orthopedic',
    quote: 'My reimbursements increased after they started coding for me. They bill right away, work in collection and help with coding.',
    name: 'Dr. Morteza Farr',
    role: 'Board Certified Orthopedic Surgeon',
  },
  {
    tag: 'Pain Management',
    quote: 'Nearly 20 years in practice — Cosentus has provided nothing but positive experiences. Highly recommend without reservations.',
    name: 'Justin Lo, MD',
    role: 'President, Northern California Pain Specialists',
  },
  {
    tag: 'ASC',
    quote: 'Cosentus has truly been fantastic in all aspects. The job they have done on the outstanding balances saved our surgery center.',
    name: 'John Welsh, M.D.',
    role: 'Surgery Center Director',
  },
  {
    tag: 'Behavioral Health',
    quote: 'Cosentus ensures accurate, timely billing, reducing our Days in AR and improving cash flow. Responsive to feedback and quick to implement.',
    name: 'Sujan Vatturi',
    role: 'CIO, Hope Services Counseling Center',
  },
]

// Extract initials from a name (first letter of first 2 word tokens that look like names, skip titles)
function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(w => w.length > 0 && w[0] === w[0].toUpperCase() && !w.includes('.'))
    .map(w => w[0])
    .slice(0, 2)
    .join('')
}

export default function TestimonialsSection() {
  return (
    <section className="section section-alt" style={{ overflow: 'hidden' }}>
      <div className="container">
        <RevealOnScroll>
          <div className="section-label">WHAT OUR CLIENTS SAY</div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <div className="section-title">Real Results from Real Practices.</div>
        </RevealOnScroll>

        <div className="testimonials-responsive" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
          gap: 24,
          marginTop: 48,
        }}>
          {testimonials.map((t, i) => (
            <RevealOnScroll key={i} delay={0.2 + i * 0.1}>
              <div className="testimonial-card" style={{
                padding: '40px 36px',
                background: 'var(--white)',
                borderRadius: 16,
                border: '1px solid var(--gray-200)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
                {/* Specialty tag */}
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#00B5D6',
                  marginBottom: 16,
                  position: 'relative',
                  zIndex: 1,
                }}>
                  {t.tag}
                </div>

                {/* Big translucent quote mark */}
                <div style={{
                  position: 'absolute',
                  top: 20,
                  right: 28,
                  fontSize: 64,
                  lineHeight: 1,
                  color: 'var(--primary)',
                  opacity: 0.12,
                  fontFamily: 'Georgia, serif',
                  fontWeight: 700,
                }} aria-hidden="true">&ldquo;</div>

                <p style={{
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: 'var(--gray-600)',
                  marginBottom: 28,
                  position: 'relative',
                  zIndex: 1,
                  flex: 1,
                }}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  borderTop: '1px solid var(--gray-200)',
                  paddingTop: 20,
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'white',
                    flexShrink: 0,
                  }}>
                    {getInitials(t.name)}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-900)' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
