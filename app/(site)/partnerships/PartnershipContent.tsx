'use client'

import Image from 'next/image'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import TestimonialsSection from '@/components/sections/TestimonialsSection'

const partnerQuotes = [
  { tag: 'Partner', quote: 'We are very excited to be a part of the Cosentus family. We see such a strategic fit amongst the teams and are ready to unlock all of the combined potential.', name: 'Alex Cushman', role: 'CEO, AllianceMed' },
  { tag: 'Partner', quote: "We are proud of the company we've built and excited to join forces with Cosentus. Together, we'll have the resources, technology, & expertise to provide even greater value to the healthcare providers we serve.", name: 'Brandon Jones', role: 'CEO, Alta Management Solutions, LLC' },
  { tag: 'Partner', quote: 'Cosentus made the acquisition of North Medical Billing seamless, delivering on every promise and exceeding expectations. Professional, efficient, and trustworthy, they turned a business relationship into a lasting friendship. Highly recommend!', name: 'Doug North', role: 'Founder & Former Owner, North Medical Billing' },
  { tag: 'Partner', quote: 'We are excited to play an even bigger role in the world of RCM and healthcare consulting, with an expanded team that is poised to provide unmatched outcomes.', name: 'Arthur Roosa', role: 'CEO and founder of SyMed' },
  { tag: 'Partner', quote: 'Together with Cosentus, our clients will benefit from cutting-edge technology, deeper analytics, and a partnership model that truly understands and drives their financial success.', name: 'Logan Lowry', role: 'Co-Founder and President of Accreda' },
]

// Live cosentus.com/partnership uses 4 illustrated stick-figure scenes
// (image already contains figure + speech-balloon caption baked in) and a
// teal Think Growth strip with 4 white icons + bold title + light desc.
// Mirrored here verbatim with cleaner spacing and stagger-in animation.
const challengeImages = [
  { src: '/images/partnership/challenge-2a.png', alt: 'Struggling to utilize offshore teams effectively?' },
  { src: '/images/partnership/challenge-2b.png', alt: 'Frustrated with your billing management software?' },
  { src: '/images/partnership/challenge-2c.png', alt: 'Uncontrollable variables continue to mount against your business?' },
  { src: '/images/partnership/challenge-2d.png', alt: 'Looking to de-risk you & your family by taking some chips off the table?' },
]

const thinkGrowthPillars = [
  {
    icon: '/images/partnership/icon-3a.png',
    title: '25 Years in Revenue Cycle Management',
    desc: 'successfully integrated 19 acquisitions',
  },
  {
    icon: '/images/partnership/icon-3b.png',
    title: 'Upfront Capital Investments',
    desc: 'De-risk the owners, providing financial security',
  },
  {
    icon: '/images/partnership/icon-3c.png',
    title: 'Comprehensive Solutions',
    desc: 'offshore teams, advanced technology platforms, & support',
  },
  {
    icon: '/images/partnership/icon-3d.png',
    title: 'Transformative Offshoring & Tech',
    desc: 'enhance efficiency, reduce costs, improve service delivery',
  },
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
          /* Matches the homepage RA section stat (.ra-stat-num) per
             user (Jun 2026): same clamp, weight 700, line-height 1,
             -0.02em. Was weight 200 / lh 0.9 / -0.04em. */
          font-size: clamp(44px, 5.5vw, 68px);
          font-weight: 700;
          color: var(--primary);
          line-height: 1;
          letter-spacing: -0.02em;
          font-family: var(--font-display);
        }

        .stat-suffix {
          /* Scaled down proportionally with .stat-number (was
             clamp(20px, 3vw, 32px)) so the + / yr keeps its ratio.
             Weight follows .stat-number (200 next to 700 reads odd). */
          font-size: clamp(15px, 2.2vw, 23px);
          font-weight: 700;
          color: var(--primary);
          opacity: 0.6;
        }

        .stat-label {
          font-size: 13px;
          color: var(--gray-500);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 12px;
          font-weight: 600;
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

        .cta-grid {
          grid-template-columns: 1fr 1fr;
        }

        /* ===== Challenges section (4 stick-figure illustrations) =====
         * Dark grey background (#616161, the darkest grey from the brand
         * pantone) so the white stick figures contrast strongly. */
        .partnership-challenges {
          padding: 96px 0 80px;
          background: #616161;
        }

        .partnership-challenges-title {
          font-family: var(--font-display);
          font-size: clamp(28px, 3.4vw, 44px);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: white;
          text-align: center;
          margin: 0 auto 56px;
          max-width: 880px;
        }

        .partnership-challenges-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
          align-items: end;
        }

        .partnership-challenge-card {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          transition: transform 320ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .partnership-challenge-card:hover {
          transform: translateY(-6px);
        }

        .partnership-challenge-card img {
          width: 100%;
          height: auto;
          max-width: 180px;
          display: block;
        }

        /* ===== THINK GROWTH section (teal strip + 4 icon pillars) ===== */
        .partnership-thinkgrowth {
          position: relative;
          background: var(--primary);
          color: white;
          padding: 80px 0;
          overflow: hidden;
        }

        .partnership-thinkgrowth-title {
          font-family: var(--font-display);
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 800;
          font-style: italic;
          letter-spacing: 0.02em;
          color: white;
          text-align: center;
          margin: 0 0 56px;
        }

        .partnership-thinkgrowth-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          align-items: start;
        }

        .partnership-thinkgrowth-pillar {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 12px 8px;
        }

        .partnership-thinkgrowth-icon {
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          transition: transform 420ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .partnership-thinkgrowth-pillar:hover .partnership-thinkgrowth-icon {
          transform: translateY(-4px) rotate(-3deg);
        }

        .partnership-thinkgrowth-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .partnership-thinkgrowth-pillar-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          color: white;
          line-height: 1.25;
          margin: 0 0 12px;
        }

        .partnership-thinkgrowth-pillar-desc {
          font-size: 16px;
          font-weight: 400;
          color: white;
          line-height: 1.55;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .partnership-challenges-grid,
          .partnership-thinkgrowth-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 36px;
          }
        }

        @media (max-width: 768px) {
          .cta-grid {
            grid-template-columns: 1fr;
          }

          .problem-solution-grid {
            grid-template-columns: 1fr !important;
          }

          .partnership-stats {
            grid-template-columns: 1fr;
          }

          .stat-block + .stat-block::before {
            display: none;
          }

          .stat-block {
            padding: 32px 24px;
          }

          .partnership-challenges {
            padding: 64px 0 48px;
          }
          .partnership-challenges-title {
            margin-bottom: 36px;
          }
          /* Mobile: 2x2 grid so all four illustrations are visible
             together without a long scroll, per direction. */
          .partnership-challenges-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px 12px;
            max-width: 100%;
          }
          .partnership-challenge-card img {
            max-width: 160px;
          }

          .partnership-thinkgrowth {
            padding: 64px 0;
          }
          .partnership-thinkgrowth-title {
            margin-bottom: 36px;
          }
          .partnership-thinkgrowth-grid {
            grid-template-columns: 1fr;
            gap: 36px;
            max-width: 360px;
            margin: 0 auto;
          }
          .partnership-thinkgrowth-icon {
            width: 96px;
            height: 96px;
            margin-bottom: 16px;
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

      {/* Intro — matches the "GET STARTED / Partner with Cosentus"
          pattern at the bottom of the page: small uppercase teal
          subheading, h2, then body paragraph. Left-aligned in the
          standard 1280px container, body capped to ~880px for
          readable line length. */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="container">
          <RevealOnScroll>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: 8 }}>
              About Cosentus
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', fontWeight: 300, color: 'var(--gray-900)', marginBottom: 24, maxWidth: 880, lineHeight: 1.2 }}>
              Independently owned. Powered by AI.<br />Proven at scale.
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.9, color: 'var(--gray-600)', maxWidth: 880 }}>
              With AI software and outsourcing capabilities, we are one of the largest non-private equity-backed RCM companies in America. Our integrated services approach has fostered several long-term partnerships. As an organization, we have consistently ranked as one of the Fastest Growing Companies in the US by Inc. 5000, and have been certified by Great Place to Work for three consecutive years.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Partner Testimonials — uses shared TestimonialsSection so design is identical site-wide */}
      <TestimonialsSection
        testimonials={partnerQuotes}
        label="PARTNER PERSPECTIVES"
        title={<>Our <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Partner&apos;s</span> Perspective.</>}
      />

      {/* Challenge — 4 stick-figure illustrations. Each PNG is the
          full composition (figure + speech balloon + caption), rendered
          on a soft grey field with stagger fade+lift on scroll. Mirrors
          live cosentus.com/partnership but with cleaner gutters and
          modern card lift on hover. */}
      <section className="partnership-challenges">
        <div className="container">
          <RevealOnScroll>
            <h2 className="partnership-challenges-title">
              Is Your Journey to Growth Facing These Challenges?
            </h2>
          </RevealOnScroll>
          <div className="partnership-challenges-grid">
            {challengeImages.map((c, i) => (
              <RevealOnScroll key={c.src} direction="scale" delay={0.1 + i * 0.12}>
                <div className="partnership-challenge-card">
                  <Image
                    src={c.src}
                    alt={c.alt}
                    width={303}
                    height={592}
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 22vw"
                  />
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* THINK GROWTH — teal strip with 4 white icon + text pillars.
          Same icons, headings and descriptions as live, just laid out
          with consistent gutters and a subtle scale-in on each pillar. */}
      <section className="partnership-thinkgrowth">
        <div className="container">
          <RevealOnScroll>
            <h2 className="partnership-thinkgrowth-title">THINK GROWTH</h2>
          </RevealOnScroll>
          <div className="partnership-thinkgrowth-grid">
            {thinkGrowthPillars.map((p, i) => (
              <RevealOnScroll key={p.title} direction="scale" delay={0.1 + i * 0.12}>
                <div className="partnership-thinkgrowth-pillar">
                  <div className="partnership-thinkgrowth-icon">
                    <Image
                      src={p.icon}
                      alt=""
                      width={120}
                      height={120}
                      sizes="(max-width: 640px) 80px, 120px"
                    />
                  </div>
                  <h3 className="partnership-thinkgrowth-pillar-title">{p.title}:</h3>
                  <p className="partnership-thinkgrowth-pillar-desc">{p.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>





      {/* CTA with Form */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container">
          <div className="cta-grid" style={{ display: 'grid', gap: 48, alignItems: 'center', maxWidth: 1000, margin: '0 auto' }}>
            <RevealOnScroll>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: 8 }}>Get Started</div>
                <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, color: 'var(--gray-900)', marginBottom: 20 }}>Partner with Cosentus</h2>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--gray-600)' }}>
                  At Cosentus, we understand the unique challenges faced by medical billing companies. Our tailored solutions and innovative approach ensure that our partners can overcome these hurdles<br />and achieve sustainable growth.
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={0.15}>
              <form className="partnership-form" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="First Name *" aria-label="First Name" required />
                <input type="text" placeholder="Last Name *" aria-label="Last Name" required />
                <input type="text" placeholder="Company *" aria-label="Company" required />
                <input type="email" placeholder="Email *" aria-label="Email" required />
                <textarea placeholder="Message *" aria-label="Message" required />
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
