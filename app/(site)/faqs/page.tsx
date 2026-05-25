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
             homepage only.

             History:
               - Initial: dark-navy radial gradient
               - May 2026: switched to flat #616161 (Cosentus brand
                 medium-dark gray) per user direction
               - May 2026 (later): switched to white per user
                 direction "the FAQ Page change the design — Here
                 I just want FAQs to be designed like we have in
                 the blogs pages etc. Background can be white".
                 The cards switch from dark-glass to white-blog
                 surface in the same change. */
          background: #FFFFFF;
          min-height: 100vh;
          padding-bottom: 96px;
          /* Anchor for CSS-scoped overrides below. Without an
             explicit color reset, child elements would still
             inherit from any default (none here in practice). */
          color: var(--gray-900);
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

        /* Lead paragraph — now sits on white page bg. Dark gray
           text gives readable body color. (Previously was white-
           translucent on the gray bg.) */
        .faqs-lead {
          font-size: 18px;
          line-height: 1.65;
          color: #4a4a4a;
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
          /* Was white-translucent on gray; now near-black on white
             with very slight softening so it doesn't read as harsh
             headline. */
          color: #1a1a1a;
          margin: 0 0 24px 0;
          letter-spacing: -0.01em;
        }

        .faqs-group-num {
          /* Editorial detail: faint number prefix per category.
             Brand teal works on both light and dark backgrounds —
             color stays the same as before. */
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

        /* =====================================================
           FAQCard re-skin — blog-style white surface.

           The FAQCard component is shared with the homepage
           FAQ section (which uses .home-immersive scope) and
           has its own styled-jsx with dark-glass colors. The
           homepage FAQ section ALSO has a global rule at
           app/globals.css ~line 4747 that applies the liquid-
           glass inset-shadow recipe to .faqs-page .faq-card-
           inner (because /faqs USED to use the same dark-glass
           treatment).

           Now that /faqs is white, those styles fight us. The
           overrides below win because:
             - Selector specificity (0,2,0) matches the global
               glass rule, but our rules declare later in the
               cascade and use !important to overpower the
               global rule's own !important.
             - The styled-jsx in FAQCard.tsx is class-only
               (specificity 0,1,0) — beaten by our (0,2,0)
               selectors without needing !important.
           ===================================================== */

        /* White card surface — replaces dark-glass treatment.
           Subtle gray-200 border + soft shadow matches the
           blog-card visual recipe (see BlogContent.tsx where
           cards use 'var(--white)' bg + 'var(--gray-200)'
           border). !important is required to defeat the
           equal-specificity global glass rule. */
        .faqs-page .faq-card-inner {
          background: #FFFFFF !important;
          border: 1px solid var(--gray-200) !important;
          border-radius: 16px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
        }
        .faqs-page .faq-card:hover .faq-card-inner {
          /* Hover lift — slight elevation + slightly tinted
             shadow. Matches blog-card hover. */
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08) !important;
          border-color: var(--gray-300) !important;
        }

        /* Question text — dark on white. The FAQCard component
           styles this rgba(255,255,255,0.96); we override to
           near-black for legibility on white. The italic display
           serif treatment is preserved (styled-jsx still applies
           font-family/style/weight/size). */
        .faqs-page .faq-card-question {
          color: #1a1a1a;
        }

        /* Answer body text — gray-700-ish for comfortable reading
           without being harsh-black on the questions above. */
        .faqs-page .faq-card-answer-text {
          color: #4a4a4a;
        }

        /* Divider between question and answer — light gray instead
           of the dark-page semi-transparent white gradient. */
        .faqs-page .faq-card-divider {
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.12) 0%,
            rgba(0, 0, 0, 0) 75%
          ) !important;
        }

        /* Expand affordance — the FAQCard ships with a white-
           filled SVG disc (btn-specialties-arrow.svg) designed
           for the dark homepage. On a white card the white disc
           is invisible. Hide the asset and draw a teal chevron-
           down via background-image SVG data URI instead.

           Rotation logic mirrors the original component: 0deg
           at rest = chevron points down ("open me"); 180deg
           when expanded = chevron points up ("close me"). */
        .faqs-page .faq-card-disc-arrow {
          display: none;
        }
        .faqs-page .faq-card-disc {
          width: 36px;
          height: 36px;
          right: 18px;
          bottom: 18px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300B5D6' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: center;
          background-size: 22px 22px;
          transition: transform 420ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .faqs-page .faq-card[data-expanded='true'] .faq-card-disc {
          transform: rotate(180deg);
        }
        /* Suppress the original hover-nudge (drop 4px + cyan
           drop-shadow) that the component applies to the
           white disc; on the chevron variant a simple scale
           reads cleaner. */
        .faqs-page .faq-card:hover .faq-card-disc {
          transform: scale(1.1);
          filter: none;
        }
        .faqs-page .faq-card[data-expanded='true']:hover .faq-card-disc {
          transform: rotate(180deg) scale(1.1);
        }

        @media (max-width: 768px) {
          .faqs-page .faq-card-disc {
            width: 32px;
            height: 32px;
            right: 16px;
            bottom: 16px;
            background-size: 18px 18px;
          }
        }
      `}</style>
    </main>
  )
}
