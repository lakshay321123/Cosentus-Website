import type { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import PSGLeadForm from './_components/PSGLeadForm'

/**
 * /physician-side-gigs — partner landing page for the Physician Side
 * Gigs community.
 *
 * Layout (top to bottom):
 *   1. PageHero (compact, default hero video) — offer headline.
 *   2. Body section (2-col, collapses at 900px like the location pages):
 *        LEFT  = offer copy + PSG5OFF code badge + review checklist
 *        RIGHT = PSGLeadForm in a bordered card
 *   3. Highlights — intro statement + two benefit cards
 *      (Sustained Cashflow, Improved AR Status).
 *
 * Intentionally not linked from the primary navigation — the entry
 * point is the PSG community itself. Still server-rendered and
 * indexable at the canonical URL.
 */

export const metadata: Metadata = {
  title: 'Special Offer for the Physician Side Gigs Community | Cosentus',
  description:
    'Free revenue cycle review for Physician Side Gigs members plus 5% off Cosentus services. Uncover coding and billing mistakes, avoid denials, and capture higher reimbursement. Use code PSG5OFF.',
  alternates: { canonical: '/physician-side-gigs' },
  openGraph: {
    title: 'Special Offer for the Physician Side Gigs Community | Cosentus',
    description:
      'Free revenue cycle review for PSG members plus 5% off Cosentus services. Use code PSG5OFF.',
    url: '/physician-side-gigs',
    type: 'website',
  },
}

const reviewChecklist = [
  'Uncovering common coding and billing mistakes',
  'Avoiding unnecessary denials and write-offs',
  'Understanding and minimizing AR issues',
  'Capitalizing on opportunities for higher reimbursement',
]

const highlights = [
  {
    title: 'Sustained Cashflow',
    text: 'Our dedicated Patient Service Team is 100% focused on collecting patient balances that are due to you.',
  },
  {
    title: 'Improved AR Status',
    text: 'From credit balance resolution through denial management to patient follow up, we will remarkably improve your AR status.',
  },
]

export default function PhysicianSideGigsPage() {
  return (
    <main>
      <PageHero
        label="PARTNER OFFER"
        title="Special Offer for the Physician Side Gigs Community"
        compact
      />

      {/* Offer + form */}
      <section className="section">
        <div className="container">
          <div
            className="psg-body"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 64,
              alignItems: 'start',
            }}
          >
            {/* LEFT — offer copy */}
            <RevealOnScroll>
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(28px, 3.2vw, 40px)',
                    fontWeight: 300,
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                    color: 'var(--gray-900)',
                    margin: 0,
                    marginBottom: 20,
                  }}
                >
                  Free Revenue Cycle Review for PSG Members &amp; 5% Off Our
                  Services
                </h2>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 20px',
                    background: 'rgba(0,181,214,0.08)',
                    border: '1px solid rgba(0,181,214,0.35)',
                    borderRadius: 999,
                    marginBottom: 28,
                  }}
                >
                  <span style={{ fontSize: 14, color: 'var(--gray-700)' }}>
                    Use Code:
                  </span>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: 'var(--primary)',
                    }}
                  >
                    PSG5OFF
                  </span>
                </div>

                <p
                  style={{
                    fontSize: 18,
                    lineHeight: 1.7,
                    color: 'var(--gray-800)',
                    margin: 0,
                    marginBottom: 20,
                  }}
                >
                  Discover permanent solutions to your biggest challenges and
                  become more profitable.
                </p>

                <p
                  style={{
                    fontSize: 17,
                    lineHeight: 1.7,
                    color: 'var(--gray-700)',
                    margin: 0,
                    marginBottom: 24,
                  }}
                >
                  Get a free, professional review of your billing processes,
                  coding and collections to make sure that you&apos;re:
                </p>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                  }}
                >
                  {reviewChecklist.map((item) => (
                    <li
                      key={item}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        fontSize: 17,
                        lineHeight: 1.6,
                        color: 'var(--gray-800)',
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          flexShrink: 0,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'rgba(0,181,214,0.12)',
                          color: 'var(--primary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                          fontWeight: 700,
                          marginTop: 2,
                        }}
                      >
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>

            {/* RIGHT — form card */}
            <RevealOnScroll delay={0.1}>
              <div
                style={{
                  padding: '36px 32px',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'white',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <div
                  className="section-title"
                  style={{ fontSize: 26, marginBottom: 24 }}
                >
                  Schedule Your Free Review
                </div>
                <PSGLeadForm />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(26px, 3vw, 38px)',
                  fontWeight: 300,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  color: 'var(--gray-900)',
                  margin: 0,
                  marginBottom: 20,
                }}
              >
                Focus on your patients, not your billing
              </h2>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: 'var(--gray-700)',
                  margin: 0,
                }}
              >
                Cosentus was created to help physicians across the country
                simplify, strengthen and grow their practices. What does that
                mean to you? It means having the ability to create a thriving
                business while being able to focus on your primary purpose:
                delivering exceptional care.
              </p>
            </div>
          </RevealOnScroll>

          <div
            className="psg-highlights"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 32,
              marginTop: 56,
            }}
          >
            {highlights.map((h, i) => (
              <RevealOnScroll key={h.title} delay={i * 0.1}>
                <div
                  style={{
                    padding: '32px 28px',
                    background: 'white',
                    border: '1px solid var(--gray-200)',
                    borderRadius: 'var(--radius-md)',
                    height: '100%',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 22,
                      fontWeight: 500,
                      color: 'var(--primary)',
                      margin: 0,
                      marginBottom: 12,
                    }}
                  >
                    {h.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 16,
                      lineHeight: 1.7,
                      color: 'var(--gray-700)',
                      margin: 0,
                    }}
                  >
                    {h.text}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .psg-body {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .psg-highlights {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </main>
  )
}
