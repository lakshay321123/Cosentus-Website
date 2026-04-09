'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import CTASection from '@/components/sections/CTASection'
import { newsArticles, NewsArticle } from '@/data/newsArticles'

interface NewsArticleContentProps {
  article: NewsArticle
}

function getSafeExternalUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : null
  } catch {
    return null
  }
}

function renderMarkdown(text: string) {
  if (!text) return null
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      elements.push(<br key={key++} />)
      continue
    }

    // H2
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={key++} style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(20px, 2.5vw, 28px)',
          fontWeight: 400,
          color: 'var(--gray-900)',
          marginTop: 40,
          marginBottom: 16,
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
        }}>
          {formatInline(trimmed.slice(3))}
        </h2>
      )
      continue
    }

    // H3
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={key++} style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(17px, 2vw, 22px)',
          fontWeight: 500,
          color: 'var(--gray-900)',
          marginTop: 32,
          marginBottom: 12,
          lineHeight: 1.4,
        }}>
          {formatInline(trimmed.slice(4))}
        </h3>
      )
      continue
    }

    // H4
    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4 key={key++} style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(16px, 1.8vw, 20px)',
          fontWeight: 500,
          color: 'var(--gray-900)',
          marginTop: 28,
          marginBottom: 10,
          lineHeight: 1.4,
        }}>
          {formatInline(trimmed.slice(5))}
        </h4>
      )
      continue
    }

    // Bullet points
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      elements.push(
        <div key={key++} style={{
          display: 'flex',
          gap: 12,
          marginBottom: 8,
          paddingLeft: 8,
        }}>
          <span style={{ color: 'var(--primary)', fontWeight: 600, flexShrink: 0 }}>•</span>
          <p style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: 'var(--gray-700)',
          }}>
            {formatInline(trimmed.slice(2))}
          </p>
        </div>
      )
      continue
    }

    // Numbered lists (1. 2. 3. etc.)
    const numberedMatch = trimmed.match(/^(\d+)\.\s(.+)/)
    if (numberedMatch) {
      elements.push(
        <div key={key++} style={{
          display: 'flex',
          gap: 12,
          marginBottom: 8,
          paddingLeft: 8,
        }}>
          <span style={{ color: 'var(--primary)', fontWeight: 600, flexShrink: 0, minWidth: 20 }}>{numberedMatch[1]}.</span>
          <p style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: 'var(--gray-700)',
          }}>
            {formatInline(numberedMatch[2])}
          </p>
        </div>
      )
      continue
    }

    // Regular paragraph
    elements.push(
      <p key={key++} style={{
        fontSize: 16,
        lineHeight: 1.8,
        color: 'var(--gray-700)',
        marginBottom: 16,
      }}>
        {formatInline(trimmed)}
      </p>
    )
  }

  return elements
}

function formatInline(text: string): React.ReactNode {
  // Handle **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

export default function NewsArticleContent({ article }: NewsArticleContentProps) {
  const router = useRouter()
  const otherArticles = newsArticles.filter(a => a.slug !== article.slug)
  
  // Show tag-matched articles first, then fill remaining slots with recent articles
  const sameTag = otherArticles.filter(a => a.tag === article.tag)
  const differentTag = otherArticles.filter(a => a.tag !== article.tag)
  const relatedArticles = [...sameTag, ...differentTag].slice(0, 4)
  const safeSourceUrl = article.sourceUrl ? getSafeExternalUrl(article.sourceUrl) : null

  return (
    <main>
      {/* Hero */}
      <section style={{
        position: 'relative',
        minHeight: '40vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}>
        <video
          autoPlay muted loop playsInline
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        >
          <source src="/videos/hero-banner.mp4" type="video/mp4" />
        </video>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(0,30,50,0.8) 0%, rgba(0,80,100,0.65) 50%, rgba(0,40,60,0.75) 100%)',
          zIndex: 1,
        }} />
        <div className="hero-content" style={{ paddingTop: 140, paddingBottom: 50, position: 'relative', zIndex: 2, maxWidth: 'var(--container)', margin: '0 auto', width: '100%' }}>
          <RevealOnScroll>
            <button
              onClick={() => router.push('/news')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-sm)',
                color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'var(--font-display)',
                cursor: 'pointer', marginBottom: 24,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back to News
            </button>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              <span style={{
                padding: '4px 12px', background: 'rgba(0,181,214,0.2)', borderRadius: 'var(--radius-sm)',
                fontSize: 11, fontWeight: 500, color: '#00B5D6', textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>{article.tag}</span>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{article.date}</span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, fontStyle: 'italic',
              letterSpacing: '-0.02em', lineHeight: 1.1, color: 'white', marginBottom: 16,
              maxWidth: 900,
            }}>
              {article.title}
            </h1>
          </RevealOnScroll>

          {article.featuredIn && (
            <RevealOnScroll delay={0.3}>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>
                Featured in — {article.featuredIn}
                {article.featuredDate && ` | ${article.featuredDate}`}
              </p>
            </RevealOnScroll>
          )}
        </div>
      </section>

      {/* Article Body */}
      <section className="section" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <RevealOnScroll>
            <article>
              {renderMarkdown(article.body)}
            </article>
          </RevealOnScroll>

          {safeSourceUrl && (
            <RevealOnScroll delay={0.1}>
              <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--gray-200)' }}>
                <a
                  href={safeSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                >
                  Read Original Source
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </RevealOnScroll>
          )}


        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="section section-alt" style={{ paddingTop: 60, paddingBottom: 60 }}>
          <div className="container">
            <RevealOnScroll>
              <div className="section-label">MORE NEWS</div>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <div className="section-title" style={{ marginBottom: 32 }}>Related Articles</div>
            </RevealOnScroll>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {relatedArticles.map((related, i) => (
                <RevealOnScroll key={related.slug} delay={0.15 + i * 0.1}>
                  <Link href={`/news/${encodeURIComponent(related.slug)}`} style={{ textDecoration: 'none' }}>
                    <div className="case-card" style={{
                      padding: '28px 24px', background: 'white',
                      border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)',
                      height: '100%', display: 'flex', flexDirection: 'column',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'pointer',
                    }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 8px', background: 'var(--primary-ghost)',
                        borderRadius: 'var(--radius-sm)', fontSize: 10, fontWeight: 500,
                        color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em',
                        marginBottom: 10, alignSelf: 'flex-start',
                      }}>{related.tag}</span>
                      <h4 style={{ fontSize: 15, fontWeight: 400, color: 'var(--gray-900)', lineHeight: 1.5, flex: 1 }}>
                        {related.title}
                      </h4>
                      <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 12 }}>{related.date}</p>
                    </div>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </main>
  )
}
