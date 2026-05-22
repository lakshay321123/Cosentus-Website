'use client'

/**
 * SpecialtiesSection — Home page section showcasing the six specialty
 * practices Cosentus serves.
 *
 * Layout: a 3D auto-rotating circular gallery (CircularGallery
 * component, adapted from 21st.dev). Each card is a vertical
 * 300x420 tile with a representative photo, title, blurb, and
 * "Learn more" affordance — clicking anywhere on the card routes
 * to the specialty page.
 *
 * Previous version was a static 3x2 grid of glass-square cards.
 * Replaced per user direction:
 *   "for this section, convert boxes into Rectangular vertical
 *    boxes, same text, use this 21st dev as the animation and
 *    anchor".
 *
 * Photo selection: Unsplash photo IDs verified to return 200 OK
 * during build. Several are GENERIC medical imagery rather than
 * specialty-accurate — user accepted this trade-off ("Use what I
 * find from Unsplash even if some photos are generic medical").
 * Items flagged with TODO comments are the weakest matches and
 * should be replaced once specialty-specific photos are sourced.
 */

import RevealOnScroll from '@/components/ui/RevealOnScroll'
import CircularGallery, {
  type CircularGalleryItem,
} from '@/components/ui/CircularGallery'

// Unsplash photo URL helper — keeps the long query string out of
// each data row. q=80 is the sweet spot for visual quality vs
// transfer size; w=900 gives ~3x DPR headroom on a 300px display
// width without sending oversized files.
const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=900&auto=format&fit=crop&q=80`

const specialties: CircularGalleryItem[] = [
  {
    title: 'Anesthesia',
    blurb:
      'Time-unit precision, modifier accuracy, and concurrency rules — built by anesthesia veterans.',
    href: '/specialties/anesthesia',
    photoUrl: unsplash('1551076805-e1869033e561'),
    photoPos: 'center',
    photoAlt: 'Operating room interior',
  },
  {
    title: 'Orthopedics',
    // TODO: better photo. Verified Unsplash IDs around "ortho/bone/
    // x-ray/joint" returned anatomy models that don't read as
    // orthopedic specifically. Using a generic surgical/healthcare
    // photo as the placeholder; should be swapped for an ortho-
    // specific image (X-ray, MRI, joint replacement, sports medicine).
    blurb:
      'Surgical coding, global periods, implant pass-throughs, and workers\u2019 comp handled end-to-end.',
    href: '/specialties/orthopedics',
    photoUrl: unsplash('1576091160550-2173dba999ef'),
    photoPos: 'center',
    photoAlt: 'Healthcare professional with stethoscope',
  },
  {
    title: 'Pain Management',
    // TODO: better photo. Currently generic medical imagery; should
    // be replaced with a pain-management-specific photo (spine
    // injection, RFA, interventional pain procedure).
    blurb:
      'Interventional injections, RFA, SCS, medical-necessity documentation defense.',
    href: '/specialties/pain-management',
    photoUrl: unsplash('1559757175-5700dde675bc'),
    photoPos: 'center',
    photoAlt: 'Pain management treatment',
  },
  {
    title: 'ASCs',
    blurb:
      'Coordinated facility + professional billing, case costing, contract underpayment recovery.',
    href: '/specialties/asc',
    photoUrl: unsplash('1581595220892-b0739db3ba8c'),
    photoPos: 'center',
    photoAlt: 'Surgeons performing a procedure in a surgical center',
  },
  {
    title: 'Behavioral Health',
    // TODO: better photo. Currently a generic professional headshot
    // rather than a therapy-specific image; should be swapped for
    // something more recognisable (counsellor session, calm
    // therapeutic environment).
    blurb:
      'Time-based therapy CPTs, IOP/PHP bundling, telehealth modifiers, authorization tracking.',
    href: '/specialties/behavioral-health',
    photoUrl: unsplash('1573497019940-1c28c88b4f3e'),
    photoPos: 'center',
    photoAlt: 'Behavioral health professional',
  },
  {
    title: 'Multi-Specialty',
    blurb:
      'Mixed-specialty groups, multi-site operations, and primary care \u2014 one accountable RCM partner.',
    href: '/specialties/multi-specialty',
    photoUrl: unsplash('1532938911079-1b06ac7ceec7'),
    photoPos: 'center',
    photoAlt: 'Physician with stethoscope, representing general practice',
  },
]

export default function SpecialtiesSection() {
  return (
    <section
      className="section specialties-section"
      id="specialties"
      style={{ overflow: 'hidden', position: 'relative' }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <RevealOnScroll direction="up" delay={0.1}>
          <header className="specialties-header">
            <h2 className="specialties-title">
              Built for <span className="accent">your</span> specialty
            </h2>
          </header>
        </RevealOnScroll>

        {/* Gallery sits in a fixed-height container so the section
            doesn't grow as the cards rotate around the Y axis. The
            cards are 420px tall; the container is 620px so there's
            breathing room above + below the tallest card. */}
        <div className="specialties-gallery-wrap">
          <CircularGallery items={specialties} radius={620} />
        </div>
      </div>

      <style>{`
        .specialties-section {
          padding-top: 96px;
          padding-bottom: 96px;
        }

        .specialties-header {
          /* Left-aligned to match other home section headers. */
          text-align: left;
          max-width: 720px;
          margin: 0 0 48px;
        }

        .specialties-title {
          font-family: var(--font-display);
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 300;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 16px;
          color: var(--gray-900);
        }
        .specialties-title .accent {
          color: #00B5D6;
        }

        /* The gallery needs a definite height so the absolutely-
           positioned cards inside have a reference frame. 620px
           gives the rotating 420px-tall cards 100px breathing room
           on each side. */
        .specialties-gallery-wrap {
          position: relative;
          width: 100%;
          height: 620px;
        }

        @media (max-width: 1024px) {
          /* Smaller container on narrower viewports. */
          .specialties-gallery-wrap {
            height: 540px;
          }
        }
        @media (max-width: 600px) {
          .specialties-section {
            padding-top: 64px;
            padding-bottom: 64px;
          }
          .specialties-gallery-wrap {
            height: 480px;
          }
        }
      `}</style>
    </section>
  )
}
