import type { Metadata } from 'next'
import Link from 'next/link'
import FAQCard from '@/components/ui/FAQCard'
import FAQJsonLd from '@/components/ui/FAQJsonLd'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import RevealText from '@/components/ui/RevealText'
import { faqs } from '@/data/faqs'

/**
 * /faqs — dedicated FAQ index page.
 *
 * Per direction: this page is intentionally NOT linked from the
 * primary navigation. The only public entry point is the
 * "Browse all FAQs" link inside FAQSection on the homepage. The
 * page is still server-rendered, indexed (no robots noindex), and
 * eligible for organic search traffic — it just isn't promoted in
 * the global nav.
 */

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Cosentus',
  description:
    'How Cosentus pairs 25 years of specialty RCM expertise with AI voice agents. Pricing, security, onboarding, denial handling, and what to expect when switching from your current billing provider.',
  alternates: { canonical: '/faqs' },
  openGraph: {
    title: 'Frequently Asked Questions | Cosentus',
    description:
      'Answers to the questions practice owners and administrators ask before partnering with Cosentus.',
    url: '/faqs',
    type: 'website',
  },
}

export default function FAQsPage() {
  // Group by category for the page layout. Preserves the order in
  // which categories first appear in the data file.
  const grouped: { category: string; items: typeof faqs }[] = []
  for (const f of faqs) {
    const bucket = grouped.find(g => g.category === f.category)
    if (bucket) bucket.items.push(f)
    else grouped.push({ category: f.category, items: [f] })
  }

  return (
    <main className="faqs-page">
      {/* Full FAQPage schema — all 10 entries — for the dedicated
          /faqs page. The homepage emits its own scoped schema with
          only the 3 surfaced there. */}
      <FAQJsonLd items={faqs} />

      <section className="faqs-hero">
        <div className="container">
          <RevealOnScroll direction="up" delay={0.05}>
            <RevealText
              as="h1"
              perWordDelay={0.05}
              style={{
                fontFamily: 'var(--font-display)',
                /* Sized for the 140/100px band (reduced from 220/160
                   May 2026). Was clamp(36, 5vw, 64) when the hero
                   sat inside a 100vh dark page. */
                fontSize: 'clamp(28px, 3.5vw, 42px)',
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: 'rgba(255, 255, 255, 0.98)',
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              <>
                Frequently asked,{' '}
                {/* Accent on "directly answered" was #00B5D6 (brand teal)
                    when the hero bg was dark. Stayed white when the band
                    was teal (teal-on-teal would have been invisible) and
                    is staying white now that the band is grey (the project
                    direction May 2026 is no colour-flip on band; matches
                    the nav-link hover removal in app/globals.css). The
                    italic flourish is the editorial accent. */}
                <span style={{ color: 'rgba(255, 255, 255, 0.98)', fontStyle: 'italic' }}>directly answered.</span>
              </>
            </RevealText>
          </RevealOnScroll>
        </div>
      </section>

      <section className="faqs-body">
        <div className="container">
          {/* Lead paragraph — was the hero subtitle in the previous
              dark-page layout. Moved here so the grey band stays
              clean at ~140px and the framing copy isn't lost. Sits
              above the first FAQ group, in the dark area below the
              band. */}
          <RevealOnScroll direction="up" delay={0.05}>
            <p className="faqs-lead">
              The questions practice owners, CFOs, and administrators ask us before they sign on —
              and the straight answers we give back. If your question isn&rsquo;t here, ask us directly
              during the free revenue analysis.
            </p>
          </RevealOnScroll>
          {grouped.map((group, gi) => (
            <div key={group.category} className="faqs-group">
              <RevealOnScroll direction="up" delay={0.1}>
                <h2 className="faqs-group-heading">
                  <span className="faqs-group-num">0{gi + 1}</span>
                  <span className="faqs-group-label">{group.category}</span>
                </h2>
              </RevealOnScroll>
              <div className="faqs-group-grid">
                {group.items.map((f, i) => (
                  <RevealOnScroll
                    key={f.slug}
                    direction="up"
                    delay={0.15 + i * 0.05}
                  >
                    <FAQCard faq={f} defaultExpanded={gi === 0 && i === 0} />
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — uses the canonical .cta-section + .cta-box + .btn-primary
          classes from the homepage CTASection so the visual treatment
          matches identically. The shared glass-pill recipe is applied
          via app/globals.css selectors extended to also match a
          .faqs-page ancestor (see the .cta-section / .cta-box /
          .btn-primary blocks around lines 408, 530, 4196, 4269, etc.). */}
      <section className="cta-section">
        <div className="container">
          <RevealOnScroll direction="scale">
            <div className="cta-box">
              <RevealText as="h2" perWordDelay={0.06} baseDelay={0.15}>
                Still have a question?
              </RevealText>
              <Link href="/contact" className="btn-primary">
                Get Your Free Revenue Analysis
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <style>{`
        .faqs-page {
          /* /faqs needs its own bg because the (site) layout does NOT
             provide ImmersiveVideoBackground — that lives on the
             homepage only. Without this, body's default var(--white)
             shows through and the white-on-glass text becomes
             invisible.

             May 2026: switched from a dark-navy radial gradient
             (off-palette: #0a2d41 → #061c2a → #030f17) to a flat
             #616161 — the medium-dark gray directly from the official
             Cosentus brand sheet. Per direct user direction. Solid
             color, not gradient, by design.

             Contrast check: white text (#FFFFFF) on #616161 = 6.19:1
             which passes WCAG AA body text (4.5:1) and AA large text
             (3.0:1). Glass-card surfaces (20% white wash) on top of
             this stay readable.

             padding-top removed earlier: the nav-clearance padding
             lives inside .faqs-hero so the brand band can extend to
             the top of the viewport. */
          background: #616161;
          min-height: 100vh;
          padding-bottom: 96px;
        }

        /* Grey band hero — matches the Resources sub-pages
           (Blog, Client Stories, News, Events, Insights) which use
           PageHero band prop. Same dimensions and same background
           colour, hand-rolled here because /faqs uses its own
           custom hero (not PageHero). If the canonical band rules
           in app/globals.css (.page-hero-section--band) change,
           keep this in sync — there is no shared geometry source.

           Dimensions reduced May 2026 to match new band sizing:
             desktop: 140px min-height (was 220), padding 85/20 (was 110/40)
             mobile:  100px min-height (was 160), padding 65/16 (was 80/24)

           Top padding (~85 desktop / 65 mobile) clears the fixed nav
           (~70-80px) with a small breathing gap. align-items: center
           vertically centres the H1 inside the band. */
        .faqs-hero {
          background: var(--band-bg);
          min-height: 140px;
          display: flex;
          align-items: center;
          padding-top: 85px;
          padding-bottom: 20px;
        }
        @media (max-width: 768px) {
          .faqs-hero {
            min-height: 100px;
            padding-top: 65px;
            padding-bottom: 16px;
          }
        }

        /* Lead paragraph — moved from the hero (was .faqs-subtitle)
           to the body so the grey band stays lean. Sits above the
           first FAQ group on the dark page background. */
        .faqs-lead {
          font-size: 18px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.78);
          max-width: 680px;
          margin: 0 0 40px 0;
        }

        .faqs-body {
          padding-top: 56px;
        }

        .faqs-group {
          margin-top: 56px;
        }

        .faqs-group:first-child {
          margin-top: 24px;
        }

        .faqs-group-heading {
          display: flex;
          align-items: baseline;
          gap: 16px;
          font-family: var(--font-display);
          font-weight: 300;
          font-size: clamp(20px, 1.6vw, 26px);
          color: rgba(255, 255, 255, 0.88);
          margin: 0 0 24px 0;
          letter-spacing: -0.01em;
        }

        .faqs-group-num {
          /* Editorial detail: a faint number prefix for each
             category, like chapter marks. Mirrors the way the
             services pages use small numeric markers next to
             step headings. */
          font-variant-numeric: tabular-nums;
          font-size: 0.7em;
          color: rgba(0, 181, 214, 0.85);
          letter-spacing: 0.08em;
        }

        .faqs-group-label {
          font-style: italic;
        }

        .faqs-group-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 22px;
          align-items: start;
        }

        @media (max-width: 900px) {
          .faqs-group-grid { grid-template-columns: 1fr; gap: 16px; }
        }

        @media (max-width: 640px) {
          .faqs-page { padding-top: 88px; padding-bottom: 64px; }
        }
      `}</style>
    </main>
  )
}
