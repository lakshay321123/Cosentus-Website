'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { pageVariants, pageTransition } from '@/lib/animations'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

/**
 * Wraps page content with a fade+slide entrance animation.
 * Used in template.tsx so it re-mounts on every route change.
 */
export default function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="enter"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  )
}
