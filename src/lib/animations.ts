import { Variants, Transition } from 'framer-motion'

// ── Standard transitions ──────────────────────────────────────────
export const smooth: Transition = {
  type: 'tween',
  duration: 0.7,
  ease: [0.16, 1, 0.3, 1],
}

export const spring: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
}

export const springGentle: Transition = {
  type: 'spring',
  stiffness: 120,
  damping: 20,
}

export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 15,
}

// ── Reveal variants — DRAMATIC ────────────────────────────────────
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 80, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

export const revealDown: Variants = {
  hidden: { opacity: 0, y: -60 },
  visible: { opacity: 1, y: 0 },
}

export const revealLeft: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0 },
}

export const revealRight: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0 },
}

export const revealScale: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

// ── Stagger container ─────────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

// ── Page transition variants — MORE NOTICEABLE ────────────────────
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 24, scale: 0.99 },
  enter: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -16 },
}

export const pageTransition: Transition = {
  type: 'tween',
  duration: 0.5,
  ease: [0.25, 0.1, 0.25, 1],
}

// ── Micro-interaction variants ────────────────────────────────────
export const buttonTap = {
  scale: 0.95,
  transition: { duration: 0.1 },
}

export const buttonHover = {
  scale: 1.05,
  transition: spring,
}

export const cardHover: Variants = {
  rest: { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  hover: {
    y: -10,
    boxShadow: '0 20px 50px rgba(0,181,214,0.2)',
    transition: springGentle,
  },
}

// ── Helper: stagger delay ─────────────────────────────────────────
export function staggerDelay(index: number, base = 0.08, increment = 0.1): Transition {
  return {
    ...smooth,
    delay: base + index * increment,
  }
}
