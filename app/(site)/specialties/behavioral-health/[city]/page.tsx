import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageHero from '@/components/sections/PageHero'
import BehavioralHealthLocationContent from '../_components/BehavioralHealthLocationContent'
import {
  BEHAVIORAL_HEALTH_LOCATIONS,
  getBehavioralHealthLocationBySlug,
} from '../_data/locations'

interface Props {
  params: Promise<{ city: string }>
}

/**
 * Pre-render every behavioral-health city page at build time so each URL is
 * a real static HTML file Google can index without running JS. Unknown slugs
 * fall through and 404 via notFound().
 *
 * These pages are intentionally orphaned — nothing on the site links to
 * them. They're discoverable only via search (and the XML sitemap).
 */
export function generateStaticParams() {
  return BEHAVIORAL_HEALTH_LOCATIONS.map((l) => ({ city: l.slug }))
}

/**
 * Per-city metadata. Each page gets its own title, description, and
 * canonical URL so search engines surface the correct city page.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params
  const loc = getBehavioralHealthLocationBySlug(slug)
  if (!loc) {
    return { title: 'Page not found | Cosentus' }
  }
  return {
    title: loc.metaTitle,
    description: loc.metaDescription,
    alternates: {
      canonical: `/specialties/behavioral-health/${loc.slug}`,
    },
    openGraph: {
      title: loc.metaTitle,
      description: loc.metaDescription,
      url: `/specialties/behavioral-health/${loc.slug}`,
      type: 'website',
    },
  }
}

export default async function BehavioralHealthLocationPage({ params }: Props) {
  const { city: slug } = await params
  const loc = getBehavioralHealthLocationBySlug(slug)
  if (!loc) notFound()
  return (
    <main>
      <PageHero
        videoSrc="/videos/specialty-behavioral-health.mp4"
        specialty
        label="SIMED BY COSENTUS"
        title={<>Behavioral Health Billing Services in <br />{loc.name}</>}
        subtitle={loc.heroSubtitle}
        ctaText="Get Your No-Cost Financial MRI"
        ctaHref="/contact"
      />
      <BehavioralHealthLocationContent location={loc} />
    </main>
  )
}
