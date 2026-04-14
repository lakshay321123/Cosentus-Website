import { Variants, Transition } from 'framer-motion'

// ── Standard transitions ──────────────────────────────────────────
export const smooth: Transition = {
  type: 'tween',
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1], // matches the existing cubic-bezier used in hero
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

// ── Reveal variants (replacements for RevealOnScroll directions) ──
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

export const revealDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0 },
}

export const revealLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
}

export const revealRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
}

export const revealScale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
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
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

// ── Page transition variants ──────────────────────────────────────
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export const pageTransition: Transition = {
  type: 'tween',
  duration: 0.35,
  ease: [0.25, 0.1, 0.25, 1],
}

// ── Micro-interaction variants ────────────────────────────────────
export const buttonTap = {
  scale: 0.97,
  transition: { duration: 0.1 },
}

export const buttonHover = {
  scale: 1.02,
  transition: spring,
}

export const cardHover: Variants = {
  rest: { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  hover: {
    y: -6,
    boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
    transition: springGentle,
  },
}

// ── Navbar variants ───────────────────────────────────────────────
export const navSlideDown: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

// ── Helper: generate stagger delay for index ──────────────────────
export function staggerDelay(index: number, base = 0.05, increment = 0.08): Transition {
  return {
    ...smooth,
    delay: base + index * increment,
  }
}
