'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

export default function HeroSection() {
  const [typed, setTyped] = useState('')
  const [showSub, setShowSub] = useState(false)
  const [showCta, setShowCta] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  // Parallax: video moves slower than scroll
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3])

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
    <section className="hero" ref={heroRef} style={{ overflow: 'hidden' }}>
      <div className="hero-bg">
        <motion.div style={{ y: videoY, position: 'absolute', inset: '-15% 0', width: '100%', height: '130%' }}>
          <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
            <source src="/images/hero-video.mp4" type="video/mp4" />
          </video>
        </motion.div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,53,69,0.75) 0%, rgba(0,89,110,0.55) 40%, rgba(0,181,214,0.3) 100%)', zIndex: 1 }} />
      </div>

      <motion.div className="hero-content" style={{ y: contentY, opacity: overlayOpacity }}>
        <motion.h1
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.2 }}
          style={{ fontSize: 'clamp(56px, 9vw, 130px)', fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.04em', lineHeight: 0.95 }}
        >
          {typed.includes('Growth') ? (
            <>{typed.slice(0, 6)}<span className="accent">{typed.slice(6)}</span></>
          ) : typed}
          <span style={{ display: 'inline-block', width: 4, height: '0.7em', background: '#00B5D6', marginLeft: 4, verticalAlign: 'baseline', opacity: showSub ? 0 : 1, animation: 'blink 0.6s step-end infinite' }} />
        </motion.h1>

        <AnimatePresence>
          {showSub && (
            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ type: 'spring', stiffness: 60, damping: 16 }}
            >
              Your billing team is leaving money on the table. We pick it up.
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCta && (
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -30, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0 }}
                whileHover={{ scale: 1.06, boxShadow: '0 8px 40px rgba(0,181,214,0.4)' }}
                whileTap={{ scale: 0.95 }}
                style={{ borderRadius: 50 }}
              >
                <Link href="/contact" className="btn-primary">
                  Get Your Free Revenue Analysis <ArrowIcon />
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -30, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.15 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                style={{ borderRadius: 50 }}
              >
                <Link href="/cosentus-ai" className="btn-ghost">
                  See How R+A Works
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5, type: 'spring', stiffness: 100, damping: 12 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="22" height="38" rx="11" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.8)">
              <animate attributeName="cy" values="12;24;12" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
            </circle>
          </svg>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </section>
  )
}
