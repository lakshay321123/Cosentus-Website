'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Page-level fixed video background.
 *
 * Sits at z-index: -1 behind every section of the home page, with a
 * gradient overlay to maintain text contrast. Renders TWO stacked
 * <video> elements that crossfade across the loop boundary — so the
 * user never sees the "snap" of a single video restarting.
 *
 * How the crossfade works (paraphrased; the actual mechanism is in the
 * onTimeUpdate / onEnded handlers below):
 *   - videoA plays from t=0 to t=(duration - CROSSFADE_SECONDS)
 *   - At that point, videoB.currentTime is reset to 0 and videoB.play()
 *     is called; an opacity transition starts on both
 *   - When videoA reaches its end, videoB is now fully visible and is
 *     mid-playback; videoA resets and waits as the new "B"
 *   - The roles swap on every cycle, so we always have one playing-out
 *     element and one playing-in element
 *
 * Result: a perceptually infinite stream, even though the underlying
 * file is finite. There is still a perceptible "pulse" on real video
 * content with directional motion (the streams briefly double up
 * during the 1s crossfade); we accept this because it's far less
 * jarring than a hard cut.
 *
 * Desktop: rotated 90° counter-clockwise (light flows bottom→top —
 * the "upside down" mirror of the top→bottom variant in the parallel
 * PR). The CSS lives at the bottom of this file; same dimension-swap
 * math, with rotate(-90deg) + translateY(100vh) instead of rotate(90deg)
 * + translateX(100vw). Mobile: rotation disabled because the mobile
 * source is already portrait — extending it full-page would require
 * fixed positioning, which has known repaint bugs on iOS Safari, so on
 * mobile we render at position: absolute inside the hero only via
 * the existing HeroSection — this component renders NOTHING below
 * 768px (mobile keeps the old hero-bound video). That decision is
 * enforced in CSS (display: none) so SSR has no mismatch.
 */

const CROSSFADE_SECONDS = 1.0

export default function ImmersiveVideoBackground() {
  const videoARef = useRef<HTMLVideoElement>(null)
  const videoBRef = useRef<HTMLVideoElement>(null)
  // Which element is currently the "primary" (visible, playing through)
  // vs "secondary" (about to fade in). Starts with A.
  const [primary, setPrimary] = useState<'A' | 'B'>('A')
  const swappingRef = useRef(false)

  // The crossfade trigger. On every timeupdate of the primary video,
  // check whether we're inside the last CROSSFADE_SECONDS of duration.
  // If so, prep the secondary video (reset its time, start playing
  // it) and flip `primary`. The opacity transition is handled in CSS
  // via the data-primary attribute on the wrapper.
  useEffect(() => {
    const a = videoARef.current
    const b = videoBRef.current
    if (!a || !b) return

    const primaryEl = primary === 'A' ? a : b
    const secondaryEl = primary === 'A' ? b : a

    const onTimeUpdate = () => {
      if (swappingRef.current) return
      const dur = primaryEl.duration
      // duration is NaN until metadata loads; bail until it's ready
      if (!Number.isFinite(dur) || dur <= 0) return
      if (primaryEl.currentTime >= dur - CROSSFADE_SECONDS) {
        swappingRef.current = true
        // Prep secondary: rewind to 0 and start playing. Browsers may
        // reject the play() promise if the page hasn't been
        // user-interacted with yet (autoplay policies); muted videos
        // with playsInline are exempt, but we still catch to avoid
        // unhandled rejections.
        secondaryEl.currentTime = 0
        const playPromise = secondaryEl.play()
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {
            // Autoplay blocked — fall back to letting the primary
            // loop normally. Better a visible seam than a frozen
            // background.
          })
        }
        // Flip primary; opacity transition fires from the CSS rules
        // below via the data-primary attribute on the parent.
        setPrimary((p) => (p === 'A' ? 'B' : 'A'))
      }
    }

    // When the primary fully ends, clear the swap lock so the NEW
    // primary's timeupdate handler can trigger the next crossfade.
    // Don't restart the old primary here — letting `loop` handle that
    // means it's always ready to be the next secondary.
    const onEnded = () => {
      swappingRef.current = false
    }

    primaryEl.addEventListener('timeupdate', onTimeUpdate)
    primaryEl.addEventListener('ended', onEnded)
    return () => {
      primaryEl.removeEventListener('timeupdate', onTimeUpdate)
      primaryEl.removeEventListener('ended', onEnded)
    }
  }, [primary])

  return (
    <>
      <div
        className="immersive-video-bg"
        data-primary={primary}
        aria-hidden="true"
      >
        <video
          ref={videoARef}
          className="immersive-video immersive-video-a"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/images/hero-video.mp4" type="video/mp4" />
        </video>
        <video
          ref={videoBRef}
          className="immersive-video immersive-video-b"
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/images/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay — preserves text contrast across every
            section the video shows through. Same gradient family as
            the hero's existing overlay but applied page-wide. */}
        <div className="immersive-video-overlay" />
      </div>

      <style>{`
        /* ===== IMMERSIVE VIDEO BACKGROUND =====
           Fixed-position, viewport-filling, sits behind every section
           of the home page (z-index: -1). Rotation/dimension-swap
           math is the same shape as the parallel top→bottom PR but
           the direction is flipped: this is the bottom→top variant.
           Briefly: layout the element at swapped dimensions
           (100vh × 100vw), rotate 90° CCW around top-left,
           translateY(100vh) to bring the rotated box back down into
           the viewport (after CCW rotation around (0,0) the box sits
           ABOVE the viewport at y in [-100vh, 0]).

           Desktop only. Below 768px the whole component is display:
           none — the page falls back to whatever background the
           sections themselves provide. */
        .immersive-video-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          z-index: -1;
          pointer-events: none;
        }
        .immersive-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vh;
          height: 100vw;
          object-fit: cover;
          transform-origin: top left;
          transform: translateY(100vh) rotate(-90deg);
          transition: opacity 1s ease-in-out;
        }
        /* The "primary" video is fully opaque; the secondary is
           invisible. When the timeupdate handler in JS calls
           setPrimary, the data attribute flips and CSS handles the
           1s opacity transition automatically — no JS animation
           loop needed. */
        .immersive-video-bg[data-primary="A"] .immersive-video-a { opacity: 1; }
        .immersive-video-bg[data-primary="A"] .immersive-video-b { opacity: 0; }
        .immersive-video-bg[data-primary="B"] .immersive-video-a { opacity: 0; }
        .immersive-video-bg[data-primary="B"] .immersive-video-b { opacity: 1; }
        .immersive-video-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 53, 69, 0.55) 0%,
            rgba(0, 53, 69, 0.65) 50%,
            rgba(0, 53, 69, 0.75) 100%
          );
        }
        @media (max-width: 768px) {
          .immersive-video-bg { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          /* User prefers reduced motion — pause the crossfade so
             there's no transition flicker, and let the browser's
             video controls (which Safari/Firefox honor) decide
             whether to autoplay. */
          .immersive-video {
            transition: none;
          }
        }
      `}</style>
    </>
  )
}
