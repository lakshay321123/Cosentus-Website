'use client';

/**
 * ScrollExpandMedia (modified for Cosentus)
 *
 * Originally a 21st.dev scroll-driven hero component. The original
 * version hijacked page scroll (via window.scrollTo(0,0) and wheel/
 * touch preventDefault) until the media was fully expanded — which
 * made it unusable as a mid-page section, only as the top-of-page
 * hero.
 *
 * Per user direction we modified the component to NOT hijack scroll
 * so it can live as a normal in-page section. The visual layout is
 * preserved (background image, media frame with rounded corners,
 * title text splitting, dark overlay, children content below) but
 * the scroll-driven expand animation is gone: media renders at full
 * size from mount, children are visible immediately. The component
 * no longer attaches any wheel/touch/scroll listeners.
 *
 * If you ever want the scroll-expand effect back, restore the
 * useEffect blocks deleted in this revision (see git history for
 * file at the parent commit's version) and put the component as
 * the very first thing on the page.
 *
 * Props:
 *   mediaType       'video' | 'image'  (default 'video')
 *   mediaSrc        URL of the video file or image
 *   posterSrc       (optional) poster image for video
 *   bgImageSrc      Background image, rendered behind the media
 *   title           Title text — splits at first space into two
 *                   sibling H2 lines
 *   date            (optional) eyebrow text above title
 *   scrollToExpand  Kept in the interface for backward compat but
 *                   no longer rendered (no scroll = nothing to
 *                   suggest)
 *   textBlend       (optional) apply mix-blend-difference to title
 *   children        Renders below the media
 */

import { ReactNode } from 'react';
import Image from 'next/image';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
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
  // scrollToExpand kept in destructure for backward compat but
  // intentionally unused — the scroll-to-expand affordance no
  // longer makes sense without the scroll-hijack mechanic.
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  // Hard-coded "fully expanded" state values. Original component
  // computed these from a `scrollProgress` (0..1) that drove the
  // expand animation. Now we just render at progress = 1.
  //   mediaWidth  = 300 + 1 * (mobile ? 650 : 1250)   → 1550 desktop, 950 mobile
  //   mediaHeight = 400 + 1 * (mobile ? 200 : 400)    → 800 desktop, 600 mobile
  //   textTranslateX = 0 (no animation)
  // We use responsive Tailwind/CSS instead of computing in JS so
  // there's no need for a window.innerWidth listener.

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div className='overflow-x-hidden'>
      <section className='relative flex flex-col items-center justify-start'>
        <div className='relative w-full flex flex-col items-center'>
          {/* Background image — full opacity (no scroll-driven fade) */}
          <div className='absolute inset-0 z-0 h-full'>
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
            />
            <div className='absolute inset-0 bg-black/10' />
          </div>

          <div className='container mx-auto flex flex-col items-center justify-start relative z-10 px-4 py-16 md:py-24'>
            <div className='flex flex-col items-center justify-center w-full relative'>
              {/* Media frame — sized via responsive CSS, not JS state.
                  Desktop: 1550x800 capped at 95vw / 85vh
                  Mobile : 950x600 capped at 95vw / 70vh */}
              <div
                className='relative rounded-2xl mx-auto'
                style={{
                  width: '100%',
                  maxWidth: '1550px',
                  aspectRatio: '1550 / 800',
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

                      {/* Static dark overlay at 0.2 (was animated from
                          0.5 down to 0.2 by scroll progress) */}
                      <div className='absolute inset-0 bg-black/20 rounded-xl' />
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

                      <div className='absolute inset-0 bg-black/20 rounded-xl' />
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

                    <div className='absolute inset-0 bg-black/40 rounded-xl' />
                  </div>
                )}

                {date && (
                  <div className='flex flex-col items-center text-center relative z-10 mt-4'>
                    <p className='text-2xl text-blue-200'>{date}</p>
                  </div>
                )}
              </div>

              {/* Title block — sits BELOW the media now (no horizontal
                  animation). Split title still kept in case a caller
                  uses an overlapping visual layout, but here both
                  halves render inline on the same baseline. */}
              {title && (
                <div
                  className={`flex items-center justify-center text-center gap-3 w-full relative z-10 flex-wrap mt-8 ${
                    textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                  }`}
                >
                  <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-blue-200'>
                    {firstWord}
                  </h2>
                  <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-center text-blue-200'>
                    {restOfTitle}
                  </h2>
                </div>
              )}
            </div>

            {/* Children content — always visible now (was opacity-0
                until mediaFullyExpanded). */}
            {children && (
              <section className='flex flex-col w-full px-4 md:px-8 lg:px-16 py-10 lg:py-16'>
                {children}
              </section>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
