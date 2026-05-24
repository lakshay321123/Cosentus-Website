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
  /**
   * 'video'  — plays a looping <video>. Existing default path.
   * 'image'  — renders a single Next.js <Image>.
   * 'custom' — renders the customMedia ReactNode (or render-prop)
   *            inside the expanding frame. Used by the homepage
   *            workflow animation so the SVG composite can be the
   *            small-state preview AND the expanded animation
   *            trigger lives inside the same frame.
   */
  mediaType?: 'video' | 'image' | 'custom';
  mediaSrc?: string;
  posterSrc?: string;
  sideText: ReactNode;
  /**
   * Only used when mediaType === 'custom'. Either a ReactNode or a
   * render-prop that receives the live expansion state. The
   * render-prop form lets the child trigger its own animation when
   * `isExpanded` flips true (progress hits 1).
   */
  customMedia?: ReactNode | ((args: { isExpanded: boolean; progress: number }) => ReactNode);
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  sideText,
  customMedia,
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
  // rAF id for the auto-expand progress animation triggered by the
  // first forward scroll/touch/key input. Stored on a ref so the
  // cleanup effect can cancel it on unmount.
  const autoExpandRafRef = useRef<number | null>(null);
  // Latches true the moment startAutoExpand begins. Distinct from
  // expandedRef (which only flips true when the FULL animation —
  // frame growth AND the child's workflow reveal — has completed,
  // at which point scroll is released). animationStartedRef lets
  // the wheel/touch/key handlers know "auto-expand already in
  // progress, do nothing more, just consume the event".
  const animationStartedRef = useRef<boolean>(false);
  // Timeout id for the scroll-lock release. Cleared on unmount or
  // when the user skips via Escape / click on the section
  // backdrop.
  const lockReleaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lock budget = frame growth + workflow reveal animation.
  //   Frame growth (this component, rAF):      800ms
  //   Workflow reveal (WorkflowAnimation):    11500ms
  //     (piece 1 fade 0-2000, piece 2 fade 1000-3000, then
  //      pieces 3-13 staggered every 750ms with 1500ms fades
  //      through piece 13 finishing at 10000+1500 = 11500ms)
  //   Buffer for React render latency:        200ms
  //   --------------------------------------------------
  //   Total scroll lock:                      12500ms
  const SCROLL_LOCK_MS = 12500;

  /**
   * Drive scrollProgress from its current value to 1.0 over 800ms
   * with an ease-out cubic curve, then HOLD the scroll lock for
   * the duration of the child's workflow reveal animation.
   *
   * Called when the user makes ANY forward scroll/touch/key input
   * in the section. Once started, subsequent inputs are consumed
   * (via preventDefault in the handlers) but do not advance or
   * restart anything — the frame stays pinned and the animation
   * plays through. After SCROLL_LOCK_MS, expandedRef flips true
   * and native scroll is released.
   *
   * Why rAF instead of CSS transition:
   *   The component has SEVERAL progress-derived values (frame
   *   width/height, side-text opacity, ratings-strip opacity,
   *   transform translateX, sidetext translateX). Driving
   *   scrollProgress smoothly via rAF means all of them animate
   *   together coherently — no per-property transitions needed
   *   and no risk of one property leading or trailing another.
   *
   * Why hold the lock through the full reveal:
   *   User direction 2026-05-24: "the frame should remain the
   *   entire frame ... only once the video is finished should
   *   the person be able to go down". Previously the lock was
   *   released as soon as the rAF finished, which let the user
   *   scroll the frame away mid-animation. Now it stays pinned
   *   for the full ~12.5s while the workflow plays.
   *
   * Skip valve: Escape key or click on the section backdrop calls
   * releaseLockEarly() to free the scroll immediately. This is the
   * accessibility escape hatch for keyboard users / power users
   * who don't want to wait through the full animation.
   */
  const startAutoExpand = (): void => {
    if (animationStartedRef.current) return;
    animationStartedRef.current = true;
    const fromProgress = progressRef.current;
    const targetProgress = 1;
    const duration = 800; // ms — frame-growth portion only
    const startTime = performance.now();
    const step = (now: number): void => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // ease-out cubic — fast start, gentle finish
      const eased = 1 - Math.pow(1 - t, 3);
      const p = fromProgress + (targetProgress - fromProgress) * eased;
      progressRef.current = p;
      setScrollProgress(p);
      if (t < 1) {
        autoExpandRafRef.current = requestAnimationFrame(step);
      } else {
        autoExpandRafRef.current = null;
      }
    };
    autoExpandRafRef.current = requestAnimationFrame(step);

    // Hold the scroll lock until the child's reveal animation
    // completes too.
    lockReleaseTimeoutRef.current = setTimeout(() => {
      expandedRef.current = true;
      lockReleaseTimeoutRef.current = null;
    }, SCROLL_LOCK_MS);
  };

  /**
   * Release the scroll lock immediately, skipping the remainder
   * of the workflow animation. Triggered by Escape key or click
   * on the section backdrop. No-op if not started or already
   * released.
   */
  const releaseLockEarly = (): void => {
    if (!animationStartedRef.current) return;
    if (expandedRef.current) return;
    expandedRef.current = true;
    if (lockReleaseTimeoutRef.current !== null) {
      clearTimeout(lockReleaseTimeoutRef.current);
      lockReleaseTimeoutRef.current = null;
    }
  };

  // The site's main nav (Navbar.tsx) is position:fixed at top:0
  // with padding ~16px and a 38px logo = ~70-80px total height.
  // When the section locks at rect.top = 0 the fixed nav visually
  // overlaps the section's upper portion. To leave the nav fully
  // visible above the locked section, the lock targets rect.top =
  // NAVBAR_OFFSET (~80px) instead of 0. Both the "owns viewport"
  // predicate AND the handleScroll snap-back use this offset.
  // User direction 2026-05-24: "the lock is slightly off because
  // the header is sitting on top of it. It should be a little
  // lower."
  const NAVBAR_OFFSET = 80;

  // Section is "owning the viewport" when its top has reached
  // NAVBAR_OFFSET (i.e. the top edge is at or above where the
  // fixed navbar ends) AND the bottom still extends past that
  // point. In that state the hijack engages and the snap-back
  // pins the section at rect.top = NAVBAR_OFFSET.
  const isSectionOwningViewport = (): boolean => {
    const el = sectionRef.current;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top <= NAVBAR_OFFSET && rect.bottom > NAVBAR_OFFSET;
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
      // First forward wheel triggers the auto-expand + scroll lock.
      // Subsequent wheels during the lock no-op (startAutoExpand's
      // internal guard handles re-entry) but are still consumed by
      // the preventDefault above, so the page stays pinned. The
      // lock releases after SCROLL_LOCK_MS (12.5s) — by then both
      // the frame growth and the workflow reveal have completed.
      // User direction 2026-05-24: "the frame should remain the
      // entire frame ... only once the video is finished should the
      // person be able to go down."
      startAutoExpand();
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
      // Any forward swipe (deltaY > 0 = finger moving up = scroll
      // down) snaps progress to 1 via auto-expand. Mirror of the
      // wheel handler's behavior. Backward swipes from progress 0
      // already exited above; nothing else needed for them since
      // expandedRef flips true the moment auto-expand starts.
      if (deltaY > 0) {
        startAutoExpand();
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

      // Escape key: accessibility / power-user skip. If the
      // animation has started but the lock is still holding scroll,
      // release immediately. Documented behavior — Escape always
      // means "I want out". On mobile there's no Escape; mobile
      // users wait through the ~12s reveal (a separate skip UI
      // would be needed for touch-only users; not added yet).
      if (e.key === 'Escape') {
        if (animationStartedRef.current && !expandedRef.current) {
          e.preventDefault();
          releaseLockEarly();
        }
        return;
      }

      // Classify the key as forward (advances toward expansion),
      // backward (would have retreated), or unrelated. Forward keys
      // all trigger the auto-expand animation. Backward keys at
      // progress=0 exit the section upward (unchanged from before).
      let direction: 'forward' | 'backward' | null = null;
      switch (e.key) {
        case ' ':
        case 'Spacebar': // legacy
        case 'PageDown':
        case 'ArrowDown':
        case 'End':
          direction = 'forward';
          break;
        case 'PageUp':
        case 'ArrowUp':
        case 'Home':
          direction = 'backward';
          break;
        default:
          return; // not a key we care about
      }

      // Allow scroll-up to exit top of section when already at 0,
      // mirroring the wheel handler's behavior.
      if (direction === 'backward' && progressRef.current <= 0) return;

      e.preventDefault();
      if (direction === 'forward') {
        // Any forward key snaps progress to 1 via auto-expand —
        // matches wheel/touch behavior. Previously keys had per-key
        // step sizes (PageDown=0.35, ArrowDown=0.15, etc.); user
        // direction 2026-05-24 was to always reach full size on
        // first input, so step granularity is no longer needed.
        startAutoExpand();
      }
      // Backward keys after auto-expand started: expandedRef is
      // true, the handler returned at the top. Nothing to do here.
    };

    // Pin scroll position so the section's TOP sits at viewport
    // y = NAVBAR_OFFSET (just below the fixed navbar). Without this,
    // momentum scroll (trackpad inertia) drifts past preventDefault'd
    // wheel events.
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
      // Scroll target = section's absolute Y minus NAVBAR_OFFSET so
      // the section's rect.top settles at NAVBAR_OFFSET (not 0),
      // leaving the fixed navbar visible above.
      const snapTargetScrollY = sectionTopAbsolute - NAVBAR_OFFSET;
      if (Math.abs(window.scrollY - snapTargetScrollY) > 1) {
        window.scrollTo(0, snapTargetScrollY);
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
      // Cancel the auto-expand rAF if it's still running when the
      // component unmounts (e.g. user navigated to a different
      // route mid-animation).
      if (autoExpandRafRef.current !== null) {
        cancelAnimationFrame(autoExpandRafRef.current);
        autoExpandRafRef.current = null;
      }
      // Clear the scroll-lock release timeout. Without this, an
      // unmount in the middle of the ~12.5s lock window would let
      // the timeout fire later and try to set expandedRef.current
      // on a dead ref — harmless but noisy in dev.
      if (lockReleaseTimeoutRef.current !== null) {
        clearTimeout(lockReleaseTimeoutRef.current);
        lockReleaseTimeoutRef.current = null;
      }
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
    ? 240 + easedProgress * 100  // 240 → 340 (vertical-friendly)
    : 700 + easedProgress * 1000; // 700 → 1700 (bumped from 600→1200
                                  //              May 2026 per user
                                  //              feedback "screen is
                                  //              too narrow". Caps at
                                  //              the 95vw max-width
                                  //              defined in the
                                  //              .scroll-expand-media-
                                  //              frame CSS, so on
                                  //              smaller viewports
                                  //              it fits naturally.)
  const mediaHeight = isMobile
    ? 300 + easedProgress * 220 // 300 → 520 (taller-than-wide so a
                                //              9:16 vertical video
                                //              swap renders without
                                //              letterboxing)
    : 500 + easedProgress * 500; // 500 → 1000 (bumped from 400→600
                                 //              for the same reason
                                 //              as mediaWidth. Caps
                                 //              at 85vh in CSS.)

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
              {mediaSrc && <source src={mediaSrc} type='video/mp4' />}
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
        ) : mediaType === 'image' ? (
          <>
            {mediaSrc && (
              <Image
                src={mediaSrc}
                alt='Media'
                width={1280}
                height={720}
                className='scroll-expand-media-video'
              />
            )}
            <div
              className='scroll-expand-media-overlay'
              style={{ opacity: 0.4 - easedProgress * 0.3 }}
            />
          </>
        ) : (
          // mediaType === 'custom'
          // The child component fills the frame. We pass progress and
          // an isExpanded flag (progress >= 0.995) so the child can
          // start any one-time animation when the frame finishes
          // growing. The 0.995 threshold leaves a tiny margin so the
          // animation fires reliably at the visual end of expansion,
          // not exactly at 1.0 (which can be a transient state).
          //
          // No overlay div for custom mode — the WorkflowAnimation
          // child paints its own white background so dark overlay
          // would muddy the SVGs.
          <>
            {typeof customMedia === 'function'
              ? customMedia({ isExpanded: scrollProgress >= 0.995, progress: scrollProgress })
              : customMedia}
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
           override the placeholder values.

           Max-width/height bumped twice in May 2026 to give the
           workflow animation more room:
             - Initial:  90vw / 65vh
             - 1st bump: 95vw / 85vh
             - 2nd bump: 97vw / 92vh  (per user feedback "increase
                         the size of this window" + "it's touching
                         at the bottom also")

           Aspect ratio of the workflow content is ~1.39:1 (viewBox
           -180 -50 2080 1500 → 2080/1500). The inline growth
           (700px -> 1700px wide, 500px -> 1000px tall) hits the
           viewport caps on smaller screens but scales properly on
           larger displays. */
        .scroll-expand-media-frame {
          position: absolute;
          top: 50%;
          left: 50%;
          max-width: 97vw;
          max-height: 92vh;
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
          /* Cut the section's reserved height from a full viewport
             to 70vh so the post-expansion empty space below the
             video doesn't leave a giant dead zone before the next
             section. The scroll-hijack mechanism is unaffected: it
             owns the viewport via isSectionOwningViewport (top<=0
             && bottom>0) and snaps the page back to the section's
             top during expansion, so the absolute scroll distance
             of the section doesn't drive the hijack. Section height
             only affects the empty bottom strip seen after release.

             Per user direction: "after the video, there is too much
             of a gap here". 30vh of dead space recovered. */
          .scroll-expand-section {
            height: 70vh;
            /* overflow: visible on mobile because the trailing text
               (below) is positioned outside the section's vertical
               bounds. With the base overflow:hidden it would be
               clipped. Side text on mobile is positioned at top:20%
               width:88vw without horizontal translate (mobile uses
               vertical layout, per the rule below), so nothing else
               needs the section to clip. */
            overflow: visible;
          }
          .scroll-expand-side-text {
            width: 88vw;
            top: 20%;
            text-align: center;
            font-size: 18px;
          }
          /* Media frame on mobile — vertical-aspect-friendly.
             max-width 80vw + max-height 60vh creates a taller-than-
             wide envelope. When the current horizontal DNA video is
             swapped for the upcoming vertical (9:16) video, the new
             asset will fill the frame naturally with no letterboxing
             — object-fit:cover already handles aspect crop for the
             interim horizontal source.

             Per user direction: "I think there will be a vertical
             video, so you can create it in a way that it becomes
             vertical". */
          .scroll-expand-media-frame {
            max-width: 80vw;
            max-height: 60vh;
          }
          .scroll-expand-trailing-text {
            /* Was top: 86vh — that worked when the section was 100vh
               (text inside, near the bottom). The section is now 70vh
               on mobile, so 86vh puts the text 16vh BELOW the section
               with overflow:hidden clipping it. Anchor the text to
               the section's bottom edge instead — 12px gap below the
               section, sitting in the breathing room before the next
               section starts. */
            top: calc(100% + 12px);
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollExpandMedia;
