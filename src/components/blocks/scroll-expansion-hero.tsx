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
  // Once true, the trailing paragraph (below the expanded video)
  // fades in. Set when progress >= 0.85 and never resets back to
  // false (avoids flicker if user reverses scroll near the threshold).
  const [showTrailing, setShowTrailing] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  // Refs for state read inside handlers (avoids stale closures
  // without re-binding listeners on every render).
  const progressRef = useRef<number>(0);
  const expandedRef = useRef<boolean>(false);
  const touchYRef = useRef<number>(0);

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
        setShowTrailing(true);
      } else if (newProgress >= 0.85) {
        setShowTrailing(true);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSectionOwningViewport()) return;
      if (expandedRef.current) return;
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
        setShowTrailing(true);
      } else if (newProgress >= 0.85) {
        setShowTrailing(true);
      }

      touchYRef.current = touchY;
    };

    const handleTouchEnd = (): void => {
      touchYRef.current = 0;
    };

    // Pin scroll position to section-top while hijack is active.
    // Without this, momentum scroll (trackpad inertia) drifts past
    // preventDefault'd wheel events.
    const handleScroll = (): void => {
      if (!isSectionOwningViewport()) return;
      if (expandedRef.current) return;
      const el = sectionRef.current;
      if (!el) return;
      const sectionTopAbsolute =
        el.getBoundingClientRect().top + window.scrollY;
      if (Math.abs(window.scrollY - sectionTopAbsolute) > 1) {
        window.scrollTo(0, sectionTopAbsolute);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
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
    ? 300 + easedProgress * 600  // 300 → 900 (will be clamped by maxWidth 95vw)
    : 600 + easedProgress * 950; // 600 → 1550
  const mediaHeight = isMobile
    ? 220 + easedProgress * 320 // 220 → 540
    : 400 + easedProgress * 400; // 400 → 800

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
            <video
              src={mediaSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              preload='auto'
              className='scroll-expand-media-video'
              disablePictureInPicture
              disableRemotePlayback
            />
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
          max-width: 95vw;
          max-height: 85vh;
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

        /* Trailing text — sits at the bottom-ish of the section,
           visible only after expansion completes. */
        .scroll-expand-trailing-text {
          position: absolute;
          bottom: 8vh;
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
            bottom: 5vh;
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollExpandMedia;
