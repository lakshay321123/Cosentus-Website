import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-url'

/**
 * /robots.txt
 *
 * Production: allow crawling, disallow the Sanity CMS admin (/studio) and the
 * utility routes (/form/, /survey/), and point crawlers at the sitemap.
 *
 * Non-production (Vercel preview deployments / *.vercel.app): disallow
 * everything, so preview builds are never indexed and never compete with the
 * canonical cosentus.com. VERCEL_ENV is "production" only on the production
 * deployment; "preview" on branch/PR deploys; undefined locally.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === 'production'

  if (!isProduction) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/form/', '/survey/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
