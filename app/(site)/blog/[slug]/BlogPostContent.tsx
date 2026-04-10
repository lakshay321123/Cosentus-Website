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

// Split text that contains inline headings (ALL CAPS or Title Case) into segments
// Catches: "some text. INLINE HEADING More text", "text. Title Case Heading More text",
// and headings at string start or end
function splitInlineHeadings(text: string): { type: 'text' | 'heading'; content: string }[] {
  // Skip short text or FAQ content
  if (text.length < 60) return []

  const smallWords = new Set(['a','an','the','and','but','or','nor','for','yet','so','in','on','at','to','by','of','up','as','is','it','vs','with','&'])
  const segments: { type: 'text' | 'heading'; content: string }[] = []
  const headingPositions: { start: number; end: number; text: string }[] = []

  // Pattern 1: ALL CAPS headings (2+ words, each 2+ uppercase letters)
  // Can appear after sentence boundary, at start, or after numbered prefix
  const capsRegex = /(?:^|[.!?]\s+|(?:\d+\.)\s*)([A-Z][A-Z&]+(?:[\s/]+(?:[A-Z][A-Z&]+|AND|OR|OF|IN|FOR|THE|TO|A|AN|AT|ON|BY|VS|WITH|IS|IT|&))+[?:.]?)/g
  let m
  while ((m = capsRegex.exec(text)) !== null) {
    const h = m[1].trim()
    if (h.endsWith(':')) continue  // Skip list item labels
    // Must be at least 2 real caps words and 10+ chars
    const capWords = h.split(/[\s/]+/).filter(w => /^[A-Z]{2,}/.test(w.replace(/[?:.&]/, '')))
    if (capWords.length >= 2 && h.length >= 10) {
      const hStart = m.index + m[0].indexOf(m[1])
      headingPositions.push({ start: hStart, end: hStart + h.length, text: h })
    }
  }

  // Pattern 2: Title Case headings at the END of text (after period, no period at end)
  // e.g., "...some sentence. Revenue Cycle Management Strategies"
  const titleEndRegex = /[.!?]\s+((?:[A-Z][a-zA-Z]+(?:\s+(?:and|or|of|in|for|the|to|a|an|at|on|by|vs|with|&)\s+)*)+[A-Z][a-zA-Z]+[?:]?)\s*$/g
  while ((m = titleEndRegex.exec(text)) !== null) {
    const h = m[1].trim()
    const words = h.split(/\s+/)
    const capWords = words.filter(w => /^[A-Z]/.test(w) && !smallWords.has(w.toLowerCase()))
    // Must be 3+ capitalized words, 20+ chars, and NOT look like a regular sentence
    if (capWords.length >= 3 && h.length >= 20 && !h.includes(',') && !/\b(is|are|was|were|has|have|had|will|would|can|could|should|may|might)\b/i.test(h)) {
      const hStart = m.index + m[0].indexOf(m[1])
      // Check no overlap with existing ALL CAPS matches
      const overlaps = headingPositions.some(p => hStart >= p.start && hStart < p.end)
      if (!overlaps) {
        headingPositions.push({ start: hStart, end: hStart + h.length, text: h })
      }
    }
  }

  // Pattern 3: Title Case headings mid-text (after period, followed by body text)
  // e.g., "...some sentence. Categorize Every Denial Immediately The foundation..."
  // EXCLUDES colon-ending matches (those are list item labels like "Fewer Billing Errors:")
  const titleMidRegex = /[.!?]\s+((?:[A-Z][a-z]+\s+){2,}[A-Z][a-z]+[?]?)\s+(?=[A-Z])/g
  while ((m = titleMidRegex.exec(text)) !== null) {
    const h = m[1].trim()
    if (h.endsWith(':')) continue  // Skip list item labels
    const words = h.split(/\s+/)
    const capWords = words.filter(w => /^[A-Z]/.test(w) && !smallWords.has(w.toLowerCase()))
    if (capWords.length >= 3 && h.length >= 20 && !h.includes(',')) {
      const hStart = m.index + m[0].indexOf(m[1])
      const overlaps = headingPositions.some(p =>
        (hStart >= p.start && hStart < p.end) || (p.start >= hStart && p.start < hStart + h.length)
      )
      if (!overlaps) {
        headingPositions.push({ start: hStart, end: hStart + h.length, text: h })
      }
    }
  }

  if (headingPositions.length === 0) return []

  // Sort by position
  headingPositions.sort((a, b) => a.start - b.start)

  // Build segments
  let lastIdx = 0
  for (const hp of headingPositions) {
    const before = text.slice(lastIdx, hp.start).trim()
    if (before) segments.push({ type: 'text', content: before })

    // Convert to Title Case — preserve known acronyms
    const acronyms = new Set(['IT','AI','AR','RCM','EHR','EMR','CMS','CPT','ICD','ASC','API','HIPAA','ACO','VBS','FHIR','OB','GYN','DME','ERA','EOB','RPM','RTM','IoT','HCPCS','NCCI','MUE','PFS','MPFS','PAYGO','MIPS','DSO','FPA','CARC','RARC'])
    const titleCase = hp.text.replace(/[?:.]$/, '').split(/[\s/]+/).map((w, i) => {
      const cleaned = w.replace(/[?:.]/g, '')
      // Preserve known acronyms
      if (acronyms.has(cleaned)) return cleaned
      if (smallWords.has(w.toLowerCase()) && i > 0) return w.toLowerCase()
      if (/^[A-Z]{2,}$/.test(cleaned)) return w.charAt(0) + w.slice(1).toLowerCase()
      return w
    }).join(' ')
    const suffix = hp.text.match(/[?:]$/)?.[0] || ''
    segments.push({ type: 'heading', content: titleCase + suffix })

    lastIdx = hp.end
  }

  const remaining = text.slice(lastIdx).trim()
  if (remaining) segments.push({ type: 'text', content: remaining })

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
              {/* Share Buttons */}
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gray-500)', marginBottom: 10 }}>Share</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { label: 'LinkedIn', color: '#0A66C2', icon: 'M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zM.02 24h4.96V7.5H.02V24zm7.66-16.5h4.76v2.255h.066c.663-1.255 2.283-2.575 4.698-2.575C21.756 7.18 24 9.75 24 14.69V24h-4.98v-8.26c0-1.97-.036-4.5-2.742-4.5-2.746 0-3.165 2.145-3.165 4.36V24H8.14V7.5h-.46z', url: (slug: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://cosentus.com/blog/${slug}`)}` },
                    { label: 'Facebook', color: '#1877F2', icon: 'M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.47h-2.796v8.384C19.612 22.954 24 17.99 24 12z', url: (slug: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://cosentus.com/blog/${slug}`)}` },
                    { label: 'X', color: '#000000', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z', url: (slug: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://cosentus.com/blog/${slug}`)}&text=${encodeURIComponent('Check out this article from Cosentus')}` },
                  ].map((s) => (
                    <a key={s.label} href={s.url(post.slug)} target="_blank" rel="noopener noreferrer" title={`Share on ${s.label}`}
                      style={{ width: 36, height: 36, borderRadius: 8, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d={s.icon} /></svg>
                    </a>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Blog Content */}
            <article style={{ minWidth: 0 }}>
              {/* Intro */}
              {post.intro.map((p, i) => (
                <p key={i} style={{
                  fontSize: 16, lineHeight: 1.8, color: 'var(--gray-700)',
                  marginBottom: 16, fontFamily: 'var(--font-body)',
                }}>
                  {p}
                </p>
              ))}

              {/* Sections */}
              {post.sections.map((section, i) => (
                <div key={section.id}>
                <div style={{ marginTop: i === 0 && post.intro.length > 0 ? 40 : 36 }}>
                  {section.level === 2 ? (
                    <h2
                      id={section.id}
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 16,
                        fontWeight: 700,
                        color: 'var(--gray-900)',
                        lineHeight: 1.75,
                        marginBottom: 12,
                        marginTop: 36,
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        borderLeft: '3px solid var(--primary)',
                        paddingLeft: 16,
                        marginLeft: 4,
                      }}
                    >
                      {section.heading}
                    </h2>
                  ) : (
                    <h3
                      id={section.id}
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 16,
                        fontWeight: 600,
                        color: 'var(--gray-900)',
                        lineHeight: 1.75,
                        marginBottom: 10,
                        marginTop: 28,
                        borderLeft: '3px solid var(--primary)',
                        paddingLeft: 16,
                        marginLeft: 4,
                      }}
                    >
                      {section.heading}
                    </h3>
                  )}

                  {section.content.map((text, j) => {
                    // Detect standalone heading strings (split from paragraph endings)
                    // STRICT criteria: must look like a real section heading, not a list item label
                    if (text.length < 120 && text.length > 10 && !section.heading.toLowerCase().includes("faq")) {
                      const trimmed = text.trim()
                      
                      // NEVER treat as heading: ends with colon (list item label), 
                      // ends with comma, contains ":-", is a TOC entry with numbers
                      const isLabel = trimmed.endsWith(':') || trimmed.endsWith(',') || trimmed.includes(':-') || /^\d+\.\s/.test(trimmed)
                      
                      if (!isLabel) {
                        const clean = trimmed.replace(/[?]/g, '').trim()
                        const words = clean.split(/\s+/)
                        const hasNoPeriod = !clean.includes('.')
                        
                        // ALL CAPS heading (2+ uppercase words, 10+ chars) — always a heading
                        const allCapsWords = words.filter(w => /^[A-Z]{2,}$/.test(w.replace(/[?&]/g, '')))
                        const isAllCaps = allCapsWords.length >= 2 && clean.length >= 10
                        
                        // Title Case heading — STRICT: must be 3+ words, mostly capitalized,
                        // must start with a "heading word" pattern (What/How/Why/The/Key/Best/Top/Overview/Benefits etc.)
                        const headingStarters = /^(What|How|Why|Where|When|Who|Which|The|Key|Best|Top|Overview|Benefits|Challenges|Tips|Role|Impact|Understanding|Importance|Steps|Types|Common|Introduction|Conclusion|Summary|Final|Revenue|Practice|Patient|Medical|Clinical|Billing|Coding|Denial|Payment|Insurance|Healthcare|Regulatory|Compliance|Technology|Data|Staff|Operational)/i
                        const capWords = words.filter(w => /^[A-Z]/.test(w))
                        const isTitle = words.length >= 3 && words.length <= 12 && hasNoPeriod 
                          && capWords.length >= Math.ceil(words.length * 0.6)
                          && headingStarters.test(clean)
                          && !clean.includes(',')
                        
                        if (isAllCaps || isTitle) {
                          const displayText = isAllCaps ? clean.split(/\s+/).map((w, wi) => {
                            const lo = w.toLowerCase()
                            const smalls = ['a','an','the','and','but','or','nor','for','yet','so','in','on','at','to','by','of','up','as','is','vs','with']
                            if (wi > 0 && smalls.includes(lo)) return lo
                            if (/^[A-Z]{2,}$/.test(w.replace(/[?&]/g, ''))) return w.charAt(0) + w.slice(1).toLowerCase()
                            return w
                          }).join(' ') + (trimmed.endsWith('?') ? '?' : '') : trimmed

                          return (
                            <h4 key={j} style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: 16,
                              fontWeight: 600,
                              color: 'var(--gray-900)',
                              lineHeight: 1.75,
                              marginTop: 24,
                              marginBottom: 8,
                              borderLeft: '3px solid var(--primary)',
                              paddingLeft: 16,
                              marginLeft: 4,
                            }}>
                              {displayText}
                            </h4>
                          )
                        }
                      }
                      
                      // Colon-ending labels: render as bold inline text, not a heading
                      if (trimmed.endsWith(':') && trimmed.length < 80) {
                        return (
                          <p key={j} style={{
                            fontSize: 16, lineHeight: 1.8, color: 'var(--gray-900)',
                            marginTop: 20, marginBottom: 6, fontWeight: 600,
                          }}>
                            {trimmed}
                          </p>
                        )
                      }
                    }

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
                                      fontSize: 16, fontWeight: 600, color: 'var(--gray-900)',
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
                                        fontSize: 16, lineHeight: 1.75, color: 'var(--gray-600)',
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
                          <div key={j} style={{ marginBottom: 16 }}>
                            {items.map((item, k) => (
                              <div key={k} style={{
                                borderLeft: '3px solid var(--primary)',
                                paddingLeft: 16,
                                marginBottom: 8,
                                marginLeft: 4,
                              }}>
                                <p style={{
                                  fontSize: 16, lineHeight: 1.75, color: 'var(--gray-700)',
                                }}>
                                  {item.trim()}
                                </p>
                              </div>
                            ))}
                          </div>
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
                              fontSize: 16,
                              fontWeight: 600,
                              color: 'var(--gray-900)',
                              lineHeight: 1.75,
                              marginTop: 24,
                              marginBottom: 8,
                              borderLeft: '3px solid var(--primary)',
                              paddingLeft: 16,
                              marginLeft: 4,
                            }}>
                              {seg.content}
                            </h4>
                          ) : (
                            <p key={si} style={{
                              fontSize: 16, lineHeight: 1.8, color: 'var(--gray-700)',
                              marginBottom: 16,
                            }}>
                              {seg.content}
                            </p>
                          ))}
                        </div>
                      )
                    }

                    return (
                      <p key={j} style={{
                        fontSize: 16, lineHeight: 1.8, color: 'var(--gray-700)',
                        marginBottom: 16,
                      }}>
                        {text}
                      </p>
                    )
                  })}
                </div>
                {/* Blog image after this section */}
                {post.images?.filter(img => img.afterSection === i).map((img, imgIdx) => (
                  <figure key={`img-${i}-${imgIdx}`} style={{ margin: '32px 0', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}>
                    <img src={img.url} alt={img.alt} loading="lazy" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 400, objectFit: 'cover' }} />
                    {img.caption && (
                      <figcaption style={{ padding: '12px 16px', fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5, fontStyle: 'italic', borderTop: '1px solid var(--gray-200)' }}>
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
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
