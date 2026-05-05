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
          Animated reveal sequence (auto-play on mount):
            1. heading slides in from L+R
            2. all 3 words fade in together inside future C
            3. C ring revealed by teal overlay sweeping CCW from bottom
            4. O outer ring revealed the same way
            5. O inner ring revealed the same way
            6. '= coexpand' fades in inside the inner ring
          The graphic is the original brand WebP — never recreated.
          Each ring's clipPath layer in the SVG renders pixel-perfect;
          the "draw from bottom" effect comes from teal HTML overlays
          on top whose conic-gradient masks rotate to peel them away. */}
      <section className="about-co-section">
        <div className="container">
          <h2 className="about-co-title">
            <span className="about-co-title-l">CO-SENT-US meaning</span>
            <span className="about-co-title-tilde">&nbsp;~&nbsp;</span>
            <span className="about-co-title-r">Together we Conquer</span>
          </h2>
          <div className="about-co-graphic">
            <svg
              viewBox="0 0 1201 670"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="CO graphic: collaborate + coordinate + cooperate equals coexpand"
            >
              <defs>
                {/* clip rect for the 3 words inside the C */}
                <clipPath id="co-words">
                  <rect x="240" y="180" width="200" height="255" />
                </clipPath>

                {/* clip ellipse for '= coexpand' text — wider than before
                    to include the '=' sign at the left */}
                <clipPath id="co-coexpand">
                  <ellipse cx="908" cy="335" rx="170" ry="170" />
                </clipPath>

                {/* clip path for C ring annulus only */}
                <clipPath id="co-clip-c-ring" clipPathUnits="userSpaceOnUse">
                  <path
                    d="M 0 0 H 651 V 670 H 0 Z M 240 180 H 440 V 435 H 240 Z"
                    clipRule="evenodd"
                  />
                </clipPath>

                {/* clip path for O outer ring annulus */}
                <clipPath id="co-clip-o-outer" clipPathUnits="userSpaceOnUse">
                  <path
                    d="M 652 0 H 1201 V 670 H 652 Z M 718 335 A 190 210 0 1 1 1098 335 A 190 210 0 1 1 718 335"
                    clipRule="evenodd"
                  />
                </clipPath>

                {/* clip path for O inner ring annulus */}
                <clipPath id="co-clip-o-inner" clipPathUnits="userSpaceOnUse">
                  <path
                    d="M 718 335 A 190 210 0 1 1 1098 335 A 190 210 0 1 1 718 335 M 773 335 A 135 170 0 1 1 1043 335 A 135 170 0 1 1 773 335"
                    clipRule="evenodd"
                  />
                </clipPath>
              </defs>

              {/* Layer 1: words */}
              <image
                className="co-layer co-layer-words"
                href="/images/about/co-graphic.webp"
                x="0" y="0" width="1201" height="670"
                clipPath="url(#co-words)"
                preserveAspectRatio="none"
              />
              {/* Layer 2: C ring (always opaque after its delay; the
                  reveal animation is the overlay above) */}
              <image
                className="co-layer co-layer-c"
                href="/images/about/co-graphic.webp"
                x="0" y="0" width="1201" height="670"
                clipPath="url(#co-clip-c-ring)"
                preserveAspectRatio="none"
              />
              {/* Layer 3: O outer ring */}
              <image
                className="co-layer co-layer-o-outer"
                href="/images/about/co-graphic.webp"
                x="0" y="0" width="1201" height="670"
                clipPath="url(#co-clip-o-outer)"
                preserveAspectRatio="none"
              />
              {/* Layer 4: O inner ring */}
              <image
                className="co-layer co-layer-o-inner"
                href="/images/about/co-graphic.webp"
                x="0" y="0" width="1201" height="670"
                clipPath="url(#co-clip-o-inner)"
                preserveAspectRatio="none"
              />
              {/* Layer 5: = coexpand */}
              <image
                className="co-layer co-layer-coexpand"
                href="/images/about/co-graphic.webp"
                x="0" y="0" width="1201" height="670"
                clipPath="url(#co-coexpand)"
                preserveAspectRatio="none"
              />
            </svg>
            {/* Three teal-colored overlay divs positioned over the
                rings. Each has a conic-gradient mask whose angle is
                animated. As the gradient angle grows, the overlay
                disappears CCW from the bottom — revealing the SVG
                ring underneath progressively. Coordinates are
                percentages of the .about-co-graphic box (which has
                aspect-ratio 1201/670). */}
            <div className="co-wipe co-wipe-c" aria-hidden="true" />
            <div className="co-wipe co-wipe-o-outer" aria-hidden="true" />
            <div className="co-wipe co-wipe-o-inner" aria-hidden="true" />
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

        .about-co-graphic {
          position: relative;
          max-width: 760px;
          margin: 0 auto;
          aspect-ratio: 1201 / 670;
        }
        .about-co-graphic svg {
          width: 100%;
          height: auto;
          display: block;
        }

        /* SVG ring layers fade in just before their teal overlay
           starts wiping. Words and coexpand fade in directly. */
        .co-layer {
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .co-layer-words    { animation: coFade 0.7s 2.0s ease-out forwards; }
        .co-layer-c        { animation: coFade 0.05s 2.85s linear forwards; }
        .co-layer-o-outer  { animation: coFade 0.05s 4.35s linear forwards; }
        .co-layer-o-inner  { animation: coFade 0.05s 5.65s linear forwards; }
        .co-layer-coexpand { animation: coFade 0.6s 6.4s ease-out forwards; }

        /* Animated angle property used by the conic-gradient masks. */
        @property --co-angle {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        /* Teal overlay divs positioned absolutely over the
           .about-co-graphic. They cover the entire graphic area,
           but each has a conic-gradient mask such that only the
           area NOT YET swept is opaque. As --co-angle grows, the
           opaque sector shrinks CCW from the bottom, revealing the
           SVG ring underneath. */
        .co-wipe {
          position: absolute;
          inset: 0;
          background: var(--primary);
          pointer-events: none;
          --co-angle: 0deg;
          /* conic-gradient default starts at top (12 o'clock) going CW.
             'from 180deg' rotates the start by 180° CW from top, so
             the start is at the BOTTOM (6 o'clock). Increasing the
             gradient angle then goes CW visually: bottom -> LEFT ->
             top -> right. The transparent sector (revealed area)
             starts at 0° and grows to var(--co-angle), so as the
             angle grows from 0 -> 360, the C body is uncovered first
             (left side), then top, then right side. */
          -webkit-mask-image: conic-gradient(
            from 180deg at 50% 50%,
            transparent 0deg,
            transparent var(--co-angle),
            #000 var(--co-angle),
            #000 360deg
          );
          mask-image: conic-gradient(
            from 180deg at 50% 50%,
            transparent 0deg,
            transparent var(--co-angle),
            #000 var(--co-angle),
            #000 360deg
          );
          opacity: 1;
          z-index: 1;
        }
        @keyframes coWipe {
          0%   { --co-angle: 0deg; }
          100% { --co-angle: 360deg; }
        }

        /* Each ring overlay sized to its own ring's bounding box so the
           conic-gradient center sits at the ring center. Without this,
           the center of the wipe would be the center of the whole
           graphic, and the wipe would be off-axis from each ring. */
        .co-wipe-c {
          /* C ring spans x≈0-651, y≈0-670 in viewBox 1201x670.
             As %: left 0%, right 54.2%; top 0%, bottom 100%. */
          left: 0;
          right: 45.8%;
          top: 0;
          bottom: 0;
          /* Cut a hole in the wipe over the words area so the words
             remain visible while the C ring reveals around them.
             Words rect in viewBox: x=240-440, y=180-435.
             As % of this wipe div (0-651 x 0-670):
               x: 36.87% - 67.59%, y: 26.87% - 64.93% */
          clip-path: polygon(
            0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
            36.87% 26.87%, 36.87% 64.93%, 67.59% 64.93%, 67.59% 26.87%, 36.87% 26.87%
          );
          animation: coWipe 1.6s 2.9s cubic-bezier(0.55, 0.05, 0.45, 0.95) forwards;
        }
        .co-wipe-o-outer {
          /* O ring spans x≈652-1201; left 54.2%, right 0%. */
          left: 54.2%;
          right: 0;
          top: 0;
          bottom: 0;
          /* Cut a hole over the O inner ring + coexpand area so they
             remain visible while the O outer reveals around them.
             Inner area in viewBox: x=718-1098, y=125-545.
             As % of this wipe div (0-549 x 0-670):
               x: 12.02% - 81.24%, y: 18.66% - 81.34% */
          clip-path: polygon(
            0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
            12.02% 18.66%, 12.02% 81.34%, 81.24% 81.34%, 81.24% 18.66%, 12.02% 18.66%
          );
          animation: coWipe 1.4s 4.4s cubic-bezier(0.55, 0.05, 0.45, 0.95) forwards;
        }
        .co-wipe-o-inner {
          /* Inner ring spans x≈718-1098, y≈125-545.
             left%: 718/1201 = 59.78%; right% from right edge: (1201-1098)/1201 = 8.58%
             top%: 125/670 = 18.66%; bottom%: (670-545)/670 = 18.66% */
          left: 59.78%;
          right: 8.58%;
          top: 18.66%;
          bottom: 18.66%;
          /* Cut a hole over the '= coexpand' area so it stays
             visible (it'll fade in via its own layer animation).
             Coexpand ellipse approx x=738-1078, y=165-505.
             As % of this wipe div (0-380 x 0-420):
               x: 5.26% - 94.74%, y: 9.52% - 90.48% */
          clip-path: polygon(
            0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
            5.26% 9.52%, 5.26% 90.48%, 94.74% 90.48%, 94.74% 9.52%, 5.26% 9.52%
          );
          animation: coWipe 1.0s 5.7s cubic-bezier(0.55, 0.05, 0.45, 0.95) forwards;
        }

        /* respect reduced-motion: snap to final state */
        @media (prefers-reduced-motion: reduce) {
          .about-co-title-l,
          .about-co-title-r,
          .about-co-title-tilde,
          .co-layer {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }
          .co-wipe {
            --co-angle: 0deg !important;
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
