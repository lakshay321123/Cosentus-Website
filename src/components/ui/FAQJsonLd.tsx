import type { FAQ } from '@/data/faqs'

/**
 * FAQJsonLd — server-rendered Schema.org FAQPage structured data.
 *
 * Why this matters:
 *   - Google uses FAQPage schema to eligible-list rich results.
 *   - LLM-powered search (Perplexity, Google AI Overviews, ChatGPT
 *     search) preferentially cite structured Q&A blocks because the
 *     question→answer mapping is unambiguous.
 *   - Even when the visual UI hides answers behind an expand toggle,
 *     this script tag carries the FULL answer text, so crawlers and
 *     LLM ingestion see everything without needing to fire the
 *     toggle.
 *
 * Why server-render (no `next/script`):
 *   - This is static content known at build time. Rendering it
 *     directly into the server HTML guarantees it is present at
 *     first-byte time for crawlers. next/script defers, which is
 *     fine for analytics but adds risk for SEO-critical markup.
 */
export default function FAQJsonLd({ items }: { items: FAQ[] }) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(f => ({
      '@type': 'Question',
      '@id': `#faq-${f.slug}`,
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      // dangerouslySetInnerHTML is the canonical way to inject JSON
      // into a <script> tag without React escaping the quotes.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
