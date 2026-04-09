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

export default function BlogPostContent({ post }: { post: BlogPost }) {
  const [activeId, setActiveId] = useState<string>('')
  const [tocOpen, setTocOpen] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)

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
  const tocSections = post.sections.filter(s => s.heading.toLowerCase() !== "faq's" || s.content.length > 0)

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
        <video autoPlay muted loop playsInline style={{
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
          <Link href="/blog" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 20,
            transition: 'color 0.2s',
          }}>
            <ArrowLeftIcon /> Back to Blog
          </Link>
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
      <section className="section" style={{ paddingTop: 60, paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div style={{
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
                    // Detect FAQ Q&A patterns
                    if (section.heading.toLowerCase().includes("faq")) {
                      // Check if text contains a question followed by answer
                      const qaMatch = text.match(/^(.+\?)\s+(.+)$/)
                      if (qaMatch) {
                        return (
                          <div key={j} style={{
                            marginBottom: 20, padding: '20px 24px',
                            background: 'var(--gray-50)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--gray-200)',
                          }}>
                            <p style={{
                              fontSize: 15, fontWeight: 600, color: 'var(--gray-900)',
                              marginBottom: 8, lineHeight: 1.5,
                            }}>
                              {qaMatch[1]}
                            </p>
                            <p style={{
                              fontSize: 15, lineHeight: 1.75, color: 'var(--gray-600)',
                            }}>
                              {qaMatch[2]}
                            </p>
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

      {/* Responsive: stack TOC above content on mobile */}
      <style jsx>{`
        @media (max-width: 900px) {
          aside {
            position: static !important;
            max-height: none !important;
          }
        }
      `}</style>
    </>
  )
}
