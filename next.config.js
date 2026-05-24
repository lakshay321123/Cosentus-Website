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
    ]
  },
}
module.exports = nextConfig
