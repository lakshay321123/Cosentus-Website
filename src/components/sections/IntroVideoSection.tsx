'use client'

/**
 * IntroVideoSection
 *
 * Sits directly under the hero on the home page. Two purposes:
 *
 *   1. Deliver the page's narrative pivot — the "Combining expert
 *      teams and AI-powered technology to optimize your revenue cycle
 *      and drive smarter growth." statement at a size that earns its
 *      role as the explanatory line for the hero.
 *
 *   2. Frame the explanatory infographic video. Per current spec the
 *      video isn't yet produced, so we render a blank 16:9 placeholder
 *      with the immersive-page glass treatment. When the real video
 *      file lands we swap the inner div for a <video> element with
 *      the same dimensions and the rest of the section stays
 *      untouched.
 *
 * The section deliberately holds NO agent grid, NO stats, NO CTA. The
 * agents and stats live one section below (AIAgentsSection); the CTA
 * is the page-level CTASection at the bottom. Keeping this section
 * single-purpose is what makes the "paragraph → video" reading flow
 * feel like a natural breath after the hero.
 *
 * The video aspect ratio is locked to 16:9 (the standard infographic
 * frame). If we need a different ratio later, change `aspectRatio`
 * below rather than introducing magic width/height numbers.
 */

import RevealOnScroll from '@/components/ui/RevealOnScroll'

export default function IntroVideoSection() {
  return (
    <section
      className="section intro-video-section"
      id="intro-video"
      style={{ overflow: 'hidden', position: 'relative' }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* a11y: section needs a heading. The visible paragraph is a
            <p>, not an <h2>, so screen-reader users would otherwise
            jump straight from the hero h1 to whatever comes next.
            Provide a visually-hidden h2 to anchor the section. */}
        <h2
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          How Cosentus combines expert teams with AI
        </h2>

        <div className="intro-video-grid">
          {/* LEFT: the narrative paragraph */}
          <div className="intro-video-copy">
            <RevealOnScroll direction="left" delay={0.15}>
              <p className="intro-video-paragraph">
                Combining expert teams and AI-powered technology to optimize your revenue cycle and drive smarter growth.
              </p>
            </RevealOnScroll>
          </div>

          {/* RIGHT: blank video placeholder, 16:9
              When the actual infographic video file is produced, swap
              the empty .intro-video-placeholder div for a <video>
              element with autoPlay loop muted playsInline. Keep the
              outer aspect-ratio wrapper so layout doesn't shift. */}
          <div className="intro-video-frame">
            <RevealOnScroll direction="right" delay={0.25}>
              <div
                className="intro-video-placeholder"
                aria-label="Workflow infographic video — placeholder"
                role="img"
              >
                {/* Center placeholder content kept minimal — the empty
                    frame already communicates 'video coming'. We
                    avoid stock 'play button' iconography because the
                    real video is autoplay-loop, not click-to-play. */}
                <span className="intro-video-placeholder-label">
                  Workflow video coming soon
                </span>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>

      <style>{`
        .intro-video-section {
          /* Match the rest of the home immersive sections — no own
             background; the page-level video shows through. */
          padding-top: 80px;
          padding-bottom: 80px;
        }

        .intro-video-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 80px;
          row-gap: 32px;
          align-items: center;
        }

        .intro-video-copy {
          /* Stack the paragraph so it reads like a lead, not body. */
          max-width: 520px;
        }

        .intro-video-paragraph {
          font-size: 24px;
          line-height: 1.5;
          color: var(--gray-600);
          margin: 0;
        }

        .intro-video-frame {
          /* Constrain to a clean 16:9 with no max width so the frame
             reaches the right edge of its grid cell on desktop. */
          width: 100%;
        }

        .intro-video-placeholder {
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 16px;
          /* Glass treatment consistent with home-immersive cards. The
             border + background let the page-level video subtly bleed
             through so the placeholder doesn't feel like dead space. */
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.55);
          font-size: 14px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .intro-video-placeholder-label {
          /* Subtle, not loud. The frame is the message; the label is
             a fallback for context. */
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .intro-video-section {
            padding-top: 56px;
            padding-bottom: 56px;
          }
          .intro-video-grid {
            grid-template-columns: 1fr;
            row-gap: 28px;
          }
          .intro-video-copy {
            max-width: 100%;
          }
          .intro-video-paragraph {
            font-size: 19px;
            line-height: 1.55;
          }
          .intro-video-placeholder {
            border-radius: 12px;
          }
        }
      `}</style>
    </section>
  )
}
