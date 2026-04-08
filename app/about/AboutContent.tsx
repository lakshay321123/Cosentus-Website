'use client'

import { useEffect, useRef, ReactNode } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

function FadeOnly({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity = '1'; obs.unobserve(el) }
    }, { threshold: 0.15, rootMargin: '0px 0px -100px 0px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return <div ref={ref} style={{ opacity: 0, transition: 'opacity 1s ease' }}>{children}</div>
}

const beliefs = [
  { title: 'Customers first', desc: 'We measure success by the revenue gains we deliver for practices, not vanity metrics.' },
  { title: 'Transparency', desc: 'Real-time dashboards, weekly reviews, and same-day reporting. No waiting. No guessing.' },
  { title: 'Accountability', desc: 'We own outcomes end-to-end. Issues get root-cause analysis and immediate fixes.' },
  { title: 'Specialty focus', desc: 'Teams organized by specialty. They know every payer nuance and clinical detail — reducing denials and accelerating cash flow.' },
]

const companyStats = [
  { value: '25+', label: 'Years RCM Expertise' },
  { value: 'R+A', label: 'Real + Artificial Intelligence' },
  { value: '99%', label: 'Customer Retention' },
  { value: '30%', label: 'Up to Revenue Growth' },
]

const leadership = [
  { name: 'GS Bhalla', title: 'Chief Executive Officer' },
  { name: 'JR Thompson', title: 'Sr. VP & Chief Operating Officer' },
  { name: 'Manisha Bhalla', title: 'Chief People Officer' },
  { name: 'Viktor Alvarado', title: 'Chief Financial Officer' },
  { name: 'Allen Ranjan', title: 'Chief Revenue Officer' },
  { name: 'Raja Inder Bhalla', title: 'Managing Director' },
  { name: 'Ashwin Pajpal', title: 'Global Brand Director' },
  { name: 'Wayne Wertz', title: 'Sr. Director of HR & Corporate Operations' },
  { name: 'Ajay Kumar', title: 'Chief Operating Officer - RCM' },
  { name: 'Aman Bhasin', title: 'Sr. VP & Head of Global Operations (Non-US)' },
]

const offices = [
  'Irvine, California (HQ)',
  'Phoenix, AZ',
  'Mission, TX',
  'Napa, CA',
  'Dallas, TX',
  'Olathe, KS',
]

export default function AboutContent() {
  return (
    <>
      {/* About Description */}
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <RevealOnScroll>
            <p className="section-desc" style={{ maxWidth: '100%', fontSize: 18, lineHeight: 1.8 }}>
              Cosentus is a full-service practice growth partner and global healthcare revenue cycle management (RCM) company.
              For more than 25 years, we have helped physician practices, specialty groups, and surgery centers grow revenue,
              eliminate billing inefficiencies, and scale operations — end-to-end, from patient registration to final payment,
              with Real + Artificial Intelligence and specialty-trained teams.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="section-desc" style={{ maxWidth: '100%', fontSize: 16, lineHeight: 1.8, marginTop: 24 }}>
              Built on its R+A approach — Real + Artificial Intelligence — Cosentus combines experienced revenue cycle
              professionals with specialised AI agents to help healthcare organisations manage administrative complexity
              more efficiently and improve operational efficiency and financial performance.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* What We Believe */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">OUR VALUES</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">What We Believe</div>
          </RevealOnScroll>

          <div className="advantage-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginTop: 48 }}>
            {beliefs.map((b, i) => (
              <RevealOnScroll key={i}>
                <div className="advantage-card">
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Company by Numbers */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">COMPANY BY NUMBERS</div>
          </RevealOnScroll>
          <div className="results-grid" style={{
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
            marginTop: 48,
            padding: 0,
          }}>
            {companyStats.map((stat, i) => (
              <RevealOnScroll key={i}>
                <div style={{
                  textAlign: 'center',
                  padding: 40,
                  background: 'var(--primary)',
                  borderRadius: 'var(--radius-md)',
                  color: 'white',
                }}>
                  <div style={{ fontSize: 48, fontWeight: 300, lineHeight: 1, marginBottom: 8 }}>{stat.value}</div>
                  <div style={{ fontSize: 14, opacity: 0.8 }}>{stat.label}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Why Independent Matters */}
      <section className="section section-alt">
        <div className="container" style={{ maxWidth: 800 }}>
          <RevealOnScroll>
            <div className="section-label">INDEPENDENCE</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Why Independent Matters</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="section-desc" style={{ maxWidth: '100%', fontSize: 17, lineHeight: 1.8 }}>
              Cosentus is privately and independently owned. We make long-term decisions for client outcomes,
              not quarterly investor returns. Our stability shows: 80% of our founding team remains with the company.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Recognition & Compliance */}
      <section style={{
        background: 'var(--primary)',
        padding: '80px 0',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <RevealOnScroll>
            <h3 style={{
              fontSize: 14,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: 16,
            }}>RECOGNITION & COMPLIANCE</h3>
            <p style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.6)',
              marginBottom: 40,
              maxWidth: 500,
              margin: '0 auto 40px',
              lineHeight: 1.6,
            }}>
              SOC 2 · HIPAA Compliant · HBMA Member · Inc. 5000 — four consecutive years · Great Place to Work — three consecutive years
            </p>
          </RevealOnScroll>
          <FadeOnly>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/accolades.png"
                alt="Cosentus Accolades"
                style={{ mixBlendMode: 'screen', maxWidth: 600, width: '100%', height: 'auto' }}
              />
            </div>
          </FadeOnly>
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

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 20,
            marginTop: 48,
          }}>
            {leadership.map((person, i) => (
              <RevealOnScroll key={i}>
                <div style={{
                  padding: 28,
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-200)',
                  transition: 'all var(--transition-base)',
                }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'var(--primary-ghost)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 500,
                    color: 'var(--primary)',
                    marginBottom: 16,
                  }}>
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 4 }}>
                    {person.name}
                  </h4>
                  <p style={{ fontSize: 13, color: 'var(--gray-600)' }}>{person.title}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 36 }}>
            {offices.map((office, i) => (
              <RevealOnScroll key={i}>
                <div style={{
                  padding: '14px 28px',
                  background: i === 0 ? 'var(--primary)' : 'var(--white)',
                  color: i === 0 ? 'white' : 'var(--gray-700)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 15,
                  border: `1px solid ${i === 0 ? 'var(--primary)' : 'var(--gray-200)'}`,
                  fontWeight: i === 0 ? 500 : 400,
                }}>
                  {office}
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
