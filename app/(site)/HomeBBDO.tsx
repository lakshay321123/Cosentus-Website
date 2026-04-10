'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const testimonials = [
  { quote: '97% collection rate. Staggering.', author: 'Dr. John B. Field Jr.', title: 'Anesthesia' },
  { quote: 'Reimbursements increased after they started coding for me.', author: 'Dr. Morteza Farr', title: 'Orthopedics' },
  { quote: 'Nothing but positive experiences. Without reservations.', author: 'Justin Lo, MD', title: 'Pain Management' },
  { quote: 'The outstanding balances saved our surgery center.', author: 'John Welsh, M.D.', title: 'ASC' },
  { quote: 'Reducing our Days in AR and improving cash flow.', author: 'Sujan Vatturi', title: 'Behavioral Health' },
]

export default function HomeBBDO() {
  const [activeQuote, setActiveQuote] = useState(0)
  const [heroReady, setHeroReady] = useState(false)

  useEffect(() => { setTimeout(() => setHeroReady(true), 200) }, [])
  useEffect(() => {
    const t = setInterval(() => setActiveQuote(p => (p + 1) % testimonials.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <main>
      <style>{`
        /* ===== HERO ===== */
        .hm-hero {
          position: relative; height: 100vh; overflow: hidden; background: #000;
          display: flex; align-items: flex-end; padding: 0 60px 60px;
        }
        .hm-hero video {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; opacity: 0.45;
        }
        .hm-hero-overlay {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.7) 100%);
        }
        /* Geometric overlays like BBDO */
        .hm-geo { position: absolute; z-index: 2; pointer-events: none; }
        .hm-geo-circle {
          top: 15%; right: 20%; width: 180px; height: 180px;
          border: 3px solid var(--primary); border-radius: 50%;
          opacity: 0; transform: scale(0.5);
          transition: all 1.5s cubic-bezier(0.16,1,0.3,1) 0.6s;
        }
        .hm-geo-circle.show { opacity: 0.4; transform: scale(1); }
        .hm-geo-bracket-l {
          top: 30%; left: 8%; width: 40px; height: 80px;
          border-left: 3px solid var(--primary); border-top: 3px solid var(--primary); border-bottom: 3px solid var(--primary);
          opacity: 0; transition: opacity 1s 0.8s;
        }
        .hm-geo-bracket-l.show { opacity: 0.35; }
        .hm-geo-bracket-r {
          bottom: 25%; right: 8%; width: 40px; height: 80px;
          border-right: 3px solid var(--primary); border-top: 3px solid var(--primary); border-bottom: 3px solid var(--primary);
          opacity: 0; transition: opacity 1s 1s;
        }
        .hm-geo-bracket-r.show { opacity: 0.35; }
        .hm-geo-line {
          top: 40%; left: 25%; width: 120px; height: 0;
          border-top: 2px solid var(--primary);
          opacity: 0; transition: opacity 1s 1.2s;
        }
        .hm-geo-line.show { opacity: 0.3; }

        .hm-hero-text {
          position: relative; z-index: 3;
          display: flex; justify-content: space-between; align-items: flex-end;
          width: 100%;
        }
        .hm-hero h1 {
          font-family: var(--font-display); font-weight: 800;
          font-style: italic; font-size: clamp(48px, 9vw, 130px);
          color: white; line-height: 0.9; letter-spacing: -0.03em;
          margin: 0; opacity: 0; transform: translateY(40px);
          transition: all 1s cubic-bezier(0.16,1,0.3,1) 0.3s;
        }
        .hm-hero h1.show { opacity: 1; transform: translateY(0); }
        .hm-hero h1 span { color: var(--primary); }
        .hm-hero-right {
          font-family: var(--font-display); font-size: clamp(40px, 7vw, 100px);
          font-weight: 800; font-style: italic;
          color: transparent; -webkit-text-stroke: 2px rgba(255,255,255,0.25);
          letter-spacing: -0.03em; line-height: 0.9;
          opacity: 0; transition: opacity 1.2s 0.8s;
        }
        .hm-hero-right.show { opacity: 1; }

        /* ===== STATEMENT — images mixed into text ===== */
        .hm-statement {
          background: var(--primary); padding: clamp(60px,10vw,120px) clamp(24px,5vw,80px);
          position: relative; overflow: hidden;
        }
        .hm-stmt-grid {
          display: grid; grid-template-columns: 1.4fr 1fr;
          gap: clamp(32px,4vw,64px); align-items: center;
          max-width: 1200px; margin: 0 auto;
        }
        .hm-stmt-text {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(36px,5.5vw,80px); color: white;
          line-height: 1.05; letter-spacing: -0.02em;
        }
        .hm-stmt-text .img-inline {
          display: inline-block; width: clamp(80px,12vw,180px);
          height: clamp(50px,7vw,100px); border-radius: 8px;
          overflow: hidden; vertical-align: middle; margin: 0 8px;
          position: relative;
        }
        .hm-stmt-text .img-inline img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .hm-stmt-right {
          font-family: var(--font-display); font-size: clamp(16px,1.8vw,22px);
          font-weight: 400; color: rgba(255,255,255,0.9);
          line-height: 1.6;
        }
        .hm-stmt-right p { margin-bottom: 20px; }
        .hm-stmt-cta {
          display: inline-block; padding: 16px 44px;
          font-family: var(--font-display); font-size: 13px;
          font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--primary);
          background: white; text-decoration: none;
          border-radius: 40px; transition: all 0.3s;
        }
        .hm-stmt-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }

        /* ===== OUTLINE TYPOGRAPHY ===== */
        .hm-outline {
          padding: 80px 24px; background: var(--gray-900);
          text-align: center; overflow: hidden;
        }
        .hm-outline-filled {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(48px,10vw,140px); color: white;
          line-height: 1; letter-spacing: -0.03em;
        }
        .hm-outline-stroke {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(48px,10vw,140px);
          color: transparent; -webkit-text-stroke: 2px rgba(255,255,255,0.15);
          line-height: 1; letter-spacing: -0.03em;
          margin-top: -8px;
        }

        /* ===== NEWS with giant side label ===== */
        .hm-news {
          background: var(--primary); padding: 80px 0;
          display: grid; grid-template-columns: 1fr auto;
          position: relative; overflow: hidden;
        }
        .hm-news-content { padding: 0 clamp(24px,4vw,60px); }
        .hm-news-label {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(120px,18vw,300px); color: rgba(255,255,255,0.08);
          writing-mode: vertical-rl; text-orientation: mixed;
          line-height: 1; letter-spacing: -0.04em;
          padding-right: 20px; user-select: none;
        }
        .hm-news-top {
          display: grid; grid-template-columns: 1fr 1fr; gap: 4px;
          margin-bottom: 4px;
        }
        .hm-news-card {
          position: relative; overflow: hidden; display: flex;
          align-items: flex-end; text-decoration: none;
          min-height: 260px; transition: transform 0.4s;
        }
        .hm-news-card:hover { transform: scale(0.98); }
        .hm-news-card.featured { grid-column: 1; grid-row: span 2; min-height: 524px; }
        .hm-news-card img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; transition: transform 0.6s;
        }
        .hm-news-card:hover img { transform: scale(1.05); }
        .hm-news-card::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.8) 100%);
          z-index: 1;
        }
        .hm-nc-inner { position: relative; z-index: 2; padding: 24px; }
        .hm-nc-tag {
          font-family: var(--font-display); font-size: 10px;
          font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--primary);
          margin-bottom: 6px;
        }
        .hm-nc-title {
          font-family: var(--font-display); font-size: 18px;
          font-weight: 700; color: white; line-height: 1.2;
          text-transform: uppercase;
        }
        .hm-news-card.featured .hm-nc-title { font-size: clamp(22px,2.5vw,32px); }
        .hm-nc-arrow {
          position: absolute; top: 16px; right: 16px; z-index: 2;
          width: 32px; height: 32px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: center;
        }

        /* ===== STATS ROW ===== */
        .hm-stats {
          display: grid; grid-template-columns: repeat(4, 1fr);
          background: white;
        }
        .hm-stat-card {
          padding: 56px 24px; text-align: center;
          border-right: 1px solid var(--gray-200);
          transition: all 0.4s; cursor: default;
        }
        .hm-stat-card:last-child { border-right: none; }
        .hm-stat-card:hover { background: var(--gray-900); }
        .hm-stat-card:hover .hm-sc-num { color: var(--primary); }
        .hm-stat-card:hover .hm-sc-label { color: rgba(255,255,255,0.6); }
        .hm-sc-num {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(32px,4vw,52px); color: var(--gray-900);
          line-height: 1; transition: color 0.4s;
        }
        .hm-sc-label {
          font-family: var(--font-display); font-size: 11px;
          font-weight: 500; color: var(--gray-500);
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-top: 12px; transition: color 0.4s;
        }

        /* ===== TESTIMONIAL ===== */
        .hm-testi {
          min-height: 50vh; display: flex; align-items: center;
          justify-content: center; background: var(--gray-50);
          padding: 80px 24px; text-align: center;
        }
        .hm-tq {
          font-family: var(--font-display); font-weight: 300;
          font-style: italic; font-size: clamp(24px,3.5vw,48px);
          color: var(--gray-900); line-height: 1.25;
          max-width: 750px; margin: 0 auto;
        }
        .hm-ta {
          font-family: var(--font-display); font-size: 13px;
          color: var(--gray-500); margin-top: 24px; font-weight: 500;
        }
        .hm-ta span { color: var(--primary); font-weight: 600; }
        .hm-tdots { display: flex; justify-content: center; gap: 8px; margin-top: 24px; }
        .hm-td {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--gray-300); border: none; padding: 0;
          cursor: pointer; transition: all 0.3s;
        }
        .hm-td.on { background: var(--primary); transform: scale(1.5); }

        /* ===== CTA ===== */
        .hm-cta {
          padding: 120px 24px; background: var(--gray-900);
          text-align: center;
        }
        .hm-cta h2 {
          font-family: var(--font-display); font-weight: 800;
          font-style: italic; font-size: clamp(48px,8vw,120px);
          color: white; letter-spacing: -0.03em; margin-bottom: 40px;
        }
        .hm-cta h2 span { color: var(--primary); }
        .hm-cta-btn {
          display: inline-block; padding: 18px 52px;
          font-family: var(--font-display); font-size: 13px;
          font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; color: white;
          background: var(--primary); text-decoration: none;
          transition: all 0.3s;
        }
        .hm-cta-btn:hover {
          background: white; color: var(--gray-900);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .hm-hero { padding: 0 24px 40px; }
          .hm-hero-right { display: none; }
          .hm-geo-circle, .hm-geo-bracket-l, .hm-geo-bracket-r, .hm-geo-line { display: none; }
          .hm-stmt-grid { grid-template-columns: 1fr; }
          .hm-stmt-text .img-inline { width: 60px; height: 40px; }
          .hm-news { grid-template-columns: 1fr; }
          .hm-news-label { display: none; }
          .hm-news-top { grid-template-columns: 1fr; }
          .hm-news-card.featured { grid-row: span 1; min-height: 260px; }
          .hm-stats { grid-template-columns: repeat(2, 1fr); }
          .hm-stat-card:nth-child(2) { border-right: none; }
          .hm-stat-card:nth-child(1), .hm-stat-card:nth-child(2) { border-bottom: 1px solid var(--gray-200); }
        }
      `}</style>

      {/* HERO — video + geometric overlays + dual typography */}
      <section className="hm-hero">
        <video autoPlay loop muted playsInline><source src="/images/hero-video.mp4" type="video/mp4" /></video>
        <div className="hm-hero-overlay" />
        <div className={`hm-geo hm-geo-circle ${heroReady ? 'show' : ''}`} />
        <div className={`hm-geo hm-geo-bracket-l ${heroReady ? 'show' : ''}`} />
        <div className={`hm-geo hm-geo-bracket-r ${heroReady ? 'show' : ''}`} />
        <div className={`hm-geo hm-geo-line ${heroReady ? 'show' : ''}`} />
        <div className="hm-hero-text">
          <h1 className={heroReady ? 'show' : ''}>THINK<br /><span>GROWTH.</span></h1>
          <div className={`hm-hero-right ${heroReady ? 'show' : ''}`}>THINK<br />GROWTH.</div>
        </div>
      </section>

      {/* STATS ROW */}
      <section>
        <div className="hm-stats">
          <div className="hm-stat-card"><div className="hm-sc-num">30%</div><div className="hm-sc-label">Revenue Growth</div></div>
          <div className="hm-stat-card"><div className="hm-sc-num">98%+</div><div className="hm-sc-label">Net Collection</div></div>
          <div className="hm-stat-card"><div className="hm-sc-num">99%</div><div className="hm-sc-label">Clean Claims</div></div>
          <div className="hm-stat-card"><div className="hm-sc-num">98.5%</div><div className="hm-sc-label">Coding Accuracy</div></div>
        </div>
      </section>

      {/* STATEMENT — images mixed into text like BBDO */}
      <section className="hm-statement">
        <div className="hm-stmt-grid">
          <div className="hm-stmt-text">
            WE ARE
            <span className="img-inline"><img src="/images/hero-healthcare.jpg" alt="" /></span>
            COSENTUS
            <br />
            <span className="img-inline"><img src="/images/hero-medical.jpg" alt="" /></span>
            WE DO
            <br />
            BIG
            <span className="img-inline"><img src="/images/hero-team.jpg" alt="" /></span>
            THINGS
          </div>
          <div className="hm-stmt-right">
            <p>We solve complex revenue problems with Real + Artificial Intelligence that makes a measurable impact.</p>
            <p>We work with specialty practices that have the biggest ambitions.</p>
            <p>We hire expert talent and bring them opportunities that build lasting careers.</p>
            <Link href="/contact" className="hm-stmt-cta">Contact Us</Link>
          </div>
        </div>
      </section>

      {/* OUTLINE TYPOGRAPHY */}
      <section className="hm-outline">
        <div className="hm-outline-filled">THINK GROWTH</div>
        <div className="hm-outline-stroke">THINK GROWTH</div>
      </section>

      {/* NEWS — with giant vertical label */}
      <section className="hm-news">
        <div className="hm-news-content">
          <div className="hm-news-top">
            <Link href="/news/congress-moves-to-stop-the-bleeding-new-bill-would-cap-annual-medicare-pay-cuts-at-2-5" className="hm-news-card featured">
              <img src="/images/hero-healthcare.jpg" alt="" />
              <div className="hm-nc-inner">
                <div className="hm-nc-tag">Medicare Policy</div>
                <div className="hm-nc-title">Congress Moves to Stop the Bleeding</div>
              </div>
              <div className="hm-nc-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></div>
            </Link>
            <Link href="/news/cms-policy-updates-asc" className="hm-news-card">
              <img src="/images/hero-medical.jpg" alt="" />
              <div className="hm-nc-inner">
                <div className="hm-nc-tag">CMS Policy</div>
                <div className="hm-nc-title">Four Changes Every Specialty Must Know</div>
              </div>
              <div className="hm-nc-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></div>
            </Link>
            <Link href="/news/asc-reimbursement-payer-strategy" className="hm-news-card">
              <img src="/images/hero-team.jpg" alt="" />
              <div className="hm-nc-inner">
                <div className="hm-nc-tag">ASC</div>
                <div className="hm-nc-title">ASC Reimbursement Under Attack</div>
              </div>
              <div className="hm-nc-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></div>
            </Link>
          </div>
        </div>
        <div className="hm-news-label">NEWS</div>
      </section>

      {/* TESTIMONIALS */}
      <section className="hm-testi">
        <div>
          <div className="hm-tq">&ldquo;{testimonials[activeQuote].quote}&rdquo;</div>
          <div className="hm-ta">— {testimonials[activeQuote].author} &nbsp;|&nbsp; <span>{testimonials[activeQuote].title}</span></div>
          <div className="hm-tdots">
            {testimonials.map((_, i) => (
              <button key={i} className={`hm-td ${i === activeQuote ? 'on' : ''}`} onClick={() => setActiveQuote(i)} aria-label={`Quote ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hm-cta">
        <h2><span>Ready</span>?</h2>
        <Link href="/contact" className="hm-cta-btn">Free Revenue Analysis</Link>
      </section>
    </main>
  )
}
