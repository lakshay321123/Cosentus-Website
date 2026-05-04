import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocationPageContent from '../_components/LocationPageContent'
import { LOCATIONS, getLocationBySlug } from '../_data/locations'

interface Props {
  params: Promise<{ location: string }>
}

/**
 * Pre-render every location at build time so each URL is a real
 * static HTML file Google can index without running JS. Unknown slugs
 * fall through to the dynamic path and 404 via notFound().
 */
export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ location: l.slug }))
}

/**
 * Per-location metadata. Each page gets its own title + description
 * + canonical URL + OpenGraph image so Google and social previews
 * surface the correct content for each city.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location: slug } = await params
  const loc = getLocationBySlug(slug)
  if (!loc) {
    return { title: 'Location not found | Cosentus' }
  }
  return {
    title: loc.metaTitle,
    description: loc.metaDescription,
    alternates: {
      canonical: `/contact/${loc.slug}`,
    },
    openGraph: {
      title: loc.metaTitle,
      description: loc.metaDescription,
      url: `/contact/${loc.slug}`,
      images: [{ url: loc.image }],
      type: 'website',
    },
  }
}

export default async function LocationPage({ params }: Props) {
  const { location: slug } = await params
  const loc = getLocationBySlug(slug)
  if (!loc) notFound()
  return (
    <main>
      <LocationPageContent location={loc} />
    </main>
  )
}
