'use client'

import { useState } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

const services = [
  {
    num: '01',
    title: 'End-to-End Revenue Cycle Management',
    desc: 'From credentialing to final patient payment. Every step. Every dollar. One team.',
    href: '/services/rcm',
    stat: '>98%',
    statLabel: 'Net Collection',
    image: '/images/homepage/rcm-full.jpg',
  },
  {
    num: '02',
    title: 'EHR & Technology',
    desc: 'EHR agnostic. Works seamlessly with Epic, Athenahealth, eClinicalWorks, and more.',
    href: '/services/ehr-technology',
    stat: '23',
    statLabel: 'Modules',
    image: '/images/homepage/ehr-tech.jpg',
  },
]

function ServiceCard({ svc }: { svc: typeof services[0] }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={svc.href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: 'var(--white)',
        border: '1px solid var(--gray-200)',
        borderRadius: 16,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: hovered ? 'translateY(-8px)' : 'none',
        boxShadow: hovered ? '0 20px 50px rgba(0,181,214,0.18)' : 'none',
        borderColor: hovered ? '#00B5D6' : 'var(--gray-200)',
      }}>
        {/* Image */}
        <div style={{ width: '100%', height: 220, overflow: 'hidden', position: 'relative' }}>
          <img src={svc.image} alt={svc.title} style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.6s ease',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: hovered ? 'rgba(0,181,214,0.15)' : 'rgba(0,0,0,0.03)',
            transition: 'background 0.4s ease',
          }} />
          <div style={{
            position: 'absolute', bottom: 16, right: 16,
            background: 'rgba(0,181,214,0.9)', backdropFilter: 'blur(8px)',
            borderRadius: 10, padding: '10px 16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{svc.stat}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.75)', marginTop: 2, textTransform: 'uppercase' as const, letterSpacing: '0.06em', fontWeight: 500 }}>{svc.statLabel}</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '28px 28px 32px', flex: 1, display: 'flex', flexDirection: 'column' as const }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: hovered ? '#00B5D6' : 'var(--gray-400)', letterSpacing: '0.05em', marginBottom: 10, transition: 'color 0.3s', fontFamily: 'var(--font-display)' }}>{svc.num}</div>
          <h4 style={{ fontSize: 22, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 10, transition: 'color 0.3s', ...(hovered ? { color: '#00B5D6' } : {}) }}>{svc.title}</h4>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--gray-500)', margin: 0 }}>{svc.desc}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', paddingTop: 24, fontSize: 13, fontWeight: 600, color: '#00B5D6', letterSpacing: '0.02em' }}>
            Learn More
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              style={{ transition: 'transform 0.3s', transform: hovered ? 'translateX(4px)' : 'none' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
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
          <div className="section-title">Two Services.<br />One Result: Growth.</div>
        </RevealOnScroll>

        {/* Desktop: 3 visual cards */}
        <div className="services-visual-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginTop: 48 }}>
          {services.map((svc, i) => (
            <RevealOnScroll key={i} delay={0.15 + i * 0.12}>
              <ServiceCard svc={svc} />
            </RevealOnScroll>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="services-visual-mobile" style={{ marginTop: 32 }}>
          <MobileCarousel autoScrollInterval={5000}>
            {services.map((svc, i) => (
              <ServiceCard key={i} svc={svc} />
            ))}
          </MobileCarousel>
        </div>
      </div>

      <style>{`
        .services-visual-mobile { display: none; }
        @media (max-width: 1024px) {
          .services-visual-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .services-visual-grid { display: none !important; }
          .services-visual-mobile { display: block; }
        }
      `}</style>
    </section>
  )
}
