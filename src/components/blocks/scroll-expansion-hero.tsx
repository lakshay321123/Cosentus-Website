'use client';

/**
 * ScrollExpandMedia
 *
 * Adapted from the 21st.dev scroll-driven hero. The expand animation
 * uses the original component's scroll-hijack mechanic (wheel/touch
 * preventDefault + scrollY lock) but gated on the section being IN
 * VIEWPORT. So:
 *   - Section not yet reached: user scrolls normally
 *   - Section reaches top of viewport: page FREEZES at that scroll
 *     position. Further wheel/touch input drives scrollProgress 0..1
 *     which expands the media. Page is not actually scrolling — it's
 *     locked.
 *   - Media fully expanded (progress = 1): lock releases. User
 *     scrolls normally to the next section.
 *   - User scrolls back up before fully expanded: progress can
 *     decrease back toward 0; if they reverse past the section top,
 *     lock releases and they can scroll normally.
 *   - User scrolls back UP through this section after full expansion:
 *     no re-lock. The animation stays at fully expanded.
 *
 * This is the user's option B from the design conversation: keep the
 * hijack effect but only when the section actually owns the viewport.
 * Per user direction the page-level ImmersiveVideoBackground shows
 * through where this component is transparent (no bgImageSrc passed).
 *
 * Props:
 *   mediaType       'video' | 'image'  (default 'video')
 *   mediaSrc        URL of the video file or image
 *   posterSrc       (optional) poster image for video
 *   bgImageSrc      (optional) Background image. Omit to render none.
 *   title           Title text — splits at first space into two
 *                   sibling H2 lines that animate apart
 *   date            (optional) eyebrow text above title
 *   scrollToExpand  (optional) helper text near the media
 *   textBlend       (optional) apply mix-blend-difference to title
 *   children        Renders below the media after full expansion
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
  bgImageSrc?: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  // Plain numeric scroll progress (0..1) driving all inline-style
  // math from the original spec (mediaWidth, mediaHeight, etc.).
  // This is the only piece of state that needs to trigger re-renders
  // (so the inline width/height styles update). Everything else is
  // tracked in refs to avoid stale closures in the event handlers.
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  // Whether to fade in the children block alongside the media.
  // Set true once progress >= 0.75 and stays true thereafter.
  const [showContent, setShowContent] = useState<boolean>(false);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  // Latest progress kept in a ref so the wheel/touch handler can
  // read it without re-binding listeners on every change.
  const progressRef = useRef<number>(0);
  // Once true, handlers no-op (hijack released). Once set, stays set.
  const expandedRef = useRef<boolean>(false);
  // Touch tracking ref so we don't re-attach listeners mid-gesture.
  const touchYRef = useRef<number>(0);

  // Helper: is the section currently "owning" the viewport?
  // Definition: section's top has reached or passed the viewport's
  // top (bounding rect top <= 0), AND its bottom hasn't yet passed
  // the viewport top (bounding rect bottom > 0). When true, the
  // section is occupying the screen and we should hijack scroll.
  const isSectionOwningViewport = (): boolean => {
    const el = sectionRef.current;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top <= 0 && rect.bottom > 0;
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Hijack only when section owns the viewport AND we're not
      // fully expanded yet. Anywhere else: let normal scroll happen.
      if (!isSectionOwningViewport()) return;
      if (expandedRef.current) return;

      // If user is scrolling UP and we're already at progress 0,
      // let them scroll out the top of the section. Otherwise
      // they'd be trapped.
      if (e.deltaY < 0 && progressRef.current <= 0) return;

      e.preventDefault();

      const scrollDelta = e.deltaY * 0.0009;
      const newProgress = Math.min(
        Math.max(progressRef.current + scrollDelta, 0),
        1
      );
      progressRef.current = newProgress;
      setScrollProgress(newProgress);

      if (newProgress >= 1) {
        expandedRef.current = true;
  
        setShowContent(true);
      } else if (newProgress >= 0.75) {
        setShowContent(true);
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

      // Allow scroll up out of section when progress is at 0.
      // deltaY < 0 means finger moved DOWN (scroll up gesture).
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
  
        setShowContent(true);
      } else if (newProgress >= 0.75) {
        setShowContent(true);
      }

      touchYRef.current = touchY;
    };

    const handleTouchEnd = (): void => {
      touchYRef.current = 0;

    };

    // Lock scroll position while the section owns the viewport and
    // expansion isn't done. Without this, momentum scroll on
    // trackpads can drift past preventDefault'd wheel events.
    const handleScroll = (): void => {
      if (!isSectionOwningViewport()) return;
      if (expandedRef.current) return;
      const el = sectionRef.current;
      if (!el) return;
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      // Pin scroll to the position where section top meets viewport top.
      if (Math.abs(window.scrollY - sectionTop) > 1) {
        window.scrollTo(0, sectionTop);
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
    // Empty deps: handlers read state via refs to avoid re-binding.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div
      ref={sectionRef}
      className='scroll-expand-section overflow-x-hidden'
    >
        {/* Background image overlay (optional). Only renders when
            bgImageSrc is supplied. The page-level
            ImmersiveVideoBackground sits behind us, so omitting this
            lets the page bg show through. */}
        {bgImageSrc && (
          <motion.div
            className='absolute inset-0 z-0 h-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <Image
              src={bgImageSrc}
              alt='Background'
              width={1920}
              height={1080}
              className='w-full h-full'
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              priority
            />
            <div className='absolute inset-0 bg-black/10' />
          </motion.div>
        )}

        <div className='container mx-auto flex flex-col items-center justify-center relative z-10 w-full h-full'>
          <div className='flex flex-col items-center justify-center w-full h-full relative'>
            <div
              className='absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-2xl'
              style={{
                width: `${mediaWidth}px`,
                height: `${mediaHeight}px`,
                maxWidth: '95vw',
                maxHeight: '85vh',
                boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.3)',
              }}
            >
              {mediaType === 'video' ? (
                mediaSrc.includes('youtube.com') ? (
                  <div className='relative w-full h-full pointer-events-none'>
                    <iframe
                      width='100%'
                      height='100%'
                      src={
                        mediaSrc.includes('embed')
                          ? mediaSrc +
                            (mediaSrc.includes('?') ? '&' : '?') +
                            'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                          : mediaSrc.replace('watch?v=', 'embed/') +
                            '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' +
                            mediaSrc.split('v=')[1]
                      }
                      className='w-full h-full rounded-xl'
                      frameBorder='0'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                    />
                    <div
                      className='absolute inset-0 z-10'
                      style={{ pointerEvents: 'none' }}
                    ></div>

                    <motion.div
                      className='absolute inset-0 bg-black/30 rounded-xl'
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                ) : (
                  <div className='relative w-full h-full pointer-events-none'>
                    <video
                      src={mediaSrc}
                      poster={posterSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload='auto'
                      className='w-full h-full object-cover rounded-xl'
                      controls={false}
                      disablePictureInPicture
                      disableRemotePlayback
                    />
                    <div
                      className='absolute inset-0 z-10'
                      style={{ pointerEvents: 'none' }}
                    ></div>

                    <motion.div
                      className='absolute inset-0 bg-black/30 rounded-xl'
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )
              ) : (
                <div className='relative w-full h-full'>
                  <Image
                    src={mediaSrc}
                    alt={title || 'Media content'}
                    width={1280}
                    height={720}
                    className='w-full h-full object-cover rounded-xl'
                  />

                  <motion.div
                    className='absolute inset-0 bg-black/50 rounded-xl'
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              )}

              <div className='flex flex-col items-center text-center relative z-10 mt-4 transition-none'>
                {date && (
                  <p
                    className='text-2xl text-blue-200'
                    style={{ transform: `translateX(-${textTranslateX}vw)` }}
                  >
                    {date}
                  </p>
                )}
                {scrollToExpand && (
                  <p
                    className='text-blue-200 font-medium text-center'
                    style={{ transform: `translateX(${textTranslateX}vw)` }}
                  >
                    {scrollToExpand}
                  </p>
                )}
              </div>
            </div>

            {/* Title halves animate apart horizontally as scroll
                progress increases (textTranslateX driven by progress) */}
            {title && (
              <div
                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col ${
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                }`}
              >
                <motion.h2
                  className='text-4xl md:text-5xl lg:text-6xl font-bold text-blue-200 transition-none'
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className='text-4xl md:text-5xl lg:text-6xl font-bold text-center text-blue-200 transition-none'
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>
            )}
          </div>

          {/* Children — fade in once we've crossed showContent
              threshold (75% scroll progress). Caller can pass a
              paragraph that surfaces alongside the fully-expanded
              media. */}
          {children && (
            <motion.section
              className='flex flex-col w-full px-8 py-10 md:px-16 lg:py-12 absolute bottom-0 left-0'
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          )}
        </div>

      {/* Section sizing. While the hijack is active (section owns
          the viewport and media is not fully expanded), the scroll
          handler pins window.scrollY to section-top. After full
          expansion the section behaves like any other 100vh section
          and the user scrolls past it normally. */}
      <style>{`
        .scroll-expand-section {
          position: relative;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default ScrollExpandMedia;
