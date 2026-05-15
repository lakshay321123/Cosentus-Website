'use client';

/**
 * ScrollExpandMedia
 *
 * Adapted from a 21st.dev scroll-driven hero component. The original
 * version hijacked page scroll (window.scrollTo(0,0) + wheel/touch
 * preventDefault) until the media was fully expanded — which forced
 * it to live as the FIRST section on the page or it would lock
 * users at scroll 0 forever.
 *
 * Per user direction (option C), the hijack is gone. The expand
 * animation is now driven by the section's OWN scroll position via
 * framer-motion's useScroll hook with an offset range. Users scroll
 * the page normally; as this section passes through the viewport,
 * scrollYProgress rises from 0 to 1 and the media grows. After full
 * expansion the user keeps scrolling normally into the next section.
 *
 * The dependent calculations (mediaWidth, mediaHeight, textTranslateX,
 * overlay opacity, etc.) still use a plain numeric `scrollProgress`
 * state (0..1) that mirrors scrollYProgress. This keeps all the
 * inline-style math from the original component unchanged.
 *
 * Also: bgImageSrc is now optional. Omit it and no background image
 * is rendered behind the media — lets the page-level
 * ImmersiveVideoBackground show through cleanly.
 *
 * Props:
 *   mediaType       'video' | 'image'  (default 'video')
 *   mediaSrc        URL of the video file or image
 *   posterSrc       (optional) poster image for video
 *   bgImageSrc      (optional) Background image, fades out as media
 *                   expands. Omit to render no background.
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
import { motion, useScroll } from 'framer-motion';

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
  // Plain numeric scroll progress (0..1) used by all downstream
  // inline-style math (mediaWidth, mediaHeight, textTranslateX,
  // overlay opacity). Mirrors framer-motion's scrollYProgress so
  // we don't have to rewrite the math to operate on MotionValues.
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  // Whether to fade in the children block below the media. True once
  // the section is mostly through its scroll range (>=0.75). Once
  // set true it stays true — no flicker if the user scrolls back.
  const [showContent, setShowContent] = useState<boolean>(false);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Map scroll position to a 0..1 progress value.
  //
  // The section is 200vh tall (set via .scroll-expand-section CSS
  // below). Inside it, a 100vh sticky container holds the centered
  // media. This is a classic scroll-pin pattern: media stays
  // centered in viewport while user scrolls through the section.
  //
  // Offset interpretation with target=200vh section:
  //   'start end'   — section's TOP just touched viewport's BOTTOM
  //                   (section starting to enter, media at smallest)
  //   'center start' — section's CENTER (=100vh down) aligned with
  //                   viewport's TOP. Media should be fully expanded
  //                   by this point. The remaining 100vh of section
  //                   gives the user a "rest period" with the media
  //                   pinned and fully expanded before they scroll
  //                   it away.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center start'],
  });

  useEffect(() => {
    // Subscribe to scrollYProgress changes and copy them into local
    // state. Keeping a plain number (not a MotionValue) lets the
    // rest of the component use vanilla inline-style math from the
    // original spec without rewriting it for motion values.
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollProgress(latest);
      if (latest >= 0.75) {
        setShowContent(true);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

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
      <div className='scroll-expand-sticky'>
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
      </div>

      {/* Section sizing + sticky pinning. .scroll-expand-section is
          200vh tall so that one viewport-height of scroll drives the
          expand animation, and a second viewport-height of scroll
          provides a "rest period" with the media fully expanded
          before the section moves out of view. */}
      <style>{`
        .scroll-expand-section {
          position: relative;
          height: 200vh;
        }
        .scroll-expand-sticky {
          position: sticky;
          top: 0;
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
