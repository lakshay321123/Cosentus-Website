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
            {filtered.map((blog) => (
              <Link
                key={blog.slug}
                href={`/blog/${blog.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
              >
                <article className="blog-card" style={{
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  width: '100%',
                  position: 'relative',
                  aspectRatio: '4 / 3',
                  cursor: 'pointer',
                  border: '1px solid var(--gray-200)',
                }}>
                  {/* Cover image */}
                  {blog.images?.[0] && (
                    <img
                      src={blog.images[0].url}
                      alt={blog.title}
                      loading="lazy"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)' }}
                      className="blog-card-img"
                    />
                  )}

                  {/* Tag badge — top left */}
                  <span style={{
                    position: 'absolute', top: 16, left: 16, zIndex: 3,
                    padding: '5px 14px',
                    background: 'var(--primary)',
                    borderRadius: 20,
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}>{blog.tag}</span>

                  {/* Bottom gradient overlay + title */}
                  <div className="blog-card-overlay" style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(transparent 0%, rgba(0,0,0,0.75) 100%)',
                    padding: '60px 20px 20px',
                    transition: 'padding 0.4s cubic-bezier(0.16,1,0.3,1)',
                    zIndex: 2,
                  }}>
                    <h3 style={{
                      fontSize: 16, fontWeight: 600, color: 'white',
                      lineHeight: 1.4, margin: 0,
                      fontFamily: 'var(--font-display)',
                    }}>
                      {blog.title}
                    </h3>
                    <span className="blog-card-cta" style={{
                      fontSize: 13, color: '#68D1E6', fontWeight: 500,
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      marginTop: 8, opacity: 0,
                      transform: 'translateY(8px)',
                      transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s',
                    }}>
                      Read Article
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <style jsx global>{`
            .blog-card:hover .blog-card-img { transform: scale(1.05); }
            .blog-card:hover .blog-card-overlay { padding-bottom: 24px; }
            .blog-card:hover .blog-card-cta { opacity: 1 !important; transform: translateY(0) !important; }
            @media (max-width: 768px) {
              .blog-card { aspect-ratio: 3 / 2 !important; }
            }
          `}</style>
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
