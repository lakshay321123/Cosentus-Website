'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

export default function HeroSection() {
  const [typed, setTyped] = useState('')
  const [showSub, setShowSub] = useState(false)
  const [showCta, setShowCta] = useState(false)

  useEffect(() => {
    const full = 'Think Growth.'
    let i = 0
    const delay = setTimeout(() => {
      const iv = setInterval(() => {
        i++
        setTyped(full.slice(0, i))
        if (i >= full.length) {
          clearInterval(iv)
          setTimeout(() => setShowSub(true), 500)
          setTimeout(() => setShowCta(true), 1000)
        }
      }, 120)
    }, 600)
    return () => clearTimeout(delay)
  }, [])

  return (
    <section className="hero">
      <div className="hero-bg">
        <video autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          <source src="/images/hero-video.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,53,69,0.75) 0%, rgba(0,89,110,0.55) 40%, rgba(0,181,214,0.3) 100%)', zIndex: 1 }} />
      </div>

      <div className="hero-content">
        <h1 style={{ fontSize: 'clamp(56px, 9vw, 130px)', fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.04em', lineHeight: 0.95 }}>
          {typed.includes('Growth') ? (
            <>{typed.slice(0, 6)}<span className="accent">{typed.slice(6)}</span></>
          ) : typed}
          <span style={{ display: 'inline-block', width: 4, height: '0.7em', background: '#00B5D6', marginLeft: 4, verticalAlign: 'baseline', opacity: showSub ? 0 : 1, animation: 'blink 0.6s step-end infinite' }} />
        </h1>

        <p className="hero-sub" style={{
          opacity: showSub ? 1 : 0,
          transform: showSub ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
        }}>
          Your billing team is leaving money on the table. We pick it up.
        </p>

        <div className="hero-actions" style={{
          opacity: showCta ? 1 : 0,
          transform: showCta ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <Link href="/contact" className="btn-primary">
            Get Your Free Revenue Analysis <ArrowIcon />
          </Link>
          <Link href="/cosentus-ai" className="btn-ghost">
            See How R+A Works
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="scroll-indicator">
        <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="22" height="38" rx="11" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.8)">
            <animate attributeName="cy" values="12;24;12" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </section>
  )
}
