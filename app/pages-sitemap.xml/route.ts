import { buildUrlset, getPageEntries, XML_CONTENT_TYPE } from '../_lib/sitemap'

/** /pages-sitemap.xml — static routes + per-location landing pages. */
export const dynamic = 'force-static'

export function GET() {
  const xml = buildUrlset(getPageEntries())
  return new Response(xml, { headers: { 'Content-Type': XML_CONTENT_TYPE } })
}
