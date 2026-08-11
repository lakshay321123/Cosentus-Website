/**
 * Single source of truth for the site's canonical production origin.
 *
 * Defaults to the non-www apex host (https://cosentus.com). Override with
 * NEXT_PUBLIC_SITE_URL only if a deployment must canonicalize to a different
 * origin. The value is parsed and validated as a bare origin (scheme + host,
 * no path / query / hash): a malformed or pathful value throws at build time
 * rather than silently emitting wrong-prefix sitemap and canonical URLs.
 *
 * The host is canonicalized to non-www: a leading "www." is stripped so the
 * generated sitemaps and canonical URLs never emit a www origin, even if an
 * environment override is set to the www host. The exported string is always
 * origin-only (no trailing slash), so callers can safely concatenate
 * `${SITE_URL}/path`.
 *
 * Consumed by: metadataBase (app/layout.tsx), the XML sitemaps
 * (app/sitemap.xml + app/{pages,blogs,news}-sitemap.xml via app/_lib/sitemap.ts),
 * robots (app/robots.ts), and per-page canonical / OpenGraph URLs.
 *
 * NOTE: This makes non-www the canonical origin site-wide. For it to hold end
 * to end, the host/DNS layer must serve (or redirect to) the apex, i.e.
 * www -> apex. If the host still redirects apex -> www, these non-www URLs will
 * 301 to www and the canonicalization is defeated at the edge.
 */
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cosentus.com'

let parsedSiteUrl: URL
try {
  parsedSiteUrl = new URL(rawSiteUrl)
} catch {
  throw new Error(
    'NEXT_PUBLIC_SITE_URL must be a valid absolute origin, e.g. https://cosentus.com',
  )
}

if (parsedSiteUrl.pathname !== '/' || parsedSiteUrl.search || parsedSiteUrl.hash) {
  throw new Error(
    'NEXT_PUBLIC_SITE_URL must be an origin only, without a path, query, or hash',
  )
}

// Canonicalize to the non-www apex host.
if (parsedSiteUrl.hostname.startsWith('www.')) {
  parsedSiteUrl.hostname = parsedSiteUrl.hostname.slice('www.'.length)
}

export const SITE_URL = parsedSiteUrl.origin
