import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import RevealText from '@/components/ui/RevealText'

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
  /**
   * When true, the hero renders as a flat brand-teal band — no video,
   * no overlay, ~220px desktop / 160px mobile. Used by the Resources
   * sub-pages (Blog, Client Stories, News, Events, Insights) where
   * the full video hero felt too heavy for index/list pages.
   *
   * Side effects when band=true:
   *   - <video> + overlay are not rendered (saves the ~1.9MB mp4)
   *   - background: var(--primary) is applied directly to the section
   *   - title shrinks to clamp(28px, 3.5vw, 42px) to fit the band
   *   - subtitle and CTA are NOT rendered even if passed (the band
   *     is too short to fit them cleanly). Pages that previously
   *     passed a subtitle (e.g. Insights) lose it visually — by
   *     design; the page body covers the same ground.
   */
  band?: boolean
  /**
   * When true, the hero uses a fixed height instead of min-height: 50vh.
   * This makes the hero render at the same height across all specialty
   * pages regardless of content length — earlier behaviour (just
   * min-height) let longer subtitles push some pages taller than
   * others, which read as inconsistency when navigating between
   * Specialties. The fixed height (600px desktop / 440px mobile) is
   * tall enough to comfortably fit every specialty page's title +
   * subtitle + CTA at the existing typography sizes.
   */
  specialty?: boolean
}

export default function PageHero({ label, title, subtitle, ctaText, ctaHref, videoSrc, compact, band, specialty }: PageHeroProps) {
  // The /images/specialties-hero.mp4 (DNA helix) is significantly lighter than
  // the default hero video, so titles and CTAs read poorly. When that source
  // is in use, dim the video itself and strengthen the gradient overlay.
  const isLightSpecialtyVideo = (videoSrc || '').includes('specialties-hero')

  const titleStyles: React.CSSProperties = {
    // Band variant runs at ~220px section height, so the default
    // clamp(36, 5vw, 64) would crowd the vertical space. Drop one
    // size tier. Italic + 700 weight kept so the typography identity
    // (matches the bigger video-hero pages) stays consistent.
    fontSize: band ? 'clamp(28px, 3.5vw, 42px)' : 'clamp(36px, 5vw, 64px)',
    fontWeight: 700,
    fontStyle: 'italic',
    letterSpacing: '-0.03em',
    lineHeight: 1.02,
    color: 'white',
    marginBottom: band ? 0 : 24,
  }

  // Compose the className — band wins over compact on the same
  // breakpoints (band has its own min-height + padding rules in
  // globals.css). Both classes can co-exist; the modifier with the
  // later rule in globals.css decides.
  const sectionClass = [
    'page-hero-section',
    compact && 'page-hero-section--compact',
    band && 'page-hero-section--band',
    specialty && 'page-hero-section--specialty',
  ].filter(Boolean).join(' ')

  // Band variant: solid brand teal, no video, no overlay.
  // Default: positioned/overflow setup for the absolutely-positioned
  // video + overlay layers below.
  const sectionStyle: React.CSSProperties = band
    ? { position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', background: 'var(--band-bg)' }
    : { position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }

  return (
    <section className={sectionClass} style={sectionStyle}>
      {/* Video + overlay only render in the non-band variant. In band
          mode the section's solid teal background is the entire visual,
          and the video file is never fetched (perf win). */}
      {!band && (
        <>
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
        </>
      )}

      {/* Content. Default variant uses inline paddingTop/Bottom (matches
          pre-band behaviour, overriding globals.css .hero-content's
          140/80). Band variant skips the inline padding so the
          .page-hero-section--band .hero-content rule in globals.css
          provides tight band-specific padding (110/40 desktop, 80/24
          mobile). */}
      <div
        className="hero-content"
        style={
          band
            ? { position: 'relative', zIndex: 2 }
            : { paddingTop: 160, paddingBottom: 60, position: 'relative', zIndex: 2 }
        }
      >
        <RevealText as="h1" style={titleStyles} baseDelay={0.05} perWordDelay={0.07}>
          {title}
        </RevealText>

        {/* Subtitle and CTA suppressed in band variant — the 220px
            band height can't hold them cleanly. Pages that need
            them should not pass band. */}
        {!band && subtitle && (
          <RevealOnScroll delay={0.35}>
            <p className="hero-sub" style={{ maxWidth: 680, color: 'rgba(255,255,255,0.85)' }}>{subtitle}</p>
          </RevealOnScroll>
        )}

        {!band && ctaText && ctaHref && (
          <RevealOnScroll delay={0.5}>
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
