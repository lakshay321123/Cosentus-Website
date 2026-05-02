'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'
import CTASection from '@/components/sections/CTASection'
import PageHero from '@/components/sections/PageHero'

const services = [
  { title: 'Therapy Session Coding', desc: 'Correct time thresholds and add-on codes for individual, group, and family therapy.', iconPath: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21' },
  { title: 'Psychiatric & Medication Management', desc: 'Capture both psychiatric and E/M components when clinically appropriate.', iconPath: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
  { title: 'IOP & PHP Billing', desc: 'Manage payer-specific bundling and per-diem vs per-service differences.', iconPath: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { title: 'Telehealth Billing', desc: 'Correct place-of-service and modifier use across payers.', iconPath: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5' },
  { title: 'Authorization Management', desc: 'Proactive tracking, submission, and follow-up on every authorization.', iconPath: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
  { title: 'Crisis & Add-On Services', desc: 'Accurate capture of crisis interventions and prolonged services.', iconPath: 'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5' },
  { title: 'Patient Payment Collection', desc: 'Cindy handles patient balances empathetically in 50+ languages.', iconPath: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
  { title: 'Analytics & Reporting', desc: 'Dashboards showing revenue per provider, authorization status, and denial patterns.', iconPath: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
]

const testimonials = [
  { quote: 'Cosentus has been an invaluable CalAIMS billing partner, proactively solving problems, collaborating with our county, streamlining processes, and offering insights that keep us informed and prepared.', name: 'Aubrie Mastrangelo', role: 'Division Director for Behavioral Health Services, Bill Wilson Center', initials: 'AM' },
  { quote: "Cosentus ensures accurate, timely billing, reducing our Days in AR and improving cash flow. They're responsive to feedback and quick to implement RCM processes, automation, and reporting dashboards to streamline billing.", name: 'Sujan Vatturi', role: 'Chief Information Officer, Hope Services Counseling Center', initials: 'SV' },
]

const leaders = [
  { name: 'JR Thompson', title: 'Sr. VP & Chief Operating Officer', photo: '/images/JR THOMPSON.jpg' },
  { name: 'Andrew Clougherty', title: 'Sr. Director of Client Services', photo: '/images/Andrew-Clougherty.jpg' },
  { name: 'Caty Harding', title: 'Account Manager', photo: '/images/Caty-Harding-2.webp' },
  { name: 'Toni Brown', title: 'Senior Account Manager', photo: '/images/Toni-Brown-1.webp' },
  { name: 'Amber Alvelo', title: 'Division Manager', photo: '/images/Amber-Alvelo.webp' },
  { name: 'Peter Ranjan', title: 'AR Manager', photo: '/images/Peter-Ranjan.webp' },
  { name: 'Julie DelBlasio', title: 'Lead Reimbursement Specialist', photo: '/images/Julie-DeBlasio.webp' },
  { name: 'Steven Sundrud', title: 'Division Manager, IT Division', photo: '/images/Steven-Symed.webp' },
]

function LeaderCard({ leader }: { leader: typeof leaders[0] }) {
  const [expanded, setExpanded] = useState(false)
  const initials = leader.name.split(' ').map(n => n[0]).join('')

  return (
    <div
      style={{ cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
      className="leader-card"
      onClick={() => setExpanded(!expanded)}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 16, background: 'var(--gray-100)' }}>
        {leader.photo ? (
          <Image src={leader.photo} alt={leader.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 50vw, 200px" />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 300, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
            {initials}
          </div>
        )}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.04em', color: 'var(--gray-900)' }}>{leader.name}</div>
      <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>{leader.title}</div>
    </div>
  )
}

export default function BehavioralHealthContent() {
  return (
    <main>
      <PageHero videoSrc="/images/specialties-hero.mp4"
        label="SIMED BY COSENTUS, PURPOSE BUILT FOR BEHAVIORAL HEALTH"
        title="Behavioral Health Demand Is Surging. The Billing Complexity Is Surging With It."
        subtitle="Psychiatry, therapy, IOP/PHP, medication management, and telehealth each carry distinct billing rules. Our behavioral health specialists keep revenue aligned with care delivered."
        ctaText="Get Your Free Behavioral Health Revenue Analysis"
        ctaHref="/contact"
      />

      {/* Problem / Solution Split */}
      <section className="section" style={{ overflow: 'hidden' }}>
        <div className="container">
          <div className="problem-solution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden', minHeight: 340 }}>
            <RevealOnScroll direction="left">
              <div className="ps-panel ps-problem" style={{ background: 'var(--white)', padding: 'clamp(32px, 4vw, 56px)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray-400)', marginBottom: 16 }}>THE PROBLEM</div>
                <h3 style={{ fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.25, marginBottom: 20 }}>
                  Complex Sessions.<br />Constant Revenue Leaks.
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    'Time-based CPTs with strict thresholds trip up generic billers',
                    'Telehealth modifiers vary by payer and change frequently',
                    'IOP/PHP bundling rules create constant underbilling risk',
                    'Authorization expirations silently kill revenue when tracking gaps occur',
                  ].map((item, i) => (
                    <div key={i} className="ps-bullet" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <svg aria-hidden="true" style={{ width: 18, height: 18, flexShrink: 0, marginTop: 2, color: 'var(--gray-400)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                      <span style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--gray-600)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll direction="right">
              <div className="ps-panel ps-solution" style={{ background: 'var(--primary)', padding: 'clamp(32px, 4vw, 56px)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: '0 var(--radius-md) var(--radius-md) 0', position: 'relative', overflow: 'hidden' }}>
                <div className="ps-shimmer" />
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>THE SOLUTION</div>
                <h3 style={{ fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 700, color: 'white', lineHeight: 1.25, marginBottom: 20 }}>
                  Behavioral Health Billing Experts + AI Tracking
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    'Correct time-based coding captured for every session',
                    'Every authorization expiration tracked and acted on',
                    'AI automates eligibility re-checks and auth tracking',
                    'Human experts defend denials with clinical rationale',
                    'Root-cause analysis on every denial to fix the pattern, not just the claim',
                    'Dedicated team covering IOP/PHP, telehealth, and crisis codes all day, with no specialty switching',
                  ].map((item, i) => (
                    <div key={i} className="ps-bullet-light" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <svg aria-hidden="true" className="ps-check" style={{ width: 18, height: 18, flexShrink: 0, marginTop: 2, color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      <span style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.9)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll><div className="section-label">WHAT WE MANAGE</div></RevealOnScroll>
          <RevealOnScroll delay={0.1}><div className="section-title">Complete Behavioral Health Revenue Cycle</div></RevealOnScroll>
          <div className="advantage-grid advantages-desktop" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginTop: 48 }}>
            {services.map((s, i) => (
              <RevealOnScroll key={i}>
                <div className="advantage-card">
                  <div className="advantage-icon"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={s.iconPath} /></svg></div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          <div className="advantages-mobile" style={{ overflow: 'hidden', width: '100%', marginTop: 32 }}>
            <MobileCarousel autoScrollInterval={4500}>
              {services.map((s, i) => (
                <div key={i} className="advantage-card">
                  <div className="advantage-icon"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={s.iconPath} /></svg></div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              ))}
            </MobileCarousel>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section" id="leadership">
        <div className="container">
          <RevealOnScroll><div className="section-label">OUR TEAM</div></RevealOnScroll>
          <RevealOnScroll delay={0.1}><div className="section-title">Behavioral Health Leadership</div></RevealOnScroll>
          <RevealOnScroll delay={0.15}>
            <p className="section-desc">150+ years combined in behavioral health RCM</p>
          </RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 32, marginTop: 48 }}>
            {leaders.map((leader, i) => (
              <RevealOnScroll key={i} delay={i * 0.08}>
                <LeaderCard leader={leader} />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll><div className="section-label">CLIENT REVIEWS</div></RevealOnScroll>
          <RevealOnScroll delay={0.1}><div className="section-title">What Our Clients Say</div></RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 24, marginTop: 48 }}>
            {testimonials.map((t, i) => (
              <RevealOnScroll key={i} delay={0.2 + i * 0.15}>
                <div className="testimonial-card" style={{
                  padding: '40px 36px', background: 'var(--white)', borderRadius: 16,
                  border: '1px solid var(--gray-200)', position: 'relative',
                  display: 'flex', flexDirection: 'column', height: '100%',
                }}>
                  <div style={{ position: 'absolute', top: 20, left: 28, fontSize: 64, lineHeight: 1, color: 'var(--primary)', opacity: 0.12, fontFamily: 'Georgia, serif', fontWeight: 700 }} aria-hidden="true">&ldquo;</div>
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--gray-600)', marginBottom: 28, position: 'relative', zIndex: 1, flex: 1 }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderTop: '1px solid var(--gray-200)', paddingTop: 20 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 600, color: 'white', flexShrink: 0,
                    }}>{t.initials}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-900)' }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  )
}
