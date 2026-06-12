'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'
import AgentSpotlightCard from '@/components/voice/AgentSpotlightCard'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import TeamCircleGrid from '@/components/ui/TeamCircleGrid'
import SpecialtyMarquee, { type SpecialtySolution } from '@/components/sections/SpecialtyMarquee'

// "What Sets Us Apart" cards. Content per the Specialty Pages doc
// (v1, May 19 2026) — section 1 "Anesthesia (Accreda)". Doc spec is
// exactly 3 cards, replacing the previous 6 generic ones (Real+AI,
// Boutique Support, Privately Owned, etc.) that didn't speak to the
// specialty. Icons chosen to thematically reflect each card.
const advantages = [
  {
    // Focused-target icon — "anesthesia is all we do"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></svg>,
    t: 'Anesthesia Is All We Do',
    d: 'Our anesthesia team wakes up doing anesthesia and goes to bed doing anesthesia. They know every payer game, every modifier trap, and every reimbursement nuance specific to your specialty.',
  },
  {
    // Shield-with-checkmark icon — "prevent denials, not just recover"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    t: 'We Don\u2019t Just Recover Denials. We Prevent Them',
    d: 'Every denied claim gets a root cause review. We find out why it happened, fix the process, and make sure that denial category shrinks quarter over quarter.',
  },
  {
    // Clock/experience icon — "23+ years"
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    t: '23+ Years in Anesthesia RCM',
    d: 'This isn\u2019t a new vertical we added to a menu. Accreda was built for anesthesia from day one. 250+ years of combined team experience across every anesthesia subspecialty.',
  },
]

const leaders = [
  { name: 'Logan Lowry', role: 'President', photo: '/images/LOGAN LOWRY.jpg' },
  { name: 'Mark Wines', role: 'Chief Growth Officer', photo: '/images/MARK WINES.jpg' },
  { name: 'JR Thompson', role: 'Sr. VP Chief Operating Officer', photo: '/images/JR THOMPSON.jpg' },
  { name: 'Joseph Demory', role: 'Director Anesthesia Services', photo: '/images/JOSEPH DEMORY.jpg' },
  { name: 'Laurie Allen', role: 'VP Anesthesia Operations', photo: '/images/Laurie Allen.jpg' },
  { name: 'Melissa George', role: 'Sr. RCM Manager', photo: '/images/Melissa George.jpg' },
  { name: 'Evan Sewell', role: 'Director RCM', photo: '/images/Evan Sewell.jpg' },
  { name: 'Liz Hussey', role: 'Credentialing Manager', photo: '/images/Liz Hussey.jpg' },
  { name: 'Maisie Villegas', role: 'Director Quality Improvement', photo: '/images/Maicie.jpg' },
  { name: 'Thomas Wilson', role: 'Regional Director- Anesthesia Services', photo: '/images/Tom Wilson1.jpg' },
]

// Testimonials per Specialty Pages doc (v1, May 19 2026).
const testimonials = [
  {
    tag: 'Anesthesia',
    quote: 'What separates Accreda from other anesthesia billing companies is its dedication to collecting every dollar possible for its clients, along with providing an excellent team of people who are loyal and helpful.',
    name: 'Dr. John B. Field Jr.',
    role: 'Vice President, Anesthesia Associates',
  },
  {
    tag: 'Anesthesia',
    quote: 'Year-over-year collection rate of 97% from commercial payers and 98% overall. I can wholeheartedly recommend Accreda.',
    name: 'Randy Robbins, M.D.',
    role: 'Anesthesia Group Practice Administrator',
  },
]

// "RCM Solutions: Complete Anesthesia Revenue Cycle" — 8 cards
// per Specialty Pages doc (v1, May 19 2026). Field names match the
// shared SpecialtyMarquee component contract.
const solutions: SpecialtySolution[] = [
  { eyebrow: 'SPECIALTY EXPERTISE', title: 'Anesthesia-Specific Coding', description: 'Base units, time units, modifiers, concurrency. Coded accurately for every case type including cardiac, OB, pain, and regional.', anim: 'modifiers', modifierLabels: ['AA', 'QK', 'QY', 'AD'] },
  { eyebrow: 'PAYER INTELLIGENCE', title: 'Payer-Specific Billing Rules', description: 'Each payer reimburses anesthesia differently. Our team knows the rules for every major carrier and adapts accordingly.', anim: 'rules' },
  { eyebrow: 'FRONT OFFICE', title: 'Credentialing & Enrollment', description: 'Provider credentialing managed across all payers and facilities. DEA, OIG, and CAQH kept current.', anim: 'badges' },
  { eyebrow: 'AUTHORIZATIONS', title: 'Prior Authorization', description: 'Authorizations tracked and cleared before scheduled procedures. No OR delays. No revenue surprises.', anim: 'stamp' },
  { eyebrow: 'DENIAL PREVENTION', title: 'Denial Management & Appeals', description: 'Every denial gets a root cause review. Clinical rationale built by anesthesia experts. 95%+ appeal success rate.', anim: 'stat', statValue: '95', statUnit: '%' },
  { eyebrow: 'AI AGENT \u2014 CHRIS', title: 'AR Follow-Up & Collections', description: 'Chris calls payers thousands of times per week for claim status, escalations, and resolution. Your team focuses on patients.', anim: 'pulse', agent: { name: 'Chris', img: 'chris.png' } },
  { eyebrow: 'AI AGENT \u2014 CINDY', title: 'Patient Billing & Support', description: 'Cindy handles patient balances, pre-procedure cost estimates, and billing questions in over 50 languages.', anim: 'languages', agent: { name: 'Cindy', img: 'cindy.png' } },
  { eyebrow: 'REAL-TIME INSIGHTS', title: 'Analytics & Visibility', description: 'Live dashboards by provider, case type, facility, payer, and denial category. No waiting for month-end reports.', anim: 'chart' },
]

export default function AnesthesiaContent() {
  return (
    <>
      {/* The Problem, Split impact section.
          Headline + 4 bullets per the Specialty Pages doc
          (v1, May 19 2026). Both panels use justifyContent:
          flex-start so the two headlines sit at the same vertical
          position. Bullets at 18px (preview feedback: 15px was too
          small). */}
      <section style={{ overflow: 'hidden' }}>
        <div className="problem-solution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 400 }}>
          <div className="ps-panel ps-problem" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: 'var(--white)', position: 'relative' }}>
            <RevealOnScroll direction="left" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 28 }}>
                Base Units, Time Units, Modifiers. One Wrong Move and Revenue Disappears.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Base units, time-unit accuracy, medical direction modifiers, and concurrency rules trip up generic billing teams every day',
                  'Payers have their own anesthesia-specific reimbursement rules. What works for one doesn\u2019t work for another',
                  'Authorization lapses on high-cost cases lead to write-offs that could have been prevented',
                  'Without anesthesia-trained coders, undercoding and missed charges become the norm',
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
                Anesthesia Experts + AI Working Together
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Dedicated anesthesia billing team that understands units, modifiers, concurrency, and the rules each payer follows, because that\u2019s all they do',
                  'AI handles eligibility verification, authorization tracking, and claim follow-up across your full volume',
                  'Every denied claim gets a root cause review to prevent the same issue from recurring',
                  'Live dashboards showing collections by provider, case type, payer, and facility',
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


      {/* RCM Solutions: Complete Anesthesia Revenue Cycle.
          Grid + animation logic lives in SpecialtyMarquee
          component (shared across all 6 specialty pages). */}
      <section className="section section-specialty-grid">
        <div className="container">
          <RevealOnScroll><div className="section-title">Complete Anesthesia Revenue Cycle</div></RevealOnScroll>
        </div>

        {/* Grid layout: 3 col desktop, 2 col mobile. Cards wrap their
            own .container internally so they align with the title. */}
        <SpecialtyMarquee items={solutions} layout="grid" />
      </section>


      {/* Client Reviews — shared TestimonialsSection */}
      <TestimonialsSection
        testimonials={testimonials}
        label="CLIENT REVIEWS"
        title={<>What Our <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Clients</span> Say.</>}
      />


      {/* What Sets Accreda Apart — 3 specialty-specific cards per
          Specialty Pages doc (v1, May 19 2026). */}
      <section className="section">
        <div className="container">
        <RevealOnScroll><div className="section-title">What Sets Accreda Apart</div></RevealOnScroll>

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
            <MobileCarousel autoScrollInterval={4000}>
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


      {/* Pre-Service Collection, Priya */}
      <section className="section">
        <div className="container">
          <div className="specialty-spotlight-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <RevealOnScroll direction="left">
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 20 }}>
                  Pre-Service Payment Collection
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)', marginBottom: 32 }}>
                  Priya contacts patients before procedures with verified cost estimates, lifting pre-service collections 30–40% vs post-service. She handles the volume so your team focuses on clinical care.
                </p>
                <div style={{ display: 'flex', gap: 32 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.02em' }}>30–40%</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Higher Collection Rate</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.02em' }}>3–7 Days</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Before Procedure</div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <AgentSpotlightCard
                  agentName="Priya"
                  imgAlt="Priya, Pre-Service Payment Collection"
                  roleLabel="Pre-Service Cost Estimates"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>


      {/* Leadership, 250+ years */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">Leadership Combined Experience</div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 12, marginTop: 16, marginBottom: 48 }}>
              <span style={{ fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: 200, color: 'var(--primary)', lineHeight: 1 }}>250+</span>
              <span style={{ fontSize: 18, color: 'var(--gray-600)', fontWeight: 300 }}>years exclusively in anesthesia RCM</span>
            </div>
          </RevealOnScroll>

          <TeamCircleGrid
            people={leaders.map(l => ({ name: l.name, title: l.role, photo: l.photo }))}
            baseDelay={0.1}
          />
        </div>
      </section>
    </>
  )
}
