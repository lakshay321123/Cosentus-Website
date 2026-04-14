'use client'

import Link from 'next/link'
import MotionReveal from '@/components/ui/MotionReveal'
import { newsArticlesMeta } from '@/data/newsArticles'

export default function NewsListContent() {
  return (
    <section className="section">
      <div className="container">
        <MotionReveal>
          <div className="section-label">LATEST NEWS</div>
        </MotionReveal>
        <MotionReveal delay={0.1}>
          <div className="section-title">Healthcare RCM, AI & Medical Billing Updates</div>
        </MotionReveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 48 }}>
          {newsArticlesMeta.map((article, i) => (
            <MotionReveal key={article.slug} delay={Math.min(i * 0.05, 0.4)}>
              <Link href={`/news/${encodeURIComponent(article.slug)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article style={{
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr auto',
                  gap: 24,
                  padding: '28px 0',
                  borderBottom: '1px solid var(--gray-200)',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                className="news-row"
                >
                  <div style={{ fontSize: 14, color: 'var(--gray-500)', fontWeight: 400 }}>
                    {article.date}
                  </div>
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      background: 'var(--primary-ghost)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 11,
                      fontWeight: 500,
                      color: 'var(--primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: 8,
                    }}>{article.tag}</span>
                    <h3 style={{ fontSize: 17, fontWeight: 400, color: 'var(--gray-900)', lineHeight: 1.5 }}>
                      {article.title}
                    </h3>
                    {article.featuredIn && (
                      <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 6 }}>
                        Featured in {article.featuredIn}
                      </p>
                    )}
                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--gray-400)" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </article>
              </Link>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
