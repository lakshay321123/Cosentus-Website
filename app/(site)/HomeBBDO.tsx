'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const quotes = [
  { q: '97% collection rate. Staggering.', a: 'Dr. John B. Field Jr.', t: 'Anesthesia' },
  { q: 'Reimbursements increased after they started coding for me.', a: 'Dr. Morteza Farr', t: 'Orthopedics' },
  { q: 'Nothing but positive experiences. Without reservations.', a: 'Justin Lo, MD', t: 'Pain Management' },
  { q: 'The outstanding balances saved our surgery center.', a: 'John Welsh, M.D.', t: 'ASC' },
  { q: 'Reducing our Days in AR and improving cash flow.', a: 'Sujan Vatturi', t: 'Behavioral Health' },
]

export default function HomeBBDO() {
  const [qi, setQi] = useState(0)
  const [typed, setTyped] = useState('')
  const [showGlow, setShowGlow] = useState(false)
  const [showBtn, setShowBtn] = useState(false)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const agRef = useRef<HTMLElement>(null)
  const mainRef = useRef<HTMLElement>(null)

  // Typewriter — slow
  useEffect(() => {
    const full = 'THINK GROWTH.'
    let i = 0
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++; setTyped(full.slice(0, i))
        if (i >= full.length) { clearInterval(iv); setTimeout(() => setShowGlow(true), 600); setTimeout(() => setShowBtn(true), 1200) }
      }, 150)
    }, 800)
    return () => clearTimeout(t)
  }, [])

  // Quotes
  useEffect(() => { const t = setInterval(() => setQi(p => (p + 1) % quotes.length), 5000); return () => clearInterval(t) }, [])

  // Mouse follow
  const onMM = useCallback((e: React.MouseEvent) => {
    if (!agRef.current) return
    const r = agRef.current.getBoundingClientRect()
    setMouseX((e.clientX - r.left - r.width / 2) * 0.04)
    setMouseY((e.clientY - r.top - r.height / 2) * 0.04)
  }, [])

  // GSAP ScrollTrigger animations — ALL reversible
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 4. Stats count-up slide from left
      gsap.from('.gs-stat', { x: -60, opacity: 0, stagger: 0.2, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '#sec-stats', start: 'top 85%', end: 'bottom 5%', toggleActions: 'play reverse play reverse' }
      })

      // 5. Agent lines from left
      gsap.from('.gs-agline', { x: -100, opacity: 0, stagger: 0.3, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '#sec-agents', start: 'top 85%', end: 'bottom 5%', toggleActions: 'play reverse play reverse' }
      })

      // 6. Statement: text first, then images bubble, then right side
      const stTl = gsap.timeline({
        scrollTrigger: { trigger: '#sec-stmt', start: 'top 85%', end: 'bottom 5%', toggleActions: 'play reverse play reverse' }
      })
      stTl.from('.gs-d-h1', { x: -120, opacity: 0, duration: 1, ease: 'power3.out' })
        .from('.gs-d-vid', { scaleX: 0, opacity: 0, duration: 0.8, ease: 'power3.out', transformOrigin: 'center center' }, '-=0.4')
        .from('.gs-d-h2', { x: 120, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.4')
        .from('.gs-d-proof > *', { y: 30, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        .from('.gs-d-cta', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')


      // Platform section
      gsap.from('.gs-plat-h', { x: -80, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '#sec-plat', start: 'top 85%', end: 'bottom 5%', toggleActions: 'play reverse play reverse' }
      })
      gsap.from('.gs-plat-desc', { x: 80, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '#sec-plat', start: 'top 85%', end: 'bottom 5%', toggleActions: 'play reverse play reverse' }
      })
      gsap.from('.gs-plat-num', { y: 40, opacity: 0, stagger: 0.2, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '#sec-plat', start: 'top 70%', end: 'bottom 5%', toggleActions: 'play reverse play reverse' }
      })

      // 7. Video text from top/bottom
      gsap.from('.gs-vtop', { y: -80, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '#sec-video', start: 'top 85%', end: 'bottom 5%', toggleActions: 'play reverse play reverse' }
      })
      gsap.from('.gs-vbot', { y: 80, opacity: 0, duration: 1, delay: 0.3, ease: 'power3.out',
        scrollTrigger: { trigger: '#sec-video', start: 'top 85%', end: 'bottom 5%', toggleActions: 'play reverse play reverse' }
      })

      // 8. News cards from left
      gsap.from('.gs-news', { x: -80, opacity: 0, stagger: 0.2, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '#sec-news', start: 'top 85%', end: 'bottom 5%', toggleActions: 'play reverse play reverse' }
      })

      // 9. Testimonial scale
      gsap.from('.gs-testi', { scale: 0.85, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '#sec-testi', start: 'top 85%', end: 'bottom 5%', toggleActions: 'play reverse play reverse' }
      })

      // 10. CTA glow
      gsap.from('.gs-cta', { opacity: 0, scale: 0.9, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '#sec-cta', start: 'top 85%', end: 'bottom 5%', toggleActions: 'play reverse play reverse' }
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={mainRef} style={{ background: 'var(--white)', overflow: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .hh{position:relative;height:100vh;overflow:hidden;display:flex;align-items:center;justify-content:center}
        .hh video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.45}
        .hh-ov{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(0,0,0,.5) 0%,rgba(0,0,0,.1) 40%,rgba(0,0,0,.7) 100%)}
        .hh-center{position:relative;z-index:3;text-align:center}
        .hh h1{font-family:var(--font-display);font-weight:800;font-style:italic;font-size:clamp(48px,8vw,110px);color:#fff;line-height:.88;letter-spacing:-.04em;margin:0}
        .hh h1 span{color:var(--primary)}
        .hh-cursor{display:inline-block;width:4px;height:.75em;background:var(--primary);margin-left:4px;vertical-align:baseline}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .hh-glow{font-family:var(--font-display);font-size:clamp(14px,1.5vw,20px);color:var(--primary);margin-top:28px;font-weight:400;letter-spacing:.08em;opacity:0;transform:translateY(10px);transition:all 1.2s cubic-bezier(.16,1,.3,1)}
        .hh-glow.on{opacity:1;transform:translateY(0);text-shadow:0 0 30px rgba(0,181,214,.6),0 0 60px rgba(0,181,214,.3),0 0 100px rgba(0,181,214,.15)}
        .hh-btn{display:inline-block;margin-top:36px;padding:18px 52px;font-family:var(--font-display);font-size:13px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#fff;background:var(--primary);text-decoration:none;transition:all .4s;opacity:0;transform:translateY(20px)}
        .hh-btn.on{opacity:1;transform:translateY(0)}
        .hh-btn:hover{background:#fff;color:#000;transform:translateY(-2px) scale(1.03)}
        .hh-ghost{position:absolute;bottom:60px;right:60px;z-index:3;font-family:var(--font-display);font-size:clamp(28px,4vw,64px);font-weight:800;font-style:italic;color:transparent;-webkit-text-stroke:1.5px rgba(255,255,255,.08);letter-spacing:-.03em;line-height:.9}
        .hh-geo{position:absolute;z-index:2;pointer-events:none;opacity:0;transition:all 2s cubic-bezier(.16,1,.3,1)}
        .hh-geo.on{opacity:1}
        .g1{top:10%;right:15%;width:250px;height:250px;border:2px solid var(--primary);border-radius:50%;box-shadow:0 0 60px rgba(0,181,214,.2);transform:scale(.3);transition-delay:.5s}
        .g1.on{transform:scale(1);opacity:.4}
        .g2{bottom:22%;left:6%;width:45px;height:90px;border-left:2px solid var(--primary);border-top:2px solid var(--primary);border-bottom:2px solid var(--primary);transition-delay:.8s}
        .g2.on{opacity:.35}
        .g3{top:35%;right:38%;width:45px;height:90px;border-right:2px solid var(--primary);border-top:2px solid var(--primary);border-bottom:2px solid var(--primary);transition-delay:1.1s}
        .g3.on{opacity:.35}

        .hs{display:grid;grid-template-columns:repeat(4,1fr);background:#fff}
        .hs-c{padding:48px 20px;text-align:center;border-right:1px solid var(--gray-200);transition:background .4s,color .4s}
        .hs-c:last-child{border-right:none}
        .hs-c:hover{background:var(--primary)}
        .hs-c:hover .hs-n{color:var(--primary)}
        .hs-c:hover .hs-l{color:rgba(255,255,255,.5)}
        .hs-n{font-family:var(--font-display);font-weight:800;font-size:clamp(32px,4vw,48px);color:var(--gray-900);line-height:1;transition:color .4s}
        .hs-l{font-family:var(--font-display);font-size:11px;font-weight:500;color:var(--gray-500);text-transform:uppercase;letter-spacing:.1em;margin-top:12px;transition:color .4s}

        .ag{position:relative;height:50vh;overflow:hidden}
        .ag video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .ag-ov{position:absolute;inset:0;background:rgba(0,0,0,.82);z-index:1}
        .ag-txt{position:relative;z-index:2;height:100%;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 24px;transition:transform .15s ease-out}
        .ag h2{font-family:var(--font-display);font-weight:700;font-size:clamp(24px,3.5vw,48px);color:#fff;line-height:1.3;letter-spacing:-.02em}
        .ag h2 span{color:var(--primary)}

        .decl{background:var(--white);padding:0;overflow:hidden;position:relative}
        .decl-inner{padding:clamp(56px,7vw,100px) clamp(40px,6vw,80px);max-width:1400px;margin:0 auto}
        .decl-h{font-family:var(--font-display);font-weight:800;font-size:clamp(36px,5.5vw,76px);letter-spacing:-.04em;line-height:.92;margin:0}
        .decl-h1{color:var(--gray-900)}
        .decl-vid{width:100%;height:clamp(160px,20vw,300px);overflow:hidden;margin:clamp(20px,3vw,40px) 0;border-radius:16px;position:relative}
        .decl-vid video{width:100%;height:100%;object-fit:cover}
        .decl-vid::after{content:'';position:absolute;inset:0;background:none}
        .decl-h2{color:var(--primary)}

        .decl-proof{display:flex;gap:clamp(24px,4vw,60px);margin-top:clamp(40px,5vw,72px);padding-top:clamp(24px,3vw,40px);border-top:1px solid var(--gray-200)}
        .decl-p{flex:1}
        .decl-p strong{display:block;font-family:var(--font-display);font-weight:700;font-size:clamp(16px,1.4vw,20px);color:var(--gray-900);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}
        .decl-p span{font-family:var(--font-display);font-weight:400;font-size:clamp(14px,1.2vw,17px);color:var(--gray-600);line-height:1.55}
        .decl-cta{margin-top:clamp(32px,4vw,56px);text-align:center}
        .decl-btn{display:inline-block;padding:18px 52px;font-family:var(--font-display);font-size:13px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:#fff;background:var(--primary);text-decoration:none;border-radius:50px;transition:all .4s}
        .decl-btn:hover{background:var(--gray-900);transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.15)}

        /* PLATFORM */
        .plat{background:var(--gray-50);padding:clamp(56px,7vw,100px) clamp(40px,6vw,80px);overflow:hidden}
        .plat-inner{max-width:1400px;margin:0 auto}
        .plat-top{display:grid;grid-template-columns:1fr 1fr;gap:clamp(32px,4vw,60px);align-items:center;margin-bottom:clamp(36px,4vw,56px)}
        .plat-h{font-family:var(--font-display);font-weight:800;font-size:clamp(32px,4vw,56px);color:var(--gray-900);line-height:.95;letter-spacing:-.03em}
        .plat-h em{font-style:italic;color:var(--primary)}
        .plat-desc{font-family:var(--font-display);font-size:clamp(16px,1.5vw,20px);color:var(--gray-500);line-height:1.6;font-weight:300}
        .plat-nums{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}
        .plat-num{background:var(--primary);padding:clamp(32px,4vw,48px) clamp(20px,2vw,32px);text-align:center;transition:all .4s;box-shadow:0 8px 24px rgba(0,181,214,.2)}
        .plat-num:first-child{border-radius:16px 0 0 16px}
        .plat-num:last-child{border-radius:0 16px 16px 0}
        .plat-num:hover{background:var(--gray-900)}
        .plat-n{font-family:var(--font-display);font-weight:800;font-size:clamp(36px,4vw,56px);color:#fff;line-height:1}
        .plat-nl{font-family:var(--font-display);font-size:clamp(11px,1vw,14px);font-weight:500;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.1em;margin-top:8px}
        .plat-cta{text-align:center;margin-top:clamp(24px,3vw,40px)}
        .plat-btn{display:inline-block;padding:18px 52px;font-family:var(--font-display);font-size:13px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:#fff;background:var(--primary);text-decoration:none;border-radius:50px;transition:all .4s}
        .plat-btn:hover{background:var(--primary);transform:translateY(-3px)}

        .hv{position:relative;height:50vh;overflow:hidden}
        .hv video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .hv-ov{position:absolute;inset:0;background:rgba(0,0,0,.7);z-index:1}
        .hv-ct{position:relative;z-index:2;height:100%;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 24px}
        .hv h2{font-family:var(--font-display);font-weight:800;font-size:clamp(28px,4vw,56px);color:#fff;line-height:1.15;letter-spacing:-.02em}
        .hv h2 em{font-weight:300;font-style:italic;opacity:.8}

        .hn{background:var(--gray-50);padding:clamp(48px,6vw,72px) 0;display:grid;grid-template-columns:1fr auto;overflow:hidden}
        .hn-c{padding:0 clamp(24px,4vw,60px)}
        .hn-lab{font-family:var(--font-display);font-weight:800;font-size:clamp(120px,20vw,350px);color:rgba(0,181,214,.06);writing-mode:vertical-rl;line-height:1;letter-spacing:-.04em;padding-right:20px;user-select:none}
        .hn-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px}
        .hn-card{position:relative;overflow:hidden;display:flex;align-items:flex-end;text-decoration:none;min-height:280px;transition:transform .5s}
        .hn-card:first-child{grid-column:1;grid-row:span 2;min-height:564px}
        .hn-card:hover{transform:scale(.97)}
        .hn-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1s cubic-bezier(.16,1,.3,1)}
        .hn-card:hover img{transform:scale(1.12)}
        .hn-card::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 20%,rgba(0,0,0,.85) 100%);z-index:1}
        .hn-in{position:relative;z-index:2;padding:28px}
        .hn-tag{font-family:var(--font-display);font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--primary);margin-bottom:8px}
        .hn-tt{font-family:var(--font-display);font-size:20px;font-weight:700;color:#fff;line-height:1.2;text-transform:uppercase}
        .hn-card:first-child .hn-tt{font-size:clamp(24px,3vw,36px)}
        .hn-arr{position:absolute;top:16px;right:16px;z-index:2;width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;transition:all .3s}
        .hn-card:hover .hn-arr{background:var(--primary);border-color:var(--primary)}

        .ht{min-height:auto;display:flex;align-items:center;justify-content:center;background:var(--white);padding:clamp(48px,6vw,80px) 24px;text-align:center}
        .ht-q{font-family:var(--font-display);font-weight:300;font-style:italic;font-size:clamp(22px,3vw,38px);color:var(--gray-900);line-height:1.2;max-width:800px;margin:0 auto}
        .ht-a{font-family:var(--font-display);font-size:14px;color:var(--gray-500);margin-top:28px;font-weight:500}
        .ht-a span{color:var(--primary);font-weight:600}
        .ht-d{display:flex;justify-content:center;gap:10px;margin-top:28px}
        .ht-dd{width:8px;height:8px;border-radius:50%;background:var(--gray-200);border:none;padding:0;cursor:pointer;transition:all .4s}
        .ht-dd.on{background:var(--primary);transform:scale(1.6);box-shadow:0 0 12px rgba(0,181,214,.4)}

        .hf{padding:clamp(60px,8vw,100px) 24px;background:var(--white);text-align:center;position:relative;overflow:hidden}
        .hf::before{display:none}
        .hf h2{font-family:var(--font-display);font-weight:800;font-size:clamp(32px,4vw,56px);color:var(--gray-900);letter-spacing:-.02em;margin-bottom:40px;position:relative;z-index:1}
        .hf h2 span{color:var(--primary);font-style:italic}
        .gs-cta-glow{text-shadow:none}
        .hf-btn{display:inline-block;padding:18px 52px;font-family:var(--font-display);font-size:13px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:#fff;background:var(--primary);text-decoration:none;transition:all .4s;position:relative;z-index:1;border-radius:50px}
        .hf-btn:hover{background:var(--gray-900);color:#fff;transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.15)}

        @media(max-width:768px){
          .hh-ghost,.hh-geo,.hn-lab{display:none}
          .decl-proof{flex-direction:column;gap:24px}
          .plat-top{grid-template-columns:1fr}
          .plat-nums{grid-template-columns:1fr}
          .plat-num:first-child,.plat-num:last-child{border-radius:16px}
          .hn{grid-template-columns:1fr}
          .hn-grid{grid-template-columns:1fr}
          .hn-card:first-child{grid-row:span 1;min-height:280px}
          .hs{grid-template-columns:repeat(2,1fr)}
          .hs-c:nth-child(2){border-right:none}
          .hs-c:nth-child(1),.hs-c:nth-child(2){border-bottom:1px solid var(--gray-200)}
        }
      ` }} />

      {/* 1-3. HERO */}
      <section className="hh">
        <video autoPlay loop muted playsInline><source src="/images/hero-video.mp4" type="video/mp4" /></video>
        <div className="hh-ov" />
        <div className={`hh-geo g1 ${showGlow ? 'on' : ''}`} />
        <div className={`hh-geo g2 ${showGlow ? 'on' : ''}`} />
        <div className={`hh-geo g3 ${showGlow ? 'on' : ''}`} />
        <div className="hh-center">
          <h1>{typed.includes('GROWTH') ? <>THINK<br /><span>{typed.slice(5)}</span></> : typed}<span className="hh-cursor" style={{ opacity: showGlow ? 0 : 1, animation: 'blink .6s step-end infinite' }} /></h1>
          <div className={`hh-glow ${showGlow ? 'on' : ''}`}>Your billing team is leaving money on the table. We pick it up.</div>
          <Link href="/contact" className={`hh-btn ${showBtn ? 'on' : ''}`}>Know More</Link>
        </div>
        <div className="hh-ghost">THINK<br />GROWTH.</div>
      </section>

      {/* 4. STATS */}
      <section id="sec-stats"><div className="hs">
        <div className="hs-c gs-stat"><div className="hs-n">30%</div><div className="hs-l">More Revenue</div></div>
        <div className="hs-c gs-stat"><div className="hs-n">98%+</div><div className="hs-l">Collected</div></div>
        <div className="hs-c gs-stat"><div className="hs-n">99%</div><div className="hs-l">Claims Paid First Time</div></div>
        <div className="hs-c gs-stat"><div className="hs-n">98.5%</div><div className="hs-l">Coding Accuracy</div></div>
      </div></section>

      {/* 5. AI AGENTS — mouse follow */}
      <section className="ag" id="sec-agents" ref={agRef} onMouseMove={onMM}>
        <video autoPlay loop muted playsInline><source src="/images/specialties-hero.mp4" type="video/mp4" /></video>
        <div className="ag-ov" />
        <div className="ag-txt" style={{ transform: `translate(${mouseX}px, ${mouseY}px)` }}>
          <h2>
            <div className="gs-agline">Claims chased before you notice them.</div>
            <div className="gs-agline">Denials overturned before they cost you.</div>
            <div className="gs-agline">Collections handled while you see patients.</div>
          </h2>
        </div>
      </section>

      {/* 6. STATEMENT */}
      <section className="decl" id="sec-stmt">
        <div className="decl-inner">
          <h2 className="decl-h decl-h1 gs-d-h1">WE ARE COSENTUS.</h2>
          <div className="decl-vid gs-d-vid">
            <video autoPlay loop muted playsInline><source src="/images/specialties-hero.mp4" type="video/mp4" /></video>
          </div>
          <h2 className="decl-h decl-h2 gs-d-h2">WE KNOW HEALTHCARE.</h2>
          <div className="decl-proof gs-d-proof">
            <div className="decl-p"><strong>Will they care about MY practice?</strong><span>No investors to answer to. We only answer to you.</span></div>
            <div className="decl-p"><strong>Do they know MY specialty?</strong><span>Anesthesia. Ortho. Pain. ASC. Behavioral Health. We already work your codes.</span></div>
            <div className="decl-p"><strong>Will I talk to a real person?</strong><span>Named team. Direct line. They know your payers by heart.</span></div>
          </div>
          <div className="decl-cta gs-d-cta"><Link href="/contact" className="decl-btn">Let&apos;s Talk</Link></div>
        </div>
      </section>


      {/* PLATFORM — Cosentus.ai + MedCloud */}
      <section className="plat" id="sec-plat">
        <div className="plat-inner">
          <div className="plat-top">
            <h2 className="plat-h gs-plat-h">Not Just a<br />Billing Company.<br /><em>A Platform.</em></h2>
            <p className="plat-desc gs-plat-desc">MedCloud. AI-native from day one. Not retrofitted onto legacy systems. Your practice runs on it — or we plug into yours. 3,000+ calls handled daily. AI works for you before you walk in the door.</p>
          </div>
          <div className="plat-nums">
            <div className="plat-num gs-plat-num"><div className="plat-n">23</div><div className="plat-nl">Platform Modules</div></div>
            <div className="plat-num gs-plat-num"><div className="plat-n">15</div><div className="plat-nl">AI Features</div></div>
            <div className="plat-num gs-plat-num"><div className="plat-n">8</div><div className="plat-nl">Voice AI Agents</div></div>
          </div>
          <div className="plat-cta"><Link href="/cosentus-ai" className="plat-btn">Explore The Platform</Link></div>
        </div>
      </section>

      {/* 7. VIDEO */}
      <section className="hv" id="sec-video">
        <video autoPlay loop muted playsInline><source src="/images/hero-video.mp4" type="video/mp4" /></video>
        <div className="hv-ov" />
        <div className="hv-ct">
          <h2>
            <div className="gs-vtop">25 Years. 19 Acquisitions.</div>
            <div className="gs-vbot"><em>One Mission.</em></div>
          </h2>
        </div>
      </section>

      {/* 8. NEWS */}
      <section className="hn" id="sec-news"><div className="hn-c"><div className="hn-grid">
        <Link href="/news/congress-moves-to-stop-the-bleeding-new-bill-would-cap-annual-medicare-pay-cuts-at-2-5" className="hn-card gs-news">
          <img src="/images/hero-bg.jpg" alt="" /><div className="hn-in"><div className="hn-tag">Medicare Policy</div><div className="hn-tt">Congress Moves to Stop the Bleeding</div></div>
          <div className="hn-arr"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></div>
        </Link>
        <Link href="/news/cms-policy-updates-asc" className="hn-card gs-news">
          <img src="/images/hero-healthcare.jpg" alt="" /><div className="hn-in"><div className="hn-tag">CMS Policy</div><div className="hn-tt">Four Changes Every Specialty Must Know</div></div>
          <div className="hn-arr"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></div>
        </Link>
        <Link href="/news/asc-reimbursement-payer-strategy" className="hn-card gs-news">
          <img src="/images/hero-medical.jpg" alt="" /><div className="hn-in"><div className="hn-tag">ASC</div><div className="hn-tt">ASC Reimbursement Under Attack</div></div>
          <div className="hn-arr"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></div>
        </Link>
      </div></div><div className="hn-lab">NEWS</div></section>

      {/* 9. TESTIMONIALS */}
      <section className="ht" id="sec-testi"><div className="gs-testi">
        <div className="ht-q">&ldquo;{quotes[qi].q}&rdquo;</div>
        <div className="ht-a">— {quotes[qi].a} &nbsp;|&nbsp; <span>{quotes[qi].t}</span></div>
        <div className="ht-d">{quotes.map((_, i) => (
          <button key={i} className={`ht-dd ${i === qi ? 'on' : ''}`} onClick={() => setQi(i)} aria-label={`Quote ${i + 1}`} />
        ))}</div>
      </div></section>

      {/* 10. CTA */}
      <section className="hf" id="sec-cta">
        <h2 className="gs-cta gs-cta-glow">How Much Are You <span>Leaving Behind?</span></h2>
        <Link href="/contact" className="hf-btn gs-cta">Get Your Free Analysis</Link>
      </section>
    </main>
  )
}
