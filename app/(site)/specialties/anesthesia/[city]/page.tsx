import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageHero from '@/components/sections/PageHero'
import AnesthesiaLocationContent from '../_components/AnesthesiaLocationContent'
import {
  ANESTHESIA_LOCATIONS,
  getAnesthesiaLocationBySlug,
} from '../_data/locations'

interface Props {
  params: Promise<{ city: string }>
}

/**
 * Pre-render every anesthesia city page at build time so each URL is a
 * real static HTML file Google can index without running JS. Unknown
 * slugs fall through and 404 via notFound().
 *
 * These pages are intentionally orphaned — nothing on the site links to
 * them. They're discoverable only via search (and the XML sitemap).
 */
export function generateStaticParams() {
  return ANESTHESIA_LOCATIONS.map((l) => ({ city: l.slug }))
}

/**
 * Per-city metadata. Each page gets its own title, description, and
 * canonical URL so search engines surface the correct city page.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params
  const loc = getAnesthesiaLocationBySlug(slug)
  if (!loc) {
    return { title: 'Page not found | Cosentus' }
  }
  return {
    title: loc.metaTitle,
    description: loc.metaDescription,
    alternates: {
      canonical: `/specialties/anesthesia/${loc.slug}`,
    },
    openGraph: {
      title: loc.metaTitle,
      description: loc.metaDescription,
      url: `/specialties/anesthesia/${loc.slug}`,
      type: 'website',
    },
  }
}

export default async function AnesthesiaLocationPage({ params }: Props) {
  const { city: slug } = await params
  const loc = getAnesthesiaLocationBySlug(slug)
  if (!loc) notFound()
  return (
    <main>
      <PageHero
        videoSrc="/videos/specialty-anesthesia.mp4"
        specialty
        label="ACCREDA BY COSENTUS"
        title={<>Anesthesia Billing Services in <br />{loc.name}</>}
        subtitle={loc.heroSubtitle}
        ctaText="Get Your No-Cost Financial MRI"
        ctaHref="/contact"
      />
      <AnesthesiaLocationContent location={loc} />
    </main>
  )
}
