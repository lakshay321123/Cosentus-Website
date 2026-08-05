import {
  buildSitemapIndex,
  CHILD_SITEMAP_URLS,
  XML_CONTENT_TYPE,
} from '../_lib/sitemap'

/**
 * Master sitemap at /sitemap.xml.
 *
 * A <sitemapindex> that points crawlers at the three child sitemaps. Submit
 * this URL to Google Search Console; Google follows the index to the children.
 * Route handler (not the app/sitemap.ts metadata convention) because that
 * convention can only emit a single <urlset>, not a <sitemapindex> with the
 * specific child filenames required here.
 */
export const dynamic = 'force-static'

export function GET() {
  const lastmod = new Date().toISOString()
  const xml = buildSitemapIndex([
    { loc: CHILD_SITEMAP_URLS.pages, lastmod },
    { loc: CHILD_SITEMAP_URLS.blogs, lastmod },
    { loc: CHILD_SITEMAP_URLS.news, lastmod },
  ])
  return new Response(xml, { headers: { 'Content-Type': XML_CONTENT_TYPE } })
}
