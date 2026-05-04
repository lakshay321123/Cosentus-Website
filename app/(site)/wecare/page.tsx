import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export const metadata: Metadata = {
  title: 'WeCare | Community & Charitable Initiatives | Cosentus',
  description: 'Cosentus is committed to community, employee wellbeing, and the practices we serve. Meet our Impact Ambassadors and the incredible work they do.',
}

/**
 * Event gallery — photos sourced from cosentus.com/wecare/. Locally hosted
 * in /public/images/wecare/ (Vercel blocks external image hot-linking and
 * the rest of the site follows the locally-hosted convention).
 *
 * Order matches cosentus.com/wecare/: most recent events first.
 */
const events = [
  { title: 'Harmony House – India, 2026',                             image: '/images/wecare/harmony-house-india-2026.webp' },
  { title: 'Orange County Second Harvest Food Bank – USA, 2025',      image: '/images/wecare/orange-county-second-harvest-2025.webp' },
  { title: 'Harmony House – India, 2025',                             image: '/images/wecare/harmony-house-india-2025.webp' },
  { title: 'In Concert With Hope 2025: A Proud Moment for Cosentus',  image: '/images/wecare/in-concert-with-hope-2025.webp' },
  { title: 'Harmony House – India, 2024',                             image: '/images/wecare/harmony-house-india-2024.webp' },
  { title: 'In Concert With Hope – Saratoga, 2024',                   image: '/images/wecare/in-concert-with-hope-saratoga-2024.webp' },
  { title: 'Bill Wilson Center – Building Dreams Celebration, 2024',  image: '/images/wecare/bill-wilson-center-2024.webp' },
  { title: 'Pacific Clinics Hearts & Hands Spring Celebration, 2024', image: '/images/wecare/pacific-clinics-2024.webp' },
  { title: 'Harmony House – India, 2023',                             image: '/images/wecare/harmony-house-india-2023.webp' },
  { title: 'Someone Cares Food Bank – USA, 2023',                     image: '/images/wecare/someone-cares-food-bank-2023.webp' },
  { title: 'Kids Against Hunger – USA, 2023',                         image: '/images/wecare/kids-against-hunger-2023.webp' },
  { title: 'Beyond Blindness – USA, 2023',                            image: '/images/wecare/beyond-blindness-2023.webp' },
  { title: 'Uday Foundation – India, 2023',                           image: '/images/wecare/uday-foundation-2023.webp' },
  { title: 'Plantation Drive – India, 2023',                          image: '/images/wecare/plantation-drive-india-2023.webp' },
]

/**
 * Organisations we support. Logo + full description text, mirrors the
 * "Organizations that we support:" section on cosentus.com/wecare/.
 *
 * Text is reproduced verbatim from cosentus.com — explicit instruction:
 * "do not skip any text". Multi-paragraph entries are arrays.
 *
 * NOTE: cosentus.com pairs the Hope Services logo with text about the
 * Alzheimer's Association ($235K raised) — content error on the source
 * site, the same paragraph appears under the Alzheimer's logo below.
 * Per "match cosentus.com" we reproduce both as-is. Easy to clean up
 * in a follow-up by writing a proper Hope Services description.
 */
const organisations: Array<{
  name: string
  logo: string
  href?: string
  paragraphs: string[]
}> = [
  {
    name: 'Harmony House',
    logo: '/images/wecare/logos/harmony-house.png',
    href: 'https://www.harmonyhouseindia.org/donate-now/',
    paragraphs: [
      "We have been working closely with Harmony House for over 6 years. Harmony House provides education services, healthcare, housing, food, financial support, and vocational training for underprivileged children across India, from ages 6 months to 18 years. With onsite teachers, nannies, cooks, and counselors, Harmony House encourages children to learn, grow, and lead empowered lives. They currently provide for over 600 children and counting. Throughout the COVID-19 pandemic, Harmony House has regularly been sending out care packages to their students' families and continuing to provide online classes and school supplies for children without access to a device.",
      "Cosentus proudly participates in Harmony House's mission through consistent donation campaigns and providing volunteer opportunities to assist and support at one of Harmony House's daycare centers.",
    ],
  },
  {
    name: 'Hope Services',
    logo: '/images/wecare/logos/hope-services.png',
    href: 'https://www.hopeservices.org/',
    paragraphs: [
      "An annual event in aid of the Alzheimer's Association. Sponsors and volunteers at this year's event raised over $235,000—far surpassing their goal of $150,000. We love this opportunity to support an organization that means so much to our team and community.",
    ],
  },
  {
    name: 'Uday Foundation',
    logo: '/images/wecare/logos/uday-foundation.png',
    paragraphs: [
      "We are honored to support the Uday Foundation's efforts in providing medical aid, dignity to the homeless, and disaster relief across India.",
    ],
  },
  {
    name: 'Someone Cares Soup Kitchen',
    logo: '/images/wecare/logos/someone-cares.png',
    paragraphs: [
      "Cosentus actively contributes to Someone Cares Soup Kitchen, dedicating our efforts to combat hunger by volunteering at this vital community resource. We are committed to providing nutritious food to those in need and fostering a stronger, healthier community.",
    ],
  },
  {
    name: 'Beyond Blindness',
    logo: '/images/wecare/logos/beyond-blindness.png',
    paragraphs: [
      "We support Beyond Blindness in empowering children with visual impairments and other disabilities to achieve their fullest potential.",
    ],
  },
  {
    name: 'Kids Against Hunger',
    logo: '/images/wecare/logos/kids-against-hunger.png',
    paragraphs: [
      "We proudly support Kids Against Hunger in their mission to provide nutritious meals to impoverished children and families, helping them move from food insecurity to self-sufficiency.",
    ],
  },
  {
    name: 'Pacific Clinics',
    logo: '/images/wecare/logos/pacific-clinics.png',
    href: 'https://www.pacificclinics.org/',
    paragraphs: [
      "We proudly support Pacific Clinics in their comprehensive approach to behavioral health, social services, and wellness programs for all.",
    ],
  },
  {
    name: 'Bill Wilson Center',
    logo: '/images/wecare/logos/bill-wilson-center.png',
    href: 'https://www.billwilsoncenter.org/',
    paragraphs: [
      "We're honored to contribute to Bill Wilson Center's vision of breaking the cycle of poverty by empowering youth and families through education, employment, and more.",
    ],
  },
  {
    name: 'Save the Children',
    logo: '/images/wecare/logos/save-the-children.png',
    href: 'https://www.savethechildren.in',
    paragraphs: [
      "Cosentus is a proud donor and supporter of Save the Children and its mission to improve the lives of impoverished children around the world.",
    ],
  },
  {
    name: 'Child Fund International',
    logo: '/images/wecare/logos/child-fund.png',
    href: 'https://www.childfund.org',
    paragraphs: [
      "Our team members are actively involved with Child Fund's mission to support and sponsor low-income children around the world. Many of our employees happily sponsor individual children and families in various countries. These sponsorships provide children in need with school supplies, food, education, housing, and whatever they need to be safe, healthy, and secure.",
    ],
  },
  {
    name: "Alzheimer's Association",
    logo: '/images/wecare/logos/alzheimers-association.png',
    href: 'https://www.alz.org',
    paragraphs: [
      "An annual event in aid of the Alzheimer's Association. Sponsors and volunteers at this year's event raised over $235,000—far surpassing their goal of $150,000. We love this opportunity to support an organization that means so much to our team and community.",
    ],
  },
  {
    name: 'Irvine Police Department',
    logo: '/images/wecare/logos/irvine-police.png',
    href: 'https://www.cityofirvine.org',
    paragraphs: [
      "Cosentus sponsors and supports many of the events and initiatives hosted by the Irvine Police Department, including community programs like Concert on the Green and rehabilitation services for officers and service animals, as well as families affected by COVID-19.",
    ],
  },
]

export default function WeCarePage() {
  return (
    <main>
      <PageHero
        label="WECARE"
        title="Come See Our Community Network, And Inspire Change With Us."
        subtitle="At Cosentus, giving back isn't a campaign, it's who we are. Meet our Impact Ambassadors and all the incredible work they do."
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <RevealOnScroll>
            <p className="section-desc" style={{ maxWidth: '100%', fontSize: 18, lineHeight: 1.8, textAlign: 'center', margin: '0 auto' }}>
              WeCare represents Cosentus&apos;s commitment to community, employee wellbeing, and the practices we serve.
              When practices get paid accurately and on time, they can focus fully on patient care,
              and we can focus on making a difference beyond healthcare.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Event gallery — Recent Events. 4-col on desktop, responsive down to
          1-col on small phones. Cards currently non-interactive. */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title">Recent Events</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: 'var(--gray-700)',
              maxWidth: 640,
              marginTop: 12,
              marginBottom: 8,
            }}>
              Volunteer days, fundraisers, and community moments from across the Cosentus family.
            </p>
          </RevealOnScroll>

          <div className="wecare-events-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
            marginTop: 40,
          }}>
            {events.map((event, i) => (
              <RevealOnScroll key={event.image} delay={(i % 4) * 0.08}>
                <article className="wecare-event-card" style={{
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--gray-200)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column' as const,
                  transition: 'transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.3s, border-color 0.3s',
                }}>
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '4 / 3',
                    overflow: 'hidden',
                    background: 'var(--gray-100)',
                  }}>
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      className="wecare-event-img"
                      style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  </div>
                  <div style={{
                    padding: '20px 20px 22px',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    <h3 style={{
                      fontSize: 15,
                      fontWeight: 500,
                      lineHeight: 1.4,
                      color: 'var(--gray-900)',
                      fontFamily: 'var(--font-display)',
                      margin: 0,
                    }}>
                      {event.title}
                    </h3>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Organisations we support — boxed-grid layout. Each card has the
          org logo (forced to monochrome black via CSS filter), name, and
          full description text reproduced verbatim from cosentus.com. */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-title" style={{ textAlign: 'center' }}>Organizations That We Support</div>
          </RevealOnScroll>

          <div
            className="wecare-orgs-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 24,
              marginTop: 56,
            }}
          >
            {organisations.map((org) => {
              // Each card is the same DOM whether or not we wrap in an anchor.
              // We pull the inner JSX out so it can be reused.
              const inner = (
                <div className="wecare-org-card" style={{
                  padding: 28,
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-200)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column' as const,
                  transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
                }}>
                  <div className="wecare-org-logo-box" style={{
                    height: 72,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}>
                    <img
                      src={org.logo}
                      alt={`${org.name} logo`}
                      loading="lazy"
                      className="wecare-org-logo"
                      style={{
                        display: 'block',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                  <h4 style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: 'var(--gray-900)',
                    marginBottom: 12,
                    fontFamily: 'var(--font-display)',
                  }}>
                    {org.name}
                  </h4>
                  <div style={{ flex: 1 }}>
                    {org.paragraphs.map((p, pi) => (
                      <p key={pi} style={{
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: 'var(--gray-600)',
                        marginBottom: pi < org.paragraphs.length - 1 ? 12 : 0,
                      }}>
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              )

              return (
                <RevealOnScroll key={org.name}>
                  {org.href ? (
                    <a
                      href={org.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${org.name}`}
                      style={{
                        display: 'block',
                        textDecoration: 'none',
                        color: 'inherit',
                        height: '100%',
                      }}
                    >
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </RevealOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Want to Partner With Us on a Community Initiative?</h2>
            <a href="mailto:sales@cosentus.com" className="btn-primary">
              Contact WeCare
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .wecare-event-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
          border-color: rgba(0, 181, 214, 0.30);
        }
        .wecare-event-card:hover .wecare-event-img {
          transform: scale(1.05);
        }
        @media (max-width: 1100px) {
          .wecare-events-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 820px) {
          .wecare-events-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
        }
        @media (max-width: 520px) {
          .wecare-events-grid { grid-template-columns: 1fr !important; }
        }

        /* Organisation cards. Logos are forced to monochrome black via
           filter: brightness(0) so the section reads as a uniform set
           regardless of each org's brand colour. (Memory: brightness(0)
           alone — without a chained invert — does NOT pixelate; it
           multiplies RGB by 0 and preserves the alpha channel.) */
        .wecare-org-logo {
          filter: brightness(0);
          opacity: 0.85;
          transition: opacity 0.25s ease;
        }
        .wecare-org-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
          border-color: rgba(0, 181, 214, 0.30) !important;
        }
        .wecare-org-card:hover .wecare-org-logo {
          opacity: 1;
        }
      `}</style>
    </main>
  )
}
