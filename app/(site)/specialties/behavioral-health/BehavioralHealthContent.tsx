'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import TeamCircleGrid from '@/components/ui/TeamCircleGrid'
import SpecialtyMarquee, { type SpecialtySolution } from '@/components/sections/SpecialtyMarquee'

// "What Sets Us Apart" cards per Specialty Pages doc (v1, May
// 19 2026), section 5 "Behavioral Health". 3 cards verbatim
// from doc.
const advantages = [
  {
    // Focused-target — "behavioral health is all we do"
    icon: <svg viewBox="0 0 744.18 763.3" className="apart-svg apart-bh-faces" aria-hidden="true">
        <g className="face face-1">
          <path fill="#00B5D6" d="M470.29 629.21c45.44,13.2 68.01,-25.2 51.97,-71.7 -6.24,-19.2 -5.06,-22.51 7.42,-35.69 14.25,-17.4 -30.89,-18.3 -35.34,-35.11 31.48,4.2 52.27,-7.5 49.01,-16.49 -7.13,-20.1 -26.73,-33.3 -5.65,-42.31 23.76,-9.9 51.38,-8.1 20.5,-53.39 -73.06,-110.09 -10.39,-165.88 -82.57,-270.27 -104.25,-151.5 -395.91,-138.29 -457.09,42.59 -41.88,123.59 -4.45,201.29 30,313.18 26.13,83.69 46.33,197.68 26.43,303.28 115.83,0 168.4,0 284.23,0 -4.16,-20.1 -2.97,-97.5 5.95,-122.39 12.18,-35.11 70.97,-21.3 105.14,-11.7z"/>
        </g>
        <g className="face face-2">
          <path fill="#00B5D6" d="M709.97 427.91c23.76,-9.9 51.38,-8.1 20.49,-53.39 -73.06,-110.09 -10.39,-165.88 -82.27,-270.27 -59.38,-86.02 -178.94,-118.95 -282.63,-98.25 48.28,17.68 91.49,47.66 121.12,90.63 16.03,23.25 28.12,47.78 34.94,75.25 5.35,21.53 6.83,42.67 8.16,64.7 1.24,20.67 2.65,40.64 7.68,60.83 6.3,25.3 17.43,48.03 31.89,69.65 10.38,15.52 24.48,39.77 8.73,56.65 -8.95,9.6 -23.52,11.66 -35.18,16.58 -0.09,0.04 -0.19,0.08 -0.29,0.12 1.15,2.26 2.91,5.03 3.65,6.26 3.74,6.18 7.27,12.2 9.71,19.04 5.1,14.27 -7.13,25.32 -19.1,30.16 -0.87,0.35 -1.74,0.68 -2.63,0.99 3.13,2.02 5.98,4.45 8.1,7.56 5.82,8.51 4.02,18.21 -2.29,25.91l-0.31 0.37 -0.33 0.35c-1.43,1.51 -6.92,7.18 -7.38,9.26 -0.53,2.4 2.13,10.48 2.93,12.94 7.68,22.35 9.29,49.57 -4.53,69.96 -14.72,21.72 -39.95,25.75 -63.87,18.9 -18.34,-5.25 -79.71,-22.54 -88.78,3.25 -2.48,7.05 -3.68,16.51 -4.55,23.92 -1.36,11.63 -2.1,23.42 -2.53,35.12 -0.42,11.43 -0.53,22.94 -0.18,34.38 0.21,6.72 0.43,15.21 1.79,21.79l0.56 2.72 158.84 0c-4.14,-20.1 -2.96,-97.5 5.65,-122.39 12.48,-35.11 71.29,-21.3 105.14,-11.7 45.44,13.2 68.01,-25.2 52.28,-71.7 -6.53,-19.2 -5.35,-22.51 7.13,-35.69 13.37,-25.8 -44.26,-9.9 -67.71,1.2 0.59,-36.3 86.13,-31.51 81.37,-52.79 -4.75,-21 -26.73,-33.3 -5.63,-42.31z"/>
        </g>
      </svg>,
    t: 'Behavioral Health Is All Our Team Does',
    d: 'Our team understands the difference between a 90837 and a 90834 and why it matters for your revenue. IOP vs PHP billing rules, telehealth modifiers that change by payer, crisis intervention codes. This is all they do.',
  },
  {
    // Shield-with-checkmark — "prevent denials"
    icon: <svg viewBox="0 0 675.68 961.68" className="apart-svg" aria-hidden="true">
        <path fill="#00B5D6" d="M56.25 156.98l0 0c31.07,0 56.25,25.18 56.25,56.25l0 216.18c0,3.99 3.24,7.23 7.23,7.23l0 0c4,0 7.24,-3.24 7.24,-7.23l0 -304.32c0,-31.07 25.18,-56.25 56.25,-56.25l0 0c31.06,0 56.25,25.18 56.25,56.25l0 304.31c0,3.99 3.24,7.23 7.23,7.23l0 0c4,0 7.23,-3.24 7.23,-7.23l0 -373.15c0,-31.07 25.19,-56.25 56.25,-56.25l0 -0c31.06,0 56.25,25.19 56.25,56.25l0 373.15c0,3.99 3.24,7.23 7.23,7.23l0 0c3.99,0 7.23,-3.24 7.23,-7.23l0 -317.71c0,-31.07 25.18,-56.25 56.25,-56.25l0 0c31.07,0 56.25,25.19 56.25,56.25l0 324.94 0 87.59 0 71.16 76.55 -141.1c14.81,-27.31 48.96,-37.44 76.27,-22.63l0 0c27.31,14.81 37.44,48.96 22.63,76.27l-127.04 294.38c-11.49,26.62 -26.42,51.68 -44.89,74.03 -62.58,75.73 -132.33,85.61 -243.22,85.34 -0.63,0 -1.26,0 -1.88,0l-10.75 0c-133.15,0 -241.09,-107.94 -241.09,-241.09l0 -94.83 0 -189.12 0 -223.41c0,-31.07 25.19,-56.25 56.25,-56.25zm214.74 345.94c-82.8,0 -149.93,67.13 -149.93,149.93 0,82.8 67.13,149.93 149.93,149.93 82.8,0 149.93,-67.13 149.93,-149.93 0,-82.8 -67.13,-149.93 -149.93,-149.93zm0 29.57c-66.47,0 -120.36,53.89 -120.36,120.36 0,66.47 53.89,120.36 120.36,120.36 66.47,0 120.36,-53.89 120.36,-120.36 0,-66.47 -53.89,-120.36 -120.36,-120.36zm-72.42 64.51l54.92 54.92 -54.92 54.92 18.57 18.57 54.92 -54.92 54.92 54.92 18.57 -18.57 -54.92 -54.92 54.92 -54.92 -18.56 -18.56 -54.92 54.92 -54.92 -54.92 -18.56 18.56z"/>
      </svg>,
    t: 'We Don\u2019t Just Recover Denials. We Prevent Them',
    d: 'Every denied claim gets a root cause review. Authorization expirations, time-based coding errors, telehealth modifier mismatches. We identify the root cause and correct it so it doesn\u2019t happen again.',
  },
  {
    // Trending-up arrow — "we grow with you"
    icon: <svg viewBox="0 0 6789.16 7929.78" className="apart-svg" aria-hidden="true">
        <path fill="#00B5D6" d="M5947.46 2078.83l316.43 222.21c299.86,210.52 375.52,8.59 361.63,-199.74l7.39 -1717.8c1.24,-282.85 -222.5,-451.11 -492.61,-357.46l-1628.01 564.46c-201.64,54.25 -368.2,191.18 -71.99,406.81l312.6 227.51c-83.99,383.39 -646.48,1390.86 -1287.84,1863.02 -1166.67,858.87 -2803.1,1427.63 -3163.88,1461.29 -317.53,29.6 -432.09,184.47 -105.39,237.96 2762.15,107.26 4965.52,-1094.96 5751.67,-2708.23zm-5668.54 3490.07l1373.34 0c142.92,0 259.85,116.94 259.85,259.85l0 1841.18c0,142.91 -116.94,259.85 -259.85,259.85l-1373.34 0c-142.91,0 -259.85,-116.92 -259.85,-259.85l0 -1841.18c0,-142.92 116.92,-259.85 259.85,-259.85zm2439.64 -760.76l1373.34 0c142.92,0 259.85,116.94 259.85,259.85l0 2601.94c0,142.91 -116.94,259.85 -259.85,259.85l-1373.34 0c-142.91,0 -259.85,-116.92 -259.85,-259.85l0 -2601.94c0,-142.92 116.92,-259.85 259.85,-259.85zm2437.38 -1191.91l1373.34 0c142.92,0 262,116.97 259.85,259.85l-57.19 3793.85c-2.15,142.88 -116.95,259.85 -259.85,259.85l-1373.34 0c-142.9,0 -262.01,-116.94 -259.85,-259.85l57.19 -3793.85c2.16,-142.91 116.92,-259.85 259.85,-259.85z"/>
      </svg>,
    t: 'We Grow With You',
    d: 'From a single-location therapy practice to a multi-site behavioral health organization. Our model scales. One of our clients grew from $2M to $16M revenue. We managed the billing the whole way.',
  },
]

// Leadership team per doc — 8 named people with photos already
// on disk. Same structure as Anesthesia.
const leaders = [
  { name: 'JR Thompson', title: 'Chief Operating Officer', photo: '/images/JR THOMPSON.jpg' },
  { name: 'Andrew Clougherty', title: 'Sr. Director of Client Services', photo: '/images/Andrew-Clougherty.jpg' },
  { name: 'Caty Harding', title: 'Account Manager', photo: '/images/Caty-Harding-2.webp' },
  { name: 'Toni Brown', title: 'Senior Account Manager', photo: '/images/Toni-Brown-1.webp' },
  { name: 'Amber Alvelo', title: 'Division Manager', photo: '/images/Amber-Alvelo.webp' },
  { name: 'Peter Ranjan', title: 'AR Manager', photo: '/images/Peter-Ranjan.webp' },
  { name: 'Julie DelBlasio', title: 'Lead Reimbursement Specialist', photo: '/images/Julie-DeBlasio.webp' },
  { name: 'Steven Sundrud', title: 'Division Manager, IT Division', photo: '/images/Steven-Symed.webp' },
]

// Testimonials.
// Both testimonials carry the same speaker attributions as the
// doc (Aubrie Mastrangelo + Sujan Vatturi). Quote wording uses
// the existing live-site phrasing rather than the doc verbatim
// because the doc has clear AI-paraphrase artifacts:
//   - doc: "ahead of time solving problems" / "simplifying
//     processes" -> live: "proactively solving problems" /
//     "streamlining processes"
//   - doc: "Cosentus make sures" / "put in place" / "simplify
//     billing" -> live: "Cosentus ensures" / "implement" /
//     "streamline billing"
// The live wording reads as natural English and is more
// publishable. Easy to flip to doc verbatim if explicitly
// directed.
const testimonials = [
  {
    tag: 'Behavioral Health',
    quote: 'Cosentus has brought our behavioral health claims up to date, ensured consistent county invoicing, and provided invaluable expertise with a professional, responsive team that truly understands our needs.',
    name: 'Lawrence Harlan',
    role: 'Associate Director of Finance - AACI',
  },
  {
    tag: 'Behavioral Health',
    quote: 'Partnering with Cosentus has streamlined our claims operations, simplified billing submissions, and provided detailed reports. Their team is consistently responsive, helpful, and quick to address our needs.',
    name: 'Jasmin Correa',
    role: 'Director of Data Management - Community HealthWorks',
  },
  {
    tag: 'Behavioral Health',
    quote: 'I\u2019ve never been as satisfied with a medical biller as I am with Cosentus. They\u2019re prompt, efficient, transparent, responsive, and reasonably priced. I confidently recommend them to my colleagues!',
    name: 'Larry Feliciano',
    role: 'MD DABFM FAAP CMD HMDC',
  },
  {
    tag: 'Behavioral Health',
    quote: 'Our experience with Cosentus has been that they are very responsive to the needs of their clients, provide custom reporting to navigate challenges, and make strategic decisions in a true partnership.',
    name: 'Anna Fernandez',
    role: 'Executive Director, Behavioral Health - Hope Services Counseling Center',
  },
  {
    tag: 'Behavioral Health',
    quote: 'Cosentus has been a game-changer for my practice. Their team is incredibly responsive, proactive, and thorough. I trust them completely with my billing and highly recommend their services.',
    name: 'Dr Ogochukwu Nwosu',
    role: 'CEO - K2 Healthcare',
  },
  {
    tag: 'Behavioral Health',
    quote: 'Cosentus has always been in our corner, offering knowledge, support, and training to handle billing situations. They understand our business and provide the best solutions for our Revenue Cycle department.',
    name: 'Pastor Jason McMullan',
    role: 'Executive Director - PneumaCare Health & Wellness',
  },
  {
    tag: 'Behavioral Health',
    quote: 'Our partnership with Cosentus helps us manage medical billing and revenue, allowing us to focus on patient care and practice growth. We have worked with them for years and consistently appreciate their excellent service.',
    name: 'Sherry Do',
    role: 'Director of Patient Care Services - ProActive Clinic',
  },
  {
    tag: 'Behavioral Health',
    quote: 'Cosentus has been assisting my skilled nursing clinic with the RCM services needed to help us thrive. They allow us to focus on patient care. We appreciate their support, communication, and partnership.',
    name: 'Dr Gurpreet Dhugga',
    role: 'CEO - SNF Specialists',
  },
]

// "RCM Solutions: Complete Behavioral Health Revenue Cycle" — 8
// cards per Specialty Pages doc (v1, May 19 2026). Content
// verbatim from doc.
//
// Note vs. Anesthesia/Orthopedics: like Pain Management and
// ASC, the doc omits an "AR Follow-Up & Collections" Chris
// card on Behavioral Health. Only Cindy appears (Card 7).
//
// Card 1 modifier labels are real outpatient mental health CPTs:
//   90834 = 45-min individual psychotherapy
//   90837 = 60-min individual psychotherapy
//   90791 = psychiatric diagnostic evaluation
//   90832 = 30-min individual psychotherapy
//   90838 = 60-min individual + E/M add-on
//   90847 = family psychotherapy with patient
// (Doc Card 1 specifically calls out "90834 vs 90837" as the
// distinction that trips up generic billers.)
//
// Card 2 uses 'meds' (capsule pills) — fits "Medication
// Management" directly. Card 4 uses the bespoke 'telehealth'
// animation (monitor + play triangle + pulsing live dot) —
// earlier draft used 'badges' (3 floating ticks) which preview
// feedback said didn't connect to telehealth. Card 6 uses
// 'badges' (3 check circles) — the doc itself lists exactly
// three categories on this card ("crisis interventions,
// prolonged services, and behavioral health add-on codes"),
// so 3 ticks reads as "all three captured". Earlier draft used
// 'pulse' which preview feedback flagged as wrong-fit
// (phone+rings reads as "call", not crisis code capture).
const solutions: SpecialtySolution[] = [
  {
    eyebrow: 'TIME-BASED CODING',
    title: 'Therapy Session Coding',
    description: 'Correct time thresholds and add-on codes for individual, group, and family therapy. 90834 vs 90837 handled accurately every time.',
    anim: 'modifiers',
    modifierLabels: ['90834', '90837', '90791', '90832', '90838', '90847'],
  },
  {
    eyebrow: 'MEDICATION MANAGEMENT',
    title: 'Psychiatric & Medication Management',
    description: 'Capture both psychiatric and E/M components when clinically appropriate. No missed revenue on dual-service visits.',
    anim: 'meds',
  },
  {
    eyebrow: 'PROGRAM RULES',
    title: 'IOP & PHP Billing',
    description: 'Manage payer-specific bundling and per-diem vs per-service differences. Each payer has its own rules. We track all of them.',
    anim: 'rules',
  },
  {
    eyebrow: 'TELEHEALTH COMPLIANCE',
    title: 'Telehealth Billing',
    description: 'Correct place-of-service codes and modifier usage across payers. Rules change often. Our team stays current.',
    anim: 'telehealth',
  },
  {
    eyebrow: 'AUTHORIZATIONS',
    title: 'Authorization Management',
    description: 'Tracking ahead of time, submission, and follow-up on every authorization. Expirations caught before they become write-offs.',
    anim: 'stamp',
  },
  {
    eyebrow: 'CRISIS INTERVENTION',
    title: 'Crisis & Add-On Services',
    description: 'Accurate capture of crisis interventions, prolonged services, and behavioral health add-on codes.',
    anim: 'badges',
  },
  {
    eyebrow: 'Ai AGENT \u2014 CINDY',
    title: 'Patient Billing & Support',
    description: 'Cindy handles patient balances empathetically in over 50 languages. Behavioral health patients need clear, sensitive communication.',
    anim: 'languages',
    agent: { name: 'Cindy', img: 'cindy.png' },
  },
  {
    eyebrow: 'REAL-TIME INSIGHTS',
    title: 'Analytics & Reporting',
    description: 'Dashboards showing revenue per provider, session type, authorization status, and denial patterns.',
    anim: 'chart',
  },
]

export default function BehavioralHealthContent() {
  return (
    <>
      {/* The Problem / Solution split panel — same inline shape
          as the other specialty pages. Content per Specialty
          Pages doc (v1) section 5 "Behavioral Health". */}
      <section style={{ overflow: 'hidden' }}>
        <div className="problem-solution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 400 }}>
          <div className="ps-panel ps-problem" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: 'var(--white)', position: 'relative' }}>
            <RevealOnScroll direction="left" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 28 }}>
                Complex Sessions. Constant Revenue Leaks.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Time-based CPTs with strict thresholds trip up generic billers who don\u2019t know the difference between a 90834 and a 90837',
                  'Telehealth modifiers vary by payer and change frequently. Yesterday\u2019s correct code could be today\u2019s denial',
                  'IOP/PHP bundling rules create constant underbilling risk when teams don\u2019t know per-diem vs per-service differences',
                  'Authorization expirations silently kill revenue when tracking gaps occur across ongoing treatment plans',
                ].map((bullet, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 18, lineHeight: 1.6, color: 'var(--gray-700)', marginBottom: 18 }}>
                    <span aria-hidden="true" style={{ flexShrink: 0, width: 7, height: 7, borderRadius: '50%', background: '#00B5D6', marginTop: 10 }} />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          </div>

          <div className="ps-panel ps-solution" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: '#00B5D6', position: 'relative', overflow: 'hidden' }}>
            <div className="ps-shimmer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            <RevealOnScroll direction="right" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'white', marginTop: 0, marginBottom: 28 }}>
                Behavioral Health Billing Experts + Ai Tracking
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Dedicated behavioral health team that handles time-based coding, telehealth modifiers, IOP/PHP rules, and crisis codes because that\u2019s all they do',
                  'Ai automates eligibility re-checks, authorization tracking, and follow-ups',
                  'Human experts defend denials with clinical evidence and strategies built for each payer',
                  'Every denial gets a root cause review to fix the pattern, not just the claim',
                ].map((bullet, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.95)', marginBottom: 18 }}>
                    <span aria-hidden="true" style={{ flexShrink: 0, width: 7, height: 7, borderRadius: '50%', background: 'white', marginTop: 10 }} />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          </div>
        </div>
      </section>


      {/* RCM Solutions: Complete Behavioral Health Revenue Cycle.
          Shared SpecialtyMarquee component (grid mode). */}
      <section className="section section-specialty-grid">
        <div className="container">
          <RevealOnScroll><div className="section-title">Complete Behavioral Health Revenue Cycle</div></RevealOnScroll>
        </div>

        <SpecialtyMarquee items={solutions} layout="grid" mobileCarousel />
      </section>


      {/* Client Reviews — shared TestimonialsSection.
          Order (Jun 2026, user direction): directly after the Complete
          Revenue Cycle grid, before What Sets Us Apart and Leadership. */}
      <TestimonialsSection
        testimonials={testimonials}
        label="CLIENT REVIEWS"
        title={<>What Our <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Clients</span> Say.</>}
      />


      {/* What Sets Us Apart — 3 cards per Specialty Pages doc. */}
      <section className="section">
        <div className="container">
          <RevealOnScroll><div className="section-title">What Sets Us Apart</div></RevealOnScroll>

          <div className="advantage-grid advantages-desktop" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 48 }}>
            {advantages.map((a, i) => (
              <RevealOnScroll key={i} direction="scale" delay={0.15 + i * 0.1}>
                <div className="advantage-card">
                  <div className="advantage-icon">{a.icon}</div>
                  <h4>{a.t}</h4>
                  <p>{a.d}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          <div className="advantages-mobile" style={{ marginTop: 32 }}>
            <MobileCarousel autoScrollInterval={4000} showArrows>
              {advantages.map((a, i) => (
                <div key={i} className="advantage-card">
                  <div className="advantage-icon">{a.icon}</div>
                  <h4>{a.t}</h4>
                  <p>{a.d}</p>
                </div>
              ))}
            </MobileCarousel>
          </div>
        </div>
      </section>


      {/* Leadership.
          150+ years combined experience, 8 named people per
          doc. Same TeamCircleGrid pattern as Anesthesia (the
          other specialty page with confirmed leadership). */}
      <section className="section" id="leadership">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">Behavioral Health Leadership</div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 12, marginTop: 16, marginBottom: 48 }}>
              {/* Matches homepage .ra-stat-num per user (Jun 2026):
                  clamp(44-68), 700, -0.02em, font-display. Was
                  clamp(48-72) / 200 / no display font. */}
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 5.5vw, 68px)', fontWeight: 700, color: 'var(--primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>150+</span>
              <span style={{ fontSize: 18, color: 'var(--gray-600)', fontWeight: 300 }}>years combined in behavioral health RCM</span>
            </div>
          </RevealOnScroll>

          <TeamCircleGrid people={leaders} baseDelay={0.1} />
        </div>
      </section>
    </>
  )
}
