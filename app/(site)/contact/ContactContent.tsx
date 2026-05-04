import Image from 'next/image'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'
import LocationTabs from './_components/LocationTabs'
import LeadForm from './_components/LeadForm'
import { LOCATIONS } from './_data/locations'

const steps = [
  { num: '1', text: 'We respond within one business day.' },
  { num: '2', text: 'We schedule a brief discovery call to understand your specialty, payer mix, and revenue performance.' },
  { num: '3', text: 'We deliver a complimentary Revenue Analysis showing exactly where revenue is leaking and how much could be recovered.' },
  { num: '4', text: 'You decide if Cosentus is the right partner, no commitment required.' },
]

/**
 * /contact landing page (the "chooser").
 *
 * Layout:
 *   1. Location tab strip — same component used on /contact/[location]
 *      pages. Tapping a tab navigates to that location's URL.
 *   2. Location cards grid — 5 visual cards, each showing the office
 *      photo, name, address, and phone. Clicking the card navigates
 *      to the per-location page.
 *   3. Form + contact details — preserved from the original /contact
 *      page so visitors who don't want to pick a specific office can
 *      still submit a generic inquiry.
 *   4. Process steps — preserved.
 *
 * Why this is a server component now:
 *   The chooser doesn't need any client-side state — the form is
 *   isolated in its own client component (LeadForm), the tab strip
 *   is isolated in LocationTabs, and the location data is static.
 *   Server-rendering the cards gives Google a clean static page
 *   listing all 5 offices with internal links to each.
 */
export default function ContactContent() {
  return (
    <>
      {/* Tabs + location chooser */}
      <section className="section section-alt">
        <div className="container">
          <LocationTabs />

          <RevealOnScroll>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 2.6vw, 32px)',
                fontWeight: 300,
                lineHeight: 1.2,
                color: 'var(--gray-900)',
                margin: 0,
                marginBottom: 8,
              }}
            >
              Five offices. One team.
            </h2>
            <p style={{ fontSize: 16, color: 'var(--gray-700)', maxWidth: 640, marginBottom: 32 }}>
              Pick the office closest to you for direct contact, or use the form below to reach our central team.
            </p>
          </RevealOnScroll>

          <div
            className="locations-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20,
              marginBottom: 56,
            }}
          >
            {LOCATIONS.map((loc, i) => (
              <RevealOnScroll key={loc.slug} delay={i * 0.05}>
                <Link
                  href={`/contact/${loc.slug}`}
                  prefetch
                  className="location-card"
                  style={{
                    display: 'block',
                    background: 'var(--white)',
                    border: '1px solid var(--gray-200)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '16 / 10',
                      background: 'var(--gray-100)',
                    }}
                  >
                    <Image
                      src={loc.image}
                      alt={`Cosentus office in ${loc.address.city}, ${loc.address.region}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: 20 }}>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: 'var(--gray-500)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        margin: 0,
                        marginBottom: 6,
                      }}
                    >
                      {loc.label}
                    </p>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 20,
                        fontWeight: 400,
                        color: 'var(--gray-900)',
                        margin: 0,
                        marginBottom: 8,
                      }}
                    >
                      {loc.name}
                    </h3>
                    <p
                      style={{
                        fontSize: 14,
                        color: 'var(--gray-600)',
                        margin: 0,
                        marginBottom: 4,
                        lineHeight: 1.5,
                      }}
                    >
                      {loc.address.street}
                    </p>
                    <p style={{ fontSize: 14, color: 'var(--primary)', margin: 0 }}>
                      {loc.phone}
                    </p>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>

          <style>{`
            .location-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
              border-color: rgba(0, 181, 214, 0.3);
            }
          `}</style>
        </div>
      </section>

      {/* Generic form + contact details */}
      <section id="contact-form" className="section">
        <div className="container">
          <div
            className="ra-main-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 80,
              alignItems: 'start',
            }}
          >
            <RevealOnScroll>
              <div>
                <div className="section-title" style={{ fontSize: 32 }}>
                  Request Your Free Revenue Analysis
                </div>
                <LeadForm />
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div style={{ paddingTop: 60 }}>
                <div style={{ marginBottom: 40 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 400, color: 'var(--gray-900)', marginBottom: 24 }}>
                    Contact Details
                  </h3>
                  {[
                    { label: 'Phone', value: '(877) 806-2286', href: 'tel:8778062286' },
                    { label: 'Email', value: 'sales@cosentus.com', href: 'mailto:sales@cosentus.com' },
                    { label: 'Headquarters', value: 'Irvine, California', href: null },
                    { label: 'Hours', value: 'Monday–Friday, 9am–5pm (all time zones)', href: null },
                  ].map((item, i) => (
                    <div key={i} style={{ marginBottom: 20 }}>
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
                        {item.label}
                      </div>
                      {item.href ? (
                        <a href={item.href} style={{ fontSize: 17, color: 'var(--primary)', fontWeight: 400 }}>
                          {item.value}
                        </a>
                      ) : (
                        <div style={{ fontSize: 17, color: 'var(--gray-800)', fontWeight: 400 }}>
                          {item.value}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    padding: 32,
                    background: 'var(--primary)',
                    borderRadius: 'var(--radius-md)',
                    color: 'white',
                  }}
                >
                  <h4 style={{ fontSize: 16, fontWeight: 400, marginBottom: 12, color: 'rgba(255,255,255,0.8)' }}>
                    Trusted &amp; Certified
                  </h4>
                  <Image
                    src="/all-accolades.png"
                    alt="Cosentus Accolades, 25 Years of Excellence, AICPA SOC 2, Inc. 5000, HIPAA Seal of Compliance, HIPAA Verified, HBMA Member 2024"
                    width={1687}
                    height={259}
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    style={{ mixBlendMode: 'screen', width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">What Happens After You Reach Out</div>
          </RevealOnScroll>
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
              <RevealOnScroll key={i} delay={i * 0.1}>
                <div
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
              </RevealOnScroll>
            ))}
          </div>
          <div className="steps-mobile" style={{ overflow: 'hidden', width: '100%', marginTop: 32 }}>
            <MobileCarousel autoScrollInterval={4000}>
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
            </MobileCarousel>
          </div>
        </div>
      </section>
    </>
  )
}
