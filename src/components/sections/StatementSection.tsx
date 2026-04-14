'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import MotionReveal from '@/components/ui/MotionReveal'

export default function StatementSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  // Subtle parallax on video
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  return (
    <section ref={sectionRef} style={{ position: 'relative', overflow: 'hidden', background: '#000' }}>
      {/* Video background with parallax */}
      <motion.div style={{ y: videoY, position: 'absolute', inset: '-10% 0', width: '100%', height: '120%' }}>
        <video autoPlay loop muted playsInline style={{
          width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.2,
        }}>
          <source src="/images/specialties-hero.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(80px, 10vw, 140px) 0' }}>
        <div className="container">
          {/* Big declaration — dramatic split entrance */}
          <motion.h2
            initial={{ opacity: 0, x: -120, skewX: -5 }}
            whileInView={{ opacity: 1, x: 0, skewX: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 50, damping: 14 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(36px, 6vw, 80px)',
              color: 'white',
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              marginBottom: 12,
            }}
          >
            WE ARE COSENTUS.
          </motion.h2>

          <motion.h2
            initial={{ opacity: 0, x: -120, skewX: -5 }}
            whileInView={{ opacity: 1, x: 0, skewX: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 50, damping: 14, delay: 0.2 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(36px, 6vw, 80px)',
              color: '#00B5D6',
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              marginBottom: 56,
            }}
          >
            WE KNOW HEALTHCARE.
          </motion.h2>

          {/* 3 proof points — stagger cascade */}
          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 48 }}
            className="statement-proof-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
            }}
          >
            {[
              { q: 'Will they care about MY practice?', a: 'No investors to answer to. We only answer to you.' },
              { q: 'Do they know MY specialty?', a: 'Anesthesia. Ortho. Pain. ASC. Behavioral Health. We already work your codes.' },
              { q: 'Will I talk to a real person?', a: 'Named team. Direct line. They know your payers by heart.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 50, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ type: 'spring', stiffness: 70, damping: 14 }}
              >
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'white', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.q}</h4>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>{item.a}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 80, damping: 14, delay: 0.6 }}
            style={{ textAlign: 'center', marginTop: 56 }}
          >
            <motion.div
              whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(0,181,214,0.4)' }}
              whileTap={{ scale: 0.95 }}
              style={{ display: 'inline-block', borderRadius: 50 }}
            >
              <Link href="/contact" style={{
                display: 'inline-block', padding: '18px 52px',
                fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'white', background: '#00B5D6', textDecoration: 'none',
                borderRadius: 50,
              }}>
                {"Let's Talk"}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .statement-proof-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  )
}
