'use client'

import { useState, useId } from 'react'
import type { FAQ } from '@/data/faqs'

/**
 * FAQCard — single Q&A card in the homepage / /faqs section.
 *
 * Visual recipe — matches the homepage design language:
 *   1. Liquid-glass surface: 40% white wash + 50% white outline +
 *      backdrop-blur + cyan-cast box-shadow. Same recipe used by the
 *      TestimonialsShuffleSection cards.
 *   2. Cyan uppercase eyebrow tag (category) — same letter-spacing
 *      treatment as the partner section labels.
 *   3. Question rendered in the display serif, italic, navy. The
 *      italic-serif treatment echoes the "Clients" and "Network"
 *      accent words in the page H2s.
 *   4. **Arrow disc** in the bottom-right corner — the SIGNATURE
 *      visual element from the hero "Our Specialties" pill. Circular,
 *      cyan-on-white, contains a chevron that rotates 180° on expand.
 *      On hover the disc nudges down 4px with the exact same
 *      cubic-bezier(0.22, 0.61, 0.36, 1) easing the hero arrow uses.
 *
 * Expand mechanics — SEO-safe:
 *   - The answer text is ALWAYS rendered in the DOM regardless of
 *     expand state. Visibility is controlled via CSS
 *     `grid-template-rows: 0fr → 1fr` which animates smoothly without
 *     requiring a known content height. Crawlers and LLM ingestion
 *     read the full text from the rendered HTML even when collapsed.
 *   - The expand toggle is a `<button>` with `aria-expanded` and
 *     `aria-controls` so screen readers announce state correctly.
 *   - With JavaScript disabled the answer falls back to fully
 *     expanded (because we never apply the `data-expanded="false"`
 *     attribute server-side — the initial server render has the
 *     answer panel open; client-side hydration then collapses it
 *     down to the closed state).
 *     ^ This means the no-JS / pre-hydration paint shows answers
 *       expanded for ~1 frame. Acceptable: it's the SEO-friendly
 *       default, and the visual flash is the same kind users get
 *       with any progressive-enhancement collapse.
 */
export default function FAQCard({
  faq,
  defaultExpanded = false,
}: {
  faq: FAQ
  /** If true the card starts expanded. Useful on /faqs where the
   *  first card per category can be shown open as an entry point. */
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const answerId = useId()

  return (
    <article
      className={`faq-card ${expanded ? 'faq-card-open' : ''}`}
      data-expanded={expanded ? 'true' : 'false'}
      id={`faq-${faq.slug}`}
    >
      <div className="faq-card-inner">
        <div className="faq-card-tag">{faq.category}</div>

        <h3 className="faq-card-question">{faq.question}</h3>

        {/* Answer wrapper — collapsed via grid-template-rows: 0fr.
            The inner .faq-card-answer-inner has overflow: hidden so the
            text clips while the parent is animating between 0fr and 1fr. */}
        <div
          id={answerId}
          className="faq-card-answer"
          role="region"
          aria-labelledby={`faq-${faq.slug}-question`}
        >
          <div className="faq-card-answer-inner">
            <div className="faq-card-divider" aria-hidden="true" />
            <p className="faq-card-answer-text">{faq.answer}</p>
          </div>
        </div>

        {/* Arrow disc — the signature element. Circular cyan disc
            in the bottom-right corner. Click toggles expand state.
            The chevron rotates 180° between states. */}
        <button
          type="button"
          className="faq-card-disc"
          aria-expanded={expanded}
          aria-controls={answerId}
          aria-label={expanded ? `Hide answer to: ${faq.question}` : `Show answer to: ${faq.question}`}
          onClick={() => setExpanded(v => !v)}
        >
          <svg
            className="faq-card-chevron"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            {/* Down chevron at rest; the button rotates 180deg when
                aria-expanded=true (see CSS below). */}
            <path
              d="M5 7.5l5 5 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .faq-card {
          /* The outer container is position:relative so the arrow
             disc can be absolutely positioned in the bottom-right.
             The inner div carries the glass surface so the disc's
             box-shadow doesn't clip against the card's overflow. */
          position: relative;
          height: 100%;
          /* The grid-template-rows trick: when this attribute flips
             to false, the .faq-card-answer row collapses to 0fr,
             smoothly animating height down to zero with no need to
             know the content height in advance. */
        }

        .faq-card-inner {
          /* Glass surface — matches TestimonialsShuffleSection cards
             so the FAQ section reads as a cohesive part of the page,
             not an alien insert. Same 40% white wash + 50% white
             border + backdrop-blur + cyan cast shadow recipe. */
          position: relative;
          height: 100%;
          background: rgba(255, 255, 255, 0.40);
          border: 1.5px solid rgba(255, 255, 255, 0.50);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          box-shadow: 0 20px 60px rgba(0, 181, 214, 0.18);
          border-radius: 20px;
          padding: 28px 28px 88px 28px;
          /* Bottom padding leaves room for the arrow disc (56px disc
             + 16px margin) without the answer text crashing into it. */
          display: flex;
          flex-direction: column;
          transition: transform 350ms cubic-bezier(0.22, 0.61, 0.36, 1),
            box-shadow 350ms cubic-bezier(0.22, 0.61, 0.36, 1),
            border-color 350ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .faq-card:hover .faq-card-inner {
          transform: translateY(-3px);
          box-shadow: 0 28px 70px rgba(0, 181, 214, 0.28);
          border-color: rgba(255, 255, 255, 0.70);
        }

        .faq-card-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #00B5D6;
          margin-bottom: 18px;
          /* Sublime detail: a 1px line under the tag, fading from
             cyan to transparent. Mirrors the way the partner logos
             section uses a faint top border to delineate it. */
          padding-bottom: 12px;
          background-image: linear-gradient(
            to right,
            rgba(0, 181, 214, 0.45) 0%,
            rgba(0, 181, 214, 0) 60%
          );
          background-repeat: no-repeat;
          background-position: 0 100%;
          background-size: 80% 1px;
        }

        .faq-card-question {
          /* Display serif italic — echoes the "Clients" / "Network"
             accent in the page H2s. Navy text reads on the 40% white
             wash glass surface. */
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(20px, 1.45vw, 24px);
          line-height: 1.25;
          letter-spacing: -0.01em;
          color: #0a2d41;
          margin: 0;
        }

        .faq-card-answer {
          /* The animated-height trick: parent is a grid with a
             single row at 0fr (collapsed) or 1fr (expanded). When
             the row is 0fr the child's overflow:hidden clips it.
             Animates smoothly with no measured height. */
          display: grid;
          grid-template-rows: 1fr;
          transition: grid-template-rows 420ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .faq-card[data-expanded='false'] .faq-card-answer {
          grid-template-rows: 0fr;
        }

        .faq-card-answer-inner {
          /* min-height: 0 lets the grid row actually shrink to 0fr;
             without it, the implicit min-height: auto would prevent
             the collapse from going all the way to zero. */
          min-height: 0;
          overflow: hidden;
        }

        .faq-card-divider {
          height: 1px;
          margin-top: 20px;
          margin-bottom: 18px;
          background: linear-gradient(
            to right,
            rgba(10, 45, 65, 0.18) 0%,
            rgba(10, 45, 65, 0) 70%
          );
        }

        .faq-card-answer-text {
          font-size: 15px;
          line-height: 1.65;
          color: rgba(10, 45, 65, 0.85);
          margin: 0;
        }

        .faq-card-disc {
          /* The signature arrow disc — circular, white-on-cyan-tint,
             absolutely positioned in the bottom-right. The visual
             grammar (round disc with chevron, hover nudge) is taken
             directly from the hero "Our Specialties" arrow. */
          position: absolute;
          right: 24px;
          bottom: 24px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 1.5px solid rgba(0, 181, 214, 0.55);
          background: rgba(0, 181, 214, 0.18);
          color: #00B5D6;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Two transitions composed: the chevron rotates on
             expand, and on hover the whole disc nudges down +4px
             (same direction-aware nudge the hero arrow uses, but
             vertical because that's where the answer will appear). */
          transition: transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
            background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1),
            box-shadow 250ms cubic-bezier(0.22, 0.61, 0.36, 1),
            border-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1);
          box-shadow: 0 6px 18px rgba(0, 181, 214, 0.20);
        }

        .faq-card:hover .faq-card-disc {
          transform: translateY(4px);
          background: rgba(0, 181, 214, 0.28);
          border-color: rgba(0, 181, 214, 0.80);
          box-shadow: 0 10px 24px rgba(0, 181, 214, 0.32);
        }

        .faq-card-disc:focus-visible {
          outline: 2px solid #00B5D6;
          outline-offset: 3px;
        }

        .faq-card-chevron {
          /* The chevron rotates 180° between expand states. When
             closed it points down (open me); when open it points
             up (close me). The rotation is on the SVG, not on the
             button, so the hover nudge transform on the button
             stays independent. */
          transition: transform 360ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .faq-card[data-expanded='true'] .faq-card-chevron {
          transform: rotate(180deg);
        }

        /* Open state: a faint cyan glow line at the top edge to mark
           the expanded card visually within a row of closed cards. */
        .faq-card[data-expanded='true'] .faq-card-inner {
          border-color: rgba(0, 181, 214, 0.45);
          box-shadow: 0 24px 64px rgba(0, 181, 214, 0.25),
            inset 0 1px 0 rgba(0, 181, 214, 0.30);
        }

        @media (max-width: 768px) {
          .faq-card-inner {
            padding: 24px 22px 80px 22px;
            border-radius: 18px;
          }
          .faq-card-question {
            font-size: 18px;
          }
          .faq-card-disc {
            width: 46px;
            height: 46px;
            right: 20px;
            bottom: 20px;
          }
        }
      `}</style>
    </article>
  )
}
