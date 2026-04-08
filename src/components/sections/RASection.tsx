'use client'

import { useEffect, useState } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

const features = [
  { title: 'What if your billing team never missed a claim?', desc: 'What if denials were resolved before you knew about them?' },
  { title: 'Scalable AI Built for Your Practice Growth', desc: 'Specialized AI Voice Agents processing thousands of transactions daily.' },
  { title: 'Up to 30% revenue growth', desc: 'Most clients see measurable improvement in 3–6 months.' },
  { title: 'Real results. Not just reports.', desc: 'Every metric is linked to documented case studies.' },
]

const placeholders = [
  'How does R+A reduce denials?',
  'What is my expected revenue lift?',
  'How do AI agents handle patient calls?',
  'What specialties do you support?',
]

function TypingEffect() {
  const [text, setText] = useState('')
  const [idx, setIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = placeholders[idx]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), 2000)
        } else {
          setCharIdx(charIdx + 1)
        }
      } else {
        setText(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setIdx((idx + 1) % placeholders.length)
          setCharIdx(0)
        } else {
          setCharIdx(charIdx - 1)
        }
      }
    }, deleting ? 30 : 60)
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, idx])

  return (
    <span>
      {text}
      <span className="typing-cursor" style={{ display: 'inline-block', width: 2, height: 18, marginLeft: 2, verticalAlign: 'text-bottom', animation: 'blink 1s step-end infinite' }} />
    </span>
  )
}

export default function RASection() {
  return (
    <section className="section" id="ra" style={{ overflow: 'hidden' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <RevealOnScroll direction="left">
              <div className="section-label">COSENTUS.AI</div>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.15}>
              <div className="section-title">
                Real + Artificial<br />Intelligence
              </div>
            </RevealOnScroll>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 40 }}>
              {features.map((f, i) => (
                <RevealOnScroll key={i} direction="left" delay={0.2 + i * 0.12}>
                  <div className="ra-feature" style={{ padding: '20px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)', background: 'var(--gray-50)', cursor: 'default' }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 4 }}>{f.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray-600)' }}>{f.desc}</div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          <RevealOnScroll direction="right" delay={0.3}>
            <div>
              <div className="ai-search-bar" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '56px 40px', textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>AI-Powered Search</div>
                <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', padding: '16px 24px', fontSize: 15, color: 'var(--gray-600)', textAlign: 'left' }}>
                  <TypingEffect />
                </div>
                <div style={{ marginTop: 24, fontSize: 13, color: 'var(--gray-500)' }}>
                  Ask anything about your revenue cycle
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
                {[{ n: '~3,000', l: 'Calls/Day' }, { n: '8', l: 'AI Agents' }, { n: '50+', l: 'Languages' }, { n: '24/7', l: 'Coverage' }].map((s, i) => (
                  <div key={i} className="ai-prompt-card" style={{ padding: '16px', background: 'var(--primary-ghost)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--gray-200)', cursor: 'default', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
                    <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--primary)' }}>{s.n}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-600)' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
