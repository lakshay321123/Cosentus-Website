'use client'

import { useState } from 'react'
import Image from 'next/image'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import TeamCircleGrid from '@/components/ui/TeamCircleGrid'
import { MASTER_SVG } from './coSvgStrings'

const companyStats = [
  { value: '25+', label: 'Years RCM Expertise' },
  { value: 'R+A', label: 'Real People + Ai' },
  { value: '99%', label: 'Customer Retention' },
  { value: '30%', label: 'Up to Revenue Growth' },
]

// Our Process — 6-step engagement journey, identical content + icon
// order to cosentus.com/about-us. Icons are byte-for-byte downloads
// from live (icon1-1.png … icon6-1.png).
const processSteps = [
  {
    icon: '/images/about/process/icon-1.png',
    title: 'Exploration',
    points: ['Initial Prospect Contact', 'Presentation', 'RFP Collection of Prospect Information'],
  },
  {
    icon: '/images/about/process/icon-2.png',
    title: 'Discovery',
    points: ['Discovery Call', 'Proposal Development', 'Proposal Meeting'],
  },
  {
    icon: '/images/about/process/icon-3.png',
    title: 'Commitment',
    points: ['Post Discovery Call “Deal Review”', 'Expectations Agreed Upon', 'Contract Signed'],
  },
  {
    icon: '/images/about/process/icon-4.png',
    title: 'Stabilization',
    points: ['The Welcome', 'Onboarding', 'Service Team Introductions & Relationship Building'],
  },
  {
    icon: '/images/about/process/icon-5.png',
    title: 'Standardization',
    points: ['Establish Process Expectations', 'Communication Cadence & Check-Ins', 'Reporting & Follow-Up'],
  },
  {
    icon: '/images/about/process/icon-6.png',
    title: 'Optimization',
    points: ['Analytics', 'Client Reviews', 'Consistent Results Over & over'],
  },
]

const leadership = [
  { name: 'GS Bhalla', title: 'Chief Executive Officer', photo: '/images/3-GS.jpg', bio: 'GS is our founder and serves as Chairman and CEO of the Cosentus group. His mission is to lead a team of global professionals that are focused on building the world\'s premiere business services organization. GS is a consummate entrepreneur and understands the challenges of growing a business and scaling it profitably without losing sight of its great asset, its people and culture. Having started Cosentus over 20 years ago, he has found an innovative approach to optimizing value for our customers. His dedication to his employees is proven as Cosentus still has more than 80% of its founding employees still working with the company! GS and Manisha live in sunny Orange County, CA with their two children Jas and Tej and three dogs Eeevee, Milo and Percy. They love to travel and learn about people and new cultures. GS is an avid golfer, scotch connoisseur, watch enthusiast and a member of YPO and the HBS Alumni association.' },
  { name: 'JR Thompson', title: 'Chief Operating Officer', photo: '/images/JR THOMPSON.jpg', bio: 'J.R. Thompson brings more than 37 years of healthcare management experience to Cosentus. For over 14 years, he was an equity partner at abeo Management Corporation, where he held key leadership positions including President of Provider Services, Chief Marketing Officer, and Senior Vice President for the Texas, California, and Mountain Operating Divisions. Before abeo, he spent 7 years as Chief Operating Officer at Third Party Solutions (TPS), a $500 million medical billing and practice management company providing Revenue Cycle Management services to Walmart, CVS, Rite Aid, Safeway, Kroger, and other national retail pharmacy chains. Earlier in his career, he was an equity partner and Executive Vice President at Apollo Enterprises/The Potomac Group, a sponsor-backed medical billing services firm. Mr. Thompson holds a bachelor\'s degree from Brigham Young University and a master\'s degree in Engineering from Central Missouri State University. Residing in the Provo, Utah area with his wife Gail, J.R. continues to enjoy the beauty of the Rocky Mountains. Together, they are proud parents of three children and grandparents to ten. Family remains at the center of their lives, whether it\'s supporting grandchildren in baseball, football, basketball, jiu jitsu, archery, cheer, or dance. When not with family, J.R. and Gail love exploring Utah\'s rugged landscapes, often off-roading in the Wasatch National Park and beyond.' },
  { name: 'Manisha Bhalla', title: 'Chief People Officer', photo: '/images/1Manisha.jpg', bio: 'The Bhalla\'s are a family of 7. GS, Manisha, 2 two-legged and 3 four-legged children. As the Executive Director of Cosentus, she loves the entire team and looks forward to seeing everyone every day, and we all look forward to her around-the-office morning greetings and warm, balancing presence! (She\'s also GS\'s boss!!) With Cosentus since Day One, she loves giving back to the community, family, and friends without any expectation of a return. In her free time, she loves to read, watch Downton Abbey (her latest obsession!) and take long walks/hikes. Her favorite shows include Bones, Friends, Schitts Creek, and Downton Abbey, of course!' },
  { name: 'Viktor Alvarado', title: 'Chief Financial Officer', photo: '/images/Viktor-Alvarado.jpg', bio: 'Joined Cosentus in October 2024. Over 25 years of experience in Corporate Finance and Controlling, with expertise in structuring the Finance function to enable high growth. Started his journey in different financial roles at Dana Corporation, moving in 2001 to Brenntag, the Global Chemical distribution leader. At Brenntag he held positions of increasing responsibility from Finance Director (CFO) Mexico culminating with Vice President of Controlling (FP&A), Global Material Science. In these positions he was instrumental on executing growth plans that included redesigning country logistic footprints to M&A projects. Viktor holds an Accounting degree and MBA\'s from both Mexico and Spain. He\'s married to his wife of 15 years Gaby and together they have Viktor, who is twelve years old and eight-year-old Valeria. They enjoy traveling to get to know new places and cultures together.' },
  { name: 'Stephen Williamson', title: 'Chief Growth Officer', photo: '/images/Stephen Williamson.jpg', bio: 'Stephen Williamson has spent over 30 years building relationships in healthcare, the kind that actually last. As Chief Growth Officer, he leads with radical candor and full transparency and brings the same directness to the teams he builds and mentors across Sales and Marketing. Ask anyone who\'s worked with him, and they\'ll tell you: Stephen shows up for his partners the same way he shows up in the rest of his life, fully. He\'s a former skydiving business owner, a certified gemologist, a licensed pilot, and a scuba diver. Play a round of golf with him or ask his sons about their hunting trips, and you\'ll quickly realize the running game in his circle is \'what hasn\'t Stephen done?\' At home, he and his wife Karen make the most of every chance to travel. At work, he\'s focused on growing something worth being proud of.' },
  { name: 'Allen Ranjan', title: 'Chief Client Officer', photo: '/images/ALLEN RANJAN.jpg', bio: 'Allen has spent years absorbing any and all information he can in all aspects of revenue cycle management. We have coined him \'The Encyclopedia\'. Allen is not only a whiz at the operation and relational portion of our business, as our Chief Client Officer he has also mastered business development and analytics to become the full package. Allen has been with Cosentus since our company was founded, and is truly devoted to what he does and the clients and employees that he serves. With his wife Pragya, Allen has a beautiful little girl named Aaradhya who is seven that likes to peek in on her dad and provide him smiles while he works, and he somehow always has time for a chat, a smile, and a joke.' },
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
      {/* CO graphic — single master SVG with every element choreographed
          individually via CSS animation-delay.

          Master SVG contents (back-to-front DOM order):
            .co-c                       C shape
            .co-o-ring                  continuous O ring (used during text stages)
            .co-stage1-{team,strategy,process,delivery}   first set of words
            .co-stage2-{collaborate,coordinate,cooperate,coexpand}  second set
            .co-woman                   doctor figure inside C (HIDDEN — kept in
                                        markup so the change can be reverted via
                                        one CSS line if marketing changes its mind)
            .co-wedge-1..12             12 wedges, clockwise from 12 o'clock.
                                        Each wedge group contains a white plate
                                        (.s3-fil0 path) plus a .co-wedge-icon group.
            .co-man                     figure inside O (last to appear)

          Timeline (all timings absolute, anchored at t=0 when the master
          animation begins). Key change from earlier version: the LINES (the
          cyan separators between wedge plates, revealed when the white O ring
          fades out) now appear BEFORE the icons, not after.

          To pull this off the wedge animation is split:
            • The wedge group (.co-wedge) fades in INVISIBLY (its white plate
              matches the white ring underneath, so the user sees nothing).
              This is just preparation so the plates are in place when the
              ring fades.
            • Then the ring fades out — and because the wedge plates are now
              underneath where the ring used to be, the cyan SEPARATORS between
              plates suddenly become visible. This is the user-perceived
              appearance of the "lines".
            • Only then do the icons (.co-wedge-icon) fade in on top of the
              plates, keeping the original 100ms stagger and scale-pop feel.

            t = 1.0    .co-c fades in (700ms)
            t = 1.4    .co-o-ring fades in (700ms)
            t = 2.5    TEAM slides up + fades in (750ms)
            t = 3.0    + STRATEGY  (500ms stagger)
            t = 3.5    + PROCESS
            t = 4.0    = DELIVERY  (all four in by 4.75s)
            t = 4.75   ─── 1.0s HOLD ───
            t = 5.75   stage-1 words fade out together (625ms)
            t = 6.5    co~llaborate slides up + fades in
            t = 7.0    + co~ordinate
            t = 7.5    + co~operate
            t = 8.0    = co~expand  (all four in by 8.75s)
            t = 8.75   ─── 1.0s HOLD ───
            t = 9.75   stage-2 words fade out (625ms)
            t = 10.4   wedge plates fade in invisibly (400ms) — preparation
            t = 10.9   .co-o-ring fades out (1000ms ease-in-out) —
                       SEPARATOR LINES become visible as the ring disappears
            t = 12.0   wedge 1 icon fades in (450ms, 100ms stagger)
            t = 13.1   wedge 12 icon starts, fully in by 13.55s
            t = 13.7   .co-man fades in (700ms) — last element

          Respects prefers-reduced-motion (jumps to final static state). */}
      <section className="about-co-section">
        <div className="container">
          <div className="about-co-graphic">
            <div
              className="co-stage-wrapper"
              role="img"
              aria-label="Together we Conquer: collaborate, coordinate, and cooperate to deliver outcomes."
              dangerouslySetInnerHTML={{ __html: MASTER_SVG }}
            />
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
        .about-co-graphic {
          max-width: 864px;
          margin: 0 auto;
        }
        /* Wrapper holds the source SVG aspect ratio (14158.55 : 7824.33).
           SVG self-scales to fit; no padding hack needed because we have
           a single SVG (no absolute-positioned siblings to align with). */
        .co-stage-wrapper {
          width: 100%;
          display: block;
        }
        .co-stage-wrapper svg {
          width: 100%;
          height: auto;
          display: block;
        }

        /* --- C and O ring ---
           C appears 1.0s after page load (not instantly) so the section
           has a beat of empty space before anything happens. O ring
           comes in 400ms after C. The ring stays at full opacity through
           the entire wedge appearance and only fades out AFTER all 12
           wedges are seated. Ring is now a generated ellipse that
           geometrically matches the wedge plates exactly, so wedges
           coming in on top produce no visible "plate" change — only
           their icons appear. */
        .co-stage-wrapper .co-c {
          opacity: 0;
          animation: coFadeIn 700ms cubic-bezier(.16, 1, .3, 1) 1000ms forwards;
        }
        .co-stage-wrapper .co-o-ring {
          opacity: 0;
          animation:
            coFadeIn  700ms cubic-bezier(.16, 1, .3, 1)    1400ms forwards,
            coFadeOut 1000ms ease-in-out                  10900ms forwards;
        }

        /* --- Stage-1 words (TEAM + STRATEGY + PROCESS = DELIVERY) ---
           750ms entrance, 500ms stagger (25% slower than before), and a
           1000ms hold once all four are visible — enough time to actually
           read the line before it begins fading out. */
        .co-stage-wrapper .co-stage1-word {
          opacity: 0;
          transform: translateY(8px);
          transform-box: fill-box;
          transform-origin: center;
          animation:
            coWordIn   750ms cubic-bezier(.16, 1, .3, 1) var(--in-delay) forwards,
            coWordOut  625ms ease-out                          5750ms   forwards;
        }
        .co-stage-wrapper .co-stage1-team     { --in-delay: 2500ms; }
        .co-stage-wrapper .co-stage1-strategy { --in-delay: 3000ms; }
        .co-stage-wrapper .co-stage1-process  { --in-delay: 3500ms; }
        .co-stage-wrapper .co-stage1-delivery { --in-delay: 4000ms; }

        /* --- Stage-2 words ---
           Same 750/500/1000/625 cadence as stage 1, but the longer
           "co~llaborate"/"co~ordinate"/etc words benefit from the extra
           reading time even more. */
        .co-stage-wrapper .co-stage2-word {
          opacity: 0;
          transform: translateY(8px);
          transform-box: fill-box;
          transform-origin: center;
          animation:
            coWordIn   750ms cubic-bezier(.16, 1, .3, 1) var(--in-delay) forwards,
            coWordOut  625ms ease-out                          9750ms   forwards;
        }
        .co-stage-wrapper .co-stage2-collaborate { --in-delay: 6500ms; }
        .co-stage-wrapper .co-stage2-coordinate  { --in-delay: 7000ms; }
        .co-stage-wrapper .co-stage2-cooperate   { --in-delay: 7500ms; }
        .co-stage-wrapper .co-stage2-coexpand    { --in-delay: 8000ms; }

        /* --- Woman doctor inside C ---
           Hidden by request — kept in the SVG markup so it can be re-enabled
           by deleting this rule and restoring the original fade-in. */
        .co-stage-wrapper .co-woman {
          opacity: 0 !important;
        }

        /* --- 12 wedges: plate + icon, split into two phases ---
           Phase A (plate prep, INVISIBLE TO USER): the wedge group fades in
           between t=10.4s and t=10.8s. The plate is white-on-white against
           the O ring, so nothing visibly changes — this is purely so the
           plates are in place when the ring fades out. We cap fade-in at
           400ms (fast, since it's invisible) and start it just after the
           stage-2 words finish fading out at ~10.4s.

           Phase B (ring fade-out reveals lines): handled by .co-o-ring
           rule above — ring fades out 10.9s–11.9s, revealing the cyan
           separators between the (now in-place) wedge plates.

           Phase C (icon appearance): the .co-wedge-icon subgroup inside
           each wedge fades in with the original 100ms stagger and scale-
           pop, starting at t=12.0s — 100ms after the ring is fully gone. */
        .co-stage-wrapper .co-wedge {
          opacity: 0;
          animation: coFadeIn 400ms ease-out 10400ms forwards;
        }
        .co-stage-wrapper .co-wedge-icon {
          opacity: 0;
          transform: scale(0.96);
          transform-box: fill-box;
          transform-origin: center;
          animation: coWedgeIn 450ms cubic-bezier(.16, 1, .3, 1) var(--in-delay) forwards;
        }
        .co-stage-wrapper .co-wedge-1  .co-wedge-icon { --in-delay: 12000ms; }
        .co-stage-wrapper .co-wedge-2  .co-wedge-icon { --in-delay: 12100ms; }
        .co-stage-wrapper .co-wedge-3  .co-wedge-icon { --in-delay: 12200ms; }
        .co-stage-wrapper .co-wedge-4  .co-wedge-icon { --in-delay: 12300ms; }
        .co-stage-wrapper .co-wedge-5  .co-wedge-icon { --in-delay: 12400ms; }
        .co-stage-wrapper .co-wedge-6  .co-wedge-icon { --in-delay: 12500ms; }
        .co-stage-wrapper .co-wedge-7  .co-wedge-icon { --in-delay: 12600ms; }
        .co-stage-wrapper .co-wedge-8  .co-wedge-icon { --in-delay: 12700ms; }
        .co-stage-wrapper .co-wedge-9  .co-wedge-icon { --in-delay: 12800ms; }
        .co-stage-wrapper .co-wedge-10 .co-wedge-icon { --in-delay: 12900ms; }
        .co-stage-wrapper .co-wedge-11 .co-wedge-icon { --in-delay: 13000ms; }
        .co-stage-wrapper .co-wedge-12 .co-wedge-icon { --in-delay: 13100ms; }

        /* --- Man-in-tie inside O (last element) ---
           Shifted to 13.7s so it appears after the last icon (13.55s). */
        .co-stage-wrapper .co-man {
          opacity: 0;
          animation: coFadeIn 700ms cubic-bezier(.16, 1, .3, 1) 13700ms forwards;
        }

        @keyframes coFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes coFadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes coWordIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes coWordOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes coWedgeIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1);    }
        }

        /* Respect prefers-reduced-motion: skip the show entirely and
           render the final static state (C, 12 wedge plates with their
           icons, man — no woman, no text, no O ring). */
        @media (prefers-reduced-motion: reduce) {
          .co-stage-wrapper .co-c,
          .co-stage-wrapper .co-wedge,
          .co-stage-wrapper .co-wedge-icon,
          .co-stage-wrapper .co-man {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }
          .co-stage-wrapper .co-o-ring,
          .co-stage-wrapper .co-woman,
          .co-stage-wrapper .co-stage1-word,
          .co-stage-wrapper .co-stage2-word {
            opacity: 0 !important;
            animation: none !important;
          }
        }
      `}</style>

      {/* 360° service solutions — three brand-colored cards.
          Recreates the corresponding section from cosentus.com/about-us
          using the pantone palette: dark grey (#616161), primary teal
          (#00B5D6), and the lighter teal tone (#36C2DE). Cards align at
          the bottom on desktop for the staggered feel of the source;
          stack vertically on narrow viewports. */}
      <section className="section" style={{ paddingBottom: 32 }}>
        <div className="container">
          {/* Section heading — per Doc 1 (May 24 2026), the 3-card
              block below should be introduced as "Why Practices
              Choose Us. And Stay." rendered as a proper section
              title, not as an intro paragraph. Uses .section-title
              class for typography consistency with the rest of the
              site. The old "We're a 360° service solutions
              provider…" intro line was removed per the doc; the
              cards do the work of explaining the offering. */}
          <RevealOnScroll>
            <div className="section-title" style={{ textAlign: 'center' }}>
              Why Practices Choose Us. And Stay.
            </div>
          </RevealOnScroll>
          <div className="about-360-grid" style={{ marginTop: 56 }}>
            <RevealOnScroll delay={0.2}>
              <div className="about-360-card about-360-card-grey">
                <p>
                  Healthcare organizations don&rsquo;t need more reports. They need clarity, accountability, and a
                  partner that knows how to fix it. Cosentus is a revenue cycle management partner built for
                  organizations that are tired of reacting to revenue problems after the damage is already done.
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={0.9}>
              <div className="about-360-card about-360-card-light">
                <p>
                  We combine specialty-trained experts with AI-native technology to reduce denials, improve cash
                  flow, and collect more of what you&rsquo;ve earned. We manage the full revenue cycle from start to
                  finish, including credentialing, eligibility, prior authorizations, coding, payment posting,
                  denial management, appeals, patient billing, AR follow-up, and collections.
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={1.6}>
              <div className="about-360-card about-360-card-primary">
                <p>
                  Unlike vendors that hand over reports and expect you to become the crime scene investigator,
                  Cosentus gives you full transparency, clear recommendations, and hands-on execution.{' '}
                  <strong>Real People + AI.</strong> Our specialists handle the judgment calls that technology
                  alone cannot make. They stay in your specialty. They know your payers. And behind them, Zeus
                  runs 23 modules across every step of your revenue cycle. Built around each client&rsquo;s
                  specialty, payer mix, workflows, and goals. You focus on your patients. We handle the revenue
                  cycle.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>

        <style>{`
          .about-360-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0;
            align-items: end;
          }
          .about-360-intro {
            text-align: center;
            max-width: 920px;
            margin: 0 auto 56px;
            font-family: var(--font-display);
            font-size: clamp(20px, 2.2vw, 28px);
            line-height: 1.45;
            font-weight: 400;
            color: var(--gray-700);
          }
          /* No min-heights drive bottom alignment — flex column with
             justify-content: flex-end pushes the text to the bottom of
             each card's padded box, so the three cards' paragraphs all
             end at the same baseline regardless of length differences.
             The grid's align-items: end still keeps the BOXES bottom-
             aligned across the row; this rule aligns the TEXT inside
             each box. Mobile (<=900px) reverts to top-aligned because
             stacked cards reading top-to-bottom feel more natural that
             way; that override sits in the @media block below. */
          .about-360-card {
            padding: 56px 40px;
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          }
          .about-360-card p {
            margin: 0 0 20px;
            font-size: 19px;
            line-height: 1.6;
            color: #fff;
          }
          .about-360-card p:last-child { margin-bottom: 0; }
          .about-360-card strong { font-weight: 700; color: #fff; }

          .about-360-card-grey    { background: #616161; min-height: 380px; }
          .about-360-card-light   { background: #36C2DE; min-height: 480px; }
          .about-360-card-primary { background: #00B5D6; min-height: 580px; }

          @media (max-width: 900px) {
            .about-360-grid {
              grid-template-columns: 1fr;
              align-items: stretch;
            }
            .about-360-card {
              padding: 32px 24px;
              justify-content: flex-start;
            }
            .about-360-card p { font-size: 16px; }
          }
        `}</style>
      </section>

      {/* Company by Numbers */}
      <section style={{ borderBottom: '1px solid var(--gray-200)', padding: '32px 0 48px' }}>
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

      {/* Our Process — 6-step engagement journey from prospect to
          long-running optimization. Same content + icons as
          cosentus.com/about-us. Dark grey background per live design.
          Animation: each step's icon fades+lifts in first, then the
          title, then the bullet list — and the steps themselves
          stagger across the row so step 1 starts before step 2. */}
      <section className="about-process">
        <div className="container">
          <RevealOnScroll>
            <h2 className="about-process-title">Our Process</h2>
          </RevealOnScroll>
          <div className="about-process-grid">
            {processSteps.map((step, i) => {
              // base delay for the whole step; sub-elements sequence
              // off this so icon -> title -> list within each step.
              // Stagger between steps is 0.6s so each step has time
              // to visually complete its icon -> title -> bullets
              // sequence before the next step begins.
              const stepDelay = 0.2 + i * 0.6
              return (
                <div className="about-process-step" key={step.title}>
                  <RevealOnScroll delay={stepDelay}>
                    <div className="about-process-icon">
                      <Image
                        src={step.icon}
                        alt=""
                        width={158}
                        height={186}
                        sizes="(max-width: 640px) 96px, 130px"
                      />
                    </div>
                  </RevealOnScroll>
                  <RevealOnScroll delay={stepDelay + 0.25}>
                    <h3 className="about-process-step-title">{step.title}</h3>
                  </RevealOnScroll>
                  <RevealOnScroll delay={stepDelay + 0.5}>
                    <ul className="about-process-list">
                      {step.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </RevealOnScroll>
                </div>
              )
            })}
          </div>
        </div>

        <style>{`
          .about-process {
            background: #616161;
            color: #fff;
            padding: clamp(64px, 9vw, 120px) 0;
          }
          .about-process-title {
            font-family: var(--font-display);
            font-size: clamp(28px, 3.6vw, 48px);
            font-weight: 700;
            line-height: 1.2;
            letter-spacing: -0.01em;
            color: #fff;
            text-align: center;
            margin: 0 auto clamp(40px, 6vw, 72px);
          }
          .about-process-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: clamp(20px, 2vw, 32px);
            align-items: start;
          }
          .about-process-step {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .about-process-icon {
            width: 130px;
            height: 153px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
          }
          .about-process-icon img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          .about-process-step-title {
            font-family: var(--font-display);
            font-size: clamp(18px, 1.5vw, 22px);
            font-weight: 500;
            color: #fff;
            margin: 0 0 14px;
            /* text-align: center is inherited from .about-process-step.
               Title sits centered under the icon. */
          }
          .about-process-list {
            /* display: inline-block lets the list shrink to its content
               width, so the parent's text-align: center on the step
               centers the whole bullet block under the icon and title.
               text-align: left inside keeps the bullet text reading
               left-to-right within the block. max-width: 100% forces
               long bullet lines to wrap to a second line within the
               column instead of overflowing into adjacent columns. */
            display: inline-block;
            text-align: left;
            list-style: disc;
            padding-left: 18px;
            margin: 0;
            max-width: 100%;
            font-size: 15px;
            line-height: 1.55;
            color: rgba(255, 255, 255, 0.92);
          }
          .about-process-list li + li {
            margin-top: 6px;
          }
          @media (max-width: 1024px) {
            .about-process-grid {
              grid-template-columns: repeat(3, 1fr);
              gap: 40px 24px;
            }
          }
          @media (max-width: 640px) {
            .about-process-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 36px 16px;
            }
            .about-process-icon {
              width: 96px;
              height: 113px;
              margin-bottom: 12px;
            }
            .about-process-list {
              font-size: 14px;
              padding-left: 16px;
            }
          }
        `}</style>
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
                <button onClick={() => setSelectedPerson(null)} aria-label="Close bio" style={{ position: 'absolute', top: 16, right: 16, background: 'var(--gray-100)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, zIndex: 1 }}>✕</button>
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
