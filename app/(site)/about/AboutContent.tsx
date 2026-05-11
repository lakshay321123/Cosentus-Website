'use client'

import { useState } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'
import TeamCircleGrid from '@/components/ui/TeamCircleGrid'

const beliefs = [
  { title: 'Customers first', desc: 'We measure success by the revenue gains we deliver for practices, not vanity metrics.' },
  { title: 'Transparency', desc: 'Real-time dashboards, weekly reviews, and same-day reporting. No waiting. No guessing.' },
  { title: 'Accountability', desc: 'We own outcomes end-to-end. Issues get root-cause analysis and immediate fixes.' },
  { title: 'Specialty focus', desc: 'Teams organized by specialty. They know every payer nuance and clinical detail, reducing denials and accelerating cash flow.' },
]

const companyStats = [
  { value: '25+', label: 'Years RCM Expertise' },
  { value: 'R+A', label: 'Real + Artificial Intelligence' },
  { value: '99%', label: 'Customer Retention' },
  { value: '30%', label: 'Up to Revenue Growth' },
]

const leadership = [
  { name: 'GS Bhalla', title: 'Chief Executive Officer', photo: '/images/3-GS.jpg', bio: 'GS is our founder and serves as Chairman and CEO of the Cosentus group. His mission is to lead a team of global professionals that are focused on building the world\'s premiere business services organization. GS is a consummate entrepreneur and understands the challenges of growing a business and scaling it profitably without losing sight of its great asset, its people and culture. Having started Cosentus over 20 years ago, he has found an innovative approach to optimizing value for our customers. His dedication to his employees is proven as Cosentus still has more than 80% of its founding employees still working with the company! GS and Manisha live in sunny Orange County, CA with their two children Jas and Tej and three dogs Eeevee, Milo and Percy. They love to travel and learn about people and new cultures. GS is an avid golfer, scotch connoisseur, watch enthusiast and a member of YPO and the HBS Alumni association.' },
  { name: 'JR Thompson', title: 'Sr. VP & Chief Operating Officer', photo: '/images/JR THOMPSON.jpg', bio: 'J.R. Thompson brings more than 37 years of healthcare management experience to Cosentus. For over 14 years, he was an equity partner at abeo Management Corporation, where he held key leadership positions including President of Provider Services, Chief Marketing Officer, and Senior Vice President for the Texas, California, and Mountain Operating Divisions. Before abeo, he spent 7 years as Chief Operating Officer at Third Party Solutions (TPS), a $500 million medical billing and practice management company providing Revenue Cycle Management services to Walmart, CVS, Rite Aid, Safeway, Kroger, and other national retail pharmacy chains. Earlier in his career, he was an equity partner and Executive Vice President at Apollo Enterprises/The Potomac Group, a sponsor-backed medical billing services firm. Mr. Thompson holds a bachelor\'s degree from Brigham Young University and a master\'s degree in Engineering from Central Missouri State University. Residing in the Provo, Utah area with his wife Gail, J.R. continues to enjoy the beauty of the Rocky Mountains. Together, they are proud parents of three children and grandparents to ten. Family remains at the center of their lives, whether it\'s supporting grandchildren in baseball, football, basketball, jiu jitsu, archery, cheer, or dance. When not with family, J.R. and Gail love exploring Utah\'s rugged landscapes, often off-roading in the Wasatch National Park and beyond.' },
  { name: 'Manisha Bhalla', title: 'Chief People Officer', photo: '/images/1Manisha.jpg', bio: 'The Bhalla\'s are a family of 7. GS, Manisha, 2 two-legged and 3 four-legged children. As the Executive Director of Cosentus, she loves the entire team and looks forward to seeing everyone every day, and we all look forward to her around-the-office morning greetings and warm, balancing presence! (She\'s also GS\'s boss!!) With Cosentus since Day One, she loves giving back to the community, family, and friends without any expectation of a return. In her free time, she loves to read, watch Downton Abbey (her latest obsession!) and take long walks/hikes. Her favorite shows include Bones, Friends, Schitts Creek, and Downton Abbey, of course!' },
  { name: 'Viktor Alvarado', title: 'Chief Financial Officer', photo: '/images/Viktor-Alvarado.jpg', bio: 'Joined Cosentus in October 2024. Over 25 years of experience in Corporate Finance and Controlling, with expertise in structuring the Finance function to enable high growth. Started his journey in different financial roles at Dana Corporation, moving in 2001 to Brenntag, the Global Chemical distribution leader. At Brenntag he held positions of increasing responsibility from Finance Director (CFO) Mexico culminating with Vice President of Controlling (FP&A), Global Material Science. In these positions he was instrumental on executing growth plans that included redesigning country logistic footprints to M&A projects. Viktor holds an Accounting degree and MBA\'s from both Mexico and Spain. He\'s married to his wife of 15 years Gaby and together they have Viktor, who is twelve years old and eight-year-old Valeria. They enjoy traveling to get to know new places and cultures together.' },
  { name: 'Stephen Williamson', title: 'Chief Growth Officer', photo: '/images/Stephen Williamson.jpg', bio: 'Stephen Williamson has spent over 30 years building relationships in healthcare, the kind that actually last. As Chief Growth Officer, he leads with radical candor and full transparency and brings the same directness to the teams he builds and mentors across Sales and Marketing. Ask anyone who\'s worked with him, and they\'ll tell you: Stephen shows up for his partners the same way he shows up in the rest of his life, fully. He\'s a former skydiving business owner, a certified gemologist, a licensed pilot, and a scuba diver. Play a round of golf with him or ask his sons about their hunting trips, and you\'ll quickly realize the running game in his circle is \'what hasn\'t Stephen done?\' At home, he and his wife Karen make the most of every chance to travel. At work, he\'s focused on growing something worth being proud of.' },
  { name: 'Allen Ranjan', title: 'Chief Revenue Officer', photo: '/images/ALLEN RANJAN.jpg', bio: 'Allen has spent years absorbing any and all information he can in all aspects of revenue cycle management. We have coined him \'The Encyclopedia\'. Allen is not only a whiz at the operation and relational portion of our business, as our Chief Revenue Officer he has also mastered business development and analytics to become the full package. Allen has been with Cosentus since our company was founded, and is truly devoted to what he does and the clients and employees that he serves. With his wife Pragya, Allen has a beautiful little girl named Aaradhya who is seven that likes to peek in on her dad and provide him smiles while he works, and he somehow always has time for a chat, a smile, and a joke.' },
  { name: 'Wayne Wertz', title: 'Sr. Director of HR & Corporate Operations', photo: '/images/Wayne.jpg', bio: 'Wayne lives in sunny, southern Orange County, CA with his wife, three children and numerous four-legged, fur babies. A proud graduate of the Pennsylvania State University (WE ARE!), he has over 25 years in the medical services industry in the areas of HR, operations, and facilities management. His passions include golf, billiards, playing music and traveling.' },
  { name: 'David Langsam', title: 'Board Advisor', photo: '/images/david-langsam.jpg', bio: 'David is an Executive Advisor with Cosentus and a growth-oriented CEO with extensive experience leading PE-backed, tech-enabled healthcare services companies. He has driven strategic direction, executed growth and acquisition strategies, improved financial performance, and worked closely with large enterprise clients. His background includes sourcing and integrating acquisitions, building scalable go-to-market strategies, and leading the development of proprietary technologies that improve automation and workforce productivity. David has also secured debt and equity capital to support expansion and established global operating centers outside the U.S. In addition to his operating leadership, David serves or has served on several professional, nonprofit, and community boards, including EvAl Home Care Solutions (Executive Chairman), MB Global Partners, First Children\'s Services, Water Street Healthcare Partners, and the Glencoe Educational Foundation.' },
  { name: 'Ashwin Pajpal', title: 'Global Brand Director', photo: '/images/Ashwin.jpg', bio: 'Ashwin is the creative voice guiding everything that we do. With an Art and English Honors Degree, Ashwin found his calling in advertising. He graduated from College of Art, New Delhi, India and has since worked for some of the world\'s top network agencies in India, South-Asia and the Middle East and became Youngest Creative Director in India. Over the past two decades he has had the privilege to work with prominent worldwide brands like: Hyundai Motors, Hero Motors, Nestle Asia, Glaxo Smith Klein (Belgium), Osteoporosis Foundation New York, World Health Organization, and many other prestigious companies. When not at work, Ashwin enjoys walking on the beach, and going cycling. He loves new art installations, and enjoying the best coffee in the world in Dubai where he calls home.' },
]

export default function AboutContent() {
  // Use TeamMember type so TeamCircleGrid's onPersonClick (which yields
  // TeamMember) can pass straight into this setter. The leadership entries
  // are fully populated with photo+bio anyway, so this is a strict superset.
  const [selectedPerson, setSelectedPerson] = useState<import('@/components/ui/TeamCircleGrid').TeamMember | null>(null)
  return (
    <>
      {/* CO-SENT-US meaning ~ Together we Conquer.

          Clean vector implementation: pure SVG paths and text on a
          transparent background sitting on the teal panel.
            - "C" is one SVG <path> arc.
            - "O" is two concentric <circle> elements.
            - Inner words and "= coexpand" are real SVG <text> (selectable,
              accessible, crisp at every viewport size).
          Animation: stroke-dasharray / stroke-dashoffset draw on the
          shapes, sequential fade-up on the text. No raster image, no
          conic-gradient masks, no @property. Respects prefers-reduced-motion. */}
      <section className="about-co-section">
        <div className="container">
          <h2 className="about-co-title">
            <span className="about-co-title-l">CO-SENT-US meaning</span>
            <span className="about-co-title-tilde">&nbsp;~&nbsp;</span>
            <span className="about-co-title-r">Together we Conquer</span>
          </h2>
          <div className="about-co-graphic">
            <svg
              className="about-co-svg"
              viewBox="0 0 1200 670"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="collaborate + coordinate + cooperate = coexpand"
            >
              {/* C: arc going clockwise from top of outer ring, around the
                  left, back to inner ring, around inner counter-clockwise. */}
              <path
                className="co-draw-c"
                pathLength={1}
                d="M 554.34 131.62 A 285 285 0 1 0 554.34 548.38 L 462.32 449.71 A 150 150 0 1 1 462.32 230.29 L 554.34 131.62"
              />

              {/* Inner words: collaborate + coordinate + cooperate. */}
              <text className="co-text co-word co-fade" style={{ animationDelay: '3.35s' }} x="360" y="270" textAnchor="middle">collaborate</text>
              <text className="co-text co-plus co-fade" style={{ animationDelay: '3.75s' }} x="360" y="306" textAnchor="middle">+</text>
              <text className="co-text co-word co-fade" style={{ animationDelay: '4.15s' }} x="360" y="342" textAnchor="middle">coordinate</text>
              <text className="co-text co-plus co-fade" style={{ animationDelay: '4.55s' }} x="360" y="378" textAnchor="middle">+</text>
              <text className="co-text co-word co-fade" style={{ animationDelay: '4.95s' }} x="360" y="414" textAnchor="middle">cooperate</text>

              {/* O: two concentric rings. */}
              <circle className="co-draw-o" pathLength={1} cx="840" cy="340" r="285" />
              <circle className="co-draw-o" pathLength={1} cx="840" cy="340" r="150" />

              {/* = coexpand. */}
              <text className="co-text co-coexpand co-fade" style={{ animationDelay: '7.15s' }} x="840" y="354" textAnchor="middle">= coexpand</text>
            </svg>
          </div>
        </div>
      </section>

      <style>{`
        .about-co-section {
          background: var(--primary);
          padding: clamp(56px, 8vw, 96px) 0 clamp(64px, 9vw, 120px);
          color: #fff;
          overflow: hidden;
        }
        .about-co-title {
          font-family: var(--font-display);
          font-size: clamp(18px, 2vw, 28px);
          font-weight: 700;
          line-height: 1.3;
          letter-spacing: -0.005em;
          color: #fff;
          text-align: center;
          margin: 0 auto clamp(36px, 5vw, 64px);
          max-width: 760px;
        }
        .about-co-title-l,
        .about-co-title-r,
        .about-co-title-tilde {
          display: inline-block;
          opacity: 0;
        }
        .about-co-title-l {
          transform: translateX(-30px);
          animation: coTitleL 0.9s 0.3s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
        .about-co-title-r {
          transform: translateX(30px);
          animation: coTitleR 0.9s 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
        .about-co-title-tilde {
          animation: coFade 0.5s 1.5s ease-out forwards;
        }
        @keyframes coTitleL { to { opacity: 1; transform: translateX(0); } }
        @keyframes coTitleR { to { opacity: 1; transform: translateX(0); } }
        @keyframes coFade   { to { opacity: 1; } }

        /* Graphic wrapper: clamped width, centered, SVG fills it fluidly. */
        .about-co-graphic {
          max-width: 760px;
          margin: 0 auto;
        }
        .about-co-svg {
          width: 100%;
          height: auto;
          display: block;
        }

        /* SVG text styling — uses the site display token. */
        .co-text {
          fill: #fff;
          font-family: var(--font-display), system-ui, -apple-system, sans-serif;
          letter-spacing: .01em;
        }
        .co-word { font-size: 29px; font-weight: 400; }
        .co-plus { font-size: 28px; font-weight: 400; }
        .co-coexpand { font-size: 29px; font-weight: 400; }

        /* Per-text fade-up. Animation-delay set inline per element. */
        .co-fade {
          opacity: 0;
          transform: translateY(8px);
          animation: coTextFadeUp 650ms ease-out forwards;
        }
        @keyframes coTextFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* C arc draw. pathLength=1 normalises stroke-dasharray/offset to
           1, so the dash and gap math is independent of actual path length. */
        .co-draw-c {
          stroke: #fff;
          stroke-width: 13.5;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-miterlimit: 10;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: coDrawLine 1.9s cubic-bezier(.35, 0, .2, 1) 1.55s forwards;
        }
        /* O circles draw. transform-origin: center + rotate(-90deg) makes
           the dash start at the 12 o'clock position so the draw begins
           there rather than at the default 3 o'clock. */
        .co-draw-o {
          stroke: #fff;
          stroke-width: 13.5;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          transform-box: fill-box;
          transform-origin: center;
          transform: rotate(-90deg);
          animation: coDrawLine 1.55s cubic-bezier(.35, 0, .2, 1) 5.65s forwards;
        }
        @keyframes coDrawLine {
          to { stroke-dashoffset: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-co-title-l,
          .about-co-title-r,
          .about-co-title-tilde {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }
          .co-fade {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }
          .co-draw-c,
          .co-draw-o {
            stroke-dashoffset: 0 !important;
            animation: none !important;
          }
        }
      `}</style>

      {/* About Description */}
      <section className="section" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="container">
          <div style={{ maxWidth: 880 }}>
            <RevealOnScroll>
              <p style={{ fontSize: 22, lineHeight: 1.7, color: 'var(--gray-800)', fontWeight: 400, margin: 0 }}>
                Cosentus is a full-service practice growth partner and global healthcare revenue cycle management (RCM) company.
                For more than 25 years, we have helped physician practices, specialty groups, and surgery centers grow revenue,
                eliminate billing inefficiencies, and scale operations, end-to-end, from patient registration to final payment,
                with Real + Artificial Intelligence and specialty-trained teams.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--gray-500)', margin: '24px 0 0' }}>
                Built on its R+A approach, Real + Artificial Intelligence, Cosentus combines experienced revenue cycle
                professionals with specialised AI agents to help healthcare organisations manage administrative complexity
                more efficiently and improve operational efficiency and financial performance.
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* What We Believe */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">What We Believe</div>
          </RevealOnScroll>

          {/* Desktop */}
          <div className="advantage-grid advantages-desktop" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginTop: 48 }}>
            {beliefs.map((b, i) => (
              <RevealOnScroll key={i}>
                <div className="advantage-card">
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          {/* Mobile */}
          <div className="advantages-mobile" style={{ marginTop: 32 }}>
            <MobileCarousel autoScrollInterval={4000}>
              {beliefs.map((b, i) => (
                <div key={i} className="advantage-card">
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                </div>
              ))}
            </MobileCarousel>
          </div>
        </div>
      </section>

      {/* Company by Numbers */}
      <section style={{ borderTop: '1px solid var(--gray-200)', borderBottom: '1px solid var(--gray-200)', padding: '48px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {companyStats.map((stat, i) => (
              <RevealOnScroll key={i} delay={i * 0.12}>
                <div style={{
                  textAlign: 'center', padding: '24px 16px',
                  borderRight: i < companyStats.length - 1 ? '1px solid var(--gray-200)' : 'none',
                }}>
                  <div style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, color: 'var(--primary)', fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: 8 }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-500)', letterSpacing: '0.02em' }}>{stat.label}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section section-alt" id="leadership">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">Executive Leadership</div>
          </RevealOnScroll>

          <TeamCircleGrid
            people={leadership}
            onPersonClick={setSelectedPerson}
            desktopColumns={3}
          />

          {/* Bio Modal */}
          {selectedPerson && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', padding: 20 }} onClick={() => setSelectedPerson(null)}>
              <div style={{ background: 'white', borderRadius: 16, border: '2px solid #00B5D6', maxWidth: 520, width: '100%', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelectedPerson(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'var(--gray-100)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, zIndex: 1 }}>✕</button>
                <div style={{ padding: '28px 28px 20px', display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '3px solid #00B5D6', background: '#f0f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedPerson.photo ? (
                      <img src={selectedPerson.photo} alt={selectedPerson.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 28, fontWeight: 600, color: '#00B5D6' }}>{selectedPerson.name.split(' ').map(n => n[0]).join('')}</span>
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 22, fontWeight: 500, color: 'var(--gray-900)', margin: 0 }}>{selectedPerson.name}</h3>
                    <p style={{ fontSize: 14, color: '#00B5D6', margin: 0, fontWeight: 500 }}>{selectedPerson.title}</p>
                  </div>
                </div>
                <div style={{ padding: '0 28px 28px' }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--gray-700)' }}>{selectedPerson.bio}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
