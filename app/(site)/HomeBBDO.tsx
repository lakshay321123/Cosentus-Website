'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const quotes = [
  { q: '97% collection rate. Staggering.', a: 'Dr. John B. Field Jr.', t: 'Anesthesia' },
  { q: 'Reimbursements increased after they started coding for me.', a: 'Dr. Morteza Farr', t: 'Orthopedics' },
  { q: 'Nothing but positive experiences. Without reservations.', a: 'Justin Lo, MD', t: 'Pain Management' },
  { q: 'The outstanding balances saved our surgery center.', a: 'John Welsh, M.D.', t: 'ASC' },
  { q: 'Reducing our Days in AR and improving cash flow.', a: 'Sujan Vatturi', t: 'Behavioral Health' },
]

const I1 = '/images/hero-healthcare.jpg'
const I2 = '/images/hero-medical.jpg'
const I3 = '/images/hero-team.jpg'
const I4 = '/images/events/gallery/Cosentus - Growth Summit 2025 - 030.jpg'

export default function HomeBBDO() {
  const [qi, setQi] = useState(0)
  const [ready, setReady] = useState(false)
  
  

  useEffect(() => { setTimeout(() => setReady(true), 200) }, [])
  useEffect(() => { const t = setInterval(() => setQi(p => (p + 1) % quotes.length), 5000); return () => clearInterval(t) }, [])

  // Parallax scroll tracking
  




  return (
    <main style={{ background: '#000', overflow: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .hm-rv{opacity:1;transform:none}
        .hm-rv.on{opacity:1;transform:none;filter:none}
        
        .hm-rs{opacity:1;transform:none}
        .hm-rs.on{opacity:1;transform:none;filter:none}
        .hm-rc{clip-path:none}
        

        /* HERO */
        .hh{position:relative;height:100vh;overflow:hidden;display:flex;align-items:center;justify-content:center}
        .hh video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .hh-ov{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(0,0,0,.5) 0%,rgba(0,0,0,.1) 40%,rgba(0,0,0,.7) 100%)}
        .hh-geo{position:absolute;z-index:2;pointer-events:none;opacity:0;transition:all 1.8s cubic-bezier(.16,1,.3,1)}
        .hh-geo.on{opacity:1}
        .g1{top:10%;right:15%;width:250px;height:250px;border:2px solid var(--primary);border-radius:50%;box-shadow:0 0 60px rgba(0,181,214,.25);transform:scale(.3);transition-delay:.4s}
        .g1.on{transform:scale(1);opacity:.5}
        .g2{bottom:20%;left:5%;width:50px;height:100px;border-left:2px solid var(--primary);border-top:2px solid var(--primary);border-bottom:2px solid var(--primary);transition-delay:.6s}
        .g2.on{opacity:.4}
        .g3{top:35%;right:40%;width:50px;height:100px;border-right:2px solid var(--primary);border-top:2px solid var(--primary);border-bottom:2px solid var(--primary);transition-delay:.8s}
        .g3.on{opacity:.4}
        .g4{top:55%;left:20%;width:150px;border-top:1px solid var(--primary);transition-delay:1s}
        .g4.on{opacity:.3}
        .g5{top:25%;left:35%;width:8px;height:8px;background:var(--primary);border-radius:50%;box-shadow:0 0 20px rgba(0,181,214,.6);transition-delay:1.2s}
        .g5.on{opacity:.6}
        .hh-center{position:relative;z-index:3;text-align:center;opacity:0;transform:translateY(50px);transition:all 1.2s cubic-bezier(.16,1,.3,1) .2s}
        .hh-center.on{opacity:1;transform:translateY(0)}
        .hh h1{font-family:var(--font-display);font-weight:800;font-style:italic;font-size:clamp(56px,11vw,160px);color:#fff;line-height:.88;letter-spacing:-.04em;margin:0;text-shadow:0 4px 60px rgba(0,0,0,.4)}
        .hh h1 span{color:var(--primary)}
        .hh-sub{font-family:var(--font-display);font-size:clamp(14px,1.5vw,18px);color:rgba(255,255,255,.6);margin-top:24px;font-weight:300;letter-spacing:.05em}
        .hh-btn{display:inline-block;margin-top:32px;padding:16px 48px;font-family:var(--font-display);font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#fff;background:var(--primary);text-decoration:none;transition:all .4s}
        .hh-btn:hover{background:#fff;color:#000;transform:scale(1.05)}
        .hh-ghost{position:absolute;bottom:60px;right:60px;z-index:3;font-family:var(--font-display);font-size:clamp(36px,6vw,90px);font-weight:800;font-style:italic;color:transparent;-webkit-text-stroke:1.5px rgba(255,255,255,.12);letter-spacing:-.03em;line-height:.9;opacity:0;transition:opacity 1.5s 1s}
        .hh-ghost.on{opacity:1}

        /* PARALLAX IMAGE STRIP */
        .px-strip{position:relative;height:60vh;overflow:hidden}
        .px-strip img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .px-strip-ov{position:absolute;inset:0;background:rgba(0,0,0,.85);z-index:1}
        .px-strip-text{position:relative;z-index:2;height:100%;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 24px}
        .px-strip-text h2{font-family:var(--font-display);font-weight:800;font-size:clamp(36px,6vw,80px);color:#fff;line-height:1;letter-spacing:-.03em;text-shadow:0 4px 30px rgba(0,0,0,.8)}
        .px-strip-text h2 span{color:var(--primary)}

        /* STATS */
        .hs{display:grid;grid-template-columns:repeat(4,1fr);background:#fff}
        .hs-c{padding:64px 24px;text-align:center;border-right:1px solid var(--gray-200);transition:all .5s}
        .hs-c:last-child{border-right:none}
        .hs-c:hover{background:var(--gray-900)}
        .hs-c:hover .hs-n{color:var(--primary);transform:scale(1.1)}
        .hs-c:hover .hs-l{color:rgba(255,255,255,.5)}
        .hs-n{font-family:var(--font-display);font-weight:800;font-size:clamp(36px,5vw,60px);color:var(--gray-900);line-height:1;transition:all .5s}
        .hs-l{font-family:var(--font-display);font-size:11px;font-weight:500;color:var(--gray-500);text-transform:uppercase;letter-spacing:.1em;margin-top:12px;transition:color .5s}

        /* STATEMENT — teal with inline images */
        .hst{background:var(--primary);padding:clamp(80px,12vw,160px) clamp(24px,5vw,80px);position:relative;overflow:hidden}
        .hst::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,rgba(0,0,0,.1),transparent 70%)}
        .hst-g{display:grid;grid-template-columns:1.4fr 1fr;gap:clamp(40px,5vw,80px);align-items:center;max-width:1200px;margin:0 auto;position:relative;z-index:1}
        .hst-t{font-family:var(--font-display);font-weight:800;font-size:clamp(40px,6vw,90px);color:#fff;line-height:1;letter-spacing:-.03em}
        .ii{display:inline-block;width:clamp(90px,14vw,200px);height:clamp(55px,8vw,110px);border-radius:10px;overflow:hidden;vertical-align:middle;margin:0 6px;transition:transform .6s}
        .ii:hover{transform:scale(1.1) rotate(-2deg)}
        .ii img{width:100%;height:100%;object-fit:cover;transition:transform .6s}
        .ii:hover img{transform:scale(1.15)}
        .hst-r{font-family:var(--font-display);font-size:clamp(16px,1.8vw,22px);font-weight:400;color:rgba(255,255,255,.85);line-height:1.7}
        .hst-r p{margin-bottom:24px}
        .hst-btn{display:inline-block;padding:16px 48px;font-family:var(--font-display);font-size:13px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--primary);background:#fff;text-decoration:none;border-radius:40px;transition:all .4s}
        .hst-btn:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.25)}

        /* VIDEO SECTION */
        .hv{position:relative;height:70vh;overflow:hidden}
        .hv video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .hv-ov{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.8),rgba(0,0,0,.75));z-index:1}
        .hv-content{position:relative;z-index:2;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 24px}
        .hv h2{font-family:var(--font-display);font-weight:800;font-size:clamp(32px,5vw,72px);color:#fff;line-height:1.1;letter-spacing:-.02em;text-shadow:0 4px 30px rgba(0,0,0,.8)}
        .hv h2 em{font-weight:300;font-style:italic;opacity:.8}

        /* NEWS with side label */
        .hn{background:#111;padding:80px 0;display:grid;grid-template-columns:1fr auto;overflow:hidden}
        .hn-c{padding:0 clamp(24px,4vw,60px)}
        .hn-lab{font-family:var(--font-display);font-weight:800;font-size:clamp(120px,20vw,350px);color:rgba(255,255,255,.04);writing-mode:vertical-rl;line-height:1;letter-spacing:-.04em;padding-right:20px;user-select:none}
        .hn-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px}
        .hn-card{position:relative;overflow:hidden;display:flex;align-items:flex-end;text-decoration:none;min-height:280px;transition:transform .5s}
        .hn-card:first-child{grid-column:1;grid-row:span 2;min-height:564px}
        .hn-card:hover{transform:scale(.97)}
        .hn-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1s cubic-bezier(.16,1,.3,1)}
        .hn-card:hover img{transform:scale(1.12)}
        .hn-card::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 20%,rgba(0,0,0,.85) 100%);z-index:1}
        .hn-in{position:relative;z-index:2;padding:28px}
        .hn-tag{font-family:var(--font-display);font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--primary);margin-bottom:8px}
        .hn-tt{font-family:var(--font-display);font-size:20px;font-weight:700;color:#fff;line-height:1.2;text-transform:uppercase;text-shadow:0 2px 12px rgba(0,0,0,.6)}
        .hn-card:first-child .hn-tt{font-size:clamp(24px,3vw,36px)}
        .hn-arr{position:absolute;top:16px;right:16px;z-index:2;width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;transition:all .3s}
        .hn-card:hover .hn-arr{background:var(--primary);border-color:var(--primary)}

        /* TESTIMONIAL */
        .ht{min-height:50vh;display:flex;align-items:center;justify-content:center;background:#fff;padding:100px 24px;text-align:center}
        .ht-q{font-family:var(--font-display);font-weight:300;font-style:italic;font-size:clamp(26px,4vw,52px);color:var(--gray-900);line-height:1.2;max-width:800px;margin:0 auto}
        .ht-a{font-family:var(--font-display);font-size:14px;color:var(--gray-500);margin-top:28px;font-weight:500}
        .ht-a span{color:var(--primary);font-weight:600}
        .ht-d{display:flex;justify-content:center;gap:10px;margin-top:28px}
        .ht-dd{width:8px;height:8px;border-radius:50%;background:var(--gray-200);border:none;padding:0;cursor:pointer;transition:all .4s}
        .ht-dd.on{background:var(--primary);transform:scale(1.6);box-shadow:0 0 12px rgba(0,181,214,.4)}

        /* CTA */
        .hf{padding:140px 24px;background:#000;text-align:center;position:relative;overflow:hidden}
        .hf::before{content:'GROWTH';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--font-display);font-weight:800;font-size:clamp(100px,20vw,300px);color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.03);letter-spacing:-.04em;pointer-events:none;white-space:nowrap}
        .hf h2{font-family:var(--font-display);font-weight:800;font-style:italic;font-size:clamp(52px,9vw,130px);color:#fff;letter-spacing:-.03em;margin-bottom:40px;position:relative;z-index:1}
        .hf h2 span{color:var(--primary)}
        .hf-btn{display:inline-block;padding:20px 56px;font-family:var(--font-display);font-size:13px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#fff;background:var(--primary);text-decoration:none;transition:all .4s;position:relative;z-index:1}
        .hf-btn:hover{background:#fff;color:var(--gray-900);transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,181,214,.3)}

        @media(max-width:768px){
          .hh-ghost,.hh-geo,.hn-lab{display:none}
          .hst-g{grid-template-columns:1fr}
          .ii{width:60px;height:40px}
          .hn{grid-template-columns:1fr}
          .hn-grid{grid-template-columns:1fr}
          .hn-card:first-child{grid-row:span 1;min-height:280px}
          .hs{grid-template-columns:repeat(2,1fr)}
          .hs-c:nth-child(2){border-right:none}
          .hs-c:nth-child(1),.hs-c:nth-child(2){border-bottom:1px solid var(--gray-200)}
        }
      ` }} />

      {/* HERO — video + parallax + geometric overlays */}
      <section className="hh">
        <video autoPlay loop muted playsInline ><source src="/images/hero-video.mp4" type="video/mp4" /></video>
        <div className="hh-ov" />
        <div className={`hh-geo g1 ${ready ? 'on' : ''}`}  />
        <div className={`hh-geo g2 ${ready ? 'on' : ''}`} />
        <div className={`hh-geo g3 ${ready ? 'on' : ''}`}  />
        <div className={`hh-geo g4 ${ready ? 'on' : ''}`} />
        <div className={`hh-geo g5 ${ready ? 'on' : ''}`}  />
        <div className={`hh-center ${ready ? 'on' : ''}`}>
          <h1>THINK<br /><span>GROWTH.</span></h1>
          <div className="hh-sub">Real + Artificial Intelligence for Healthcare</div>
          <Link href="/contact" className="hh-btn">Free Revenue Analysis</Link>
        </div>
        <div className={`hh-ghost ${ready ? 'on' : ''}`}>THINK<br />GROWTH.</div>
      </section>

      {/* STATS — reveal on scroll */}
      <section><div className="hs">
        <div className="hs-c reveal"><div className="hs-n">30%</div><div className="hs-l">Revenue Growth</div></div>
        <div className="hs-c reveal d1"><div className="hs-n">98%+</div><div className="hs-l">Net Collection</div></div>
        <div className="hs-c reveal d2"><div className="hs-n">99%</div><div className="hs-l">Clean Claims</div></div>
        <div className="hs-c reveal d3"><div className="hs-n">98.5%</div><div className="hs-l">Coding Accuracy</div></div>
      </div></section>

      {/* PARALLAX IMAGE with text overlay */}
      <section className="px-strip">
        <img src={I1} alt=""  />
        <div className="px-strip-ov" />
        <div className="px-strip-text">
          <h2 className="hm-rv"><span>8</span> AI Agents.<br /><span>1,000+</span> Experts.<br />Zero Excuses.</h2>
        </div>
      </section>

      {/* STATEMENT — images mixed into text */}
      <section className="hst">
        <div className="hst-g">
          <div className="hst-t reveal">
            WE ARE <span className="ii"><img src={I1} alt="" /></span> COSENTUS<br />
            <span className="ii"><img src={I2} alt="" /></span> WE DO<br />
            BIG <span className="ii"><img src={I3} alt="" /></span> THINGS
          </div>
          <div className="hst-r">
            <p className="hm-rv d1">We solve complex revenue problems with Real + Artificial Intelligence that makes a measurable impact.</p>
            <p className="hm-rv d2">We work with specialty practices that have the biggest ambitions.</p>
            <p className="hm-rv d3">We hire expert talent and bring them opportunities that build lasting careers.</p>
            <div className="hm-rv d4"><Link href="/contact" className="hst-btn">Contact Us</Link></div>
          </div>
        </div>
      </section>

      {/* VIDEO SECTION — second video with parallax */}
      <section className="hv">
        <video autoPlay loop muted playsInline ><source src="/images/specialties-hero.mp4" type="video/mp4" /></video>
        <div className="hv-ov" />
        <div className="hv-content">
          <h2 className="hm-rv">25 Years. 19 Acquisitions.<br /><em>One Mission.</em></h2>
        </div>
      </section>

      {/* NEWS — with giant side label + image zoom */}
      <section className="hn"><div className="hn-c"><div className="hn-grid">
        <Link href="/news/congress-moves-to-stop-the-bleeding-new-bill-would-cap-annual-medicare-pay-cuts-at-2-5" className="hn-card reveal-scale">
          <img src={I4} alt="" /><div className="hn-in"><div className="hn-tag">Medicare Policy</div><div className="hn-tt">Congress Moves to Stop the Bleeding</div></div>
          <div className="hn-arr"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></div>
        </Link>
        <Link href="/news/cms-policy-updates-asc" className="hn-card reveal-scale d1">
          <img src={I1} alt="" /><div className="hn-in"><div className="hn-tag">CMS Policy</div><div className="hn-tt">Four Changes Every Specialty Must Know</div></div>
          <div className="hn-arr"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></div>
        </Link>
        <Link href="/news/asc-reimbursement-payer-strategy" className="hn-card reveal-scale d2">
          <img src={I2} alt="" /><div className="hn-in"><div className="hn-tag">ASC</div><div className="hn-tt">ASC Reimbursement Under Attack</div></div>
          <div className="hn-arr"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></div>
        </Link>
      </div></div><div className="hn-lab">NEWS</div></section>

      {/* TESTIMONIALS */}
      <section className="ht"><div>
        <div className="ht-q">&ldquo;{quotes[qi].q}&rdquo;</div>
        <div className="ht-a">— {quotes[qi].a} &nbsp;|&nbsp; <span>{quotes[qi].t}</span></div>
        <div className="ht-d">{quotes.map((_, i) => (
          <button key={i} className={`ht-dd ${i === qi ? 'on' : ''}`} onClick={() => setQi(i)} aria-label={`Quote ${i + 1}`} />
        ))}</div>
      </div></section>

      {/* CTA — with ghost text background */}
      <section className="hf">
        <h2 className="hm-rv"><span>Ready</span>?</h2>
        <Link href="/contact" className="hf-btn reveal d1">Free Revenue Analysis</Link>
      </section>
    </main>
  )
}
