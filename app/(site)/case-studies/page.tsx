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
          items 7 + 8.

          Doc copy: a 3-paragraph block headed "Your Revenue
          Cycle Has More Potential Than You Think", followed by
          a CTA box "Let's uncover what your revenue cycle is
          leaving behind." + the "Get Your No-Cost Financial MRI"
          button.

          Earlier implementation rendered the 3 paragraphs as
          stacked left-aligned prose. Preview feedback: too flat
          next to the rest of the site (specialty pages all use
          interactive split panels and marquees). Rebuilt as the
          inline split-panel pattern used by every /specialties/*
          page:
            - Heading sits centered above the panel (doc para 1
              as framing).
            - Left panel (white): "Where Revenue Hides" — the
              6 leak categories doc para 2 lists, broken out as
              bullets so each is its own visual element instead
              of a comma-separated string.
            - Right panel (teal): "How We Find It and Get It
              Back" — 3 capability bullets distilled from doc
              para 3 (find gaps / fix root causes / collect what
              you've earned).

          The shared <CTASection /> component (used on every
          other page) renders the same visual CTA box with the
          headline "Know Exactly Where You're Losing Revenue."
          and the same button. Doc 1 wanted a different headline
          here, so the bottom CTA below is an inline copy of the
          cta-section/cta-box using the doc's headline. Result:
          one CTA on the page (not two stacked) using the
          client-stories-specific wording. */}
      <section className="section">
        <div className="container" style={{ maxWidth: 820, textAlign: 'center' }}>
          <RevealOnScroll>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.4vw, 42px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 20 }}>
              Your Revenue Cycle Has More Potential Than You Think.
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.15}>
            <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--gray-600)', maxWidth: 720, margin: '0 auto' }}>
              The client stories above show what happens when revenue cycle problems are fixed at the root.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section style={{ overflow: 'hidden' }}>
        <div className="problem-solution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 400 }}>
          <div className="ps-panel ps-problem" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: 'var(--white)', position: 'relative' }}>
            <RevealOnScroll direction="left" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--gray-900)', marginTop: 0, marginBottom: 28 }}>
                Where Revenue Hides.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Denied claims',
                  'Slow follow-up',
                  'Payer delays',
                  'Coding gaps',
                  'Eligibility issues',
                  'Underworked AR',
                ].map((bullet, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 18, lineHeight: 1.6, color: 'var(--gray-700)', marginBottom: 14 }}>
                    <span aria-hidden="true" style={{ flexShrink: 0, width: 7, height: 7, borderRadius: '50%', background: '#00B5D6' }} />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          </div>

          <div className="ps-panel ps-solution" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: '#00B5D6', position: 'relative', overflow: 'hidden' }}>
            <div className="ps-shimmer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            <RevealOnScroll direction="right" delay={0.1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'white', marginTop: 0, marginBottom: 28 }}>
                How We Find It and Get It Back.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: 520 }}>
                {[
                  'Find the gaps that are leaking revenue today',
                  'Fix the root causes so the same leaks don\u2019t come back',
                  'Collect more of what you\u2019ve already earned, with specialty-trained experts and Ai-native technology',
                ].map((bullet, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.95)', marginBottom: 18 }}>
                    <span aria-hidden="true" style={{ flexShrink: 0, width: 7, height: 7, borderRadius: '50%', background: 'white', marginTop: 10 }} />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          </div>
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
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  )
}
