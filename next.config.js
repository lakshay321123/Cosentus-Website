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
    ]
  },
}
module.exports = nextConfig
