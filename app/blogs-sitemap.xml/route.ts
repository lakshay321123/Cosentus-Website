import { buildUrlset, getBlogEntries, XML_CONTENT_TYPE } from '../_lib/sitemap'

/** /blogs-sitemap.xml — one entry per blog post (/blog/<slug>). */
export const dynamic = 'force-static'

export function GET() {
  const xml = buildUrlset(getBlogEntries())
  return new Response(xml, { headers: { 'Content-Type': XML_CONTENT_TYPE } })
}
