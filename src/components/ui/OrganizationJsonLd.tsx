import { SITE_URL } from '@/lib/site-url'

/**
 * OrganizationJsonLd — server-rendered Schema.org @graph (Organization + WebSite).
 *
 * Establishes the Cosentus entity for Google's Knowledge Graph (name, logo,
 * contact, HQ address) and links the WebSite to it as publisher. Rendered
 * directly into the homepage HTML (not via next/script) so it's present at
 * first-byte time for crawlers — same approach as FAQJsonLd.
 *
 * Deliberate omissions:
 *   - sameAs: the codebase has no verified Cosentus social-profile URLs
 *     (only share-intent links), so social profiles are omitted rather than
 *     guessed.
 *   - SearchAction (sitelinks search box): the site has no search-results
 *     endpoint, so a SearchAction would point nowhere and is omitted.
 *
 * Data sources: SITE_URL (src/lib/site-url), HQ address from the Irvine entry
 * in app/(site)/contact/_data/locations.ts, toll-free line (877) 806-2286.
 */
export default function OrganizationJsonLd() {
  const json = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Cosentus',
        url: SITE_URL,
        logo: `${SITE_URL}/images/cosentus-logo.png`,
        description:
          'Cosentus is a specialty RCM partner with 25+ years of expertise, amplified by Real + Artificial Intelligence.',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+1-877-806-2286',
          contactType: 'customer service',
          areaServed: 'US',
          availableLanguage: 'English',
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: '300 Spectrum Center Dr, Suite 1450',
          addressLocality: 'Irvine',
          addressRegion: 'CA',
          postalCode: '92618',
          addressCountry: 'US',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Cosentus',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
