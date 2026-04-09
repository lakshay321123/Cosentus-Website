'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'
import CTASection from '@/components/sections/CTASection'
import PageHero from '@/components/sections/PageHero'

const services = [
  { title: 'Therapy Session Coding', desc: 'Correct time thresholds and add-on codes for individual, group, and family therapy.', img: '/images/icons/p3-3b.png' },
  { title: 'Psychiatric & Medication Management', desc: 'Capture both psychiatric and E/M components when clinically appropriate.', img: '/images/icons/p3-3d.png' },
  { title: 'IOP & PHP Billing', desc: 'Manage payer-specific bundling and per-diem vs per-service differences.', img: '/images/icons/p3-3c.png' },
  { title: 'Telehealth Billing', desc: 'Correct place-of-service and modifier use across payers.', img: '/images/icons/3a.png' },
  { title: 'Authorization Management', desc: 'Proactive tracking, submission, and follow-up on every authorization.', img: '/images/icons/3b.png' },
  { title: 'Crisis & Add-On Services', desc: 'Accurate capture of crisis interventions and prolonged services.', img: '/images/icons/3f.png' },
  { title: 'Patient Payment Collection', desc: 'Cindy handles patient balances empathetically in 50+ languages.', img: '/images/icons/p3-3a.png' },
  { title: 'Analytics & Reporting', desc: 'Dashboards showing revenue per provider, authorization status, and denial patterns.', img: '/images/icons/p3-3e.png' },
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
      <PageHero
        label="BEHAVIORAL HEALTH"
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
                  <div className="advantage-icon">{s.img ? <Image src={s.img} alt="" width={28} height={28} className="icon-teal" style={{ objectFit: 'contain' }} /> : null}</div>
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
                  <div className="advantage-icon">{s.img ? <Image src={s.img} alt="" width={28} height={28} className="icon-teal" style={{ objectFit: 'contain' }} /> : null}</div>
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
