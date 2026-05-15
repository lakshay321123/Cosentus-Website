'use client'

import { useState } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import InsightCard, { InsightCardData } from '@/components/insights/InsightCard'
import { blogPosts } from '@/data/blogPosts'
import { newsArticles } from '@/data/newsArticles'
import { eventsData } from '@/data/eventsData'

// ---------- Data — pulled live from the same sources as /insights ----------

const caseStudyItems: InsightCardData[] = [
  {
    href: '/case-studies',
    title: '15-surgeon ASC. Days in AR 75 → 37. Clean claims 83% → 98%. Collections doubled.',
    image: '/images/homepage/surgery-center.jpg',
    tag: 'ASC',
  },
  {
    href: '/case-studies',
    title: 'Multi-modality pain clinic. E&M documentation + ultrasound coding + electronic WC submission. 26% revenue increase.',
    image: '/images/homepage/doctor-consult.jpg',
    tag: 'Pain Management',
  },
  {
    href: '/case-studies',
    title: '$1.5M to $2.2M. Workers\u2019 Comp turnaround cut from 45 to 28 days.',
    image: '/images/homepage/medical-tech.jpg',
    tag: 'Orthopedic',
  },
]

const blogItems: InsightCardData[] = blogPosts.slice(0, 3).map(p => ({
  href: `/blog/${p.slug}`,
  title: p.title,
  image: p.coverImage,
  tag: p.tag,
}))

const newsItems: InsightCardData[] = [...newsArticles]
  .sort((a, b) => (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0))
  .slice(0, 3)
  .map(a => ({
    href: `/news/${encodeURIComponent(a.slug)}`,
    title: a.title,
    date: a.date,
    tag: a.tag,
    image: a.coverImage,
  }))

const eventItems: InsightCardData[] = [...eventsData]
  .sort((a, b) => b.sortDate.localeCompare(a.sortDate))
  .slice(0, 3)
  .map(e => ({
    href: `/events#${e.slug}`,
    title: e.title,
    date: e.date,
    tag: e.tag,
    image: e.photos?.[0],
  }))

type TabKey = 'cases' | 'blog' | 'news' | 'events'

const tabs: { key: TabKey; label: string; items: InsightCardData[]; ctaLabel: string; viewAllHref: string; viewAllLabel: string }[] = [
  { key: 'cases',  label: 'Client Success', items: caseStudyItems, ctaLabel: 'Read Client Success Story', viewAllHref: '/case-studies', viewAllLabel: 'View All Client Success Stories' },
  { key: 'blog',   label: 'Blog',           items: blogItems,      ctaLabel: 'Read Article',              viewAllHref: '/blog',          viewAllLabel: 'View All Blog Posts' },
  { key: 'news',   label: 'News',           items: newsItems,      ctaLabel: 'Read More',                 viewAllHref: '/news',          viewAllLabel: 'View All News' },
  { key: 'events', label: 'Events',         items: eventItems,     ctaLabel: 'View Event',                viewAllHref: '/events',        viewAllLabel: 'View All Events' },
]

export default function InsightsTabsSection() {
  const [activeKey, setActiveKey] = useState<TabKey>('cases')
  const active = tabs.find(t => t.key === activeKey)!

  return (
    <section className="section section-alt" style={{ overflow: 'hidden' }}>
      <div className="container">
        <RevealOnScroll delay={0.1}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4.5vw, 56px)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--gray-900)',
            marginTop: 12,
            marginBottom: 36,
          }}>
            <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Insights.</span>
          </h2>
        </RevealOnScroll>

        {/* Tabs */}
        <RevealOnScroll delay={0.15}>
          <div
            role="tablist"
            aria-label="Insight categories"
            className="insights-tabs"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              gap: 10,
              marginBottom: 40,
            }}
          >
            {tabs.map(t => {
              const isActive = t.key === activeKey
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${t.key}`}
                  id={`tab-${t.key}`}
                  onClick={() => setActiveKey(t.key)}
                  className={`insights-tab${isActive ? ' insights-tab-active' : ''}`}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </RevealOnScroll>

        {/* Active tab panel, keyed so it remounts (gentle fade-in) on tab change */}
        <div
          key={activeKey}
          role="tabpanel"
          id={`tabpanel-${activeKey}`}
          aria-labelledby={`tab-${activeKey}`}
          style={{ animation: 'tab-fadein 0.45s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {active.items.length === 0 ? (
            <div style={{
              padding: '48px 32px',
              background: 'var(--white)',
              border: '1px dashed var(--gray-300)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              color: 'var(--gray-500)',
              fontSize: 15,
            }}>
              New content coming soon.
            </div>
          ) : (
            <div className="insights-tabs-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
            }}>
              {active.items.map((item, i) => (
                <div key={`${activeKey}-${i}`} style={{
                  height: '100%',
                  animation: `tab-cardin 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.05 + i * 0.07}s backwards`,
                }}>
                  <InsightCard item={item} ctaLabel={active.ctaLabel} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA row, View this category's index + link to /insights hub */}
        <div className="insights-cta-row" style={{
          display: 'flex',
          justifyContent: 'flex-start',
          gap: 16,
          marginTop: 36,
          flexWrap: 'wrap',
        }}>
          <Link href={active.viewAllHref} className="btn-primary">
            <span className="cta-label-full">{active.viewAllLabel}</span>
            <span className="cta-label-short">View All</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link href="/insights" className="btn-primary">
            Browse All Insights
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes tab-fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes tab-cardin {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .insights-tabs-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 18px !important; }
        }
        @media (max-width: 580px) {
          /* Cards: horizontal scroll-snap carousel — one card visible + peek of next */
          .insights-tabs-grid {
            display: flex !important;
            grid-template-columns: none !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 14px !important;
            padding: 4px 4px 12px !important;
            margin: 0 -4px !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .insights-tabs-grid::-webkit-scrollbar { display: none; }
          .insights-tabs-grid > div {
            flex: 0 0 85% !important;
            scroll-snap-align: start;
          }
          /* View-All buttons: keep both on one row, share width evenly.
             Long labels like 'View All Client Success Stories' don't fit
             at 430px width — swap to short 'View All' on mobile via the
             paired .cta-label-full / .cta-label-short spans below. */
          .insights-cta-row { flex-wrap: nowrap !important; gap: 10px !important; }
          .insights-cta-row .btn-primary {
            flex: 1 1 0 !important;
            min-width: 0 !important;
            padding: 10px 12px !important;
            font-size: 14px !important;
            white-space: nowrap !important;
            justify-content: center !important;
          }
          .insights-cta-row .cta-label-full { display: none !important; }
          .insights-cta-row .cta-label-short { display: inline !important; }
          .insights-tabs { gap: 6px !important; }
          .insights-tab { padding: 9px 16px !important; font-size: 14px !important; }
        }
        /* Default (>580px): show full label, hide the short one. */
        .insights-cta-row .cta-label-full { display: inline; }
        .insights-cta-row .cta-label-short { display: none; }
      `}</style>
    </section>
  )
}
