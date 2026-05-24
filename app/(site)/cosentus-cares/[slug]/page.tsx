import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageHero from '@/components/sections/PageHero'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import { galleries, getGalleryBySlug } from '../galleries'
import GalleryGrid from './GalleryGrid'

interface Params {
  params: Promise<{ slug: string }>
}

/**
 * SSG: pre-render every known gallery slug at build time. Unknown slugs
 * fall through to notFound() at request time.
 */
export function generateStaticParams() {
  return galleries.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const gallery = getGalleryBySlug(slug)
  if (!gallery) return { title: 'Gallery Not Found | Cosentus' }
  return {
    title: `${gallery.title} | Cosentus Cares | Cosentus`,
    description: `Photos from ${gallery.title} — part of our Cosentus Cares community initiatives.`,
  }
}

export default async function WeCareGalleryPage({ params }: Params) {
  const { slug } = await params
  const gallery = getGalleryBySlug(slug)
  if (!gallery) notFound()

  // Position of this gallery in the master ordered list — used to render
  // prev/next links at the bottom of the page.
  const index = galleries.findIndex((g) => g.slug === slug)
  const prev = index > 0 ? galleries[index - 1] : null
  const next = index < galleries.length - 1 ? galleries[index + 1] : null

  const imageCount = gallery.items.filter((i) => i.type === 'image').length
  const videoCount = gallery.items.filter((i) => i.type === 'video').length

  return (
    <main>
      <PageHero
        label="COSENTUS CARES GALLERY"
        title={gallery.title}
      />

      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
              marginBottom: 32,
            }}>
              <Link
                href="/cosentus-cares"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'var(--gray-700)',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                }}
                className="back-link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Back to Cosentus Cares
              </Link>

              <div style={{
                color: 'var(--gray-600)',
                fontSize: 14,
                fontWeight: 500,
              }}>
                {imageCount > 0 && <>{imageCount} {imageCount === 1 ? 'photo' : 'photos'}</>}
                {imageCount > 0 && videoCount > 0 && <> · </>}
                {videoCount > 0 && <>{videoCount} video</>}
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <GalleryGrid items={gallery.items} />
          </RevealOnScroll>
        </div>
      </section>

      {/* Prev / Next navigation — same family of events, easy browse */}
      {(prev || next) && (
        <section className="section section-alt" style={{ paddingTop: 40, paddingBottom: 40 }}>
          <div className="container">
            <div className="gallery-prevnext" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
            }}>
              {prev ? (
                <Link href={`/cosentus-cares/${prev.slug}`} className="gallery-prevnext-link" style={{
                  display: 'flex',
                  flexDirection: 'column' as const,
                  padding: '16px 20px',
                  background: 'var(--white)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>← Previous</span>
                  <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-900)', marginTop: 4 }}>{prev.title}</span>
                </Link>
              ) : <span />}
              {next ? (
                <Link href={`/cosentus-cares/${next.slug}`} className="gallery-prevnext-link" style={{
                  display: 'flex',
                  flexDirection: 'column' as const,
                  padding: '16px 20px',
                  background: 'var(--white)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  textAlign: 'right' as const,
                  alignItems: 'flex-end' as const,
                  transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Next →</span>
                  <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-900)', marginTop: 4 }}>{next.title}</span>
                </Link>
              ) : <span />}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .back-link:hover { color: var(--primary) !important; }
        .gallery-prevnext-link:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 181, 214, 0.35) !important;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
        }
        @media (max-width: 640px) {
          .gallery-prevnext { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
