'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

const testimonials = [
  {
    tag: 'Anesthesia',
    title: '"Year-over-year collection rate of 97% from commercial payors and 98% overall."',
    author: '— Dr. John B. Field Jr., MD',
  },
  {
    tag: 'Orthopedic',
    title: '"My reimbursements increased after they started coding for me."',
    author: '— Dr. Morteza Farr, DO',
  },
  {
    tag: 'Pain Management',
    title: '"Nearly 20 years in practice — Cosentus has provided nothing but positive experiences."',
    author: '— Justin Lo, MD',
  },
  {
    tag: 'ASC',
    title: '"The job they have done on the outstanding balances saved our surgery center."',
    author: '— John Welsh, M.D.',
  },
]

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0, h = 0
    let animFrame: number
    const mouse = { x: -1000, y: -1000 }
    const CONNECT_DIST = 160
    const MOUSE_DIST = 200

    const resize = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    resize()
    window.addEventListener('resize', resize)
    canvas.parentElement?.addEventListener('mousemove', handleMouseMove)

    const PARTICLE_COUNT = Math.min(80, Math.floor((w * h) / 12000))

    class Particle {
      x: number; y: number; vx: number; vy: number; r: number; alpha: number
      constructor() {
        this.x = Math.random() * w
        this.y = Math.random() * h
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.r = Math.random() * 2 + 1
        this.alpha = Math.random() * 0.4 + 0.1
      }
      update() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < 0 || this.x > w) this.vx *= -1
        if (this.y < 0 || this.y > h) this.vy *= -1
        const dx = this.x - mouse.x
        const dy = this.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_DIST) {
          const force = ((MOUSE_DIST - dist) / MOUSE_DIST) * 0.02
          this.vx += (dx / dist) * force
          this.vy += (dy / dist) * force
        }
        this.vx *= 0.999
        this.vy *= 0.999
      }
      draw() {
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(0, 181, 214, ${this.alpha})`
        ctx!.fill()
      }
    }

    const particles: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle())
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.15
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0, 181, 214, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      // Draw and update particles
      particles.forEach((p) => {
        p.update()
        p.draw()
      })
      animFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} id="heroCanvas" />
}

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <ParticleCanvas />
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
      </div>

      <div className="hero-content">
        <RevealOnScroll>
          <div className="hero-badge">
            <div className="hero-badge-dot" />
            <span>25+ YEARS OF SPECIALTY RCM</span>
          </div>
        </RevealOnScroll>

        <h1>
          Think <span className="accent">Growth.</span>
        </h1>

        <RevealOnScroll delay={0.2}>
          <p className="hero-sub">
            25 years of specialty RCM expertise, amplified by Real&nbsp;+&nbsp;Artificial&nbsp;Intelligence.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.3}>
          <div className="hero-actions">
            <Link href="/contact" className="btn-primary">
              Get Your Free Revenue Analysis
              <ArrowIcon />
            </Link>
            <Link href="/ra-intelligence" className="btn-ghost">
              See How R+A Works
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.4}>
          <div className="hero-cases">
            {testimonials.map((t, i) => (
              <div key={i} className="hero-case">
                <div className="hero-case-tag">{t.tag}</div>
                <div className="hero-case-title">{t.title}</div>
                <span className="hero-case-link">{t.author}</span>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
