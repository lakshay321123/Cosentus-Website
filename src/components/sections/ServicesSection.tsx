'use client'

import Link from 'next/link'
import { useState } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

const services = [
  {
    num: '01',
    title: 'Medical Billing & Coding',
    desc: 'Specialty-trained billing, coding, and denial management.',
    href: '/services/billing-coding',
    stat: '98.5%',
    statLabel: 'Coding Accuracy',
  },
  {
    num: '02',
    title: 'Complete Practice Management',
    desc: 'Front desk, operations, credentialing, and financial support.',
    href: '/services/practice-management',
    stat: '5–15%',
    statLabel: 'Additional Revenue',
  },
  {
    num: '03',
    title: 'EHR & Technology',
    desc: 'EHR agnostic. Seamlessly integrated with your systems, or upgrade to Medcloud.',
    href: '/services/ehr-technology',
    stat: '20+',
    statLabel: 'EHR Integrations',
  },
  {
    num: '04',
    title: 'Comprehensive RCM',
    desc: 'Eligibility, coding, submission, denials, payments, patient collections, and reporting.',
    href: '/services/rcm',
    stat: '>98%',
    statLabel: 'Net Collection',
  },
]

function ServiceRow({ svc, index }: { svc: typeof services[0]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={svc.href}
      style={{ textDecoration: 'none', display: 'block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '60px 1fr auto 44px',
        gap: 'clamp(16px, 3vw, 32px)',
        alignItems: 'center',
        padding: 'clamp(24px, 3vw, 36px) 0',
        borderBottom: '1px solid var(--gray-200)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        background: hovered ? 'var(--gray-50)' : 'transparent',
        margin: hovered ? '0 -24px' : '0',
        paddingLeft: hovered ? '24px' : '0',
        paddingRight: hovered ? '24px' : '0',
        borderRadius: hovered ? 'var(--radius-md)' : '0',
      }}
      className="service-row"
      >
        {/* Number */}
        <div style={{
          fontSize: 13,
          fontWeight: 500,
          color: hovered ? 'var(--primary)' : 'var(--gray-400)',
          fontFamily: 'var(--font-display)',
          transition: 'color 0.3s ease',
        }}>
          {svc.num}
        </div>

        {/* Title + Description */}
        <div style={{ minWidth: 0 }}>
          <h4 style={{
            fontSize: 'clamp(18px, 2vw, 22px)',
            fontWeight: 600,
            color: 'var(--gray-900)',
            marginBottom: 6,
            transition: 'color 0.3s ease',
            ...(hovered ? { color: 'var(--primary)' } : {}),
          }}>
            {svc.title}
          </h4>
          <p style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: 'var(--gray-500)',
            margin: 0,
          }}>
            {svc.desc}
          </p>
        </div>

        {/* Stat */}
        <div className="service-row-stat" style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: 'clamp(24px, 2.5vw, 32px)',
            fontWeight: 300,
            color: 'var(--primary)',
            fontFamily: 'var(--font-display)',
            lineHeight: 1,
          }}>
            {svc.stat}
          </div>
          <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>{svc.statLabel}</div>
        </div>

        {/* Arrow */}
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: `1px solid ${hovered ? 'var(--primary)' : 'var(--gray-200)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          background: hovered ? 'var(--primary)' : 'transparent',
          flexShrink: 0,
        }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18" height="18"
            fill="none" viewBox="0 0 24 24"
            stroke={hovered ? 'white' : 'var(--gray-400)'}
            strokeWidth={2}
            style={{ transition: 'all 0.3s ease', transform: hovered ? 'translateX(2px)' : 'none' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default function ServicesSection() {
  return (
    <section className="section" id="services" style={{ overflow: 'hidden' }}>
      <div className="container">
        <RevealOnScroll direction="right">
          <div className="section-label">WHAT WE DO</div>
        </RevealOnScroll>
        <RevealOnScroll direction="right" delay={0.1}>
          <div className="section-title">Services Built Around<br />Your Practice</div>
        </RevealOnScroll>

        <div style={{ marginTop: 48, borderTop: '1px solid var(--gray-200)' }}>
          {services.map((svc, i) => (
            <RevealOnScroll key={i} delay={0.15 + i * 0.1}>
              <ServiceRow svc={svc} index={i} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
