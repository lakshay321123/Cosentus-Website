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
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: 'var(--gray-900)',
                marginTop: 0,
                marginBottom: 18,
              }}
            >
              <>
                Frequently asked,{' '}
                <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>directly answered.</span>
              </>
            </RevealText>
          </RevealOnScroll>
          <RevealOnScroll direction="up" delay={0.18}>
            <p className="faqs-subtitle">
              The questions practice owners, CFOs, and administrators ask us before they sign on —
              and the straight answers we give back. If your question isn&rsquo;t here, ask us directly
              during the free revenue analysis.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="faqs-body">
        <div className="container">
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

          <RevealOnScroll direction="up" delay={0.2}>
            <div className="faqs-cta">
              <div className="faqs-cta-text">
                <h3 className="faqs-cta-heading">Question we didn&rsquo;t answer?</h3>
                <p className="faqs-cta-sub">
                  Ask it during the free revenue analysis. No commitment, no script.
                </p>
              </div>
              <Link href="/contact" className="faqs-cta-link">
                Get Your Free Revenue Analysis
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <style>{`
        .faqs-page {
          /* Sits over the global ImmersiveVideoBackground inherited
             from the (site) layout. No local bg needed. */
          padding-top: 120px;
          padding-bottom: 96px;
        }

        .faqs-hero {
          padding-bottom: 48px;
        }

        .faqs-subtitle {
          font-size: 18px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.78);
          max-width: 680px;
          margin: 0;
        }

        .faqs-body {
          padding-top: 24px;
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

        .faqs-cta {
          margin-top: 72px;
          padding: 36px 40px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          flex-wrap: wrap;
        }

        .faqs-cta-heading {
          font-family: var(--font-display);
          font-weight: 300;
          font-size: clamp(20px, 1.8vw, 28px);
          color: rgba(255, 255, 255, 0.95);
          margin: 0 0 6px 0;
          letter-spacing: -0.01em;
        }

        .faqs-cta-sub {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.70);
          margin: 0;
        }

        .faqs-cta-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 26px;
          background: rgba(0, 181, 214, 0.18);
          border: 1.5px solid rgba(0, 181, 214, 0.55);
          color: #fff;
          font-weight: 600;
          font-size: 15px;
          border-radius: 999px;
          text-decoration: none;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1),
            transform 250ms cubic-bezier(0.22, 0.61, 0.36, 1),
            border-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .faqs-cta-link:hover {
          background: rgba(0, 181, 214, 0.28);
          border-color: rgba(0, 181, 214, 0.80);
          transform: translateY(-1px);
        }

        .faqs-cta-link svg {
          transition: transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .faqs-cta-link:hover svg {
          transform: translateX(3px);
        }

        @media (max-width: 900px) {
          .faqs-group-grid { grid-template-columns: 1fr; gap: 16px; }
        }

        @media (max-width: 640px) {
          .faqs-page { padding-top: 88px; padding-bottom: 64px; }
          .faqs-cta { padding: 28px; flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </main>
  )
}
