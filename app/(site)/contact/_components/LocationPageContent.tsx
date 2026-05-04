import Image from 'next/image'
import Script from 'next/script'
import LocationTabs from './LocationTabs'
import LeadForm from './LeadForm'
import type { Location } from '../_data/locations'

interface Props {
  location: Location
}

/**
 * Renders the body of a single /contact/[location] page.
 *
 * Layout:
 *   1. Tab strip (LocationTabs) — switch to other offices client-side
 *   2. Two-column hero:
 *        left  = location photo
 *        right = address card with phone, hours, embedded Google Map
 *   3. Unique location copy paragraph
 *   4. Lead form, attributing the lead to this location's slug
 *
 * SEO:
 *   - Embeds JSON-LD LocalBusiness schema with full NAP (name, address,
 *     phone) plus geo coordinates. This is the primary signal Google
 *     uses to associate the URL with a physical place.
 *   - Image has descriptive alt text including the city name.
 *   - The H1 lives in the address card (city + state) so each page has
 *     a unique, location-specific H1 for ranking.
 *
 * Maps:
 *   - The embedded iframe uses Google Maps' free /maps/embed endpoint
 *     with q=lat,lng. This requires no API key for read-only embed.
 *     For production we may want to switch to the Maps Embed API with
 *     a key for vector rendering and theming.
 */
export default function LocationPageContent({ location }: Props) {
  const { name, label, address, phone, image, lat, lng, copy } = location
  const fullAddress = [
    address.street,
    `${address.city}, ${address.region} ${address.postalCode}`.trim(),
  ]
    .filter(Boolean)
    .join(', ')

  // JSON-LD LocalBusiness schema. Embedded via next/script with type
  // application/ld+json so search engines can parse it but it doesn't
  // execute as JavaScript.
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Cosentus — ${name}`,
    image: `https://cosentus-website.vercel.app${image}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    telephone: phone,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
    },
    url: `https://cosentus-website.vercel.app/contact/${location.slug}`,
  }

  return (
    <section className="section section-alt">
      <div className="container">
        <LocationTabs />

        <div
          className="location-hero"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 48,
            alignItems: 'start',
            marginBottom: 56,
          }}
        >
          {/* Image */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4 / 3',
              borderRadius: 12,
              overflow: 'hidden',
              background: 'var(--gray-100)',
            }}
          >
            <Image
              src={image}
              alt={`Cosentus office in ${address.city}, ${address.region}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* Address card */}
          <div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--gray-500)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: 0,
                marginBottom: 8,
              }}
            >
              {label}
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 3vw, 40px)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--gray-900)',
                margin: 0,
                marginBottom: 24,
              }}
            >
              {name}
            </h1>

            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: 'var(--gray-500)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 4,
                }}
              >
                Address
              </div>
              <div style={{ fontSize: 17, color: 'var(--gray-800)' }}>
                {address.street}
                <br />
                {address.city}, {address.region} {address.postalCode}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: 'var(--gray-500)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 4,
                }}
              >
                Phone
              </div>
              <a
                href={`tel:${phone.replace(/\D/g, '')}`}
                style={{ fontSize: 17, color: 'var(--primary)', fontWeight: 400 }}
              >
                {phone}
              </a>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: 'var(--gray-500)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 4,
                }}
              >
                Hours
              </div>
              <div style={{ fontSize: 17, color: 'var(--gray-800)' }}>
                Monday–Friday, 9am–5pm
              </div>
            </div>

            {/* Embedded Google Map */}
            <div
              style={{
                width: '100%',
                aspectRatio: '16 / 9',
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid var(--gray-200)',
                background: 'var(--gray-100)',
              }}
            >
              <iframe
                title={`Map of Cosentus office in ${address.city}, ${address.region}`}
                src={`https://www.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Unique copy + form */}
        <div
          className="location-detail"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'start',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 2.6vw, 32px)',
                fontWeight: 300,
                lineHeight: 1.2,
                color: 'var(--gray-900)',
                margin: 0,
                marginBottom: 16,
              }}
            >
              About this office
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--gray-700)' }}>
              {copy}
            </p>
          </div>

          <div>
            <div className="section-title" style={{ fontSize: 24 }}>
              Contact our {address.city} team
            </div>
            <LeadForm locationSlug={location.slug} locationName={name} />
          </div>
        </div>

        <Script
          id={`schema-${location.slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        <style>{`
          @media (max-width: 900px) {
            .location-hero,
            .location-detail {
              grid-template-columns: 1fr !important;
              gap: 32px !important;
            }
          }
        `}</style>
      </div>
    </section>
  )
}
