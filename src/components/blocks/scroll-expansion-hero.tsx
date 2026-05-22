'use client';

/**
 * ScrollExpandMedia
 *
 * Cosentus-specific scroll-driven hero section. NOT the 21st.dev
 * original anymore — that component's layout (centered media that
 * grows in place + title halves flying apart) didn't match what we
 * want here. This is a from-scratch rewrite of the JSX/layout
 * using the SAME scroll-hijack mechanic for the freeze-while-
 * expanding interaction the user asked for.
 *
 * BEHAVIOR
 *
 * Section is 100vh. When the section's top reaches the viewport's
 * top (isSectionOwningViewport), wheel/touch input is intercepted
 * and converted into scrollProgress (0..1). Page is locked at the
 * section's top during this phase. When progress hits 1, the lock
 * releases and the user scrolls normally.
 *
 * LAYOUT (desktop)
 *
 *   progress = 0:
 *     LEFT half:  sideText (paragraph, large, fade-1)
 *     RIGHT half: media frame (smaller initial size, visible border)
 *
 *   progress = 0..1:
 *     sideText translates LEFT off-screen (translateX 0 → -100vw)
 *                  and fades out (opacity 1 → 0)
 *     media frame translates from right-center toward center
 *                  (translateX +25vw → 0) and grows in width/height
 *
 *   progress = 1:
 *     sideText is gone (off-screen left, opacity 0)
 *     media frame fully expanded, centered
 *     trailingText fades in BELOW the media (different DOM element,
 *                  same text content, just appears below for the
 *                  expanded-state reading flow)
 *
 * LAYOUT (mobile)
 *
 *   Falls back to vertical stack: text below media, media grows
 *   centered. The side-by-side layout doesn't fit narrow viewports.
 *
 * PROPS
 *
 *   mediaType   'video' | 'image' (default 'video')
 *   mediaSrc    URL of the video file or image
 *   posterSrc   (optional) poster image for video
 *   sideText    The paragraph that lives on the left AND reappears
 *               below the expanded media
 */

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  sideText: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  sideText,
}: ScrollExpandMediaProps) => {
  // scrollProgress drives all the inline-style math. Needs to be
  // state so render updates the inline transforms/sizes.
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Trailing text visibility is DERIVED from progress, not a sticky
  // state. Previously I had useState that flipped true at 0.85 and
  // never went back to false — but that caused the trailing text to
  // stay visible AT THE SAME TIME as the side text whenever the
  // user reached 0.85 once and then scrolled to a mid state. By
  // deriving from progress, the trailing text correctly disappears
  // when the user scrolls back.
  const showTrailing = scrollProgress >= 0.85;

  const sectionRef = useRef<HTMLDivElement | null>(null);
  // Refs for state read inside handlers (avoids stale closures
  // without re-binding listeners on every render).
  const progressRef = useRef<number>(0);
  const expandedRef = useRef<boolean>(false);
  const touchYRef = useRef<number>(0);
  // Tracks whether a programmatic (anchor-click / hashchange) scroll
  // is in progress. The scroll-lock guards below (handleWheel,
  // handleTouchMove, handleScroll, handleKeyDown) bypass their lock
  // when this is true so that browser-native anchor scroll can pass
  // THROUGH this section to reach anchors that live below it
  // (e.g. #ra, #specialties, #results on the home page).
  //
  // Without this bypass, the handleScroll snap-back at
  // window.scrollTo(0, sectionTopAbsolute) kicks in the moment the
  // anchor scroll passes the section's top, pulling the page back
  // up — user observes "stuck on the second section".
  const programmaticScrollRef = useRef<boolean>(false);

  // Is the section's top at or above viewport top, AND its bottom
  // still below viewport top? In that state the section is "owning
  // the viewport" and the hijack engages.
  const isSectionOwningViewport = (): boolean => {
    const el = sectionRef.current;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top <= 0 && rect.bottom > 0;
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isSectionOwningViewport()) return;
      if (expandedRef.current) return;
      // Bypass the lock entirely while a programmatic anchor-scroll
      // is in flight. The native scroll passes through this section
      // to reach a target below.
      if (programmaticScrollRef.current) return;
      // Allow scroll-up to exit the top of the section when
      // progress is already at 0.
      if (e.deltaY < 0 && progressRef.current <= 0) return;

      e.preventDefault();
      const scrollDelta = e.deltaY * 0.0012;
      const newProgress = Math.min(
        Math.max(progressRef.current + scrollDelta, 0),
        1
      );
      progressRef.current = newProgress;
      setScrollProgress(newProgress);

      if (newProgress >= 1) {
        expandedRef.current = true;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSectionOwningViewport()) return;
      if (expandedRef.current) return;
      // Bypass during programmatic anchor scroll — mobile parity
      // with the wheel handler.
      if (programmaticScrollRef.current) return;
      if (!touchYRef.current) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchYRef.current - touchY;

      if (deltaY < 0 && progressRef.current <= 0) return;

      e.preventDefault();
      const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
      const scrollDelta = deltaY * scrollFactor;
      const newProgress = Math.min(
        Math.max(progressRef.current + scrollDelta, 0),
        1
      );
      progressRef.current = newProgress;
      setScrollProgress(newProgress);

      if (newProgress >= 1) {
        expandedRef.current = true;
      }

      touchYRef.current = touchY;
    };

    const handleTouchEnd = (): void => {
      touchYRef.current = 0;
    };

    // Keyboard handler — accessibility fix for keyboard-only users.
    // Without this, the wheel/touch handlers advance progressRef but
    // keyboard scroll keys (Space, PageDown, Arrow, Home/End) only
    // trigger window scroll, which handleScroll snaps back. Result:
    // keyboard users can't get past this section. We mirror the
    // wheel handler's behavior, advancing/retreating progress on
    // each key press until expandedRef flips true at progress 1
    // (at which point the hijack releases and normal keyboard
    // scroll resumes).
    //
    // Defensive: bail if focus is inside an editable element
    // (input/textarea/contenteditable) — the section currently has
    // no such elements but future content could; we should not eat
    // arrow keys someone is using to navigate text.
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (!isSectionOwningViewport()) return;
      if (expandedRef.current) return;
      // Bypass during programmatic anchor scroll — same reasoning
      // as the other handlers.
      if (programmaticScrollRef.current) return;

      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          tag === 'SELECT' ||
          target.isContentEditable
        ) {
          return;
        }
      }

      // Determine direction + step. Step size is tuned so a single
      // PageDown advances roughly 35% of the animation — three
      // presses to fully expand. Arrow keys advance less (~15%) for
      // finer control. Space behaves like PageDown.
      let delta = 0;
      switch (e.key) {
        case ' ':
        case 'Spacebar': // legacy
        case 'PageDown':
          delta = 0.35;
          break;
        case 'ArrowDown':
          delta = 0.15;
          break;
        case 'End':
          delta = 1; // jumps to fully expanded
          break;
        case 'PageUp':
          delta = -0.35;
          break;
        case 'ArrowUp':
          delta = -0.15;
          break;
        case 'Home':
          delta = -1; // back to start of section
          break;
        default:
          return; // not a key we care about
      }

      // Allow scroll-up to exit top of section when already at 0,
      // mirroring the wheel handler's behavior.
      if (delta < 0 && progressRef.current <= 0) return;

      e.preventDefault();
      const newProgress = Math.min(
        Math.max(progressRef.current + delta, 0),
        1
      );
      progressRef.current = newProgress;
      setScrollProgress(newProgress);

      if (newProgress >= 1) {
        expandedRef.current = true;
      }
    };

    // Pin scroll position to section-top while hijack is active.
    // Without this, momentum scroll (trackpad inertia) drifts past
    // preventDefault'd wheel events.
    const handleScroll = (): void => {
      if (!isSectionOwningViewport()) return;
      if (expandedRef.current) return;
      // Critical bypass: do NOT snap back during programmatic
      // anchor scroll. This is the guard that was responsible for
      // the "stuck on second section" bug — anchor clicks to #ra /
      // #specialties / #results scroll past this section, and
      // without this bypass the snap-back would yank the page
      // back to this section's top.
      if (programmaticScrollRef.current) return;
      const el = sectionRef.current;
      if (!el) return;
      const sectionTopAbsolute =
        el.getBoundingClientRect().top + window.scrollY;
      if (Math.abs(window.scrollY - sectionTopAbsolute) > 1) {
        window.scrollTo(0, sectionTopAbsolute);
      }
    };

    // ===== Programmatic-scroll detection =====
    // Setting programmaticScrollRef.current = true tells the four
    // handlers above to bypass their scroll-lock. Set the flag when:
    //   (1) a same-page anchor link is clicked (e.g. <a href="#ra">)
    //   (2) the URL hash changes (browser back/forward, or
    //       location.hash assignments)
    //
    // The flag is cleared by a scheduled timer 1500ms later — native
    // browser smooth-scroll-to-anchor typically completes in 600-
    // 1000ms; 1500ms covers slow devices with some buffer. The timer
    // is captured in a ref so consecutive anchor clicks reset it
    // rather than overlapping resets.
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    const armProgrammaticBypass = (): void => {
      programmaticScrollRef.current = true;
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        programmaticScrollRef.current = false;
        resetTimer = null;
      }, 1500);
    };

    const handleAnchorClick = (e: MouseEvent): void => {
      // Only same-page anchor links — must have an href starting
      // with "#". We walk up from the click target since the actual
      // <a> may not be e.target directly (clicks on inner <img> or
      // <span> children land here).
      let node: HTMLElement | null = e.target as HTMLElement | null;
      while (node && node !== document.body) {
        if (node.tagName === 'A') {
          const href = (node as HTMLAnchorElement).getAttribute('href');
          if (href && href.startsWith('#') && href.length > 1) {
            armProgrammaticBypass();
          }
          return;
        }
        node = node.parentElement;
      }
    };

    const handleHashChange = (): void => {
      // Covers back/forward navigation and any JS-driven
      // location.hash assignment that browsers don't fire a click
      // event for.
      armProgrammaticBypass();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);
    // Anchor click listener at the DOCUMENT level so it catches
    // every in-page anchor link regardless of where it lives in the
    // tree. Capture phase = true so we run BEFORE the browser starts
    // its smooth-scroll, ensuring the bypass flag is set before
    // the snap-back guard could fire on the first scroll event.
    document.addEventListener('click', handleAnchorClick, true);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleAnchorClick, true);
      window.removeEventListener('hashchange', handleHashChange);
      if (resetTimer) clearTimeout(resetTimer);
    };
    // Empty deps — handlers read state via refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mobile detection — small viewports use a vertical-stack layout
  // instead of the side-by-side desktop layout.
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- LAYOUT MATH ---
  //
  // All values are interpolated against scrollProgress 0..1.
  //
  // Desktop:
  //   Media starts at 600x400 in the right half (translateX +25vw)
  //   and grows/translates to ~1550x800 at center (translateX 0).
  //   Side text starts centered in the left half (translateX -25vw,
  //   opacity 1) and slides off to the left (translateX -100vw,
  //   opacity 0).
  //
  // Mobile:
  //   Media starts at 300x220 centered (translateX 0) and grows to
  //   95vw x 60vh. No horizontal translation. Side text fades out
  //   vertically instead of sliding left.

  // Easing — quadratic ease-out so the early motion is more
  // pronounced than the late motion. Makes the user feel the
  // expansion is happening as soon as they start scrolling.
  const easedProgress = 1 - Math.pow(1 - scrollProgress, 2);

  const mediaWidth = isMobile
    ? 300 + easedProgress * 400  // 300 → 700
    : 600 + easedProgress * 600; // 600 → 1200
  const mediaHeight = isMobile
    ? 220 + easedProgress * 180 // 220 → 400
    : 400 + easedProgress * 200; // 400 → 600

  // Desktop: media translates from +25vw (right-half center) to 0.
  // Mobile: stays at center.
  const mediaTranslateX = isMobile ? 0 : 25 * (1 - easedProgress);

  // Side text translates LEFT (more negative) as progress grows.
  // Desktop: starts at -25vw, ends at -100vw (off-screen left).
  // Mobile: stays at 0vw but fades out faster.
  const sideTextTranslateX = isMobile
    ? 0
    : -25 - 75 * easedProgress;
  // Side text opacity. Fully visible at progress 0, fully gone by
  // progress 0.6 (well before the trailing text appears at 0.85).
  const sideTextOpacity = Math.max(0, 1 - scrollProgress / 0.6);

  return (
    <div
      ref={sectionRef}
      className='scroll-expand-section'
    >
      {/* === SIDE TEXT (initial state, left of media) ===
          Absolutely positioned over the section. On desktop it's
          centered in the left half; translates further left and
          fades as the user scrolls. On mobile it's centered and
          just fades. */}
      <div
        className='scroll-expand-side-text'
        style={{
          transform: `translate(-50%, -50%) translateX(${sideTextTranslateX}vw)`,
          opacity: sideTextOpacity,
          // pointerEvents none once mostly faded to avoid blocking
          // clicks on the underlying video.
          pointerEvents: sideTextOpacity < 0.1 ? 'none' : 'auto',
        }}
      >
        {sideText}
      </div>

      {/* === MEDIA FRAME ===
          Absolutely positioned, centered at top-1/2 left-1/2.
          Width/height + translateX driven by progress. A teal
          border + glow keeps the small frame visible against the
          dark immersive background. */}
      <div
        className='scroll-expand-media-frame'
        style={{
          width: `${mediaWidth}px`,
          height: `${mediaHeight}px`,
          transform: `translate(-50%, -50%) translateX(${mediaTranslateX}vw)`,
        }}
      >
        {mediaType === 'video' ? (
          <>
            {/* Video element. Pattern intentionally mirrors PageHero.tsx
                which is the proven-working video implementation on
                /specialties/* pages. Key differences from the prior
                attempt:
                  - Uses <source src> as a child instead of the
                    video src attribute. Some browsers / Next.js
                    hydration paths fail to load video.src without
                    a <source> fallback.
                  - Inline width/height 100% via style prop, position
                    absolute, so the element fills its rounded parent
                    regardless of CSS-class specificity.
                  - Dropped disablePictureInPicture and
                    disableRemotePlayback — non-standard React props
                    that React serializes to attributes with empty
                    string values, which is fine for compliant browsers
                    but adds unknown surface area. Not needed for the
                    autoplay-loop-muted use case. */}
            <video
              autoPlay
              muted
              loop
              playsInline
              preload='auto'
              poster={posterSrc}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            >
              <source src={mediaSrc} type='video/mp4' />
            </video>
            {/* Dark overlay, lighter than the 21st.dev original so
                the small video frame is actually visible against the
                dark immersive page bg. Lightens further as the user
                expands (overlay opacity 0.35 → 0.1). */}
            <div
              className='scroll-expand-media-overlay'
              style={{ opacity: 0.35 - easedProgress * 0.25 }}
            />
          </>
        ) : (
          <>
            <Image
              src={mediaSrc}
              alt='Media'
              width={1280}
              height={720}
              className='scroll-expand-media-video'
            />
            <div
              className='scroll-expand-media-overlay'
              style={{ opacity: 0.4 - easedProgress * 0.3 }}
            />
          </>
        )}
      </div>

      {/* === TRAILING TEXT (below the expanded media) ===
          Fades in once progress >= 0.85. Sits below the fully
          expanded media so the user reads the paragraph after
          they've seen the video grow. */}
      <motion.div
        className='scroll-expand-trailing-text'
        initial={{ opacity: 0 }}
        animate={{ opacity: showTrailing ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {sideText}
      </motion.div>

      <style>{`
        .scroll-expand-section {
          position: relative;
          height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        /* Side text — absolutely centered then translated by
           inline style. The translate(-50%, -50%) on the wrapper
           anchors it visually so further translateX(N vw) moves
           it relative to that anchor.
           Width 40vw fits in the left half of the viewport with a
           bit of margin. Font is large so it's visible from the
           moment the section enters view. */
        .scroll-expand-side-text {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 40vw;
          font-size: clamp(20px, 2.4vw, 32px);
          font-weight: 300;
          line-height: 1.4;
          color: #fff;
          text-align: left;
          z-index: 5;
          will-change: transform, opacity;
        }

        /* Media frame — centered with translate. inline width/height
           override the placeholder values. */
        .scroll-expand-media-frame {
          position: absolute;
          top: 50%;
          left: 50%;
          max-width: 90vw;
          max-height: 65vh;
          border-radius: 16px;
          overflow: hidden;
          /* Teal border + glow so the small frame is visible against
             the dark immersive bg. */
          box-shadow:
            0 0 0 2px rgba(0, 181, 214, 0.55),
            0 0 40px rgba(0, 181, 214, 0.35),
            0 10px 60px rgba(0, 0, 0, 0.4);
          z-index: 3;
          will-change: transform, width, height;
        }
        .scroll-expand-media-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .scroll-expand-media-overlay {
          position: absolute;
          inset: 0;
          background: #000;
          pointer-events: none;
          will-change: opacity;
        }

        /* Trailing text — positioned just BELOW the fully-expanded
           media frame, not behind it. Frame is centered at top:50%
           with max-height 65vh, so its bottom edge sits at 82.5vh.
           Trailing text at top:85vh leaves a small visual gap and
           sits in the cleared bottom strip. */
        .scroll-expand-trailing-text {
          position: absolute;
          top: 85vh;
          left: 50%;
          transform: translateX(-50%);
          width: min(900px, 90vw);
          font-size: clamp(16px, 1.8vw, 22px);
          font-weight: 300;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.92);
          text-align: center;
          z-index: 5;
          pointer-events: none;
        }

        /* Mobile layout — vertical stack, no horizontal translate. */
        @media (max-width: 767px) {
          .scroll-expand-side-text {
            width: 88vw;
            top: 20%;
            text-align: center;
            font-size: 18px;
          }
          .scroll-expand-trailing-text {
            top: 86vh;
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollExpandMedia;
