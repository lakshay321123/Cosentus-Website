import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

interface PageHeroProps {
  label?: string
  title: React.ReactNode
  subtitle?: string
  ctaText?: string
  ctaHref?: string
}

export default function PageHero({ label, title, subtitle, ctaText, ctaHref }: PageHeroProps) {
  return (
    <section style={{ position: 'relative', minHeight: '50vh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src="/videos/hero-banner.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for readability */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(0,30,50,0.75) 0%, rgba(0,80,100,0.6) 50%, rgba(0,40,60,0.7) 100%)',
        zIndex: 1,
      }} />

      {/* Content */}
      <div className="hero-content" style={{ paddingTop: 160, paddingBottom: 60, position: 'relative', zIndex: 2 }}>
        {label && (
          <RevealOnScroll>
            <div className="hero-badge">
              <div className="hero-badge-dot" />
              <span>{label}</span>
            </div>
          </RevealOnScroll>
        )}

        <RevealOnScroll delay={0.1}>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, fontStyle: 'italic', letterSpacing: '-0.03em', lineHeight: 1.02, color: 'white', marginBottom: 24 }}>{title}</h1>
        </RevealOnScroll>

        {subtitle && (
          <RevealOnScroll delay={0.2}>
            <p className="hero-sub" style={{ maxWidth: 680, color: 'rgba(255,255,255,0.85)' }}>{subtitle}</p>
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
