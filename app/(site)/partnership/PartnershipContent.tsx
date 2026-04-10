'use client'

import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

const partnerQuotes = [
  { quote: 'We are very excited to be a part of the Cosentus family. We see such a strategic fit amongst the teams and are ready to unlock all of the combined potential.', author: 'Alex Cushman', title: 'CEO, AllianceMed' },
  { quote: "We are proud of the company we've built and excited to join forces with Cosentus. Together, we'll have the resources, technology, & expertise to provide even greater value to the healthcare providers we serve.", author: 'Brandon Jones', title: 'CEO, Alta Management Solutions, LLC' },
  { quote: 'Cosentus made the acquisition of North Medical Billing seamless, delivering on every promise and exceeding expectations. Professional, efficient, and trustworthy, they turned a business relationship into a lasting friendship. Highly recommend!', author: 'Doug North', title: 'Founder & Former Owner, North Medical Billing' },
  { quote: 'We are excited to play an even bigger role in the world of RCM and healthcare consulting, with an expanded team that is poised to provide unmatched outcomes.', author: 'Arthur Roosa', title: 'CEO and founder of SyMed' },
  { quote: 'Together with Cosentus, our clients will benefit from cutting-edge technology, deeper analytics, and a partnership model that truly understands and drives their financial success.', author: 'Logan Lowry', title: 'Co-Founder and President of Accreda' },
]

const challenges = [
  { number: '01', text: 'Scaling operations without losing quality or client relationships' },
  { number: '02', text: 'Keeping pace with technology and AI advancements' },
  { number: '03', text: 'Managing rising costs while maintaining profitability' },
  { number: '04', text: 'Competing against private equity-backed consolidators' },
]

const solutions = [
  { stat: '25', unit: 'Years', title: 'Revenue Cycle Management', desc: 'Successfully integrated 19 acquisitions — we know how to grow together.' },
  { stat: '∞', unit: '', title: 'Upfront Capital Investments', desc: 'De-risk the owners, providing financial security and runway for growth.' },
  { stat: '360°', unit: '', title: 'Comprehensive Solutions', desc: 'Offshore teams, advanced technology platforms, AI software, and dedicated support.' },
  { stat: '10x', unit: '', title: 'Transformative Offshoring & Tech', desc: 'Enhance efficiency, reduce costs, and improve service delivery at scale.' },
]

export default function PartnershipContent() {

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <style>{`
        
        /* Giant Stats */
        .partnership-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          position: relative;
        }



        .stat-block {
          text-align: center;
          padding: 64px 24px;
          position: relative;
        }



        .stat-number {
          font-size: clamp(56px, 8vw, 96px);
          font-weight: 200;
          color: var(--primary);
          line-height: 0.9;
          letter-spacing: -0.04em;
          font-family: var(--font-display);
        }

        .stat-suffix {
          font-size: clamp(20px, 3vw, 32px);
          font-weight: 200;
          color: var(--primary);
          opacity: 0.6;
        }

        .stat-label {
          font-size: 13px;
          color: var(--gray-500);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 12px;
          font-weight: 500;
        }

        
        .solutions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
          background: rgba(255,255,255,0.05);
        }

        .solution-card {
          padding: 48px 40px;
          background: rgba(255,255,255,0.08);
          transition: all 0.5s ease;
          position: relative;
          overflow: hidden;
        }

        .solution-card::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--primary);
          transform: scaleX(0);
          transition: transform 0.5s ease;
          transform-origin: left;
        }

        .solution-card:hover::before {
          transform: scaleX(1);
        }

        .solution-card:hover {
          background: rgba(255,255,255,0.15);
        }

        .solution-stat {
          font-size: clamp(36px, 4vw, 52px);
          font-weight: 200;
          color: var(--primary);
          line-height: 1;
          margin-bottom: 20px;
          font-family: var(--font-display);
        }

        .solution-title {
          font-size: 18px;
          font-weight: 500;
          color: white;
          margin-bottom: 10px;
        }

        .solution-desc {
          font-size: 15px;
          color: rgba(255,255,255,0.55);
          line-height: 1.6;
        }

        /* CTA Form */
        .partnership-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .partnership-form input,
        .partnership-form textarea {
          width: 100%;
          padding: 14px 18px;
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-sm);
          font-size: 15px;
          font-family: var(--font-display);
          background: var(--gray-50);
          transition: border-color 0.3s;
          outline: none;
        }

        .partnership-form input:focus,
        .partnership-form textarea:focus {
          border-color: var(--primary);
        }

        .partnership-form textarea {
          grid-column: 1 / -1;
          min-height: 100px;
          resize: vertical;
        }

        .partnership-form .form-full {
          grid-column: 1 / -1;
        }

        @media (max-width: 768px) {
          .partnership-stats {
            grid-template-columns: 1fr;
          }

          .stat-block + .stat-block::before {
            display: none;
          }

          .stat-block {
            padding: 32px 24px;
          }

          .testimonial-spotlight {
            grid-template-columns: 1fr;
          }

          .testimonial-nav {
            flex-direction: row;
            overflow-x: auto;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }

          .testimonial-nav-item {
            white-space: nowrap;
            padding: 16px 20px;
            border-left: none;
            border-bottom: 3px solid transparent;
          }

          .testimonial-nav-item.active {
            border-left-color: transparent;
            border-bottom-color: var(--primary);
          }

          .testimonial-display {
            padding: 40px 28px;
          }

          .challenge-row {
            grid-template-columns: 60px 1fr;
          }

          .solutions-grid {
            grid-template-columns: 1fr;
          }

          .partnership-form {
            grid-template-columns: 1fr;
          }
        }
      `}</style>


      {/* Giant Stats */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <RevealOnScroll>
            <div className="partnership-stats">
              <div className="stat-block">
                <div className="stat-number">1,000<span className="stat-suffix">+</span></div>
                <div className="stat-label">RCM Experts</div>
              </div>
              <div className="stat-block">
                <div className="stat-number">19</div>
                <div className="stat-label">Successful Acquisitions</div>
              </div>
              <div className="stat-block">
                <div className="stat-number">25<span className="stat-suffix">yr</span></div>
                <div className="stat-label">Years of Excellence</div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Intro */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <RevealOnScroll>
            <p style={{ fontSize: 18, lineHeight: 1.9, color: 'var(--gray-600)', textAlign: 'center' }}>
              With AI software and outsourcing capabilities, we are one of the largest non-private equity-backed RCM companies in America. Our integrated services approach has fostered several long-term partnerships. As an organization, we have consistently ranked as one of the Fastest Growing Companies in the US by Inc. 5000, and have been certified by Great Place to Work for three consecutive years.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Partner Testimonials */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll direction="left">
            <div className="section-label">PARTNER PERSPECTIVES</div>
          </RevealOnScroll>
          <RevealOnScroll direction="left" delay={0.1}>
            <div className="section-title">Our Partner&apos;s Perspective</div>
          </RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24, marginTop: 48 }}>
            {partnerQuotes.map((q, i) => (
              <RevealOnScroll key={i} direction="scale" delay={i * 0.08}>
                <div style={{ padding: '40px 36px', background: 'var(--white)', borderRadius: 16, border: '1px solid var(--gray-200)', position: 'relative', height: '100%', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  <div style={{ position: 'absolute', top: 20, left: 28, fontSize: 64, lineHeight: 1, color: 'var(--primary)', opacity: 0.12, fontFamily: 'Georgia, serif', fontWeight: 700 }}>&ldquo;</div>
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--gray-600)', marginBottom: 28, position: 'relative', zIndex: 1 }}>
                    &ldquo;{q.quote}&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderTop: '1px solid var(--gray-200)', paddingTop: 20 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: 'white', flexShrink: 0 }}>
                      {q.author.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-900)' }}>{q.author}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{q.title}</div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge + Solution */}
      <section style={{ overflow: 'hidden' }}>
        <div className="problem-solution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 400 }}>
          <div className="ps-panel ps-problem" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', background: 'var(--white)', position: 'relative' }}>
            <RevealOnScroll direction="left">
              <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#616161" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                THE CHALLENGE
              </div>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginBottom: 24 }}>
                Is Your Journey to Growth Facing These Challenges?
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.2}>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', maxWidth: 500, marginBottom: 32 }}>
                Medical billing companies face mounting pressure from all sides — rising costs, technology shifts, and aggressive PE consolidation.
              </p>
            </RevealOnScroll>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
              {[
                'Scaling operations without losing quality or client relationships',
                'Keeping pace with technology and AI advancements',
                'Managing rising costs while maintaining profitability',
                'Competing against private equity-backed consolidators',
              ].map((item, i) => (
                <RevealOnScroll key={i} direction="left" delay={0.3 + i * 0.12}>
                  <div className="ps-bullet" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="ps-bullet-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gray-400)', flexShrink: 0, transition: 'all 0.4s ease' }} />
                    <span style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          <div className="ps-panel ps-solution" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', background: '#00B5D6', position: 'relative', overflow: 'hidden' }}>
            <div className="ps-shimmer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            <RevealOnScroll direction="right">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.65)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                THE SOLUTION
              </div>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'white', marginBottom: 24 }}>
                25 Years of RCM Expertise + Real + Artificial Intelligence
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,0.9)', maxWidth: 500, marginBottom: 32 }}>
                One of the largest non-PE-backed RCM companies in America. 19 successful acquisitions. We know how to grow together.
              </p>
            </RevealOnScroll>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
              {[
                '1,000+ dedicated RCM experts ensuring cost-effectiveness',
                'AI software and advanced technology platforms at scale',
                'Comprehensive offshore teams and outsourcing capabilities',
                'Upfront capital investments to de-risk owners',
                'Inc. 5000 and Great Place to Work certified',
              ].map((item, i) => (
                <RevealOnScroll key={i} direction="right" delay={0.3 + i * 0.12}>
                  <div className="ps-bullet-light" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>





      {/* CTA with Form */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', maxWidth: 1000, margin: '0 auto' }}>
            <RevealOnScroll>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: 8 }}>Get Started</div>
                <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, color: 'var(--gray-900)', marginBottom: 20 }}>Partner with Cosentus</h2>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--gray-600)' }}>
                  At Cosentus, we understand the unique challenges faced by medical billing companies. Our tailored solutions and innovative approach ensure that our partners can overcome these hurdles and achieve sustainable growth.
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={0.15}>
              <form className="partnership-form" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="First Name *" required />
                <input type="text" placeholder="Last Name *" required />
                <input type="text" placeholder="Company *" required />
                <input type="email" placeholder="Email *" required />
                <textarea placeholder="Message *" required />
                <div className="form-full">
                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    I Would Like to Know More
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </button>
                </div>
              </form>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </>
  )
}
