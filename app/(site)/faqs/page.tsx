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
                    <FAQCard
                      faq={f}
                      defaultExpanded={gi === 0 && i === 0}
                      // Each FAQ auto-expands as it scrolls into view
                      // on /faqs. Per user direction 2026-05-25:
                      // "as we are scrolling down and it is appearing,
                      // it should auto open as well the FAQs so it
                      // becomes easier for the user to navigate."
                      // Homepage FAQ section does NOT pass this prop,
                      // so its rows stay click-to-expand.
                      autoExpandOnView={true}
                    />
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
          /* Single column on all viewports — matches the blog
             post FAQ list pattern in BlogPostContent.tsx (which
             renders FAQs as a stacked column, not a grid).
             Previous 2-col desktop / 1-col mobile was for the
             big italic-serif card design that benefited from
             horizontal spread; the new compact list rows are
             more readable as a single wide column. */
          grid-template-columns: 1fr;
          /* 8px gap matches the blog FAQ marginBottom: 8 between
             rows. Tight enough to feel like a list, loose enough
             that the rounded-corner borders aren't touching. */
          gap: 8px;
          align-items: start;
          /* Constrain to a comfortable reading width on wide
             desktops — the rows would otherwise stretch to the
             full container width which is too wide for a Q&A
             read. ~860px lines up with the blog post content
             column width. */
          max-width: 860px;
        }

        @media (max-width: 640px) {
          .faqs-page { padding-top: 88px; padding-bottom: 64px; }
        }

        /* =====================================================
           Neutralize the .reveal / .reveal-scale opacity-0 +
           blur(4px) initial state on /faqs.

           User report 2026-05-25 (with screenshot): "The CTA in
           the FAQ section is not visible."

           Root cause: the page uses RevealOnScroll wrappers
           around the lead paragraph, group headings, each FAQ
           row, AND the bottom CTA. The global .reveal /
           .reveal-scale rules (app/globals.css ~line 2472) start
           those wrappers at opacity:0 with filter:blur(4px),
           and only flip to opacity:1 when the IntersectionObserver
           in RevealOnScroll.tsx adds a 'visible' class. The CTA
           lives at the bottom of a long page; in some scroll
           conditions the observer doesn't fire reliably or the
           user reaches the section while it's still in the
           initial hidden state.

           For a Q&A reference page this hide-then-reveal pattern
           is more friction than payoff — users want to read the
           answers, not watch them fade in. Override to force
           visible immediately.

           Side effect: the staggered reveal animation on /faqs
           is gone. The teal-band hero H1 still has its
           RevealText word-stagger because that's a different
           mechanism (RevealText, not RevealOnScroll). All
           other pages are unaffected — this is scoped to
           .faqs-page. */
        .faqs-page .reveal,
        .faqs-page .reveal-scale,
        .faqs-page .reveal-left,
        .faqs-page .reveal-right,
        .faqs-page .reveal-flag {
          opacity: 1 !important;
          transform: none !important;
          filter: none !important;
        }

        /* =====================================================
           FAQCard re-skin — match the EXACT pattern used by the
           blog post FAQ component (see BlogPostContent.tsx
           ~line 470, where blog-post-embedded FAQs render).

           Visual recipe (from blog FAQ):
             Row container: 1px solid var(--gray-200), border-
               radius var(--radius-md) (12px), no padding around
               itself, 8px gap between rows. Open state: border
               turns brand teal #00B5D6.
             Question button: padding 18px 24px, background
               var(--gray-50) closed / var(--primary-ghost) open.
               Question text is sans-serif bold (--font-body,
               weight 600, size 16, color gray-900) — NOT the
               display-serif italic the FAQCard component ships
               with. Chevron is teal stroke 2.5, 18×18, on the
               right side, rotates 180deg when open.
             Answer panel: white background, padding 0 24px 20px,
               text size 16 line-height 1.75, color gray-600.

           First attempt (commit c5e051e) made big bordered white
           cards with the original italic display-serif question.
           User direction 2026-05-25: "The design is not matching.
           As you can see, I've given you the blog post FAQ
           design and the FAQ design page." This block REPLACES
           that first attempt with the actual blog-FAQ recipe.

           !important is required because the global rule at
           app/globals.css ~line 4747 also targets
           .faqs-page .faq-card-inner with !important. The
           styled-jsx in FAQCard.tsx itself has lower specificity
           (single class) so plain .faqs-page X overrides win
           against it without !important — but I use !important
           uniformly here for clarity and resilience against
           future global-rule changes.
           ===================================================== */

        /* Row container — replaces the big card with a compact
           list-row look. No padding here (padding lives on the
           question button to enable hover-color-changes); the
           border + radius do the row separation. */
        .faqs-page .faq-card-inner {
          background: var(--gray-50) !important;
          border: 1px solid var(--gray-200) !important;
          border-radius: var(--radius-md) !important;
          padding: 0 !important;
          box-shadow: none !important;
          overflow: hidden;
          transition: border-color 0.2s ease, background 0.2s ease !important;
        }
        /* Open state — border turns teal (matches blog FAQ open
           state). Background change handled via .faq-card-question
           override below. */
        .faqs-page .faq-card[data-expanded='true'] .faq-card-inner {
          border-color: #00B5D6 !important;
        }

        /* Override hover lift entirely — the blog FAQ rows don't
           translate or change shadow on hover, just a subtle
           border-color shift. Previously the global rule at
           app/globals.css ~line 4747 also applied a dark-glass
           hover shadow to .faqs-page .faq-card:hover .faq-card-
           inner with !important; that entry was removed from the
           global rule in the same commit as this redesign, so
           !important here is now defensive only. */
        .faqs-page .faq-card:hover .faq-card-inner {
          box-shadow: none !important;
          border-color: var(--gray-300) !important;
          transform: none !important;
        }
        .faqs-page .faq-card[data-expanded='true']:hover .faq-card-inner {
          border-color: #00B5D6 !important;
        }

        /* Question — sans-serif bold, dark on gray-50.
           Replaces the italic display-serif treatment in
           FAQCard.tsx's styled-jsx. Padding is on the h3 (not
           the card) so the bg-color change on open state covers
           the full row. */
        .faqs-page .faq-card-question {
          font-family: var(--font-body) !important;
          font-style: normal !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          line-height: 1.5 !important;
          letter-spacing: normal !important;
          color: var(--gray-900) !important;
          /* Right padding 56px reserves space for the chevron
             button positioned absolute on the right. */
          padding: 18px 56px 18px 24px !important;
          margin: 0 !important;
        }
        /* Open state — question header gets a primary-ghost tint
           (very light teal), matches blog FAQ open state. */
        .faqs-page .faq-card[data-expanded='true'] .faq-card-question {
          background: var(--primary-ghost) !important;
        }

        /* Answer panel — white background, generous padding, gray
           body text. Matches blog FAQ answer panel exactly. */
        .faqs-page .faq-card-answer-inner {
          background: #FFFFFF;
          padding: 0 24px 20px;
        }
        .faqs-page .faq-card-answer-text {
          font-size: 16px !important;
          line-height: 1.75 !important;
          color: var(--gray-600) !important;
          padding-top: 12px;
          margin: 0 !important;
        }
        /* Hide the divider — the blog FAQ pattern uses background
           color changes (gray-50 → primary-ghost on open, then
           white for the answer) to separate question and answer
           visually. No horizontal rule is needed. */
        .faqs-page .faq-card-divider {
          display: none !important;
        }

        /* Chevron — small teal chevron-down on the right of the
           question row, vertically positioned to align with the
           first line of the question (top: 24px = padding-top
           18px + half line-height of 12px ≈ first-line center).
           For multi-line questions the chevron stays aligned with
           the first line; this matches how the blog FAQ renders
           when the question wraps (the flex align-items: center
           in the blog version vs my absolute positioning here
           differs slightly for multi-line, but visually close
           enough for 1-2 line questions which is the typical
           case.) */
        .faqs-page .faq-card-disc-arrow {
          display: none;
        }
        .faqs-page .faq-card-disc {
          position: absolute !important;
          top: 24px !important;
          right: 22px !important;
          bottom: auto !important;
          width: 18px !important;
          height: 18px !important;
          background-color: transparent !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300B5D6' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: center;
          background-size: 18px 18px;
          transition: transform 0.3s ease !important;
        }
        .faqs-page .faq-card[data-expanded='true'] .faq-card-disc {
          transform: rotate(180deg) !important;
        }
        /* Override the component's hover-translateY effect on the
           disc — blog FAQ chevrons don't move on hover. Keep the
           expanded rotation (handled by the data-expanded selector
           above) even when hovered. */
        .faqs-page .faq-card:hover .faq-card-disc {
          transform: rotate(0deg) !important;
          filter: none !important;
        }
        .faqs-page .faq-card[data-expanded='true']:hover .faq-card-disc {
          transform: rotate(180deg) !important;
        }

        @media (max-width: 768px) {
          .faqs-page .faq-card-question {
            font-size: 15px !important;
            padding: 16px 48px 16px 18px !important;
          }
          .faqs-page .faq-card-disc {
            top: 22px !important;
            right: 18px !important;
          }
          .faqs-page .faq-card-answer-inner {
            padding: 0 18px 18px;
          }
        }
      `}</style>
    </main>
  )
}
