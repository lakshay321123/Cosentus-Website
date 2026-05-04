import Image from 'next/image'
import Script from 'next/script'
import LocationTabs from './LocationTabs'
import LeadForm from './LeadForm'
import type { Location } from '../_data/locations'

interface Props {
  location: Location
}

const steps = [
  { num: '1', text: 'We respond within one business day.' },
  { num: '2', text: 'We schedule a brief discovery call to understand your specialty, payer mix, and revenue performance.' },
  { num: '3', text: 'We deliver a complimentary Revenue Analysis showing exactly where revenue is leaking and how much could be recovered.' },
  { num: '4', text: 'You decide if Cosentus is the right partner, no commitment required.' },
]

/**
 * Self-contained location page.
 *
 * Layout (top to bottom):
 *   1. Full-bleed hero — location image as background, dark gradient
 *      overlay for legibility, city name + label overlaid. Replaces
 *      the prior generic "Let's Talk About Your Revenue" PageHero.
 *   2. Tab strip — switch between locations without leaving the
 *      page mental model.
 *   3. Body section (2-col):
 *        LEFT  = address card + phone/hours + embedded Google Map
 *        RIGHT = location-specific copy + LeadForm
 *   4. Trusted & Certified — accolade strip on teal panel.
 *   5. "What Happens After You Reach Out" — 4-step process.
 *   6. JSON-LD LocalBusiness schema.
 *
 * The /contact route 301-redirects here for Irvine, so this component
 * is the single template that handles every location including the HQ
 * default. Each visit sees the same structure, only the data swaps.
 */
export default function LocationPageContent({ location }: Props) {
  const { name, label, address, phone, image, lat, lng, copy } = location

  // JSON-LD LocalBusiness schema. Embedded via next/script with type
  // application/ld+json so search engines parse it without executing
  // it as JavaScript.
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
    <>
      {/* Hero — image fills the band, dark gradient overlay holds the text */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 480,
          overflow: 'hidden',
          color: 'white',
        }}
      >
        <Image
          src={image}
          alt={`Cosentus office in ${address.city}, ${address.region}`}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        {/* Dark gradient overlay — left-heavy so text on the left side
            of the band stays readable across all five images. */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(0,20,30,0.85) 0%, rgba(0,20,30,0.55) 45%, rgba(0,20,30,0.15) 100%)',
          }}
        />
        <div
          className="container"
          style={{
            position: 'relative',
            minHeight: 480,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingTop: 100,
            paddingBottom: 64,
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.85)',
              margin: 0,
              marginBottom: 14,
            }}
          >
            {label}
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'white',
              margin: 0,
            }}
          >
            {name}
          </h1>
        </div>
      </section>

      {/* Body */}
      <section className="section">
        <div className="container">
          <LocationTabs />

          <div
            className="location-body"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 64,
              alignItems: 'start',
            }}
          >
            {/* LEFT — address card + phone + hours + embedded map */}
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(22px, 2.4vw, 28px)',
                  fontWeight: 300,
                  lineHeight: 1.2,
                  color: 'var(--gray-900)',
                  margin: 0,
                  marginBottom: 20,
                }}
              >
                Visit our {address.city} office
              </h2>

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

              <div style={{ marginBottom: 28 }}>
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

              {/* Embedded Google Map — read-only embed, no API key needed.
                  Lazy-loaded so it doesn't block the LCP on hero. */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4 / 3',
                  borderRadius: 12,
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

            {/* RIGHT — copy + form */}
            <div>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: 'var(--gray-700)',
                  margin: 0,
                  marginBottom: 28,
                }}
              >
                {copy}
              </p>

              <div className="section-title" style={{ fontSize: 28 }}>
                Request Your Free Revenue Analysis
              </div>
              <LeadForm locationSlug={location.slug} locationName={name} />
            </div>
          </div>

          {/* Trusted & Certified — present on every location page now */}
          <div
            style={{
              marginTop: 64,
              padding: 40,
              background: 'var(--primary)',
              borderRadius: 'var(--radius-md)',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <h3
              style={{
                fontSize: 18,
                fontWeight: 400,
                color: 'rgba(255,255,255,0.85)',
                margin: 0,
                marginBottom: 20,
              }}
            >
              Trusted &amp; Certified
            </h3>
            <Image
              src="/all-accolades.png"
              alt="Cosentus Accolades, 25 Years of Excellence, AICPA SOC 2, Inc. 5000, HIPAA Seal of Compliance, HIPAA Verified, HBMA Member 2024"
              width={1687}
              height={259}
              sizes="(min-width: 1024px) 800px, 100vw"
              style={{
                mixBlendMode: 'screen',
                width: '100%',
                maxWidth: 800,
                height: 'auto',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </div>
        </div>
      </section>

      {/* What Happens After You Reach Out */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-title">What Happens After You Reach Out</div>
          <div
            className="steps-desktop"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 24,
              marginTop: 48,
            }}
          >
            {steps.map((step, i) => (
              <div
                key={i}
                style={{
                  padding: 32,
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-200)',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 600,
                    marginBottom: 16,
                  }}
                >
                  {step.num}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--gray-600)' }}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Script
        id={`schema-${location.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <style>{`
        @media (max-width: 900px) {
          .location-body {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .steps-desktop {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 540px) {
          .steps-desktop {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}
