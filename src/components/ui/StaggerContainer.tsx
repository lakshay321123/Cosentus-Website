'use client'

import { ReactNode } from 'react'
import { motion, Variants, Transition } from 'framer-motion'
import { revealUp, smooth } from '@/lib/animations'

// ── Container ─────────────────────────────────────────────────────
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  delayChildren?: number
  threshold?: number
  once?: boolean
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  delayChildren = 0.05,
  threshold = 0.1,
  once = true,
}: StaggerContainerProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  )
}

// ── Item ──────────────────────────────────────────────────────────
interface StaggerItemProps {
  children: ReactNode
  className?: string
  variants?: Variants
  transition?: Transition
}

export function StaggerItem({
  children,
  className = '',
  variants,
  transition,
}: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={variants || revealUp}
      transition={transition || smooth}
    >
      {children}
    </motion.div>
  )
}
