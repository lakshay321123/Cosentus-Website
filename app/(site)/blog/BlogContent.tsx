'use client'

import { useState } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import { blogPosts } from '@/data/blogPosts'

const allTags = ['All', ...Array.from(new Set(blogPosts.map(b => b.tag))).sort()]

export default function BlogContent() {
  const [activeTag, setActiveTag] = useState('All')

  const filtered = activeTag === 'All' ? blogPosts : blogPosts.filter(b => b.tag === activeTag)

  return (
    <>
      {/* Tag Filters */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <RevealOnScroll>
            <div className="blog-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 48 }}>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  style={{
                    padding: '8px 18px',
                    background: activeTag === tag ? 'var(--primary)' : 'var(--white)',
                    color: activeTag === tag ? 'white' : 'var(--gray-600)',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: activeTag === tag ? 500 : 400,
                    border: `1px solid ${activeTag === tag ? 'var(--primary)' : 'var(--gray-200)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'var(--font-body)',
                    whiteSpace: 'nowrap' as const,
                    flexShrink: 0,
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {filtered.map((blog, i) => (
              <Link
                key={blog.slug}
                href={`/blog/${blog.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
              >
                <article style={{
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-200)',
                  overflow: 'hidden',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                }}>
                  <div style={{ height: 4, background: 'var(--primary)' }} />
                  <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      background: 'var(--primary-ghost)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 11,
                      fontWeight: 500,
                      color: 'var(--primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 16,
                      alignSelf: 'flex-start',
                    }}>{blog.tag}</span>
                    <h3 style={{ fontSize: 17, fontWeight: 500, color: 'var(--gray-900)', lineHeight: 1.4, marginBottom: 12 }}>
                      {blog.title}
                    </h3>
                    <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.6, flex: 1, marginBottom: 20 }}>
                      {blog.excerpt}
                    </p>
                    <span style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 400, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      Read Article
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--gray-500)', padding: 60, fontSize: 16 }}>
              No articles found for this category.
            </p>
          )}
        </div>
      </section>
    </>
  )
}
