'use client'

import { useState, useEffect } from 'react'
import MotionReveal from '@/components/ui/MotionReveal'

const testimonials = [
  { tag: 'Anesthesia', quote: 'Year-over-year collection rate of 97% from commercial payors and 98% overall. I can wholeheartedly recommend Accreda.', author: 'Dr. John B. Field Jr.', title: 'Vice President, Anesthesia Associates' },
  { tag: 'Orthopedic', quote: 'My reimbursements increased after they started coding for me. They bill right away, work in collection and help with coding.', author: 'Dr. Morteza Farr', title: 'Board Certified Orthopedic Surgeon' },
  { tag: 'Pain Management', quote: "Nearly 20 years in practice — Cosentus has provided nothing but positive experiences. Highly recommend without reservations.", author: 'Justin Lo, MD', title: 'President, Northern California Pain Specialists' },
  { tag: 'ASC', quote: 'Cosentus has truly been fantastic in all aspects. The job they have done on the outstanding balances saved our surgery center.', author: 'John Welsh, M.D.', title: 'Surgery Center Director' },
  { tag: 'Behavioral Health', quote: 'Cosentus ensures accurate, timely billing, reducing our Days in AR and improving cash flow. Responsive to feedback and quick to implement.', author: 'Sujan Vatturi', title: 'CIO, Hope Services Counseling Center' },
]

export default function TestimonialsSection() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % testimonials.length), 5000)
    return () => clearInterval(t)
  }, [])

  const q = testimonials[active]

  return (
    <section style={{ background: '#00B5D6', padding: 'clamp(64px, 8vw, 100px) 0', overflow: 'hidden' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: 800 }}>
        <MotionReveal>
          <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>WHAT OUR CLIENTS SAY</div>
        </MotionReveal>

        <div style={{ minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div key={active} style={{ animation: 'fadeUp 0.5s ease forwards' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>{q.tag}</div>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 2.5vw, 28px)',
              fontWeight: 300, lineHeight: 1.5, color: 'white', fontStyle: 'italic',
              margin: '0 0 28px',
            }}>
              &ldquo;{q.quote}&rdquo;
            </p>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>{q.author}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{q.title}</div>
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} aria-label={`Testimonial ${i + 1}`}
              style={{
                width: active === i ? 32 : 8, height: 8,
                borderRadius: 4, border: 'none', cursor: 'pointer',
                background: active === i ? 'white' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
