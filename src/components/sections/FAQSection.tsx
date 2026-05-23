import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import RevealText from '@/components/ui/RevealText'
import FAQCard from '@/components/ui/FAQCard'
import FAQJsonLd from '@/components/ui/FAQJsonLd'
import { homepageFaqs } from '@/data/faqs'

/**
 * FAQSection (homepage variant)
 *
 * Renders the 3 marketing-priority FAQs as a row of glass cards with
 * the signature arrow-disc expander. Includes Schema.org FAQPage
 * structured data covering just the 3 homepage questions (the /faqs
 * page emits its own larger schema with all 10).
 *
 * Why 3 separate schema blocks (homepage + /faqs) and not one:
 *   Google's documented rule is that FAQPage schema must reflect the
 *   visible content on the page rendering it. Putting all 10 here
 *   would risk a "structured data must match visible content"
 *   warning in Search Console. Two scoped blocks is the safer split.
 *
 * Placement: between TestimonialsShuffleSection and CTASection on
 * the homepage. That's the spot where the user said the FAQs should
 * go and it works narratively — the testimonials build trust, the
 * FAQs clear final objections, the CTA closes.
 */
export default function FAQSection() {
  return (
    <section className="section faq-section" id="faqs">
      <FAQJsonLd items={homepageFaqs} />

      <div className="container">
        <RevealOnScroll direction="up" delay={0.1}>
          <header className="faq-header">
            <RevealText
              as="h2"
              perWordDelay={0.06}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 4.5vw, 56px)',
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: 'var(--gray-900)',
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              FAQ&rsquo;s
            </RevealText>
          </header>
        </RevealOnScroll>

        <div className="faq-grid">
          {homepageFaqs.map((f, i) => (
            <RevealOnScroll
              key={f.slug}
              direction="up"
              delay={0.2 + i * 0.08}
            >
              <FAQCard faq={f} />
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll direction="up" delay={0.5}>
          <div className="faq-footer">
            <Link href="/faqs" className="faq-browse-link">
              Browse all FAQs
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </RevealOnScroll>
      </div>

      <style>{`
        .faq-section {
          padding-top: 96px;
          padding-bottom: 96px;
          position: relative;
        }

        .faq-header {
          max-width: 760px;
          margin-bottom: 56px;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          /* Cards are equal-height when all closed; when one expands
             it pushes its own row taller. Using align-items:start
             keeps the others their natural closed height instead of
             stretching to match the expanded sibling. */
          align-items: start;
        }

        .faq-footer {
          margin-top: 48px;
          display: flex;
          justify-content: flex-start;
        }

        .faq-browse-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.92);
          text-decoration: none;
          padding: 12px 22px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          transition: background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1),
            border-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1),
            transform 250ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .faq-browse-link:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.30);
          transform: translateY(-1px);
        }

        .faq-browse-link svg {
          transition: transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .faq-browse-link:hover svg {
          transform: translateX(3px);
        }

        @media (max-width: 900px) {
          .faq-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .faq-section { padding-top: 64px; padding-bottom: 64px; }
          .faq-grid { grid-template-columns: 1fr; gap: 18px; }
          .faq-header { margin-bottom: 36px; }
        }
      `}</style>
    </section>
  )
}
