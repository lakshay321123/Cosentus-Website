'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

/* ============================================================
   RCM CALCULATOR — home page interactive section
   ============================================================

   Marketing intent: surface the dollar value of a Cosentus engagement
   in the visitor's own terms. The user enters a few rough numbers
   they already know about their practice; the section shows what
   could be recovered annually, broken into three drivers.

   This follows the established 'revenue leakage' calculator pattern
   used by other RCM/EHR vendors (PIMSY, Medusind, Mbwrcm). All
   multipliers are industry-defended:

     - 60% of denied claims never get resubmitted   (industry default)
     - 95% appeal success                            (Cosentus claim)
     - 15% AR>90 days benchmark                      (Cosentus claim)
     - 40% of aged AR past 90d becomes uncollectible (PIMSY data)
     - 88% industry-avg NCR  ->  98% Cosentus NCR    (Cosentus claim)
     - 60% of charges are 'collectible' (40% contractual adjustments)
                                                      (industry typical)

   All three bucket estimates approximate independently. There is
   conceptual overlap (NCR is composed in part of denials + aged AR);
   the footnote calls this out. Marketing convention is to sum
   independent buckets and disclose the methodology.

   Placement: home page, immediately after ResultsSection. Narrative
   flow is "here are the results we deliver" -> "here is what those
   results mean for YOUR practice".

   Design language:
     - Glass-card panel on the immersive video background (rgba white
       + backdrop-blur), matching the home page's frosted aesthetic.
     - Teal primary accent (var(--primary)) on sliders + the headline
       number, font-display weight 300 for the big number to match
       ResultsSection / hero numerals.
     - --shadow-glow (the teal-tinted shadow already defined in
       globals.css) for the result panel.
     - All sliders are styled in globals.css under .rcm-calc-slider
       (cross-browser range-input styling requires CSS, not inline).
============================================================ */

const fmt = (n: number) =>
  n.toLocaleString('en-US', { maximumFractionDigits: 0 })

const fmt$ = (n: number) => '$' + fmt(Math.round(n))

/* Smooth-tween hook: animates a numeric value from its previous
   value to the new target over `duration` ms. Used so the big
   recovery number tweens when a slider moves, instead of snapping
   abruptly. */
function useTween(target: number, duration = 500) {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const startRef = useRef<number>(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    cancelAnimationFrame(rafRef.current)
    fromRef.current = value
    startRef.current = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - startRef.current) / duration)
      const eased = 1 - Math.pow(1 - t, 3)   // cubic ease-out
      setValue(fromRef.current + (target - fromRef.current) * eased)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  return value
}

/* Single slider row: label on top with the live value, slider below.
   Slider styling lives in globals.css under .rcm-calc-slider so the
   thumb + track render consistently across Chrome/Safari/Firefox. */
function SliderRow({
  label, suffix, value, min, max, step, onChange,
}: {
  label: string
  suffix: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 12,
      }}>
        <label style={{
          fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.7)',   // white-translucent label on frosted-glass card; bright enough to read on dark immersive bg
          letterSpacing: '0.02em', textTransform: 'uppercase',
          fontFamily: 'var(--font-display)',
        }}>
          {label}
        </label>
        <span className="rcm-calc-liveval" style={{
          fontWeight: 400, color: 'var(--white)',
          fontFamily: 'var(--font-display)', lineHeight: 1,
        }}>
          {value}{suffix}
        </span>
      </div>
      <input
        type="range"
        className="rcm-calc-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </div>
  )
}

export default function RCMCalculatorSection() {
  /* Defaults are deliberately chosen so a typical practice sees a
     compelling but believable number on first load:
       - $500K/month is a credible mid-size practice
       - 10% denial rate is industry standard
       - 25% AR>90 days is common for practices without proactive
         follow-up (Cosentus's benchmark is <15%) */
  const [monthly, setMonthly] = useState(500)        // in thousands, slider 50-20000 ($50K-$20M monthly)
  const [denialRate, setDenialRate] = useState(10)   // percent, slider 0-25
  const [arOver90, setArOver90] = useState(25)       // percent, slider 5-50

  const annualCharges = monthly * 1000 * 12

  // Bucket 1: denial recovery (input-driven)
  const denialRecovery = annualCharges * (denialRate / 100) * 0.60 * 0.95

  // Bucket 2: aged AR recovery (input-driven; delta vs 15% benchmark)
  const arDelta = Math.max(0, (arOver90 / 100) - 0.15)
  const arRecovery = annualCharges * arDelta * 0.40 * 0.95

  // Bucket 3: NCR lift on the collectible portion of charges. This is
  // the lift from going from industry-average NCR (~88%) to Cosentus's
  // ~98% target. The lift compounds with bucket 1 + 2 conceptually
  // (since NCR is partly composed of denials and aged AR), so the
  // footnote calls this out clearly.
  const ncrLift = annualCharges * 0.60 * 0.10

  const total = denialRecovery + arRecovery + ncrLift

  // Tween the big number for smooth slider response
  const tweenedTotal = useTween(total)

  return (
    <section className="section rcm-calc-section">
      <div className="container">
        <RevealOnScroll>
          {/* Headline only — subline removed May 2026 per user direction.
              Reason: the sliders + their values are self-evidently
              interactive, so the 'Move the sliders. See what's recoverable.'
              instruction was redundant. Headline gets full marginBottom
              (56) since there's no subline to bridge to the card. */}
          <div className="section-title" style={{ textAlign: 'center', marginBottom: 56 }}>
            How Much Revenue Are You Losing?
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <div className="rcm-calc-card">
            {/* LEFT: Inputs */}
            <div className="rcm-calc-inputs">
              <div style={{ marginBottom: 28 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  marginBottom: 12,
                }}>
                  <label style={{
                    fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.7)',   // white-translucent label on frosted-glass card; bright enough to read on dark immersive bg
                    letterSpacing: '0.02em', textTransform: 'uppercase',
                    fontFamily: 'var(--font-display)',
                  }}>
                    Monthly Charges
                  </label>
                  <span className="rcm-calc-liveval" style={{
                    fontWeight: 400, color: 'var(--white)',
                    fontFamily: 'var(--font-display)', lineHeight: 1,
                  }}>
                    {fmt$(monthly * 1000)}
                  </span>
                </div>
                {/* Slider range expanded May 2026 per user
                    direction: max was $2M/month, now $20M/month
                    to accommodate enterprise / multi-site
                    practices and large hospital outpatient
                    groups. Step bumped 25 -> 100 (so $25K ->
                    $100K increments) because at step=25 with
                    max=20000 the slider would have 798
                    positions — the thumb wouldn't track
                    meaningfully across the full range. At
                    step=100 the slider has 199 positions
                    across $50K-$20M which is smooth + still
                    lets small practices land on a defensible
                    number. The default value (500 = $500K)
                    stays the same so a typical mid-size
                    practice sees the same compelling-but-
                    believable first-load number. */}
                <input
                  type="range"
                  className="rcm-calc-slider"
                  min={50}
                  max={20000}
                  step={100}
                  value={monthly}
                  onChange={e => setMonthly(Number(e.target.value))}
                />
              </div>

              <SliderRow
                label="Denial Rate"
                suffix="%"
                value={denialRate}
                min={0}
                max={25}
                step={1}
                onChange={setDenialRate}
              />

              <SliderRow
                label="AR Over 90 Days"
                suffix="%"
                value={arOver90}
                min={5}
                max={50}
                step={1}
                onChange={setArOver90}
              />

              <p style={{
                fontSize: 15, lineHeight: 1.65, color: 'rgba(255,255,255,0.5)',   // dim white-translucent for the disclaimer copy on frosted-glass
                marginTop: 24,
              }}>
                Estimates based on industry averages and Cosentus's published benchmarks (98% NCR, 95% appeal success, &lt;15% AR over 90 days). Buckets approximate independently and may overlap. Actual results depend on specialty, payer mix, and starting baseline.
              </p>
            </div>

            {/* RIGHT: Result */}
            <div className="rcm-calc-result">
              <div style={{
                fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.75)',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                marginBottom: 12,
              }}>
                Up to
              </div>
              <div className="rcm-calc-bignum" style={{
                fontWeight: 300, color: 'var(--white)',
                fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: 12,
                letterSpacing: '-0.02em',
              }}>
                {fmt$(tweenedTotal)}
              </div>
              <div style={{
                fontSize: 22, fontWeight: 400, color: 'rgba(255,255,255,0.85)',
                marginBottom: 44,
              }}>
                in annual recovery potential
              </div>

              <div className="rcm-calc-breakdown">
                <div className="rcm-calc-bucket">
                  <div className="rcm-calc-bucket-value">{fmt$(denialRecovery)}</div>
                  <div className="rcm-calc-bucket-label">Denial Recovery</div>
                </div>
                <div className="rcm-calc-bucket">
                  <div className="rcm-calc-bucket-value">{fmt$(arRecovery)}</div>
                  <div className="rcm-calc-bucket-label">AR Cleared</div>
                </div>
                <div className="rcm-calc-bucket">
                  <div className="rcm-calc-bucket-value">{fmt$(ncrLift)}</div>
                  <div className="rcm-calc-bucket-label">NCR Lift</div>
                </div>
              </div>

              {/* CTA uses .btn-primary so it gets the exact same glass-pill
                  treatment as every other CTA on the home page (Hero,
                  RA, CTASection). On .home-immersive the .btn-primary
                  override at globals.css ~line 4555 paints it as a
                  translucent-white pill with thin white border + white
                  text — NO teal/blue anywhere. alignSelf inline so
                  the inline-flex pill anchors to the left of the
                  result panel instead of stretching. */}
              <Link
                href="/contact"
                className="btn-primary"
                style={{ alignSelf: 'flex-start' }}
              >
                Get Your Free Revenue Analysis
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
