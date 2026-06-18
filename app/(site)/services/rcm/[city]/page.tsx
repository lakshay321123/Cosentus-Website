import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageHero from '@/components/sections/PageHero'
import RcmLocationContent from '../_components/RcmLocationContent'
import { RCM_LOCATIONS, getRcmLocationBySlug } from '../_data/locations'

interface Props {
  params: Promise<{ city: string }>
}

/**
 * Pre-render every RCM city page at build time so each URL is a real
 * static HTML file Google can index without running JS. Unknown slugs
 * fall through and 404 via notFound().
 *
 * These pages are intentionally orphaned — nothing on the site links to
 * them. They're discoverable only via search (and the XML sitemap).
 */
export function generateStaticParams() {
  return RCM_LOCATIONS.map((l) => ({ city: l.slug }))
}

/**
 * Per-city metadata. Each page gets its own title, description, and
 * canonical URL so search engines surface the correct city page.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params
  const loc = getRcmLocationBySlug(slug)
  if (!loc) {
    return { title: 'Page not found | Cosentus' }
  }
  return {
    title: loc.metaTitle,
    description: loc.metaDescription,
    alternates: {
      canonical: `/services/rcm/${loc.slug}`,
    },
    openGraph: {
      title: loc.metaTitle,
      description: loc.metaDescription,
      url: `/services/rcm/${loc.slug}`,
      type: 'website',
    },
  }
}

export default async function RcmLocationPage({ params }: Props) {
  const { city: slug } = await params
  const loc = getRcmLocationBySlug(slug)
  if (!loc) notFound()
  return (
    <main>
      <PageHero
        label="END-TO-END RCM"
        title={<>Revenue Cycle Management in <br />{loc.name}</>}
        subtitle={loc.heroSubtitle}
        ctaText="Get Your No-Cost Financial MRI"
        ctaHref="/contact"
      />
      <RcmLocationContent location={loc} />
    </main>
  )
}
