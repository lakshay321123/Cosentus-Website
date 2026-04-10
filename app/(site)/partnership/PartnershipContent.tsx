'use client'

import { useState } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import PartnersSection from '@/components/sections/PartnersSection'

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
  const [activeQuote, setActiveQuote] = useState(0)

  return (
    <>
      <style>{`
        /* Giant Stats */
        .partnership-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          position: relative;
        }

        .partnership-stats::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 5%;
          right: 5%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gray-200), transparent);
        }

        .stat-block {
          text-align: center;
          padding: 64px 24px;
          position: relative;
        }

        .stat-block + .stat-block::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 1px;
          background: var(--gray-200);
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

        /* Testimonial Spotlight */
        .testimonial-spotlight {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 0;
          min-height: 500px;
        }

        .testimonial-nav {
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255,255,255,0.1);
        }

        .testimonial-nav-item {
          padding: 24px 28px;
          cursor: pointer;
          border: none;
          background: transparent;
          text-align: left;
          color: rgba(255,255,255,0.4);
          font-size: 14px;
          font-weight: 400;
          transition: all 0.4s ease;
          border-left: 3px solid transparent;
          font-family: var(--font-display);
        }

        .testimonial-nav-item:hover {
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.03);
        }

        .testimonial-nav-item.active {
          color: white;
          background: rgba(0,181,214,0.1);
          border-left-color: var(--primary);
        }

        .testimonial-nav-company {
          font-size: 11px;
          opacity: 0.5;
          margin-top: 2px;
        }

        .testimonial-display {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 80px;
          position: relative;
        }

        .testimonial-display::before {
          content: '"';
          position: absolute;
          top: 40px;
          left: 60px;
          font-size: 200px;
          line-height: 1;
          color: rgba(0,181,214,0.08);
          font-family: Georgia, serif;
          font-weight: 700;
        }

        .testimonial-quote {
          font-size: clamp(20px, 2.5vw, 28px);
          font-weight: 300;
          line-height: 1.6;
          color: white;
          position: relative;
          z-index: 1;
          font-style: italic;
        }

        .testimonial-author-block {
          margin-top: 40px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .testimonial-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 600;
          color: white;
        }

        .testimonial-author-name {
          font-size: 16px;
          font-weight: 500;
          color: white;
        }

        .testimonial-author-title {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          margin-top: 2px;
        }

        /* Challenges */
        .challenge-row {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 24px;
          align-items: center;
          padding: 32px 0;
          border-bottom: 1px solid var(--gray-100);
          transition: all 0.4s ease;
        }

        .challenge-row:first-child {
          border-top: 1px solid var(--gray-100);
        }

        .challenge-row:hover {
          padding-left: 12px;
        }

        .challenge-number {
          font-size: 48px;
          font-weight: 200;
          color: var(--primary);
          font-family: var(--font-display);
          line-height: 1;
        }

        .challenge-text {
          font-size: 18px;
          color: var(--gray-700);
          line-height: 1.5;
        }

        /* Solutions Grid */
        .solutions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
          background: rgba(255,255,255,0.1);
        }

        .solution-card {
          padding: 48px 40px;
          background: rgba(0,30,50,0.95);
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
          background: rgba(0,50,70,0.95);
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

      {/* Testimonial Spotlight — Dark */}
      <section style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #071520 100%)', padding: '0' }}>
        <div className="container" style={{ padding: 0, maxWidth: '100%' }}>
          <RevealOnScroll>
            <div style={{ padding: '40px 40px 0', maxWidth: 'var(--container)', margin: '0 auto' }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,181,214,0.6)', marginBottom: 8 }}>Partner Perspectives</div>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, color: 'white', marginBottom: 0 }}>Our Partner&apos;s Perspective</h2>
            </div>
          </RevealOnScroll>
          <div className="testimonial-spotlight">
            <div className="testimonial-nav">
              {partnerQuotes.map((q, i) => (
                <button
                  key={i}
                  className={`testimonial-nav-item ${activeQuote === i ? 'active' : ''}`}
                  onClick={() => setActiveQuote(i)}
                >
                  {q.author}
                  <div className="testimonial-nav-company">{q.title}</div>
                </button>
              ))}
            </div>
            <div className="testimonial-display">
              <p className="testimonial-quote">
                &ldquo;{partnerQuotes[activeQuote].quote}&rdquo;
              </p>
              <div className="testimonial-author-block">
                <div className="testimonial-avatar">
                  {partnerQuotes[activeQuote].author.split(' ').map(w => w[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <div className="testimonial-author-name">{partnerQuotes[activeQuote].author}</div>
                  <div className="testimonial-author-title">{partnerQuotes[activeQuote].title}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges — Editorial */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <RevealOnScroll>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: 8 }}>Common Challenges</div>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, color: 'var(--gray-900)', marginBottom: 48 }}>Is Your Journey to Growth Facing These Challenges?</h2>
          </RevealOnScroll>
          {challenges.map((c, i) => (
            <RevealOnScroll key={i} delay={i * 0.08}>
              <div className="challenge-row">
                <div className="challenge-number">{c.number}</div>
                <div className="challenge-text">{c.text}</div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Think Growth Solutions — Dark */}
      <section style={{ background: 'linear-gradient(135deg, #071520 0%, #0d2137 50%, #0a1628 100%)', padding: '80px 0' }}>
        <div className="container">
          <RevealOnScroll>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 200, fontStyle: 'italic', color: 'white', textAlign: 'center', marginBottom: 56, letterSpacing: '-0.02em' }}>THINK GROWTH</h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="solutions-grid">
              {solutions.map((s, i) => (
                <div className="solution-card" key={i}>
                  <div className="solution-stat">{s.stat}<span className="stat-suffix">{s.unit}</span></div>
                  <div className="solution-title">{s.title}</div>
                  <div className="solution-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Accolades */}
      <section style={{ padding: '48px 0', background: 'var(--gray-50)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <RevealOnScroll>
            <img src="/images/accolade-badges.png" alt="SOC 2, HIPAA, Inc. 5000, Great Place to Work, HBMA Member" style={{ maxWidth: 600, width: '100%', opacity: 0.85 }} />
          </RevealOnScroll>
        </div>
      </section>

      {/* Partners */}
      <PartnersSection />

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
