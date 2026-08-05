import { buildUrlset, getNewsEntries, XML_CONTENT_TYPE } from '../_lib/sitemap'

/** /news-sitemap.xml — one entry per news article (/news/<slug>). */
export const dynamic = 'force-static'

export function GET() {
  const xml = buildUrlset(getNewsEntries())
  return new Response(xml, { headers: { 'Content-Type': XML_CONTENT_TYPE } })
}
