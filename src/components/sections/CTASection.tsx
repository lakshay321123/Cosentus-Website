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
            <h2>How Much Are You<br />Leaving Behind?</h2>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <Link href="/contact" className="btn-primary">
                Get Your Free Analysis
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </motion.div>
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}
