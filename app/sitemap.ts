import type { MetadataRoute } from 'next'
import { LOCATIONS } from './(site)/contact/_data/locations'

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
 *   - Blog/news/case-studies are dynamic (Sanity-backed) and currently
 *     not in this sitemap. They can be added in a follow-up by fetching
 *     slugs from Sanity at build time.
 */
const SITE = 'https://cosentus-website.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/cosentus-ai`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
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
    { url: `${SITE}/partnership`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
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

  return [...staticRoutes, ...locationRoutes]
}
