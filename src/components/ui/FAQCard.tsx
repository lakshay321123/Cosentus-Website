'use client'

import { useState, useId } from 'react'
import type { FAQ } from '@/data/faqs'

/**
 * FAQCard — single Q&A card in the homepage / /faqs section.
 *
 * Visual recipe — matches the homepage canonical glass-square:
 *   1. Liquid-glass surface: 20% white wash + 1.5px white outline
 *      + backdrop-blur(20px) saturate(160%). The inset highlight
 *      shadow stack is applied via app/globals.css under the
 *      `.home-immersive .faq-card-inner` selector — same recipe
 *      InsightCard / testimonial-card / specialty-card-link use,
 *      so the FAQ cards sit cohesively within the page instead of
 *      reading as a brighter/whiter alien insert. (Per user
 *      direction "are these cards using the same transparency and
 *      settings like on the other sections" — yes, now they are.)
 *   2. Cyan uppercase eyebrow tag (category) with a fading
 *      underline detail.
 *   3. Question rendered in the display serif, italic, white. The
 *      italic-serif treatment echoes the "Clients" and "Network"
 *      accent words in the page H2s.
 *   4. **Arrow disc** — the EXACT same /images/hero/btn-specialties-arrow.svg
 *      used by the hero "Our Specialties" button. The asset is a
 *      white-filled circle with a right-arrow cutout. We rotate it
 *      90° clockwise at rest so the arrow points DOWN ("open me"),
 *      and rotate to -90° when expanded so the arrow points UP
 *      ("close me"). Per user direction: "you can just reverse the
 *      circle with the arrow, and you can put it on this FAQ
 *      section on the home page with the arrow pointing down."
 *
 * Expand mechanics — SEO-safe:
 *   - Answer text is ALWAYS rendered in the DOM regardless of
 *     expand state. Visibility is controlled via
 *     `grid-template-rows: 0fr → 1fr` which animates smoothly
 *     without a known content height. Crawlers + LLM ingestion
 *     read the full text from rendered HTML even when collapsed.
 *   - The expand toggle is a `<button>` with `aria-expanded` and
 *     `aria-controls` so screen readers announce state correctly.
 *   - With JavaScript disabled the answer panel falls back to
 *     expanded (the server initially renders `data-expanded=false`
 *     but without JS hydration the user just sees the closed state
 *     visually; the FULL answer text is still in the DOM and
 *     reachable by crawlers).
 */
export default function FAQCard({
  faq,
  defaultExpanded = false,
}: {
  faq: FAQ
  /** If true the card starts expanded. Used on /faqs where the
   *  first card of the first category can act as a worked example. */
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

        {/* Answer panel — animated collapse via grid-template-rows.
            The inner div has overflow:hidden so content clips while
            the parent grid row animates between 0fr and 1fr. */}
        <div
          id={answerId}
          className="faq-card-answer"
          role="region"
          aria-labelledby={`faq-${faq.slug}`}
        >
          <div className="faq-card-answer-inner">
            <div className="faq-card-divider" aria-hidden="true" />
            <p className="faq-card-answer-text">{faq.answer}</p>
          </div>
        </div>

        {/* Arrow disc — the signature element from the hero. Same
            SVG asset used for "Our Specialties", rotated to point
            down at rest. The button itself has no background of
            its own; the asset IS the disc. */}
        <button
          type="button"
          className="faq-card-disc"
          aria-expanded={expanded}
          aria-controls={answerId}
          aria-label={expanded ? `Hide answer to: ${faq.question}` : `Show answer to: ${faq.question}`}
          onClick={() => setExpanded(v => !v)}
        >
          <img
            src="/images/hero/btn-specialties-arrow.svg"
            alt=""
            aria-hidden="true"
            className="faq-card-disc-arrow"
            draggable={false}
          />
        </button>
      </div>

      <style jsx>{`
        .faq-card {
          /* The outer article is just a wrapper — the visual card
             surface is the inner div, because the global glass
             selector in app/globals.css targets .faq-card-inner. */
          position: relative;
          height: 100%;
        }

        .faq-card-inner {
          /* 20% white wash matches the canonical homepage
             glass-square (.insight-card-body, .testimonial-card,
             etc.). The inset-shadow + border-strip recipe is
             applied globally by the rule under
             '.home-immersive .faq-card-inner' in app/globals.css
             — same one used by InsightCard etc. We don't repeat
             the border or shadow here because the global rule
             carries !important and would override anyway. */
          position: relative;
          height: 100%;
          background: rgba(255, 255, 255, 0.20);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border-radius: 20px;
          padding: 28px 28px 96px 28px;
          /* Bottom padding leaves a 96px clearance for the 56px
             arrow disc + its 20px margin. */
          display: flex;
          flex-direction: column;
          transition: transform 350ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .faq-card:hover .faq-card-inner {
          transform: translateY(-3px);
        }

        .faq-card-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #00B5D6;
          margin-bottom: 18px;
          padding-bottom: 12px;
          /* Faint cyan-to-transparent underline — echoes the
             editorial line under section labels elsewhere. */
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
          /* Display serif italic — matches the "Clients" / "Network"
             accent treatment in the page H2s. White text reads
             cleanly against the 20% white wash + dark page bg. */
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(20px, 1.45vw, 24px);
          line-height: 1.25;
          letter-spacing: -0.01em;
          color: rgba(255, 255, 255, 0.96);
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
             without it the implicit min-height:auto would prevent
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
            rgba(255, 255, 255, 0.30) 0%,
            rgba(255, 255, 255, 0) 75%
          );
        }

        .faq-card-answer-text {
          font-size: 15px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.82);
          margin: 0;
        }

        .faq-card-disc {
          /* Pure positioning + click-target wrapper for the SVG
             asset. The asset IS the disc visual — no background,
             no border, no extra ring. */
          position: absolute;
          right: 22px;
          bottom: 22px;
          width: 56px;
          height: 56px;
          padding: 0;
          background: transparent;
          border: none;
          cursor: pointer;
          display: block;
          /* Hover nudge: button drops 4px on hover — same direction
             as the arrow points (down), reinforcing the "click to
             reveal what's below" affordance. Same easing as the
             hero arrow nudge. */
          transition: transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
            filter 250ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .faq-card:hover .faq-card-disc {
          transform: translateY(4px);
          /* Subtle cyan glow on hover to echo the brand accent. */
          filter: drop-shadow(0 4px 12px rgba(0, 181, 214, 0.45));
        }

        .faq-card-disc:focus-visible {
          outline: 2px solid #00B5D6;
          outline-offset: 4px;
          border-radius: 50%;
        }

        .faq-card-disc-arrow {
          /* The asset is a white disc with a RIGHT-pointing arrow
             cutout. Rotate 90° clockwise at rest so the arrow
             points DOWN (closed state — "open me"). On expand,
             rotate to -90° so the arrow points UP ("close me").
             The disc itself rotates with the arrow, but it's a
             perfect circle so visually only the arrow moves. */
          display: block;
          width: 100%;
          height: 100%;
          transform: rotate(90deg);
          transition: transform 420ms cubic-bezier(0.22, 0.61, 0.36, 1);
          /* Subtle drop-shadow at rest so the white disc reads
             cleanly against a 20% white card surface. */
          filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.30));
        }

        .faq-card[data-expanded='true'] .faq-card-disc-arrow {
          transform: rotate(-90deg);
        }

        /* Expand indicator: the rotating arrow + the hover lift
           are the primary expand-state cues. We don't override the
           card shadow here because the global rule under
           '.home-immersive .faq-card:hover .faq-card-inner' already
           handles hover state with !important; layering an
           expanded-state override would create a specificity fight
           on hover-of-expanded. Less is cleaner. */

        @media (max-width: 768px) {
          .faq-card-inner {
            padding: 24px 22px 84px 22px;
            border-radius: 18px;
          }
          .faq-card-question {
            font-size: 18px;
          }
          .faq-card-disc {
            width: 48px;
            height: 48px;
            right: 18px;
            bottom: 18px;
          }
        }
      `}</style>
    </article>
  )
}
