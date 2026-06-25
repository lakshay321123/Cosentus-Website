/**
 * Single source of truth for the site's canonical production origin.
 *
 * Defaults to the live host (www.cosentus.com — confirmed via the Vercel
 * project domains and the apex -> www redirect). Override with
 * NEXT_PUBLIC_SITE_URL only if a deployment must canonicalize to a different
 * origin. Any trailing slash is stripped so callers can safely concatenate
 * `${SITE_URL}/path`.
 *
 * Consumed by: metadataBase (app/layout.tsx), the XML sitemap (app/sitemap.ts),
 * and per-page canonical / OpenGraph URLs.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cosentus.com'
).replace(/\/+$/, '')
