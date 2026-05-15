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
 * Desktop: rotated 90° clockwise (light flows top→bottom). The CSS
 * lives at the bottom of this file; same math as the rotation PR
 * (#132). Mobile: rotation disabled because the mobile source is
 * already portrait — extending it full-page would require fixed
 * positioning, which has known repaint bugs on iOS Safari, so on
 * mobile we render at position: absolute inside the hero only via
 * the existing HeroSection — this component renders NOTHING below
 * 768px (mobile keeps the old hero-bound video). That decision is
 * enforced in CSS (display: none) so SSR has no mismatch.
 */

const CROSSFADE_SECONDS = 1.0

const DESKTOP_VIDEO_SRC = '/images/hero-video.mp4'
const MOBILE_VIDEO_SRC = '/images/hero-video-mobile.mp4'

export default function ImmersiveVideoBackground() {
  const videoARef = useRef<HTMLVideoElement>(null)
  const videoBRef = useRef<HTMLVideoElement>(null)
  // Which element is currently the "primary" (visible, playing through)
  // vs "secondary" (about to fade in). Starts with A.
  const [primary, setPrimary] = useState<'A' | 'B'>('A')
  const swappingRef = useRef(false)

  // Mobile gets a portrait 9:16 cut of the same content (~1.9MB vs the
  // desktop's 11.4MB landscape). Track viewport width so we serve the
  // right asset and skip the desktop rotation on mobile.
  const [videoSrc, setVideoSrc] = useState(DESKTOP_VIDEO_SRC)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const apply = () => {
      const mobile = mq.matches
      setIsMobile(mobile)
      setVideoSrc(mobile ? MOBILE_VIDEO_SRC : DESKTOP_VIDEO_SRC)
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

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
        const flipPrimary = () => {
          setPrimary((p) => (p === 'A' ? 'B' : 'A'))
        }
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise
            .then(flipPrimary)
            .catch(() => {
              // Autoplay blocked — fall back to letting the primary
              // loop normally. Better a visible seam than a frozen
              // background. Release the lock so we'll retry next
              // time around.
              swappingRef.current = false
            })
        } else {
          // Older browsers where play() returns undefined: assume sync
          // start.
          flipPrimary()
        }
        // Unlock after the crossfade completes. The original code
        // relied on the 'ended' event but that NEVER fires when
        // loop=true is set (verified browser behavior). Without
        // an unlock, swappingRef stays true forever and no further
        // crossfades happen. Use a setTimeout based on the actual
        // crossfade duration instead.
        window.setTimeout(() => {
          swappingRef.current = false
        }, CROSSFADE_SECONDS * 1000 + 200)
      }
    }

    primaryEl.addEventListener('timeupdate', onTimeUpdate)
    return () => {
      primaryEl.removeEventListener('timeupdate', onTimeUpdate)
    }
  }, [primary])

  return (
    <>
      <div
        className="immersive-video-bg"
        data-primary={primary}
        data-viewport={isMobile ? 'mobile' : 'desktop'}
        aria-hidden="true"
      >
        <video
          key={`a-${videoSrc}`}
          ref={videoARef}
          className="immersive-video immersive-video-a"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <video
          key={`b-${videoSrc}`}
          ref={videoBRef}
          className="immersive-video immersive-video-b"
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        {/* Gradient overlay — preserves text contrast across every
            section the video shows through. Same gradient family as
            the hero's existing overlay but applied page-wide. */}
        <div className="immersive-video-overlay" />
      </div>

      <style>{`
        /* ===== IMMERSIVE VIDEO BACKGROUND =====
           Fixed-position, viewport-filling, sits behind every section
           of the home page (z-index: -1). Desktop uses a landscape
           source rotated 90° CW (light flows top→bottom). Mobile uses
           a portrait 9:16 cut at native orientation — no rotation.

           Desktop rotation math (#132): layout the element at swapped
           dimensions (100vh × 100vw), rotate 90° CW around top-left,
           translateX(100vw) to bring it back into view.

           Mobile: no rotation. Element fills the viewport directly. */
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
        /* Desktop rotation: this is the desktop layout. The mobile
           override below resets to a non-rotated full-viewport fill. */
        .immersive-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vh;
          height: 100vw;
          object-fit: cover;
          transform-origin: top left;
          transform: translateX(100vw) rotate(90deg);
          transition: opacity 1s ease-in-out;
        }
        /* Mobile: native portrait source, no rotation, fill viewport. */
        .immersive-video-bg[data-viewport="mobile"] .immersive-video {
          width: 100vw;
          height: 100vh;
          transform: none;
          transform-origin: initial;
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
