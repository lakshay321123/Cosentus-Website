import type { MetadataRoute } from 'next'
import { SITE_URL as SITE } from '@/lib/site-url'
import { LOCATIONS } from './(site)/contact/_data/locations'
import { ANESTHESIA_LOCATIONS } from './(site)/specialties/anesthesia/_data/locations'
import { RCM_LOCATIONS } from './(site)/services/rcm/_data/locations'
import { getAllBlogSlugs } from '@/data/blogPosts'
import { newsArticles } from '@/data/newsArticles'
import { galleries } from './(site)/cosentus-cares/galleries'

/**
 * XML sitemap surfaced at /sitemap.xml.
 *
 * Next.js generates this automatically from this file's default export.
 * Submit /sitemap.xml to Google Search Console to accelerate indexing
 * of new routes — particularly the per-location /contact/<city> URLs
 * that are the whole point of the local-SEO architecture.
 *
 * Update strategy:
 *   - Static routes are listed inline below.
 *   - Per-location contact URLs are derived from LOCATIONS so adding a
 *     new office anywhere in the codebase automatically gets a sitemap
 *     entry — no manual sync required.
 *   - Blog, news, and cosentus-cares detail pages are derived from their
 *     static data modules (blogPosts, newsArticles, galleries), so every
 *     published item is included automatically. case-studies has no
 *     per-item route (only the index), so there is nothing per-item to add.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/zeus-ai`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE}/services/billing-coding`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/services/practice-management`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/services/rcm`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/services/ehr-technology`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/specialties/anesthesia`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/specialties/orthopedics`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/specialties/pain-management`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/specialties/asc`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/specialties/behavioral-health`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/specialties/multi-specialty`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/partnerships`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/insights`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE}/news`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE}/case-studies`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/events`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${SITE}/careers`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/cosentus-cares`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const locationRoutes: MetadataRoute.Sitemap = LOCATIONS.map((loc) => ({
    url: `${SITE}/contact/${loc.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  // Anesthesia local-SEO landing pages. Orphan pages with no internal
  // links anywhere on the site, so the sitemap is how crawlers discover
  // them. Derived from the data file so adding a city auto-adds its URL.
  const anesthesiaLocationRoutes: MetadataRoute.Sitemap = ANESTHESIA_LOCATIONS.map(
    (loc) => ({
      url: `${SITE}/specialties/anesthesia/${loc.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }),
  )

  // RCM local-SEO landing pages at /services/rcm/<city>. Same orphan
  // pattern as the anesthesia city pages — no internal links, discoverable
  // via the sitemap. Derived from the data file so adding a city auto-adds
  // its URL.
  const rcmLocationRoutes: MetadataRoute.Sitemap = RCM_LOCATIONS.map((loc) => ({
    url: `${SITE}/services/rcm/${loc.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Blog, news, and cosentus-cares detail pages, derived from their static
  // data modules. Slugs are de-duplicated with a plain filter (no Set spread —
  // the tsconfig target predates downlevel Set iteration) so a repeated slug
  // can't emit a duplicate <loc>.
  const dedupe = (slugs: string[]): string[] =>
    slugs.filter((slug, i) => slugs.indexOf(slug) === i)

  const blogRoutes: MetadataRoute.Sitemap = dedupe(getAllBlogSlugs()).map(
    (slug) => ({
      url: `${SITE}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }),
  )

  const newsRoutes: MetadataRoute.Sitemap = dedupe(
    newsArticles.map((a) => a.slug),
  ).map((slug) => ({
    url: `${SITE}/news/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const caresRoutes: MetadataRoute.Sitemap = dedupe(
    galleries.map((g) => g.slug),
  ).map((slug) => ({
    url: `${SITE}/cosentus-cares/${slug}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.4,
  }))

  return [
    ...staticRoutes,
    ...locationRoutes,
    ...anesthesiaLocationRoutes,
    ...rcmLocationRoutes,
    ...blogRoutes,
    ...newsRoutes,
    ...caresRoutes,
  ]
}
