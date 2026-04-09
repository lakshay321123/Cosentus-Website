'use client'

import { useState } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import { blogPosts } from '@/data/blogPosts'

const allTags = ['All', ...Array.from(new Set(blogPosts.map(p => p.tag)))]

export default function BlogContent() {
  const [activeTag, setActiveTag] = useState('All')

  const filtered = activeTag === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.tag === activeTag)

  return (
    <section className="section">
      <div className="container">
        {/* Tag Filter */}
        <RevealOnScroll>
          <div className="blog-tags" style={{
            display: 'flex', flexWrap: 'wrap', gap: 10,
            marginBottom: 48,
          }}>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 20,
                  border: `1px solid ${activeTag === tag ? 'var(--primary)' : 'var(--gray-200)'}`,
                  background: activeTag === tag ? 'var(--primary)' : 'var(--white)',
                  color: activeTag === tag ? 'white' : 'var(--gray-700)',
                  fontSize: 13,
                  fontWeight: activeTag === tag ? 500 : 400,
                  fontFamily: 'var(--font-display)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </RevealOnScroll>

        {/* Blog Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(360px, 100%), 1fr))',
          gap: 24,
        }}>
          {filtered.map((post, i) => (
            <RevealOnScroll key={post.slug} delay={Math.min(i * 0.08, 0.5)}>
              <Link
                href={`/blog/${post.slug}`}
                style={{
                  display: 'flex', flexDirection: 'column',
                  height: '100%',
                  padding: 28,
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-200)',
                  textDecoration: 'none',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  overflow: 'hidden',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(-6px)'
                  el.style.boxShadow = '0 16px 40px rgba(0,181,214,0.12)'
                  el.style.borderColor = '#00B5D6'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                  el.style.borderColor = 'var(--gray-200)'
                }}
              >
                <div style={{
                  display: 'inline-block', padding: '4px 12px',
                  background: 'var(--primary-ghost)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 11, fontWeight: 500,
                  color: 'var(--primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 14,
                  alignSelf: 'flex-start',
                }}>
                  {post.tag}
                </div>

                <h3 style={{
                  fontSize: 18, fontWeight: 500,
                  color: 'var(--gray-900)',
                  lineHeight: 1.35,
                  marginBottom: 12,
                  fontFamily: 'var(--font-display)',
                }}>
                  {post.title}
                </h3>

                <p style={{
                  fontSize: 14, lineHeight: 1.65,
                  color: 'var(--gray-600)',
                  flex: 1,
                  marginBottom: 16,
                }}>
                  {post.excerpt}
                </p>

                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 13, fontWeight: 500, color: 'var(--primary)',
                  fontFamily: 'var(--font-display)',
                }}>
                  Read Article
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-500)' }}>
            <p style={{ fontSize: 18 }}>No blog posts found for this category.</p>
          </div>
        )}
      </div>
    </section>
  )
}
