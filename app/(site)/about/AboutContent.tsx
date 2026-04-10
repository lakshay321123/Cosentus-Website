'use client'

import { useState } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

const beliefs = [
  { title: 'Customers First', desc: 'We measure success by the revenue gains we deliver for practices, not vanity metrics.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg> },
  { title: 'Transparency', desc: 'Real-time dashboards, weekly reviews, and same-day reporting. No waiting. No guessing.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { title: 'Accountability', desc: 'We own outcomes end-to-end. Issues get root-cause analysis and immediate fixes.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg> },
  { title: 'Specialty Focus', desc: 'Teams organized by specialty. They know every payer nuance and clinical detail — reducing denials and accelerating cash flow.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg> },
]

const companyStats = [
  { value: '25+', label: 'Years RCM Expertise' },
  { value: 'R+A', label: 'Real + Artificial Intelligence' },
  { value: '99%', label: 'Customer Retention' },
  { value: '30%', label: 'Up to Revenue Growth' },
]

const leadership = [
  { name: 'GS Bhalla', title: 'Chief Executive Officer', photo: '/images/3-GS.jpg', bio: 'GS is our founder and serves as Chairman and CEO of the Cosentus group. His mission is to lead a team of global professionals that are focused on building the world\'s premiere business services organization. GS is a consummate entrepreneur and understands the challenges of growing a business and scaling it profitably without losing sight of its great asset, its people and culture. Having started Cosentus over 20 years ago, he has found an innovative approach to optimizing value for our customers. His dedication to his employees is proven as Cosentus still has more than 80% of its founding employees still working with the company! GS and Manisha live in sunny Orange County, CA with their two children Jas and Tej and three dogs Eeevee, Milo and Percy. They love to travel and learn about people and new cultures. GS is an avid golfer, scotch connoisseur, watch enthusiast and a member of YPO and the HBS Alumni association.' },
  { name: 'JR Thompson', title: 'Sr. VP & Chief Operating Officer', photo: '/images/JR THOMPSON.jpg', bio: 'J.R. Thompson brings more than 37 years of healthcare management experience to Cosentus. For over 14 years, he was an equity partner at abeo Management Corporation, where he held key leadership positions including President of Provider Services, Chief Marketing Officer, and Senior Vice President for the Texas, California, and Mountain Operating Divisions. Before abeo, he spent 7 years as Chief Operating Officer at Third Party Solutions (TPS), a $500 million medical billing and practice management company providing Revenue Cycle Management services to Walmart, CVS, Rite Aid, Safeway, Kroger, and other national retail pharmacy chains. Earlier in his career, he was an equity partner and Executive Vice President at Apollo Enterprises/The Potomac Group, a sponsor-backed medical billing services firm. Mr. Thompson holds a bachelor\'s degree from Brigham Young University and a master\'s degree in Engineering from Central Missouri State University. Residing in the Provo, Utah area with his wife Gail, J.R. continues to enjoy the beauty of the Rocky Mountains. Together, they are proud parents of three children and grandparents to ten. Family remains at the center of their lives—whether it\'s supporting grandchildren in baseball, football, basketball, jiu jitsu, archery, cheer, or dance. When not with family, J.R. and Gail love exploring Utah\'s rugged landscapes, often off-roading in the Wasatch National Park and beyond.' },
  { name: 'Manisha Bhalla', title: 'Chief People Officer', photo: '/images/1Manisha.jpg', bio: 'The Bhalla\'s are a family of 7. GS, Manisha, 2 two-legged and 3 four-legged children. As the Executive Director of Cosentus, she loves the entire team and looks forward to seeing everyone every day — and we all look forward to her around-the-office morning greetings and warm, balancing presence! (She\'s also GS\'s boss!!) With Cosentus since Day One, she loves giving back to the community, family, and friends without any expectation of a return. In her free time, she loves to read, watch Downton Abbey (her latest obsession!) and take long walks/hikes. Her favorite shows include Bones, Friends, Schitts Creek, and Downton Abbey, of course!' },
  { name: 'Viktor Alvarado', title: 'Chief Financial Officer', photo: '/images/Viktor-Alvarado.jpg', bio: 'Joined Cosentus in October 2024. Over 25 years of experience in Corporate Finance and Controlling, with expertise in structuring the Finance function to enable high growth. Started his journey in different financial roles at Dana Corporation, moving in 2001 to Brenntag, the Global Chemical distribution leader. At Brenntag he held positions of increasing responsibility from Finance Director (CFO) Mexico culminating with Vice President of Controlling (FP&A) — Global Material Science. In these positions he was instrumental on executing growth plans that included redesigning country logistic footprints to M&A projects. Viktor holds an Accounting degree and MBA\'s from both Mexico and Spain. He\'s married to his wife of 15 years Gaby and together they have Viktor, who is twelve years old and eight-year-old Valeria. They enjoy traveling to get to know new places and cultures together.' },
  { name: 'Stephen Williamson', title: 'Chief Growth Officer', photo: '/images/Stephen Williamson.jpg', bio: 'Stephen Williamson has spent over 30 years building relationships in healthcare — the kind that actually last. As Chief Growth Officer, he leads with radical candor and full transparency and brings the same directness to the teams he builds and mentors across Sales and Marketing. Ask anyone who\'s worked with him, and they\'ll tell you: Stephen shows up for his partners the same way he shows up in the rest of his life — fully. He\'s a former skydiving business owner, a certified gemologist, a licensed pilot, and a scuba diver. Play a round of golf with him or ask his sons about their hunting trips, and you\'ll quickly realize the running game in his circle is \'what hasn\'t Stephen done?\' At home, he and his wife Karen make the most of every chance to travel. At work, he\'s focused on growing something worth being proud of.' },
  { name: 'Allen Ranjan', title: 'Chief Revenue Officer', photo: '/images/ALLEN RANJAN.jpg', bio: 'Allen has spent years absorbing any and all information he can in all aspects of revenue cycle management. We have coined him \'The Encyclopedia\'. Allen is not only a whiz at the operation and relational portion of our business, as our Chief Revenue Officer he has also mastered business development and analytics to become the full package. Allen has been with Cosentus since our company was founded, and is truly devoted to what he does and the clients and employees that he serves. With his wife Pragya, Allen has a beautiful little girl named Aaradhya who is seven that likes to peek in on her dad and provide him smiles while he works, and he somehow always has time for a chat, a smile, and a joke.' },
  { name: 'Andrew Clougherty', title: 'Sr. Director of Client Services', photo: '/images/Andrew-Clougherty.jpg', bio: 'Andrew has 14 years of experience in the RCM and Medical Billing fields. Starting as a client services liaison for a DME company in the Northeast, Andrew moved after 3 years to join AllianceMed in Phoenix, AZ serving as the Director of Client Relations for 10+ years. He managed relationships with all clients ensuring overall client satisfaction. After a merger with Cosentus in 2023, Andrew assumed the title of Senior Director of RCM Services and began managing operations and client services for three separate offices in Phoenix, AZ, Napa, CA and Salt Lake City, UT. Andrew holds a BA degree in History and German from Saint Anselm College in NH and a M.Ed from the University of New Hampshire.' },
  { name: 'David Langsam', title: 'Board Advisor', photo: '/images/david-langsam.jpg', bio: 'David is an Executive Advisor with Cosentus and a growth-oriented CEO with extensive experience leading PE-backed, tech-enabled healthcare services companies. He has driven strategic direction, executed growth and acquisition strategies, improved financial performance, and worked closely with large enterprise clients. His background includes sourcing and integrating acquisitions, building scalable go-to-market strategies, and leading the development of proprietary technologies that improve automation and workforce productivity. David has also secured debt and equity capital to support expansion and established global operating centers outside the U.S. In addition to his operating leadership, David serves or has served on several professional, nonprofit, and community boards, including EvAl Home Care Solutions (Executive Chairman), MB Global Partners, First Children\'s Services, Water Street Healthcare Partners, and the Glencoe Educational Foundation.' },
  { name: 'Tom Scott', title: 'Sr. Advisor | Corporate Growth & M&A', photo: '/images/tom-scott.webp', bio: 'Senior Advisor for Corporate Growth and M&A at Cosentus. MBA, CPE, and AIE with extensive experience in entrepreneurial leadership, financial management, and business development. Founder of Moon Rock Media Group, guiding companies at the intersection of AI and CRM. Previously served as Managing Director at PermaPlate and Senior VP of Business Development at AmTrust Financial/Warrantech.' },
  { name: 'John Nulty', title: 'Sr. Advisor', photo: '/images/john-nulty.jpg', bio: 'Senior Advisor at Cosentus bringing deep expertise in healthcare revenue cycle sales, marketing, and business development. Duke University graduate with extensive experience in the RCM industry, previously with Meduit. Provides strategic advisory on growth initiatives and market expansion.' },
  { name: 'Raja Inder Bhalla', title: 'Managing Director', photo: '/images/Inder.jpg', bio: 'Meet our co-founder of Cosentus, a well-rounded leader. Being from a Finance and International Business background, Raja brings expertise in business operations and an intricate understanding of the ever-changing nature of the service industry. Enjoying the fast-paced nature of Cosentus, he leads our dedicated operations support team in New Delhi, and helps clients and employees with winning solutions. Raja and his wife Ashmeen have two children, a daughter Taarini and a son named Jeev. Want to meet an adventurous family? Meet the Bhalla\'s who enjoy golfing, skiing, riding motorcycles, and traveling.' },
  { name: 'Ashwin Pajpal', title: 'Global Brand Director', photo: '/images/Ashwin.jpg', bio: 'Ashwin is the creative voice guiding everything that we do. With an Art and English Honors Degree, Ashwin found his calling in advertising. He graduated from College of Art, New Delhi, India and has since worked for some of the world\'s top network agencies in India, South-Asia and the Middle East and became Youngest Creative Director in India. Over the past two decades he has had the privilege to work with prominent worldwide brands like: Hyundai Motors, Hero Motors, Nestle Asia, Glaxo Smith Klein (Belgium), Osteoporosis Foundation New York, World Health Organization, and many other prestigious companies. When not at work, Ashwin enjoys walking on the beach, and going cycling. He loves new art installations — and enjoying the best coffee in the world in Dubai where he calls home.' },
  { name: 'Wayne Wertz', title: 'Sr. Director of HR & Corporate Operations', photo: '/images/Wayne.jpg', bio: 'Wayne lives in sunny, southern Orange County, CA with his wife, three children and numerous four-legged, fur babies. A proud graduate of the Pennsylvania State University (WE ARE!), he has over 25 years in the medical services industry in the areas of HR, operations, and facilities management. His passions include golf, billiards, playing music and traveling.' },
  { name: 'Ajay Kumar', title: 'Chief Operating Officer - RCM', photo: '/images/AJAY KUMAR.jpg', bio: 'Ajay is the Head of Operations for our Cosentus Operations Support Division. He has been with Cosentus for over 20 years, in fact, he is the first employee that GS ever hired at Cosentus! This speaks to Ajay\'s loyalty, and dedication that he has for our company. Ajay is analytical and has immense knowledge of operating systems and their various workflows. This is incredibly important for the multi-specialties he oversees. Ajay and his wife Surekha are proud parents of two wonderful daughters Ankita and Akshita. They enjoy spending time together as a family and listening to classical music.' },
  { name: 'Aman Bhasin', title: 'Sr. VP & Head of Global Operations (Non-US)', photo: '/images/AMAN BHASIN.jpg', bio: 'Aman brings with him over 20 years of management experience in the BPO industry. He has led global diverse teams of over 5,000 people across India, Philippines, Americas, United Kingdom, Mexico, and Guatemala \u2013 in the areas of Collections / A/R, IT Help Desk, Data, and Advanced Analytics, F&A, Digital and Transformation change management from a Customer 360 / Experience perspective. Married for 24 years with twin boys and based out of the Delhi NCR area in India. Outside of work, he\'s an avid traveler with a fondness for beaches!' },
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
      {/* About Description */}
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

      {/* What We Believe */}
      <section style={{
        background: 'linear-gradient(135deg, #003545 0%, #005A6E 40%, #00B5D6 100%)',
        padding: '100px 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -120, right: -80, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)' }} />

        <div className="container">
          <RevealOnScroll>
            <div style={{ fontSize: 12, fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#68D1E6', marginBottom: 16 }}>OUR VALUES</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.1, color: 'white', marginBottom: 16, letterSpacing: '-0.02em' }}>What We Believe</h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.15}>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)', maxWidth: 560, marginBottom: 56 }}>
              The principles that guide every decision we make for our clients, our team, and our company.
            </p>
          </RevealOnScroll>

          {/* Desktop */}
          <div className="advantages-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {beliefs.map((b, i) => (
              <RevealOnScroll key={i} direction="scale" delay={0.2 + i * 0.12}>
                <div style={{
                  background: 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 16,
                  padding: '36px 28px',
                  height: '100%',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'default',
                }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'rgba(255,255,255,0.14)'; el.style.transform = 'translateY(-6px)'; el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3)' }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'rgba(255,255,255,0.07)'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none' }}
                >
                  <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: 'rgba(0,181,214,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 24, color: '#68D1E6',
                  }}>{b.icon}</div>
                  <h4 style={{ fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 10, fontFamily: 'var(--font-display)' }}>{b.title}</h4>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)', margin: 0 }}>{b.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          {/* Mobile */}
          <div className="advantages-mobile" style={{ marginTop: 32 }}>
            <MobileCarousel autoScrollInterval={4000}>
              {beliefs.map((b, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 16, padding: '36px 28px',
                }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(0,181,214,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: '#68D1E6' }}>{b.icon}</div>
                  <h4 style={{ fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 10 }}>{b.title}</h4>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)', margin: 0 }}>{b.desc}</p>
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

      {/* Why Independent Matters */}
      <section style={{
        background: '#00B5D6',
        padding: '100px 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative large text watermark */}
        <div style={{ position: 'absolute', top: '50%', right: -40, transform: 'translateY(-50%)', fontSize: 'clamp(180px, 22vw, 320px)', fontWeight: 800, fontStyle: 'italic', color: 'rgba(255,255,255,0.04)', fontFamily: 'var(--font-display)', lineHeight: 0.9, pointerEvents: 'none', whiteSpace: 'nowrap' as const }}>
          OWN&shy;ED
        </div>

        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="about-intro-grid">
            <div>
              <RevealOnScroll>
                <div style={{ fontSize: 12, fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>INDEPENDENCE</div>
              </RevealOnScroll>
              <RevealOnScroll delay={0.1}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.1, color: 'white', marginBottom: 24, letterSpacing: '-0.02em' }}>
                  Why Independent<br />Matters
                </h2>
              </RevealOnScroll>
              <RevealOnScroll delay={0.2}>
                <p style={{ fontSize: 17, lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', maxWidth: 520, marginBottom: 0 }}>
                  Cosentus is privately and independently owned. We make long-term decisions for client outcomes,
                  not quarterly investor returns. No PE pressure. No shortcuts. Just partnership built to last.
                </p>
              </RevealOnScroll>
            </div>

            <div>
              <RevealOnScroll delay={0.15}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: 16, padding: '32px 24px', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <div style={{ fontSize: 'clamp(40px, 5vw, 56px)', fontWeight: 300, color: 'white', fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: 8 }}>80%</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Founding team still with the company</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: 16, padding: '32px 24px', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <div style={{ fontSize: 'clamp(40px, 5vw, 56px)', fontWeight: 300, color: 'white', fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: 8 }}>25+</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Years of consistent, stable leadership</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: 16, padding: '32px 24px', border: '1px solid rgba(255,255,255,0.15)', gridColumn: 'span 2' }}>
                    <div style={{ fontSize: 'clamp(40px, 5vw, 56px)', fontWeight: 300, color: 'white', fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: 8 }}>99%</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Customer retention — built on trust, not contracts</div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
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

      {/* Offices */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">OUR OFFICES</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Where We Are</div>
          </RevealOnScroll>
          {/* Desktop */}
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
          {/* Mobile */}
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
