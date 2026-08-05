import { SITE_URL } from '@/lib/site-url'
import { getAllBlogSlugs } from '@/data/blogPosts'
import { newsArticles } from '@/data/newsArticles'
import { LOCATIONS } from '../(site)/contact/_data/locations'
import { ANESTHESIA_LOCATIONS } from '../(site)/specialties/anesthesia/_data/locations'
import { RCM_LOCATIONS } from '../(site)/services/rcm/_data/locations'

/**
 * Shared sitemap logic for the restructured, index-based sitemap set.
 *
 * The site exposes four XML documents, all built here:
 *   /sitemap.xml        — master <sitemapindex> referencing the three children
 *   /pages-sitemap.xml   — static routes + per-location landing pages
 *   /blogs-sitemap.xml   — one entry per blog post (/blog/<slug>)
 *   /news-sitemap.xml    — one entry per news article (/news/<slug>)
 *
 * Every URL is emitted from SITE_URL, which is canonicalised to the non-www
 * apex origin (https://cosentus.com) in src/lib/site-url.ts. That single
 * source of truth guarantees no www URLs appear in any generated sitemap.
 *
 * These are plain string builders with no Next.js coupling so the output can
 * be validated in isolation; the route handlers under app/*-sitemap.xml/ are
 * thin wrappers that return these strings.
 */

export type ChangeFreq =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'

export interface SitemapEntry {
  loc: string
  lastmod?: string
  changefreq?: ChangeFreq
  priority?: number
}

export interface SitemapIndexEntry {
  loc: string
  lastmod?: string
}

const nowIso = (): string => new Date().toISOString()

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Sitemap priority must be rendered with a decimal (e.g. "1.0", "0.8", "0.85").
function formatPriority(priority: number): string {
  const s = priority.toString()
  return s.includes('.') ? s : `${s}.0`
}

/**
 * Website pages: static routes plus the per-location local-SEO landing pages.
 * Individual blog and news article URLs are intentionally excluded here — they
 * live in blogs-sitemap.xml and news-sitemap.xml respectively. The /blog and
 * /news list pages remain here because they are website pages, not articles.
 */
export function getPageEntries(lastmod: string = nowIso()): SitemapEntry[] {
  const staticRoutes: Array<Omit<SitemapEntry, 'lastmod'>> = [
    { loc: `${SITE_URL}/`, changefreq: 'weekly', priority: 1.0 },
    { loc: `${SITE_URL}/about`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${SITE_URL}/zeus-ai`, changefreq: 'monthly', priority: 0.9 },
    { loc: `${SITE_URL}/services/billing-coding`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${SITE_URL}/services/practice-management`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${SITE_URL}/services/rcm`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${SITE_URL}/services/ehr-technology`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${SITE_URL}/specialties/anesthesia`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${SITE_URL}/specialties/orthopedics`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${SITE_URL}/specialties/pain-management`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${SITE_URL}/specialties/asc`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${SITE_URL}/specialties/behavioral-health`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${SITE_URL}/specialties/multi-specialty`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${SITE_URL}/partnerships`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${SITE_URL}/insights`, changefreq: 'weekly', priority: 0.7 },
    { loc: `${SITE_URL}/blog`, changefreq: 'weekly', priority: 0.7 },
    { loc: `${SITE_URL}/news`, changefreq: 'weekly', priority: 0.6 },
    { loc: `${SITE_URL}/case-studies`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${SITE_URL}/events`, changefreq: 'weekly', priority: 0.5 },
    { loc: `${SITE_URL}/careers`, changefreq: 'monthly', priority: 0.6 },
    { loc: `${SITE_URL}/cosentus-cares`, changefreq: 'monthly', priority: 0.5 },
    { loc: `${SITE_URL}/privacy`, changefreq: 'yearly', priority: 0.3 },
    { loc: `${SITE_URL}/terms`, changefreq: 'yearly', priority: 0.3 },
  ]

  const contactRoutes: SitemapEntry[] = LOCATIONS.map((loc) => ({
    loc: `${SITE_URL}/contact/${loc.slug}`,
    changefreq: 'monthly',
    priority: 0.85,
  }))

  const anesthesiaRoutes: SitemapEntry[] = ANESTHESIA_LOCATIONS.map((loc) => ({
    loc: `${SITE_URL}/specialties/anesthesia/${loc.slug}`,
    changefreq: 'monthly',
    priority: 0.7,
  }))

  const rcmRoutes: SitemapEntry[] = RCM_LOCATIONS.map((loc) => ({
    loc: `${SITE_URL}/services/rcm/${loc.slug}`,
    changefreq: 'monthly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...contactRoutes, ...anesthesiaRoutes, ...rcmRoutes].map(
    (entry) => ({ ...entry, lastmod }),
  )
}

/** One entry per blog post. Blog data has no per-post date, so lastmod is the build time. */
export function getBlogEntries(lastmod: string = nowIso()): SitemapEntry[] {
  return getAllBlogSlugs().map((slug) => ({
    loc: `${SITE_URL}/blog/${slug}`,
    lastmod,
    changefreq: 'weekly',
    priority: 0.7,
  }))
}

/** One entry per news article. Uses the article's own date for lastmod when parseable. */
export function getNewsEntries(fallbackLastmod: string = nowIso()): SitemapEntry[] {
  return newsArticles.map((article) => {
    const parsed = new Date(article.date)
    const lastmod = Number.isNaN(parsed.getTime())
      ? fallbackLastmod
      : parsed.toISOString()
    return {
      loc: `${SITE_URL}/news/${article.slug}`,
      lastmod,
      changefreq: 'weekly',
      priority: 0.6,
    }
  })
}

function renderUrl(entry: SitemapEntry): string {
  const lines = [`    <loc>${xmlEscape(entry.loc)}</loc>`]
  if (entry.lastmod) lines.push(`    <lastmod>${entry.lastmod}</lastmod>`)
  if (entry.changefreq) lines.push(`    <changefreq>${entry.changefreq}</changefreq>`)
  if (typeof entry.priority === 'number') {
    lines.push(`    <priority>${formatPriority(entry.priority)}</priority>`)
  }
  return `  <url>\n${lines.join('\n')}\n  </url>`
}

/** Build a sitemaps.org 0.9 <urlset> document. */
export function buildUrlset(entries: SitemapEntry[]): string {
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries.map(renderUrl).join('\n') +
    `\n</urlset>\n`
  )
}

/** Build a sitemaps.org 0.9 <sitemapindex> document (the master sitemap). */
export function buildSitemapIndex(children: SitemapIndexEntry[]): string {
  const nodes = children.map((child) => {
    const lines = [`    <loc>${xmlEscape(child.loc)}</loc>`]
    if (child.lastmod) lines.push(`    <lastmod>${child.lastmod}</lastmod>`)
    return `  <sitemap>\n${lines.join('\n')}\n  </sitemap>`
  })
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    nodes.join('\n') +
    `\n</sitemapindex>\n`
  )
}

/** Absolute URLs of the child sitemaps referenced by the master index. */
export const CHILD_SITEMAP_URLS = {
  pages: `${SITE_URL}/pages-sitemap.xml`,
  blogs: `${SITE_URL}/blogs-sitemap.xml`,
  news: `${SITE_URL}/news-sitemap.xml`,
} as const

export const XML_CONTENT_TYPE = 'application/xml; charset=utf-8'
