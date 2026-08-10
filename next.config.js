/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: '/resources',
        destination: '/insights',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/contact/irvine',
        permanent: true,
      },
      // WeCare -> Cosentus Cares rename per Doc 1 (May 24 2026).
      // Two redirects required: the overview page and the
      // dynamic gallery slug routes. `permanent: true` emits 308
      // (preferred over 301 in Next.js; preserves method and
      // tells search engines the move is permanent so SEO equity
      // transfers). The :slug* pattern catches any depth under
      // /wecare/, so /wecare/harmony-house-india-2026 ->
      // /cosentus-cares/harmony-house-india-2026.
      {
        source: '/wecare',
        destination: '/cosentus-cares',
        permanent: true,
      },
      {
        source: '/wecare/:slug*',
        destination: '/cosentus-cares/:slug*',
        permanent: true,
      },
      // Partnership -> Partnerships URL rename (Jun 2026). 308 permanent
      // so the old /partnership keeps working and SEO equity transfers.
      {
        source: '/partnership',
        destination: '/partnerships',
        permanent: true,
      },
      // Zeus Ai URL rename (Jun 2026): /cosentus-ai -> /zeus-ai.
      // 308 permanent so the old path keeps working and SEO equity
      // transfers. Old path was in the sitemap (priority 0.9) and
      // likely indexed.
      {
        source: '/cosentus-ai',
        destination: '/zeus-ai',
        permanent: true,
      },
      // /aiagents -> Zeus Health AI agents page (Aug 2026). External
      // cross-domain destination; Next.js accepts absolute URLs here.
      // 308 permanent, consistent with the rest of this file.
      // Points at the www host on purpose: zeushealth.ai/ai-agents
      // itself 301s to www, so targeting www avoids an extra hop.
      // /aiagents currently 404s, so no existing route is shadowed.
      {
        source: '/aiagents',
        destination: 'https://www.zeushealth.ai/ai-agents',
        permanent: true,
      },
    ]
  },
}
module.exports = nextConfig
