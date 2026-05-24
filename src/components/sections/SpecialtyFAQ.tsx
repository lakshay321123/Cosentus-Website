'use client'

import { useState } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

/**
 * SpecialtyFAQ
 *
 * Accordion-style FAQ section used on specialty pages
 * (/specialties/*). Visual design is lifted verbatim from the FAQ
 * rendering inside BlogPostContent.tsx — per user direction "copy
 * paste the FAQ section from the blogs, the design" — so a reader
 * who's seen one FAQ pattern on the site recognizes it everywhere.
 *
 * Each item is an independent collapsible card. Border turns teal
 * (#00B5D6, brand primary) when open. Chevron rotates 180deg.
 * Closed background is gray-50, open background is primary-ghost.
 *
 * Why not reuse the homepage FAQSection / FAQCard pair:
 *   - The homepage variant renders a 3-column row of glass cards
 *     against the immersive video background. That recipe doesn't
 *     port to a white specialty-page section.
 *   - The /faqs full listing page has its own table-of-contents
 *     style with category groupings — different structure entirely.
 *   - The blog accordion is the only existing pattern that's a
 *     plain vertical list of expandable Q&A cards, which is what
 *     the specialty doc calls for (5 items per page, single column).
 */

export interface SpecialtyFAQItem {
  question: string
  answer: string
}

interface SpecialtyFAQProps {
  faqs: SpecialtyFAQItem[]
  /**
   * Section title displayed above the accordion. Defaults to
   * "Frequently Asked Questions" if not provided.
   */
  title?: string
}

export default function SpecialtyFAQ({
  faqs,
  title = 'Frequently Asked Questions',
}: SpecialtyFAQProps) {
  // Track which items are expanded by index. Set rather than array
  // so toggling is O(1) and multiple items can be open at once
  // (matches the blog's behavior — users compare answers).
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const toggle = (i: number) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <section className="section" style={{ background: 'var(--white)' }}>
      <div className="container" style={{ maxWidth: 880 }}>
        <RevealOnScroll>
          <div className="section-title">{title}</div>
        </RevealOnScroll>

        <div style={{ marginTop: 48 }}>
          {faqs.map((faq, i) => {
            const isOpen = expanded.has(i)
            return (
              <RevealOnScroll key={i} delay={0.05 + i * 0.05}>
                <div
                  style={{
                    marginBottom: 8,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease',
                    borderColor: isOpen ? '#00B5D6' : 'var(--gray-200)',
                  }}
                >
                  <button
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={`specialty-faq-answer-${i}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '18px 24px',
                      background: isOpen ? 'var(--primary-ghost)' : 'var(--gray-50)',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      gap: 16,
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: 'var(--gray-900)',
                        lineHeight: 1.5,
                        flex: 1,
                      }}
                    >
                      {faq.question}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#00B5D6"
                      strokeWidth={2.5}
                      style={{
                        flexShrink: 0,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isOpen && (
                    <div
                      id={`specialty-faq-answer-${i}`}
                      role="region"
                      style={{
                        padding: '0 24px 20px',
                        background: 'white',
                      }}
                    >
                      <p
                        style={{
                          fontSize: 16,
                          lineHeight: 1.75,
                          color: 'var(--gray-600)',
                          paddingTop: 12,
                          margin: 0,
                        }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              </RevealOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}
