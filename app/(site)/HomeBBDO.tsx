'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const testimonials = [
  { quote: '97% collection rate. Staggering.', author: 'Dr. John B. Field Jr.', title: 'Anesthesia' },
  { quote: 'My reimbursements increased after they started coding for me.', author: 'Dr. Morteza Farr', title: 'Orthopedics' },
  { quote: 'Nothing but positive experiences. Without reservations.', author: 'Justin Lo, MD', title: 'Pain Management' },
  { quote: 'The outstanding balances saved our surgery center.', author: 'John Welsh, M.D.', title: 'ASC' },
  { quote: 'Reducing our Days in AR and improving cash flow.', author: 'Sujan Vatturi', title: 'Behavioral Health' },
]

const newsCards = [
  { title: 'Congress Moves to Stop the Bleeding', tag: 'Medicare Policy', href: '/news/congress-moves-to-stop-the-bleeding-new-bill-would-cap-annual-medicare-pay-cuts-at-2-5', img: '/images/hero-healthcare.jpg' },
  { title: 'Four CMS Changes Every Specialty Must Know', tag: 'CMS Policy', href: '/news/cms-policy-updates-asc', img: '/images/hero-medical.jpg' },
  { title: 'ASC Reimbursement Under Attack', tag: 'ASC', href: '/news/asc-reimbursement-payer-strategy', img: '/images/hero-team.jpg' },
  { title: 'Medicare ASC Spending Surges 16%', tag: 'Medicare', href: '/news/medicare-asc-spending-surges-16-in-one-year-pain-management-and-cardiology-lead-the-growth', img: '/images/hero-healthcare.jpg' },
]

const caseStudyStats = [
  { number: '$2M', arrow: '→', target: '$16M', label: 'Behavioral Health' },
  { number: '46%', arrow: '', target: 'Growth', label: 'Orthopedics' },
  { number: '129%', arrow: '', target: 'More', label: 'ASC Collections' },
  { number: '$82M', arrow: '→', target: '$165M', label: 'DME' },
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
        /* HERO */
        .bbdo-hero {
          position: relative; height: 100vh; display: flex;
          align-items: center; justify-content: center;
          overflow: hidden; background: #000;
        }
        .bbdo-hero video {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; opacity: 0.5;
        }
        .bbdo-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.5) 100%);
          z-index: 1;
        }
        .bbdo-hero-content {
          position: relative; z-index: 2; text-align: center;
          opacity: 0; transform: translateY(30px);
          transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .bbdo-hero-content.visible { opacity: 1; transform: translateY(0); }
        .bbdo-hero h1 {
          font-family: var(--font-display);
          font-size: clamp(56px, 10vw, 140px);
          font-weight: 800; font-style: italic;
          color: white; line-height: 0.95;
          letter-spacing: -0.03em; margin: 0;
          text-shadow: 0 4px 40px rgba(0,0,0,0.3);
        }
        .bbdo-hero h1 span { color: var(--primary); }
        .bbdo-cta-btn {
          display: inline-block; margin-top: 40px;
          padding: 18px 52px; font-size: 13px;
          font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; color: white;
          background: var(--primary);
          border: none; text-decoration: none;
          transition: all 0.4s; cursor: pointer;
          font-family: var(--font-display);
        }
        .bbdo-cta-btn:hover {
          background: white; color: var(--gray-900);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,181,214,0.3);
        }
        .bbdo-scroll-hint {
          position: absolute; bottom: 32px; left: 50%;
          transform: translateX(-50%); z-index: 2;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.5); font-size: 10px;
          letter-spacing: 0.15em; text-transform: uppercase;
          font-family: var(--font-display);
        }
        .bbdo-scroll-line {
          width: 1px; height: 40px;
          background: linear-gradient(180deg, rgba(255,255,255,0.5), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; } 50% { opacity: 1; }
        }

        /* CASE STUDY STATS */
        .bbdo-cases {
          padding: 100px 24px;
          background: white;
        }
        .bbdo-cases-grid {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .bbdo-case-card {
          padding: 48px 32px; text-align: center;
          border-right: 1px solid var(--gray-200);
          transition: all 0.4s;
        }
        .bbdo-case-card:last-child { border-right: none; }
        .bbdo-case-card:hover { background: var(--primary); }
        .bbdo-case-card:hover .bbdo-case-num,
        .bbdo-case-card:hover .bbdo-case-arrow,
        .bbdo-case-card:hover .bbdo-case-target { color: white; }
        .bbdo-case-card:hover .bbdo-case-label { color: rgba(255,255,255,0.7); }
        .bbdo-case-num {
          font-family: var(--font-display);
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 800; color: var(--primary);
          line-height: 1; transition: color 0.4s;
        }
        .bbdo-case-arrow {
          font-size: 24px; color: var(--gray-400);
          margin: 4px 0; transition: color 0.4s;
        }
        .bbdo-case-target {
          font-family: var(--font-display);
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800; color: var(--gray-900);
          line-height: 1; transition: color 0.4s;
        }
        .bbdo-case-label {
          font-size: 12px; font-weight: 500;
          color: var(--gray-500); margin-top: 16px;
          text-transform: uppercase; letter-spacing: 0.1em;
          transition: color 0.4s;
        }

        /* STATEMENT */
        .bbdo-statement {
          padding: 120px 24px; text-align: center;
          background: var(--primary);
          position: relative; overflow: hidden;
        }
        .bbdo-statement::before {
          content: ''; position: absolute; inset: 0;
          background: url('/images/hero-healthcare.jpg') center/cover;
          opacity: 0.08;
        }
        .bbdo-statement h2 {
          font-family: var(--font-display);
          font-size: clamp(32px, 5vw, 72px);
          font-weight: 800; color: white;
          line-height: 1.15; letter-spacing: -0.02em;
          max-width: 900px; margin: 0 auto;
          position: relative; z-index: 1;
        }
        .bbdo-statement h2 em {
          font-style: italic; font-weight: 300;
          opacity: 0.8;
        }

        /* NEWS */
        .bbdo-news { padding: 80px 24px; background: var(--gray-900); }
        .bbdo-news-label {
          font-family: var(--font-display);
          font-size: 12px; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--primary);
          text-align: center; margin-bottom: 48px;
        }
        .bbdo-news-grid {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: 1.2fr 0.8fr;
          grid-template-rows: 1fr 1fr; gap: 4px;
        }
        .bbdo-news-card {
          position: relative; overflow: hidden;
          min-height: 260px; display: flex;
          align-items: flex-end; text-decoration: none;
          cursor: pointer; transition: transform 0.5s;
        }
        .bbdo-news-card:first-child { grid-row: span 2; min-height: 524px; }
        .bbdo-news-card:hover { transform: scale(0.98); }
        .bbdo-news-card img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; transition: transform 0.6s;
        }
        .bbdo-news-card:hover img { transform: scale(1.05); }
        .bbdo-news-card::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.85) 100%);
          z-index: 1;
        }
        .bbdo-news-inner {
          position: relative; z-index: 2; padding: 28px;
        }
        .bbdo-news-tag {
          font-family: var(--font-display);
          font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--primary); margin-bottom: 8px;
        }
        .bbdo-news-title {
          font-family: var(--font-display);
          font-size: 20px; font-weight: 700;
          color: white; line-height: 1.25;
        }
        .bbdo-news-card:first-child .bbdo-news-title { font-size: clamp(24px, 3vw, 36px); }

        /* TESTIMONIALS */
        .bbdo-testimonials {
          min-height: 60vh; display: flex;
          align-items: center; justify-content: center;
          background: white; padding: 100px 24px;
          text-align: center;
        }
        .bbdo-quote {
          font-family: var(--font-display);
          font-size: clamp(28px, 4vw, 56px);
          font-weight: 300; font-style: italic;
          color: var(--gray-900); line-height: 1.2;
          max-width: 800px; margin: 0 auto;
        }
        .bbdo-quote-author {
          font-family: var(--font-display);
          font-size: 14px; color: var(--gray-500);
          margin-top: 32px; font-weight: 500;
          letter-spacing: 0.05em;
        }
        .bbdo-quote-author span { color: var(--primary); font-weight: 600; }
        .bbdo-quote-dots {
          display: flex; justify-content: center;
          gap: 8px; margin-top: 32px;
        }
        .bbdo-qdot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--gray-200); border: none; padding: 0;
          cursor: pointer; transition: all 0.3s;
        }
        .bbdo-qdot.active { background: var(--primary); transform: scale(1.5); }

        /* BIG STAT */
        .bbdo-stat {
          padding: 100px 24px; text-align: center; background: var(--gray-50);
        }
        .bbdo-big-num {
          font-family: var(--font-display);
          font-size: clamp(80px, 16vw, 220px);
          font-weight: 800; color: var(--primary);
          line-height: 0.85; letter-spacing: -0.04em;
        }
        .bbdo-stat-line {
          font-family: var(--font-display);
          font-size: clamp(16px, 2vw, 24px); font-weight: 300;
          color: var(--gray-600); margin-top: 16px; max-width: 500px;
          margin-left: auto; margin-right: auto; line-height: 1.4;
        }

        /* CTA */
        .bbdo-final-cta {
          padding: 120px 24px; text-align: center;
          background: var(--gray-900);
        }
        .bbdo-final-cta h2 {
          font-family: var(--font-display);
          font-size: clamp(48px, 8vw, 120px);
          font-weight: 800; font-style: italic;
          color: white; margin-bottom: 40px;
          letter-spacing: -0.03em;
        }
        .bbdo-final-cta h2 span { color: var(--primary); }

        @media (max-width: 768px) {
          .bbdo-news-grid { grid-template-columns: 1fr; }
          .bbdo-news-card:first-child { grid-row: span 1; min-height: 260px; }
          .bbdo-cases-grid { grid-template-columns: repeat(2, 1fr); }
          .bbdo-case-card:nth-child(2) { border-right: none; }
          .bbdo-case-card:nth-child(1), .bbdo-case-card:nth-child(2) { border-bottom: 1px solid var(--gray-200); }
        }
      `}</style>

      {/* HERO */}
      <section className="bbdo-hero">
        <video autoPlay loop muted playsInline>
          <source src="/images/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="bbdo-hero-overlay" />
        <div className={`bbdo-hero-content ${heroVisible ? 'visible' : ''}`}>
          <h1>Think<br/><span>Growth.</span></h1>
          <Link href="/contact" className="bbdo-cta-btn">Free Revenue Analysis</Link>
        </div>
        <div className="bbdo-scroll-hint">
          <div className="bbdo-scroll-line" />
          Scroll
        </div>
      </section>

      {/* CASE STUDY STATS */}
      <section className="bbdo-cases">
        <div className="bbdo-cases-grid">
          {caseStudyStats.map((s, i) => (
            <div key={i} className="bbdo-case-card">
              <div className="bbdo-case-num">{s.number}</div>
              {s.arrow && <div className="bbdo-case-arrow">{s.arrow}</div>}
              <div className="bbdo-case-target">{s.target}</div>
              <div className="bbdo-case-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STATEMENT */}
      <section className="bbdo-statement">
        <h2>
          8 AI Agents.<br/>
          1,000+ Experts.<br/>
          <em>Zero Excuses.</em>
        </h2>
      </section>

      {/* NEWS */}
      <section className="bbdo-news">
        <div className="bbdo-news-label">Latest News</div>
        <div className="bbdo-news-grid">
          {newsCards.map((card, i) => (
            <Link key={i} href={card.href} className="bbdo-news-card">
              <img src={card.img} alt="" />
              <div className="bbdo-news-inner">
                <div className="bbdo-news-tag">{card.tag}</div>
                <div className="bbdo-news-title">{card.title}</div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/news" className="bbdo-cta-btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)' }}>
            View All News
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bbdo-testimonials">
        <div>
          <div className="bbdo-quote">&ldquo;{testimonials[activeQuote].quote}&rdquo;</div>
          <div className="bbdo-quote-author">
            — {testimonials[activeQuote].author} &nbsp;|&nbsp; <span>{testimonials[activeQuote].title}</span>
          </div>
          <div className="bbdo-quote-dots">
            {testimonials.map((_, i) => (
              <button key={i} className={`bbdo-qdot ${i === activeQuote ? 'active' : ''}`} onClick={() => setActiveQuote(i)} aria-label={`Quote ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* BIG STAT */}
      <section className="bbdo-stat">
        <div className="bbdo-big-num">30%</div>
        <div className="bbdo-stat-line">
          That&apos;s how much revenue your practice is leaving behind.
        </div>
      </section>

      {/* CTA */}
      <section className="bbdo-final-cta">
        <h2><span>Ready</span>?</h2>
        <Link href="/contact" className="bbdo-cta-btn">Free Revenue Analysis</Link>
      </section>
    </main>
  )
}
