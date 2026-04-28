import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="container">
        <RevealOnScroll direction="scale">
          <div className="cta-box">
            <h2>Get Your Financial MRI.<br />Know Exactly Where You&apos;re Losing Revenue.</h2>
            <Link href="/contact" className="btn-primary">
              Get Your Financial MRI — Free
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
