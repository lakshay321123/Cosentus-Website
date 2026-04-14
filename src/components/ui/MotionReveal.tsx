'use client'

import { ReactNode } from 'react'
import { motion, Variants, Transition } from 'framer-motion'
import {
  revealUp,
  revealLeft,
  revealRight,
  revealScale,
  fadeIn,
  smooth,
} from '@/lib/animations'

interface MotionRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'scale' | 'fade'
  variants?: Variants
  transition?: Transition
  threshold?: number
  once?: boolean
}

const directionMap: Record<string, Variants> = {
  up: revealUp,
  left: revealLeft,
  right: revealRight,
  scale: revealScale,
  fade: fadeIn,
}

export default function MotionReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  variants,
  transition,
  threshold = 0.15,
  once = true,
}: MotionRevealProps) {
  const resolvedVariants = variants || directionMap[direction] || revealUp

  const resolvedTransition: Transition = {
    ...(transition || smooth),
    delay,
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={resolvedVariants}
      transition={resolvedTransition}
    >
      {children}
    </motion.div>
  )
}
