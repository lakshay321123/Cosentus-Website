'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import MotionReveal from '@/components/ui/MotionReveal'

export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="container">
        <MotionReveal direction="scale">
          <div className="cta-box">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 60, damping: 14 }}
            >
              How Much Are You<br />Leaving Behind?
            </motion.h2>

            {/* Outer: entrance animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 80, damping: 14, delay: 0.2 }}
              style={{ display: 'inline-block' }}
            >
              {/* Inner: pulsing glow + hover */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0,181,214,0.0)',
                    '0 0 35px rgba(0,181,214,0.35)',
                    '0 0 20px rgba(0,181,214,0.0)',
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{
                  scale: 1.08,
                  boxShadow: '0 0 50px rgba(0,181,214,0.5)',
                }}
                whileTap={{ scale: 0.95 }}
                style={{ borderRadius: 50, display: 'inline-block' }}
              >
                <Link href="/contact" className="btn-primary">
                  Get Your Free Analysis
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}
