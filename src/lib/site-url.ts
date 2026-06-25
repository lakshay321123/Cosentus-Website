/**
 * Single source of truth for the site's canonical production origin.
 *
 * Defaults to the live host (www.cosentus.com — confirmed via the Vercel
 * project domains and the apex -> www redirect). Override with
 * NEXT_PUBLIC_SITE_URL only if a deployment must canonicalize to a different
 * origin. The value is parsed and validated as a bare origin (scheme + host,
 * no path / query / hash): a malformed or pathful value throws at build time
 * rather than silently emitting wrong-prefix sitemap and canonical URLs. The
 * exported string is always origin-only (no trailing slash), so callers can
 * safely concatenate `${SITE_URL}/path`.
 *
 * Consumed by: metadataBase (app/layout.tsx), the XML sitemap (app/sitemap.ts),
 * and per-page canonical / OpenGraph URLs.
 */
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cosentus.com'

let parsedSiteUrl: URL
try {
  parsedSiteUrl = new URL(rawSiteUrl)
} catch {
  throw new Error(
    'NEXT_PUBLIC_SITE_URL must be a valid absolute origin, e.g. https://www.cosentus.com',
  )
}

if (parsedSiteUrl.pathname !== '/' || parsedSiteUrl.search || parsedSiteUrl.hash) {
  throw new Error(
    'NEXT_PUBLIC_SITE_URL must be an origin only, without a path, query, or hash',
  )
}

export const SITE_URL = parsedSiteUrl.origin
