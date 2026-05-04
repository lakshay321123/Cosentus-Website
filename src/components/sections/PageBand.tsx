interface PageBandProps {
  title: React.ReactNode
}

/**
 * Minimal teal band hero used by the Insights group of pages
 * (Blog, Client Stories, News, Events, Partnership).
 *
 * No video, no subtitle, no CTA — just a solid Cosentus-teal band
 * with the page H1. Other pages continue to use PageHero.
 */
export default function PageBand({ title }: PageBandProps) {
  return (
    <section
      style={{
        background: '#00B5D6',
        paddingTop: 140,
        paddingBottom: 60,
      }}
    >
      <div className="hero-content">
        <h1
          style={{
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 700,
            fontStyle: 'italic',
            letterSpacing: '-0.03em',
            lineHeight: 1.02,
            color: 'white',
            margin: 0,
          }}
        >
          {title}
        </h1>
      </div>
    </section>
  )
}
