import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

interface PageHeroProps {
  label?: string
  title: React.ReactNode
  subtitle?: string
  ctaText?: string
  ctaHref?: string
  videoSrc?: string
  /**
   * When true, the hero shrinks to ~half height on mobile (≤768px).
   * Desktop is unaffected. Used by short-content pages (Blog, Client
   * Stories, News, Events, Partnership) where the default 50vh on a
   * tall mobile viewport eats too much above-the-fold real estate.
   */
  compact?: boolean
}

export default function PageHero({ label, title, subtitle, ctaText, ctaHref, videoSrc, compact }: PageHeroProps) {
  // The /images/specialties-hero.mp4 (DNA helix) is significantly lighter than
  // the default hero video, so titles and CTAs read poorly. When that source
  // is in use, dim the video itself and strengthen the gradient overlay.
  const isLightSpecialtyVideo = (videoSrc || '').includes('specialties-hero')

  return (
    <section
      className={`page-hero-section${compact ? ' page-hero-section--compact' : ''}`}
      style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}
    >
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
          filter: isLightSpecialtyVideo ? 'brightness(0.55) saturate(0.9)' : undefined,
        }}
      >
        <source src={videoSrc || "/videos/hero-banner.mp4"} type="video/mp4" />
      </video>

      {/* Dark overlay for readability */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isLightSpecialtyVideo
          ? 'linear-gradient(135deg, rgba(0,20,40,0.85) 0%, rgba(0,60,90,0.78) 50%, rgba(0,30,50,0.85) 100%)'
          : 'linear-gradient(135deg, rgba(0,30,50,0.75) 0%, rgba(0,80,100,0.6) 50%, rgba(0,40,60,0.7) 100%)',
        zIndex: 1,
      }} />

      {/* Content */}
      <div className="hero-content" style={{ paddingTop: 160, paddingBottom: 60, position: 'relative', zIndex: 2 }}>
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
              <Link href={ctaHref} className="btn-glass">
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
