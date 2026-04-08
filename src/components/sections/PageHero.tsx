import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

interface PageHeroProps {
  label?: string
  title: string
  subtitle?: string
  ctaText?: string
  ctaHref?: string
}

export default function PageHero({ label, title, subtitle, ctaText, ctaHref }: PageHeroProps) {
  return (
    <section className="hero" style={{ minHeight: '50vh' }}>
      <div className="hero-bg">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
      </div>

      <div className="hero-content" style={{ paddingTop: 160, paddingBottom: 60 }}>
        {label && (
          <RevealOnScroll>
            <div className="hero-badge">
              <div className="hero-badge-dot" />
              <span>{label}</span>
            </div>
          </RevealOnScroll>
        )}

        <RevealOnScroll delay={0.1}>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>{title}</h1>
        </RevealOnScroll>

        {subtitle && (
          <RevealOnScroll delay={0.2}>
            <p className="hero-sub" style={{ maxWidth: 680 }}>{subtitle}</p>
          </RevealOnScroll>
        )}

        {ctaText && ctaHref && (
          <RevealOnScroll delay={0.3}>
            <div className="hero-actions">
              <Link href={ctaHref} className="btn-primary">
                {ctaText}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  )
}
