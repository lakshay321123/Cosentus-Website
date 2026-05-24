import { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/sections/PageHero'
import CaseStudiesSection from '@/components/sections/CaseStudiesSection'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import RevealText from '@/components/ui/RevealText'

export const metadata: Metadata = {
  title: 'Client Results: Real Practices, Real Revenue Growth | Cosentus',
  description: 'Every practice we partner with has a unique revenue story. Outcome-first client success stories demonstrating the concrete impact of our R+A model.',
}

export default function CaseStudiesPage() {
  return (
    <main>
      <PageHero title="Client Stories" band />
      <CaseStudiesSection mode="viewer" />

      {/* Content block + custom CTA per Doc 1 (May 24 2026)
          items 7 + 8. The doc asked for a 3-paragraph block
          headed "Your Revenue Cycle Has More Potential Than
          You Think" beneath the success stories, followed by
          a CTA box with the headline "Let's uncover what your
          revenue cycle is leaving behind." and the existing
          "Get Your No-Cost Financial MRI" button.

          The shared <CTASection /> component (used on every
          other page) renders the same visual CTA box with the
          headline "Know Exactly Where You're Losing Revenue."
          and the same button. Doc 1 wanted a different headline
          here, so this page uses an inline cta-section/cta-box
          built from the same global CSS classes instead of
          rendering <CTASection /> after this block. Result:
          one CTA on the page (not two stacked) using the
          client-stories-specific headline. */}
      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          <RevealOnScroll>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 24 }}>
              Your Revenue Cycle Has More Potential Than You Think
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.15}>
            <p style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--gray-700)', marginBottom: 18 }}>
              The client stories above show what happens when revenue cycle problems are fixed at the root.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.25}>
            <p style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--gray-700)', marginBottom: 18 }}>
              Missed revenue often hides in the details: denied claims, slow follow-up, payer delays, coding gaps, eligibility issues, and underworked AR.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.35}>
            <p style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--gray-700)', margin: 0 }}>
              Cosentus helps healthcare organizations find those gaps, fix the root causes, and collect more of what they have already earned with specialty-trained experts and AI-native technology.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <RevealOnScroll direction="scale">
            <div className="cta-box">
              <RevealText as="h2" perWordDelay={0.06} baseDelay={0.15}>
                Let&apos;s uncover what your revenue cycle is leaving behind.
              </RevealText>
              <Link href="/contact" className="btn-primary">
                Get Your No-Cost Financial MRI
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  )
}
