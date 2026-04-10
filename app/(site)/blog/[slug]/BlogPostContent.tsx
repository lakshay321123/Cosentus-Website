'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { BlogPost } from '@/data/blogPosts'

function ArrowLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l7 7m-7-7l7-7" />
    </svg>
  )
}

// Split a FAQ paragraph that contains multiple Q&A pairs concatenated together
// e.g. "What is X? X is... How does Y? Y works by..." → [{question, answer}, ...]
function splitFaqText(text: string): { question: string; answer: string }[] {
  const pairs: { question: string; answer: string }[] = []

  // Match questions that start with common question words and end with ?
  // Must be preceded by start-of-string or sentence boundary (. or ? followed by space)
  const qWords = 'What|When|Who|Which|How|Why|Where|Can|Do|Does|Should|Is|Are'
  const regex = new RegExp(`(?:^|[.?!]\\s+)((?:${qWords})\\b[^?]*?\\?)`, 'g')
  const questions: { q: string; start: number; end: number }[] = []
  let match

  while ((match = regex.exec(text)) !== null) {
    const q = match[1].trim()
    const qStart = match.index + match[0].indexOf(match[1])
    questions.push({ q, start: qStart, end: qStart + match[1].length })
  }

  if (questions.length === 0) {
    // Fallback: try simple first-question-mark split
    const firstQ = text.indexOf('?')
    if (firstQ > 0 && firstQ < text.length - 1) {
      return [{ question: text.slice(0, firstQ + 1).trim(), answer: text.slice(firstQ + 1).trim() }]
    }
    return []
  }

  for (let i = 0; i < questions.length; i++) {
    const answerStart = questions[i].end
    const answerEnd = i + 1 < questions.length ? questions[i + 1].start : text.length
    const answer = text.slice(answerStart, answerEnd).trim()

    if (answer) {
      pairs.push({ question: questions[i].q, answer })
    }
  }

  return pairs
}

// Split text that contains inline ALL CAPS headings into segments
// e.g. "some text. INLINE HEADING More text" → [{type:'text',content:'some text.'},{type:'heading',content:'Inline Heading'},{type:'text',content:'More text'}]
function splitInlineHeadings(text: string): { type: 'text' | 'heading'; content: string }[] {
  // Match 2+ consecutive ALL CAPS words (3+ letters each) that look like inline headings
  // They typically appear after a period/sentence boundary or at the start
  const pattern = /(?:^|(?<=[.!?]\s))([A-Z][A-Z]+(?:\s+(?:[A-Z][A-Z]+|&|AND|OR|OF|IN|FOR|THE|TO|A|AN|AT|ON|BY|VS|WITH))+[?:]?)/g
  const segments: { type: 'text' | 'heading'; content: string }[] = []
  let lastIndex = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    const heading = match[1]
    // Skip short matches or things that are clearly not headings
    if (heading.length < 8) continue

    // Add preceding text
    const before = text.slice(lastIndex, match.index + (match[0].length - match[1].length)).trim()
    if (before) segments.push({ type: 'text', content: before })

    // Convert heading to Title Case
    const titleCase = heading.replace(/[?:]/g, '').split(/\s+/).map((w, i) => {
      const lower = w.toLowerCase()
      const smallWords = ['a','an','the','and','but','or','nor','for','yet','so','in','on','at','to','by','of','up','as','is','vs','with']
      if (i > 0 && smallWords.includes(lower)) return lower
      return w.charAt(0) + w.slice(1).toLowerCase()
    }).join(' ')
    segments.push({ type: 'heading', content: titleCase + (heading.endsWith('?') ? '?' : '') })

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  const remaining = text.slice(lastIndex).trim()
  if (remaining) segments.push({ type: 'text', content: remaining })

  // Only return segments if we actually found headings
  return segments.length > 1 ? segments : []
}

export default function BlogPostContent({ post }: { post: BlogPost }) {
  const [activeId, setActiveId] = useState<string>('')
  const [tocOpen, setTocOpen] = useState(true)
  const [expandedFaqs, setExpandedFaqs] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

  const toggleFaq = (key: string) => {
    setExpandedFaqs(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  // Intersection Observer to highlight active TOC item on scroll
  useEffect(() => {
    const headings = post.sections
      .map(s => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[]

    if (headings.length === 0) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    )

    headings.forEach(h => observerRef.current!.observe(h))
    return () => observerRef.current?.disconnect()
  }, [post.sections])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 100
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  // Filter only top-level TOC entries for the sidebar
  const tocSections = post.sections.filter(s => s.content.length > 0 || s.heading.toLowerCase().includes('faq'))

  return (
    <>
      {/* Hero Banner */}
      <section style={{
        position: 'relative',
        minHeight: '340px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}>
        <video autoPlay muted loop playsInline poster="/images/hero-bg.jpg" style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%', objectFit: 'cover', zIndex: 0,
        }}>
          <source src="/videos/hero-banner.mp4" type="video/mp4" />
        </video>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(0,30,50,0.80) 0%, rgba(0,80,100,0.65) 50%, rgba(0,40,60,0.75) 100%)',
          zIndex: 1,
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '140px 40px 60px' }}>
          <div style={{
            display: 'inline-block', padding: '4px 14px',
            background: 'rgba(0,181,214,0.25)', borderRadius: 6,
            fontSize: 11, fontWeight: 500, color: '#68D1E6',
            textTransform: 'uppercase', letterSpacing: '0.06em',
            marginBottom: 16,
          }}>
            {post.tag}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 700, fontStyle: 'italic', color: 'white',
            lineHeight: 1.15, maxWidth: 800, letterSpacing: '-0.02em',
          }}>
            {post.title}
          </h1>
        </div>
      </section>

      {/* Blog Content with Sidebar TOC */}
      <section className="section" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          {/* Back to blog breadcrumb — separate nav component, outside article flow */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: 32 }}>
            <Link href="/blog" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, color: 'var(--gray-500)',
              transition: 'color 0.2s',
            }}>
              <ArrowLeftIcon /> Back to all articles
            </Link>
          </nav>
          <div className="blog-layout" style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: 60,
            alignItems: 'start',
          }}>
            {/* Sticky TOC Sidebar */}
            <aside style={{
              position: 'sticky', top: 100,
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
            }}>
              <button
                onClick={() => setTocOpen(!tocOpen)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '14px 16px',
                  background: 'var(--primary)', borderRadius: '10px 10px' + (tocOpen ? ' 0 0' : ' 10px 10px'),
                  border: 'none', cursor: 'pointer',
                  color: 'white', fontSize: 14, fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.02em',
                }}
              >
                Table of Contents
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  style={{ transform: tocOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {tocOpen && (
                <nav style={{
                  background: 'white',
                  border: '1px solid var(--gray-200)',
                  borderTop: 'none',
                  borderRadius: '0 0 10px 10px',
                  padding: '8px 0',
                }}>
                  {tocSections.map((section, i) => {
                    const isActive = activeId === section.id
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        style={{
                          display: 'block', width: '100%',
                          padding: `8px 16px 8px ${section.level === 3 ? '32px' : '16px'}`,
                          border: 'none', background: isActive ? 'var(--primary-ghost)' : 'transparent',
                          borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                          cursor: 'pointer', textAlign: 'left',
                          fontSize: section.level === 3 ? 12 : 13,
                          fontWeight: isActive ? 500 : 400,
                          color: isActive ? 'var(--primary)' : 'var(--gray-600)',
                          fontFamily: 'var(--font-body)',
                          lineHeight: 1.4,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {section.heading}
                      </button>
                    )
                  })}
                </nav>
              )}
            </aside>

            {/* Main Blog Content */}
            <article style={{ minWidth: 0 }}>
              {/* Intro */}
              {post.intro.map((p, i) => (
                <p key={i} style={{
                  fontSize: 17, lineHeight: 1.85, color: 'var(--gray-700)',
                  marginBottom: 20, fontFamily: 'var(--font-body)',
                }}>
                  {p}
                </p>
              ))}

              {/* Sections */}
              {post.sections.map((section, i) => (
                <div key={section.id} style={{ marginTop: i === 0 && post.intro.length > 0 ? 40 : 36 }}>
                  {section.level === 2 ? (
                    <h2
                      id={section.id}
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(22px, 2.5vw, 30px)',
                        fontWeight: 500,
                        color: 'var(--gray-900)',
                        lineHeight: 1.3,
                        marginBottom: 16,
                        paddingTop: 8,
                        borderBottom: section.heading.toLowerCase().includes("faq") ? 'none' : undefined,
                      }}
                    >
                      {section.heading}
                    </h2>
                  ) : (
                    <h3
                      id={section.id}
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(17px, 2vw, 22px)',
                        fontWeight: 500,
                        color: 'var(--gray-800)',
                        lineHeight: 1.35,
                        marginBottom: 12,
                        paddingTop: 4,
                      }}
                    >
                      {section.heading}
                    </h3>
                  )}

                  {section.content.map((text, j) => {
                    // Detect FAQ Q&A patterns — split multi-QA paragraphs
                    if (section.heading.toLowerCase().includes("faq")) {
                      const qaPairs = splitFaqText(text)
                      if (qaPairs.length > 0) {
                        return (
                          <div key={j}>
                            {qaPairs.map((qa, qi) => {
                              const faqKey = `${j}-${qi}`
                              const isOpen = expandedFaqs.has(faqKey)
                              return (
                                <div key={qi} style={{
                                  marginBottom: 8,
                                  borderRadius: 'var(--radius-md)',
                                  border: '1px solid var(--gray-200)',
                                  overflow: 'hidden',
                                  transition: 'border-color 0.2s ease',
                                  borderColor: isOpen ? '#00B5D6' : 'var(--gray-200)',
                                }}>
                                  <button
                                    onClick={() => toggleFaq(faqKey)}
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-answer-${faqKey}`}
                                    style={{
                                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                      width: '100%', padding: '18px 24px',
                                      background: isOpen ? 'var(--primary-ghost)' : 'var(--gray-50)',
                                      border: 'none', cursor: 'pointer', textAlign: 'left',
                                      gap: 16, transition: 'background 0.2s ease',
                                    }}
                                  >
                                    <span style={{
                                      fontSize: 15, fontWeight: 600, color: 'var(--gray-900)',
                                      lineHeight: 1.5, flex: 1,
                                    }}>
                                      {qa.question}
                                    </span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                      viewBox="0 0 24 24" stroke="#00B5D6" strokeWidth={2.5}
                                      style={{
                                        flexShrink: 0,
                                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                                        transition: 'transform 0.3s ease',
                                      }}
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                  {isOpen && (
                                    <div
                                      id={`faq-answer-${faqKey}`}
                                      role="region"
                                      style={{
                                      padding: '0 24px 20px',
                                      background: 'white',
                                    }}>
                                      <p style={{
                                        fontSize: 15, lineHeight: 1.75, color: 'var(--gray-600)',
                                        paddingTop: 12,
                                      }}>
                                        {qa.answer}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )
                      }
                    }

                    // Check for bullet-like content
                    if (text.includes(' • ') || text.includes(' · ')) {
                      const items = text.split(/\s[•·]\s/)
                      if (items.length > 1) {
                        return (
                          <ul key={j} style={{
                            paddingLeft: 20, marginBottom: 16,
                          }}>
                            {items.map((item, k) => (
                              <li key={k} style={{
                                fontSize: 15, lineHeight: 1.75, color: 'var(--gray-700)',
                                marginBottom: 6,
                              }}>
                                {item.trim()}
                              </li>
                            ))}
                          </ul>
                        )
                      }
                    }

                    // Check for inline ALL CAPS headings within paragraphs
                    const segments = splitInlineHeadings(text)
                    if (segments.length > 0) {
                      return (
                        <div key={j}>
                          {segments.map((seg, si) => seg.type === 'heading' ? (
                            <h4 key={si} style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: 'clamp(16px, 1.8vw, 20px)',
                              fontWeight: 500,
                              color: 'var(--gray-800)',
                              lineHeight: 1.35,
                              marginTop: 24,
                              marginBottom: 10,
                              paddingTop: 4,
                            }}>
                              {seg.content}
                            </h4>
                          ) : (
                            <p key={si} style={{
                              fontSize: 16, lineHeight: 1.85, color: 'var(--gray-700)',
                              marginBottom: 16, fontFamily: 'var(--font-body)',
                            }}>
                              {seg.content}
                            </p>
                          ))}
                        </div>
                      )
                    }

                    return (
                      <p key={j} style={{
                        fontSize: 16, lineHeight: 1.85, color: 'var(--gray-700)',
                        marginBottom: 16, fontFamily: 'var(--font-body)',
                      }}>
                        {text}
                      </p>
                    )
                  })}
                </div>
              ))}

              {/* CTA at bottom */}
              <div style={{
                marginTop: 60, padding: '40px 36px',
                background: 'var(--primary)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
              }}>
                <h3 style={{
                  fontSize: 'clamp(20px, 2.5vw, 28px)',
                  fontWeight: 400, color: 'white',
                  marginBottom: 20, fontFamily: 'var(--font-display)',
                }}>
                  See What Your Practice Is Leaving on the Table
                </h3>
                <Link href="/contact" className="btn-primary" style={{
                  background: 'white', color: '#00B5D6',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                }}>
                  Get Your Free Revenue Analysis
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} width={18} height={18}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

    </>
  )
}
