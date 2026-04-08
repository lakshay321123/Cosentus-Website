'use client'

import { useEffect, useRef, useState } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

function TypeWriter() {
  const phrases = [
    'What is my current denial rate by payer?',
    'Show me claims over 90 days in AR...',
    'Which procedures have the highest denial rate?',
    'Compare this month vs last month collections...',
    'What is my clean claim rate trend?',
  ]

  const [text, setText] = useState('')
  const phraseIdx = useRef(0)
  const charIdx = useRef(0)
  const deleting = useRef(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const type = () => {
      const current = phrases[phraseIdx.current]
      if (!deleting.current) {
        setText(current.slice(0, charIdx.current + 1))
        charIdx.current++
        if (charIdx.current >= current.length) {
          deleting.current = true
          timeout = setTimeout(type, 2000)
          return
        }
        timeout = setTimeout(type, 50 + Math.random() * 40)
      } else {
        setText(current.slice(0, charIdx.current - 1))
        charIdx.current--
        if (charIdx.current <= 0) {
          deleting.current = false
          phraseIdx.current = (phraseIdx.current + 1) % phrases.length
          timeout = setTimeout(type, 500)
          return
        }
        timeout = setTimeout(type, 25)
      }
    }

    timeout = setTimeout(type, 1500)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="ai-search-bar">
      <div className="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>
      <input type="text" placeholder={text} readOnly />
      <span className="typing-cursor" />
    </div>
  )
}

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Scalable AI Built for Growth',
    desc: 'Enterprise-scale capacity that grows with your practice — processing ~3,000 calls daily.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0-11V3m-4.06 1.06L9.5 5.5M4.06 9.94L5.5 9.5m13.44.44L17.5 9.5m1.44 5.06l-1.94-.44" />
      </svg>
    ),
    title: 'Specialized AI Voice Agents',
    desc: 'Automate eligibility, claims, prior authorizations, scheduling, and patient billing.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Up to 30% Revenue Growth',
    desc: 'Real results, not just reports. AI-powered insights that drive measurable financial improvement.',
  },
]

export default function RASection() {
  return (
    <section className="section ra-section" id="ra">
      <div className="container">
        <RevealOnScroll>
          <div className="section-label">COSENTUS.AI</div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <div className="section-title">
            Real + Artificial<br />Intelligence
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.2}>
          <p className="section-desc">
            What if your billing team never missed a claim? What if denials were resolved before you knew about them?
            Practices that refuse to settle for average collections use R+A.
          </p>
        </RevealOnScroll>

        <div className="ra-grid">
          <div className="ra-features">
            {features.map((f, i) => (
              <RevealOnScroll key={i}>
                <div className="ra-feature">
                  <div className="ra-feature-icon">{f.icon}</div>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll>
            <div className="ra-visual">
              <div className="ra-visual-content">
                <h3>Ask Anything About<br />Your Revenue Cycle</h3>
                <p>Cosentus.ai — your always-on revenue intelligence assistant, powered by Real + Artificial Intelligence.</p>
                <TypeWriter />
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
