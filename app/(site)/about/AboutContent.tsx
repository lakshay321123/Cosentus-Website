'use client'

import { useState } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

const beliefs = [
  {
    title: 'Customers First',
    desc: 'We measure success by the revenue gains we deliver for practices, not vanity metrics.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: 'Transparency',
    desc: 'Real-time dashboards, weekly reviews, and same-day reporting. No waiting. No guessing.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: 'Accountability',
    desc: 'We own outcomes end-to-end. Issues get root-cause analysis and immediate fixes.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    title: 'Specialty Focus',
    desc: 'Teams organized by specialty. They know every payer nuance and clinical detail — reducing denials and accelerating cash flow.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
]

const companyStats = [
  { value: '25+', label: 'Years RCM Expertise' },
  { value: 'R+A', label: 'Real + Artificial Intelligence' },
  { value: '99%', label: 'Customer Retention' },
  { value: '30%', label: 'Up to Revenue Growth' },
]

const leadership = [
  { name: 'GS Bhalla', title: 'Chief Executive Officer', photo: '/images/3-GS.jpg', bio: "GS is our founder and serves as Chairman and CEO of the Cosentus group. His mission is to lead a team of global professionals that are focused on building the world's premiere business services organization. GS is a consummate entrepreneur and understands the challenges of growing a business and scaling it profitably without losing sight of its great asset, its people and culture. Having started Cosentus over 20 years ago, he has found an innovative approach to optimizing value for our customers. His dedication to his employees is proven as Cosentus still has more than 80% of its founding employees still working with the company! GS and Manisha live in sunny Orange County, CA with their two children Jas and Tej and three dogs Eeevee, Milo and Percy. They love to travel and learn about people and new cultures. GS is an avid golfer, scotch connoisseur, watch enthusiast and a member of YPO and the HBS Alumni association." },
  { name: 'JR Thompson', title: 'Sr. VP & Chief Operating Officer', photo: '/images/JR THOMPSON.jpg', bio: "J.R. Thompson brings more than 37 years of healthcare management experience to Cosentus. For over 14 years, he was an equity partner at abeo Management Corporation, where he held key leadership positions including President of Provider Services, Chief Marketing Officer, and Senior Vice President for the Texas, California, and Mountain Operating Divisions. Before abeo, he spent 7 years as Chief Operating Officer at Third Party Solutions (TPS), a $500 million medical billing and practice management company. Mr. Thompson holds a bachelor's degree from Brigham Young University and a master's degree in Engineering from Central Missouri State University." },
  { name: 'Manisha Bhalla', title: 'Chief People Officer', photo: '/images/1Manisha.jpg', bio: "The Bhalla's are a family of 7. GS, Manisha, 2 two-legged and 3 four-legged children. As the Executive Director of Cosentus, she loves the entire team and looks forward to seeing everyone every day — and we all look forward to her around-the-office morning greetings and warm, balancing presence! With Cosentus since Day One, she loves giving back to the community, family, and friends without any expectation of a return." },
  { name: 'Viktor Alvarado', title: 'Chief Financial Officer', photo: '/images/Viktor-Alvarado.jpg', bio: "Joined Cosentus in October 2024. Over 25 years of experience in Corporate Finance and Controlling, with expertise in structuring the Finance function to enable high growth. Started his journey in different financial roles at Dana Corporation, moving in 2001 to Brenntag, the Global Chemical distribution leader. Viktor holds an Accounting degree and MBA's from both Mexico and Spain." },
  { name: 'Stephen Williamson', title: 'Chief Growth Officer', photo: '/images/Stephen Williamson.jpg', bio: "Stephen Williamson has spent over 30 years building relationships in healthcare — the kind that actually last. As Chief Growth Officer, he leads with radical candor and full transparency and brings the same directness to the teams he builds and mentors across Sales and Marketing." },
  { name: 'Allen Ranjan', title: 'Chief Revenue Officer', photo: '/images/ALLEN RANJAN.jpg', bio: "Allen has spent years absorbing any and all information he can in all aspects of revenue cycle management. We have coined him 'The Encyclopedia'. Allen is not only a whiz at the operation and relational portion of our business, as our Chief Revenue Officer he has also mastered business development and analytics to become the full package. Allen has been with Cosentus since our company was founded." },
  { name: 'Andrew Clougherty', title: 'Sr. Director of Client Services', photo: '/images/Andrew-Clougherty.jpg', bio: "Andrew has 14 years of experience in the RCM and Medical Billing fields. After a merger with Cosentus in 2023, Andrew assumed the title of Senior Director of RCM Services and began managing operations and client services for three separate offices. Andrew holds a BA degree in History and German from Saint Anselm College and a M.Ed from the University of New Hampshire." },
  { name: 'David Langsam', title: 'Board Advisor', photo: '/images/david-langsam.jpg', bio: "David is an Executive Advisor with Cosentus and a growth-oriented CEO with extensive experience leading PE-backed, tech-enabled healthcare services companies. He has driven strategic direction, executed growth and acquisition strategies, improved financial performance, and worked closely with large enterprise clients." },
  { name: 'Tom Scott', title: 'Sr. Advisor | Corporate Growth & M&A', photo: '/images/tom-scott.webp', bio: "Senior Advisor for Corporate Growth and M&A at Cosentus. MBA, CPE, and AIE with extensive experience in entrepreneurial leadership, financial management, and business development. Founder of Moon Rock Media Group, guiding companies at the intersection of AI and CRM." },
  { name: 'John Nulty', title: 'Sr. Advisor', photo: '/images/john-nulty.jpg', bio: "Senior Advisor at Cosentus bringing deep expertise in healthcare revenue cycle sales, marketing, and business development. Duke University graduate with extensive experience in the RCM industry, previously with Meduit." },
  { name: 'Raja Inder Bhalla', title: 'Managing Director', photo: '/images/Inder.jpg', bio: "Meet our co-founder of Cosentus, a well-rounded leader. Being from a Finance and International Business background, Raja brings expertise in business operations and an intricate understanding of the ever-changing nature of the service industry." },
  { name: 'Ashwin Pajpal', title: 'Global Brand Director', photo: '/images/Ashwin.jpg', bio: "Ashwin is the creative voice guiding everything that we do. With an Art and English Honors Degree, Ashwin found his calling in advertising. He graduated from College of Art, New Delhi, India and has since worked for some of the world's top network agencies." },
  { name: 'Wayne Wertz', title: 'Sr. Director of HR & Corporate Operations', photo: '/images/Wayne.jpg', bio: "Wayne lives in sunny, southern Orange County, CA with his wife, three children and numerous four-legged, fur babies. A proud graduate of the Pennsylvania State University, he has over 25 years in the medical services industry in the areas of HR, operations, and facilities management." },
  { name: 'Ajay Kumar', title: 'Chief Operating Officer - RCM', photo: '/images/AJAY KUMAR.jpg', bio: "Ajay is the Head of Operations for our Cosentus Operations Support Division. He has been with Cosentus for over 20 years, in fact, he is the first employee that GS ever hired at Cosentus! This speaks to Ajay's loyalty, and dedication that he has for our company." },
  { name: 'Aman Bhasin', title: 'Sr. VP & Head of Global Operations (Non-US)', photo: '/images/AMAN BHASIN.jpg', bio: "Aman brings with him over 20 years of management experience in the BPO industry. He has led global diverse teams of over 5,000 people across India, Philippines, Americas, United Kingdom, Mexico, and Guatemala." },
]

const offices = [
  { city: 'Irvine, CA', label: 'Headquarters', address: '300 Spectrum Center Dr, Suite 1450, Irvine, CA 92618', phone: '(949) 216-4280', maps: 'https://maps.google.com/?q=300+Spectrum+Center+Dr+Suite+1450+Irvine+CA+92618' },
  { city: 'Phoenix, AZ', label: 'Regional Office', address: 'Phoenix, AZ', phone: '(877) 266-9040', maps: 'https://maps.google.com/?q=Cosentus+Phoenix+AZ' },
  { city: 'Mission, TX', label: 'Regional Office', address: 'Mission, TX', phone: '(877) 266-9040', maps: 'https://maps.google.com/?q=Cosentus+Mission+TX' },
  { city: 'Napa, CA', label: 'Regional Office', address: '550 Gateway Dr #100, Napa, CA 94558', phone: '(877) 266-9040', maps: 'https://maps.google.com/?q=550+Gateway+Dr+100+Napa+CA+94558' },
  { city: 'Dallas, TX', label: 'Regional Office', address: 'Dallas, TX', phone: '(888) 521-0055', maps: 'https://maps.google.com/?q=Cosentus+Dallas+TX' },
  { city: 'Salt Lake City, UT', label: 'Regional Office', address: 'Utah', phone: '(877) 266-9040', maps: 'https://maps.google.com/?q=Cosentus+Utah' },
  { city: 'Olathe, KS', label: 'Regional Office', address: 'Olathe, KS', phone: '(913) 262-2323', maps: 'https://maps.google.com/?q=Cosentus+Olathe+KS' },
]

export default function AboutContent() {
  const [selectedPerson, setSelectedPerson] = useState<typeof leadership[0] | null>(null)
  return (
    <>
      <style>{`
        /* ===== ABOUT VALUES REDESIGN ===== */

        .about-values-mega {
          position: relative;
          overflow: hidden;
        }

        .values-strip {
          background: #00B5D6;
          padding: 100px 0 80px;
          position: relative;
        }

        .values-strip::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 40%;
          height: 100%;
          background: url('/images/dna-helix.jpg') center/cover no-repeat;
          opacity: 0.08;
          pointer-events: none;
        }

        .values-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: end;
          margin-bottom: 64px;
        }

        .values-header-title {
          font-family: var(--font-display);
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 300;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: white;
        }

        .values-header-desc {
          font-size: 17px;
          line-height: 1.8;
          color: rgba(255,255,255,0.75);
          max-width: 480px;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }

        .value-card {
          padding: 40px 32px;
          position: relative;
          border-left: 1px solid rgba(255,255,255,0.12);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .value-card:first-child { border-left: none; }

        .value-card:hover { background: rgba(255,255,255,0.08); }

        .value-card-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 24px;
          transition: all 0.4s ease;
        }

        .value-card:hover .value-card-icon {
          background: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }

        .value-card h4 {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 500;
          color: white;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }

        .value-card p {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.65);
        }

        /* Bridge: Stats + Independence */
        .about-bridge {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 480px;
        }

        .bridge-stats {
          background: #0a1628;
          padding: 80px 64px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .bridge-stats::before {
          content: '';
          position: absolute;
          top: -40%;
          right: -20%;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,181,214,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .bridge-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px 40px;
        }

        .bridge-stat-value {
          font-family: var(--font-display);
          font-size: clamp(40px, 5vw, 60px);
          font-weight: 200;
          color: #00B5D6;
          line-height: 1;
          letter-spacing: -0.04em;
          margin-bottom: 8px;
        }

        .bridge-stat-label {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.02em;
          line-height: 1.4;
        }

        .bridge-independence {
          background: white;
          padding: 80px 64px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }

        .bridge-independence::before {
          content: '';
          position: absolute;
          top: 40px;
          left: 64px;
          width: 48px;
          height: 3px;
          background: #00B5D6;
        }

        .independence-label {
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: 20px;
          padding-top: 24px;
        }

        .independence-title {
          font-family: var(--font-display);
          font-size: clamp(28px, 3vw, 40px);
          font-weight: 300;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--gray-900);
          margin-bottom: 24px;
        }

        .independence-body {
          font-size: 16px;
          line-height: 1.8;
          color: var(--gray-600);
          margin-bottom: 32px;
        }

        .independence-stat-row {
          display: flex;
          gap: 48px;
        }

        .independence-mini-value {
          font-family: var(--font-display);
          font-size: 36px;
          font-weight: 200;
          color: #00B5D6;
          line-height: 1;
          letter-spacing: -0.03em;
        }

        .independence-mini-label {
          font-size: 12px;
          color: var(--gray-500);
          margin-top: 6px;
          letter-spacing: 0.02em;
        }

        /* Recognition bar */
        .recognition-bar {
          background: var(--gray-50);
          padding: 48px 0;
          border-top: 1px solid var(--gray-200);
          border-bottom: 1px solid var(--gray-200);
        }

        .recognition-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 48px;
          flex-wrap: wrap;
        }

        .recognition-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--gray-600);
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
        }

        .recognition-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00B5D6;
          flex-shrink: 0;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .values-header {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .values-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .value-card {
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .value-card:nth-child(odd) { border-left: none; }
          .about-bridge {
            grid-template-columns: 1fr;
          }
          .bridge-stats { padding: 64px 40px; }
          .bridge-independence { padding: 64px 40px; }
          .bridge-independence::before { left: 40px; }
        }

        @media (max-width: 768px) {
          .values-strip { padding: 64px 0 48px; }
          .values-header { margin-bottom: 40px; }
          .values-grid { grid-template-columns: 1fr; }
          .value-card { border-left: none; padding: 28px 24px; }
          .bridge-stats { padding: 48px 24px; }
          .bridge-stats-grid { gap: 32px 24px; }
          .bridge-independence { padding: 48px 24px; }
          .bridge-independence::before { left: 24px; }
          .independence-stat-row { gap: 32px; }
          .recognition-inner { gap: 24px; }
        }
      `}</style>

      {/* ===== WHO WE ARE ===== */}
      <section className="section" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 48, alignItems: 'start' }} className="about-intro-grid">
            <RevealOnScroll>
              <div className="section-label" style={{ marginBottom: 0 }}>WHO WE ARE</div>
            </RevealOnScroll>
            <div>
              <RevealOnScroll>
                <p style={{ fontSize: 22, lineHeight: 1.7, color: 'var(--gray-800)', fontWeight: 400, margin: 0 }}>
                  Cosentus is a full-service practice growth partner and global healthcare revenue cycle management (RCM) company.
                  For more than 25 years, we have helped physician practices, specialty groups, and surgery centers grow revenue,
                  eliminate billing inefficiencies, and scale operations — end-to-end, from patient registration to final payment,
                  with Real + Artificial Intelligence and specialty-trained teams.
                </p>
              </RevealOnScroll>
              <RevealOnScroll delay={0.1}>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--gray-500)', marginTop: 24, margin: '24px 0 0' }}>
                  Built on its R+A approach — Real + Artificial Intelligence — Cosentus combines experienced revenue cycle
                  professionals with specialised AI agents to help healthcare organisations manage administrative complexity
                  more efficiently and improve operational efficiency and financial performance.
                </p>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALUES + STATS + INDEPENDENCE — Connected Mega Section ===== */}
      <div className="about-values-mega">
        {/* Values on teal */}
        <div className="values-strip">
          <div className="container">
            <div className="values-header">
              <RevealOnScroll>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>OUR VALUES</div>
                  <h2 className="values-header-title">What We Believe</h2>
                </div>
              </RevealOnScroll>
              <RevealOnScroll delay={0.15}>
                <p className="values-header-desc">
                  Four principles guide every decision we make — from how we build teams to how we recover revenue for the practices we serve.
                </p>
              </RevealOnScroll>
            </div>

            {/* Desktop values */}
            <div className="values-grid advantages-desktop">
              {beliefs.map((b, i) => (
                <RevealOnScroll key={i} delay={i * 0.1}>
                  <div className="value-card">
                    <div className="value-card-icon">{b.icon}</div>
                    <h4>{b.title}</h4>
                    <p>{b.desc}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>

            {/* Mobile values */}
            <div className="advantages-mobile" style={{ marginTop: 32 }}>
              <MobileCarousel autoScrollInterval={4000}>
                {beliefs.map((b, i) => (
                  <div key={i} style={{ padding: '32px 24px', background: 'rgba(255,255,255,0.08)', borderRadius: 12 }}>
                    <div className="value-card-icon">{b.icon}</div>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'white', marginBottom: 12 }}>{b.title}</h4>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)' }}>{b.desc}</p>
                  </div>
                ))}
              </MobileCarousel>
            </div>
          </div>
        </div>

        {/* Bridge: Stats (dark) + Independence (white) side by side */}
        <div className="about-bridge">
          <div className="bridge-stats">
            <div className="bridge-stats-grid">
              {companyStats.map((stat, i) => (
                <RevealOnScroll key={i} delay={i * 0.12}>
                  <div>
                    <div className="bridge-stat-value">{stat.value}</div>
                    <div className="bridge-stat-label">{stat.label}</div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          <div className="bridge-independence">
            <RevealOnScroll direction="right">
              <div className="independence-label">INDEPENDENCE</div>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.1}>
              <h2 className="independence-title">Why Independent Matters</h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <p className="independence-body">
                Cosentus is privately and independently owned. We make long-term decisions for client outcomes,
                not quarterly investor returns. No PE pressure. No shortcuts. Just a 25-year focus on doing right
                by the practices we serve.
              </p>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.3}>
              <div className="independence-stat-row">
                <div>
                  <div className="independence-mini-value">80%</div>
                  <div className="independence-mini-label">Founding team still here</div>
                </div>
                <div>
                  <div className="independence-mini-value">99%</div>
                  <div className="independence-mini-label">Customer retention rate</div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>

        {/* Recognition bar */}
        <div className="recognition-bar">
          <div className="container">
            <RevealOnScroll>
              <div className="recognition-inner">
                {['SOC 2', 'HIPAA Compliant', 'HBMA Member', 'Inc. 5000 — Four Consecutive Years', 'Great Place to Work — Three Consecutive Years'].map((badge, i) => (
                  <div key={i} className="recognition-item">
                    <div className="recognition-dot" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>

      {/* ===== LEADERSHIP ===== */}
      <section className="section section-alt" id="leadership">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">OUR TEAM</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Executive Leadership</div>
          </RevealOnScroll>

          <div className="leadership-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 20,
            marginTop: 48,
          }}>
            {leadership.map((person, i) => (
              <RevealOnScroll key={i}>
                <div
                  data-name={person.name.toLowerCase()}
                  onClick={() => setSelectedPerson(person)}
                  style={{
                    background: 'var(--white)',
                    borderRadius: 12,
                    border: '1px solid var(--gray-200)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    height: '100%',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
                >
                  <div style={{ width: '100%', aspectRatio: '1', background: '#f0f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {person.photo ? (
                      <img src={person.photo} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
                    ) : (
                      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 28, fontWeight: 600 }}>
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{person.name}</h4>
                    <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>{person.title}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {/* Bio Modal */}
          {selectedPerson && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', padding: 20 }} onClick={() => setSelectedPerson(null)}>
              <div style={{ background: 'white', borderRadius: 16, border: '2px solid #00B5D6', maxWidth: 520, width: '100%', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelectedPerson(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'var(--gray-100)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, zIndex: 1 }} aria-label="Close bio">✕</button>
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

      {/* ===== OFFICES ===== */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">OUR OFFICES</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Where We Are</div>
          </RevealOnScroll>
          <div className="offices-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 36 }}>
            {offices.map((office, i) => (
              <RevealOnScroll key={i}>
                <a href={office.maps} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '24px', background: 'var(--white)', color: 'var(--gray-700)', borderRadius: 12, border: '1px solid var(--gray-200)', textDecoration: 'none', transition: 'all 0.3s ease', height: '100%' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 8px 24px rgba(0,181,214,0.2)'; el.style.background = '#00B5D6'; el.style.color = 'white'; el.style.borderColor = '#00B5D6' }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.background = 'var(--white)'; el.style.color = 'var(--gray-700)'; el.style.borderColor = 'var(--gray-200)' }}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{office.city}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7, marginBottom: 12 }}>{office.label}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.85, marginBottom: 8 }}>{office.address}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{office.phone}</div>
                  <div style={{ fontSize: 12, marginTop: 12, opacity: 0.6 }}>View on Maps →</div>
                </a>
              </RevealOnScroll>
            ))}
          </div>
          <div className="offices-mobile" style={{ marginTop: 24 }}>
            <MobileCarousel autoScrollInterval={4000}>
              {offices.map((office, i) => (
                <a key={i} href={office.maps} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '24px', background: 'var(--white)', color: 'var(--gray-700)', borderRadius: 12, border: '1px solid var(--gray-200)', textDecoration: 'none' }}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{office.city}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7, marginBottom: 12 }}>{office.label}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.85, marginBottom: 8 }}>{office.address}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{office.phone}</div>
                  <div style={{ fontSize: 12, marginTop: 12, opacity: 0.6 }}>View on Maps →</div>
                </a>
              ))}
            </MobileCarousel>
          </div>
        </div>
      </section>
    </>
  )
}
