'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const testimonials = [
  { quote: '97% collection rate. Staggering.', author: 'Dr. John B. Field Jr.', title: 'VP, Anesthesia Associates' },
  { quote: 'My reimbursements increased after they started coding for me.', author: 'Dr. Morteza Farr', title: 'Board Certified Orthopedic Surgeon' },
  { quote: 'Nothing but positive experiences. Highly recommend without reservations.', author: 'Justin Lo, MD', title: 'Northern California Pain Specialists' },
  { quote: 'The outstanding balances saved our surgery center.', author: 'John Welsh, M.D.', title: 'Surgery Center Director' },
  { quote: 'Reducing our Days in AR and improving cash flow.', author: 'Sujan Vatturi', title: 'CIO, Hope Services' },
]

const newsCards = [
  { title: 'Congress Moves to Stop the Bleeding', tag: 'Medicare Policy', href: '/news/congress-moves-to-stop-the-bleeding-new-bill-would-cap-annual-medicare-pay-cuts-at-2-5', size: 'tall' },
  { title: 'Four CMS Changes Every Specialty Must Know', tag: 'CMS Policy', href: '/news/cms-policy-updates-asc', size: 'wide' },
  { title: 'ASC Reimbursement & Payer Strategy', tag: 'ASC', href: '/news/asc-reimbursement-payer-strategy', size: 'normal' },
  { title: 'Medicare ASC Spending Surges 16%', tag: 'Medicare', href: '/news/medicare-asc-spending-surges-16-in-one-year-pain-management-and-cardiology-lead-the-growth', size: 'normal' },
]

export default function HomeBBDO() {
  const [activeQuote, setActiveQuote] = useState(0)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => { setTimeout(() => setHeroVisible(true), 300) }, [])

  useEffect(() => {
    const t = setInterval(() => setActiveQuote(p => (p + 1) % testimonials.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <main>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');

        .bbdo-hero {
          position: relative; height: 100vh; display: flex;
          align-items: center; justify-content: center;
          overflow: hidden; background: #000;
        }
        .bbdo-hero video {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; opacity: 0.55;
        }
        .bbdo-hero-content {
          position: relative; z-index: 2; text-align: center;
          opacity: 0; transform: translateY(30px);
          transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .bbdo-hero-content.visible {
          opacity: 1; transform: translateY(0);
        }
        .bbdo-hero h1 {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(64px, 12vw, 160px);
          font-weight: 400; font-style: italic;
          color: white; line-height: 0.9;
          letter-spacing: -0.03em;
          margin: 0;
        }
        .bbdo-hero-cta {
          display: inline-block; margin-top: 40px;
          padding: 16px 48px; font-size: 14px;
          font-weight: 500; letter-spacing: 0.15em;
          text-transform: uppercase; color: white;
          border: 1px solid rgba(255,255,255,0.4);
          background: transparent; text-decoration: none;
          transition: all 0.4s; cursor: pointer;
        }
        .bbdo-hero-cta:hover {
          background: white; color: #000;
          border-color: white;
        }
        .bbdo-scroll-hint {
          position: absolute; bottom: 32px; left: 50%;
          transform: translateX(-50%); z-index: 2;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.4); font-size: 11px;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .bbdo-scroll-line {
          width: 1px; height: 40px;
          background: linear-gradient(180deg, rgba(255,255,255,0.4), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; height: 40px; }
          50% { opacity: 1; height: 50px; }
        }

        /* Big Stat */
        .bbdo-stat-section {
          min-height: 80vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          background: white; padding: 80px 24px; text-align: center;
        }
        .bbdo-big-number {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(100px, 20vw, 280px);
          font-weight: 400; color: #00B5D6;
          line-height: 0.85; letter-spacing: -0.04em;
        }
        .bbdo-stat-line {
          font-size: clamp(18px, 2.5vw, 28px); font-weight: 300;
          color: var(--gray-600); margin-top: 16px;
          max-width: 500px; line-height: 1.4;
        }

        /* News Grid */
        .bbdo-news { padding: 80px 24px; background: #fafafa; }
        .bbdo-news-label {
          font-size: 12px; font-weight: 500; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--gray-400);
          text-align: center; margin-bottom: 48px;
        }
        .bbdo-news-grid {
          max-width: 1100px; margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 4px;
        }
        .bbdo-news-card {
          position: relative; overflow: hidden;
          background: #111; min-height: 280px;
          display: flex; align-items: flex-end;
          text-decoration: none; cursor: pointer;
          transition: transform 0.4s;
        }
        .bbdo-news-card.tall { grid-row: span 2; min-height: 564px; }
        .bbdo-news-card:hover { transform: scale(0.98); }
        .bbdo-news-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%);
          z-index: 1;
        }
        .bbdo-news-card-inner {
          position: relative; z-index: 2;
          padding: 32px; width: 100%;
        }
        .bbdo-news-tag {
          font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: #00B5D6; margin-bottom: 8px;
        }
        .bbdo-news-title {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(20px, 2.5vw, 32px);
          font-weight: 400; color: white; line-height: 1.2;
        }
        .bbdo-news-card.tall .bbdo-news-title {
          font-size: clamp(24px, 3vw, 40px);
        }

        /* Statement */
        .bbdo-statement {
          min-height: 70vh; display: flex;
          align-items: center; justify-content: center;
          background: #000; padding: 80px 24px; text-align: center;
        }
        .bbdo-statement h2 {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(36px, 6vw, 80px);
          font-weight: 400; color: white;
          line-height: 1.15; letter-spacing: -0.02em;
          max-width: 800px;
        }
        .bbdo-statement h2 span { color: #00B5D6; }

        /* Testimonials */
        .bbdo-testimonials {
          min-height: 60vh; display: flex;
          align-items: center; justify-content: center;
          background: white; padding: 80px 24px; text-align: center;
          position: relative;
        }
        .bbdo-quote-wrap {
          max-width: 700px; margin: 0 auto;
        }
        .bbdo-quote {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(28px, 4vw, 52px);
          font-weight: 400; font-style: italic;
          color: var(--gray-900); line-height: 1.25;
          transition: opacity 0.6s, transform 0.6s;
        }
        .bbdo-quote-author {
          font-size: 14px; color: var(--gray-500);
          margin-top: 32px; letter-spacing: 0.05em;
        }
        .bbdo-quote-dots {
          display: flex; justify-content: center;
          gap: 8px; margin-top: 32px;
        }
        .bbdo-quote-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--gray-200); border: none; padding: 0;
          cursor: pointer; transition: all 0.3s;
        }
        .bbdo-quote-dot.active {
          background: #00B5D6; transform: scale(1.4);
        }

        /* CTA */
        .bbdo-cta {
          min-height: 50vh; display: flex;
          flex-direction: column; align-items: center;
          justify-content: center;
          background: #000; padding: 80px 24px; text-align: center;
        }
        .bbdo-cta h2 {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(48px, 8vw, 120px);
          font-weight: 400; font-style: italic;
          color: white; margin-bottom: 40px;
          letter-spacing: -0.03em;
        }

        @media (max-width: 768px) {
          .bbdo-news-grid { grid-template-columns: 1fr; }
          .bbdo-news-card.tall { grid-row: span 1; min-height: 280px; }
        }
      `}</style>

      {/* HERO */}
      <section className="bbdo-hero">
        <video autoPlay loop muted playsInline>
          <source src="/images/hero-video.mp4" type="video/mp4" />
        </video>
        <div className={`bbdo-hero-content ${heroVisible ? 'visible' : ''}`}>
          <h1>Think<br/>Growth.</h1>
          <Link href="/contact" className="bbdo-hero-cta">Free Revenue Analysis</Link>
        </div>
        <div className="bbdo-scroll-hint">
          <div className="bbdo-scroll-line" />
          Scroll
        </div>
      </section>

      {/* BIG STAT */}
      <section className="bbdo-stat-section">
        <div className="bbdo-big-number">30%</div>
        <div className="bbdo-stat-line">
          That&apos;s how much revenue your practice is leaving behind.
        </div>
      </section>

      {/* NEWS */}
      <section className="bbdo-news">
        <div className="bbdo-news-label">Latest News</div>
        <div className="bbdo-news-grid">
          {newsCards.map((card, i) => (
            <Link key={i} href={card.href} className={`bbdo-news-card ${card.size === 'tall' ? 'tall' : ''}`}>
              <div className="bbdo-news-card-inner">
                <div className="bbdo-news-tag">{card.tag}</div>
                <div className="bbdo-news-title">{card.title}</div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/news" style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--gray-500)', textDecoration: 'none', borderBottom: '1px solid var(--gray-300)', paddingBottom: 4 }}>
            View All News
          </Link>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="bbdo-statement">
        <h2>
          <span>8</span> AI Agents.<br/>
          <span>1,000+</span> Experts.<br/>
          Zero Excuses.
        </h2>
      </section>

      {/* TESTIMONIALS */}
      <section className="bbdo-testimonials">
        <div className="bbdo-quote-wrap">
          <div className="bbdo-quote">
            &ldquo;{testimonials[activeQuote].quote}&rdquo;
          </div>
          <div className="bbdo-quote-author">
            — {testimonials[activeQuote].author}, {testimonials[activeQuote].title}
          </div>
          <div className="bbdo-quote-dots">
            {testimonials.map((_, i) => (
              <button key={i} className={`bbdo-quote-dot ${i === activeQuote ? 'active' : ''}`} onClick={() => setActiveQuote(i)} aria-label={`Quote ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bbdo-cta">
        <h2>Ready?</h2>
        <Link href="/contact" className="bbdo-hero-cta">Free Revenue Analysis</Link>
      </section>
    </main>
  )
}
